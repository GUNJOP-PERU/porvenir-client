// src/hooks/useVersionCheck.js
import { useEffect, useState } from 'react';

export function useVersionCheck() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

 const checkVersion = async () => {
  try {
    const response = await fetch('/version.json?t=' + Date.now());
    const data = await response.json();
    
    const currentVersion = localStorage.getItem('app-version');
    
    console.log('🔍 Versión actual en localStorage:', currentVersion);
    console.log('📡 Versión del servidor:', data.version);
    
    if (currentVersion && currentVersion !== data.version) {
      console.log('🎉 ¡Nueva versión detectada!');
      setShowUpdateBanner(true);
    } else if (!currentVersion) {
      console.log('🆕 Primera carga, guardando versión...');
      localStorage.setItem('app-version', data.version);
    } else {
      console.log('✅ Versiones coinciden, no hay actualización');
    }
  } catch (error) {
    console.error('❌ Error al verificar versión:', error);
  }
};

  const handleUpdate = () => {
    // Guardar la nueva versión y recargar
    fetch('/version.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('app-version', data.version);
        window.location.reload(true);
      });
  };

  const handleDismiss = () => {
    setShowUpdateBanner(false);
  };

  useEffect(() => {
    // Verificar al cargar
    checkVersion();

    // Verificar cada 5 minutos
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    // Verificar cuando el usuario vuelve a la pestaña
    window.addEventListener('focus', checkVersion);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkVersion);
    };
  }, []);

  return { showUpdateBanner, handleUpdate, handleDismiss };
}