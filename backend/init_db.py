#!/usr/bin/env python3
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.database import Base
from app.config import settings

async def init_db():
    """Initialize database tables."""
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        # Drop all tables and recreate
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())