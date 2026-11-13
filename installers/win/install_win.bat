@echo off
chcp 65001 >nul
title GeoMotion Pro v4.5 - Windows Kurulum Sihirbazı
echo ============================================================================
echo   GeoMotion Pro v4.5 — Tüm After Effects Sürümleri İçin Otomatik Kurulum
echo ============================================================================
echo.

REM 1. Enable PlayerDebugMode across CSXS 5..20 in Windows Registry
for %%v in (5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20) do (
    reg add "HKCU\Software\Adobe\CSXS.%%v" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul 2>&1
)
echo [OK] Adobe CEP PlayerDebugMode (CSXS 5-20) Kayıt Defterinde etkinleştirildi.

REM 2. Copy CEP Panel to %APPDATA%\Adobe\CEP\extensions
set "CEP_DEST=%APPDATA%\Adobe\CEP\extensions\com.geomotion.cep"
if not exist "%APPDATA%\Adobe\CEP\extensions" mkdir "%APPDATA%\Adobe\CEP\extensions"
if exist "%CEP_DEST%" rmdir /s /q "%CEP_DEST%"

if exist "%~dp0com.geomotion.cep" (
    xcopy /E /I /Y "%~dp0com.geomotion.cep" "%CEP_DEST%" >nul
) else if exist "%~dp0com.opengeolayers.cep" (
    xcopy /E /I /Y "%~dp0com.opengeolayers.cep" "%CEP_DEST%" >nul
) else if exist "%~dp0..\com.opengeolayers.cep" (
    xcopy /E /I /Y "%~dp0..\com.opengeolayers.cep" "%CEP_DEST%" >nul
)
echo [OK] CEP Paneli kuruldu: %CEP_DEST%

REM 3. Copy ScriptUI Panel to all installed Adobe After Effects versions
for /d %%D in ("C:\Program Files\Adobe\Adobe After Effects*") do (
    if exist "%%D\Support Files\Scripts\ScriptUI Panels" (
        if exist "%~dp0ScriptUI\GeoMotion_Pro_Panel.jsx" (
            copy /Y "%~dp0ScriptUI\GeoMotion_Pro_Panel.jsx" "%%D\Support Files\Scripts\ScriptUI Panels\" >nul 2>&1
        ) else if exist "%~dp0ScriptUI\OpenGeoLayers_Pro_Panel.jsx" (
            copy /Y "%~dp0ScriptUI\OpenGeoLayers_Pro_Panel.jsx" "%%D\Support Files\Scripts\ScriptUI Panels\GeoMotion_Pro_Panel.jsx" >nul 2>&1
        )
        echo [OK] ScriptUI Paneli kuruldu: %%D\Support Files\Scripts\ScriptUI Panels\GeoMotion_Pro_Panel.jsx
    )
)

echo.
echo ============================================================================
echo   KURULUM BAŞARIYLA TAMAMLANDI!
echo   After Effects'i açıp şu menüden eklentiyi başlatabilirsiniz:
echo     1) Window ^> Extensions ^> GeoMotion Pro
echo     2) Window ^> GeoMotion_Pro_Panel.jsx
echo ============================================================================
pause
