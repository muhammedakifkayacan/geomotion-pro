<div align="center">

# GeoMotion Pro — Kullanım Rehberi & API Kurulumu 📚

🌐 **Language / Dil / اللغة:** [🇺🇸 English](GUIDE.md) | **🇹🇷 Türkçe** | [🇸🇦 العربية](GUIDE.ar.md) | [⬅️ Ana Sayfaya Dön](../README.tr.md)

</div>

---

## 1. Ücretsiz MapTiler API Anahtarı Alma (Uydu V2, Topo ve Türkçe Harita Etiketleri)

GeoMotion Pro; **Esri World Imagery**, **CartoDB Dark Matter**, **CartoDB Positron**, **CartoDB Voyager**, **OpenStreetMap** ve **OpenTopoMap** sağlayıcıları ile **hiçbir API anahtarı olmadan** doğrudan çalışır.

Ancak ücretsiz bir **MapTiler Cloud API anahtarı** oluşturduğunuzda **MapTiler Satellite V2**, **Satellite Hybrid**, **Dataviz Dark/Light**, **Streets V2**, **Ocean & Bathymetry**, **Topo V2** stillerini ve **çok dilli harita etiketlerini** (`Harita: Türkçe`, `English`, `Local`, `DE`, `FR`, `ES`) kullanabilirsiniz.

### Adım Adım Ücretsiz Anahtar Kurulumu:
1. **[cloud.maptiler.com](https://cloud.maptiler.com/)** adresine gidin ve ücretsiz bir hesap oluşturun *(Free planında kredi kartı gerekmez)*.
2. Panelden **API Keys** sekmesine girip varsayılan anahtarınızı (**Default Key**) kopyalayın.
3. After Effects içindeki **GeoMotion Pro** panelinde:
   - Harita stili menüsünden herhangi bir MapTiler stilini seçerek açılan hızlı kutucuğa yapıştırın **veya** **`Ayarlar`** (`3D DEM & Ayarlar`) sekmesindeki **MapTiler API Key** alanına girip **Kaydet**'e basın.
4. Artık üst bardan harita etiket dilini (`Harita: Türkçe`) ve tüm MapTiler uydu/vektör temalarını kullanabilirsiniz.

---

## 2. Özel TMS / XYZ Harita Sunucuları ve Önbellek Temizleme

Kendi harita sunucunuzu veya özel bir XYZ/TMS kaynağını kullanmak için:
1. **`Ayarlar`** sekmesi → **Custom TMS / XYZ Server Profiles** kartını açın.
2. Sunucu adını ve `{z}`, `{x}`, `{y}` içeren URL şablonunu girin (ör. `https://tile.example.com/{z}/{x}/{y}.png`).
3. **Ekle ve Etkinleştir** butonuna basın.
4. **Export JSON** ile sunucu listenizi masaüstüne yedekleyebilir, **Clear Cache** ile geçici harita atlas önbelleğini tek tıkla temizleyebilirsiniz.

---

## 3. Temiz Kara Sınırları vs. Deniz Sınırları (`Denizi Dahil Et`)

OpenStreetMap (Nominatim), kıyı ülke ve illerde (ör. Hatay, İstanbul) varsayılan olarak **12 deniz mili karasularını** da içeren poligonlar döndürebilir.

- **Varsayılan (`Denizi Dahil Et` işaretsiz):** GeoMotion Pro, **geoBoundaries (ADM0 / ADM1)** veritabanından kıyı şeridini birebir takip eden **yalnızca kara sınırını** otomatik indirir.
- **Deniz Dahil (`Denizi Dahil Et` işaretli):** Nominatim'in karasuları dahil tüm sınırını çizer.

---

## 4. Temel Kullanım İpuçları

### 🎥 Kamera ve Önizleme Kontrolleri
- **Sol Tık Sürükle:** Haritayı kaydırır (Pan).
- **Tekerlek / Slider:** Yakınlaşır ve uzaklaşır.
- **Sağ Tık Sürükle:** Önizleme üzerinde doğrudan **Pitch (`0°–60°`)** ve **Bearing (`-180°–180°`)** açılarını ayarlar.
- **1:1 Kılavuz Çerçevesi:** Mavi kesikli çerçeve aktif AE kompozisyonunun en-boy oranıyla (`16:9`, `9:16`, `1:1`, `4K`) otomatik eşleşir.

### 🔗 Çift Yönlü Live Link & Keyframe
- Üst bardaki **`🔗 Live Link`** butonunu açtığınızda AE zaman çizelgesi ile eklenti önizlemesi çift yönlü senkronize olur:
  - AE'de timeline çubuğunu (`CTI`) kaydırdığınızda eklenti önizlemesi o karedeki harita bölgesine odaklanır.
  - Eklentide haritayı kaydırdığınızda AE sahnesi canlı güncellenir.
- **`◆ Keyframe`** ile o anki konuma Easy-Ease kamera anahtar karesi eklersiniz.

### ⚡ 1-Kare vs. ✓ Finalize
- **`⚡ 1-Kare`:** Yalnızca o anki CTI karesi için hızlı yüksek çözünürlüklü harita işler.
- **`✓ Finalize (İşle)`:** Tüm keyframe'ler ve zoom geçişleri boyunca 2K (`2304×1792px`) harita atlaslarını yumuşak geçişle sahneye işler.

### 📂 Desteklenen Dosya Formatları
**Vektör Gezgini** sekmesindeki **`+ GeoJSON / GPX / CSV`** butonuyla şunları içe aktarabilirsiniz:
- **`.geojson` / `.json`:** Ülke, il, bölge poligonları ve hatlar.
- **`.gpx` / `.kml`:** GPS rota ve iz kayıtları.
- **`.csv` / `.tsv`:** Tablo formatında koordinat ve veri listeleri (`ad, enlem, boylam, değer, renk`).

### 🤖 Copilot AI Örnek Komutları
**Copilot AI** sekmesini açıp Türkçe veya İngilizce yazabilirsiniz:
- *"9:16 Reels kompozisyonu kur, Avrupa'dan İstanbul'a 3 saniyede yaklaş ve Türkiye sınırını çiz."*
- *"İstanbul'dan Ankara'ya kara yolu rotası çiz ve kamerayı takip ettir."*
