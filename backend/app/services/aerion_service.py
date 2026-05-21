from typing import Dict, Any

class AerionService:
    """Simulador de Aero-ionización Terapéutica.
    
    Basado en los experimentos de Chizhevsky con la "Lámpara de Chizhevsky"
    en el Laboratorio Central de Aero-ionización de la URSS (1939).
    
    REFERENCIA: Chizhevsky, A.L. (1938) "Aero-ionización en Medicina"
    """
    
    MODES = {
        "creative": {
            "name": "Revolución Creativa",
            "density": 48000,
            "description": "Máximo flujo de iones negativos para aumentar la absorción celular de oxígeno y catalizar picos cognitivos.",
            "visual_theme": "orange",
            "ion_type": "negative"
        },
        "recovery": {
            "name": "Gulag Recovery",
            "density": 1200,
            "description": "Inyección balanceada para contrarrestar fatiga por acumulación de iones positivos de pantallas electrónicas.",
            "visual_theme": "blue",
            "ion_type": "balanced"
        },
        "tsiolkovsky": {
            "name": "Efecto Tsiolkovsky",
            "density": 15000,
            "description": "Ciclos automatizados que alternan la intensidad de carga emulando variaciones de la alta atmósfera.",
            "visual_theme": "purple",
            "ion_type": "alternating"
        }
    }
    
    def simulate(self, mode: str = "tsiolkovsky") -> Dict[str, Any]:
        """Simula la densidad de iones según el modo seleccionado."""
        mode_key = mode.lower()
        
        if mode_key not in self.MODES:
            return {
                "error": f"Modo '{mode}' no encontrado.",
                "available_modes": list(self.MODES.keys()),
                "default": self.MODES["tsiolkovsky"]
            }
        
        mode_data = self.MODES[mode_key]
        
        # Referencias ambientales
        references = {
            "bosque_natural": 50000,
            "oficina_cerrada": 100,
            "cascada_pristina": 50000,
            "aire_montana": 30000
        }
        
        # Evaluar calidad
        if mode_data["density"] >= 20000:
            quality = "SATURACIÓN ÓPTIMA (Bosque de Alta Montaña)"
        elif mode_data["density"] >= 5000:
            quality = "CALIDAD MODERADA"
        else:
            quality = "ENTORNO ARTIFICIAL DEGRADADO"
        
        return {
            "mode": mode_data["name"],
            "ion_density": mode_data["density"],
            "unit": "iones/cm³",
            "ion_type": mode_data["ion_type"],
            "visual_theme": mode_data["visual_theme"],
            "quality_assessment": quality,
            "description": mode_data["description"],
            "environmental_references": references,
            "optimal_range": {
                "min": 1000,
                "max": 50000,
                "unit": "iones/cm³"
            }
        }
