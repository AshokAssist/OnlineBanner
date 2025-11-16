import pytest
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.order import OrderService
from app.schemas.banner import PriceCalculationRequest

@pytest.mark.asyncio
async def test_price_calculation(db_session: AsyncSession):
    """Test banner price calculation."""
    order_service = OrderService(db_session)
    
    config = PriceCalculationRequest(
        width_cm=100,
        height_cm=50,
        material="vinyl",
        grommets=True,
        lamination=False
    )
    
    price = order_service.calculate_price(config)
    
    # Expected: (100*50/10000) * 15 + 5 = 0.5 * 15 + 5 = 12.5
    expected_price = Decimal("12.50")
    assert price == expected_price

@pytest.mark.asyncio
async def test_price_calculation_with_material_multiplier(db_session: AsyncSession):
    """Test price calculation with material multiplier."""
    order_service = OrderService(db_session)
    
    config = PriceCalculationRequest(
        width_cm=100,
        height_cm=50,
        material="fabric",
        grommets=False,
        lamination=True
    )
    
    price = order_service.calculate_price(config)
    
    # Expected: (100*50/10000) * 15 * 1.2 + 10 = 0.5 * 15 * 1.2 + 10 = 9 + 10 = 19
    expected_price = Decimal("19.00")
    assert price == expected_price

@pytest.mark.asyncio
async def test_minimum_price(db_session: AsyncSession):
    """Test minimum price enforcement."""
    order_service = OrderService(db_session)
    
    config = PriceCalculationRequest(
        width_cm=10,
        height_cm=10,
        material="vinyl",
        grommets=False,
        lamination=False
    )
    
    price = order_service.calculate_price(config)
    
    # Should enforce minimum price of $10
    assert price == Decimal("10.00")