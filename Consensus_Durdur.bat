@echo off
chcp 65001 >nul
title Consensus - Durdur
color 0C

echo =========================================================
echo       CONSENSUS ASISTANI DURDURULUYOR
echo =========================================================
echo.
echo [+] Calisan Consensus sunuculari kapatiliyor...

taskkill /f /im node.exe >nul 2>nul

echo [+] Consensus basariyla kapatildi.
echo.
timeout /t 2 >nul
