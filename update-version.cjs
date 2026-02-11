// update-version.cjs
const fs = require('fs');
const path = require('path');

const versionJsonPath = path.join(__dirname, 'public', 'version.json');
const uniqueVersion = `build-${Date.now()}`;

const content = JSON.stringify({ 
  version: uniqueVersion,
  buildTime: new Date().toISOString() 
}, null, 2);

try {
  // Crear carpeta public si no existe
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(versionJsonPath, content);
  console.log(`✅ Versión generada: ${uniqueVersion}`);
} catch (error) {
  console.error('❌ Error al generar versión:', error);
}