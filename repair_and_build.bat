@echo off
SETLOCAL EnableDelayedExpansion

echo ======================================================
echo CHAOS CIPHER - SYSTEM REPAIR ^& REBUILD TOOL
echo ======================================================
echo.

:: Error Case 1: Stale Build Artifacts
:: We faced issues where old builds interfered with new ones.
echo [1/5] Cleaning old build artifacts...
if exist dist_electron (
    echo Removing dist_electron...
    rmdir /s /q dist_electron
)
if exist dist (
    echo Removing dist...
    rmdir /s /q dist
)

:: Error Case 2: Dependency Corruption
:: We encountered "zip: not a valid zip file" and other internal tool failures.
:: A clean reinstall of node_modules often fixes these path/permission issues.
set /p CLEAN_INSTALL="Do you want to perform a clean dependency reinstall? (y/n): "
if /i "%CLEAN_INSTALL%"=="y" (
    echo [2/5] Performing deep clean of node_modules...
    if exist node_modules (
        rmdir /s /q node_modules
    )
    if exist package-lock.json (
        del /f /q package-lock.json
    )
    echo [3/5] Reinstalling dependencies...
    call npm install
) else (
    echo [2/5] Skipping deep clean...
    echo [3/5] Ensuring dependencies are up to date...
    call npm install
)

:: Error Case 3: Syntax and Config Errors
:: We fixed App.tsx syntax (>>>) and package.json naming (removing |).
:: This step ensures the production build is valid before packaging.
echo [4/5] Running production build check...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] ERROR: Build failed. Please check for syntax errors in your .tsx files.
    echo [TIP] Look for raw '>>>' or '<<<' characters outside of strings in JSX.
    pause
    exit /b %ERRORLEVEL%
)

:: Error Case 4: Packaging Failures
:: We switched from electron-builder to electron-packager to avoid the ZIP error.
echo [5/5] Packaging Windows Application...
call npm run electron:package

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================
    echo SUCCESS: Everything is rebuilt and ready!
    echo App Location: dist_electron\ChaosCipher-win32-x64\
    echo ======================================================
) else (
    echo.
    echo [!] ERROR: Packaging failed.
)

pause
