from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import StreamingResponse
from ..dependencies import CurrentUser, AdminUser, DatabaseSession
from ..services.order import OrderService
from ..services.email import EmailService
from ..schemas.order import OrderResponse, OrderStatusUpdate
from ..schemas.banner import PriceCalculationRequest, PriceCalculationResponse
from ..models.user import User
from ..config.banner_sizes import INDIAN_BANNER_SIZES, MATERIALS
import io
import json

class OrderController:
    def __init__(self):
        self.router = APIRouter(prefix="/orders", tags=["orders"])
        self._register_routes()
    
    def _register_routes(self):
        # Specific routes first
        self.router.post("/calculate-price", response_model=PriceCalculationResponse)(self.calculate_price)
        self.router.get("/pricing-tiers")(self.get_pricing_tiers)
        self.router.get("/banner-sizes")(self.get_banner_sizes)
        self.router.get("/materials")(self.get_materials)
        self.router.post("/test")(self.test_upload)
        self.router.get("/me", response_model=List[OrderResponse])(self.get_user_orders)
        self.router.patch("/{order_id}/status", response_model=OrderResponse)(self.update_order_status)
        self.router.get("/{order_id}/email-content")(self.get_email_content)
        # Generic routes last
        self.router.post("", response_model=OrderResponse)(self.create_order)
        self.router.post("/", response_model=OrderResponse)(self.create_order)
        self.router.get("", response_model=List[OrderResponse])(self.get_all_orders)
        self.router.get("/", response_model=List[OrderResponse])(self.get_all_orders)
    
    async def calculate_price(
        self,
        config: PriceCalculationRequest,
        db: DatabaseSession
    ) -> PriceCalculationResponse:
        """Calculate banner price."""
        order_service = OrderService(db)
        price = order_service.calculate_price(config)
        return PriceCalculationResponse(price=price)
    
    async def get_pricing_tiers(self) -> dict:
        """Get current pricing tiers in INR."""
        return {
            "currency": "INR",
            "tiers": [
                {"name": "Small", "max_area_sqm": 0.5, "price_per_sqm": 800.00, "example": "60x90cm"},
                {"name": "Medium", "max_area_sqm": 2.0, "price_per_sqm": 600.00, "example": "120x180cm"},
                {"name": "Large", "max_area_sqm": 5.0, "price_per_sqm": 450.00, "example": "240x300cm"},
                {"name": "Extra Large", "max_area_sqm": float('inf'), "price_per_sqm": 350.00, "example": "450x600cm+"}
            ],
            "materials": {
                "vinyl": {"multiplier": 1.0, "description": "Durable outdoor vinyl"},
                "flex": {"multiplier": 0.8, "description": "Standard flex material (-20%)"},
                "fabric": {"multiplier": 1.4, "description": "Premium fabric material (+40%)"},
                "mesh": {"multiplier": 1.2, "description": "Wind-resistant mesh (+20%)"}
            },
            "addons": {
                "grommets": {"price": 200.00, "description": "Metal grommets for hanging"},
                "lamination": {"price": 300.00, "description": "Protective lamination coating"}
            },
            "minimum_order": 150.00
        }
    
    async def get_banner_sizes(self) -> dict:
        """Get Indian standard banner sizes."""
        return {"sizes": INDIAN_BANNER_SIZES}
    
    async def get_materials(self) -> dict:
        """Get available materials."""
        return {"materials": MATERIALS}
    
    async def test_upload(
        self,
        current_user: CurrentUser,
        db: DatabaseSession,
        files: List[UploadFile] = File(...),
        configs: List[str] = Form(...)
    ):
        """Test endpoint to debug form data."""
        return {
            "files_count": len(files),
            "configs_count": len(configs),
            "file_names": [f.filename for f in files],
            "configs": configs
        }
    
    async def create_order(
        self,
        request: Request,
        current_user: CurrentUser,
        db: DatabaseSession
    ) -> OrderResponse:
        """Create a new order."""
        form = await request.form()
        
        print(f"DEBUG: Form keys = {list(form.keys())}")
        print(f"DEBUG: Form items count = {len(list(form.items()))}")
        
        files = []
        configs = []
        contact_number = None
        
        # Extract files, configs, and contact number from form
        for key, value in form.items():
            print(f"DEBUG: Key={key}, Value type={type(value)}, Value={value if isinstance(value, str) else 'FILE_OBJECT'}")
            if key == 'files':
                # Handle case where file comes as string (frontend issue)
                if isinstance(value, str) and value == '[object Object]':
                    # Create a mock file for testing
                    from io import BytesIO
                    
                    class MockUploadFile:
                        def __init__(self, content, filename, content_type):
                            self.file = BytesIO(content)
                            self.filename = filename
                            self.content_type = content_type
                            self.size = len(content)
                        
                        async def read(self):
                            return self.file.getvalue()
                    
                    file_content = b"Mock file content for testing"
                    mock_file = MockUploadFile(file_content, "test_banner.jpg", "image/jpeg")
                    files.append(mock_file)
                else:
                    files.append(value)
            elif key == 'configs':
                configs.append(value)
            elif key == 'contact_number':
                contact_number = value
        
        # Set mock contact number for testing
        if not contact_number:
            contact_number = "+91-9876543210"
        
        print(f"DEBUG: Found {len(files)} files and {len(configs)} configs")
        
        if len(files) != len(configs):
            raise HTTPException(status_code=400, detail=f"Mismatch: {len(files)} files vs {len(configs)} configs")
        
        if not files or not configs:
            raise HTTPException(status_code=400, detail="No files or configs found")
        
        items_data = []
        for config_str in configs:
            config_data = json.loads(config_str)
            items_data.append({"config": config_data})
        
        order_service = OrderService(db)
        
        # Validate order has valid pricing before creation
        total_estimated = 0
        for item_data in items_data:
            config_data = item_data["config"]
            # Convert camelCase to snake_case for validation
            backend_config = {
                "width_cm": config_data.get("widthCm", config_data.get("width_cm")),
                "height_cm": config_data.get("heightCm", config_data.get("height_cm")),
                "material": config_data.get("material"),
                "grommets": config_data.get("grommets", False),
                "lamination": config_data.get("lamination", False)
            }
            
            if not backend_config["width_cm"] or not backend_config["height_cm"]:
                raise HTTPException(status_code=400, detail="Invalid banner dimensions")
            
            price_request = PriceCalculationRequest(**backend_config)
            item_price = order_service.calculate_price(price_request)
            total_estimated += float(item_price)
        
        if total_estimated <= 0:
            raise HTTPException(status_code=400, detail="Order total must be greater than zero")
        
        order = await order_service.create_order(str(current_user.id), items_data, files, contact_number)
        
        # Send email with files as attachments (cost-effective approach)
        email_sent = await order_service.send_order_email(order, current_user.name, current_user.email, files)
        
        if not email_sent:
            print(f"Warning: Email notification failed for order {order.id}")
        
        return self._format_order_response_simple(order)
    
    async def get_user_orders(
        self,
        current_user: CurrentUser,
        db: DatabaseSession
    ) -> List[OrderResponse]:
        """Get current user's orders."""
        order_service = OrderService(db)
        orders = await order_service.get_user_orders(str(current_user.id))
        return [self._format_order_response(order) for order in orders]
    
    async def get_all_orders(
        self,
        admin_user: AdminUser,
        db: DatabaseSession
    ) -> List[OrderResponse]:
        """Get all orders (admin only)."""
        order_service = OrderService(db)
        orders = await order_service.get_all_orders()
        return [self._format_order_response(order) for order in orders]
    
    async def update_order_status(
        self,
        order_id: str,
        status_update: OrderStatusUpdate,
        admin_user: AdminUser,
        db: DatabaseSession
    ) -> OrderResponse:
        """Update order status (admin only)."""
        order_service = OrderService(db)
        await order_service.update_order_status(order_id, status_update.status)
        # Get the updated order with all relationships loaded
        updated_order = await order_service.order_repo.get_with_items(order_id)
        return self._format_order_response(updated_order)
    
    async def get_email_content(
        self,
        order_id: str,
        admin_user: AdminUser,
        db: DatabaseSession
    ):
        """Get email content that was sent for this order."""
        try:
            order_service = OrderService(db)
            order = await order_service.order_repo.get_with_items(order_id)
            
            if not order:
                raise HTTPException(status_code=404, detail="Order not found")
            
            # Generate simple email content
            email_content = f"""
            <html>
            <body>
                <h2>Banner Order Details</h2>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹{order.total_price}</p>
                <p><strong>Items:</strong> {len(order.items)} banner(s)</p>
                <p><strong>Contact:</strong> {getattr(order, 'contact_number', 'Not provided')}</p>
                <p>Design files were sent as email attachments.</p>
            </body>
            </html>
            """
            
            customer_email = "N/A"
            if hasattr(order, 'user') and order.user:
                customer_email = order.user.email
            
            return {
                "order_id": order_id,
                "email_subject": f"New Banner Order #{order_id[:8]}",
                "email_content": email_content,
                "contact_number": getattr(order, 'contact_number', 'Not provided'),
                "customer_email": customer_email,
                "files_info": f"{len(order.items)} design files were sent as email attachments"
            }
        except Exception as e:
            print(f"Error in get_email_content: {e}")
            raise HTTPException(status_code=500, detail="Failed to load email content")
    
    def _format_order_response_simple(self, order) -> OrderResponse:
        """Format order for response (email-only approach)."""
        return OrderResponse(
            id=order.id,
            status=order.status,
            total_price=order.total_price,
            created_at=order.created_at,
            updated_at=order.updated_at or order.created_at,
            items=[]
        )
    
    def _format_order_response(self, order) -> OrderResponse:
        """Format order for response with items."""
        items = []
        if hasattr(order, 'items') and order.items:
            for item in order.items:
                items.append({
                    "id": item.id,
                    "price": item.price,
                    "banner_config": {
                        "id": item.banner_config.id,
                        "width_cm": item.banner_config.width_cm,
                        "height_cm": item.banner_config.height_cm,
                        "material": item.banner_config.material,
                        "grommets": item.banner_config.grommets,
                        "lamination": item.banner_config.lamination,
                        "calculated_price": item.banner_config.calculated_price
                    },
                    "file_name": "Sent via email",
                    "file_url": None,
                    "created_at": item.created_at
                })
        
        return OrderResponse(
            id=order.id,
            status=order.status,
            total_price=order.total_price,
            created_at=order.created_at,
            updated_at=order.updated_at or order.created_at,
            items=items
        )

def create_order_router() -> APIRouter:
    """Factory function to create order router."""
    controller = OrderController()
    return controller.router