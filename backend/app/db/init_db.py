from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.solar_metrics import Base as SolarBase
from app.models.historical_event import Base as EventBase
from app.core.config import settings
import json
from datetime import datetime

def init_database():
    sync_engine = create_engine(settings.DATABASE_URL_SYNC)
    
    # Crear tablas
    SolarBase.metadata.create_all(bind=sync_engine)
    EventBase.metadata.create_all(bind=sync_engine)
    
    Session = sessionmaker(bind=sync_engine)
    session = Session()
    
    # Verificar si ya hay datos
    from app.models.historical_event import HistoricalEvent
    count = session.query(HistoricalEvent).count()
    
    if count == 0:
        print("🌱 Sembrando 50 eventos históricos de Chizhevsky...")
        seed_historical_events(session)
    
    session.close()
    sync_engine.dispose()
    print("✅ Base de datos inicializada correctamente.")

def seed_historical_events(session):
    from app.models.historical_event import HistoricalEvent
    import os
    seed_path = os.path.join(os.path.dirname(__file__), '..', '..', 'scripts', 'seed_events.json')
    
    with open(seed_path, 'r') as f:
        events = json.load(f)
    
    for evt in events:
        event = HistoricalEvent(
            year=evt['year'],
            epoch=evt['epoch'],
            event=evt['event'],
            solar_phase=evt['solar_phase'],
            estimated_excitability=evt['estimated_excitability'],
            description=evt['description']
        )
        session.add(event)
    
    session.commit()
    print(f"✅ {len(events)} eventos históricos sembrados.")
