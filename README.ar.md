<div align="center" dir="rtl">

# GeoMotion Pro v3.0 🌍🎬

**إضافة مجانية ومفتوحة المصدر بنسبة 100% مدعومة بالذكاء الاصطناعي لإنشاء الخرائط والرسوم المتحركة الجغرافية في برنامج Adobe After Effects.**

🌐 **Language / Dil / اللغة:** [🇺🇸 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | **🇸🇦 العربية** | [📚 دليل الاستخدام و API](docs/GUIDE.ar.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/muhammedakifkayacan/geomotion-pro)](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest)

</div>

<div dir="rtl">

**GeoMotion Pro** هي إضافة Adobe CEP مجانية ومفتوحة المصدر تتيح لك إنشاء رسوم متحركة سينمائية للخرائط، ومشاهد عالية الدقة للأقمار الصناعية والخرائط المتجهة، ومسارات الطرق والرحلات الجوية، وحدود الدول والمدن، والرسوم البيانية الجغرافية مباشرة داخل After Effects — دون الحاجة إلى إضافات مدفوعة باهظة الثمن.

---

## ✨ المميزات الرئيسية والمتقدمة

### 🤖 1. المساعد الذكي (`GeoCopilot`)
- يفهم الأوامر باللغة الطبيعية (الإنجليزية والتركية) لتحريك الكاميرا وإنشاء الطبقات تلقائياً.
- يضبط أبعاد التكوين (`16:9`، `9:16 Reels`، `4K`) ويضيف الإطارات المفتاحية (Keyframes) تلقائياً.

### 🗺️ 2. المعاينة الفورية، دليل الإطار 1:1، والمعالجة عالية الدقة (Multi-Zoom Finalize)
- **تطابق 1:1 مع التكوين:** يتطابق إطار الدليل في المعاينة (`16:9`، `9:16`، `1:1`، `4K`) رياضياً بدقة تامة مع كاميرا After Effects.
- **تحكم تفاعلي بالكاميرا:** السحب بالزر الأيسر للتحريك، والتكبير/التصغير، **والسحب بالزر الأيمن لتغيير الميل Pitch (`0°–60°`) والاتجاه Bearing (`-180°–180°`)**.
- **الربط المباشر (`🔗 Live Link`):** تنعكس جميع تحركاتك في اللوحة فوراً داخل مشهد After Effects.
- **معالجة Multi-Zoom Seamless و ⚡ 1-Frame Finalize:** دمج خرائط بدقة 2K (`2304×1792px`) عبر جميع الإطارات المفتاحية مع تدرج شفافية ناعم، بالإضافة إلى وضع الإطار الواحد للمعاينة السريعة.
- **مزودو الخرائط وخوادم TMS/XYZ المخصصة:** يدعم Esri World Imagery، CartoDB Dark/Light/Voyager، OpenStreetMap، OpenTopoMap، MapTiler Cloud، وإضافة خوادم `{z}/{x}/{y}` مخصصة.

### 📍 3. متصفح المعالم، Overpass OSM، واستيراد الصيغ المتعددة
- **البحث عبر Nominatim والإحداثيات المباشرة:** البحث عن الدول والمدن أو الانتقال مباشرة عبر الإحداثيات (`41.0422, 28.9892`).
- **🎯 التحديد بالنقر على الخريطة:** انقر على أي دولة أو منطقة لاستخراج حدودها الهندسية تلقائياً.
- **استخراج متجهات OSM:** تحميل **الطرق السريعة** و**الأنهار** مباشرة كطبقات Shape قابلة للتعديل.
- **دعم الصيغ المتعددة:** استيراد ملفات `.geojson`، `.json`، `.gpx`، `.kml`، `.csv`، و `.tsv`.
- **أدوات الهندسة:** تبسيط المضلعات بخوارزمية Ramer-Douglas-Peucker (`RDP`) ودمج الطبقات (`Merge`).

### 🎨 4. تلوين الخرائط، قناع المياه، ضباب الأفق، وعمق الميدان
- **MAP_STYLE_COLORIZER:** طبقة تعديل لتخصيص ألوان المياه واليابسة والإبراز بنقرة واحدة.
- **🌊 قناع المياه (`MAP_WATERMASK_MATTE`):** إنشاء طبقات تموّج ولمعان للمحيطات والبحار.
- **🌫️ ضباب الأفق وعمق الميدان (`DOF`):** ضباب يتفاعل مع زاوية ميل الكاميرا مع تفعيل Depth of Field وظلال المتجهات.
- **🌡️ خرائط التدرج اللوني (`Choropleth`) والرسوم الزمنية (`Time-Series`)**

### 🧭 5. التسميات، شريط المقياس، البوصلة، الخريطة المصغرة، والمطابقة الجغرافية
- **تثبيت الحجم والدوران (`Counter-Scale & Counter-Rotate`):** تبقى النصوص والعلامات واضحة دائماً مهما تغير زوم أو دوران الكاميرا.
- **🧭 شريط المقياس وبوصلة الشمال:** حساب المسافة الحقيقية (`km/m`) تلقائياً مع بوصلة مرتبطة بزاوية الدوران.
- **🗺️ خريطة الموقع المصغرة (`Locator / Inset Map`):** خريطة جانبية تتابع موقع الكاميرا الرئيسية.
- **📐 المطابقة بنقطتين (`2-Point Georeference`):** وضع ومواءمة أي صورة أو طبقة بين نقطتين جغرافيتين بدقة.

### 🚗 6. مسارات الحركة
- **مسارات OSRM البرية وأقواس الطيران:** رسم مسارات حقيقية مع **سهم ديناميكي يتجه تلقائياً مع المسار** ومتابعة الكاميرا.

### 🔄 7. نظام التحديث التلقائي عبر GitHub
- التحقق من التحديثات وتثبيت الإصدارات الجديدة مباشرة من داخل الإضافة.

---

## 📦 التثبيت (macOS و Windows)

حزم التثبيت الجاهزة متوفرة في مجلد [`dist/`](./dist) وعلى [**صفحة الإصدارات (Releases)**](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest):

### 🍎 التثبيت على macOS
1. قم بتحميل [`GeoMotion_Pro_v3.0_macOS_Installer.dmg`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_macOS_Installer.dmg) وافتحه.
2. شغّل تطبيق **Install GeoMotion Pro** (يقوم بالنسخ إلى مجلد Adobe CEP وتفعيل `PlayerDebugMode` تلقائياً).
3. أعد تشغيل Adobe After Effects وافتح **`Window > Extensions > GeoMotion Pro`**.

### 🪟 التثبيت على Windows
1. قم بتحميل [`GeoMotion_Pro_v3.0_Windows_Setup.exe`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_Windows_Setup.exe) وشغّله.
2. يقوم المثبت تلقائياً بنسخ الإضافة إلى مجلد CEP وإعداد سجل النظام (`PlayerDebugMode`).
3. افتح Adobe After Effects وشغّل **`Window > Extensions > GeoMotion Pro`**.

### 📦 الحزمة الشاملة / ZXP
- تتوفر أيضاً الحزم اليدوية: [`GeoMotion_Pro_v3.0_Universal_Bundle.zip`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_Universal_Bundle.zip) و [`GeoMotion_Pro_v3.0.zxp`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0.zxp).

---

## 📄 الرخصة

هذا المشروع مرخص تحت **رخصة MIT** مفتوحة المصدر ([LICENSE](./LICENSE)). يمكنك استخدامه وتعديله وتوزيعه بحرية في المشاريع الشخصية والتجارية.

</div>
