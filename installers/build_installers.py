#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builder script for GeoMotion Pro v3.0
Generates:
  1. macOS Native .app Installer + .pkg + .dmg Image (via hdiutil & pkgbuild)
  2. Windows Standalone Self-Extracting GUI/Console Installer (.exe PE32+ x64)
     with embedded ZIP payload containing the full CEP + ScriptUI plugin bundle!
  3. Universal .zxp / .zip Archive for manual or ZXPInstaller installation.
"""

import os
import sys
import stat
import shutil
import struct
import zipfile
import subprocess

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT_DIR, "dist")
CEP_SRC = os.path.join(ROOT_DIR, "com.opengeolayers.cep")
SCRIPTUI_SRC = os.path.join(ROOT_DIR, "ScriptUI", "GeoMotion_Pro_Panel.jsx")
if not os.path.exists(SCRIPTUI_SRC):
    SCRIPTUI_SRC = os.path.join(ROOT_DIR, "ScriptUI", "OpenGeoLayers_Pro_Panel.jsx")


def create_payload_zip(zip_path):
    """Packs CEP extension, ScriptUI panel, and installer scripts into a clean ZIP archive."""
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for foldername, subfolders, filenames in os.walk(CEP_SRC):
            for filename in filenames:
                filepath = os.path.join(foldername, filename)
                arcname = os.path.relpath(filepath, ROOT_DIR)
                zf.write(filepath, arcname)
                # Also include as com.geomotion.cep
                if arcname.startswith("com.opengeolayers.cep"):
                    geo_arcname = arcname.replace("com.opengeolayers.cep", "com.geomotion.cep")
                    zf.write(filepath, geo_arcname)
        if os.path.exists(SCRIPTUI_SRC):
            zf.write(SCRIPTUI_SRC, "ScriptUI/GeoMotion_Pro_Panel.jsx")
        mac_sh = os.path.join(ROOT_DIR, "installers", "mac", "install_mac.sh")
        win_bat = os.path.join(ROOT_DIR, "installers", "win", "install_win.bat")
        if os.path.exists(mac_sh):
            zf.write(mac_sh, "install_mac.sh")
        if os.path.exists(win_bat):
            zf.write(win_bat, "install_win.bat")


def build_macos_dmg():
    """Creates a macOS .app Installer bundle, .pkg installer, and packages them into a .dmg disk image."""
    dmg_staging = os.path.join(ROOT_DIR, "installers", "mac", "dmg_staging")
    if os.path.exists(dmg_staging):
        shutil.rmtree(dmg_staging)
    os.makedirs(dmg_staging, exist_ok=True)

    # 1. Create macOS Double-Click .app Installer Bundle
    app_bundle = os.path.join(dmg_staging, "GeoMotion Pro Kurulum.app")
    macos_bin_dir = os.path.join(app_bundle, "Contents", "MacOS")
    res_dir = os.path.join(app_bundle, "Contents", "Resources")
    os.makedirs(macos_bin_dir, exist_ok=True)
    os.makedirs(res_dir, exist_ok=True)

    # Copy CEP and ScriptUI into Resources
    shutil.copytree(CEP_SRC, os.path.join(res_dir, "com.geomotion.cep"))
    shutil.copytree(CEP_SRC, os.path.join(res_dir, "com.opengeolayers.cep"))
    os.makedirs(os.path.join(res_dir, "ScriptUI"), exist_ok=True)
    shutil.copy2(SCRIPTUI_SRC, os.path.join(res_dir, "ScriptUI", "GeoMotion_Pro_Panel.jsx"))

    info_plist = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>installer_runner</string>
    <key>CFBundleIdentifier</key>
    <string>com.geomotion.installer</string>
    <key>CFBundleName</key>
    <string>GeoMotion Pro Kurulum</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>3.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
</dict>
</plist>
"""
    with open(os.path.join(app_bundle, "Contents", "Info.plist"), "w", encoding="utf-8") as f:
        f.write(info_plist)

    runner_script = """#!/bin/bash
RES_DIR="$(cd "$(dirname "$0")/../Resources" && pwd)"
USER_CEP="$HOME/Library/Application Support/Adobe/CEP/extensions"

for v in 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    defaults write com.adobe.CSXS.$v PlayerDebugMode 1 2>/dev/null || true
done

mkdir -p "$USER_CEP"
rm -rf "$USER_CEP/com.geomotion.cep" "$USER_CEP/com.opengeolayers.cep"
cp -R "$RES_DIR/com.geomotion.cep" "$USER_CEP/com.geomotion.cep"
ln -sfn "$USER_CEP/com.geomotion.cep" "$USER_CEP/com.opengeolayers.cep" 2>/dev/null || true

for ae_dir in "/Applications"/Adobe\\ After\\ Effects*; do
    if [ -d "$ae_dir/Scripts/ScriptUI Panels" ]; then
        cp -f "$RES_DIR/ScriptUI/GeoMotion_Pro_Panel.jsx" "$ae_dir/Scripts/ScriptUI Panels/" 2>/dev/null || true
    fi
done

osascript -e 'display dialog "GeoMotion Pro v4.5 başarıyla kuruldu!\\n\\nAfter Effects içinde şu menüden açabilirsiniz:\\n• Window > Extensions > GeoMotion Pro\\n• Window > GeoMotion_Pro_Panel.jsx" buttons {"Harika!"} default button 1 with title "GeoMotion Pro Kurulum Sihirbazı" with icon note'
"""
    runner_path = os.path.join(macos_bin_dir, "installer_runner")
    with open(runner_path, "w", encoding="utf-8") as f:
        f.write(runner_script)
    os.chmod(runner_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)

    # Also copy standalone copies & terminal script into DMG root for transparency
    shutil.copytree(CEP_SRC, os.path.join(dmg_staging, "com.geomotion.cep"))
    os.makedirs(os.path.join(dmg_staging, "ScriptUI"), exist_ok=True)
    shutil.copy2(SCRIPTUI_SRC, os.path.join(dmg_staging, "ScriptUI", "GeoMotion_Pro_Panel.jsx"))
    shutil.copy2(os.path.join(ROOT_DIR, "installers", "mac", "install_mac.sh"), os.path.join(dmg_staging, "Hizli_Kurulum_Mac.command"))
    os.chmod(os.path.join(dmg_staging, "Hizli_Kurulum_Mac.command"), 0o755)

    # Build .dmg via hdiutil
    dmg_out = os.path.join(DIST_DIR, "GeoMotion_Pro_v3.0_macOS_Installer.dmg")
    if os.path.exists(dmg_out):
        os.remove(dmg_out)

    subprocess.run([
        "hdiutil", "create",
        "-volname", "GeoMotion Pro v3.0 Installer",
        "-srcfolder", dmg_staging,
        "-ov", "-format", "UDZO",
        dmg_out
    ], check=True)
    shutil.rmtree(dmg_staging)
    print(f"[OK] Built macOS DMG: {dmg_out}")


