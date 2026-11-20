<div align="center">

# GeoMotion Pro — User Guide & API Setup 📚

🌐 **Language / Dil:** **🇺🇸 English** | [🇹🇷 Türkçe](GUIDE.tr.md) | [⬅️ Back to README](../README.md)

</div>

---

## 1. Free MapTiler API Key Setup (Unlock Satellite V2, Topo & Multilingual Labels)

GeoMotion Pro works out of the box with **zero API keys** using free providers (**Esri World Imagery**, **CartoDB Dark Matter**, **CartoDB Positron**, **CartoDB Voyager**, **OpenStreetMap**, **OpenTopoMap**).

However, creating a **free MapTiler Cloud API key** unlocks **MapTiler Satellite V2**, **Hybrid**, **Dataviz Dark/Light**, **Streets V2**, **Ocean & Bathymetry**, **Topo V2**, and **multilingual map labels** (`TR`, `EN`, `DE`, `FR`, `ES`, `Local`).

### How to Get & Add Your Free Key:
1. Go to **[cloud.maptiler.com](https://cloud.maptiler.com/)** and sign up for a free account (no credit card required for the Free tier).
2. In the MapTiler dashboard, open **API Keys** and copy your **Default Key** (or create a new key).
3. In **GeoMotion Pro** inside After Effects:
   - Either select any MapTiler style in the map style dropdown to open the quick key bar, **or** open the **`Prefs`** tab (`3D DEM & Prefs`) → **MapTiler API Key** field.
   - Paste your key and click **Save / Verify**.
4. You can now switch MapTiler styles and change map label languages from the top bar (`Harita: Türkçe / English / ...`).

---

## 2. Custom TMS / XYZ Map Servers & Cache Management

If you have your own tile server or third-party XYZ/TMS provider:
1. Open the **`Prefs`** tab → **Custom TMS / XYZ Server Profiles**.
2. Enter a server name and a URL template containing `{z}`, `{x}`, and `{y}` (e.g. `https://tile.example.com/{z}/{x}/{y}.png`).
3. Click **Add & Activate Server** to preview and finalize with it immediately.
4. Use **Export JSON** to back up your server list to your Desktop, or **Clear Cache** to remove temporary stitched atlas folders.

---

## 3. Clean Land-Only Borders vs. Maritime Waters (`Denizi Dahil Et`)

OpenStreetMap (Nominatim) often includes **12-nautical-mile territorial sea polygons** for coastal countries and provinces (e.g., Hatay, Istanbul, coastal states).

- **Default (`Denizi Dahil Et` unchecked):** GeoMotion Pro automatically fetches clean **land-only coastline boundaries** from **geoBoundaries (ADM0 / ADM1)** so borders hug the real shoreline.
- **Maritime Included (`Denizi Dahil Et` checked):** Draws the full administrative + sea boundary returned by Nominatim.

---

## 4. Essential Workflow Tips

### 🎥 Camera & Preview Controls
- **Left-Click Drag:** Pan the map.
- **Mouse Wheel / Zoom Slider:** Zoom in and out.
- **Right-Click Drag:** Adjust **Pitch (`0°–60°`)** and **Bearing (`-180°–180°`)** interactively.
- **1:1 Framing Guide Box:** The blue dashed box in the preview automatically matches your active After Effects composition aspect ratio (`16:9`, `9:16`, `1:1`, `4K`).

### 🔗 Two-Way Live Link & Keyframes
- Toggle **`🔗 Live Link`** in the top bar to sync your AE timeline CTI and plugin preview in both directions:
  - Scrubbing the AE timeline updates the plugin preview to match the exact keyframed view.
  - Panning/zooming in the plugin updates the active view/keyframe in AE.
- Click **`◆ Keyframe`** to add Easy-Ease camera keyframes at the current CTI time.

### ⚡ 1-Frame vs. ✓ Finalize
- **`⚡ 1-Frame`:** Downloads and stitches high-resolution tiles **only for the current CTI frame** — ideal for quick checks.
- **`✓ Finalize`:** Downloads and stitches seamless 2K map atlases (`2304×1792px`) across **all keyframes and zoom transitions** with smooth alpha feathering.

### 📂 Supported Local Geodata Formats
In **Feature Browser**, click **`+ GeoJSON / GPX / CSV`** to import:
- **`.geojson` / `.json`:** Polygons, MultiPolygons, Lines, Points.
- **`.gpx` / `.kml`:** GPS tracks, routes, and waypoints.
- **`.csv` / `.tsv`:** Tabular coordinates (`name, lat, lon, value, color`) for pins and data charts.

### 🤖 Copilot AI Examples
Open the **Copilot AI** tab and try prompts in English or Turkish:
- *"Create a 9:16 Reels comp, zoom from Europe to Istanbul at 3s, and draw Turkey's borders."*
- *"İstanbul'dan Ankara'ya kara yolu rotası çiz ve kamerayı takip ettir."*
