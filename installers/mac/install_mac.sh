#!/bin/bash
# ==============================================================================
# GeoMotion Pro v4.5 — Universal macOS Installer (All After Effects Versions)
# Supports: Adobe After Effects CC 2014 through 2027+ (CEP + ScriptUI Panel)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CEP_ID="com.geomotion.cep"
USER_CEP_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions"

echo "========================================================"
echo "  GeoMotion Pro v4.5 - macOS Otomatik Kurulum"
echo "========================================================"

# 1. Enable PlayerDebugMode across CSXS 5..20 (CC 2014 to 2027+)
for v in 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    defaults write com.adobe.CSXS.$v PlayerDebugMode 1 2>/dev/null || true
done
echo "[OK] Adobe CEP PlayerDebugMode (CSXS 5-20) etkinleştirildi."

# 2. Locate com.opengeolayers.cep or com.geomotion.cep source directory
SRC_CEP=""
for candidate in "$SCRIPT_DIR/com.geomotion.cep" "$SCRIPT_DIR/com.opengeolayers.cep" "$SCRIPT_DIR/../com.geomotion.cep" "$SCRIPT_DIR/../com.opengeolayers.cep" "$SCRIPT_DIR/../../com.geomotion.cep" "$SCRIPT_DIR/../../com.opengeolayers.cep"; do
    if [ -d "$candidate" ]; then
        SRC_CEP="$candidate"
        break
    fi
done

if [ -z "$SRC_CEP" ]; then
    echo "[HATA] CEP eklenti kaynak klasörü bulunamadı!"
    exit 1
fi

mkdir -p "$USER_CEP_DIR"
rm -rf "$USER_CEP_DIR/$CEP_ID" "$USER_CEP_DIR/com.opengeolayers.cep"
cp -R "$SRC_CEP" "$USER_CEP_DIR/$CEP_ID"
ln -sfn "$USER_CEP_DIR/$CEP_ID" "$USER_CEP_DIR/com.opengeolayers.cep" 2>/dev/null || true
echo "[OK] GeoMotion Pro CEP Eklentisi kuruldu: $USER_CEP_DIR/$CEP_ID"

# 3. Also install Native ScriptUI Panel into any detected After Effects folders
SRC_JSX=""
for candidate in "$SCRIPT_DIR/ScriptUI/GeoMotion_Pro_Panel.jsx" "$SCRIPT_DIR/ScriptUI/OpenGeoLayers_Pro_Panel.jsx" "$SCRIPT_DIR/../ScriptUI/GeoMotion_Pro_Panel.jsx" "$SCRIPT_DIR/../../ScriptUI/GeoMotion_Pro_Panel.jsx"; do
    if [ -f "$candidate" ]; then
        SRC_JSX="$candidate"
        break
    fi
done

if [ -n "$SRC_JSX" ]; then
    for ae_dir in "/Applications"/Adobe\ After\ Effects*; do
        if [ -d "$ae_dir/Scripts/ScriptUI Panels" ]; then
            cp -f "$SRC_JSX" "$ae_dir/Scripts/ScriptUI Panels/GeoMotion_Pro_Panel.jsx" 2>/dev/null || true
            echo "[OK] ScriptUI Paneli kopyalandı: $ae_dir/Scripts/ScriptUI Panels/GeoMotion_Pro_Panel.jsx"
        fi
    done
fi

echo "========================================================"
echo "  KURULUM TAMAMLANDI!"
echo "  After Effects'i yeniden başlatıp şu menüden açabilirsiniz:"
echo "  1) Window > Extensions > OpenGeoLayers Pro"
echo "  2) Window > OpenGeoLayers_Pro_Panel.jsx"
echo "========================================================"
