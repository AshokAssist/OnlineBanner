from sqlalchemy import Column, Integer, String, Boolean, Numeric
import uuid
from ..database import Base

class BannerConfig(Base):
    __tablename__ = "banner_configs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    width_cm = Column(Integer, nullable=False)
    height_cm = Column(Integer, nullable=False)
    material = Column(String, nullable=False)  # vinyl, fabric, mesh
    grommets = Column(Boolean, default=False)
    lamination = Column(Boolean, default=False)
    calculated_price = Column(Numeric(10, 2), nullable=False)