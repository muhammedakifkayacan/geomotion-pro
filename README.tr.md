<div align="center">

# GeoMotion Pro v3.0 🌍🎬

**Adobe After Effects için %100 Açık Kaynak Kodlu, Yapay Zekâ Destekli, Ücretsiz 3D Harita ve Coğrafi Animasyon Eklentisi.**

🌐 **Language / Dil / اللغة:** [🇺🇸 English](README.md) | **🇹🇷 Türkçe** | [🇸🇦 العربية](README.ar.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/muhammedakifkayacan/geomotion-pro)](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest)

</div>

GeoMotion Pro; pahalı harita eklentilerine ihtiyaç duymadan After Effects içinde sinematik 3D harita animasyonları, yüksek çözünürlüklü uydu/vektör renderları, rota çizgileri, 3D arazi kabartmaları, ülke/şehir sınırları ve veri grafikleri oluşturmanızı sağlayan modern bir CEP eklentisidir.

---

## ✨ Temel & İleri Düzey Özellikler

### 🤖 1. Yapay Zekâ Copilot (`GeoCopilot`)
- Türkçe ve İngilizce doğal dil komutlarını anlar (*"İstanbul'dan Ankara'ya rota çiz, 3D kamera uçuşu yap ve sınırları göster"*).
- Kompozisyon formatını (`16:9`, `9:16 Reels`, `4K`) otomatik ayarlar, keyframe'leri yerleştirir ve katmanları oluşturur.

### 🗺️ 2. Gerçek Zamanlı Önizleme, 1:1 Kılavuz Çerçeve & Multi-Zoom Finalize
- **1:1 Kompozisyon Eşleşmesi:** Önizlemedeki kılavuz çerçeve (`16:9`, `9:16`, `1:1`, `4K`) After Effects kompozisyon çözünürlüğüyle matematiksel olarak birebir eşleşir.
- **Etkileşimli 3B Kontrol:** Sol tık ile sürükle (Pan), tekerlek/slider ile zoom, **sağ tık sürükleme ile 3D Pitch (0°–60°) ve Bearing (-180°–180°)**.
- **Live Link (`🔗`):** Panelde yaptığınız her hareket anlık olarak After Effects sahnesine yansır.
- **Multi-Zoom Seamless Finalize & ⚡ 1-Kare Finalize:** Tüm kamera keyframe'leri ve geçişleri boyunca yüksek çözünürlüklü 2K harita atlasları (`2304×1792px`) indirip yumuşak geçişli (`Feather + Opacity Blend`) katmanlar olarak işler; tek karelik hızlı önizleme için **1-Kare** modu bulunur.
- **Harita Sağlayıcıları & Özel TMS:** Esri World Imagery, CartoDB Dark/Light/Voyager, OpenStreetMap, OpenTopoMap, MapTiler Cloud (Satellite V2, Hybrid, Topo, Ocean vb.) ve özel `{z}/{x}/{y}` TMS/WMS sunucuları.

### 📍 3. Vektör Gezgini, Overpass OSM & Çoklu Veri İçe Aktarma
- **Nominatim & Koordinat Arama:** Ülke, şehir, ilçe veya doğrudan enlem/boylam (`41.0422, 28.9892`) araması.
- **🎯 Haritadan Tıklayarak Seçim:** Harita üzerinde tıkladığınız ülke, il veya bölgenin sınır poligonunu otomatik indirir.
- **OSM Vektör Çekici:** Görünümdeki **Otoyollar**, **Nehirler** ve **🏢 3D Binalar** (`OSM 3D Buildings` ekstrüzyonlu) tek tıkla Shape Layer olarak çizilir.
- **Çoklu Format Desteği:** `.geojson`, `.json`, `.gpx`, `.kml`, `.csv` ve `.tsv` dosyalarını içe aktarır.
- **Geometri Araçları:** Ramer-Douglas-Peucker (`RDP`) poligon basitleştirme ve **Merge** (çoklu poligon birleştirme).

