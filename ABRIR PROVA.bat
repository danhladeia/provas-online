@echo off
title Avaliacao 2 Trimestre - Ed. Fisica - 4 turmas
cd /d "%~dp0"
start "" http://localhost:8123
python servidor.py 8123
pause
