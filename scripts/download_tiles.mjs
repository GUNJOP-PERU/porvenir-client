import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
// URL from Tracking.tsx: https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
const BASE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile';
const OUTPUT_DIR = path.join(__dirname, '../public/maps/tiles');
const CENTER_LAT = -10.6078;
const CENTER_LON = -76.2085;
const BUFFER = 0.015; // Roughly 1.5km buffer
const ZOOM_LEVELS = [15, 16, 17, 18];

function long2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

async function downloadTile(z, x, y) {
  // Source URL uses Z/Y/X structure based on Tracking.tsx
  const url = `${BASE_URL}/${z}/${y}/${x}`;
  
  // Save locally as standard Z/X/Y for easier Leaflet consumption
  const destDir = path.join(OUTPUT_DIR, z.toString(), x.toString());
  const destFile = path.join(destDir, `${y}.png`);

  try {
    await fs.mkdir(destDir, { recursive: true });
    
    // Check if exists
    try {
      await fs.access(destFile);
      // console.log(`Skipping existing: ${z}/${x}/${y}`);
      return;
    } catch {
      // Doesn't exist
    }

    // console.log(`Downloading: ${url} -> ${destFile}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Tile not found: ${z}/${x}/${y}`);
        return;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(destFile, Buffer.from(buffer));
    process.stdout.write('.'); // Progress indicator
  } catch (err) {
    console.error(`\nFailed to download ${z}/${x}/${y}:`, err.message);
  }
}

async function main() {
  console.log(`Starting tile download for area around ${CENTER_LAT}, ${CENTER_LON}...`);
  console.log(`Saving to: ${OUTPUT_DIR}`);
  
  for (const z of ZOOM_LEVELS) {
    const xMin = long2tile(CENTER_LON - BUFFER, z);
    const xMax = long2tile(CENTER_LON + BUFFER, z);
    const yMin = lat2tile(CENTER_LAT + BUFFER, z);
    const yMax = lat2tile(CENTER_LAT - BUFFER, z);
    
    const startX = Math.min(xMin, xMax);
    const endX = Math.max(xMin, xMax);
    const startY = Math.min(yMin, yMax);
    const endY = Math.max(yMin, yMax);
    
    const totalTiles = (endX - startX + 1) * (endY - startY + 1);
    console.log(`\nZoom ${z}: X[${startX}-${endX}] Y[${startY}-${endY}] (${totalTiles} tiles)`);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        await downloadTile(z, x, y);
        // Small delay
        await new Promise(r => setTimeout(r, 20)); 
      }
    }
  }
  console.log('\nDone!');
}

main().catch(console.error);
