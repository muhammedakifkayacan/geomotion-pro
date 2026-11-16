/**
 * GeoMotion Pro v4.5 — Professional Map & Satellite Motion Engine for After Effects
 *
 * Key Upgrades in v4.5:
 *   1. Seamless Full-Frame Stitched Map Atlas Engine (2304 x 1792 px per Zoom Level):
 *      - Stitches 9x7 (63 tiles) onto a single gap-free 2304x1792 PNG Atlas!
 *      - Automatically builds both a High-Res Detail Atlas (Z) AND a Wide Horizon Base Atlas (Z-2)
 *        so the entire 1920x1080 frame + 3D tilt horizon is 100% filled with zero seams or black gaps!
 *      - Includes multi-subdomain retry + parent-tile (Z-1) quadrant fallback so no missing tile
 *        ever renders as a black square!
 */

(function () {
    "use strict";

    var csInterface = new CSInterface();
    var map = null;
    var activeTileLayer = null;
    var previewGeoJSONLayer = null;
    var previewRouteLayer = null;
    var liveLinkEnabled = true;

    var featureCollection = [];
    var selectedFeatureId = null;

    var maptilerApiKey = "";
    var currentLang = "tr";
    var selectedModalStyleId = "esri_sat";
    var currentUiScale = "115";
    var activeMapLabelLang = "tr";

    var I18N = {
        tr: {
            langTag: "🇹🇷 TR",
            newComp: "Yeni",
            keyframeBtn: "Keyframe",
            finalizeBtn: "Finalize (İşle)",
            searchPlaceholder: "Yer, Ülke, Şehir, Bölge veya Enlem,Boylam Ara...",
            searchBtn: "Ara",
            mtKeyBadge: "🔑 MapTiler API Key:",
            saveKey: "Kaydet",
            getFreeKey: "Ücretsiz Key Al ↗",
            openModalBtn: "Harita Stili Seç",
            tabCollection: "Vektör Gezgini",
            tabStyles: "Katman Stilleri",
            tabLabels: "Etiketler & Pin",
            tabRoutes: "Rota Bağla & Uçuş",
            tabPrefs: "3D DEM & Ayarlar",
            boundaryBtn: "+ Sınır Ekle",
            roadsBtn: "+ Yollar",
            riversBtn: "+ Nehirler",
            fileBtn: "+ GeoJSON Dosyası",
            collectionTitle: "Vektör Koleksiyonu",
            selectHint: "İncelemek veya çizmek için bir özellik seçin",
            drawFeatureBtn: "Vektörü Çiz (Shape Layer)",
            fitViewBtn: "Görünüme Sığdır",
            addLabelBtn: "+ Etiket",
            stylePresetsTitle: "Shape Katman Stili Hazır Ayarları",
            saveStyleBtn: "+ Stili Kaydet",
            fillColor: "Dolgu Rengi",
            strokeColor: "Çizgi Rengi",
            strokeWidth: "Çizgi Kalınlığı (px)",
            fillOpacity: "Dolgu Opaklığı (%)",
            extrudeDepth: "3D Ekstrüzyon Derinliği",
            trimDuration: "Çizim Süresi (sn)",
            animateTrim: "Çizgiyi Animasyonla Çiz (Trim)",
            dashedStroke: "Kesik Çizgili Kenarlık",
            labelsTitle: "Dinamik Etiket & Pin Şablonları",
            labelTitleInput: "Etiket Başlığı",
            labelSubInput: "Alt Başlık / Koordinat",
            labelTemplate: "Etiket Şablonu",
            accentColor: "Vurgu Rengi",
            fontSize: "Yazı Boyutu (pt)",
            lockScale: "Ekrana Sabitle (Otomatik Ölçek)",
            faceCamera: "Kameraya Dönük Kal (3D Billboard)",
            addPinCenter: "+ Harita Merkezine Etiket Ekle",
            routesTitle: "Özellikleri Bağla (OSRM Karayolu & Uçuş Yayı)",
            originPlace: "Başlangıç (A Noktası)",
            destPlace: "Varış (B Noktası)",
            routeMode: "Rota Motoru",
            routeDuration: "Süre (sn)",
            dashedPath: "Kesik Çizgi",
            pinTracker: "Hareketli Pin",
            followView: "Görünümü Takip Et",
            previewPath: "Rotayı Önizle",
            drawRouteBtn: "Haritada Bağla ve Çiz",
            flyToTitle: "2-Nokta Arası Yumuşak Uçuş Geçişi (◆ → ◆)",
            fromPlace: "Nereden",
            toPlace: "Nereye",
            generateFlyTo: "Parabolik Uçuş Keyframeleri Üret",
            compSettingsTitle: "Mapcomp Ayarları & Finalize Seçenekleri",
            compName: "Mapcomp Adı",
            resolution: "Çözünürlük",
            gridSize: "Atlas Izgara Boyutu",
            fps: "Kare Hızı (FPS)",
            duration: "Süre (sn)",
            oceanColor: "Taban / Okyanus Rengi",
            multiZoomBlend: "Çoklu-Zoom Opaklık Harmanlama",
            writeAttribution: "Telif / Kaynak Metnini Yaz",
            demTitle: "3D DEM Yükseklik & Veri Sütunları",
            demExaggeration: "DEM Yükselti Çarpanı",
            demDensity: "DEM Örnekleme Yoğunluğu",
            buildDemBtn: "3D DEM Rölyefini Oluştur",
            drawDataBarsBtn: "3D Veri Sütunlarını Çiz",
            motionBlurCardTitle: "Motion Blur & AE Render Ayarları",
            mblurToggleLabel: "Motion Blur Durumu",
            shutterAngleLabel: "Shutter Angle (°)",
            shutterPhaseLabel: "Shutter Phase (°)",
            applyMotionBlurBtn: "Motion Blur'u After Effects'e Uygula",
            accessCardTitle: "UI / UX Erişilebilirlik & Harita Dili",
            prefsMapLangLabel: "Harita Üzerindeki Şehir/Ülke Yazı Dili",
            prefsUiScaleLabel: "Panel Yazı & Arayüz Ölçeği (UI Scale)",
            compSettingsBtn: "Ayar",
            compModalTitle: "Kompozisyon Ayarları & Format Yöneticisi",
            compModalSubtitle: "Mevcut kompozisyon ölçülerini değiştirin, Reels/4K formatlarına çoğaltın veya animasyonu optimize edin.",
            cmTabResize: "Ölçü Değiştir (Resize)",
            cmTabDuplicate: "Yeni Formata Çoğalt (Duplicate)",
            cmTabTools: "Animasyon, Easing & Performans",
            modalTitle: "Harita Stili Galerisi",
            modalSubtitle: "Kullanmak istediğiniz harita tipini görsel önizlemesine bakarak seçin",
            filterAll: "Tümü (17)",
            filterFree: "Ücretsiz (6)",
            filterSat: "Uydu",
            filterDark: "Koyu",
            filterMaptiler: "MapTiler Cloud (11)",
            modalSelectedLabel: "Seçili Harita:",
            modalApplyBtn: "✓ Bu Harita Stilini Seç",
            modalMtKeyBtn: "MapTiler API Key Ayarla",
            statusReady: "Mapcomp 1 Hazır — Haritayı kaydırın/yakınlaştırın ve [◆ Keyframe] veya [Finalize] butonuna tıklayın."
        },
        en: {
            langTag: "EN",
            newComp: "New",
            keyframeBtn: "Keyframe",
            finalizeBtn: "Finalize",
            searchPlaceholder: "Search Places, Countries, Cities, Regions or Lat,Lon...",
            searchBtn: "Search",
            mtKeyBadge: "MapTiler API Key:",
            saveKey: "Save Key",
            getFreeKey: "Get Free Key ↗",
            openModalBtn: "Select Map Style",
            tabCollection: "Feature Browser",
            tabStyles: "Layer Styles",
            tabLabels: "Labels",
            tabRoutes: "Connect & Fly",
            tabPrefs: "3D DEM & Prefs",
            boundaryBtn: "+ Boundary",
            roadsBtn: "+ Roads in View",
            riversBtn: "+ Rivers in View",
            fileBtn: "+ GeoJSON File",
            collectionTitle: "Feature Collection",
            selectHint: "Select a feature to inspect or draw",
            drawFeatureBtn: "Draw Feature (Shape Layer)",
            fitViewBtn: "Fit View",
            addLabelBtn: "+ Label",
            stylePresetsTitle: "Shape Layer Style Presets",
            saveStyleBtn: "+ Save Style",
            fillColor: "Fill Color",
            strokeColor: "Stroke Color",
            strokeWidth: "Stroke Width (px)",
            fillOpacity: "Fill Opacity (%)",
            extrudeDepth: "3D Extrude Depth",
            trimDuration: "Trim Duration (s)",
            animateTrim: "Animate Trim Paths In",
            dashedStroke: "Dashed Border Stroke",
            labelsTitle: "Dynamic Label & Pin Templates",
            labelTitleInput: "Label Title",
            labelSubInput: "Subtitle / Coordinates",
            labelTemplate: "Label Template",
            accentColor: "Accent Color",
            fontSize: "Font Size (pt)",
            lockScale: "Lock Scale to Screen (Auto-Scale)",
            faceCamera: "Always Face Camera (3D Billboard)",
            addPinCenter: "+ Add Label at Mapcomp Center",
            routesTitle: "Connect Features (OSRM Road & Flight Arcs)",
            originPlace: "Origin (Feature A)",
            destPlace: "Destination (Feature B)",
            routeMode: "Routing Engine",
            routeDuration: "Duration (s)",
            dashedPath: "Dashed Path",
            pinTracker: "Pin Tracker",
            followView: "Follow View",
            previewPath: "Preview Path",
            drawRouteBtn: "Connect & Draw in Mapcomp",
            flyToTitle: "2-Point Mapcomp Fly-To Transition (◆ → ◆)",
            fromPlace: "From Place",
            toPlace: "To Place",
            generateFlyTo: "Generate Parabolic Fly-To Keyframes",
            compSettingsTitle: "Mapcomp Settings & Finalize Options",
            compName: "Mapcomp Name",
            resolution: "Resolution",
            gridSize: "Tile Grid Size",
            fps: "Frame Rate (FPS)",
            duration: "Duration (s)",
            oceanColor: "Ocean Base Color",
            multiZoomBlend: "Multi-Zoom Opacity Blend",
            writeAttribution: "Write Map Attribution",
            demTitle: "3D DEM Elevation & Data-Driven Bars",
            demExaggeration: "DEM Exaggeration",
            demDensity: "DEM Sample Grid",
            buildDemBtn: "Build 3D DEM Relief",
            drawDataBarsBtn: "Draw 3D Data Bars",
            motionBlurCardTitle: "Motion Blur & AE Render Settings",
            mblurToggleLabel: "Motion Blur State",
            shutterAngleLabel: "Shutter Angle (°)",
            shutterPhaseLabel: "Shutter Phase (°)",
            applyMotionBlurBtn: "Apply Motion Blur to After Effects",
            accessCardTitle: "UI / UX Accessibility & Map Language",
            prefsMapLangLabel: "Map Labels Language",
            prefsUiScaleLabel: "Panel Typography & UI Scale",
            compSettingsBtn: "Settings",
            compModalTitle: "Mapcomp Settings & Format Manager",
            compModalSubtitle: "Resize active composition, duplicate to Reels/4K formats, or optimize camera animation.",
            cmTabResize: "Resize Mapcomp",
            cmTabDuplicate: "Duplicate to New Format",
            cmTabTools: "Animation, Easing & Performance",
            modalTitle: "Map Style Gallery",
            modalSubtitle: "Choose your desired map style with visual live previews",
            filterAll: "All (17)",
            filterFree: "Free (6)",
            filterSat: "Satellite",
            filterDark: "Dark",
            filterMaptiler: "MapTiler Cloud (11)",
            modalSelectedLabel: "Selected Style:",
            modalApplyBtn: "✓ Select This Map Style",
            modalMtKeyBtn: "Configure MapTiler Key",
            statusReady: "Mapcomp 1 Ready — Pan/Zoom map and click [◆ Keyframe] or [Finalize]."
        }
    };

    var STYLE_CATALOG = [
        {
            id: "esri_sat",
            name_tr: "Esri World Imagery (Uydu)",
            name_en: "Esri World Imagery (Satellite)",
            desc_tr: "Yüksek çözünürlüklü küresel gerçek dünya uydu fotoğrafı. Dağlar, denizler ve doğal topoğrafya için en popüler seçim.",
            desc_en: "High-resolution global satellite imagery. Best for realistic natural terrain and relief.",
            tags: ["free", "sat", "popular"],
            badge_tr: "Ücretsiz • Çok Popüler",
            badge_en: "Free • Most Popular",
            badgeClass: "free",
            requiresKey: false,
            previewUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/11/18"
        },
        {
            id: "carto_dark",
            name_tr: "CartoDB Dark Matter (Koyu)",
            name_en: "CartoDB Dark Matter (Dark)",
            desc_tr: "Sinematik karanlık harita stili. Neon rotalar, parlak sınır çizgileri ve veri animasyonları için mükemmel kontrast.",
            desc_en: "Cinematic dark theme with maximum contrast for vector boundaries and motion graphics.",
            tags: ["free", "dark", "popular"],
            badge_tr: "Ücretsiz • Sinematik Koyu",
            badge_en: "Free • Cinematic Dark",
            badgeClass: "free",
            requiresKey: false,
            previewUrl: "https://a.basemaps.cartocdn.com/dark_all/5/18/11.png"
        },
        {
            id: "osm_std",
            name_tr: "OpenStreetMap Standart",
            name_en: "OpenStreetMap Standard",
            desc_tr: "Detaylı otoyollar, sokaklar, yerleşim yerleri ve sınırlar içeren klasik küresel açık kaynak harita.",
            desc_en: "Detailed community-driven global street and boundary map.",
            tags: ["free", "street"],
            badge_tr: "Ücretsiz • Sokak & Şehir",
            badge_en: "Free • Street & City",
            badgeClass: "free",
            requiresKey: false,
            previewUrl: "https://a.tile.openstreetmap.org/5/18/11.png"
        },
        {
            id: "opentopo",
            name_tr: "OpenTopoMap (Topoğrafik)",
            name_en: "OpenTopoMap (Topographic)",
            desc_tr: "Yükseklik eğrileri, eşyükselti konturları ve belirgin dağ gölgelendirmesi içeren arazi haritası.",
            desc_en: "Topographic map with contour lines and mountain relief shading.",
            tags: ["free", "topo"],
            badge_tr: "Ücretsiz • Topoğrafik",
            badge_en: "Free • Topographic",
            badgeClass: "free",
            requiresKey: false,
            previewUrl: "https://a.tile.opentopomap.org/5/18/11.png"
        },
        {
            id: "carto_voyager",
            name_tr: "CartoDB Voyager (Canlı)",
            name_en: "CartoDB Voyager (Clean)",
            desc_tr: "Temiz ve modern açık renkli gezi haritası. Açıklayıcı infografikler ve tanıtım videoları için harika.",
            desc_en: "Clean, elegant travel and infographic map with balanced pastel tones.",
            tags: ["free", "street", "light"],
            badge_tr: "Ücretsiz • Temiz Açık",
            badge_en: "Free • Clean & Bright",
            badgeClass: "free",
            requiresKey: false,
            previewUrl: "https://a.basemaps.cartocdn.com/rastertiles/voyager/5/18/11.png"
        },
        {
            id: "carto_light",
            name_tr: "CartoDB Positron (Açık Gri)",
            name_en: "CartoDB Positron (Minimal Light)",
            desc_tr: "Minimalist açık gri harita. Renkli rota ve bölge vurgularını öne çıkarmak için tasarlanmıştır.",
            desc_en: "Minimal light gray basemap designed to emphasize colored routes.",
            tags: ["free", "light"],
            badge_tr: "Ücretsiz • Minimal Açık",
            badge_en: "Free • Minimal Light",
            badgeClass: "free",
            requiresKey: false,
            previewUrl: "https://a.basemaps.cartocdn.com/light_all/5/18/11.png"
        },
        {
            id: "maptiler_hybrid",
            name_tr: "MapTiler Satellite Hybrid",
            name_en: "MapTiler Satellite Hybrid",
            desc_tr: "Yüksek çözünürlüklü uydu görüntüsü üzerinde ülke sınırları, otoyollar ve şehir isimleri etiketleri.",
            desc_en: "Satellite imagery with overlaid borders, highways, and place labels.",
            tags: ["maptiler", "sat"],
            badge_tr: "MapTiler • Uydu + Sınır",
            badge_en: "MapTiler • Satellite + Labels",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/hybrid/256/5/18/11.jpg?key={key}"
        },
        {
            id: "maptiler_satellite",
            name_tr: "MapTiler Satellite V2",
            name_en: "MapTiler Satellite V2",
            desc_tr: "Yazısız ve etiketsiz saf uydu fotoğrafı. Arka plan animasyonları için temiz zemin.",
            desc_en: "Pure satellite imagery without any labels or overlays.",
            tags: ["maptiler", "sat"],
            badge_tr: "MapTiler • Saf Uydu",
            badge_en: "MapTiler • Pure Satellite",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/satellite/256/5/18/11.jpg?key={key}"
        },
        {
            id: "maptiler_dataviz_dark",
            name_tr: "MapTiler Dataviz Dark",
            name_en: "MapTiler Dataviz Dark",
            desc_tr: "Orijinal GEOlayers 3'ün vazgeçilmez karanlık veri görselleştirme stili.",
            desc_en: "Iconic GEOlayers 3 dark style crafted for broadcast and motion design.",
            tags: ["maptiler", "dark"],
            badge_tr: "MapTiler • GEOlayers Klasik",
            badge_en: "MapTiler • GEOlayers Classic",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/dataviz-dark/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_dataviz_light",
            name_tr: "MapTiler Dataviz Light",
            name_en: "MapTiler Dataviz Light",
            desc_tr: "Açık renkli veri görselleştirme ve infografik harita stili.",
            desc_en: "Light theme optimized for clean data visualization and charts.",
            tags: ["maptiler", "light"],
            badge_tr: "MapTiler • Dataviz Açık",
            badge_en: "MapTiler • Dataviz Light",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/dataviz-light/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_streets",
            name_tr: "MapTiler Streets V2",
            name_en: "MapTiler Streets V2",
            desc_tr: "Yüksek çözünürlüklü sokak, bina ve yerleşim haritası.",
            desc_en: "High-resolution streets, building footprints, and city landmarks.",
            tags: ["maptiler", "street"],
            badge_tr: "MapTiler • Şehir & Sokak",
            badge_en: "MapTiler • Streets V2",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/streets-v2/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_backdrop",
            name_tr: "MapTiler Backdrop",
            name_en: "MapTiler Backdrop",
            desc_tr: "Yumuşak kabartmalı, sakin ve dikkat dağıtmayan arka plan haritası.",
            desc_en: "Subtle shaded relief background basemap.",
            tags: ["maptiler", "topo"],
            badge_tr: "MapTiler • Sade Rölyef",
            badge_en: "MapTiler • Soft Relief",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/backdrop/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_ocean",
            name_tr: "MapTiler Ocean & Batimetri",
            name_en: "MapTiler Ocean & Bathymetry",
            desc_tr: "Deniz derinlikleri, okyanus batimetrisi ve su altı kabartması.",
            desc_en: "Detailed bathymetry, ocean floor relief, and marine depths.",
            tags: ["maptiler", "topo"],
            badge_tr: "MapTiler • Okyanus",
            badge_en: "MapTiler • Ocean",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/ocean/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_topo",
            name_tr: "MapTiler Topo V2 (3D Dağ)",
            name_en: "MapTiler Topo V2 (3D Mountain)",
            desc_tr: "Güçlü 3D gölgelendirmeli dağ ve kanyon topoğrafyası.",
            desc_en: "Dramatic 3D hillshaded topography and natural terrain contours.",
            tags: ["maptiler", "topo"],
            badge_tr: "MapTiler • 3D Gölgeli",
            badge_en: "MapTiler • 3D Hillshade",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/topo-v2/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_outdoor",
            name_tr: "MapTiler Outdoor V2",
            name_en: "MapTiler Outdoor V2",
            desc_tr: "Doğa yürüyüşü, milli parklar, zirveler ve açık hava rotaları.",
            desc_en: "Outdoor trails, hiking tracks, elevation contours, and parks.",
            tags: ["maptiler", "topo"],
            badge_tr: "MapTiler • Doğa & Parklar",
            badge_en: "MapTiler • Outdoor",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/outdoor-v2/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_winter",
            name_tr: "MapTiler Winter V2 (Kar)",
            name_en: "MapTiler Winter V2 (Snow)",
            desc_tr: "Karlı dağlar, kayak pistleri ve kış temalı soğuk renk paleti.",
            desc_en: "Winter sports theme with snow-capped peaks and ski slopes.",
            tags: ["maptiler", "topo"],
            badge_tr: "MapTiler • Kış & Kar",
            badge_en: "MapTiler • Winter Snow",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/winter-v2/256/5/18/11.png?key={key}"
        },
        {
            id: "maptiler_aquarelle",
            name_tr: "MapTiler Aquarelle (Suluboya)",
            name_en: "MapTiler Aquarelle (Watercolor)",
            desc_tr: "Suluboya sanatsal fırça darbeleriyle çizilmiş estetik harita.",
            desc_en: "Artistic watercolor style with hand-painted textures.",
            tags: ["maptiler", "art"],
            badge_tr: "MapTiler • Suluboya Sanatı",
            badge_en: "MapTiler • Watercolor Art",
            badgeClass: "maptiler",
            requiresKey: true,
            previewPattern: "https://api.maptiler.com/maps/aquarelle/256/5/18/11.png?key={key}"
        }
    ];

    var TILE_PROVIDERS = {
        // --- Free Open Providers (Zero API Key Required) ---
        carto_dark: {
            name: "CartoDB Dark Matter",
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c"],
            attribution: "© OpenStreetMap contributors • © CARTO"
        },
        esri_sat: {
            name: "Esri World Imagery",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            subdomains: ["a"],
            attribution: "© Esri — Source: Esri, Maxar, Earthstar Geographics"
        },
        osm_std: {
            name: "OpenStreetMap Standard",
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            subdomains: ["a"],
            attribution: "© OpenStreetMap contributors"
        },
        opentopo: {
            name: "OpenTopoMap",
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c"],
            attribution: "© OpenTopoMap (CC-BY-SA) • © OpenStreetMap"
        },
        carto_voyager: {
            name: "CartoDB Voyager",
            url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c"],
            attribution: "© OpenStreetMap contributors • © CARTO"
        },
        carto_light: {
            name: "CartoDB Positron",
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c"],
            attribution: "© OpenStreetMap contributors • © CARTO"
        },

        // --- MapTiler Cloud Providers (Free API Key at cloud.maptiler.com) ---
        maptiler_hybrid: {
            name: "MapTiler Satellite Hybrid",
            url: "https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_satellite: {
            name: "MapTiler Satellite V2",
            url: "https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_dataviz_dark: {
            name: "MapTiler Dataviz Dark",
            url: "https://api.maptiler.com/maps/dataviz-dark/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_dataviz_light: {
            name: "MapTiler Dataviz Light",
            url: "https://api.maptiler.com/maps/dataviz-light/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_streets: {
            name: "MapTiler Streets V2",
            url: "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_backdrop: {
            name: "MapTiler Backdrop",
            url: "https://api.maptiler.com/maps/backdrop/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_ocean: {
            name: "MapTiler Ocean & Bathymetry",
            url: "https://api.maptiler.com/maps/ocean/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_topo: {
            name: "MapTiler Topo V2 (3D Hillshade)",
            url: "https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_outdoor: {
            name: "MapTiler Outdoor V2",
            url: "https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_winter: {
            name: "MapTiler Winter V2",
            url: "https://api.maptiler.com/maps/winter-v2/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        },
        maptiler_aquarelle: {
            name: "MapTiler Aquarelle (Watercolor)",
            url: "https://api.maptiler.com/maps/aquarelle/256/{z}/{x}/{y}.png?key={key}",
            subdomains: ["a"],
            requiresKey: true,
            attribution: "© MapTiler • © OpenStreetMap contributors"
        }
    };

    function getConfigFilePath() {
        if (typeof window.require !== "function") return null;
        try {
            var os = window.require("os");
            var path = window.require("path");
            return path.join(os.homedir(), ".opengeolayers_config.json");
        } catch (e) {
            return null;
        }
    }

    function loadSavedMapTilerKey() {
        var k = "";
        try {
            k = (localStorage.getItem("opengeolayers_maptiler_key") || "").trim();
        } catch (e) {}
        if (!k) {
            var cfgPath = getConfigFilePath();
            if (cfgPath) {
                try {
                    var fs = window.require("fs");
                    if (fs.existsSync(cfgPath)) {
                        var parsed = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
                        if (parsed && parsed.maptilerKey) {
                            k = String(parsed.maptilerKey).trim();
                        }
                    }
                } catch (e2) {}
            }
        }
        maptilerApiKey = k;
        syncMapTilerInputsAndBadges();
        return k;
    }

    function saveMapTilerKey(rawKey) {
        var clean = String(rawKey || "").trim();
        maptilerApiKey = clean;
        try {
            if (clean) {
                localStorage.setItem("opengeolayers_maptiler_key", clean);
            } else {
                localStorage.removeItem("opengeolayers_maptiler_key");
            }
        } catch (e) {}

        var cfgPath = getConfigFilePath();
        if (cfgPath) {
            try {
                var fs = window.require("fs");
                fs.writeFileSync(cfgPath, JSON.stringify({ maptilerKey: clean, updatedAt: new Date().toISOString() }, null, 2), "utf8");
            } catch (e2) {}
        }
        syncMapTilerInputsAndBadges();
    }

    function syncMapTilerInputsAndBadges() {
        var qInp = document.getElementById("inpMapTilerKeyQuick");
        var pInp = document.getElementById("inpMapTilerKeyPrefs");
        var floatBtn = document.getElementById("btnToggleMapTilerDrawer");
        var floatLbl = document.getElementById("lblMapTilerKeyBtn");
        var prefsBadge = document.getElementById("maptilerPrefsBadge");

        if (qInp && qInp.value !== maptilerApiKey) qInp.value = maptilerApiKey;
        if (pInp && pInp.value !== maptilerApiKey) pInp.value = maptilerApiKey;

        var hasKey = maptilerApiKey.length > 4;
        if (floatBtn) floatBtn.classList.toggle("has-key", hasKey);
        if (floatLbl) floatLbl.textContent = hasKey ? "✓ MapTiler Active" : "🔑 MapTiler Key";
        if (prefsBadge) {
            prefsBadge.textContent = hasKey ? "✓ MapTiler Active" : "Optional / No Key";
            prefsBadge.style.color = hasKey ? "#6ee7b7" : "";
        }
    }

    function openMapTilerKeyPortal() {
        var url = "https://cloud.maptiler.com/account/keys/";
        try {
            if (csInterface && typeof csInterface.openURLInDefaultBrowser === "function") {
                csInterface.openURLInDefaultBrowser(url);
                setStatus("Tarayıcıda MapTiler API Keys sayfası açıldı: " + url);
                return;
            }
        } catch (e) {}
        if (typeof window.require === "function") {
            try {
                var cp = window.require("child_process");
                var cmd = process.platform === "win32" ? 'start "" "' + url + '"' : 'open "' + url + '"';
                cp.exec(cmd);
                setStatus("Tarayıcıda MapTiler API Keys sayfası açıldı.");
                return;
            } catch (e2) {}
        }
        window.open(url, "_blank");
    }

    function verifyAndSaveMapTilerKey(rawKey) {
        var clean = String(rawKey || "").trim();
        if (!clean) {
            saveMapTilerKey("");
            setStatus("MapTiler API anahtarı temizlendi. Ücretsiz açık kaynak haritalar aktif.");
            var sel = document.getElementById("tileProviderSelect");
            if (sel && sel.value.indexOf("maptiler_") === 0) {
                sel.value = "esri_sat";
                switchTileProvider("esri_sat");
            }
            return;
        }

        setStatus("MapTiler API anahtarı doğrulanıyor...");
        var testUrl = "https://api.maptiler.com/maps/hybrid/256/2/2/1.jpg?key=" + encodeURIComponent(clean);
        fetch(testUrl, { mode: "cors" })
            .then(function (resp) {
                if (!resp.ok) throw new Error("Geçersiz API Key (HTTP " + resp.status + ")");
                saveMapTilerKey(clean);
                var drawer = document.getElementById("maptilerQuickDrawer");
                if (drawer) drawer.classList.add("hidden");
                var sel = document.getElementById("tileProviderSelect");
                if (sel) {
                    if (sel.value.indexOf("maptiler_") !== 0) {
                        sel.value = "maptiler_hybrid";
                    }
                    switchTileProvider(sel.value);
                }
                setStatus("✓ MapTiler Cloud API anahtarı doğrulandı ve kaydedildi! MapTiler katmanları ve Geocoding aktif.");
            })
            .catch(function (err) {
                // Save anyway in case offline, but notify user
                saveMapTilerKey(clean);
                setStatus("MapTiler API Key kaydedildi, ancak doğrulama yanıtı alınamadı: " + err.message, true);
            });
    }

    function setStatus(message, isError) {
        var el = document.getElementById("toastStatusMsg");
        if (!el) return;
        el.textContent = message;
        el.style.color = isError ? "#fb7185" : "#7dd3fc";
    }

    function getPreviewToCompZoomOffset() {
        var box = document.getElementById("mapcompGuideBox");
        var resEl = document.getElementById("compResPreset");
        var resVal = ((resEl && resEl.value) ? resEl.value : "1920x1080").split("x");
        var compW = window.__activeCompWidth || parseInt(resVal[0], 10) || 1920;
        var compH = window.__activeCompHeight || parseInt(resVal[1], 10) || 1080;
        var boxH = (box && box.clientHeight > 40) ? box.clientHeight : 240;
        var pitchEl = document.getElementById("inpViewPitch");
        var pitch = pitchEl ? (parseFloat(pitchEl.value) || 0) : 0;
        var scaleCompensate = 1 + (pitch / 160);
        var ratio = (compH / boxH) * scaleCompensate;
        return Math.log(Math.max(1.0, ratio)) / Math.LN2;
    }

    function getMapcompSettings() {
        var resVal = (document.getElementById("compResPreset").value || "1920x1080").split("x");
        var lat = parseFloat(document.getElementById("inpViewLat").value) || 39.9255;
        var lon = parseFloat(document.getElementById("inpViewLon").value) || 32.8663;
        var previewZoom = parseFloat(document.getElementById("inpViewZoom").value) || 6.0;
        var zoom = Math.min(18.5, Math.max(2.8, previewZoom + getPreviewToCompZoomOffset()));
        var pitch = parseFloat(document.getElementById("inpViewPitch").value) || 0;
        var bearing = parseFloat(document.getElementById("inpViewBearing").value) || 0;
        var provKey = document.getElementById("tileProviderSelect").value || "carto_dark";
        var prov = TILE_PROVIDERS[provKey] || TILE_PROVIDERS.carto_dark;
        var isMotionBlur = document.getElementById("chkMotionBlur") ? document.getElementById("chkMotionBlur").checked : true;
        var sAngle = document.getElementById("compShutterAngle") ? (parseFloat(document.getElementById("compShutterAngle").value) || 180) : 180;
        var sPhase = document.getElementById("compShutterPhase") ? (parseFloat(document.getElementById("compShutterPhase").value) || -90) : -90;
        return {
            compName: document.getElementById("compNameInput").value || "Mapcomp 1",
            width: parseInt(resVal[0], 10) || 1920,
            height: parseInt(resVal[1], 10) || 1080,
            fps: parseFloat(document.getElementById("compFpsInput").value) || 30,
            duration: parseFloat(document.getElementById("compDurationInput").value) || 15,
            bgColor: document.getElementById("compBgColorInput").value || "#0b1120",
            centerLat: lat,
            centerLon: lon,
            zoom: zoom,
            pitch: pitch,
            bearing: bearing,
            autoZoomArc: document.getElementById("chkAutoZoomArc").checked,
            multiZoomBlend: document.getElementById("chkMultiZoomBlend").checked,
            showAttribution: document.getElementById("chkShowAttribution").checked,
            attributionText: prov.attribution,
            motionBlur: isMotionBlur,
            shutterAngle: sAngle,
            shutterPhase: sPhase,
            mapLabelLang: activeMapLabelLang || "tr",
            is3D: true
        };
    }

    function getActiveShapeStyle() {
        return {
            fillColor: document.getElementById("borderFillColor").value || "#38bdf8",
            strokeColor: document.getElementById("borderStrokeColor").value || "#f8fafc",
            strokeWidth: parseFloat(document.getElementById("borderStrokeWidth").value) || 4,
            fillOpacity: parseFloat(document.getElementById("borderFillOpacity").value) || 35,
            extrudeDepth: parseFloat(document.getElementById("borderExtrudeDepth").value) || 0,
            animDuration: parseFloat(document.getElementById("borderAnimDuration").value) || 2.5,
            animateTrim: document.getElementById("borderAnimateTrim").checked,
            dashed: document.getElementById("borderDashedStroke").checked
        };
    }

    function ensureHostScriptLoaded(callback) {
        if (!csInterface || !csInterface.isInsideAE()) {
            if (callback) callback();
            return;
        }
        try {
            var raw = csInterface.getSystemPath(window.SystemPath ? window.SystemPath.EXTENSION : "extension");
            var clean = decodeURIComponent(raw.replace(/^file:\/\//, ""));
            var jsx = clean + "/host/index.jsx";
            var script = 'try { $.evalFile(new File("' + jsx + '")); "OK"; } catch(e) { "ERR:" + e.toString(); }';
            csInterface.evalScript(script, function (res) {
                console.log("[GeoMotion] Host script evaluated:", res);
                if (callback) callback();
            });
        } catch (e) {
            console.error("[GeoMotion] Failed to load host script:", e);
            if (callback) callback();
        }
    }

    function callHost(fnName, payloadObj, callback) {
        var jsonStr = JSON.stringify(payloadObj);
        var escaped = jsonStr.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        var script = "(typeof GeoMotionHost !== 'undefined' ? GeoMotionHost : OpenGeoLayersHost)." + fnName + "('" + escaped + "')";
        csInterface.evalScript(script, function (resStr) {
            try {
                var parsed = JSON.parse(resStr);
                if (parsed.ok) {
                    if (parsed.message) setStatus(parsed.message);
                } else {
                    setStatus("AE Hatası: " + (parsed.error || "Bilinmeyen hata"), true);
                }
                if (callback) callback(parsed);
            } catch (e) {
                if (callback) callback({ ok: true, raw: resStr });
            }
        });
    }

    function updateMapPerspectivePreview() {
        var pitch = parseFloat(document.getElementById("inpViewPitch").value) || 0;
        var bearing = parseFloat(document.getElementById("inpViewBearing").value) || 0;
        var stage = document.getElementById("mapPerspectiveContainer");
        if (stage) {
            var scaleCompensate = 1 + (pitch / 160);
            stage.style.transform =
                "scale(" + scaleCompensate.toFixed(2) + ") rotateX(" + (pitch * 0.65).toFixed(1) + "deg) rotateZ(" + bearing.toFixed(1) + "deg)";
        }
        var needle = document.getElementById("compassNeedle");
        if (needle) {
            needle.style.transform = "rotate(" + bearing + "deg)";
        }
    }

    var activeGalleryFilter = "all";

    function loadSavedUiScale() {
        var s = "115";
        try {
            s = localStorage.getItem("opengeolayers_ui_scale") || "115";
        } catch (e) {}
        setUiScale(s);
    }

    function setUiScale(scale) {
        currentUiScale = scale || "115";
        try {
            localStorage.setItem("opengeolayers_ui_scale", currentUiScale);
        } catch (e) {}
        document.body.classList.remove("gl-ui-scale-115", "gl-ui-scale-130");
        if (currentUiScale === "115") {
            document.body.classList.add("gl-ui-scale-115");
        } else if (currentUiScale === "130") {
            document.body.classList.add("gl-ui-scale-130");
        }
        var btnLbl = document.getElementById("lblUiScale");
        if (btnLbl) {
            btnLbl.textContent = (currentUiScale === "130") ? "A++ %130" : ((currentUiScale === "115") ? "A+ %115" : "A %100");
        }
        var sel = document.getElementById("prefsUiScaleSelect");
        if (sel) sel.value = currentUiScale;
    }

    function cycleUiScale() {
        if (currentUiScale === "100") setUiScale("115");
        else if (currentUiScale === "115") setUiScale("130");
        else setUiScale("100");
        setStatus(currentLang === "tr" ? ("Panel Yazı & Arayüz Ölçeği: %" + currentUiScale) : ("Panel UI Scale: " + currentUiScale + "%"));
    }

    function loadSavedMapLabelLang() {
        var l = "tr";
        try {
            l = localStorage.getItem("opengeolayers_map_label_lang") || "tr";
        } catch (e) {}
        setMapLabelLang(l, true);
    }

    function setMapLabelLang(lang, skipReload) {
        activeMapLabelLang = lang || "tr";
        try {
            localStorage.setItem("opengeolayers_map_label_lang", activeMapLabelLang);
        } catch (e) {}
        var s1 = document.getElementById("mapLabelLangSelect");
        if (s1 && s1.value !== activeMapLabelLang) s1.value = activeMapLabelLang;
        var s2 = document.getElementById("prefsMapLabelLangSelect");
        if (s2 && s2.value !== activeMapLabelLang) s2.value = activeMapLabelLang;

        if (!skipReload) {
            var curProv = document.getElementById("tileProviderSelect").value;
            if (curProv && curProv.indexOf("maptiler") === 0) {
                switchTileProvider(curProv);
            }
        }
        var langNames = { tr: "Türkçe", en: "English", local: "Yerel / Local", de: "Deutsch", fr: "Français", es: "Español" };
        var lName = langNames[activeMapLabelLang] || activeMapLabelLang;
        setStatus(currentLang === "tr" ? ("Harita Yazı Dili: " + lName) : ("Map Labels Language: " + lName));
    }

    function applyMotionBlurToAE(enabled) {
        var chk = document.getElementById("chkMotionBlur");
        var sel = document.getElementById("compMotionBlurSelect");
        if (typeof enabled === "boolean") {
            if (chk) chk.checked = enabled;
            if (sel) sel.value = enabled ? "true" : "false";
        } else {
            enabled = chk ? chk.checked : true;
        }
        var pill = document.getElementById("lblMotionBlurPill");
        if (pill) pill.classList.toggle("active", enabled);

        var tag = document.getElementById("tagMotionBlurStatus");
        if (tag) {
            tag.textContent = enabled ? (currentLang === "tr" ? "Aktif (Açık)" : "Active (Enabled)") : (currentLang === "tr" ? "Kapalı" : "Disabled");
            tag.style.color = enabled ? "#38bdf8" : "#94a3b8";
        }

        var sAngle = document.getElementById("compShutterAngle") ? (parseFloat(document.getElementById("compShutterAngle").value) || 180) : 180;
        var sPhase = document.getElementById("compShutterPhase") ? (parseFloat(document.getElementById("compShutterPhase").value) || -90) : -90;

        callHost("setMapcompMotionBlur", {
            motionBlur: enabled,
            shutterAngle: sAngle,
            shutterPhase: sPhase
        }, function (res) {
            if (res && res.message) {
                setStatus(res.message);
            }
        });
    }

    function loadSavedLanguage() {
        var l = "tr";
        try {
            l = localStorage.getItem("opengeolayers_lang") || "tr";
        } catch (e) {}
        currentLang = (l === "en") ? "en" : "tr";
        applyLanguage(currentLang);
        return currentLang;
    }

    function setLanguage(lang) {
        currentLang = (lang === "en") ? "en" : "tr";
        try {
            localStorage.setItem("opengeolayers_lang", currentLang);
        } catch (e) {}
        applyLanguage(currentLang);
        renderMapStyleGallery(activeGalleryFilter);
        setStatus(currentLang === "tr" ? "Dil Türkçe olarak ayarlandı." : "Language switched to English.");
    }

    function applyLanguage(lang) {
        var t = I18N[lang] || I18N.tr;
        var isTr = (lang === "tr");

        var langBadge = document.getElementById("lblCurrentLang");
        if (langBadge) langBadge.textContent = t.langTag;

        var newBtnSpan = document.querySelector("#btnCreateMapcomp span");
        if (newBtnSpan) newBtnSpan.textContent = t.newComp;

        var kfBtn = document.getElementById("lblKeyframeBtn");
        if (kfBtn) kfBtn.textContent = t.keyframeBtn;

        var finBtn = document.getElementById("lblFinalizeBtn");
        if (finBtn) finBtn.textContent = isTr ? "Finalize (İşle)" : "Finalize";

        var searchInp = document.getElementById("globalSearchInput");
        if (searchInp) searchInp.placeholder = t.searchPlaceholder;

        var searchBtn = document.getElementById("btnSearchGo");
        if (searchBtn) searchBtn.textContent = t.searchBtn;

        // Navigation Tabs
        var tabList = document.querySelectorAll(".gl-tab");
        if (tabList.length >= 5) {
            tabList[0].textContent = t.tabCollection;
            tabList[1].textContent = t.tabStyles;
            tabList[2].textContent = t.tabLabels;
            tabList[3].textContent = t.tabRoutes;
            tabList[4].textContent = t.tabPrefs;
        }

        // Feature Browser Buttons
        var btnAddB = document.getElementById("btnDownloadFeatureToCollection");
        if (btnAddB) btnAddB.textContent = t.boundaryBtn;
        var btnRds = document.getElementById("btnOverpassRoads");
        if (btnRds) btnRds.textContent = t.roadsBtn;
        var btnRvs = document.getElementById("btnOverpassRivers");
        if (btnRvs) btnRvs.textContent = t.riversBtn;
        var lblFile = document.querySelector(".gl-file-label span");
        if (lblFile) lblFile.textContent = t.fileBtn;
        var btnDrawF = document.getElementById("btnDrawSelectedFeature");
        if (btnDrawF) {
            var txtSpan = btnDrawF.querySelector("span");
            if (txtSpan) txtSpan.textContent = t.drawFeatureBtn;
        }
        var btnFitF = document.getElementById("btnFitSelectedFeature");
        if (btnFitF) btnFitF.textContent = t.fitViewBtn;
        var btnLblF = document.getElementById("btnLabelSelectedFeature");
        if (btnLblF) btnLblF.textContent = t.addLabelBtn;

        // Route & Animate Buttons
        var btnPrevR = document.getElementById("btnCalcRoutePreview");
        if (btnPrevR) btnPrevR.textContent = t.previewPath;
        var btnSendR = document.getElementById("btnSendRouteToAE");
        if (btnSendR) btnSendR.textContent = t.drawRouteBtn;
        var btnFlyTo = document.getElementById("btnAnimateCameraFlyTo");
        if (btnFlyTo) btnFlyTo.textContent = t.generateFlyTo;

        // 3D DEM Buttons
        var btnDem = document.getElementById("btnGenerate3DTerrain");
        if (btnDem) btnDem.textContent = t.buildDemBtn;
        var btnBars = document.getElementById("btnCreateDataChart");
        if (btnBars) btnBars.textContent = t.drawDataBarsBtn;

        // Motion Blur & UI Cards
        var mbCard = document.getElementById("i18n_motionBlurCardTitle");
        if (mbCard) mbCard.textContent = t.motionBlurCardTitle;
        var mbToggleLbl = document.getElementById("i18n_mblurToggleLabel");
        if (mbToggleLbl) mbToggleLbl.textContent = t.mblurToggleLabel;
        var shAngLbl = document.getElementById("i18n_shutterAngleLabel");
        if (shAngLbl) shAngLbl.textContent = t.shutterAngleLabel;
        var shPhLbl = document.getElementById("i18n_shutterPhaseLabel");
        if (shPhLbl) shPhLbl.textContent = t.shutterPhaseLabel;
        var btnApplyMb = document.getElementById("btnApplyMotionBlurNow");
        if (btnApplyMb) btnApplyMb.textContent = t.applyMotionBlurBtn;

        var accCard = document.getElementById("i18n_accessCardTitle");
        if (accCard) accCard.textContent = t.accessCardTitle;
        var mapLangLbl = document.getElementById("i18n_prefsMapLangLabel");
        if (mapLangLbl) mapLangLbl.textContent = t.prefsMapLangLabel;
        var uiScaleLbl = document.getElementById("i18n_prefsUiScaleLabel");
        if (uiScaleLbl) uiScaleLbl.textContent = t.prefsUiScaleLabel;

        // Comp Manager Modal Texts
        var btnCompSet = document.querySelector("#btnOpenCompSettings span");
        if (btnCompSet) btnCompSet.textContent = t.compSettingsBtn;
        var cmTitle = document.getElementById("i18n_compModalTitle");
        if (cmTitle) cmTitle.textContent = t.compModalTitle;
        var cmSub = document.getElementById("i18n_compModalSubtitle");
        if (cmSub) cmSub.textContent = t.compModalSubtitle;
        var cmTabR = document.getElementById("i18n_cmTabResize");
        if (cmTabR) cmTabR.textContent = t.cmTabResize;
        var cmTabD = document.getElementById("i18n_cmTabDuplicate");
        if (cmTabD) cmTabD.textContent = t.cmTabDuplicate;
        var cmTabT = document.getElementById("i18n_cmTabTools");
        if (cmTabT) cmTabT.textContent = t.cmTabTools;

        // Modal Texts
        var mTitle = document.getElementById("i18n_modalTitle");
        if (mTitle) mTitle.textContent = t.modalTitle;
        var mSub = document.getElementById("i18n_modalSubtitle");
        if (mSub) mSub.textContent = t.modalSubtitle;
        var mSelLbl = document.getElementById("i18n_modalSelectedLabel");
        if (mSelLbl) mSelLbl.textContent = t.modalSelectedLabel;
        var mApply = document.getElementById("btnConfirmMapStyle");
        if (mApply) mApply.textContent = t.modalApplyBtn;
        var mMtKey = document.getElementById("btnModalOpenMapTiler");
        if (mMtKey) mMtKey.textContent = t.modalMtKeyBtn;

        // Filter tabs
        var fAll = document.getElementById("filter_all");
        if (fAll) fAll.textContent = t.filterAll;
        var fFree = document.getElementById("filter_free");
        if (fFree) fFree.textContent = t.filterFree;
        var fSat = document.getElementById("filter_sat");
        if (fSat) fSat.textContent = t.filterSat;
        var fDark = document.getElementById("filter_dark");
        if (fDark) fDark.textContent = t.filterDark;
        var fMt = document.getElementById("filter_maptiler");
        if (fMt) fMt.textContent = t.filterMaptiler;

        updateActiveMapStylePillLabel();
    }

    function openMapStyleModal() {
        var modal = document.getElementById("mapStyleModal");
        if (!modal) return;
        modal.classList.remove("hidden");
        var curVal = document.getElementById("tileProviderSelect").value || "esri_sat";
        selectedModalStyleId = curVal;
        renderMapStyleGallery(activeGalleryFilter);
        updateModalSelectionFooter(curVal);
    }

    function closeMapStyleModal() {
        var modal = document.getElementById("mapStyleModal");
        if (modal) modal.classList.add("hidden");
    }

    var isDraftModeActive = false;
    var isLayersLocked = false;
    var activeStretchFactor = 2.0;

    function openCompSettingsModal() {
        var modal = document.getElementById("compSettingsModal");
        if (!modal) return;
        modal.classList.remove("hidden");
        refreshActiveCompDetails();
    }

    function closeCompSettingsModal() {
        var modal = document.getElementById("compSettingsModal");
        if (modal) modal.classList.add("hidden");
    }

    function refreshActiveCompDetails(callback) {
        var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
        callHost("getMapcompDetails", { compName: curName }, function (res) {
            if (res && res.ok) {
                var badge = document.getElementById("lblModalActiveCompBadge");
                if (badge) {
                    badge.textContent = res.name + " • " + res.width + "×" + res.height + " (" + res.fps + " FPS, " + parseFloat(res.duration).toFixed(1) + "s)";
                }
                var wInp = document.getElementById("cmResizeWidth");
                if (wInp) wInp.value = res.width;
                var hInp = document.getElementById("cmResizeHeight");
                if (hInp) hInp.value = res.height;
                var fpsSel = document.getElementById("cmResizeFps");
                if (fpsSel) fpsSel.value = String(res.fps);
                var durInp = document.getElementById("cmResizeDuration");
                if (durInp) durInp.value = res.duration;

                // Set suggested duplicate name
                var dupNameInp = document.getElementById("cmDupTargetName");
                if (dupNameInp) {
                    dupNameInp.value = res.name + " (Reels 9:16)";
                }

                // Sync active comp real dimensions to Guide Box & preset
                if (res.width && res.height) {
                    window.__activeCompWidth = parseInt(res.width, 10);
                    window.__activeCompHeight = parseInt(res.height, 10);
                    var presetEl = document.getElementById("compResPreset");
                    if (presetEl) {
                        var dimKey = window.__activeCompWidth + "x" + window.__activeCompHeight;
                        for (var oi = 0; oi < presetEl.options.length; oi++) {
                            if (presetEl.options[oi].value === dimKey) {
                                presetEl.value = dimKey;
                                break;
                            }
                        }
                    }
                    updateMapcompGuideBox(window.__activeCompWidth, window.__activeCompHeight);
                }

                // Sync allMapcomps dropdown if returned
                if (res.allMapcomps && res.allMapcomps.length) {
                    syncMapcompDropdown(res.allMapcomps, res.name);
                }
            }
            if (typeof callback === "function") callback(res);
        });
    }

    function syncMapcompDropdown(compList, currentActive) {
        var sel = document.getElementById("activeMapcompSelect");
        if (!sel || !compList || !compList.length) return;
        sel.innerHTML = "";
        for (var i = 0; i < compList.length; i++) {
            var opt = document.createElement("option");
            opt.value = compList[i];
            opt.textContent = compList[i];
            if (compList[i] === currentActive) opt.selected = true;
            sel.appendChild(opt);
        }
    }

    function updateModalSelectionFooter(styleId) {
        var st = STYLE_CATALOG.find(function (s) { return s.id === styleId; }) || STYLE_CATALOG[0];
        var isTr = (currentLang === "tr");
        var nameEl = document.getElementById("modalSelectedName");
        var badgeEl = document.getElementById("modalSelectedBadge");
        if (nameEl) nameEl.textContent = isTr ? st.name_tr : st.name_en;
        if (badgeEl) {
            badgeEl.textContent = isTr ? st.badge_tr : st.badge_en;
            badgeEl.className = "gl-badge-pill " + (st.badgeClass || (st.requiresKey ? "maptiler" : "free"));
        }
    }

    function renderMapStyleGallery(filterTag) {
        activeGalleryFilter = filterTag || "all";
        var grid = document.getElementById("mapGalleryGrid");
        if (!grid) return;
        grid.innerHTML = "";
        var isTr = (currentLang === "tr");

        STYLE_CATALOG.forEach(function (st) {
            if (activeGalleryFilter !== "all") {
                if (activeGalleryFilter === "free" && st.requiresKey) return;
                if (activeGalleryFilter === "maptiler" && !st.requiresKey) return;
                if (activeGalleryFilter === "sat" && st.tags.indexOf("sat") === -1) return;
                if (activeGalleryFilter === "dark" && st.tags.indexOf("dark") === -1) return;
            }

            var card = document.createElement("div");
            card.className = "gl-map-card" + (st.id === selectedModalStyleId ? " selected" : "");
            card.setAttribute("data-id", st.id);

            var thumbWrap = document.createElement("div");
            thumbWrap.className = "gl-card-thumb-wrap";

            var previewSrc = "";
            if (st.previewUrl) {
                previewSrc = st.previewUrl;
            } else if (st.previewPattern) {
                previewSrc = st.previewPattern.replace("{key}", encodeURIComponent(maptilerApiKey || ""));
            }

            var img = document.createElement("img");
            img.className = "gl-card-thumb-img";
            img.alt = st.name_en;
            img.loading = "lazy";
            img.crossOrigin = "anonymous";
            img.src = previewSrc;

            img.onerror = function () {
                this.style.display = "none";
                thumbWrap.style.background = st.requiresKey
                    ? "linear-gradient(135deg, #1e293b, #0f172a)"
                    : "linear-gradient(135deg, #0f172a, #1e3a8a)";
            };

            var badge = document.createElement("span");
            badge.className = "gl-card-badge " + (st.badgeClass || (st.requiresKey ? "maptiler" : "free"));
            badge.textContent = isTr ? st.badge_tr : st.badge_en;

            var check = document.createElement("div");
            check.className = "gl-card-check";
            check.textContent = "✓";

            thumbWrap.appendChild(img);
            thumbWrap.appendChild(badge);
            thumbWrap.appendChild(check);

            var details = document.createElement("div");
            details.className = "gl-card-details";

            var title = document.createElement("div");
            title.className = "gl-card-title";
            title.textContent = isTr ? st.name_tr : st.name_en;

            var desc = document.createElement("div");
            desc.className = "gl-card-desc";
            desc.textContent = isTr ? st.desc_tr : st.desc_en;

            details.appendChild(title);
            details.appendChild(desc);

            card.appendChild(thumbWrap);
            card.appendChild(details);

            card.addEventListener("click", function () {
                selectedModalStyleId = st.id;
                var allCards = grid.querySelectorAll(".gl-map-card");
                allCards.forEach(function (c) { c.classList.remove("selected"); });
                card.classList.add("selected");
                updateModalSelectionFooter(st.id);
            });

            card.addEventListener("dblclick", function () {
                selectedModalStyleId = st.id;
                applySelectedMapStyle(st.id);
                closeMapStyleModal();
            });

            grid.appendChild(card);
        });
    }

    function updateActiveMapStylePillLabel() {
        var sel = document.getElementById("tileProviderSelect");
        var curVal = sel ? sel.value : "esri_sat";
        var st = STYLE_CATALOG.find(function (s) { return s.id === curVal; }) || STYLE_CATALOG[0];
        var isTr = (currentLang === "tr");
        var lbl = document.getElementById("lblActiveMapStyleName");
        if (lbl) lbl.textContent = isTr ? st.name_tr : st.name_en;

        var dot = document.getElementById("miniStyleDot");
        if (dot) {
            dot.style.background = (st.tags.indexOf("sat") !== -1)
                ? "#10b981"
                : (st.tags.indexOf("dark") !== -1 ? "#6366f1" : "#38bdf8");
        }
    }

    function applySelectedMapStyle(styleId) {
        var sel = document.getElementById("tileProviderSelect");
        if (sel) {
            sel.value = styleId;
        }
        switchTileProvider(styleId);
        updateActiveMapStylePillLabel();
    }

    function initMap() {
        map = L.map("leafletMap", {
            center: [39.9255, 32.8663],
            zoom: 6,
            minZoom: 2.0,
            maxZoom: 19,
            zoomControl: false,
            attributionControl: false
        });

        switchTileProvider("esri_sat");
        updateMapPerspectivePreview();
        updateActiveMapStylePillLabel();

        map.on("move zoom", function () {
            var c = map.getCenter();
            var z = map.getZoom();
            var inpLat = document.getElementById("inpViewLat");
            if (inpLat) inpLat.value = c.lat.toFixed(4);
            var inpLon = document.getElementById("inpViewLon");
            if (inpLon) inpLon.value = c.lng.toFixed(4);
            var inpZoom = document.getElementById("inpViewZoom");
            if (inpZoom) inpZoom.value = z;

            var slider = document.getElementById("mapZoomSlider");
            if (slider && !slider.matches(":active")) {
                slider.value = z.toFixed(1);
            }
            var lblZ = document.getElementById("lblZoomLevel");
            if (lblZ) {
                lblZ.textContent = "Z: " + z.toFixed(1);
            }
        });

        // Initialize safe camera guide box matching active comp resolution
        function syncGuideToPreset() {
            if (window.__activeCompWidth && window.__activeCompHeight) {
                updateMapcompGuideBox(window.__activeCompWidth, window.__activeCompHeight);
                return;
            }
            var resEl = document.getElementById("compResPreset");
            var parts = ((resEl && resEl.value) ? resEl.value : "1920x1080").split("x");
            updateMapcompGuideBox(parseInt(parts[0], 10) || 1920, parseInt(parts[1], 10) || 1080);
        }
        setTimeout(function () {
            syncGuideToPreset();
            if (typeof refreshActiveCompDetails === "function") {
                refreshActiveCompDetails();
            }
        }, 200);
        window.addEventListener("resize", syncGuideToPreset);

        map.on("moveend", function () {
            if (!liveLinkEnabled) return;
            var settings = getMapcompSettings();
            settings.setKeyframe = false;
            callHost("setMapcompViewKeyframe", settings);
        });

        // Interactive Right-Click Drag for 3D Pitch & Bearing (GEOlayers 3 standard)
        var mapEl = document.getElementById("leafletMap");
        if (mapEl) {
            var isRightDragging = false;
            var rStartX = 0, rStartY = 0, rStartPitch = 0, rStartBearing = 0;
            mapEl.addEventListener("contextmenu", function (ev) { ev.preventDefault(); });
            mapEl.addEventListener("mousedown", function (ev) {
                if (ev.button === 2) {
                    ev.preventDefault();
                    isRightDragging = true;
                    rStartX = ev.clientX;
                    rStartY = ev.clientY;
                    rStartPitch = parseFloat(document.getElementById("inpViewPitch").value) || 0;
                    rStartBearing = parseFloat(document.getElementById("inpViewBearing").value) || 0;
                }
            });
            window.addEventListener("mousemove", function (ev) {
                if (!isRightDragging) return;
                var dx = ev.clientX - rStartX;
                var dy = rStartY - ev.clientY;
                var newPitch = Math.max(0, Math.min(60, Math.round(rStartPitch + dy * 0.35)));
                var newBearing = Math.round(rStartBearing + dx * 0.6);
                if (newBearing > 180) newBearing -= 360;
                if (newBearing < -180) newBearing += 360;
                document.getElementById("inpViewPitch").value = newPitch;
                document.getElementById("inpViewBearing").value = newBearing;
                updateMapPerspectivePreview();
            });
            window.addEventListener("mouseup", function (ev) {
                if (isRightDragging && ev.button === 2) {
                    isRightDragging = false;
                    if (liveLinkEnabled) {
                        var s = getMapcompSettings();
                        s.setKeyframe = false;
                        callHost("setMapcompViewKeyframe", s);
                    }
                }
            });
        }

        // Click-to-Select Feature on Map (Reverse Geocode Polygon Picker)
        map.on("click", function (ev) {
            if (!window.__pickFeatureOnMapMode) return;
            var lat = ev.latlng.lat;
            var lon = ev.latlng.lng;
            var zoomLvl = Math.min(14, Math.max(3, Math.round(map.getZoom())));
            setStatus("🎯 Haritadan bölge seçiliyor (" + lat.toFixed(3) + ", " + lon.toFixed(3) + ")...");
            var revUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon + "&polygon_geojson=1&zoom=" + zoomLvl;
            fetch(revUrl, { headers: { "Accept-Language": currentLang || "tr" } })
                .then(function (r) { return r.json(); })
                .then(function (item) {
                    if (!item || !item.display_name) {
                        setStatus("Seçilen noktada idari sınır bulunamadı.", true);
                        return;
                    }
                    var shortName = item.name || item.display_name.split(",")[0];
                    var extracted = item.geojson ? extractPathsFromGeoJSON(item.geojson) : { paths: [], closed: true };
                    var feat = {
                        id: "pick_" + Date.now(),
                        name: shortName,
                        type: extracted.paths.length ? "PICKED POLYGON" : "PICKED POINT",
                        lat: parseFloat(item.lat || lat),
                        lon: parseFloat(item.lon || lon),
                        zoom: map.getZoom(),
                        geojson: item.geojson || null,
                        polygons: extracted.paths,
                        closed: extracted.closed
                    };
                    featureCollection.unshift(feat);
                    selectFeature(feat.id, false);
                    setStatus("🎯 Haritadan seçildi ve Feature Collection'a eklendi: " + shortName);
                })
                .catch(function (err) {
                    setStatus("Reverse Geocode hatası: " + err.message, true);
                });
        });
    }

    function switchTileProvider(providerKey) {
        var p = TILE_PROVIDERS[providerKey] || TILE_PROVIDERS.esri_sat;
        if (p.requiresKey && !maptilerApiKey) {
            var drawer = document.getElementById("maptilerQuickDrawer");
            if (drawer) drawer.classList.remove("hidden");
            var inp = document.getElementById("inpMapTilerKeyQuick");
            if (inp) inp.focus();
            setStatus(currentLang === "tr"
                ? "🔑 '" + p.name + "' için ücretsiz MapTiler API anahtarınızı girin veya 'Get Free Key ↗'e tıklayın."
                : "🔑 Please enter free MapTiler API key for '" + p.name + "'.", true);
            return;
        }
        if (activeTileLayer) map.removeLayer(activeTileLayer);
        var resolvedUrl = p.url.replace("{key}", encodeURIComponent(maptilerApiKey || ""));
        if (p.requiresKey && activeMapLabelLang && activeMapLabelLang !== "local") {
            resolvedUrl += (resolvedUrl.indexOf("?") === -1 ? "?" : "&") + "language=" + encodeURIComponent(activeMapLabelLang);
        }
        activeTileLayer = L.tileLayer(resolvedUrl, {
            subdomains: p.subdomains,
            maxZoom: 19,
            crossOrigin: "anonymous"
        }).addTo(map);
        updateActiveMapStylePillLabel();
        setStatus((currentLang === "tr" ? "Harita Stili: " : "Mapstyle Imagery: ") + p.name + (p.requiresKey ? " (MapTiler Cloud)" : ""));
    }

    function searchMapTilerGeocoding(query) {
        if (!maptilerApiKey) return Promise.resolve([]);
        var langParam = (activeMapLabelLang && activeMapLabelLang !== "local") ? (activeMapLabelLang + ",en") : "tr,en";
        var url = "https://api.maptiler.com/geocoding/" + encodeURIComponent(query) + ".json?key=" +
            encodeURIComponent(maptilerApiKey) + "&limit=5&language=" + encodeURIComponent(langParam);
        return fetch(url)
            .then(function (r) {
                if (!r.ok) return { features: [] };
                return r.json();
            })
            .then(function (data) {
                var feats = (data && data.features) || [];
                return feats.map(function (f) {
                    var center = f.center || (f.geometry && f.geometry.coordinates) || [32.85, 39.92];
                    return {
                        display_name: "[MapTiler] " + (f.place_name || f.text || query),
                        lat: String(center[1]),
                        lon: String(center[0]),
                        geojson: (f.geometry && f.geometry.type !== "Point") ? f.geometry : null,
                        source: "MapTiler"
                    };
                });
            })
            .catch(function () { return []; });
    }

    function searchPhotonPOI(query) {
        var center = (map && map.getCenter) ? map.getCenter() : { lat: 39.9255, lng: 32.8663 };
        var url = "https://photon.komoot.io/api/?q=" + encodeURIComponent(query) +
            "&limit=6&lat=" + center.lat.toFixed(4) + "&lon=" + center.lng.toFixed(4);
        return fetch(url)
            .then(function (r) {
                if (!r.ok) return { features: [] };
                return r.json();
            })
            .then(function (data) {
                var feats = (data && data.features) || [];
                return feats.map(function (f) {
                    var p = f.properties || {};
                    var c = (f.geometry && f.geometry.coordinates) || [0, 0];
                    var name = p.name || query;
                    var parts = [p.district, p.city || p.state, p.country];
                    var sub = parts.filter(Boolean).join(", ");
                    var tag = p.osm_value ? (" [" + p.osm_value + "]") : "";
                    return {
                        display_name: name + (sub ? (" (" + sub + ")") : "") + tag,
                        lat: String(c[1]),
                        lon: String(c[0]),
                        geojson: null,
                        source: "Photon"
                    };
                });
            })
            .catch(function () { return []; });
    }

    function searchNominatimOnly(query, withPolygon) {
        var langHeader = (activeMapLabelLang && activeMapLabelLang !== "local") ? (activeMapLabelLang + ",tr,en") : "tr,en";
        var boundsParam = "";
        if (map && map.getBounds) {
            try {
                var b = map.getBounds();
                boundsParam = "&viewbox=" + b.getWest().toFixed(4) + "," + b.getNorth().toFixed(4) + "," + b.getEast().toFixed(4) + "," + b.getSouth().toFixed(4) + "&bounded=0";
            } catch (e) {}
        }
        var url = "https://nominatim.openstreetmap.org/search?format=json&limit=8&q=" +
            encodeURIComponent(query) +
            boundsParam +
            (withPolygon ? "&polygon_geojson=1" : "");
        return fetch(url, { headers: { "Accept-Language": langHeader } })
            .then(function (r) { return r.json(); })
            .catch(function () { return []; });
    }

    function searchNominatim(query, withPolygon) {
        var modeEl = document.getElementById("searchEngineProviderSelect");
        var mode = modeEl ? modeEl.value : "hybrid";

        var promises = [
            searchNominatimOnly(query, withPolygon),
            searchPhotonPOI(query)
        ];
        if (maptilerApiKey && mode !== "nominatim") {
            promises.push(searchMapTilerGeocoding(query));
        }

        return Promise.all(promises).then(function (lists) {
            var nomList = lists[0] || [];
            var phList = lists[1] || [];
            var mtList = lists[2] || [];

            var combined = [];
            var seen = {};

            function addItems(arr) {
                arr.forEach(function (it) {
                    if (!it || !it.display_name) return;
                    var key = (it.display_name.split(",")[0] || "").toLowerCase().trim() + "_" + parseFloat(it.lat).toFixed(3) + "_" + parseFloat(it.lon).toFixed(3);
                    if (!seen[key]) {
                        seen[key] = true;
                        combined.push(it);
                    }
                });
            }

            if (withPolygon) {
                addItems(nomList);
                addItems(phList);
                addItems(mtList);
            } else {
                addItems(phList);
                addItems(nomList);
                addItems(mtList);
            }

            return combined;
        });
    }

    function extractPathsFromGeoJSON(geom) {
        var paths = [];
        var closed = true;
        if (!geom || !geom.type) return { paths: paths, closed: true };
        if (geom.type === "Polygon") {
            if (geom.coordinates && geom.coordinates[0]) paths.push(geom.coordinates[0]);
        } else if (geom.type === "MultiPolygon") {
            for (var i = 0; i < geom.coordinates.length; i++) {
                var poly = geom.coordinates[i];
                if (poly && poly[0] && poly[0].length >= 3) paths.push(poly[0]);
            }
        } else if (geom.type === "LineString") {
            closed = false;
            if (geom.coordinates && geom.coordinates.length >= 2) paths.push(geom.coordinates);
        } else if (geom.type === "MultiLineString") {
            closed = false;
            for (var j = 0; j < geom.coordinates.length; j++) {
                if (geom.coordinates[j] && geom.coordinates[j].length >= 2) paths.push(geom.coordinates[j]);
            }
        }
        return { paths: paths, closed: closed };
    }

    function tileXYToCenterLatLon(x, y, z) {
        var n = Math.pow(2, z);
        var lon = ((x + 0.5) / n) * 360.0 - 180.0;
        var latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 0.5) / n)));
        var lat = latRad * 180.0 / Math.PI;
        return { lat: lat, lon: lon };
    }

    function buildTileUrl(provider, z, x, y, attempt) {
        var subIdx = (Math.abs(x + y + (attempt || 0))) % provider.subdomains.length;
        var sub = provider.subdomains[subIdx] || "a";
        var url = provider.url
            .replace("{s}", sub)
            .replace("{z}", z)
            .replace("{x}", x)
            .replace("{y}", y)
            .replace("{key}", encodeURIComponent(maptilerApiKey || ""));
        if (provider.requiresKey && activeMapLabelLang && activeMapLabelLang !== "local") {
            if (url.indexOf("language=") === -1) {
                url += (url.indexOf("?") === -1 ? "?" : "&") + "language=" + encodeURIComponent(activeMapLabelLang);
            }
        }
        return url;
    }

    function fetchTileImageWithRetry(provider, z, x, y, maxAttempts) {
        maxAttempts = maxAttempts || 3;
        return new Promise(function (resolve) {
            function tryAttempt(attempt) {
                var url = buildTileUrl(provider, z, x, y, attempt);
                fetch(url, { mode: "cors", cache: "force-cache" })
                    .then(function (resp) {
                        if (!resp.ok) throw new Error("HTTP " + resp.status);
                        return resp.blob();
                    })
                    .then(function (blob) {
                        var objUrl = URL.createObjectURL(blob);
                        var img = new Image();
                        img.onload = function () {
                            URL.revokeObjectURL(objUrl);
                            resolve({ img: img, sx: 0, sy: 0, sw: img.naturalWidth || 256, sh: img.naturalHeight || 256 });
                        };
                        img.onerror = function () {
                            URL.revokeObjectURL(objUrl);
                            if (attempt + 1 < maxAttempts) {
                                tryAttempt(attempt + 1);
                            } else {
                                resolve(null);
                            }
                        };
                        img.src = objUrl;
                    })
                    .catch(function () {
                        if (attempt + 1 < maxAttempts) {
                            tryAttempt(attempt + 1);
                        } else if (z > 2) {
                            // Parent tile (z-1) quadrant fallback so there is NEVER a black hole!
                            var px = Math.floor(x / 2);
                            var py = Math.floor(y / 2);
                            var qx = (x % 2) * 128;
                            var qy = (y % 2) * 128;
                            fetchTileImageWithRetry(provider, z - 1, px, py, 1).then(function (parentRes) {
                                if (parentRes && parentRes.img) {
                                    resolve({ img: parentRes.img, sx: qx, sy: qy, sw: 128, sh: 128 });
                                } else {
                                    resolve(null);
                                }
                            });
                        } else {
                            resolve(null);
                        }
                    });
            }
            tryAttempt(0);
        });
    }

    /**
     * Stitches an entire (2*halfCols+1) x (2*halfRows+1) grid of 256x256 tiles
     * onto a single seamless, ultra-crisp 2304 x 1792 PNG Atlas!
     */
    function buildStitchedAtlasForView(view, provider, bgColorHex, halfCols, halfRows, onTileDone) {
        var cols = halfCols * 2 + 1; // e.g., 9 tiles = 2304px width
        var rows = halfRows * 2 + 1; // e.g., 7 tiles = 1792px height
        var z = Math.min(18, Math.max(3, Math.round(view.zoom)));
        var n = Math.pow(2, z);
        var cx = Math.floor((view.lon + 180.0) / 360.0 * n);
        var latRad = view.lat * Math.PI / 180.0;
        var cy = Math.floor((1.0 - Math.log(Math.tan(latRad) + 1.0 / Math.cos(latRad)) / Math.PI) / 2.0 * n);

        var centerCoord = tileXYToCenterLatLon(cx, cy, z);

        var canvas = document.createElement("canvas");
        canvas.width = cols * 256;
        canvas.height = rows * 256;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = bgColorHex || "#0b1120";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var jobs = [];
        for (var dx = -halfCols; dx <= halfCols; dx++) {
            for (var dy = -halfRows; dy <= halfRows; dy++) {
                (function (offsetX, offsetY) {
                    var rawTy = cy + offsetY;
                    if (rawTy < 0 || rawTy >= n) {
                        if (onTileDone) onTileDone();
                        return;
                    }
                    var tx = ((cx + offsetX) % n + n) % n;
                    var ty = rawTy;
                    var destX = (offsetX + halfCols) * 256;
                    var destY = (offsetY + halfRows) * 256;

                    var p = fetchTileImageWithRetry(provider, z, tx, ty, 3).then(function (res) {
                        if (res && res.img) {
                            ctx.drawImage(res.img, res.sx, res.sy, res.sw, res.sh, destX, destY, 256, 256);
                        }
                        if (onTileDone) onTileDone();
                    });
                    jobs.push(p);
                })(dx, dy);
            }
        }

        return Promise.all(jobs).then(function () {
            // Apply soft 96px alpha feather on the outer rim of upper-zoom atlases (z > minZ)
            // so zooming out across multiple keyframe zoom levels has ZERO hard rectangular borders!
            if (view.featherEdges) {
                var fSize = 96;
                var w = canvas.width;
                var h = canvas.height;
                ctx.save();
                ctx.globalCompositeOperation = "destination-out";

                var gTop = ctx.createLinearGradient(0, 0, 0, fSize);
                gTop.addColorStop(0, "rgba(0,0,0,1)");
                gTop.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = gTop;
                ctx.fillRect(0, 0, w, fSize);

                var gBot = ctx.createLinearGradient(0, h, 0, h - fSize);
                gBot.addColorStop(0, "rgba(0,0,0,1)");
                gBot.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = gBot;
                ctx.fillRect(0, h - fSize, w, fSize);

                var gLeft = ctx.createLinearGradient(0, 0, fSize, 0);
                gLeft.addColorStop(0, "rgba(0,0,0,1)");
                gLeft.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = gLeft;
                ctx.fillRect(0, 0, fSize, h);

                var gRight = ctx.createLinearGradient(w, 0, w - fSize, 0);
                gRight.addColorStop(0, "rgba(0,0,0,1)");
                gRight.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = gRight;
                ctx.fillRect(w - fSize, 0, fSize, h);

                ctx.restore();
            }

            var dataUrl = canvas.toDataURL("image/png");
            return {
                z: z,
                x: cx,
                y: cy,
                role: view.role || "DETAIL",
                centerLat: centerCoord.lat,
                centerLon: centerCoord.lon,
                base64: dataUrl.replace(/^data:image\/png;base64,/, "")
            };
        });
    }

    function finalizeMapcompTiles(singleFrame) {
        var settings = getMapcompSettings();
        settings.singleFrame = !!singleFrame;
        var providerKey = document.getElementById("tileProviderSelect").value || "carto_dark";
        var provider = TILE_PROVIDERS[providerKey] || TILE_PROVIDERS.carto_dark;
        if (provider.requiresKey && !maptilerApiKey) {
            var drawer = document.getElementById("maptilerQuickDrawer");
            if (drawer) drawer.classList.remove("hidden");
            var inp = document.getElementById("inpMapTilerKeyQuick");
            if (inp) inp.focus();
            setStatus("🔑 '" + provider.name + "' ile Finalize yapmak için ücretsiz MapTiler API anahtarınızı girin.", true);
            return;
        }
        var gridPreset = parseInt(document.getElementById("finalizeGridSizeSelect").value, 10) || 3;
        // 9x7 (2304x1792) for Standard Full-HD+Overscan, 11x9 (2816x2304) for Wide/4K
        var halfCols = (gridPreset === 5) ? 5 : 4;
        var halfRows = (gridPreset === 5) ? 4 : 3;

        var hasNode = typeof window.require === "function";
        if (!hasNode) {
            callHost("createGeoMapComp", settings);
            return;
        }

        var progWrap = document.getElementById("finalizeProgressWrap");
        var progBar = document.getElementById("finalizeProgressBar");
        var progTxt = document.getElementById("finalizeProgressText");
        progWrap.classList.remove("hidden");
        progBar.style.width = "4%";
        progTxt.textContent = "Preparing Full-Frame High-Res Mapcomp Atlases...";

        callHost("getMapcompViewsForFinalize", settings, function (viewRes) {
            var views = (viewRes && viewRes.views && viewRes.views.length)
                ? viewRes.views
                : [
                    { lat: settings.centerLat, lon: settings.centerLon, zoom: Math.round(settings.zoom), role: "DETAIL" },
                    { lat: settings.centerLat, lon: settings.centerLon, zoom: Math.max(2, Math.round(settings.zoom) - 2), role: "HORIZON_BASE" }
                ];

            var tilesPerAtlas = (halfCols * 2 + 1) * (halfRows * 2 + 1);
            var totalTiles = views.length * tilesPerAtlas;
            var completedTiles = 0;

            function onSingleTileDone() {
                completedTiles++;
                var pct = Math.min(99, Math.round((completedTiles / totalTiles) * 100));
                progBar.style.width = pct + "%";
                progTxt.textContent = "Stitching Seamless 2K Map Atlas: " + completedTiles + " / " + totalTiles + " tiles (" + pct + "%)";
            }

            Promise.all(views.map(function (v) {
                return buildStitchedAtlasForView(v, provider, settings.bgColor, halfCols, halfRows, onSingleTileDone);
            })).then(function (atlases) {
                var fs = window.require("fs");
                var path = window.require("path");
                var os = window.require("os");

                var cacheDir = path.join(os.tmpdir(), "GeoMotion_v45_Atlases_" + providerKey);
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }

                var tilePayload = [];
                atlases.forEach(function (atlas) {
                    var fname = "atlas_v45_" + atlas.role + "_Z" + atlas.z + "_" + atlas.x + "_" + atlas.y + ".png";
                    var fpath = path.join(cacheDir, fname);
                    fs.writeFileSync(fpath, Buffer.from(atlas.base64, "base64"));
                    tilePayload.push({
                        z: atlas.z,
                        x: atlas.x,
                        y: atlas.y,
                        role: atlas.role,
                        centerLat: atlas.centerLat,
                        centerLon: atlas.centerLon,
                        filePath: fpath
                    });
                });

                progBar.style.width = "100%";
                progTxt.textContent = "Importing Seamless Atlases into After Effects...";

                settings.tiles = tilePayload;
                callHost("importMapTileGrid", settings, function () {
                    setTimeout(function () {
                        progWrap.classList.add("hidden");
                    }, 800);
                });
            }).catch(function (err) {
                progWrap.classList.add("hidden");
                setStatus("Finalize Hatası: " + err.message, true);
            });
        });
    }

    // =========================================================================
    // FEATURE BROWSER & COLLECTION + OVERPASS OSM VECTOR EXTRACTOR
    // =========================================================================
    function renderFeatureCollectionList() {
        var container = document.getElementById("featureCollectionList");
        var badge = document.getElementById("featureCountBadge");
        var propSpan = document.getElementById("selectedFeatureProps");
        if (!container) return;
        container.innerHTML = "";
        badge.textContent = String(featureCollection.length);

        featureCollection.forEach(function (feat) {
            var isSel = (feat.id === selectedFeatureId);
            if (isSel && propSpan) {
                var vCount = 0;
                if (feat.polygons) {
                    feat.polygons.forEach(function (r) { vCount += r.length; });
                }
                propSpan.textContent = feat.type + " • " + (feat.polygons ? feat.polygons.length + " paths (" + vCount + " pts)" : "Preset");
            }

            var row = document.createElement("div");
            row.className = "gl-feature-item" + (isSel ? " selected" : "");

            var meta = document.createElement("div");
            meta.className = "gl-feat-meta";
            meta.innerHTML =
                '<span class="gl-feat-type-badge">' + feat.type + '</span>' +
                '<span class="gl-feat-name">' + feat.name + '</span>';

            var actions = document.createElement("div");
            actions.className = "gl-feat-quick-btns";

            var btnFit = document.createElement("button");
            btnFit.className = "gl-mini-action";
            btnFit.textContent = "Fit";
            btnFit.addEventListener("click", function (ev) {
                ev.stopPropagation();
                selectFeature(feat.id, true);
            });

            var btnDraw = document.createElement("button");
            btnDraw.className = "gl-mini-action";
            btnDraw.textContent = "Draw Shape";
            btnDraw.addEventListener("click", function (ev) {
                ev.stopPropagation();
                selectFeature(feat.id, false);
                drawFeatureInAE(feat);
            });

            var btnLbl = document.createElement("button");
            btnLbl.className = "gl-mini-action";
            btnLbl.textContent = "+Label";
            btnLbl.addEventListener("click", function (ev) {
                ev.stopPropagation();
                addLabelForFeature(feat);
            });

            actions.appendChild(btnFit);
            actions.appendChild(btnDraw);
            actions.appendChild(btnLbl);

            row.appendChild(meta);
            row.appendChild(actions);

            row.addEventListener("click", function () {
                selectFeature(feat.id, true);
            });

            container.appendChild(row);
        });
    }

    function selectFeature(id, fitOnMap) {
        selectedFeatureId = id;
        renderFeatureCollectionList();
        var feat = featureCollection.find(function (f) { return f.id === id; });
        if (!feat) return;

        var style = getActiveShapeStyle();
        if (previewGeoJSONLayer) map.removeLayer(previewGeoJSONLayer);

        if (feat.geojson) {
            previewGeoJSONLayer = L.geoJSON(feat.geojson, {
                style: {
                    color: style.strokeColor,
                    weight: Math.max(2, style.strokeWidth / 2),
                    fillColor: style.fillColor,
                    fillOpacity: (feat.closed === false) ? 0 : (style.fillOpacity / 100.0)
                }
            }).addTo(map);
            if (fitOnMap) {
                map.fitBounds(previewGeoJSONLayer.getBounds(), { padding: [20, 20] });
            }
        } else if (fitOnMap && feat.lat && feat.lon) {
            map.flyTo([feat.lat, feat.lon], feat.zoom || 8, { duration: 1.0 });
        }

        if (feat.lat && feat.lon) {
            document.getElementById("pinTitleInput").value = feat.name;
            document.getElementById("pinSubtitleInput").value = feat.lat.toFixed(4) + "° N, " + feat.lon.toFixed(4) + "° E";
        }
    }


    // =========================================================================
    // ACCURATE LAND BOUNDARY LOADER & VIEWPORT ASPECT-RATIO GUIDE BOX
    // =========================================================================
    var CLEAN_COUNTRIES_DB = null;
    function loadCleanCountriesDb(callback) {
        if (CLEAN_COUNTRIES_DB) return callback(null, CLEAN_COUNTRIES_DB);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "./data/countries_clean.json", true);
        xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 0) {
                try {
                    CLEAN_COUNTRIES_DB = JSON.parse(xhr.responseText);
                    callback(null, CLEAN_COUNTRIES_DB);
                    return;
                } catch (e) {
                    callback(e);
                    return;
                }
            }
            callback(new Error("HTTP status " + xhr.status));
        };
        xhr.onerror = function () {
            callback(new Error("Network error loading countries_clean.json"));
        };
        xhr.send();
    }

    function findCleanCountry(query, db) {
        if (!query || !db) return null;
        var s = (query + "").toLowerCase().trim();
        // Never hijack provinces, cities, districts, or "City (Country)" queries as a country!
        if (/\[(province|city|capital|district|state|point)\]/i.test(s) || /\([^)]+\)/.test(s.replace(/\(temiz kara s[ıi]n[ıi]r[ıi]\)/gi, "")) || s.indexOf(",") !== -1) {
            return null;
        }
        var cleanS = s.replace(/\(temiz kara s[ıi]n[ıi]r[ıi]\)/gi, "").trim();
        var trMap = { 'ı': 'i', 'İ': 'i', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ş': 's', 'ü': 'u' };
        var norm = cleanS;
        for (var k in trMap) {
            norm = norm.split(k).join(trMap[k]);
        }
        if (db[norm]) return db[norm];
        if (db[cleanS]) return db[cleanS];
        return null;
    }

    function getCleanCountry(query, callback) {
        loadCleanCountriesDb(function (err, db) {
            if (err || !db) {
                return callback(null);
            }
            var country = findCleanCountry(query, db);
            callback(country);
        });
    }
    window.getCleanCountry = getCleanCountry;

    function loadCleanIranBoundary(callback) {
        getCleanCountry("iran", function (c) {
            if (c) callback(null, c);
            else callback(new Error("Iran clean not found"));
        });
    }

    function updateMapcompGuideBox(w, h) {
        var box = document.getElementById("mapcompGuideBox");
        var badge = document.getElementById("guideAspectBadge");
        if (!box) return;

        w = parseInt(w, 10) || 1080;
        h = parseInt(h, 10) || 1920;

        var aspect = w / h; // e.g. 1080/1920 = 0.5625 for 9:16 vertical, or 1920/1080 = 1.777 for 16:9

        var container = document.querySelector(".gl-viewport-wrapper");
        var contW = container ? container.clientWidth : 420;
        var contH = container ? container.clientHeight : 380;

        var maxW = contW * 0.88;
        var maxH = contH * 0.86;
        var boxH, boxW;
        if (aspect < 0.9) {
            // Vertical framing (9:16 Reels / TikTok / Shorts)
            boxH = Math.min(maxH, 380);
            boxW = boxH * aspect;
            if (boxW > maxW) {
                boxW = maxW;
                boxH = boxW / aspect;
            }
            if (badge) badge.textContent = "9:16 (" + w + "\u00d7" + h + ")";
        } else if (Math.abs(aspect - 1.0) < 0.15) {
            // Square framing (1:1)
            boxH = Math.min(maxH, maxW);
            boxW = boxH;
            if (badge) badge.textContent = "1:1 (" + w + "\u00d7" + h + ")";
        } else {
            // Landscape framing (16:9 / 4K UHD)
            boxW = Math.min(maxW, 480);
            boxH = boxW / aspect;
            if (boxH > maxH) {
                boxH = maxH;
                boxW = boxH * aspect;
            }
            if (badge) badge.textContent = "16:9 (" + w + "\u00d7" + h + ")";
        }

        box.style.width = Math.round(boxW) + "px";
        box.style.height = Math.round(boxH) + "px";
    }

    function downloadAndAddFeature(queryName, autoDrawInAE) {
        getCleanCountry(queryName, function (cleanCountry) {
            if (cleanCountry && cleanCountry.paths && cleanCountry.paths.length > 0) {
                var cleanFeat = {
                    id: "clean_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                    name: cleanCountry.name + " (Temiz Kara Sınırı)",
                    type: "POLYGON",
                    lat: cleanCountry.lat || 0,
                    lon: cleanCountry.lon || 0,
                    zoom: 5.5,
                    geojson: null,
                    polygons: cleanCountry.paths,
                    closed: true
                };
                featureCollection.unshift(cleanFeat);
                selectFeature(cleanFeat.id, true);
                setStatus(cleanCountry.name + " temiz kara sınırı eklendi (" + cleanCountry.paths.length + " yol, 0 deniz hatası).");
                if (autoDrawInAE) {
                    drawFeatureInAE(cleanFeat);
                }
                return;
            }
            performNominatimDownload(queryName, autoDrawInAE);
        });
    }

    function performNominatimDownload(queryName, autoDrawInAE) {
        setStatus("Downloading GeoJSON Feature '" + queryName + "'...");
        searchNominatim(queryName, true).then(function (results) {
            if (!results || !results.length) {
                setStatus("Feature bulunamadı: " + queryName, true);
                return;
            }
            var best = results[0];
            var extracted = best.geojson ? extractPathsFromGeoJSON(best.geojson) : { paths: [], closed: true };
            var cleanName = best.display_name.split(",")[0];
            var newFeat = {
                id: "feat_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                name: cleanName,
                type: extracted.paths.length > 0 ? (extracted.closed ? "POLYGON" : "LINE") : "POINT",
                lat: parseFloat(best.lat),
                lon: parseFloat(best.lon),
                zoom: 6,
                geojson: best.geojson || null,
                polygons: extracted.paths,
                closed: extracted.closed
            };
            featureCollection.unshift(newFeat);
            selectFeature(newFeat.id, true);
            setStatus("Feature '" + cleanName + "' eklendi (" + extracted.paths.length + " vektör yolu).");

            if (autoDrawInAE) {
                drawFeatureInAE(newFeat);
            }
        }).catch(function (err) {
            setStatus("Download Feature Hatası: " + err.message, true);
        });
    }

    function fetchOverpassVectorsInView(kind) {
        var b = map.getBounds();
        var bbox = b.getSouth().toFixed(4) + "," + b.getWest().toFixed(4) + "," + b.getNorth().toFixed(4) + "," + b.getEast().toFixed(4);
        var query = "";
        var labelName = "";
        var isBuilding = (kind === "buildings");
        if (kind === "roads") {
            query = '[out:json][timeout:15];(way["highway"~"motorway|trunk|primary"](' + bbox + '););out geom 60;';
            labelName = "OSM_Highways";
        } else if (isBuilding) {
            query = '[out:json][timeout:15];(way["building"](' + bbox + '););out geom 80;';
            labelName = "OSM_3D_Buildings";
        } else {
            query = '[out:json][timeout:15];(way["waterway"~"river|canal"](' + bbox + '););out geom 60;';
            labelName = "OSM_Waterways";
        }

        setStatus("Overpass API üzerinden " + labelName + " vektörleri indiriliyor...");
        var url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var elements = data.elements || [];
                var paths = [];
                elements.forEach(function (el) {
                    if (el.geometry && el.geometry.length >= (isBuilding ? 3 : 2)) {
                        var ring = el.geometry.map(function (pt) { return [pt.lon, pt.lat]; });
                        paths.push(ring);
                    }
                });
                if (!paths.length) {
                    setStatus("Bu görünümde " + labelName + " bulunamadı (Binalar için Z:15+ yakınlaşın).", true);
                    return;
                }
                var c = map.getCenter();
                var geojsonObj = {
                    type: isBuilding ? "MultiPolygon" : "MultiLineString",
                    coordinates: paths
                };
                var feat = {
                    id: "osm_" + Date.now(),
                    name: labelName + " (" + paths.length + ")",
                    type: isBuilding ? "OSM 3D BUILDINGS" : "OSM LINE",
                    lat: c.lat,
                    lon: c.lng,
                    zoom: map.getZoom(),
                    geojson: geojsonObj,
                    polygons: paths,
                    closed: isBuilding,
                    forceExtrude: isBuilding ? 38 : 0
                };
                featureCollection.unshift(feat);
                selectFeature(feat.id, false);
                setStatus(paths.length + " adet " + labelName + " vektörü Feature Collection'a eklendi!");
                if (isBuilding) {
                    drawFeatureInAE(feat);
                }
            })
            .catch(function (err) {
                setStatus("Overpass API Hatası: " + err.message, true);
            });
    }

    // Ramer-Douglas-Peucker (RDP) polygon simplification for AE Shape Layer performance
    function simplifyRingRDP(points, epsilon) {
        if (!points || points.length <= 4 || !epsilon || epsilon <= 0) return points;
        function sqSegDist(p, p1, p2) {
            var x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y;
            if (dx !== 0 || dy !== 0) {
                var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
                if (t > 1) { x = p2[0]; y = p2[1]; }
                else if (t > 0) { x += dx * t; y += dy * t; }
            }
            dx = p[0] - x;
            dy = p[1] - y;
            return dx * dx + dy * dy;
        }
        var sqEps = epsilon * epsilon;
        function rdpStep(pts, first, last, simplified) {
            var maxSqDist = sqEps;
            var index = -1;
            for (var i = first + 1; i < last; i++) {
                var sqDist = sqSegDist(pts[i], pts[first], pts[last]);
                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }
            if (maxSqDist > sqEps && index !== -1) {
                if (index - first > 1) rdpStep(pts, first, index, simplified);
                simplified.push(pts[index]);
                if (last - index > 1) rdpStep(pts, index, last, simplified);
            }
        }
        var last = points.length - 1;
        var out = [points[0]];
        rdpStep(points, 0, last, out);
        out.push(points[last]);
        return out.length >= 3 ? out : points;
    }

    function drawFeatureInAE(feat, customColorOverride) {
        if (!feat) return;
        if (!feat.polygons || feat.polygons.length === 0) {
            var qClean = (feat.query || feat.name || "").replace(/\[.*?\]/g, "").replace(/\(([^)]+)\)/g, ", $1").trim();
            downloadAndAddFeature(qClean, true);
            return;
        }
        var payload = getMapcompSettings();
        var style = getActiveShapeStyle();
        var simpEl = document.getElementById("inpSimplifyTolerance");
        var tol = simpEl ? (parseFloat(simpEl.value) || 0) : 0;
        var polys = feat.polygons;
        if (tol > 0) {
            polys = polys.map(function (ring) { return simplifyRingRDP(ring, tol); });
        }
        payload.name = feat.name.replace(/\s+/g, "_");
        payload.polygons = polys;
        payload.closed = (feat.closed !== false);
        payload.fillEnabled = (feat.closed !== false);
        payload.fillColor = customColorOverride || style.fillColor;
        payload.strokeColor = style.strokeColor;
        payload.strokeWidth = style.strokeWidth;
        payload.fillOpacity = style.fillOpacity;
        payload.extrudeDepth = feat.forceExtrude || style.extrudeDepth;
        payload.animDuration = style.animDuration;
        payload.animateTrim = style.animateTrim;
        payload.dashed = style.dashed;
        callHost("drawGeoJSONBoundary", payload);
    }

    function addLabelForFeature(feat) {
        if (!feat) return;
        var payload = getMapcompSettings();
        payload.lat = feat.lat;
        payload.lon = feat.lon;
        payload.title = feat.name;
        payload.subtitle = feat.lat.toFixed(2) + "° N, " + feat.lon.toFixed(2) + "° E";
        payload.style = document.getElementById("pinStyleSelect").value || "radar";
        payload.color = document.getElementById("pinColorInput").value || "#38bdf8";
        payload.fontSize = parseFloat(document.getElementById("pinFontSizeInput").value) || 30;
        payload.autoCounterScale = document.getElementById("chkLabelCounterScale").checked;
        payload.counterRotate = document.getElementById("chkLabelCounterRotate").checked;
        callHost("addGeoPinLabel", payload);
    }

    function seedInitialFeatureCollection() {
        featureCollection = [
            { id: "seed_iran", name: "İran (Temiz Kara Sınırı)", query: "Iran", type: "COUNTRY", lat: 32.4279, lon: 53.6880, zoom: 5.6, polygons: [], closed: true },
            { id: "seed_tr", name: "Türkiye", query: "Turkey", type: "COUNTRY", lat: 39.0, lon: 35.2, zoom: 6, polygons: [], closed: true },
            { id: "seed_ist", name: "İstanbul", query: "Istanbul", type: "PROVINCE", lat: 41.0082, lon: 28.9784, zoom: 10, polygons: [], closed: true },
            { id: "seed_ank", name: "Ankara", query: "Ankara", type: "CAPITAL", lat: 39.9255, lon: 32.8663, zoom: 9, polygons: [], closed: true }
        ];
        selectedFeatureId = "seed_tr";
        renderFeatureCollectionList();
    }

    function bindScrubbableLabels() {
        var cells = document.querySelectorAll(".gl-param-cell");
        for (var i = 0; i < cells.length; i++) {
            (function (cell) {
                var lbl = cell.querySelector(".gl-param-label");
                var inp = cell.querySelector(".gl-param-input");
                if (!lbl || !inp) return;
                var startX = 0;
                var startVal = 0;
                var step = parseFloat(inp.getAttribute("step")) || 1;

                function onMove(ev) {
                    var dx = ev.clientX - startX;
                    var nextVal = startVal + dx * step * 0.4;
                    var min = inp.getAttribute("min");
                    var max = inp.getAttribute("max");
                    if (min !== null && nextVal < parseFloat(min)) nextVal = parseFloat(min);
                    if (max !== null && nextVal > parseFloat(max)) nextVal = parseFloat(max);
                    inp.value = step < 1 ? nextVal.toFixed(2) : Math.round(nextVal);
                    inp.dispatchEvent(new Event("input"));
                    inp.dispatchEvent(new Event("change"));
                }
                function onUp() {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                }
                lbl.addEventListener("mousedown", function (ev) {
                    startX = ev.clientX;
                    startVal = parseFloat(inp.value) || 0;
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                });
            })(cells[i]);
        }
    }

    // =========================================================================
    // GEOUPDATER: AUTOMATIC & ON-DEMAND GITHUB UPDATE ENGINE
    // =========================================================================
    var CURRENT_VERSION = "3.0.0";
    var GeoUpdater = {
        currentVersion: CURRENT_VERSION,
        defaultRepo: "muhammedakifkayacan/geomotion-pro",
        latestReleaseData: null,

        getRepo: function () {
            return localStorage.getItem("geomotion_github_repo") || this.defaultRepo;
        },

        setRepo: function (repo) {
            repo = (repo || "").trim();
            if (repo) {
                localStorage.setItem("geomotion_github_repo", repo);
            }
        },

        compareVersions: function (v1, v2) {
            var p1 = (v1 || "").replace(/^v/, "").split(".").map(function (n) { return parseInt(n, 10) || 0; });
            var p2 = (v2 || "").replace(/^v/, "").split(".").map(function (n) { return parseInt(n, 10) || 0; });
            for (var i = 0; i < Math.max(p1.length, p2.length); i++) {
                var a = p1[i] || 0;
                var b = p2[i] || 0;
                if (a > b) return 1;
                if (a < b) return -1;
            }
            return 0;
        },

        checkUpdate: async function (silent) {
            var self = this;
            var repo = self.getRepo();
            var statusLbl = document.getElementById("lblUpdateStatus");
            if (!silent && statusLbl) {
                statusLbl.textContent = "⏳ GitHub kontrol ediliyor...";
                statusLbl.style.color = "#94a3b8";
            }

            try {
                // Strategy 1: Check raw version.json (instant, no rate limits)
                var rawUrl = "https://raw.githubusercontent.com/" + repo + "/main/version.json?t=" + Date.now();
                var resp = await fetch(rawUrl, { cache: "no-store" });
                if (!resp.ok) {
                    // Strategy 2: Fallback to GitHub Releases API
                    var apiUrl = "https://api.github.com/repos/" + repo + "/releases/latest";
                    var apiResp = await fetch(apiUrl);
                    if (!apiResp.ok) throw new Error("GitHub deposuna ulaşılamadı (" + (resp.status || apiResp.status) + ")");
                    var relJson = await apiResp.json();
                    self.processReleaseResult({
                        version: relJson.tag_name,
                        changelog: relJson.body,
                        htmlUrl: relJson.html_url,
                        downloads: {
                            mac: (relJson.assets.find(function(a){ return a.name.endsWith('.dmg'); }) || {}).browser_download_url,
                            win: (relJson.assets.find(function(a){ return a.name.endsWith('.exe'); }) || {}).browser_download_url
                        }
                    }, silent);
                    return;
                }

                var vJson = await resp.json();
                self.processReleaseResult(vJson, silent);

            } catch (err) {
                if (!silent && statusLbl) {
                    statusLbl.textContent = "ℹ️ " + (err.message || "Güncelleme denetlenemedi.");
                    statusLbl.style.color = "#94a3b8";
                }
            }
        },

        processReleaseResult: function (data, silent) {
            var self = this;
            var remoteVer = data.version || "0.0.0";
            self.latestReleaseData = data;
            var isNewer = self.compareVersions(remoteVer, self.currentVersion) > 0;

            var statusLbl = document.getElementById("lblUpdateStatus");
            var resultCard = document.getElementById("updateResultCard");
            var banner = document.getElementById("glUpdateBanner");

            if (isNewer) {
                if (banner) {
                    var lblNewVer = document.getElementById("lblUpdateNewVer");
                    if (lblNewVer) lblNewVer.textContent = remoteVer.replace(/^v/, "");
                    var lblDesc = document.getElementById("lblUpdateDesc");
                    if (lblDesc) lblDesc.textContent = (data.changelog ? data.changelog.split("\n")[0] : "Yeni sürüm yayınlandı!");
                    banner.classList.remove("hidden");
                }

                if (resultCard) {
                    resultCard.classList.remove("hidden");
                    var lblTitle = document.getElementById("lblFoundVerTitle");
                    if (lblTitle) lblTitle.textContent = "v" + remoteVer.replace(/^v/, "");
                    var lblChg = document.getElementById("lblFoundChangelog");
                    if (lblChg) lblChg.textContent = data.changelog || "Detaylı sürüm notu bulunamadı.";
                }

                if (statusLbl) {
                    statusLbl.textContent = "🚀 Yeni sürüm bulundu: v" + remoteVer;
                    statusLbl.style.color = "#38bdf8";
                }
            } else {
                if (!silent && statusLbl) {
                    statusLbl.textContent = "✓ En güncel sürümü kullanıyorsunuz (v" + self.currentVersion + ").";
                    statusLbl.style.color = "#10b981";
                }
                if (resultCard) resultCard.classList.add("hidden");
            }
        },

        downloadInstaller: function () {
            var self = this;
            var repo = self.getRepo();
            var isMac = (navigator.platform.toUpperCase().indexOf("MAC") >= 0);
            var url = "https://github.com/" + repo + "/releases/latest";

            if (self.latestReleaseData && self.latestReleaseData.downloads) {
                url = isMac ? (self.latestReleaseData.downloads.mac || url) : (self.latestReleaseData.downloads.win || url);
            }
            if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
                window.cep.util.openURLInDefaultBrowser(url);
            } else {
                window.open(url, "_blank");
            }
        },

        applyHotUpdate: async function () {
            var self = this;
            var repo = self.getRepo();
            var statusLbl = document.getElementById("lblUpdateStatus");
            if (statusLbl) {
                statusLbl.textContent = "⏳ Canlı dosyalar GitHub'dan indiriliyor...";
                statusLbl.style.color = "#f59e0b";
            }

            try {
                if (typeof require === "function") {
                    var fs = require("fs");
                    var path = require("path");
                    var https = require("https");
                    var cs = new CSInterface();
                    var extPath = cs.getSystemPath(SystemPath.EXTENSION);

                    var filesToUpdate = [
                        "version.json",
                        "client/index.html",
                        "client/js/app.js",
                        "client/css/style.css",
                        "host/index.jsx"
                    ];

                    var downloadFile = function (relPath) {
                        return new Promise(function (resolve, reject) {
                            var fileUrl = "https://raw.githubusercontent.com/" + repo + "/main/com.opengeolayers.cep/" + relPath + "?t=" + Date.now();
                            var dest = path.join(extPath, relPath);
                            https.get(fileUrl, function (res) {
                                if (res.statusCode !== 200) {
                                    resolve(false);
                                    return;
                                }
                                var data = "";
                                res.on("data", function (chunk) { data += chunk; });
                                res.on("end", function () {
                                    try {
                                        fs.writeFileSync(dest, data, "utf8");
                                        resolve(true);
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).on("error", reject);
                        });
                    };

                    for (var i = 0; i < filesToUpdate.length; i++) {
                        await downloadFile(filesToUpdate[i]);
                    }

                    if (statusLbl) {
                        statusLbl.textContent = "✓ Güncelleme tamamlandı! Yeniden başlatılıyor...";
                        statusLbl.style.color = "#10b981";
                    }

                    setTimeout(function () {
                        location.reload();
                    }, 1000);

                } else {
                    self.downloadInstaller();
                }
            } catch (err) {
                if (statusLbl) {
                    statusLbl.textContent = "⚠️ Canlı güncelleme hatası: " + err.message + " (Yükleyiciyi indir seçeneğini kullanabilirsiniz)";
                    statusLbl.style.color = "#ef4444";
                }
                self.downloadInstaller();
            }
        }
    };

    function bindEvents() {
        bindScrubbableLabels();

        document.getElementById("activeMapcompSelect").addEventListener("change", function () {
            var val = this.value;
            document.getElementById("compNameInput").value = val;
            refreshActiveCompDetails();
            setStatus("Active Mapcomp: " + val);
        });

        document.getElementById("btnCreateMapcomp").addEventListener("click", function () {
            openCreateMapcompModal();
        });

        // =====================================================================
        // ZOOM SLIDER, PITCH BADGE & PLACER CONTROLS (IMAGE 3)
        // =====================================================================
        var mapZoomSlider = document.getElementById("mapZoomSlider");
        var lblZoomLevel = document.getElementById("lblZoomLevel");

        if (mapZoomSlider) {
            mapZoomSlider.addEventListener("input", function () {
                var z = Math.max(2.0, parseFloat(this.value));
                if (lblZoomLevel) lblZoomLevel.textContent = "Z: " + z.toFixed(1);
                if (map) map.setZoom(z);
                var inpZ = document.getElementById("inpViewZoom");
                if (inpZ) inpZ.value = z.toFixed(1);
            });
        }

        var btnZoomIn = document.getElementById("btnZoomIn");
        if (btnZoomIn) {
            btnZoomIn.addEventListener("click", function () {
                if (map) map.zoomIn();
            });
        }

        var btnZoomOut = document.getElementById("btnZoomOut");
        if (btnZoomOut) {
            btnZoomOut.addEventListener("click", function () {
                if (map) map.zoomOut();
            });
        }

        var currentPitchAngles = [0, 35, 60];
        var currentPitchIdx = 1;
        var btnCyclePitch = document.getElementById("btnCyclePitch");
        if (btnCyclePitch) {
            btnCyclePitch.addEventListener("click", function () {
                currentPitchIdx = (currentPitchIdx + 1) % currentPitchAngles.length;
                var newPitch = currentPitchAngles[currentPitchIdx];
                document.getElementById("inpViewPitch").value = newPitch;
                var badge = document.getElementById("lblTiltBadge");
                if (badge) badge.textContent = newPitch + "\u00b0 Tilt";
                updateMapPerspectivePreview();
                if (liveLinkEnabled) {
                    var s = getMapcompSettings();
                    s.setKeyframe = false;
                    callHost("setMapcompViewKeyframe", s);
                }
            });
        }

        var btnResetBearingQuick = document.getElementById("btnResetBearingQuick");
        if (btnResetBearingQuick) {
            btnResetBearingQuick.addEventListener("click", function () {
                document.getElementById("inpViewBearing").value = 0;
                var badge = document.getElementById("lblBearingBadge");
                if (badge) badge.textContent = "0\u00b0 N";
                updateMapPerspectivePreview();
                if (liveLinkEnabled) {
                    var s = getMapcompSettings();
                    s.setKeyframe = false;
                    callHost("setMapcompViewKeyframe", s);
                }
            });
        }

        var placerModeSelect = document.getElementById("placerModeSelect");
        if (placerModeSelect) {
            placerModeSelect.addEventListener("change", function () {
                setStatus("Placer Modu: " + this.options[this.selectedIndex].text);
            });
        }

        var btnSwapPlacer = document.getElementById("btnSwapPlacer");
        if (btnSwapPlacer) {
            btnSwapPlacer.addEventListener("click", function () {
                var sel = document.getElementById("placerModeSelect");
                if (!sel) return;
                if (sel.value === "01_place_top") {
                    sel.value = "02_place_bottom";
                } else if (sel.value === "02_place_bottom") {
                    sel.value = "01_place_top";
                }
                setStatus("Placer Hizalaması Değiştirildi: " + sel.options[sel.selectedIndex].text);
            });
        }

        window.addEventListener("resize", function () {
            if (map) {
                try { map.invalidateSize(); } catch (e) {}
            }
            if (window.__activeCompWidth && window.__activeCompHeight) {
                updateMapcompGuideBox(window.__activeCompWidth, window.__activeCompHeight);
            } else {
                var resEl = document.getElementById("compResPreset");
                var parts = ((resEl && resEl.value) ? resEl.value : "1920x1080").split("x");
                updateMapcompGuideBox(parseInt(parts[0], 10) || 1920, parseInt(parts[1], 10) || 1080);
            }
        });

        // =====================================================================
        // CREATE MAPCOMP MODAL DIALOG (IMAGE 2 REPLICA)
        // =====================================================================
        var createModalMap = null;

        function openCreateMapcompModal() {
            var modal = document.getElementById("createMapcompModal");
            if (!modal) return;
            modal.classList.remove("hidden");

            if (!createModalMap && window.L) {
                setTimeout(function () {
                    try {
                        createModalMap = L.map("createModalMapPreview", {
                            center: [25.0, 15.0],
                            zoom: 5.5,
                            minZoom: 2.8,
                            maxZoom: 18,
                            zoomControl: false,
                            attributionControl: false
                        });
                        L.tileLayer("https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
                            maxZoom: 18
                        }).addTo(createModalMap);

                        createModalMap.on("zoom", function () {
                            var sl = document.getElementById("cmPreviewZoomSlider");
                            if (sl) sl.value = createModalMap.getZoom();
                        });
                    } catch (e) {}
                }, 100);
            } else if (createModalMap) {
                setTimeout(function () {
                    createModalMap.invalidateSize();
                }, 100);
            }
        }

        function closeCreateMapcompModal() {
            var modal = document.getElementById("createMapcompModal");
            if (modal) modal.classList.add("hidden");
        }

        var btnCreateComp = document.getElementById("btnCreateMapcomp");
        if (btnCreateComp) {
            btnCreateComp.addEventListener("click", openCreateMapcompModal);
        }

        var btnCloseCreate = document.getElementById("btnCloseCreateModal");
        if (btnCloseCreate) {
            btnCloseCreate.addEventListener("click", closeCreateMapcompModal);
        }

        var cmZoomSlider = document.getElementById("cmPreviewZoomSlider");
        if (cmZoomSlider) {
            cmZoomSlider.addEventListener("input", function () {
                if (createModalMap) createModalMap.setZoom(parseFloat(this.value));
            });
        }

        var btnCmIn = document.getElementById("btnCmZoomIn");
        if (btnCmIn) {
            btnCmIn.addEventListener("click", function () {
                if (createModalMap) createModalMap.zoomIn();
            });
        }

        var btnCmOut = document.getElementById("btnCmZoomOut");
        if (btnCmOut) {
            btnCmOut.addEventListener("click", function () {
                if (createModalMap) createModalMap.zoomOut();
            });
        }

        var btnSubmitCreate = document.getElementById("btnSubmitCreateMapcomp");
        if (btnSubmitCreate) {
            btnSubmitCreate.addEventListener("click", function () {
                var compName = document.getElementById("cmInputName").value || "Tutorial 1";
                var sizeVal = document.getElementById("cmSelectPresetSize").value || "1080x1920";
                var fps = parseFloat(document.getElementById("cmSelectFps").value) || 25;
                var duration = parseFloat(document.getElementById("cmSelectDuration").value) || 15;

                var dims = sizeVal.split("x");
                var w = parseInt(dims[0], 10) || 1080;
                var h = parseInt(dims[1], 10) || 1920;

                var center = createModalMap ? createModalMap.getCenter() : (map ? map.getCenter() : { lat: 39.9255, lng: 32.8663 });
                var previewZoom = createModalMap ? createModalMap.getZoom() : (map ? map.getZoom() : 6);
                updateMapcompGuideBox(w, h);
                var box = document.getElementById("mapcompGuideBox");
                var boxH = (box && box.clientHeight > 40) ? box.clientHeight : 260;
                var aeZoom = Math.min(18.5, Math.max(2.8, previewZoom + (Math.log(Math.max(1.0, h / boxH)) / Math.LN2)));

                var payload = {
                    compName: compName,
                    width: w,
                    height: h,
                    fps: fps,
                    duration: duration,
                    centerLat: center.lat,
                    centerLon: center.lng,
                    zoom: aeZoom,
                    pitch: 35,
                    bearing: 0,
                    provider: "carto_dark",
                    motionBlur: true
                };

                callHost("createGeoMapComp", payload, function (res) {
                    closeCreateMapcompModal();
                    updateMapcompGuideBox(w, h);

                    var sel = document.getElementById("activeMapcompSelect");
                    if (sel) {
                        var opt = document.createElement("option");
                        opt.value = compName;
                        opt.textContent = compName + " (" + w + "x" + h + ")";
                        sel.appendChild(opt);
                        sel.value = compName;
                    }
                    setStatus("'" + compName + "' After Effects'te oluşturuldu (" + w + "x" + h + " @ " + fps + "fps).");
                });
            });
        }


        document.getElementById("btnToggleLiveLink").addEventListener("click", function () {
            liveLinkEnabled = !liveLinkEnabled;
            this.classList.toggle("active", liveLinkEnabled);
            setStatus(liveLinkEnabled ? "Mapcomp Live Link: Aktif" : "Mapcomp Live Link: Duraklatıldı");
        });

        function triggerAddViewKeyframe() {
            var settings = getMapcompSettings();
            settings.setKeyframe = true;
            callHost("setMapcompViewKeyframe", settings);
        }

        document.getElementById("btnSetViewKeyframe").addEventListener("click", triggerAddViewKeyframe);
        document.getElementById("btnMapToolKeyframe").addEventListener("click", triggerAddViewKeyframe);

        document.getElementById("btnFinalizeMapcomp").addEventListener("click", function () {
            finalizeMapcompTiles();
        });

        document.getElementById("btnSnapLayer").addEventListener("click", function () {
            var settings = getMapcompSettings();
            settings.lat = settings.centerLat;
            settings.lon = settings.centerLon;
            settings.label = document.getElementById("pinTitleInput").value || "Pinned";
            callHost("snapSelectedLayerToMapcomp", settings);
        });

        document.getElementById("btnDrawHelplines").addEventListener("click", function () {
            callHost("drawHelplinesGrid", getMapcompSettings());
        });

        function triggerQuickLabel() {
            var settings = getMapcompSettings();
            settings.lat = settings.centerLat;
            settings.lon = settings.centerLon;
            settings.title = document.getElementById("pinTitleInput").value || "Location";
            settings.subtitle = document.getElementById("pinSubtitleInput").value || "";
            settings.style = document.getElementById("pinStyleSelect").value || "radar";
            settings.color = document.getElementById("pinColorInput").value || "#38bdf8";
            settings.fontSize = parseFloat(document.getElementById("pinFontSizeInput").value) || 30;
            settings.autoCounterScale = document.getElementById("chkLabelCounterScale").checked;
            settings.counterRotate = document.getElementById("chkLabelCounterRotate").checked;
            callHost("addGeoPinLabel", settings);
        }

        document.getElementById("btnQuickAddLabel").addEventListener("click", triggerQuickLabel);
        document.getElementById("btnAddPinAtCenter").addEventListener("click", triggerQuickLabel);

        function syncViewInputsToMap() {
            var lat = parseFloat(document.getElementById("inpViewLat").value) || 39.9255;
            var lon = parseFloat(document.getElementById("inpViewLon").value) || 32.8663;
            var z = Math.max(2.0, Math.min(19.0, parseFloat(document.getElementById("inpViewZoom").value) || 6));
            document.getElementById("inpViewZoom").value = z.toFixed(1);
            map.setView([lat, lon], z, { animate: false });
            updateMapPerspectivePreview();
            if (liveLinkEnabled) {
                var s = getMapcompSettings();
                s.setKeyframe = false;
                callHost("setMapcompViewKeyframe", s);
            }
        }

        ["inpViewLat", "inpViewLon", "inpViewZoom"].forEach(function (id) {
            document.getElementById(id).addEventListener("change", syncViewInputsToMap);
        });

        ["inpViewPitch", "inpViewBearing"].forEach(function (id) {
            document.getElementById(id).addEventListener("input", function () {
                updateMapPerspectivePreview();
                if (liveLinkEnabled) {
                    var s = getMapcompSettings();
                    s.setKeyframe = false;
                    callHost("setMapcompViewKeyframe", s);
                }
            });
        });

        document.getElementById("btnResetNorth").addEventListener("click", function () {
            document.getElementById("inpViewPitch").value = 0;
            document.getElementById("inpViewBearing").value = 0;
            updateMapPerspectivePreview();
            if (liveLinkEnabled) {
                var s = getMapcompSettings();
                s.setKeyframe = false;
                callHost("setMapcompViewKeyframe", s);
            }
        });

        document.getElementById("tileProviderSelect").addEventListener("change", function (e) {
            switchTileProvider(e.target.value);
        });

        // MapTiler API Key UI Bindings
        var btnToggleMt = document.getElementById("btnToggleMapTilerDrawer");
        if (btnToggleMt) {
            btnToggleMt.addEventListener("click", function () {
                var drawer = document.getElementById("maptilerQuickDrawer");
                if (drawer) {
                    drawer.classList.toggle("hidden");
                    if (!drawer.classList.contains("hidden")) {
                        var inp = document.getElementById("inpMapTilerKeyQuick");
                        if (inp) inp.focus();
                    }
                }
            });
        }

        var btnCloseMt = document.getElementById("btnCloseMapTilerDrawer");
        if (btnCloseMt) {
            btnCloseMt.addEventListener("click", function () {
                var drawer = document.getElementById("maptilerQuickDrawer");
                if (drawer) drawer.classList.add("hidden");
            });
        }

        var btnSaveMtQuick = document.getElementById("btnSaveMapTilerKeyQuick");
        if (btnSaveMtQuick) {
            btnSaveMtQuick.addEventListener("click", function () {
                var k = document.getElementById("inpMapTilerKeyQuick").value;
                verifyAndSaveMapTilerKey(k);
            });
        }

        var inpMtQuick = document.getElementById("inpMapTilerKeyQuick");
        if (inpMtQuick) {
            inpMtQuick.addEventListener("keydown", function (ev) {
                if (ev.key === "Enter") verifyAndSaveMapTilerKey(inpMtQuick.value);
            });
        }

        var btnSaveMtPrefs = document.getElementById("btnSaveMapTilerKeyPrefs");
        if (btnSaveMtPrefs) {
            btnSaveMtPrefs.addEventListener("click", function () {
                var k = document.getElementById("inpMapTilerKeyPrefs").value;
                verifyAndSaveMapTilerKey(k);
            });
        }

        var inpMtPrefs = document.getElementById("inpMapTilerKeyPrefs");
        if (inpMtPrefs) {
            inpMtPrefs.addEventListener("keydown", function (ev) {
                if (ev.key === "Enter") verifyAndSaveMapTilerKey(inpMtPrefs.value);
            });
        }

        var btnClearMtPrefs = document.getElementById("btnClearMapTilerKeyPrefs");
        if (btnClearMtPrefs) {
            btnClearMtPrefs.addEventListener("click", function () {
                verifyAndSaveMapTilerKey("");
            });
        }

        var btnGetMtQuick = document.getElementById("btnGetFreeMapTilerKey");
        if (btnGetMtQuick) {
            btnGetMtQuick.addEventListener("click", openMapTilerKeyPortal);
        }

        var btnGetMtPrefs = document.getElementById("btnOpenMapTilerPortalPrefs");
        if (btnGetMtPrefs) {
            btnGetMtPrefs.addEventListener("click", openMapTilerKeyPortal);
        }

        var jumpChips = document.querySelectorAll(".gl-jump-chip");
        for (var j = 0; j < jumpChips.length; j++) {
            jumpChips[j].addEventListener("click", function () {
                var lat = parseFloat(this.getAttribute("data-lat"));
                var lon = parseFloat(this.getAttribute("data-lon"));
                var z = parseInt(this.getAttribute("data-z"), 10);
                map.flyTo([lat, lon], z, { duration: 1.1 });
            });
        }

        window.switchTab = function (targetId) {
            var allTabs = document.querySelectorAll(".gl-tab");
            var allPanes = document.querySelectorAll(".gl-tab-pane");

            for (var j = 0; j < allTabs.length; j++) {
                var tabTarget = allTabs[j].getAttribute("data-tab");
                allTabs[j].classList.toggle("active", tabTarget === targetId);
            }
            for (var p = 0; p < allPanes.length; p++) {
                allPanes[p].classList.toggle("active", allPanes[p].id === targetId);
            }

            var topCopilotBtn = document.getElementById("btnToggleCopilot");
            if (topCopilotBtn) {
                topCopilotBtn.classList.toggle("active", targetId === "tab-copilot");
            }

            if (targetId === "tab-copilot") {
                var inp = document.getElementById("copilotInput");
                if (inp) inp.focus();
            } else {
                if (map) {
                    setTimeout(function () { try { map.invalidateSize(); } catch (e) {} }, 50);
                }
            }
        };

        var tabs = document.querySelectorAll(".gl-tab");
        for (var t = 0; t < tabs.length; t++) {
            tabs[t].addEventListener("click", function () {
                var target = this.getAttribute("data-tab");
                window.switchTab(target);
            });
        }

        var btnReturnToMap = document.getElementById("btnReturnToMapTab");
        if (btnReturnToMap) {
            btnReturnToMap.addEventListener("click", function () {
                window.switchTab("tab-collection");
                setStatus("Harita Gezginine dönüldü.");
            });
        }

        var searchInput = document.getElementById("globalSearchInput");
        var dropdown = document.getElementById("searchResultsDropdown");

        function executeSearch() {
            var q = searchInput.value.trim();
            if (!q) return;
            // Direct Lat,Lon coordinate detection (e.g. copied from Google Maps like "41.0422, 28.9892")
            var coordMatch = q.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
            if (coordMatch) {
                var cLat = parseFloat(coordMatch[1]);
                var cLon = parseFloat(coordMatch[2]);
                if (!isNaN(cLat) && !isNaN(cLon) && Math.abs(cLat) <= 90 && Math.abs(cLon) <= 180) {
                    if (map) map.setView([cLat, cLon], Math.max(map.getZoom(), 15));
                    setStatus("Koordinata gidildi: " + cLat.toFixed(5) + ", " + cLon.toFixed(5));
                    var coordFeat = {
                        id: "coord_" + Date.now(),
                        name: "İşletme / Konum (" + cLat.toFixed(4) + ", " + cLon.toFixed(4) + ")",
                        type: "POINT",
                        lat: cLat,
                        lon: cLon,
                        zoom: 15,
                        polygons: [],
                        closed: true
                    };
                    featureCollection.unshift(coordFeat);
                    selectFeature(coordFeat.id, true);
                    return;
                }
            }
            setStatus("Searching Nominatim OSM for '" + q + "'...");
            searchNominatim(q, true).then(function (results) {
                dropdown.innerHTML = "";
                if (!results || !results.length) {
                    dropdown.classList.add("hidden");
                    setStatus("Sonuç bulunamadı: " + q, true);
                    return;
                }
                dropdown.classList.remove("hidden");
                results.forEach(function (item) {
                    var row = document.createElement("div");
                    row.className = "search-result-item";
                    var extracted = item.geojson ? extractPathsFromGeoJSON(item.geojson) : { paths: [], closed: true };
                    var hasPoly = extracted.paths.length > 0;
                    row.innerHTML =
                        "<span>" + item.display_name.substring(0, 50) + "</span>" +
                        "<strong>" + (hasPoly ? "+ Polygon Feature" : "+ Point Feature") + "</strong>";
                    row.addEventListener("click", function () {
                        var shortName = item.display_name.split(",")[0];
                        var feat = {
                            id: "feat_" + Date.now(),
                            name: shortName,
                            type: hasPoly ? (extracted.closed ? "POLYGON" : "LINE") : "POINT",
                            lat: parseFloat(item.lat),
                            lon: parseFloat(item.lon),
                            zoom: 8,
                            geojson: item.geojson || null,
                            polygons: extracted.paths,
                            closed: extracted.closed
                        };
                        featureCollection.unshift(feat);
                        selectFeature(feat.id, true);
                        dropdown.classList.add("hidden");
                        setStatus("'" + shortName + "' Feature Collection'a eklendi.");
                    });
                    dropdown.appendChild(row);
                });
            }).catch(function (err) {
                setStatus("Search Error: " + err.message, true);
            });
        }

        document.getElementById("btnSearchGo").addEventListener("click", executeSearch);
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") executeSearch();
        });

        document.getElementById("btnDownloadFeatureToCollection").addEventListener("click", function () {
            var q = document.getElementById("presetCountrySelect").value || "Turkey";
            downloadAndAddFeature(q, false);
        });

        document.getElementById("btnOverpassRoads").addEventListener("click", function () {
            fetchOverpassVectorsInView("roads");
        });

        document.getElementById("btnOverpassRivers").addEventListener("click", function () {
            fetchOverpassVectorsInView("rivers");
        });

        var btnOverpassBuildings = document.getElementById("btnOverpassBuildings");
        if (btnOverpassBuildings) {
            btnOverpassBuildings.addEventListener("click", function () {
                fetchOverpassVectorsInView("buildings");
            });
        }

        var btnFinalizeOneFrame = document.getElementById("btnFinalizeOneFrame");
        if (btnFinalizeOneFrame) {
            btnFinalizeOneFrame.addEventListener("click", function () {
                setStatus("⚡ Finalize 1-Frame (Sadece aktif kare için yüksek çözünürlüklü harita işleniyor)...");
                finalizeMapcompTiles(true);
            });
        }

        var btnPickOnMap = document.getElementById("btnPickFeatureOnMap");
        if (btnPickOnMap) {
            btnPickOnMap.addEventListener("click", function () {
                window.__pickFeatureOnMapMode = !window.__pickFeatureOnMapMode;
                btnPickOnMap.style.background = window.__pickFeatureOnMapMode ? "rgba(56,189,248,0.28)" : "";
                btnPickOnMap.style.borderColor = window.__pickFeatureOnMapMode ? "#38bdf8" : "";
                setStatus(window.__pickFeatureOnMapMode
                    ? "🎯 Haritadan Seçim Modu AKTİF: Herhangi bir ülke/şehir/bölge üzerine tıklayın."
                    : "🎯 Haritadan Seçim Modu kapatıldı.");
            });
        }

        function triggerCreateScaleAndCompass() {
            callHost("createScaleBarAndCompass", getMapcompSettings());
        }
        var btnAddScale = document.getElementById("btnAddScaleAndCompass");
        if (btnAddScale) btnAddScale.addEventListener("click", triggerCreateScaleAndCompass);
        var btnTabAddScale = document.getElementById("btnTabAddScaleCompass");
        if (btnTabAddScale) btnTabAddScale.addEventListener("click", triggerCreateScaleAndCompass);

        function triggerCreateLocatorInset() {
            callHost("createLocatorInsetMap", getMapcompSettings());
        }
        var btnAddLoc = document.getElementById("btnAddLocatorInset");
        if (btnAddLoc) btnAddLoc.addEventListener("click", triggerCreateLocatorInset);
        var btnTabAddLoc = document.getElementById("btnTabAddLocator");
        if (btnTabAddLoc) btnTabAddLoc.addEventListener("click", triggerCreateLocatorInset);

        document.getElementById("inpImportGeoJSONFile").addEventListener("change", function (ev) {
            var file = ev.target.files && ev.target.files[0];
            if (!file) return;
            var fname = file.name || "Imported";
            var ext = fname.split(".").pop().toLowerCase();
            var reader = new FileReader();
            reader.onload = function (e) {
                try {
                    var raw = e.target.result;
                    var c = map.getCenter();
                    if (ext === "gpx" || ext === "kml") {
                        var parser = new DOMParser();
                        var xml = parser.parseFromString(raw, "text/xml");
                        var pts = xml.querySelectorAll("trkpt, rtept, wpt");
                        var ring = [];
                        for (var i = 0; i < pts.length; i++) {
                            var latAttr = parseFloat(pts[i].getAttribute("lat"));
                            var lonAttr = parseFloat(pts[i].getAttribute("lon"));
                            if (!isNaN(latAttr) && !isNaN(lonAttr)) {
                                ring.push([lonAttr, latAttr]);
                            }
                        }
                        if (!ring.length) {
                            var coordsTags = xml.querySelectorAll("coordinates");
                            for (var j = 0; j < coordsTags.length; j++) {
                                var tuples = coordsTags[j].textContent.trim().split(/\s+/);
                                tuples.forEach(function (t) {
                                    var parts = t.split(",");
                                    if (parts.length >= 2) {
                                        var ln = parseFloat(parts[0]), lt = parseFloat(parts[1]);
                                        if (!isNaN(ln) && !isNaN(lt)) ring.push([ln, lt]);
                                    }
                                });
                            }
                        }
                        if (!ring.length) throw new Error("GPX/KML içinde geçerli koordinat bulunamadı.");
                        var gpxFeat = {
                            id: "gpx_" + Date.now(),
                            name: fname.replace(/\.(gpx|kml)$/i, ""),
                            type: "GPX TRACK",
                            lat: ring[0][1],
                            lon: ring[0][0],
                            zoom: 11,
                            polygons: [ring],
                            closed: false
                        };
                        featureCollection.unshift(gpxFeat);
                        selectFeature(gpxFeat.id, true);
                        setStatus("GPX/KML rotası yüklendi: " + gpxFeat.name + " (" + ring.length + " nokta)");
                        return;
                    }
                    if (ext === "csv" || ext === "tsv") {
                        var lines = raw.trim().split(/\r?\n/);
                        var sep = ext === "tsv" ? "\t" : ",";
                        var csvRing = [];
                        var chartLines = [];
                        lines.forEach(function (line, idx) {
                            var cols = line.split(sep).map(function (s) { return s.trim(); });
                            if (cols.length >= 3) {
                                var n = cols[0];
                                var lt = parseFloat(cols[1]);
                                var ln = parseFloat(cols[2]);
                                var val = parseFloat(cols[3] || "100");
                                var col = cols[4] || "#38bdf8";
                                if (!isNaN(lt) && !isNaN(ln)) {
                                    csvRing.push([ln, lt]);
                                    chartLines.push(n + "," + lt + "," + ln + "," + (isNaN(val) ? 100 : val) + "," + col);
                                    var ptFeat = {
                                        id: "csv_" + Date.now() + "_" + idx,
                                        name: n || ("Point_" + idx),
                                        type: "CSV POINT",
                                        lat: lt,
                                        lon: ln,
                                        value: isNaN(val) ? 100 : val,
                                        zoom: 9,
                                        polygons: [],
                                        closed: false
                                    };
                                    featureCollection.unshift(ptFeat);
                                }
                            }
                        });
                        if (chartLines.length) {
                            var chartArea = document.getElementById("dataChartTextarea");
                            if (chartArea) chartArea.value = chartLines.join("\n");
                        }
                        renderFeatureCollectionList();
                        setStatus("CSV/TSV veri tablosu yüklendi (" + csvRing.length + " coğrafi kayıt).");
                        return;
                    }
                    var parsed = JSON.parse(raw);
                    var geom = parsed.type === "FeatureCollection" && parsed.features && parsed.features[0]
                        ? parsed.features[0].geometry
                        : (parsed.type === "Feature" ? parsed.geometry : parsed);
                    var extracted = extractPathsFromGeoJSON(geom);
                    var feat = {
                        id: "file_" + Date.now(),
                        name: fname.replace(/\.(geo)?json$/i, ""),
                        type: extracted.closed ? "GEOJSON" : "LINE",
                        lat: c.lat,
                        lon: c.lng,
                        zoom: map.getZoom(),
                        geojson: parsed,
                        polygons: extracted.paths,
                        closed: extracted.closed
                    };
                    featureCollection.unshift(feat);
                    selectFeature(feat.id, true);
                    setStatus("GeoJSON dosyası yüklendi: " + feat.name);
                } catch (err) {
                    setStatus("Dosya ayrıştırma hatası: " + err.message, true);
                }
            };
            reader.readAsText(file);
        });

        var btnMerge = document.getElementById("btnMergeFeatures");
        if (btnMerge) {
            btnMerge.addEventListener("click", function () {
                var polyFeats = featureCollection.filter(function (f) { return f.polygons && f.polygons.length > 0; });
                if (polyFeats.length < 2) {
                    setStatus("Birleştirmek (Merge) için listede en az 2 indirilmiş poligon/hat bulunmalıdır.", true);
                    return;
                }
                var mergedPolys = [];
                var names = [];
                polyFeats.forEach(function (f) {
                    mergedPolys = mergedPolys.concat(f.polygons);
                    names.push(f.name.split(" ")[0]);
                });
                var mergedFeat = {
                    id: "merged_" + Date.now(),
                    name: "Merged_" + names.slice(0, 3).join("_"),
                    type: "MERGED MULTI",
                    lat: polyFeats[0].lat,
                    lon: polyFeats[0].lon,
                    zoom: polyFeats[0].zoom || 6,
                    polygons: mergedPolys,
                    closed: true
                };
                featureCollection.unshift(mergedFeat);
                selectFeature(mergedFeat.id, true);
                setStatus("🔗 " + polyFeats.length + " katman tek bir Multi-Polygon olarak birleştirildi: " + mergedFeat.name);
            });
        }

        document.getElementById("btnDrawSelectedFeature").addEventListener("click", function () {
            var feat = featureCollection.find(function (f) { return f.id === selectedFeatureId; });
            if (feat) drawFeatureInAE(feat);
        });

        document.getElementById("btnFitSelectedFeature").addEventListener("click", function () {
            if (selectedFeatureId) selectFeature(selectedFeatureId, true);
        });

        document.getElementById("btnLabelSelectedFeature").addEventListener("click", function () {
            var feat = featureCollection.find(function (f) { return f.id === selectedFeatureId; });
            if (feat) addLabelForFeature(feat);
        });

        function bindStyleSwatches() {
            var swatches = document.querySelectorAll(".gl-style-swatch");
            for (var s = 0; s < swatches.length; s++) {
                swatches[s].onclick = function () {
                    for (var k = 0; k < swatches.length; k++) swatches[k].classList.remove("active");
                    this.classList.add("active");
                    document.getElementById("borderFillColor").value = this.getAttribute("data-fill");
                    document.getElementById("borderStrokeColor").value = this.getAttribute("data-stroke");
                    document.getElementById("borderStrokeWidth").value = this.getAttribute("data-width");
                    document.getElementById("borderFillOpacity").value = this.getAttribute("data-op");
                    document.getElementById("borderExtrudeDepth").value = this.getAttribute("data-extrude");
                    document.getElementById("borderDashedStroke").checked = (this.getAttribute("data-dash") === "1");
                    if (selectedFeatureId) selectFeature(selectedFeatureId, false);
                };
            }
        }
        bindStyleSwatches();

        document.getElementById("btnSaveCustomStyle").addEventListener("click", function () {
            var st = getActiveShapeStyle();
            var grid = document.getElementById("styleSwatchGrid");
            var div = document.createElement("div");
            div.className = "gl-style-swatch active";
            div.setAttribute("data-fill", st.fillColor);
            div.setAttribute("data-stroke", st.strokeColor);
            div.setAttribute("data-width", String(st.strokeWidth));
            div.setAttribute("data-op", String(st.fillOpacity));
            div.setAttribute("data-extrude", String(st.extrudeDepth));
            div.setAttribute("data-dash", st.dashed ? "1" : "0");
            div.innerHTML =
                '<span class="swatch-preview" style="background:' + st.fillColor + ';border:2px solid ' + st.strokeColor + ';"></span>' +
                '<span>Custom Style ' + (grid.children.length + 1) + '</span>';
            grid.appendChild(div);
            bindStyleSwatches();
            setStatus("Yeni Layer Style kaydedildi.");
        });

        function runRouteConnect(sendToAE) {
            var startQ = document.getElementById("routeStartInput").value.trim() || "İstanbul";
            var endQ = document.getElementById("routeEndInput").value.trim() || "Ankara";
            var mode = document.getElementById("routeModeSelect").value;
            var strokeColor = document.getElementById("routeStrokeColor").value;
            var duration = parseFloat(document.getElementById("routeDurationInput").value) || 4.0;
            var dashed = document.getElementById("routeDashedCheck").checked;
            var addHead = document.getElementById("routeHeadMarkerCheck").checked;
            var camFollow = document.getElementById("routeCameraFollowCheck").checked;

            setStatus("Connecting Features: " + startQ + " -> " + endQ + "...");
            Promise.all([searchNominatim(startQ, false), searchNominatim(endQ, false)])
                .then(function (pair) {
                    if (!pair[0].length || !pair[1].length) throw new Error("Konum bulunamadı.");
                    var pA = [parseFloat(pair[0][0].lon), parseFloat(pair[0][0].lat)];
                    var pB = [parseFloat(pair[1][0].lon), parseFloat(pair[1][0].lat)];

                    if (mode === "driving") {
                        var osrmUrl = "https://router.project-osrm.org/route/v1/driving/" +
                            pA[0] + "," + pA[1] + ";" + pB[0] + "," + pB[1] + "?overview=full&geometries=geojson";
                        return fetch(osrmUrl).then(function (r) { return r.json(); }).then(function (data) {
                            if (data.routes && data.routes.length) {
                                var rt = data.routes[0];
                                var b = document.getElementById("routeDistanceInfo");
                                b.textContent = "OSRM Highway: " + (rt.distance / 1000).toFixed(1) + " km • " + rt.geometry.coordinates.length + " vertices";
                                b.classList.remove("hidden");
                                return rt.geometry.coordinates;
                            }
                            return [pA, pB];
                        });
                    }
                    return [pA, pB];
                })
                .then(function (coords) {
                    if (previewRouteLayer) map.removeLayer(previewRouteLayer);
                    var latLngs = coords.map(function (c) { return [c[1], c[0]]; });
                    previewRouteLayer = L.polyline(latLngs, { color: strokeColor, weight: 4 }).addTo(map);
                    map.fitBounds(previewRouteLayer.getBounds(), { padding: [24, 24] });

                    if (sendToAE) {
                        var payload = getMapcompSettings();
                        payload.routeName = startQ + "_to_" + endQ;
                        payload.coordinates = coords;
                        payload.routeMode = mode;
                        payload.strokeColor = strokeColor;
                        payload.duration = duration;
                        payload.dashed = dashed;
                        payload.addHeadMarker = addHead;
                        var headSel = document.getElementById("routeHeadStyleSelect");
                        payload.headStyle = headSel ? headSel.value : "arrow";
                        payload.cameraFollowRoute = camFollow;
                        callHost("drawAnimatedRoute", payload);
                    }
                })
                .catch(function (err) {
                    setStatus("Route Error: " + err.message, true);
                });
        }

        // Choropleth Mapcomp & Time-Series Stagger Bindings
        function interpolateHex(c1, c2, t) {
            var h1 = (c1 || "#0284c7").replace("#", "");
            var h2 = (c2 || "#ef4444").replace("#", "");
            var r1 = parseInt(h1.substring(0, 2), 16) || 0, g1 = parseInt(h1.substring(2, 4), 16) || 0, b1 = parseInt(h1.substring(4, 6), 16) || 0;
            var r2 = parseInt(h2.substring(0, 2), 16) || 255, g2 = parseInt(h2.substring(2, 4), 16) || 68, b2 = parseInt(h2.substring(4, 6), 16) || 68;
            var r = Math.round(r1 + (r2 - r1) * t);
            var g = Math.round(g1 + (g2 - g1) * t);
            var b = Math.round(b1 + (b2 - b1) * t);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        var btnChoropleth = document.getElementById("btnDrawChoropleth");
        if (btnChoropleth) {
            btnChoropleth.addEventListener("click", function () {
                var polyFeats = featureCollection.filter(function (f) { return f.polygons && f.polygons.length > 0; });
                if (!polyFeats.length) {
                    setStatus("Choropleth haritası için önce birkaç ülke/il poligonu indirin.", true);
                    return;
                }
                var cLow = document.getElementById("choroColorLow").value || "#0284c7";
                var cHigh = document.getElementById("choroColorHigh").value || "#ef4444";
                polyFeats.forEach(function (f, idx) {
                    var t = polyFeats.length > 1 ? (idx / (polyFeats.length - 1)) : 0.5;
                    var gradColor = interpolateHex(cLow, cHigh, t);
                    drawFeatureInAE(f, gradColor);
                });
                setStatus("🌡️ Choropleth harita renklendirmesi (" + polyFeats.length + " bölge) AE'ye aktarıldı!");
            });
        }

        var btnStagger = document.getElementById("btnStaggerTimeSeries");
        if (btnStagger) {
            btnStagger.addEventListener("click", function () {
                var settings = getMapcompSettings();
                settings.stepSec = parseFloat(document.getElementById("inpTimeSeriesStep").value) || 0.4;
                callHost("staggerMapFeatureLayers", settings);
            });
        }

        // Map Imagery Colorizer, Watermask & 3D Atmosphere/DOF Bindings
        var btnColorizer = document.getElementById("btnApplyMapColorizer");
        if (btnColorizer) {
            btnColorizer.addEventListener("click", function () {
                var settings = getMapcompSettings();
                settings.waterColor = document.getElementById("themeWaterColor").value || "#081426";
                settings.landColor = document.getElementById("themeLandColor").value || "#1e293b";
                settings.highlightColor = document.getElementById("themeHighlightColor").value || "#38bdf8";
                callHost("applyMapColorizerTheme", settings);
            });
        }

        var btnWatermask = document.getElementById("btnAddWatermask");
        if (btnWatermask) {
            btnWatermask.addEventListener("click", function () {
                callHost("createWatermaskLayer", getMapcompSettings());
            });
        }

        var btnAtmosDOF = document.getElementById("btnApplyAtmosphereDOF");
        if (btnAtmosDOF) {
            btnAtmosDOF.addEventListener("click", function () {
                callHost("applyMapAtmosphereAndDOF", getMapcompSettings());
            });
        }

        // 2-Point Georeference Image / Layer Binding
        var btnGeoref = document.getElementById("btnGeoreferenceLayer");
        if (btnGeoref) {
            btnGeoref.addEventListener("click", function () {
                var p1Str = (document.getElementById("inpGeoPoint1").value || "41.05, 28.95").split(",");
                var p2Str = (document.getElementById("inpGeoPoint2").value || "40.98, 29.08").split(",");
                var settings = getMapcompSettings();
                settings.lat1 = parseFloat(p1Str[0]) || 41.05;
                settings.lon1 = parseFloat(p1Str[1]) || 28.95;
                settings.lat2 = parseFloat(p2Str[0]) || 40.98;
                settings.lon2 = parseFloat(p2Str[1]) || 29.08;
                callHost("georeferenceSelectedLayer", settings);
            });
        }

        document.getElementById("btnCalcRoutePreview").addEventListener("click", function () {
            runRouteConnect(false);
        });
        document.getElementById("btnSendRouteToAE").addEventListener("click", function () {
            runRouteConnect(true);
        });

        document.getElementById("btnAnimateCameraFlyTo").addEventListener("click", function () {
            var fromQ = document.getElementById("camFromInput").value.trim() || "İstanbul";
            var toQ = document.getElementById("camToInput").value.trim() || "Antalya";
            Promise.all([searchNominatim(fromQ, false), searchNominatim(toQ, false)])
                .then(function (pair) {
                    if (!pair[0].length || !pair[1].length) throw new Error("Konum bulunamadı.");
                    var payload = getMapcompSettings();
                    payload.fromLat = parseFloat(pair[0][0].lat);
                    payload.fromLon = parseFloat(pair[0][0].lon);
                    payload.toLat = parseFloat(pair[1][0].lat);
                    payload.toLon = parseFloat(pair[1][0].lon);
                    payload.duration = parseFloat(document.getElementById("camDurationInput").value) || 4.0;
                    callHost("animateCameraFlyTo", payload);
                })
                .catch(function (err) {
                    setStatus("Fly-To Error: " + err.message, true);
                });
        });

        document.getElementById("btnGenerate3DTerrain").addEventListener("click", function () {
            var bounds = map.getBounds();
            var gridCount = parseInt(document.getElementById("terrainGridDensity").value, 10) || 7;
            var exaggeration = parseFloat(document.getElementById("terrainExaggeration").value) || 2.5;
            var lats = [], lons = [];
            var s = bounds.getSouth(), n = bounds.getNorth(), w = bounds.getWest(), e = bounds.getEast();
            for (var r = 0; r < gridCount; r++) {
                for (var c = 0; c < gridCount; c++) {
                    lats.push((s + (r / (gridCount - 1)) * (n - s)).toFixed(4));
                    lons.push((w + (c / (gridCount - 1)) * (e - w)).toFixed(4));
                }
            }
            setStatus("Fetching Open-Meteo DEM Elevation (" + lats.length + " samples)...");
            fetch("https://api.open-meteo.com/v1/elevation?latitude=" + lats.join(",") + "&longitude=" + lons.join(","))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    var elevs = data.elevation || [];
                    var samples = [];
                    for (var i = 0; i < lats.length; i++) {
                        samples.push({ lat: parseFloat(lats[i]), lon: parseFloat(lons[i]), elevation: elevs[i] || 200 });
                    }
                    var payload = getMapcompSettings();
                    payload.samples = samples;
                    payload.exaggeration = exaggeration;
                    callHost("create3DTerrainMesh", payload);
                });
        });

        document.getElementById("btnCreateDataChart").addEventListener("click", function () {
            var lines = document.getElementById("dataChartTextarea").value.trim().split("\n");
            var items = [];
            lines.forEach(function (ln) {
                var p = ln.split(",");
                if (p.length >= 4) {
                    items.push({ name: p[0].trim(), lat: parseFloat(p[1]), lon: parseFloat(p[2]), value: parseFloat(p[3]), color: (p[4] || "#38bdf8").trim() });
                }
            });
            var payload = getMapcompSettings();
            payload.items = items;
            callHost("createGeoDataChart", payload);
        });

        // 3D Terrain Mode (Full-Panel Interactive WebGL DEM + AE Hillshade/Displacement Rig)
        var terrariumProvider = {
            name: "AWS Terrarium DEM",
            url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
            subdomains: ["a"]
        };

        var terrain3DState = {
            active: false,
            rafId: 0,
            yaw: 0.35,
            pitch: 0.72,
            dist: 2.35,
            exag: 2.5,
            sunAzimuth: 315,
            lastPackage: null
        };

        function buildTerrariumTerrainPackage(lat, lon, rawZoom, provider, halfCols, halfRows, featherHillshade) {
            halfCols = (halfCols !== undefined) ? halfCols : 1;
            halfRows = (halfRows !== undefined) ? halfRows : 1;
            var cols = halfCols * 2 + 1;
            var rows = halfRows * 2 + 1;
            var pxW = cols * 256;
            var pxH = rows * 256;

            var z = Math.min(13, Math.max(4, Math.round(rawZoom)));
            var n = Math.pow(2, z);
            var cx = Math.floor((lon + 180.0) / 360.0 * n);
            var latRad = lat * Math.PI / 180.0;
            var cy = Math.floor((1.0 - Math.log(Math.tan(latRad) + 1.0 / Math.cos(latRad)) / Math.PI) / 2.0 * n);
            var centerCoord = tileXYToCenterLatLon(cx, cy, z);

            var demCanvas = document.createElement("canvas");
            demCanvas.width = pxW;
            demCanvas.height = pxH;
            var demCtx = demCanvas.getContext("2d");

            var texCanvas = document.createElement("canvas");
            texCanvas.width = pxW;
            texCanvas.height = pxH;
            var texCtx = texCanvas.getContext("2d");
            texCtx.fillStyle = "#0b1120";
            texCtx.fillRect(0, 0, pxW, pxH);

            var jobs = [];
            for (var dx = -halfCols; dx <= halfCols; dx++) {
                for (var dy = -halfRows; dy <= halfRows; dy++) {
                    (function (ox, oy) {
                        var ty = cy + oy;
                        if (ty < 0 || ty >= n) return;
                        var tx = ((cx + ox) % n + n) % n;
                        var destX = (ox + halfCols) * 256;
                        var destY = (oy + halfRows) * 256;

                        jobs.push(fetchTileImageWithRetry(terrariumProvider, z, tx, ty, 2).then(function (res) {
                            if (res && res.img) {
                                demCtx.drawImage(res.img, res.sx, res.sy, res.sw, res.sh, destX, destY, 256, 256);
                            }
                        }));
                        jobs.push(fetchTileImageWithRetry(provider, z, tx, ty, 2).then(function (res) {
                            if (res && res.img) {
                                texCtx.drawImage(res.img, res.sx, res.sy, res.sw, res.sh, destX, destY, 256, 256);
                            }
                        }));
                    })(dx, dy);
                }
            }

            return Promise.all(jobs).then(function () {
                var demData = demCtx.getImageData(0, 0, pxW, pxH).data;
                var gridW = halfCols > 1 ? 192 : 96;
                var gridH = halfRows > 1 ? 144 : 96;
                var elevs = new Float32Array(gridW * gridH);
                var minE = 99999;
                var maxE = -99999;

                for (var r = 0; r < gridH; r++) {
                    var py = Math.min(pxH - 1, Math.floor((r / (gridH - 1)) * (pxH - 1)));
                    for (var c = 0; c < gridW; c++) {
                        var px = Math.min(pxW - 1, Math.floor((c / (gridW - 1)) * (pxW - 1)));
                        var idx = (py * pxW + px) * 4;
                        var R = demData[idx];
                        var G = demData[idx + 1];
                        var B = demData[idx + 2];
                        var elev = (R * 256.0 + G + B / 256.0) - 32768.0;
                        if (elev < -500 || elev > 9000) elev = 0;
                        elevs[r * gridW + c] = elev;
                        if (elev < minE) minE = elev;
                        if (elev > maxE) maxE = elev;
                    }
                }
                if (maxE <= minE + 10) maxE = minE + 500;

                // Build exact pxW x pxH Grayscale Heightmap & 3D Sun-Lit Hillshade canvases for AE
                var hmSmall = document.createElement("canvas");
                hmSmall.width = gridW;
                hmSmall.height = gridH;
                var hmSCtx = hmSmall.getContext("2d");
                var hmImg = hmSCtx.createImageData(gridW, gridH);

                var hsSmall = document.createElement("canvas");
                hsSmall.width = gridW;
                hsSmall.height = gridH;
                var hsSCtx = hsSmall.getContext("2d");
                var hsImg = hsSCtx.createImageData(gridW, gridH);

                var span = maxE - minE;
                var sunRad = (terrain3DState.sunAzimuth || 315) * Math.PI / 180.0;
                var sunX = Math.sin(sunRad) * 0.82;
                var sunY = -Math.cos(sunRad) * 0.82;
                var sunZ = 0.57;

                for (var rr = 0; rr < gridH; rr++) {
                    for (var cc = 0; cc < gridW; cc++) {
                        var i = rr * gridW + cc;
                        var v = elevs[i];
                        var norm = Math.max(0, Math.min(255, Math.round(((v - minE) / span) * 255)));
                        hmImg.data[i * 4] = norm;
                        hmImg.data[i * 4 + 1] = norm;
                        hmImg.data[i * 4 + 2] = norm;
                        hmImg.data[i * 4 + 3] = 255;

                        var cL = elevs[rr * gridW + Math.max(0, cc - 1)];
                        var cR = elevs[rr * gridW + Math.min(gridW - 1, cc + 1)];
                        var cU = elevs[Math.max(0, rr - 1) * gridW + cc];
                        var cD = elevs[Math.min(gridH - 1, rr + 1) * gridW + cc];
                        var dzx = ((cR - cL) / span) * 16.0;
                        var dzy = ((cD - cU) / span) * 16.0;
                        var nx = -dzx, ny = -dzy, nz = 1.0;
                        var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
                        // Neutral mid-gray (128) for flat terrain so Soft Light never washes out plains/sea
                        var dot = ((nx / len) * sunX + (ny / len) * sunY + (nz / len) * sunZ);
                        var flatDot = sunZ; // 0.57 when flat
                        var shade = Math.max(20, Math.min(245, Math.round(128 + (dot - flatDot) * 260)));
                        hsImg.data[i * 4] = shade;
                        hsImg.data[i * 4 + 1] = shade;
                        hsImg.data[i * 4 + 2] = shade;
                        hsImg.data[i * 4 + 3] = 255;
                    }
                }
                hmSCtx.putImageData(hmImg, 0, 0);
                hsSCtx.putImageData(hsImg, 0, 0);

                var hmHi = document.createElement("canvas");
                hmHi.width = pxW;
                hmHi.height = pxH;
                var hmHCtx = hmHi.getContext("2d");
                hmHCtx.imageSmoothingEnabled = true;
                hmHCtx.imageSmoothingQuality = "high";
                hmHCtx.drawImage(hmSmall, 0, 0, pxW, pxH);

                var hsHi = document.createElement("canvas");
                hsHi.width = pxW;
                hsHi.height = pxH;
                var hsHCtx = hsHi.getContext("2d");
                hsHCtx.imageSmoothingEnabled = true;
                hsHCtx.imageSmoothingQuality = "high";
                hsHCtx.drawImage(hsSmall, 0, 0, pxW, pxH);

                if (featherHillshade) {
                    // Feather outer 140px toward neutral mid-gray (128,128,128) so Soft Light has ZERO hard edges when zooming out!
                    var fSz = 140;
                    var gT = hsHCtx.createLinearGradient(0, 0, 0, fSz);
                    gT.addColorStop(0, "rgba(128,128,128,1)");
                    gT.addColorStop(1, "rgba(128,128,128,0)");
                    hsHCtx.fillStyle = gT;
                    hsHCtx.fillRect(0, 0, pxW, fSz);

                    var gB = hsHCtx.createLinearGradient(0, pxH, 0, pxH - fSz);
                    gB.addColorStop(0, "rgba(128,128,128,1)");
                    gB.addColorStop(1, "rgba(128,128,128,0)");
                    hsHCtx.fillStyle = gB;
                    hsHCtx.fillRect(0, pxH - fSz, pxW, fSz);

                    var gL = hsHCtx.createLinearGradient(0, 0, fSz, 0);
                    gL.addColorStop(0, "rgba(128,128,128,1)");
                    gL.addColorStop(1, "rgba(128,128,128,0)");
                    hsHCtx.fillStyle = gL;
                    hsHCtx.fillRect(0, 0, fSz, pxH);

                    var gR = hsHCtx.createLinearGradient(pxW, 0, pxW - fSz, 0);
                    gR.addColorStop(0, "rgba(128,128,128,1)");
                    gR.addColorStop(1, "rgba(128,128,128,0)");
                    hsHCtx.fillStyle = gR;
                    hsHCtx.fillRect(pxW - fSz, 0, fSz, pxH);
                }

                return {
                    z: z,
                    centerLat: centerCoord.lat,
                    centerLon: centerCoord.lon,
                    gridN: gridW,
                    elevs: elevs,
                    minE: minE,
                    maxE: maxE,
                    texCanvas: texCanvas,
                    hmCanvas: hmHi,
                    hsCanvas: hsHi
                };
            });
        }

        function startWebGLTerrainLoop(pkg) {
            var canvas = document.getElementById("terrain3DCanvas");
            if (!canvas) return;
            var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl) {
                var st = document.getElementById("terrain3DStatus");
                if (st) st.textContent = "WebGL desteklenmiyor; AE'ye 3D Aktar'ı kullanın.";
                return;
            }

            if (terrain3DState.rafId) {
                cancelAnimationFrame(terrain3DState.rafId);
                terrain3DState.rafId = 0;
            }

            var vsSrc = [
                "attribute vec3 aPos;",
                "attribute vec2 aUv;",
                "attribute vec3 aNorm;",
                "uniform mat4 uMvp;",
                "uniform float uExag;",
                "varying vec2 vUv;",
                "varying vec3 vNorm;",
                "void main() {",
                "  vec3 p = vec3(aPos.x, aPos.y * uExag, aPos.z);",
                "  gl_Position = uMvp * vec4(p, 1.0);",
                "  vUv = aUv;",
                "  vNorm = normalize(vec3(aNorm.x * uExag, aNorm.y, aNorm.z * uExag));",
                "}"
            ].join("\n");

            var fsSrc = [
                "precision mediump float;",
                "uniform sampler2D uTex;",
                "uniform vec3 uSunDir;",
                "varying vec2 vUv;",
                "varying vec3 vNorm;",
                "void main() {",
                "  vec4 col = texture2D(uTex, vUv);",
                "  vec3 sun = normalize(uSunDir);",
                "  float diff = clamp(dot(normalize(vNorm), sun), 0.0, 1.0);",
                "  float light = 0.52 + diff * 0.65;",
                "  gl_FragColor = vec4(col.rgb * light, 1.0);",
                "}"
            ].join("\n");

            function compileShader(type, src) {
                var sh = gl.createShader(type);
                gl.shaderSource(sh, src);
                gl.compileShader(sh);
                return sh;
            }

            var prog = gl.createProgram();
            gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSrc));
            gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSrc));
            gl.linkProgram(prog);
            gl.useProgram(prog);

            var N = pkg.gridN;
            var span = Math.max(100, pkg.maxE - pkg.minE);
            var positions = new Float32Array(N * N * 3);
            var uvs = new Float32Array(N * N * 2);
            var normals = new Float32Array(N * N * 3);
            var indices = [];

            for (var r = 0; r < N; r++) {
                for (var c = 0; c < N; c++) {
                    var i = r * N + c;
                    var u = c / (N - 1);
                    var v = r / (N - 1);
                    var h = ((pkg.elevs[i] - pkg.minE) / span) * 0.18;
                    positions[i * 3] = (u - 0.5) * 2.4;
                    positions[i * 3 + 1] = h;
                    positions[i * 3 + 2] = (v - 0.5) * 2.4;

                    uvs[i * 2] = u;
                    uvs[i * 2 + 1] = v;

                    var hL = ((pkg.elevs[r * N + Math.max(0, c - 1)] - pkg.minE) / span) * 0.18;
                    var hR = ((pkg.elevs[r * N + Math.min(N - 1, c + 1)] - pkg.minE) / span) * 0.18;
                    var hU = ((pkg.elevs[Math.max(0, r - 1) * N + c] - pkg.minE) / span) * 0.18;
                    var hD = ((pkg.elevs[Math.min(N - 1, r + 1) * N + c] - pkg.minE) / span) * 0.18;
                    var step = 2.4 / (N - 1);
                    normals[i * 3] = (hL - hR) / (2 * step);
                    normals[i * 3 + 1] = 1.0;
                    normals[i * 3 + 2] = (hU - hD) / (2 * step);
                }
            }

            for (var rr = 0; rr < N - 1; rr++) {
                for (var cc = 0; cc < N - 1; cc++) {
                    var a = rr * N + cc;
                    var b = a + 1;
                    var d = (rr + 1) * N + cc;
                    var e = d + 1;
                    indices.push(a, d, b, b, d, e);
                }
            }

            function bindAttr(name, data, size) {
                var buf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                var loc = gl.getAttribLocation(prog, name);
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
            }

            bindAttr("aPos", positions, 3);
            bindAttr("aUv", uvs, 2);
            bindAttr("aNorm", normals, 3);

            var ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pkg.texCanvas);

            var uMvp = gl.getUniformLocation(prog, "uMvp");
            var uExag = gl.getUniformLocation(prog, "uExag");
            var uSunDir = gl.getUniformLocation(prog, "uSunDir");

            function mat4Perspective(fov, aspect, near, far) {
                var f = 1.0 / Math.tan(fov / 2);
                var nf = 1 / (near - far);
                return [
                    f / aspect, 0, 0, 0,
                    0, f, 0, 0,
                    0, 0, (far + near) * nf, -1,
                    0, 0, (2 * far * near) * nf, 0
                ];
            }

            function mat4Mul(a, b) {
                var out = new Float32Array(16);
                for (var col = 0; col < 4; col++) {
                    for (var row = 0; row < 4; row++) {
                        out[col * 4 + row] =
                            a[0 * 4 + row] * b[col * 4 + 0] +
                            a[1 * 4 + row] * b[col * 4 + 1] +
                            a[2 * 4 + row] * b[col * 4 + 2] +
                            a[3 * 4 + row] * b[col * 4 + 3];
                    }
                }
                return out;
            }

            function renderFrame() {
                if (!terrain3DState.active) return;
                var dpr = window.devicePixelRatio || 1;
                var w = Math.max(100, Math.round(canvas.clientWidth * dpr));
                var h = Math.max(100, Math.round(canvas.clientHeight * dpr));
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w;
                    canvas.height = h;
                }
                gl.viewport(0, 0, w, h);
                gl.enable(gl.DEPTH_TEST);
                gl.clearColor(0.025, 0.04, 0.08, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var proj = mat4Perspective(45 * Math.PI / 180, w / h, 0.05, 50.0);
                var cy = Math.cos(terrain3DState.yaw), sy = Math.sin(terrain3DState.yaw);
                var cp = Math.cos(terrain3DState.pitch), sp = Math.sin(terrain3DState.pitch);
                var rotY = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1];
                var rotX = [1, 0, 0, 0, 0, cp, sp, 0, 0, -sp, cp, 0, 0, 0, 0, 1];
                var trans = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -0.08, -terrain3DState.dist, 1];
                var mvp = mat4Mul(proj, mat4Mul(trans, mat4Mul(rotX, rotY)));

                gl.uniformMatrix4fv(uMvp, false, mvp);
                gl.uniform1f(uExag, terrain3DState.exag);
                var sRad = (terrain3DState.sunAzimuth || 315) * Math.PI / 180.0;
                if (uSunDir) gl.uniform3f(uSunDir, Math.sin(sRad), 0.75, -Math.cos(sRad));
                gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

                terrain3DState.rafId = requestAnimationFrame(renderFrame);
            }

            terrain3DState.rafId = requestAnimationFrame(renderFrame);
        }

        function openInteractive3DMode() {
            var overlay = document.getElementById("terrain3DModalOverlay");
            var stLbl = document.getElementById("terrain3DStatus");
            if (!overlay) return;
            overlay.classList.remove("hidden");
            terrain3DState.active = true;
            if (stLbl) stLbl.textContent = "SRTM 3D Yükleniyor...";

            var c = map.getCenter();
            var z = map.getZoom();
            var provKey = document.getElementById("tileProviderSelect").value || "esri_sat";
            var prov = TILE_PROVIDERS[provKey] || TILE_PROVIDERS.esri_sat;

            buildTerrariumTerrainPackage(c.lat, c.lng, z, prov)
                .then(function (pkg) {
                    terrain3DState.lastPackage = pkg;
                    if (stLbl) {
                        stLbl.textContent = "Z" + pkg.z + " • " + Math.round(pkg.minE) + "m – " + Math.round(pkg.maxE) + "m";
                    }
                    startWebGLTerrainLoop(pkg);
                })
                .catch(function (err) {
                    if (stLbl) stLbl.textContent = "Hata: " + err.message;
                });
        }

        function closeInteractive3DMode() {
            var overlay = document.getElementById("terrain3DModalOverlay");
            terrain3DState.active = false;
            if (terrain3DState.rafId) {
                cancelAnimationFrame(terrain3DState.rafId);
                terrain3DState.rafId = 0;
            }
            if (overlay) overlay.classList.add("hidden");
        }

        var canvas3D = document.getElementById("terrain3DCanvas");
        if (canvas3D) {
            var drag3D = false, last3DX = 0, last3DY = 0;
            canvas3D.addEventListener("mousedown", function (ev) {
                drag3D = true;
                last3DX = ev.clientX;
                last3DY = ev.clientY;
            });
            window.addEventListener("mousemove", function (ev) {
                if (!drag3D || !terrain3DState.active) return;
                terrain3DState.yaw += (ev.clientX - last3DX) * 0.008;
                terrain3DState.pitch = Math.max(0.18, Math.min(1.45, terrain3DState.pitch + (ev.clientY - last3DY) * 0.008));
                last3DX = ev.clientX;
                last3DY = ev.clientY;
            });
            window.addEventListener("mouseup", function () { drag3D = false; });
            canvas3D.addEventListener("wheel", function (ev) {
                ev.preventDefault();
                terrain3DState.dist = Math.max(1.0, Math.min(5.0, terrain3DState.dist + ev.deltaY * 0.002));
            }, { passive: false });
        }

        var btnEnter3DTop = document.getElementById("btnToggle3DMode");
        if (btnEnter3DTop) btnEnter3DTop.addEventListener("click", openInteractive3DMode);
        var btnEnter3DTab = document.getElementById("btnTabEnter3DMode");
        if (btnEnter3DTab) btnEnter3DTab.addEventListener("click", openInteractive3DMode);
        var btnExit3D = document.getElementById("btnExit3DMode");
        if (btnExit3D) btnExit3D.addEventListener("click", closeInteractive3DMode);

        var inpExag3D = document.getElementById("inp3DExagSlider");
        if (inpExag3D) {
            inpExag3D.addEventListener("input", function () {
                var val = parseFloat(this.value) || 2.5;
                terrain3DState.exag = val;
                var lbl = document.getElementById("lbl3DExagVal");
                if (lbl) lbl.textContent = val.toFixed(1) + "x";
            });
        }

        var inpSun3D = document.getElementById("inp3DSunSlider");
        if (inpSun3D) {
            inpSun3D.addEventListener("input", function () {
                var deg = parseFloat(this.value) || 315;
                terrain3DState.sunAzimuth = deg;
                var lbl = document.getElementById("lbl3DSunVal");
                if (lbl) lbl.textContent = Math.round(deg) + "°";
            });
        }

        var btn3DKey = document.getElementById("btn3DAddKeyframe");
        if (btn3DKey) {
            btn3DKey.addEventListener("click", function () {
                // Convert WebGL 3D orbit angles into AE Mapcomp Pitch (0..60) & Bearing (-180..180)
                var aePitch = Math.max(0, Math.min(60, Math.round(90 - (terrain3DState.pitch * 180 / Math.PI))));
                var aeBearing = Math.round((terrain3DState.yaw * 180 / Math.PI) % 360);
                if (aeBearing > 180) aeBearing -= 360;
                if (aeBearing < -180) aeBearing += 360;
                var zoomDelta = Math.log(2.35 / Math.max(0.8, terrain3DState.dist)) / Math.LN2;

                document.getElementById("inpViewPitch").value = aePitch;
                document.getElementById("inpViewBearing").value = aeBearing;
                var badge = document.getElementById("lblTiltBadge");
                if (badge) badge.textContent = aePitch + "\u00b0 Tilt";
                updateMapPerspectivePreview();

                var payload = getMapcompSettings();
                payload.zoom = Math.min(18.5, Math.max(2.8, payload.zoom + zoomDelta));
                payload.setKeyframe = true;
                callHost("setMapcompViewKeyframe", payload, function () {
                    var stLbl = document.getElementById("terrain3DStatus");
                    if (stLbl) stLbl.textContent = "◆ 3D Keyframe eklendi (Pitch " + aePitch + "°, Bearing " + aeBearing + "°)";
                });
            });
        }

        function exportTerrainPackageToAE(pkg, exagVal, horizonPkg) {
            if (typeof window.require !== "function") {
                setStatus("3D DEM oluşturuldu (Min: " + Math.round(pkg.minE) + "m, Max: " + Math.round(pkg.maxE) + "m).");
                return;
            }
            var fs = window.require("fs");
            var path = window.require("path");
            var os = window.require("os");
            var dir = path.join(os.tmpdir(), "GeoMotion_Heightmaps");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            var ts = Date.now();
            var hmPath = path.join(dir, "Heightmap_DEM_" + ts + ".png");
            var hsPath = path.join(dir, "Hillshade_3D_" + ts + ".png");
            fs.writeFileSync(hmPath, Buffer.from(pkg.hmCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), "base64"));
            fs.writeFileSync(hsPath, Buffer.from(pkg.hsCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), "base64"));

            var animChk = document.getElementById("chk3DAnimateRelief");
            var payload = getMapcompSettings();
            payload.filePath = hmPath;
            payload.hillshadePath = hsPath;
            payload.tileZoom = pkg.z;
            payload.centerLat = pkg.centerLat;
            payload.centerLon = pkg.centerLon;
            if (horizonPkg) {
                var hsHorPath = path.join(dir, "Hillshade_Horizon_" + ts + ".png");
                fs.writeFileSync(hsHorPath, Buffer.from(horizonPkg.hsCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), "base64"));
                payload.horizonHillshadePath = hsHorPath;
                payload.horizonZoom = horizonPkg.z;
                payload.horizonLat = horizonPkg.centerLat;
                payload.horizonLon = horizonPkg.centerLon;
            }
            payload.exaggeration = exagVal || 2.5;
            payload.animateRelief = animChk ? animChk.checked : true;
            callHost("importHeightmapAnd3DRig", payload);
        }

        function buildAndExportMultiZoom3D(exagVal, onDone) {
            var c = map.getCenter();
            var settings = getMapcompSettings();
            var baseZ = Math.min(13, Math.max(4, Math.round(settings.zoom || map.getZoom())));
            var horizonZ = Math.max(4, baseZ - 3);
            var provKey = document.getElementById("tileProviderSelect").value || "esri_sat";
            var prov = TILE_PROVIDERS[provKey] || TILE_PROVIDERS.esri_sat;

            var jobs = [buildTerrariumTerrainPackage(c.lat, c.lng, baseZ, prov, 4, 3, horizonZ < baseZ)];
            if (horizonZ < baseZ) {
                jobs.push(buildTerrariumTerrainPackage(c.lat, c.lng, horizonZ, prov, 4, 3, true));
            }
            return Promise.all(jobs).then(function (pkgs) {
                exportTerrainPackageToAE(pkgs[0], exagVal, pkgs[1] || null);
                if (typeof onDone === "function") onDone();
            });
        }

        var btnSend3DAE = document.getElementById("btnSend3DToAE");
        if (btnSend3DAE) {
            btnSend3DAE.addEventListener("click", function () {
                var stLbl = document.getElementById("terrain3DStatus");
                if (stLbl) stLbl.textContent = "Çoklu-Zoom 3D Rölyef AE'ye hazırlanıyor...";
                buildAndExportMultiZoom3D(terrain3DState.exag, closeInteractive3DMode);
            });
        }

        // 3D Landscape Heightmap & Hillshade Rig (Tab 5 button)
        var btnHeightmapRig = document.getElementById("btnExportHeightmapRig");
        if (btnHeightmapRig) {
            btnHeightmapRig.addEventListener("click", function () {
                var exag = parseFloat(document.getElementById("terrainExaggeration").value) || 2.5;
                setStatus("🗻 Çoklu-Zoom SRTM DEM üzerinden tüm bölge & ufuk için 3D Hillshade + Heightmap oluşturuluyor...");
                buildAndExportMultiZoom3D(exag).catch(function (err) {
                    setStatus("Heightmap DEM hatası: " + err.message, true);
                });
            });
        }

        // Custom TMS/XYZ Server Profiles & Cache Manager Bindings
        var btnAddCustomSrv = document.getElementById("btnAddCustomTileServer");
        if (btnAddCustomSrv) {
            btnAddCustomSrv.addEventListener("click", function () {
                var srvName = (document.getElementById("inpCustomTileName").value || "Custom TMS").trim();
                var srvUrl = (document.getElementById("inpCustomTileUrl").value || "").trim();
                if (!srvUrl || srvUrl.indexOf("{z}") === -1) {
                    setStatus("Lütfen {z}/{x}/{y} içeren geçerli bir TMS/XYZ URL şablonu girin.", true);
                    return;
                }
                var customKey = "custom_" + Date.now();
                TILE_PROVIDERS[customKey] = {
                    name: srvName,
                    url: srvUrl,
                    subdomains: "abc"
                };
                var sel = document.getElementById("tileProviderSelect");
                if (sel) {
                    var opt = document.createElement("option");
                    opt.value = customKey;
                    opt.textContent = srvName + " (Custom TMS)";
                    sel.appendChild(opt);
                    sel.value = customKey;
                }
                switchTileProvider(customKey);
                setStatus("🌐 Özel Harita Sunucusu eklendi ve etkinleştirildi: " + srvName);
            });
        }

        var btnExportSrv = document.getElementById("btnExportServerProfiles");
        if (btnExportSrv) {
            btnExportSrv.addEventListener("click", function () {
                if (typeof window.require === "function") {
                    var fs = window.require("fs");
                    var path = window.require("path");
                    var os = window.require("os");
                    var outPath = path.join(os.homedir(), "Desktop", "GeoMotion_TileServers_Backup.json");
                    fs.writeFileSync(outPath, JSON.stringify(TILE_PROVIDERS, null, 2), "utf8");
                    setStatus("💾 Sunucu profilleri Masaüstüne dışa aktarıldı: GeoMotion_TileServers_Backup.json");
                } else {
                    setStatus("Sunucu profilleri panoya hazırlandı.");
                }
            });
        }

        var btnClearCache = document.getElementById("btnClearTileCache");
        if (btnClearCache) {
            btnClearCache.addEventListener("click", function () {
                if (typeof window.require === "function") {
                    try {
                        var fs = window.require("fs");
                        var path = window.require("path");
                        var os = window.require("os");
                        var tmp = os.tmpdir();
                        var entries = fs.readdirSync(tmp);
                        var removed = 0;
                        entries.forEach(function (name) {
                            if (name.indexOf("GeoMotion_") === 0 || name.indexOf("OpenGeoLayers_") === 0) {
                                var full = path.join(tmp, name);
                                fs.rmSync(full, { recursive: true, force: true });
                                removed++;
                            }
                        });
                        setStatus("🧹 Harita Önbelleği temizlendi (" + removed + " geçici atlas klasörü silindi).");
                    } catch (e) {
                        setStatus("Önbellek temizleme: " + e.message, true);
                    }
                } else {
                    setStatus("🧹 Tarayıcı harita önbelleği sıfırlandı.");
                }
            });
        }

        // Language Switcher Button
        var btnLang = document.getElementById("btnToggleLanguage");
        if (btnLang) {
            btnLang.addEventListener("click", function () {
                setLanguage(currentLang === "tr" ? "en" : "tr");
            });
        }

        // Visual Map Style Modal Bindings
        var btnOpenModal = document.getElementById("btnOpenMapStyleModal");
        if (btnOpenModal) {
            btnOpenModal.addEventListener("click", openMapStyleModal);
        }

        var btnCloseModal = document.getElementById("btnCloseMapStyleModal");
        if (btnCloseModal) {
            btnCloseModal.addEventListener("click", closeMapStyleModal);
        }

        var mapModalBackdrop = document.getElementById("mapStyleModal");
        if (mapModalBackdrop) {
            mapModalBackdrop.addEventListener("click", function (ev) {
                if (ev.target === mapModalBackdrop) closeMapStyleModal();
            });
        }

        var filterBtns = document.querySelectorAll(".gl-gal-filter");
        for (var fb = 0; fb < filterBtns.length; fb++) {
            filterBtns[fb].addEventListener("click", function () {
                for (var j = 0; j < filterBtns.length; j++) filterBtns[j].classList.remove("active");
                this.classList.add("active");
                renderMapStyleGallery(this.getAttribute("data-filter"));
            });
        }

        var btnConfirmStyle = document.getElementById("btnConfirmMapStyle");
        if (btnConfirmStyle) {
            btnConfirmStyle.addEventListener("click", function () {
                applySelectedMapStyle(selectedModalStyleId);
                closeMapStyleModal();
            });
        }

        var btnModalMt = document.getElementById("btnModalOpenMapTiler");
        if (btnModalMt) {
            btnModalMt.addEventListener("click", function () {
                closeMapStyleModal();
                var drawer = document.getElementById("maptilerQuickDrawer");
                if (drawer) {
                    drawer.classList.remove("hidden");
                    var inp = document.getElementById("inpMapTilerKeyQuick");
                    if (inp) inp.focus();
                }
            });
        }

        // --- UI SCALE TOGGLE & PREFERENCE EVENTS ---
        var btnScale = document.getElementById("btnToggleUiScale");
        if (btnScale) {
            btnScale.addEventListener("click", function () {
                cycleUiScale();
            });
        }

        var selUiScale = document.getElementById("prefsUiScaleSelect");
        if (selUiScale) {
            selUiScale.addEventListener("change", function () {
                setUiScale(this.value);
            });
        }

        // --- MAP LABELS LANGUAGE EVENTS ---
        var selMapLang = document.getElementById("mapLabelLangSelect");
        if (selMapLang) {
            selMapLang.addEventListener("change", function () {
                setMapLabelLang(this.value);
            });
        }

        var selPrefsMapLang = document.getElementById("prefsMapLabelLangSelect");
        if (selPrefsMapLang) {
            selPrefsMapLang.addEventListener("change", function () {
                setMapLabelLang(this.value);
            });
        }

        // --- MOTION BLUR EVENTS ---
        var chkMb = document.getElementById("chkMotionBlur");
        if (chkMb) {
            chkMb.addEventListener("change", function () {
                applyMotionBlurToAE(this.checked);
            });
        }

        var selMb = document.getElementById("compMotionBlurSelect");
        if (selMb) {
            selMb.addEventListener("change", function () {
                applyMotionBlurToAE(this.value === "true");
            });
        }

        var btnApplyMbNow = document.getElementById("btnApplyMotionBlurNow");
        if (btnApplyMbNow) {
            btnApplyMbNow.addEventListener("click", function () {
                var chk = document.getElementById("chkMotionBlur");
                applyMotionBlurToAE(chk ? chk.checked : true);
            });
        }

        // --- COMPOSITION SETTINGS & DUPLICATE MANAGER MODAL EVENTS ---
        var btnOpenCompModal = document.getElementById("btnOpenCompSettings");
        if (btnOpenCompModal) {
            btnOpenCompModal.addEventListener("click", openCompSettingsModal);
        }

        var btnCloseCompModal = document.getElementById("btnCloseCompSettingsModal");
        if (btnCloseCompModal) {
            btnCloseCompModal.addEventListener("click", closeCompSettingsModal);
        }

        var compModalBackdrop = document.getElementById("compSettingsModal");
        if (compModalBackdrop) {
            compModalBackdrop.addEventListener("click", function (ev) {
                if (ev.target === compModalBackdrop) closeCompSettingsModal();
            });
        }

        // Modal Tab Switchers
        var cmTabBtns = document.querySelectorAll(".gl-comp-tab-btn");
        for (var ctb = 0; ctb < cmTabBtns.length; ctb++) {
            cmTabBtns[ctb].addEventListener("click", function () {
                for (var j = 0; j < cmTabBtns.length; j++) cmTabBtns[j].classList.remove("active");
                this.classList.add("active");
                var target = this.getAttribute("data-cm-tab");
                var panes = document.querySelectorAll(".gl-cm-pane");
                for (var p = 0; p < panes.length; p++) {
                    panes[p].classList.toggle("active", panes[p].id === target);
                }
            });
        }

        // Tab 1: Resize Preset Cards
        var resizeCards = document.querySelectorAll(".gl-cm-preset-card");
        for (var rc = 0; rc < resizeCards.length; rc++) {
            resizeCards[rc].addEventListener("click", function () {
                for (var j = 0; j < resizeCards.length; j++) resizeCards[j].classList.remove("active");
                this.classList.add("active");
                var w = this.getAttribute("data-w");
                var h = this.getAttribute("data-h");
                document.getElementById("cmResizeWidth").value = w;
                document.getElementById("cmResizeHeight").value = h;
            });
        }

        // Tab 1: Execute Resize
        var btnExecResize = document.getElementById("btnExecuteResizeComp");
        if (btnExecResize) {
            btnExecResize.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                var w = parseInt(document.getElementById("cmResizeWidth").value, 10) || 1920;
                var h = parseInt(document.getElementById("cmResizeHeight").value, 10) || 1080;
                var fps = parseFloat(document.getElementById("cmResizeFps").value) || 30;
                var dur = parseFloat(document.getElementById("cmResizeDuration").value) || 15;
                var recenter = document.getElementById("chkCmRecenterRig").checked;

                callHost("resizeMapcomp", {
                    compName: curName,
                    width: w,
                    height: h,
                    fps: fps,
                    duration: dur,
                    recenterRig: recenter
                }, function (res) {
                    if (res && res.ok) {
                        setStatus(res.message);
                        var badge = document.getElementById("lblModalActiveCompBadge");
                        if (badge) badge.textContent = curName + " • " + w + "×" + h + " (" + fps + " FPS, " + dur.toFixed(1) + "s)";
                        document.getElementById("compFpsInput").value = fps;
                        document.getElementById("compDurationInput").value = dur;
                        closeCompSettingsModal();
                    } else {
                        setStatus((res && res.error) ? res.error : "Kompozisyon yeniden boyutlandırılamadı.", true);
                    }
                });
            });
        }

        // Tab 2: Duplicate Preset Cards
        var dupCards = document.querySelectorAll(".gl-cm-dup-preset-card");
        for (var dc = 0; dc < dupCards.length; dc++) {
            dupCards[dc].addEventListener("click", function () {
                for (var j = 0; j < dupCards.length; j++) dupCards[j].classList.remove("active");
                this.classList.add("active");
                var w = this.getAttribute("data-w");
                var h = this.getAttribute("data-h");
                var tag = this.getAttribute("data-tag");
                document.getElementById("cmDupWidth").value = w;
                document.getElementById("cmDupHeight").value = h;
                var baseName = document.getElementById("compNameInput").value || "Mapcomp 1";
                document.getElementById("cmDupTargetName").value = baseName + " (" + tag + ")";
            });
        }

        // Tab 2: Execute Duplicate
        var btnExecDup = document.getElementById("btnExecuteDuplicateComp");
        if (btnExecDup) {
            btnExecDup.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                var targetName = document.getElementById("cmDupTargetName").value || (curName + " (Copy)");
                var w = parseInt(document.getElementById("cmDupWidth").value, 10) || 1080;
                var h = parseInt(document.getElementById("cmDupHeight").value, 10) || 1920;
                var cleanAtlas = document.getElementById("chkCmCleanAtlas").checked;

                callHost("duplicateMapcomp", {
                    compName: curName,
                    targetName: targetName,
                    width: w,
                    height: h,
                    cleanAtlas: cleanAtlas
                }, function (res) {
                    if (res && res.ok) {
                        setStatus(res.message);
                        // Add to comp selector
                        var sel = document.getElementById("activeMapcompSelect");
                        if (sel) {
                            var opt = document.createElement("option");
                            opt.value = res.compName;
                            opt.textContent = res.compName;
                            sel.appendChild(opt);
                            sel.value = res.compName;
                        }
                        document.getElementById("compNameInput").value = res.compName;
                        closeCompSettingsModal();
                    } else {
                        setStatus((res && res.error) ? res.error : "Kompozisyon çoğaltılamadı.", true);
                    }
                });
            });
        }

        // Tab 3: Cinematic Ease
        var btnEase = document.getElementById("btnApplyCinematicEase");
        if (btnEase) {
            btnEase.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                callHost("applyCinematicEaseToMapcomp", { compName: curName, influence: 75 }, function (res) {
                    if (res && res.message) setStatus(res.message);
                });
            });
        }

        // Tab 3: Reverse Anim
        var btnReverse = document.getElementById("btnApplyReverseAnim");
        if (btnReverse) {
            btnReverse.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                callHost("reverseMapcompKeyframes", { compName: curName }, function (res) {
                    if (res && res.message) setStatus(res.message);
                });
            });
        }

        // Tab 3: Time Stretch chips & button
        var stretchChips = document.querySelectorAll(".gl-stretch-chip");
        for (var sc = 0; sc < stretchChips.length; sc++) {
            stretchChips[sc].addEventListener("click", function () {
                for (var j = 0; j < stretchChips.length; j++) stretchChips[j].classList.remove("active");
                this.classList.add("active");
                activeStretchFactor = parseFloat(this.getAttribute("data-factor")) || 2.0;
            });
        }

        var btnStretch = document.getElementById("btnApplyTimeStretch");
        if (btnStretch) {
            btnStretch.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                callHost("timeStretchMapcompKeyframes", { compName: curName, factor: activeStretchFactor }, function (res) {
                    if (res && res.message) {
                        setStatus(res.message);
                        if (res.newDuration) {
                            document.getElementById("compDurationInput").value = res.newDuration;
                        }
                    }
                });
            });
        }

        // Tab 3: Draft Mode
        var btnDraft = document.getElementById("btnToggleDraftMode");
        if (btnDraft) {
            btnDraft.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                isDraftModeActive = !isDraftModeActive;
                callHost("toggleMapcompDraftMode", { compName: curName, draftMode: isDraftModeActive }, function (res) {
                    if (res && res.message) setStatus(res.message);
                    btnDraft.classList.toggle("active", isDraftModeActive);
                });
            });
        }

        // Tab 3: Layer Lock
        var btnLock = document.getElementById("btnToggleLayerLock");
        if (btnLock) {
            btnLock.addEventListener("click", function () {
                var curName = document.getElementById("compNameInput").value || "Mapcomp 1";
                isLayersLocked = !isLayersLocked;
                callHost("toggleMapcompLayerLock", { compName: curName, lock: isLayersLocked }, function (res) {
                    if (res && res.message) setStatus(res.message);
                    btnLock.classList.toggle("active", isLayersLocked);
                });
            });
        }

        // =====================================================================
        // TAB 4: ABOUT & AUTO-UPDATER BINDINGS
        // =====================================================================
        var inpRepo = document.getElementById("inpGithubRepo");
        if (inpRepo) inpRepo.value = GeoUpdater.getRepo();

        var btnSaveRepo = document.getElementById("btnSaveGithubRepo");
        if (btnSaveRepo) {
            btnSaveRepo.addEventListener("click", function () {
                var val = (document.getElementById("inpGithubRepo").value || "").trim();
                if (val) {
                    GeoUpdater.setRepo(val);
                    setStatus("GitHub deposu kaydedildi: " + val);
                }
            });
        }

        var btnCheckManual = document.getElementById("btnCheckUpdateManual");
        if (btnCheckManual) {
            btnCheckManual.addEventListener("click", function () {
                GeoUpdater.checkUpdate(false);
            });
        }

        var btnInstallNow = document.getElementById("btnInstallUpdateNow");
        if (btnInstallNow) {
            btnInstallNow.addEventListener("click", function () {
                GeoUpdater.applyHotUpdate();
            });
        }

        var btnDownloadPkg = document.getElementById("btnDownloadInstallerPkg");
        if (btnDownloadPkg) {
            btnDownloadPkg.addEventListener("click", function () {
                GeoUpdater.downloadInstaller();
            });
        }

        // Top Update Notification Banner
        var btnOpenUpModal = document.getElementById("btnOpenUpdateModal");
        if (btnOpenUpModal) {
            btnOpenUpModal.addEventListener("click", function () {
                openCompSettingsModal();
                var aboutBtn = document.getElementById("cm_tab_about_btn");
                if (aboutBtn) aboutBtn.click();
            });
        }

        var btnDismissUp = document.getElementById("btnDismissUpdate");
        if (btnDismissUp) {
            btnDismissUp.addEventListener("click", function () {
                var b = document.getElementById("glUpdateBanner");
                if (b) b.classList.add("hidden");
            });
        }
    }

    // =========================================================================
    // 8. GEOCOPILOT AI CHATBOT & NATURAL LANGUAGE INTENT ENGINE
    // =========================================================================
    var COPILOT_KNOWLEDGE = {
        places: {
            "turkey": { name: "Türkiye", lat: 39.0, lon: 35.2, zoom: 6.0, preset: "Turkey" },
            "türkiye": { name: "Türkiye", lat: 39.0, lon: 35.2, zoom: 6.0, preset: "Turkey" },
            "ankara": { name: "Ankara", lat: 39.9255, lon: 32.8663, zoom: 11.0, preset: "Ankara" },
            "istanbul": { name: "İstanbul", lat: 41.0082, lon: 28.9784, zoom: 10.5, preset: "Istanbul" },
            "i̇stanbul": { name: "İstanbul", lat: 41.0082, lon: 28.9784, zoom: 10.5, preset: "Istanbul" },
            "izmir": { name: "İzmir", lat: 38.4237, lon: 27.1428, zoom: 11.0, preset: "Izmir" },
            "i̇zmir": { name: "İzmir", lat: 38.4237, lon: 27.1428, zoom: 11.0, preset: "Izmir" },
            "antalya": { name: "Antalya", lat: 36.8969, lon: 30.7133, zoom: 11.0, preset: null },
            "bursa": { name: "Bursa", lat: 40.1885, lon: 29.0610, zoom: 11.0, preset: null },
            "iran": { name: "İran", lat: 32.4279, lon: 53.6880, zoom: 5.6, preset: null },
            "i̇ran": { name: "İran", lat: 32.4279, lon: 53.6880, zoom: 5.6, preset: null },
            "hürmüz": { name: "Hürmüz Boğazı", lat: 26.5667, lon: 56.2500, zoom: 8.2, preset: null },
            "hurmuz": { name: "Hürmüz Boğazı", lat: 26.5667, lon: 56.2500, zoom: 8.2, preset: null },
            "hormuz": { name: "Hürmüz Boğazı", lat: 26.5667, lon: 56.2500, zoom: 8.2, preset: null },
            "hürmüz boğazı": { name: "Hürmüz Boğazı", lat: 26.5667, lon: 56.2500, zoom: 8.2, preset: null },
            "basra": { name: "Basra Körfezi", lat: 26.9000, lon: 51.8000, zoom: 6.2, preset: null },
            "basra körfezi": { name: "Basra Körfezi", lat: 26.9000, lon: 51.8000, zoom: 6.2, preset: null },
            "persian gulf": { name: "Basra Körfezi", lat: 26.9000, lon: 51.8000, zoom: 6.2, preset: null },
            "katar": { name: "Katar (Doha)", lat: 25.2861, lon: 51.5297, zoom: 9.5, preset: null },
            "qatar": { name: "Katar (Doha)", lat: 25.2861, lon: 51.5297, zoom: 9.5, preset: null },
            "doha": { name: "Katar (Doha)", lat: 25.2861, lon: 51.5297, zoom: 9.5, preset: null },
            "bahreyn": { name: "Bahreyn (ABD 5. Filo)", lat: 26.2285, lon: 50.5860, zoom: 10.0, preset: null },
            "bahrain": { name: "Bahreyn (ABD 5. Filo)", lat: 26.2285, lon: 50.5860, zoom: 10.0, preset: null },
            "orta doğu": { name: "Orta Doğu", lat: 27.5000, lon: 51.5000, zoom: 4.8, preset: null },
            "ortadoğu": { name: "Orta Doğu", lat: 27.5000, lon: 51.5000, zoom: 4.8, preset: null },
            "middle east": { name: "Orta Doğu", lat: 27.5000, lon: 51.5000, zoom: 4.8, preset: null },
            "azerbaijan": { name: "Azerbaycan", lat: 40.1431, lon: 47.5769, zoom: 7.0, preset: "Azerbaijan" },
            "azerbaycan": { name: "Azerbaycan", lat: 40.1431, lon: 47.5769, zoom: 7.0, preset: "Azerbaijan" },
            "germany": { name: "Almanya", lat: 51.1657, lon: 10.4515, zoom: 6.0, preset: "Germany" },
            "almanya": { name: "Almanya", lat: 51.1657, lon: 10.4515, zoom: 6.0, preset: "Germany" },
            "france": { name: "Fransa", lat: 46.2276, lon: 2.2137, zoom: 6.0, preset: "France" },
            "fransa": { name: "Fransa", lat: 46.2276, lon: 2.2137, zoom: 6.0, preset: "France" },
            "uk": { name: "İngiltere", lat: 55.3781, lon: -3.4360, zoom: 6.0, preset: "United Kingdom" },
            "ingiltere": { name: "İngiltere", lat: 55.3781, lon: -3.4360, zoom: 6.0, preset: "United Kingdom" },
            "usa": { name: "Amerika", lat: 37.0902, lon: -95.7129, zoom: 4.5, preset: "United States" },
            "amerika": { name: "Amerika", lat: 37.0902, lon: -95.7129, zoom: 4.5, preset: "United States" },
            "abd": { name: "ABD", lat: 37.0902, lon: -95.7129, zoom: 4.5, preset: "United States" },
            "japan": { name: "Japonya", lat: 36.2048, lon: 138.2529, zoom: 6.0, preset: "Japan" },
            "japonya": { name: "Japonya", lat: 36.2048, lon: 138.2529, zoom: 6.0, preset: "Japan" }
        }
    };

    var lastTargetLocation = COPILOT_KNOWLEDGE.places["türkiye"];

    function openCopilotDrawer() {
        var drawer = document.getElementById("geoCopilotDrawer");
        if (drawer) drawer.classList.remove("hidden");
        var btn = document.getElementById("btnToggleCopilot");
        if (btn) btn.classList.add("active");
        var inp = document.getElementById("copilotInput");
        if (inp) inp.focus();
    }

    function closeCopilotDrawer() {
        var drawer = document.getElementById("geoCopilotDrawer");
        if (drawer) drawer.classList.add("hidden");
        var btn = document.getElementById("btnToggleCopilot");
        if (btn) btn.classList.remove("active");
    }

    function addCopilotMessage(sender, htmlContent) {
        var stream = document.getElementById("copilotChatStream");
        if (!stream) return null;
        var row = document.createElement("div");
        row.className = "gl-chat-msg gl-chat-" + (sender === "user" ? "user" : "bot");
        if (sender === "bot") {
            row.innerHTML = '<div class="gl-chat-avatar">✦</div><div class="gl-chat-bubble">' + htmlContent + '</div>';
        } else {
            row.innerHTML = '<div class="gl-chat-bubble">' + htmlContent + '</div>';
        }
        stream.appendChild(row);
        stream.scrollTop = stream.scrollHeight;
        return row;
    }

    function bindCopilotEvents() {
        var btnToggle = document.getElementById("btnToggleCopilot");
        if (btnToggle) {
            btnToggle.addEventListener("click", function () {
                var curActive = document.querySelector(".gl-tab.active");
                var curId = curActive ? curActive.getAttribute("data-tab") : "";
                if (curId === "tab-copilot") {
                    window.switchTab("tab-collection");
                } else {
                    window.switchTab("tab-copilot");
                }
            });
        }

        var btnClose = document.getElementById("btnCloseCopilotDrawer");
        if (btnClose) {
            btnClose.addEventListener("click", closeCopilotDrawer);
        }

        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                var drawer = document.getElementById("geoCopilotDrawer");
                if (drawer && !drawer.classList.contains("hidden")) {
                    closeCopilotDrawer();
                }
            }
        });

        var btnExpand = document.getElementById("btnExpandCopilotDrawer");
        if (btnExpand) {
            btnExpand.addEventListener("click", function () {
                var drawer = document.getElementById("geoCopilotDrawer");
                if (drawer) {
                    var isFull = drawer.classList.toggle("fullscreen");
                    var lbl = document.getElementById("lblExpandCopilot");
                    if (lbl) lbl.textContent = isFull ? "Küçült" : "Tam Ekran";
                }
            });
        }

        var btnClear = document.getElementById("btnClearCopilotChat");
        if (btnClear) {
            btnClear.addEventListener("click", function () {
                var stream = document.getElementById("copilotChatStream");
                if (stream) {
                    stream.innerHTML = '<div class="gl-chat-msg gl-chat-bot">' +
                        '<div class="gl-chat-avatar">✦</div>' +
                        '<div class="gl-chat-bubble">' +
                        '<p><strong>Sohbet temizlendi.</strong> Yeni bir komut veya sahne akışı verebilirsiniz.</p>' +
                        '</div></div>';
                }
            });
        }

        // Quick Suggestion Chips
        var chips = document.querySelectorAll(".gl-copilot-chip");
        for (var c = 0; c < chips.length; c++) {
            chips[c].addEventListener("click", function () {
                var promptText = this.getAttribute("data-prompt");
                var inp = document.getElementById("copilotInput");
                if (inp) {
                    inp.value = promptText;
                    executeCopilotInput();
                }
            });
        }

        var btnSend = document.getElementById("btnCopilotSend");
        if (btnSend) {
            btnSend.addEventListener("click", executeCopilotInput);
        }

        var inpBox = document.getElementById("copilotInput");
        if (inpBox) {
            inpBox.addEventListener("keydown", function (ev) {
                if (ev.key === "Enter" && !ev.shiftKey) {
                    ev.preventDefault();
                    executeCopilotInput();
                }
            });
        }
    }

    function executeCopilotInput() {
        var inp = document.getElementById("copilotInput");
        if (!inp) return;
        var rawText = (inp.value || "").trim();
        if (!rawText) return;
        inp.value = "";

        // Add user message to chat
        addCopilotMessage("user", "<p>" + escapeHtml(rawText).replace(/\n/g, "<br/>") + "</p>");

        // Execute AI Intent Parser
        executeCopilotIntent(rawText);
    }

    function escapeHtml(str) {
        return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function resolveLocation(word) {
        if (!word) return null;
        var clean = word.toLowerCase().trim().replace(/['".,!?:;()]/g, "");
        for (var k in COPILOT_KNOWLEDGE.places) {
            if (clean.indexOf(k) !== -1 || k.indexOf(clean) !== -1) {
                return COPILOT_KNOWLEDGE.places[k];
            }
        }
        return null;
    }

    window.executeCopilotIntent = function (p) { return executeCopilotIntent(p); };
    async function executeCopilotIntent(prompt) {
        var lower = prompt.toLowerCase();
        var curName = document.getElementById("compNameInput").value || "Mapcomp 1";

        // Setup AI bubble with steps list
        var botBubbleRow = addCopilotMessage("bot",
            '<p><strong>Haber Senaryosu &amp; Komutlar İşleniyor...</strong></p>' +
            '<ul class="gl-chat-steps" id="copilotActiveSteps"></ul>'
        );
        var stepsList = botBubbleRow ? botBubbleRow.querySelector("#copilotActiveSteps") : null;

        function addStepLog(icon, text, statusClass) {
            if (!stepsList) return;
            var li = document.createElement("li");
            li.className = "gl-chat-step " + (statusClass || "pending");
            li.innerHTML = '<span class="step-icon">' + icon + '</span> ' + text;
            stepsList.appendChild(li);
            var stream = document.getElementById("copilotChatStream");
            if (stream) stream.scrollTop = stream.scrollHeight;
            return li;
        }

        // =====================================================================
        // STEP 1: RESOLUTION & DURATION SETUP (DO NOT RETURN EARLY!)
        // =====================================================================
        var targetW = null;
        var targetH = null;
        var targetFps = 30;
        var targetDur = null;

        if (lower.indexOf("9:16") !== -1 || lower.indexOf("reels") !== -1 || lower.indexOf("dikey") !== -1 || lower.indexOf("tiktok") !== -1 || lower.indexOf("shorts") !== -1) {
            targetW = 1080;
            targetH = 1920;
        } else if (lower.indexOf("4k") !== -1 || lower.indexOf("3840") !== -1 || lower.indexOf("ultra hd") !== -1) {
            targetW = 3840;
            targetH = 2160;
        } else if (lower.indexOf("16:9") !== -1 || lower.indexOf("yatay") !== -1 || lower.indexOf("full hd") !== -1) {
            targetW = 1920;
            targetH = 1080;
        }

        var durMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:saniye|sn|seconds|sec)\b/i);
        if (durMatch && durMatch[1]) {
            targetDur = parseFloat(durMatch[1]);
        }

        if (targetW || targetDur) {
            var finalW = targetW || parseInt(document.getElementById("cmResizeWidth").value, 10) || 1920;
            var finalH = targetH || parseInt(document.getElementById("cmResizeHeight").value, 10) || 1080;
            var finalDur = targetDur || parseFloat(document.getElementById("cmResizeDuration").value) || 15.0;

            var stepRes = addStepLog("⏳", "Kompozisyon " + finalW + "×" + finalH + " (" + finalDur + "s) formatına ayarlanıyor...");
            await new Promise(function (resolve) {
                callHost("resizeMapcomp", {
                    compName: curName,
                    width: finalW,
                    height: finalH,
                    fps: targetFps,
                    duration: finalDur,
                    recenterRig: true
                }, function (res) {
                    if (res && res.ok) {
                        stepRes.className = "gl-chat-step success";
                        stepRes.innerHTML = '<span class="step-icon">✓</span> Kompozisyon ' + finalW + '×' + finalH + ' (' + finalDur + 's) olarak ayarlandı.';
                        refreshActiveCompDetails();
                    } else {
                        stepRes.className = "gl-chat-step failed";
                        stepRes.innerHTML = '<span class="step-icon">✕</span> Boyutlandırma: ' + (res ? res.error : "Bilinmeyen");
                    }
                    resolve();
                });
            });
        }

        // =====================================================================
        // STEP 2: MAP STYLE SETUP (PHOTOREALISTIC SATELLITE / DARK)
        // =====================================================================
        if (lower.indexOf("uydu") !== -1 || lower.indexOf("satellite") !== -1 || lower.indexOf("fotogerçekçi") !== -1) {
            var stepStyle = addStepLog("⏳", "Harita tipi Fotogerçekçi Uydu (Esri World Imagery) olarak ayarlanıyor...");
            var selProvider = document.getElementById("tileProviderSelect");
            if (selProvider) {
                selProvider.value = "esri_sat";
                selProvider.dispatchEvent(new Event("change"));
            }
            stepStyle.className = "gl-chat-step success";
            stepStyle.innerHTML = '<span class="step-icon">✓</span> Fotogerçekçi Uydu (Esri World Imagery) görünümüne geçildi.';
        } else if (lower.indexOf("koyu") !== -1 || lower.indexOf("dark") !== -1) {
            var selProvider2 = document.getElementById("tileProviderSelect");
            if (selProvider2) {
                selProvider2.value = "carto_dark";
                selProvider2.dispatchEvent(new Event("change"));
            }
        }

        // =====================================================================
        // STEP 3: DETECT SCENARIO / STORYBOARD (HÜRMÜZ / İRAN / JEOPOLİTİK HABER)
        // =====================================================================
        var isHormuzNewsBrief = (lower.indexOf("hürmüz") !== -1 || lower.indexOf("hormuz") !== -1) && (lower.indexOf("iran") !== -1 || lower.indexOf("basra") !== -1);
        var isTimestampedBrief = /(?:(\d+)\s*[-–—]\s*(\d+)\.?\s*(?:saniye|sn|sec)?\s*:|sahne\s*\d+\s*:)/i.test(prompt);

        if (isHormuzNewsBrief || isTimestampedBrief) {
            addStepLog("✦", "<strong>Haber Senaryosu Çözümlendi:</strong> Hürmüz Boğazı & Jeopolitik Gerilim Sahne Akışı İcra Ediliyor...", "pending");

            // SCENE 1 (0–2s): Orta Doğu Geniş Kadraj & Basra Körfezi Başlangıcı
            var stepS1 = addStepLog("⏳", "<strong>0–2. sn:</strong> Orta Doğu & Basra Körfezi açılış kadrajı oluşturuluyor (Keyframe: 0.0s)...");
            map.flyTo([27.5, 51.5], 4.8, { duration: 1.0 });
            document.getElementById("inpViewLat").value = "27.5000";
            document.getElementById("inpViewLon").value = "51.5000";
            document.getElementById("inpViewZoom").value = "4.8";
            document.getElementById("inpViewPitch").value = "25";
            document.getElementById("inpViewBearing").value = "0";

            await new Promise(function (resolve) {
                callHost("setMapcompViewKeyframe", {
                    compName: curName,
                    setKeyframe: true,
                    centerLat: 27.5,
                    centerLon: 51.5,
                    lat: 27.5,
                    lon: 51.5,
                    zoom: 4.8,
                    pitch: 25,
                    bearing: 0,
                    time: 0.0
                }, function () {
                    stepS1.className = "gl-chat-step success";
                    stepS1.innerHTML = '<span class="step-icon">✓</span> <strong>0–2. sn:</strong> Orta Doğu açılış kamera keyframe\'i eklendi (0.0s)';
                    resolve();
                });
            });

            // SCENE 2 (2–4s): İran'ı Vurgula + ABD 5. Filo Doğrulanmış Varlık
            var stepS2 = addStepLog("⏳", "<strong>2–4. sn:</strong> İran sınırları çiziliyor & ABD 5. Filo radar pini ekleniyor (Keyframe: 2.2s)...");
            map.flyTo([28.5, 53.0], 5.6, { duration: 1.2 });

            await new Promise(function (resolve) {
                callHost("setMapcompViewKeyframe", {
                    compName: curName,
                    setKeyframe: true,
                    centerLat: 28.5,
                    centerLon: 53.0,
                    lat: 28.5,
                    lon: 53.0,
                    zoom: 5.6,
                    pitch: 30,
                    bearing: 5,
                    time: 2.2
                }, resolve);
            });

            // Draw Iran Polygon Boundary Shape Layer with 100% accurate land geometry (no Caspian sea slice!)
            var iranFeat = featureCollection.find(function (f) { return f.name.toLowerCase().indexOf("iran") !== -1 && f.polygons && f.polygons.length > 0; });
            if (!iranFeat) {
                await new Promise(function (resolveIran) {
                    loadCleanIranBoundary(function (errClean, cleanData) {
                        if (!errClean && cleanData && cleanData.paths) {
                            iranFeat = {
                                id: "iran_clean_" + Date.now(),
                                name: "İran Sınırları (Doğru Kara Sınırı)",
                                type: "POLYGON",
                                lat: cleanData.lat || 32.4279,
                                lon: cleanData.lon || 53.6880,
                                zoom: 5.6,
                                polygons: cleanData.paths,
                                closed: true
                            };
                            featureCollection.unshift(iranFeat);
                        }
                        resolveIran();
                    });
                });
            }
            if (iranFeat) {
                document.getElementById("borderStrokeColor").value = "#f43f5e";
                document.getElementById("borderFillColor").value = "#f43f5e";
                document.getElementById("borderFillOpacity").value = "25";
                document.getElementById("borderStrokeWidth").value = "4";
                drawFeatureInAE(iranFeat);
            }

            // Add Verified US Naval Presence Pin (Bahrain / US Fifth Fleet HQ)
            await new Promise(function (resolve) {
                callHost("addGeoPinLabel", {
                    compName: curName,
                    title: "ABD 5. Filo (Bahreyn)",
                    subtitle: "Naval Support Activity • Basra Körfezi",
                    template: "radar",
                    accentColor: "#38bdf8",
                    fontSize: 28,
                    lat: 26.2285,
                    lon: 50.5860,
                    counterScale: true,
                    counterRotate: true
                }, resolve);
            });

            stepS2.className = "gl-chat-step success";
            stepS2.innerHTML = '<span class="step-icon">✓</span> <strong>2–4. sn:</strong> İran sınırları vurgulandı & ABD 5. Filo pini eklendi (2.2s)';

            // SCENE 3 (4–7s): Hürmüz Boğazı Kırmızı Vurgu + Petrol Deniz Ticaret Rotası + Katar Pini
            var stepS3 = addStepLog("⏳", "<strong>4–7. sn:</strong> Hürmüz Boğazı kırmızı vurgulanıyor, petrol deniz rotası çiziliyor & Katar pini ekleniyor (Keyframe: 4.8s)...");
            map.flyTo([26.5667, 56.2500], 7.8, { duration: 1.2 });

            await new Promise(function (resolve) {
                callHost("setMapcompViewKeyframe", {
                    compName: curName,
                    setKeyframe: true,
                    centerLat: 26.5667,
                    centerLon: 56.2500,
                    lat: 26.5667,
                    lon: 56.2500,
                    zoom: 7.8,
                    pitch: 40,
                    bearing: -10,
                    time: 4.8
                }, resolve);
            });

            // Highlight Strait of Hormuz Pin in Controlled Red
            await new Promise(function (resolve) {
                callHost("addGeoPinLabel", {
                    compName: curName,
                    title: "Hürmüz Boğazı",
                    subtitle: "Stratejik Petrol Geçiş Koridoru",
                    template: "callout",
                    accentColor: "#ef4444",
                    fontSize: 32,
                    lat: 26.5667,
                    lon: 56.2500,
                    counterScale: true,
                    counterRotate: true
                }, resolve);
            });

            // Add Qatar Diplomatic Pin
            await new Promise(function (resolve) {
                callHost("addGeoPinLabel", {
                    compName: curName,
                    title: "Katar (Doha)",
                    subtitle: "Diplomatik Temas Noktası",
                    template: "callout",
                    accentColor: "#f59e0b",
                    fontSize: 26,
                    lat: 25.2861,
                    lon: 51.5297,
                    counterScale: true,
                    counterRotate: true
                }, resolve);
            });

            // Draw Animated Maritime Oil Tanker Trade Route through Strait of Hormuz
            await new Promise(function (resolve) {
                var oilTankerPath = [
                    [50.5, 27.2],
                    [52.5, 26.8],
                    [54.8, 26.3],
                    [56.25, 26.5667],
                    [57.4, 25.4],
                    [59.0, 24.5]
                ];
                callHost("drawAnimatedRoute", {
                    routeName: "Hürmüz Petrol Ticaret Rotası",
                    coordinates: oilTankerPath,
                    strokeColor: "#f59e0b",
                    duration: 3.5,
                    dashed: true,
                    addHeadMarker: true,
                    cameraFollowRoute: false
                }, resolve);
            });

            stepS3.className = "gl-chat-step success";
            stepS3.innerHTML = '<span class="step-icon">✓</span> <strong>4–7. sn:</strong> Hürmüz Boğazı vurgulandı, hareketli petrol rotası ve Katar diplomatik pini çizildi (4.8s)';

            // SCENE 4 (7–10s): Jeopolitik Haber Finali İçin Geniş Kadraj & Sinematik Ease
            var stepS4 = addStepLog("⏳", "<strong>7–10. sn:</strong> Jeopolitik final için geniş kadraj keyframe eklendi & Sinematik F9 Ease uygulandı...");
            map.flyTo([27.0, 53.5], 5.4, { duration: 1.5 });

            await new Promise(function (resolve) {
                callHost("setMapcompViewKeyframe", {
                    compName: curName,
                    setKeyframe: true,
                    centerLat: 27.0,
                    centerLon: 53.5,
                    lat: 27.0,
                    lon: 53.5,
                    zoom: 5.4,
                    pitch: 35,
                    bearing: 0,
                    time: 8.5
                }, resolve);
            });

            // Apply F9 Ease to all generated keyframes
            await new Promise(function (resolve) {
                callHost("applyCinematicEaseToMapcomp", { compName: curName, influence: 75 }, resolve);
            });

            stepS4.className = "gl-chat-step success";
            stepS4.innerHTML = '<span class="step-icon">✓</span> <strong>7–10. sn:</strong> Geniş jeopolitik kadraj keyframe\'i (8.5s) eklendi ve Sinematik Ease uygulandı!';

            addStepLog("✦", "<strong>Haber Haritası Başarıyla Oluşturuldu!</strong> 10 saniyelik kesintisiz haber akışı After Effects sahnenize işlendi.", "success");
            setStatus("GeoCopilot: 10s Hürmüz & İran haber animasyonu After Effects'te oluşturuldu!");
            return;
        }

        // =====================================================================
        // STEP 4: STANDARD MULTI-STEP PIPELINE (FOR OTHER PROMPTS)
        // =====================================================================
        var rawClauses = prompt.split(/(?:,|\.|\bsonra\b|\bardından\b|\bve\b|\bdaha sonra\b|\bthen\b|\band\b)/i);
        var clauses = [];
        for (var i = 0; i < rawClauses.length; i++) {
            var cl = rawClauses[i].trim();
            if (cl.length > 2) clauses.push(cl);
        }
        if (clauses.length === 0) clauses = [prompt];

        var timelineTime = 0.0;
        var currentTarget = lastTargetLocation;

        for (var c = 0; c < clauses.length; c++) {
            var clause = clauses[c];
            var clLower = clause.toLowerCase();

            // Detect time offset if present in clause (e.g. "3 sn sonra", "2. saniyede", "t=4")
            var timeMatch = clLower.match(/(?:(?:saat|zaman|süre|t\s*=)?\s*(\d+(?:\.\d+)?)\s*(?:saniye|sn|seconds|sec|s\b))/i);
            if (timeMatch && timeMatch[1]) {
                timelineTime = parseFloat(timeMatch[1]);
            }

            var detectedPlace = null;
            for (var pKey in COPILOT_KNOWLEDGE.places) {
                if (clLower.indexOf(pKey) !== -1) {
                    detectedPlace = COPILOT_KNOWLEDGE.places[pKey];
                    currentTarget = detectedPlace;
                    lastTargetLocation = detectedPlace;
                    break;
                }
            }

            // Also check clean countries db if not found
            if (!detectedPlace && CLEAN_COUNTRIES_DB) {
                var cMatch = findCleanCountry(clLower, CLEAN_COUNTRIES_DB);
                if (cMatch) {
                    detectedPlace = {
                        name: cMatch.name,
                        lat: cMatch.lat || 0,
                        lon: cMatch.lon || 0,
                        zoom: 5.8
                    };
                    currentTarget = detectedPlace;
                    lastTargetLocation = detectedPlace;
                }
            }

            var isFromSpace = (clLower.indexOf("uzay") !== -1 || clLower.indexOf("uzaydan") !== -1 || clLower.indexOf("dünya") !== -1 || clLower.indexOf("küre") !== -1 || clLower.indexOf("space") !== -1 || clLower.indexOf("orbit") !== -1 || clLower.indexOf("globe") !== -1);
            var isZoomIn = (isFromSpace || clLower.indexOf("yaklaş") !== -1 || clLower.indexOf("zoom in") !== -1 || clLower.indexOf("büyüt") !== -1 || clLower.indexOf("yaklaştır") !== -1 || clLower.indexOf("zoom") !== -1);
            var isZoomOut = (clLower.indexOf("uzaklaş") !== -1 || clLower.indexOf("zoom out") !== -1 || clLower.indexOf("küçült") !== -1 || clLower.indexOf("geniş") !== -1);
            var isCameraAction = (isFromSpace || isZoomIn || isZoomOut || clLower.indexOf("kamera") !== -1 || clLower.indexOf("hareket") !== -1 || clLower.indexOf("keyframe") !== -1 || clLower.indexOf("animasyon") !== -1 || clLower.indexOf("pan") !== -1 || clLower.indexOf("uç") !== -1 || clLower.indexOf("git") !== -1 || clLower.indexOf("odaklan") !== -1 || detectedPlace);

            // Fly / Focus / Camera Movement
            if (isCameraAction) {
                var curCenter = map.getCenter();
                var curZoom = map.getZoom();
                var targetPlace = detectedPlace || (currentTarget ? currentTarget : {
                    name: "Mevcut Konum",
                    lat: curCenter.lat,
                    lon: curCenter.lng,
                    zoom: curZoom
                });

                var targetZoom = targetPlace.zoom || 5.8;
                if (clLower.indexOf("şehir") !== -1 || clLower.indexOf("başkent") !== -1 || clLower.indexOf("city") !== -1) {
                    targetZoom = Math.max(targetZoom, 10.5);
                }

                if (isFromSpace && timelineTime === 0.0) {
                    // DUAL KEYFRAME: High-Orbit Continental Establishing Shot (Z: 3.2) -> Cinematic Descent into Target (Z: 5.8 - 11.0)
                    var spaceStartZoom = 3.2;
                    var stepSpace1 = addStepLog("⏳", "1. Aşama: Yüksek yörünge / uzay açısı keyframe'i ekleniyor (0.0s, Zoom " + spaceStartZoom + ")...");
                    map.setView([targetPlace.lat, targetPlace.lon], spaceStartZoom);
                    document.getElementById("inpViewLat").value = targetPlace.lat.toFixed(4);
                    document.getElementById("inpViewLon").value = targetPlace.lon.toFixed(4);
                    document.getElementById("inpViewZoom").value = spaceStartZoom + "";

                    await new Promise(function (resolve) {
                        callHost("setMapcompViewKeyframe", {
                            compName: curName,
                            setKeyframe: true,
                            clearOldKeyframes: (c === 0),
                            centerLat: targetPlace.lat,
                            centerLon: targetPlace.lon,
                            lat: targetPlace.lat,
                            lon: targetPlace.lon,
                            zoom: spaceStartZoom,
                            pitch: 20,
                            bearing: 0,
                            time: 0.0
                        }, function () {
                            stepSpace1.className = "gl-chat-step success";
                            stepSpace1.innerHTML = '<span class="step-icon">✓</span> <strong>0.0s:</strong> Yüksek yörünge açılış keyframe\'i eklendi (Z: ' + spaceStartZoom + ', 20° Tilt)';
                            resolve();
                        });
                    });

                    // Keyframe 2: Descent down to Country / City
                    var stepSpace2 = addStepLog("⏳", "2. Aşama: " + targetPlace.name + " konumuna sinematik iniş keyframe'i ekleniyor (3.5s, Zoom " + targetZoom.toFixed(1) + ")...");
                    map.flyTo([targetPlace.lat, targetPlace.lon], targetZoom, { duration: 1.5 });
                    document.getElementById("inpViewZoom").value = targetZoom.toFixed(1);

                    await new Promise(function (resolve) {
                        callHost("setMapcompViewKeyframe", {
                            compName: curName,
                            setKeyframe: true,
                            centerLat: targetPlace.lat,
                            centerLon: targetPlace.lon,
                            lat: targetPlace.lat,
                            lon: targetPlace.lon,
                            zoom: targetZoom,
                            pitch: 35,
                            bearing: 0,
                            time: 3.5
                        }, function () {
                            stepSpace2.className = "gl-chat-step success";
                            stepSpace2.innerHTML = '<span class="step-icon">✓</span> <strong>3.5s:</strong> ' + targetPlace.name + ' iniş keyframe\'i eklendi (Z: ' + targetZoom.toFixed(1) + ', 35° 3D Tilt) [F9 Akıcı Ease]';
                            resolve();
                        });
                    });
                    timelineTime = 3.5;

                } else if (isZoomIn && timelineTime === 0.0 && clauses.length === 1) {
                    // DUAL KEYFRAME: Standard Zoom In (Wide Establishing Shot -> Close Target)
                    var startWideZoom = Math.max(2.8, targetZoom - 2.8);
                    var stepZoom1 = addStepLog("⏳", "1. Aşama: " + targetPlace.name + " geniş açı başlangıç keyframe'i (0.0s, Zoom " + startWideZoom.toFixed(1) + ")...");

                    await new Promise(function (resolve) {
                        callHost("setMapcompViewKeyframe", {
                            compName: curName,
                            setKeyframe: true,
                            clearOldKeyframes: (c === 0),
                            centerLat: targetPlace.lat,
                            centerLon: targetPlace.lon,
                            lat: targetPlace.lat,
                            lon: targetPlace.lon,
                            zoom: startWideZoom,
                            pitch: 15,
                            bearing: 0,
                            time: 0.0
                        }, function () {
                            stepZoom1.className = "gl-chat-step success";
                            stepZoom1.innerHTML = '<span class="step-icon">✓</span> <strong>0.0s:</strong> Geniş açı başlangıç keyframe\'i eklendi (Z: ' + startWideZoom.toFixed(1) + ')';
                            resolve();
                        });
                    });

                    var stepZoom2 = addStepLog("⏳", "2. Aşama: " + targetPlace.name + " yakına uçuş keyframe'i (3.0s, Zoom " + targetZoom.toFixed(1) + ")...");
                    map.flyTo([targetPlace.lat, targetPlace.lon], targetZoom, { duration: 1.2 });
                    document.getElementById("inpViewZoom").value = targetZoom.toFixed(1);

                    await new Promise(function (resolve) {
                        callHost("setMapcompViewKeyframe", {
                            compName: curName,
                            setKeyframe: true,
                            centerLat: targetPlace.lat,
                            centerLon: targetPlace.lon,
                            lat: targetPlace.lat,
                            lon: targetPlace.lon,
                            zoom: targetZoom,
                            pitch: 35,
                            bearing: 0,
                            time: 3.0
                        }, function () {
                            stepZoom2.className = "gl-chat-step success";
                            stepZoom2.innerHTML = '<span class="step-icon">✓</span> <strong>3.0s:</strong> ' + targetPlace.name + ' yakınlaşma keyframe\'i eklendi (Z: ' + targetZoom.toFixed(1) + ') [F9 Akıcı Ease]';
                            resolve();
                        });
                    });
                    timelineTime = 3.0;

                } else {
                    // Single Keyframe along sequential timeline
                    var zoomLevel = targetZoom;
                    if (isZoomOut) {
                        zoomLevel = Math.min(zoomLevel, Math.max(2.8, curZoom - 2.5));
                    }

                    var stepFly = addStepLog("⏳", targetPlace.name + " kamera hareketi (" + timelineTime.toFixed(1) + "s, Zoom " + zoomLevel.toFixed(1) + ")...");
                    map.flyTo([targetPlace.lat, targetPlace.lon], zoomLevel, { duration: 1.2 });
                    document.getElementById("inpViewLat").value = targetPlace.lat.toFixed(4);
                    document.getElementById("inpViewLon").value = targetPlace.lon.toFixed(4);
                    document.getElementById("inpViewZoom").value = zoomLevel.toFixed(1);

                    await new Promise(function (resolve) {
                        callHost("setMapcompViewKeyframe", {
                            compName: curName,
                            setKeyframe: true,
                            centerLat: targetPlace.lat,
                            centerLon: targetPlace.lon,
                            lat: targetPlace.lat,
                            lon: targetPlace.lon,
                            zoom: zoomLevel,
                            pitch: (isZoomIn ? 35 : 20),
                            bearing: 0,
                            time: timelineTime
                        }, function (res) {
                            stepFly.className = "gl-chat-step success";
                            stepFly.innerHTML = '<span class="step-icon">✓</span> ' + targetPlace.name + ' kamera keyframe\'i (◆ ' + timelineTime.toFixed(1) + 's, Z: ' + zoomLevel.toFixed(1) + ') eklendi [F9 Akıcı Ease]';
                            resolve();
                        });
                    });
                    timelineTime += 3.0;
                }
            }

            // Boundary
            if (clLower.indexOf("sınır") !== -1 || clLower.indexOf("boundary") !== -1 || clLower.indexOf("poligon") !== -1) {
                var bPlace = currentTarget;
                var stepB = addStepLog("⏳", bPlace.name + " sınırları çiziliyor...");
                var featToDraw = featureCollection.find(function (f) {
                    return f.name.toLowerCase().indexOf(bPlace.name.toLowerCase()) !== -1;
                });
                if (featToDraw) {
                    drawFeatureInAE(featToDraw);
                    stepB.className = "gl-chat-step success";
                    stepB.innerHTML = '<span class="step-icon">✓</span> ' + bPlace.name + ' sınırları animasyonlu Trim Path olarak çizildi!';
                } else {
                    // Check local clean coastlines DB first (zero sea spillage / accurate land boundaries)
                    var cleanMatched = await new Promise(function (resolveClean) {
                        getCleanCountry(bPlace.name, function (cData) {
                            if (cData && cData.paths && cData.paths.length > 0) {
                                var cleanCountryFeat = {
                                    id: "copilot_clean_" + Date.now(),
                                    name: cData.name + " (Temiz Kara Sınırı)",
                                    type: "POLYGON",
                                    lat: cData.lat || bPlace.lat,
                                    lon: cData.lon || bPlace.lon,
                                    zoom: bPlace.zoom || 5.5,
                                    geojson: null,
                                    polygons: cData.paths,
                                    closed: true
                                };
                                featureCollection.unshift(cleanCountryFeat);
                                drawFeatureInAE(cleanCountryFeat);
                                stepB.className = "gl-chat-step success";
                                stepB.innerHTML = '<span class="step-icon">✓</span> ' + cData.name + ' temiz kara kıyı sınırı (deniz hatasız) Shape Layer olarak çizildi!';
                                resolveClean(true);
                            } else {
                                resolveClean(false);
                            }
                        });
                    });

                    if (!cleanMatched) {
                        try {
                            var nomUrl = "https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&limit=1&q=" + encodeURIComponent(bPlace.name);
                            var nomRes = await fetch(nomUrl, { headers: { "Accept": "application/json" } });
                            var nomData = await nomRes.json();
                            if (nomData && nomData[0] && nomData[0].geojson) {
                                var extracted = extractPathsFromGeoJSON(nomData[0].geojson);
                                var newFeat = {
                                    id: "copilot_" + Date.now(),
                                    name: bPlace.name + " Sınırı",
                                    type: extracted.closed ? "GEOJSON" : "LINE",
                                    lat: bPlace.lat,
                                    lon: bPlace.lon,
                                    zoom: bPlace.zoom,
                                    geojson: nomData[0],
                                    polygons: extracted.paths,
                                    closed: extracted.closed
                                };
                                featureCollection.unshift(newFeat);
                                drawFeatureInAE(newFeat);
                                stepB.className = "gl-chat-step success";
                                stepB.innerHTML = '<span class="step-icon">✓</span> ' + bPlace.name + ' sınırları indirildi ve Shape Layer olarak çizildi!';
                            }
                        } catch (e) {}
                    }
                }
            }

            // Label / Pin
            if (clLower.indexOf("etiket") !== -1 || clLower.indexOf("pin") !== -1 || clLower.indexOf("işaret") !== -1 || clLower.indexOf("label") !== -1) {
                var lPlace = currentTarget;
                var stepL = addStepLog("⏳", lPlace.name + " 3D billboard etiketi ekleniyor...");
                await new Promise(function (resolve) {
                    callHost("addGeoPinLabel", {
                        compName: curName,
                        title: lPlace.name,
                        subtitle: lPlace.lat.toFixed(2) + "° N, " + lPlace.lon.toFixed(2) + "° E",
                        template: "radar",
                        accentColor: "#38bdf8",
                        fontSize: 32,
                        lat: lPlace.lat,
                        lon: lPlace.lon,
                        counterScale: true,
                        counterRotate: true
                    }, function () {
                        stepL.className = "gl-chat-step success";
                        stepL.innerHTML = '<span class="step-icon">✓</span> ' + lPlace.name + ' dinamik 3D pin etiketi sahneye eklendi!';
                        resolve();
                    });
                });
            }

            // Ease
            if (clLower.indexOf("animasyon") !== -1 || clLower.indexOf("ease") !== -1 || clLower.indexOf("yumuşat") !== -1 || clLower.indexOf("f9") !== -1) {
                var stepE2 = addStepLog("⏳", "Sinematik F9 yumuşatma uygulanıyor...");
                await new Promise(function (resolve) {
                    callHost("applyCinematicEaseToMapcomp", { compName: curName, influence: 75 }, function () {
                        stepE2.className = "gl-chat-step success";
                        stepE2.innerHTML = '<span class="step-icon">✓</span> Tüm keyframe geçişleri sinematik Ease eğrisiyle pürüzsüzleştirildi!';
                        resolve();
                    });
                });
            }
        }

        addStepLog("✦", "<strong>Tüm işlemler tamamlandı!</strong> After Effects kompozisyonunuz hazır.", "success");
        setStatus("GeoCopilot: Tüm adımlar After Effects sahnenize işlendi!");
    }

    document.addEventListener("DOMContentLoaded", function () {
        ensureHostScriptLoaded(function () {
            refreshActiveCompDetails();
        });
        loadSavedLanguage();
        loadSavedUiScale();
        loadSavedMapLabelLang();
        loadSavedMapTilerKey();
        initMap();
        seedInitialFeatureCollection();
        bindEvents();
        bindCopilotEvents();
        renderMapStyleGallery("all");
        updateActiveMapStylePillLabel();

        // Check for updates quietly in background after 3 seconds
        setTimeout(function () {
            GeoUpdater.checkUpdate(true);
        }, 3000);
    });
})();
