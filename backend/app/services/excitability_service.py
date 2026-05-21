from datetime import datetime
from typing import Dict, Any
import math

class ExcitabilityService:
    """Calculadora del Índice de Excitabilidad Biológica.
    
    Basado en los cuadernos de anotación de Chizhevsky (Kaluga, 1920-1928).
    
    FÓRMULA:
    I_eb = (Kp/9 × 5 × α_crono) + (mood × 0.3)
    
    Donde:
    - Kp: Índice planetario de perturbación geomagnética (0-9)
    - α_crono: Factor de susceptibilidad según cronotipo
      * Alondra (Lark): 0.9
      * Intermedio: 1.0
      * Búho (Owl): 1.2
    - mood: Estado de ánimo subjetivo (1-10)
    
    REFERENCIA: Chizhevsky, A.L. (1924) "Factores Físicos del Proceso Histórico"
    """
    
    def calculate(
        self,
        birth_date: str,
        chronotype: str,
        mood_rating: int,
        kp_index: int
    ) -> Dict[str, Any]:
        # Validar inputs
        if not 1 <= mood_rating <= 10:
            raise ValueError("mood_rating debe estar entre 1 y 10")
        if not 0 <= kp_index <= 9:
            raise ValueError("kp_index debe estar entre 0 y 9")
        
        # Factor de cronotipo
        chronotype_factors = {
            "Lark": 0.9,
            "Intermediate": 1.0,
            "Owl": 1.2
        }
        alpha_crono = chronotype_factors.get(chronotype, 1.0)
        
        # Cálculo base del efecto Kp
        base_kp_effect = (kp_index / 9.0) * 5.0
        
        # Índice de Excitabilidad Biológica
        ieb = (base_kp_effect * alpha_crono) + (mood_rating * 0.3)
        
        # Normalizar a rango 1-10
        ieb = max(1.0, min(10.0, round(ieb, 2)))
        
        # Calcular posición en ciclo solar
        solar_position = self._calculate_solar_position(birth_date)
        
        # Determinar nivel de alerta
        if ieb >= 7.5:
            alert_level = "ALTA"
            recommendation = "Se recomienda espaciar decisiones críticas. Alta excitabilidad cortical detectada."
        elif ieb >= 5.0:
            alert_level = "MODERADA"
            recommendation = "Estado de equilibrio. Ventana óptima para actividades creativas."
        else:
            alert_level = "BAJA"
            recommendation = "Periodo de baja excitabilidad. Ideal para descanso y recuperación."
        
        return {
            "excitability_index": ieb,
            "alert_level": alert_level,
            "recommendation": recommendation,
            "solar_position_cycle": solar_position,
            "chronotype_factor": alpha_crono,
            "kp_contribution": round(base_kp_effect * alpha_crono, 2),
            "mood_contribution": round(mood_rating * 0.3, 2),
            "formula": "I_eb = (Kp/9 × 5 × α_crono) + (mood × 0.3)"
        }
    
    def _calculate_solar_position(self, birth_date: str) -> int:
        """Calcula la posición estimada en el ciclo solar actual.
        
        [SIMULADO] En producción, se calcularía con datos reales del ciclo.
        Asume que el año de nacimiento determina la sensibilidad base.
        """
        try:
            birth_year = datetime.strptime(birth_date, "%Y-%m-%d").year
            # Ciclo solar de ~11 años
            # Referencia: Ciclo 25 comenzó en diciembre 2019
            cycle_start = 2019
            years_since_start = datetime.now().year - cycle_start
            position = (birth_year - cycle_start) % 11
            return max(1, min(11, position + 1))
        except:
            return 5  # Valor por defecto
