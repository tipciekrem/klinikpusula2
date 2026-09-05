@echo off
chcp 65001 >nul
title Consensus - AI Akademik Asistan
color 0B

echo =====================================================================
echo              CONSENSUS - AI AKADEMIK TEZ VE ARASTIRMA ASISTANI
echo =====================================================================
echo.
echo   [+] Sistem hazirlaniyor...
echo   [+] Sunucu ve arayuz baslatiliyor...
echo   [+] Tarayiciniz birkac saniye icinde otomatik olarak acilacaktir.
echo.
echo   Adres: http://localhost:3000
echo.
echo   * NOT: Programi kullanirken bu siyah pencereyi KAPATMAYINIZ.
echo   * Programi tamamen durdurmak istediginizde bu pencereyi kapatabilirsiniz.
echo =====================================================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [HATA] Node.js sisteminizde bulunamadi!
    echo Lutfen https://nodejs.org adresinden Node.js yukleyiniz.
    echo.
    pause
    exit /b 1
)

node start.js

if %errorlevel% neq 0 (
    echo.
    echo Bir hata olustu. Pencere kapanmasin diye bekleniyor...
    pause
)
