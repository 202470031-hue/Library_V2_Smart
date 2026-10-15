@echo off
title Smart Library Server - Batch 12
echo ==================================================
echo 🚀 Preparing to start the Smart Library...
echo ==================================================

:: فتح المتصفح الافتراضي على رابط السيرفر
start http://localhost:3000

:: تشغيل السيرفر
node server.js

pause