### 🎨 4. Stil, Su Maskesi, Sis/DOF & Veri Görselleştirme
- **MAP_STYLE_COLORIZER:** Su, kara ve vurgu renklerini tek tıkla özelleştiren *Adjustment Layer* ekler.
- **🌊 Watermask (`MAP_WATERMASK_MATTE`):** Okyanus ve deniz yüzeyleri için animasyonlu dalga/parıltı matı üretir.
- **🌫️ 3D Ufuk Sisi & Kamera Alan Derinliği (DOF):** Kamera eğimine duyarlı ufuk sisi, `MAP_3D_CAMERA` Depth of Field ve vektör katmanlarına *Drop Shadow* ekler.
- **🌡️ Choropleth & ⏱️ Time-Series:** Bölgeleri düşük-yüksek renk skalasına göre gradyanla boyar ve timeline üzerinde sıralı zaman animasyonuyla (`Stagger`) açar.

### 🧭 5. Pinleme, Ölçek/Pusula, Locator & 2-Point Georeference
- **Counter-Scale & Counter-Rotate Etiketler:** Kamera zoom yapsa ve dönse bile okunabilirliğini koruyan pin ve başlıklar.
- **🧭 Ölçek Çubuğu & Kuzey Pusulası:** Kamera zoom'una göre gerçek `km/m` hesaplayan dinamik ölçek ve açıya bağlı pusula.
- **🗺️ Locator / Inset Harita:** Köşede ana kamerayı canlı takip eden mini genel bakış haritası.
- **📐 2-Point Georeference:** Seçili bir görseli veya katmanı iki coğrafi koordinat arasına otomatik ölçekleyip hizalar.

### 🚗 6. Rota Animasyonu & 3D DEM Arazi / Heightmap
- **OSRM Kara Yolu & Kavisli Hava Yolu:** Gerçek yol geometrisi veya Great-Circle uçuş yayı çizer; hız vektörüne göre otomatik yön değiştiren **Dinamik Ok Başlığı (`Arrowhead`)** ve kamera takibi (`Camera Follow`) sunar.
- **🗻 3D DEM Mesh & 1024×1024 Heightmap Rig:** Open-Meteo DEM yükseklik verilerinden 3B arazi ve Helium / FreeForm Pro / Mir / Displacement Map uyumlu gri tonlamalı yükseklik haritası üretir.

### 🔄 7. Dahili GitHub Otomatik Güncelleme Sistemi
- Eklenti içinden tek tıkla yeni sürümleri denetler ve otomatik günceller (`version.json`).

---

## 📦 Kurulum (macOS & Windows)

Hazır kurulum paketleri [`dist/`](./dist) klasöründe ve [**Releases Sayfasında**](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest) yer almaktadır:

### 🍎 macOS Kurulumu
1. [`GeoMotion_Pro_v3.0_macOS_Installer.dmg`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_macOS_Installer.dmg) dosyasını indirin ve çift tıklayarak açın.
2. Açılan penceredeki **Install GeoMotion Pro** uygulamasını çalıştırın (CEP klasörüne kopyalama ve `PlayerDebugMode` ayarlarını otomatik yapar).
3. Adobe After Effects'i yeniden başlatın ve **`Window > Extensions > GeoMotion Pro`** menüsünden paneli açın.

### 🪟 Windows Kurulumu
1. [`GeoMotion_Pro_v3.0_Windows_Setup.exe`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_Windows_Setup.exe) dosyasını indirin ve çalıştırın.
2. Kurulum sihirbazı gerekli Adobe CEP dizinine (`C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`) kurulumu ve Kayıt Defteri (`PlayerDebugMode`) yapılandırmasını otomatik tamamlar.
3. Adobe After Effects'i açın ve **`Window > Extensions > GeoMotion Pro`** menüsünden paneli başlatın.

### 📦 Evrensel Paket (Manuel Kurulum / ZXP)
- [`GeoMotion_Pro_v3.0_Universal_Bundle.zip`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0_Universal_Bundle.zip) veya [`GeoMotion_Pro_v3.0.zxp`](https://github.com/muhammedakifkayacan/geomotion-pro/releases/latest/download/GeoMotion_Pro_v3.0.zxp) paketlerini kullanabilirsiniz.

---

## 🛠️ Kaynak Koddan Derleme (Geliştiriciler İçin)

Tüm `.dmg`, `.exe`, `.zip` ve `.zxp` kurulum paketlerini tek komutla derlemek için:

```bash
python3 installers/build_installers.py
```

---

## 📄 Lisans

Bu proje **MIT Lisansı** ([LICENSE](./LICENSE)) ile açık kaynak olarak paylaşılmıştır. Ticari ve kişisel tüm projelerinizde özgürce kullanabilir, çatallayabilir (fork) ve geliştirebilirsiniz.
