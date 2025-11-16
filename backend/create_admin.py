#!/usr/bin/env python3
"""
Script to create an admin user or make an existing user admin.
Run this script to create admin access for the banner printing platform.
"""

import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.models.user import User
from app.utils.security import get_password_hash
from app.config import settings

async def create_admin_user():
    """Create an admin user or make existing user admin."""
    
    # Create database engine
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        print("🔧 Banner Printing Admin Setup")
        print("=" * 40)
        
        # Get user input
        email = input("Enter admin email: ").strip()
        if not email:
            print("❌ Email is required!")
            return
        
        # Check if user exists
        result = await session.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": email}
        )
        existing_user = result.fetchone()
        
        if existing_user:
            # Make existing user admin
            await session.execute(
                text("UPDATE users SET is_admin = true WHERE email = :email"),
                {"email": email}
            )
            await session.commit()
            print(f"✅ User {email} is now an admin!")
        else:
            # Create new admin user
            name = input("Enter admin name: ").strip()
            password = input("Enter admin password: ").strip()
            
            if not name or not password:
                print("❌ Name and password are required!")
                return
            
            # Create new admin user
            hashed_password = get_password_hash(password)
            
            new_user = User(
                email=email,
                name=name,
                hashed_password=hashed_password,
                is_admin=True
            )
            
            session.add(new_user)
            await session.commit()
            print(f"✅ Admin user {email} created successfully!")
        
        print("\n📋 Admin Access Instructions:")
        print("1. Start the backend server: uvicorn app.main:app --reload")
        print("2. Start the frontend: npm run dev")
        print("3. Login with admin credentials")
        print("4. Navigate to /admin or click 'Admin' in the navbar")
        print("\n🎉 Admin setup complete!")

if __name__ == "__main__":
    asyncio.run(create_admin_user())