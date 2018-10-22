:: https://stackoverflow.com/questions/46178559/how-to-detect-if-visual-c-2017-redistributable-is-installed

@echo OFF

:: check if windows 10. we can skip installing if so
setlocal
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%version%" == "10.0" goto end
rem etc etc
endlocal

:: check if 32/64
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | find /i "x86" > NUL && set OS=32BIT || set OS=64BIT

if %OS%==32BIT goto check32
if %OS%==64BIT goto check64
:: should never get here
goto end

:check64
:: 64 bit install
REG QUERY "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\VisualStudio\14.0\VC\Runtimes\x86" /v "Installed" | Find "0x1"
If %ERRORLEVEL% == 0 goto end
IF %ERRORLEVEL% == 1 goto install

:check32
:: 32 bit install
REG QUERY "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x86" /v "Installed" | Find "0x1"
If %ERRORLEVEL% == 0 goto end
IF %ERRORLEVEL% == 1 goto install

:install

vc_redist.x86.exe

:end
@exit