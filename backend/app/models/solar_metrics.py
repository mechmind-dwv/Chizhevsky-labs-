from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class SolarMetrics(Base):
    __tablename__ = "solar_metrics"
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(String, default=lambda: datetime.utcnow().isoformat())
    sunspots = Column(Integer, nullable=False)
    solar_wind = Column(Float, nullable=False)
    kp_index = Column(Integer, nullable=False)
    flux_density = Column(Float, nullable=False)
