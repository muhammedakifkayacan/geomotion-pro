<div align="center">

# GeoMotion Pro v3.0 🌍🎬

**100% Open-Source, AI-Powered Map & Geospatial Animation Extension for Adobe After Effects.**

🌐 **Language / Dil / اللغة:** **🇺🇸 English** | [🇹🇷 Türkçe](README.tr.md) | [🇸🇦 العربية](README.ar.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/muhammedakifkayacan/geomotion-pro)](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-lightgrey.svg)](#installation-macos--windows)

</div>

GeoMotion Pro is a free, open-source Adobe CEP extension that lets you create cinematic map animations, high-resolution satellite/vector renders, animated routes, country/city borders, and geospatial data charts directly inside After Effects—without expensive third-party map plugins.

---

## ✨ Key & Advanced Features

### 🤖 1. AI Copilot (`GeoCopilot`)
- Understands natural language prompts in **English & Turkish** (e.g., *"Zoom into Turkey from space, fly to Istanbul at 3s, draw borders and add a route to Ankara"*).
- Automatically configures composition format (`16:9`, `9:16 Reels`, `4K`), places keyframes, and builds AE layers.

### 🗺️ 2. Real-Time Preview, 1:1 Framing Guide & Multi-Zoom Finalize
- **1:1 Composition Match:** The viewport guide box (`16:9`, `9:16`, `1:1`, `4K`) mathematically matches your active After Effects composition dimensions and camera framing.
- **Interactive Camera Controls:** Left-click drag to pan, wheel/slider to zoom, **right-click drag for Pitch (`0°–60°`) & Bearing (`-180°–180°`)**.
- **Live Link (`🔗`):** Every pan, zoom, and tilt in the panel syncs live with your After Effects composition.
- **Multi-Zoom Seamless Finalize & ⚡ 1-Frame Finalize:** Stitches high-resolution 2K map atlases (`2304×1792px`) across all keyframes and transitions with smooth alpha feathering and zoom-blended opacity—plus **1-Frame** mode for instant single-frame high-res rendering.
- **Map Providers & Custom TMS/XYZ:** Built-in Esri World Imagery, CartoDB Dark/Light/Voyager, OpenStreetMap, OpenTopoMap, MapTiler Cloud (Satellite V2, Hybrid, Topo, Ocean, etc.), and custom `{z}/{x}/{y}` TMS/WMS server profiles.

### 📍 3. Feature Browser, Overpass OSM & Multi-Format Geodata Import
- **Nominatim & Direct Coordinate Search:** Search countries, cities, regions, or jump directly to `lat, lon` coordinates (e.g., `41.0422, 28.9892`).
- **🎯 Click-to-Select Feature on Map:** Click anywhere on the map to reverse-geocode and extract administrative boundary polygons automatically.
- **OSM Vector Extractor:** Download **Highways** and **Rivers** directly as editable AE Shape Layers.
- **Multi-Format Support:** Import `.geojson`, `.json`, `.gpx`, `.kml`, `.csv`, and `.tsv` files.
- **Geometry Tools:** Ramer-Douglas-Peucker (`RDP`) polygon simplification and **Merge** (combine multiple polygons).

### 🎨 4. Map Colorizer, Watermask, Atmosphere/DOF & Data Visualization
- **MAP_STYLE_COLORIZER:** One-click Adjustment Layer to customize Water, Land, and Highlight colors.
- **🌊 Watermask (`MAP_WATERMASK_MATTE`):** Generates animated ocean shimmer / luma matte layers.
- **🌫️ Horizon Fog & Camera DOF (`MAP_HORIZON_FOG`):** Pitch-reactive horizon fog, `MAP_3D_CAMERA` Depth of Field, and vector Drop Shadows.
- **🌡️ Choropleth & ⏱️ Time-Series:** Gradient-color regions by value and stagger layers sequentially along the timeline with fade-in animations.

### 🧭 5. Labels, Scale Bar, North Compass, Locator & 2-Point Georeference
- **Counter-Scale & Counter-Rotate Pins:** Labels and pins stay crisp and readable regardless of camera zoom or rotation.
- **🧭 Scale Bar & North Compass:** Live `km/m` scale bar synced to camera zoom/latitude and dynamic compass needle linked to Bearing.
- **🗺️ Locator / Inset Map:** Corner overview minimap tracking the main camera's live position and zoom.
- **📐 2-Point Georeference:** Automatically position and scale any selected layer/image between two geographic coordinates.

### 🚗 6. Animated Routes
- **OSRM Highway & Great-Circle Flight Arcs:** Draws real driving routes or curved flight arcs with an auto-orienting **Dynamic Arrowhead (`ROUTE_TRACKER_`)** and optional camera follow.

### 🔄 7. Built-in GitHub Auto-Updater
- Check for updates and install new releases directly from inside the panel (`version.json`).

---

## 📦 Installation (macOS & Windows)

Pre-built installers are available in [`dist/`](./dist) and on the [**Releases Page**](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest):

### 🍎 macOS
1. Download [`GeoMotion_Pro_v3.0_macOS_Installer.dmg`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_macOS_Installer.dmg) and open it.
2. Run **Install GeoMotion Pro** (automatically installs to Adobe CEP extensions and enables `PlayerDebugMode`).
3. Restart Adobe After Effects and open **`Window > Extensions > GeoMotion Pro`**.

### 🪟 Windows
1. Download [`GeoMotion_Pro_v3.0_Windows_Setup.exe`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_Windows_Setup.exe) and run it.
2. The installer automatically copies the extension to `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\` and configures the Windows Registry (`PlayerDebugMode`).
3. Open Adobe After Effects and launch **`Window > Extensions > GeoMotion Pro`**.

### 📦 Universal Bundle / ZXP
- Manual / ZXP installers are also included: [`GeoMotion_Pro_v3.0_Universal_Bundle.zip`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_Universal_Bundle.zip) and [`GeoMotion_Pro_v3.0.zxp`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0.zxp).

---

## 🛠️ Build from Source

To rebuild all `.dmg`, `.exe`, `.zip`, and `.zxp` installers from source:

```bash
python3 installers/build_installers.py
```

---

## 📂 Project Structure

```text
├── com.opengeolayers.cep/   # Main Adobe CEP Extension (HTML/CSS/JS + ExtendScript JSX)
│   ├── client/              # Panel UI, Leaflet map engine, GeoCopilot, and GeoUpdater
│   ├── host/index.jsx       # After Effects ExtendScript scene & 3D camera engine
│   └── CSXS/manifest.xml    # Adobe CEP manifest (com.geomotion.cep)
├── installers/              # macOS DMG and Windows SFX EXE builder scripts
├── dist/                    # Compiled macOS, Windows, and Universal installers
├── ScriptUI/                # Alternative ScriptUI panel (GeoMotion_Pro_Panel.jsx)
├── version.json             # Auto-updater version manifest
├── README.tr.md             # Turkish documentation
└── LICENSE                  # MIT Open Source License
```

---

## 📄 License

This project is licensed under the **MIT License** ([LICENSE](./LICENSE)). You are free to use, modify, fork, and distribute it for personal and commercial projects.
