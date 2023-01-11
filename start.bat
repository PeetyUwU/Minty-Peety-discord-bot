@echo off

cls
:Start

echo [92mStarting discord bot [0m
node .\modules\deploy-commands.js
node .
::  [91Wait 10 seconds before restarting. [0m
TIMEOUT /T 10
GOTO:Start