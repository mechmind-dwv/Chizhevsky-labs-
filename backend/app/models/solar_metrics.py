from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class SolarMetrics(Base):
    __tablename__ = "solar_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    sunspots = Column(Integer, nullable=False)
    solar_wind = Column(Float, nullable=False)  # km/s
    kp_index = Column(Integer, nullable=False)  # 0-9
    flux_density = Column(Float, nullable=False)  # sfu (F10.7)
