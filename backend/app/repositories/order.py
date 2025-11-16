from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .base import BaseRepository
from ..models.order import Order, OrderItem

class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: AsyncSession):
        super().__init__(Order, db)
    
    async def get_user_orders(self, user_id: str) -> List[Order]:
        result = await self.db.execute(
            select(Order)
            .where(Order.user_id == user_id)
            .options(
                selectinload(Order.items).selectinload(OrderItem.banner_config),
                selectinload(Order.items).selectinload(OrderItem.file_record)
            )
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_all_orders(self) -> List[Order]:
        result = await self.db.execute(
            select(Order)
            .options(
                selectinload(Order.items).selectinload(OrderItem.banner_config),
                selectinload(Order.items).selectinload(OrderItem.file_record),
                selectinload(Order.user)
            )
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()
    
    async def get_with_items(self, order_id: str) -> Order:
        result = await self.db.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(
                selectinload(Order.items).selectinload(OrderItem.banner_config),
                selectinload(Order.items).selectinload(OrderItem.file_record),
                selectinload(Order.user)
            )
        )
        return result.scalar_one_or_none()