from typing import List
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, HTTPException
from ..repositories.order import OrderRepository
from ..repositories.base import BaseRepository
from ..models.order import Order, OrderItem
from ..models.banner import BannerConfig
from ..schemas.banner import PriceCalculationRequest
from .email import EmailService
import json

class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.banner_repo = BaseRepository(BannerConfig, db)
        self.email_service = EmailService()
    
    def calculate_price(self, config: PriceCalculationRequest) -> Decimal:
        """Calculate banner price in INR for Indian standard sizes."""
        area = (config.width_cm * config.height_cm) / 10000  # Convert to square meters
        
        # Indian banner pricing in INR per sqm
        if area <= 0.5:  # Small banners
            base_rate = Decimal("800.00")  # ₹800 per sqm
        elif area <= 2.0:  # Medium banners
            base_rate = Decimal("600.00")  # ₹600 per sqm
        elif area <= 5.0:  # Large banners
            base_rate = Decimal("450.00")  # ₹450 per sqm
        else:  # Extra large banners
            base_rate = Decimal("350.00")  # ₹350 per sqm
        
        base_price = Decimal(str(area)) * base_rate
        
        # Material multipliers for Indian market
        material_multipliers = {
            "vinyl": Decimal("1.0"),
            "flex": Decimal("0.8"),  # Cheaper flex material
            "fabric": Decimal("1.4"),
            "mesh": Decimal("1.2")
        }
        base_price *= material_multipliers.get(config.material, Decimal("1.0"))
        
        # Add-ons in INR
        if config.grommets:
            base_price += Decimal("200.00")  # ₹200 for grommets
        if config.lamination:
            base_price += Decimal("300.00")  # ₹300 for lamination
        
        # Minimum price ₹150
        final_price = max(base_price, Decimal("150.00"))
        
        if final_price <= 0:
            raise HTTPException(status_code=400, detail="Invalid price calculation")
        
        return final_price
    
    async def create_order(self, user_id: str, items_data: List[dict], files: List[UploadFile], contact_number: str = None) -> Order:
        """Create a new order with items and contact number."""
        if len(items_data) != len(files):
            raise HTTPException(status_code=400, detail="Mismatch between items and files")
        
        # Use mock contact number for testing
        if not contact_number:
            contact_number = "+91-9876543210"
        
        total_price = Decimal("0.00")
        order_items = []
        
        # Calculate total price first
        for item_data in items_data:
            config_data = item_data.get("config", {})
            if isinstance(config_data, str):
                config_data = json.loads(config_data)
            
            width_cm = config_data.get("widthCm") or config_data.get("width_cm")
            height_cm = config_data.get("heightCm") or config_data.get("height_cm")
            
            if not width_cm or not height_cm:
                raise HTTPException(status_code=400, detail=f"Missing width_cm or height_cm in config: {config_data}")
            
            backend_config = {
                "width_cm": width_cm,
                "height_cm": height_cm,
                "material": config_data.get("material"),
                "grommets": config_data.get("grommets", False),
                "lamination": config_data.get("lamination", False)
            }
            
            price_request = PriceCalculationRequest(**backend_config)
            item_price = self.calculate_price(price_request)
            total_price += item_price
        
        # Validate total price
        if total_price <= 0:
            raise HTTPException(status_code=400, detail="Order total must be greater than zero")
        
        # Create order with calculated total and contact number
        order = Order(user_id=user_id, total_price=total_price, contact_number=contact_number)
        order = await self.order_repo.create(order)
        
        # Process each item (no file storage)
        for i, (item_data, file) in enumerate(zip(items_data, files)):
            config_data = item_data.get("config", {})
            if isinstance(config_data, str):
                config_data = json.loads(config_data)
            
            width_cm = config_data.get("widthCm") or config_data.get("width_cm")
            height_cm = config_data.get("heightCm") or config_data.get("height_cm")
            
            backend_config = {
                "width_cm": width_cm,
                "height_cm": height_cm,
                "material": config_data.get("material"),
                "grommets": config_data.get("grommets", False),
                "lamination": config_data.get("lamination", False)
            }
            
            price_request = PriceCalculationRequest(**backend_config)
            item_price = self.calculate_price(price_request)
            
            # Create banner config
            banner_config = BannerConfig(
                width_cm=backend_config["width_cm"],
                height_cm=backend_config["height_cm"],
                material=backend_config["material"],
                grommets=backend_config["grommets"],
                lamination=backend_config["lamination"],
                calculated_price=item_price
            )
            banner_config = await self.banner_repo.create(banner_config)
            
            # Create order item (no file reference)
            order_item = OrderItem(
                order_id=order.id,
                banner_config_id=banner_config.id,
                file_record_id=None,  # No file storage
                price=item_price
            )
            order_items.append(order_item)
        
        # Add items to order
        for item in order_items:
            self.db.add(item)
        
        await self.db.commit()
        await self.db.refresh(order)
        
        return order
    
    async def get_user_orders(self, user_id: str) -> List[Order]:
        """Get all orders for a user."""
        return await self.order_repo.get_user_orders(user_id)
    
    async def get_all_orders(self) -> List[Order]:
        """Get all orders (admin only)."""
        return await self.order_repo.get_all_orders()
    
    async def update_order_status(self, order_id: str, status: str) -> Order:
        """Update order status."""
        order = await self.order_repo.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.status = status
        await self.db.commit()
        await self.db.refresh(order)
        return order
    
    async def send_order_email(self, order: Order, user_name: str, user_email: str, files: List[UploadFile]) -> bool:
        """Send order details and files via email."""
        try:
            order_data = {
                'order_id': order.id,
                'customer_name': user_name,
                'customer_email': user_email,
                'contact_number': order.contact_number,
                'total_price': float(order.total_price),
                'items': []
            }
            
            # Get order items with banner configs
            order_with_items = await self.order_repo.get_with_items(str(order.id))
            for item in order_with_items.items:
                order_data['items'].append({
                    'width_cm': item.banner_config.width_cm,
                    'height_cm': item.banner_config.height_cm,
                    'material': item.banner_config.material,
                    'grommets': item.banner_config.grommets,
                    'lamination': item.banner_config.lamination,
                    'price': float(item.price)
                })
            
            return await self.email_service.send_order_email(order_data, files)
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False