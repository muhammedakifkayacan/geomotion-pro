import re

# 1. Update index.html
with open("/Users/akifm1pro/Desktop/OpenGeoLayers/com.opengeolayers.cep/client/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Add Copilot AI tab to nav
old_nav = """    <nav class="gl-tabs-nav">
        <button class="gl-tab active" data-tab="tab-collection">Feature Browser</button>
        <button class="gl-tab" data-tab="tab-styles">Layer Styles</button>
        <button class="gl-tab" data-tab="tab-labels">Labels</button>
        <button class="gl-tab" data-tab="tab-routes">Connect &amp; Fly</button>
        <button class="gl-tab" data-tab="tab-prefs">3D DEM &amp; Prefs</button>
    </nav>"""

new_nav = """    <nav class="gl-tabs-nav">
        <button class="gl-tab active" data-tab="tab-collection">Feature Browser</button>
        <button class="gl-tab" data-tab="tab-styles">Layer Styles</button>
        <button class="gl-tab" data-tab="tab-labels">Labels</button>
        <button class="gl-tab" data-tab="tab-routes">Connect &amp; Fly</button>
        <button class="gl-tab" data-tab="tab-prefs">3D DEM &amp; Prefs</button>
        <button class="gl-tab gl-tab-copilot" data-tab="tab-copilot" id="tabBtnCopilot">
            <span class="gl-copilot-sparkle-ico">✦</span> Copilot AI
        </button>
    </nav>"""

assert old_nav in html, "old_nav not found"
html = html.replace(old_nav, new_nav, 1)

# Add tab-copilot pane before </main>
tab_copilot_pane = """
        <!-- TAB 6: GEOCOPILOT AI CHATBOT TAB PANE -->
        <div id="tab-copilot" class="gl-tab-pane">
            <div class="gl-copilot-pane-card">
                <div class="gl-copilot-pane-head">
                    <div class="gl-copilot-head-left">
                        <span class="gl-copilot-sparkle">✦</span>
                        <div class="gl-copilot-titles">
                            <h3 id="i18n_copilotTitle">GeoCopilot AI</h3>
                            <p id="i18n_copilotSubtitle">Doğal dille haber senaryoları &amp; After Effects harita animasyonu</p>
                        </div>
                    </div>
                    <div class="gl-copilot-head-right">
                        <button id="btnClearCopilotChat" class="gl-copilot-action-btn" title="Sohbeti Temizle">Temizle</button>
                        <button id="btnReturnToMapTab" class="gl-copilot-close-prominent" title="Harita Gezginine Geri Dön">
                            <span class="gl-close-icon">←</span>
                            <span>Haritaya Dön</span>
                        </button>
                    </div>
                </div>

                <!-- Suggestion Chips -->
                <div class="gl-copilot-chips-wrap">
                    <div class="gl-copilot-chips-scroll">
                        <button class="gl-copilot-chip" data-prompt="Hürmüz Boğazı ve Basra Körfezi haber animasyonu oluştur: 0-2s Orta Doğu uydusuyla başla, 2-4s İran'ı ve ABD 5. Filo'yu vurgula, 4-7s Hürmüz Boğazı petrol rotalarını çiz, 7-10s geniş kadraj jeopolitik final yap">Hürmüz Boğazı &amp; İran Haber Senaryosu</button>
                        <button class="gl-copilot-chip" data-prompt="Türkiye'ye uç, sınırını çiz, sonra Ankara'ya yaklaş ve etiket koy">Türkiye'ye git &amp; sınır çiz, Ankara'ya yaklaş</button>
                        <button class="gl-copilot-chip" data-prompt="Kompozisyonu 9:16 Reels formatına çevir">9:16 Reels formatı yap</button>
                        <button class="gl-copilot-chip" data-prompt="İstanbul'a yaklaş ve klasik harita pini ekle">İstanbul'a yaklaş &amp; pin ekle</button>
                        <button class="gl-copilot-chip" data-prompt="Keyframe'leri sinematik yumuşat (Ease)">Keyframeleri yumuşat (F9)</button>
                    </div>
                </div>

                <!-- Chat Stream -->
                <div id="copilotChatStream" class="gl-copilot-pane-stream">
                    <div class="gl-chat-msg gl-chat-bot">
                        <div class="gl-chat-avatar">✦</div>
                        <div class="gl-chat-bubble">
                            <p><strong>Merhaba!</strong> Ben After Effects harita ve haber animasyonu asistanınızım.</p>
                            <p>Bana tek bir komut verebilir veya sahne akışlı (0–2s, 2–4s, 4–7s, 7–10s vb.) tam bir haber brifingi yapıştırabilirsiniz. Hepsini timeline üzerinde saniyesine göre keyframe'lere, sınırlara, ticaret rotalarına ve 3D pinlere dönüştürürüm.</p>
                        </div>
                    </div>
                </div>

                <!-- Chat Input Row -->
                <div class="gl-copilot-pane-input-row">
                    <div class="gl-copilot-input-box">
                        <textarea
                            id="copilotInput"
                            rows="2"
                            placeholder="Bir komut veya sahne akışlı haber senaryosu yazın (Shift+Enter yeni satır, Enter gönder)..."
                        ></textarea>
                        <button id="btnCopilotSend" class="gl-copilot-send-btn" title="Komutu / Senaryoyu Çalıştır">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="gl-copilot-input-hint">
                        <span>Enter: Gönder • Shift+Enter: Yeni satır</span>
                        <span>← Üst sekmelerden veya [Haritaya Dön] butonundan dilediğiniz zaman haritaya dönebilirsiniz</span>
                    </div>
                </div>
            </div>
        </div>
"""

idx_main_end = html.find("</main>")
assert idx_main_end != -1, "</main> not found"
html = html[:idx_main_end] + tab_copilot_pane + "\n    " + html[idx_main_end:]

# Remove old #geoCopilotDrawer from bottom of html
copilot_start = html.find("<!-- ===============================================================\n         GEOCOPILOT AI FULL-SCREEN ASSISTANT VIEW")
if copilot_start == -1:
    copilot_start = html.find("<div id=\"geoCopilotDrawer\"")

if copilot_start != -1:
    copilot_end = html.find("</body>", copilot_start)
    html = html[:copilot_start] + html[copilot_end:]

with open("/Users/akifm1pro/Desktop/OpenGeoLayers/com.opengeolayers.cep/client/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html: Copilot is now an integrated Tab with Haritaya Dön button!")

# 2. Update style.css
with open("/Users/akifm1pro/Desktop/OpenGeoLayers/com.opengeolayers.cep/client/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

copilot_tab_css = """
/* ==========================================================================
   COPILOT TAB PANE STYLES (SEKME MODU & HARİTAYA ANINDA DÖNÜŞ)
   ========================================================================== */
.gl-tab-copilot {
    color: #c084fc !important;
    font-weight: 700 !important;
    border-bottom: 2px solid transparent !important;
}

.gl-tab-copilot:hover {
    color: #e0e7ff !important;
    background: rgba(168, 85, 247, 0.12) !important;
}

.gl-tab-copilot.active {
    color: #ffffff !important;
    border-bottom-color: #a855f7 !important;
    background: rgba(168, 85, 247, 0.22) !important;
}

.gl-copilot-pane-card {
    display: flex;
    flex-direction: column;
    background: #121214;
    border: 1px solid #242426;
    border-radius: 8px;
    overflow: hidden;
    min-height: 420px;
    width: 100%;
    box-sizing: border-box;
}

.gl-copilot-pane-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: #161618;
    border-bottom: 1px solid #242426;
    gap: 8px;
    flex-shrink: 0;
}

.gl-copilot-pane-stream {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 220px;
    max-height: 52vh;
    background: #09090b;
}

.gl-copilot-pane-input-row {
    padding: 10px 14px 12px;
    background: #121214;
    border-top: 1px solid #242426;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
}
"""

css += "\n" + copilot_tab_css

with open("/Users/akifm1pro/Desktop/OpenGeoLayers/com.opengeolayers.cep/client/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with copilot tab pane styles!")

# 3. Update app.js
with open("/Users/akifm1pro/Desktop/OpenGeoLayers/com.opengeolayers.cep/client/js/app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Replace tab click handler and bindCopilotEvents with switchTab
old_tabs_bind = """        var tabs = document.querySelectorAll(".gl-tab");
        for (var t = 0; t < tabs.length; t++) {
            tabs[t].addEventListener("click", function () {
                for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove("active");
                this.classList.add("active");
                var target = this.getAttribute("data-tab");
                var panes = document.querySelectorAll(".gl-tab-pane");
                for (var p = 0; p < panes.length; p++) {
                    panes[p].classList.toggle("active", panes[p].id === target);
                }
            });
        }"""

new_tabs_bind = """        window.switchTab = function (targetId) {
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
        }"""

assert old_tabs_bind in app_js, "old_tabs_bind not found"
app_js = app_js.replace(old_tabs_bind, new_tabs_bind, 1)

# Update btnToggleCopilot in bindCopilotEvents
old_btn_toggle_copilot = """        var btnToggle = document.getElementById("btnToggleCopilot");
        if (btnToggle) {
            btnToggle.addEventListener("click", function () {
                var drawer = document.getElementById("geoCopilotDrawer");
                if (drawer && !drawer.classList.contains("hidden")) {
                    closeCopilotDrawer();
                } else {
                    openCopilotDrawer();
                }
            });
        }"""

new_btn_toggle_copilot = """        var btnToggle = document.getElementById("btnToggleCopilot");
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
        }"""

assert old_btn_toggle_copilot in app_js, "old_btn_toggle_copilot not found"
app_js = app_js.replace(old_btn_toggle_copilot, new_btn_toggle_copilot, 1)

with open("/Users/akifm1pro/Desktop/OpenGeoLayers/com.opengeolayers.cep/client/js/app.js", "w", encoding="utf-8") as f:
    f.write(app_js)

print("Updated app.js with seamless switchTab logic!")