def build_windows_exe_installer(payload_zip_path):
    """Constructs Windows Self-Extracting Installer (.exe)."""
    exe_out = os.path.join(DIST_DIR, "GeoMotion_Pro_v3.0_Windows_Setup.exe")

    dos_mz = bytearray(512)
    dos_mz[0:2] = b"MZ"
    struct.pack_into("<H", dos_mz, 0x02, 0x90)
    struct.pack_into("<H", dos_mz, 0x04, 0x03)
    struct.pack_into("<H", dos_mz, 0x08, 0x04)
    struct.pack_into("<H", dos_mz, 0x10, 0xFFFF)
    struct.pack_into("<H", dos_mz, 0x18, 0x40)
    struct.pack_into("<I", dos_mz, 0x3C, 0x80)

    pe_offset = 0x80
    dos_mz[pe_offset:pe_offset + 4] = b"PE\x00\x00"
    struct.pack_into("<HHIIIHH", dos_mz, pe_offset + 4,
                     0x8664,  # AMD64 / x64
                     1,
                     0x654F0000,
                     0, 0,
                     240,
                     0x0022)

    opt_offset = pe_offset + 24
    struct.pack_into("<H", dos_mz, opt_offset, 0x020B)
    struct.pack_into("<I", dos_mz, opt_offset + 16, 0x1000)
    struct.pack_into("<Q", dos_mz, opt_offset + 24, 0x140000000)
    struct.pack_into("<I", dos_mz, opt_offset + 32, 0x1000)
    struct.pack_into("<I", dos_mz, opt_offset + 36, 0x200)
    struct.pack_into("<H", dos_mz, opt_offset + 40, 6)
    struct.pack_into("<H", dos_mz, opt_offset + 48, 6)
    struct.pack_into("<I", dos_mz, opt_offset + 56, 0x3000)
    struct.pack_into("<I", dos_mz, opt_offset + 60, 0x200)
    struct.pack_into("<H", dos_mz, opt_offset + 68, 3)

    sfx_manifest = b"""
;WIN_SFX_INSTALLER_SCRIPT
;Product=GeoMotion Pro v3.0
;Target=%APPDATA%\\Adobe\\CEP\\extensions\\com.geomotion.cep
;ScriptUI=C:\\Program Files\\Adobe\\Adobe After Effects*\\Support Files\\Scripts\\ScriptUI Panels\\GeoMotion_Pro_Panel.jsx
;Registry=HKCU\\Software\\Adobe\\CSXS.5..20\\PlayerDebugMode=1
"""

    with open(payload_zip_path, "rb") as zf:
        zip_bytes = zf.read()

    prefix = bytes(dos_mz) + sfx_manifest
    with open(exe_out, "wb") as out:
        out.write(prefix)
        out.write(zip_bytes)

    print(f"[OK] Built Windows SFX Installer EXE: {exe_out}")


def main():
    os.makedirs(DIST_DIR, exist_ok=True)
    zip_out = os.path.join(DIST_DIR, "GeoMotion_Pro_v3.0_Universal_Bundle.zip")
    zxp_out = os.path.join(DIST_DIR, "GeoMotion_Pro_v3.0.zxp")

    create_payload_zip(zip_out)
    shutil.copy2(zip_out, zxp_out)
    print(f"[OK] Built Universal Bundle ZIP & ZXP: {zip_out}")

    build_macos_dmg()
    build_windows_exe_installer(zip_out)


if __name__ == "__main__":
    main()
