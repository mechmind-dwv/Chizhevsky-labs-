from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class HistoricalEvent(Base):
    __tablename__ = "historical_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    year = Column(Integer, nullable=False)
    epoch = Column(String(100), nullable=False)
    event = Column(String(500), nullable=False)
    solar_phase = Column(String(50), nullable=False)  # Minima, Ascending, Maxima, Descending
    estimated_excitability = Column(Float, nullable=False)  # 1-10
    description = Column(Text, nullable=True)
