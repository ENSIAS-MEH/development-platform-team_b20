import React, { createContext, useState, useEffect, useContext } from 'react';
import { adminApi } from '../services/api';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ON CHARGE UNE SEULE FOIS ICI
  const refreshData = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error("Erreur sync:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Optionnel : Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshData }}>
      {children}
    </StatsContext.Provider>
  );
};

// Hook pour utiliser les stats facilement
export const useStats = () => useContext(StatsContext);