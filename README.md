# GeoMotion Pro v3.0 🌍🎬

**Adobe After Effects için %100 Açık Kaynak Kodlu, Yapay Zekâ Destekli ve Ücretsiz Harita Animasyon Eklentisi.**

GeoMotion Pro, pahalı harita eklentilerine ihtiyaç duymadan After Effects içinde sinematik harita animasyonları, 3D kamera uçuşları, rota çizgileri ve ülke sınırları oluşturmanızı sağlar.

---

## ✨ Öne Çıkan Özellikler

1. **🤖 Yapay Zekâ Copilot (Doğal Dil ile Harita Yönetimi):**
   - *"Uzaydan Türkiye'ye yaklaş, 3. saniyede Ankara'ya in ve sınırları çiz"* gibi Türkçe ve İngilizce komutları anlar; keyframe'leri, kamera açılarını ve efektleri otomatik uygular.
2. **🗺️ Yüksek Çözünürlüklü Harita Katmanları (Tile Providers):**
   - **Esri World Imagery:** Yüksek çözünürlüklü uydu görüntüsü.
   - **CartoDB Dark Matter:** Sinematik karanlık tema.
   - **OpenStreetMap & CartoDB Positron:** Sokak ve şehir odaklı minimalist haritalar.
   - **OpenTopoMap:** Topografik arazi ve dağ haritası.
   - **MapTiler Entegrasyonu:** Opsiyonel 3D terrain ve uydu desteği.
3. **📐 3D Kamera Rig & Akıcı Keyframe Sistemi:**
   - 3D Tilt (Pitch) ve Bearing (Rotation) açıları.
   - `GEO_WORLD_ANCHOR` ile otomatik `Easy-Ease (F9)` ve eğrisel yörünge geçişleri.
   - Akıllı **Minimum Zoom Sınırı (Min Zoom Clamp 2.8)** sayesinde harita kompozisyon dışına taşmaz, her zaman ekranı tam doldurur.
4. **📍 Vektörel Sınır Çizici & Coğrafi Arama (Nominatim OSM):**
   - Ülke, şehir veya bölge sınırlarını tek tıkla After Effects'e düzenlenebilir **Shape Layer** olarak aktarır (`Trim Paths` animasyonu dahil).
5. **🚗 Kara ve Hava Yolu Rota Çizici (OSRM + Great-Circle Arc):**
   - İki konum arasındaki gerçek kara yolu rotasını veya kavisli uçuş yayını animasyonlu olarak çizer.

---

## 📦 Kurulum Paketleri (Tek Tıkla Kurulum)

`dist/` klasöründe hazır derlenmiş yükleyiciler mevcuttur:

- **macOS (`.dmg`):** `dist/GeoMotion_Pro_v3.0_macOS_Installer.dmg`  
  *İçerisindeki tek tıkla kurulum uygulamasını çalıştırarak saniyeler içinde kurabilirsiniz.*
- **Windows (`.exe` & `.bat`):** `dist/GeoMotion_Pro_v3.0_Windows_Setup.exe`  
  *Kayıt Defteri (PlayerDebugMode) ve CEP klasör yapılandırmasını otomatik tamamlar.*
- **Universal Bundle (`.zip` & `.zxp`):** `dist/GeoMotion_Pro_v3.0_Universal_Bundle.zip`

---

## 🚀 After Effects İçinden Başlatma

1. Adobe After Effects'i açın.
2. Üst menüden: `Window > Extensions > GeoMotion Pro` seçeneğine tıklayın.
3. Alternatif yerel panel için: `Window > GeoMotion_Pro_Panel.jsx`.

---

## 🛠️ Geliştiriciler İçin Derleme (Build)

Yükleyici paketlerini sıfırdan derlemek için:

```bash
python3 installers/build_installers.py
```

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Ticari ve kişisel projelerinizde dilediğiniz gibi kullanabilir, değiştirebilir ve geliştirebilirsiniz.
