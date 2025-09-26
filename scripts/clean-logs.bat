@echo off
REM PetFosterHub 日志清理脚本

echo ========================
echo 清理 PetFosterHub 日志文件
echo ========================

REM 设置日志目录
set LOG_DIR=..\logs
set BACKEND_LOG_DIR=..\backend\logs

REM 确认清理操作
set /p CONFIRM=确定要清理所有日志文件吗？(Y/N): 
if /i not "%CONFIRM%" == "Y" (
    echo 已取消清理操作。
    pause
    exit /b 0
)

REM 清理根目录日志
echo 正在清理根目录日志...
if exist "%LOG_DIR%" (
    del /q /s "%LOG_DIR%\*.log"
    del /q /s "%LOG_DIR%\*.gz"
    del /q /s "%LOG_DIR%\*.hprof"
)

REM 清理后端日志
echo 正在清理后端日志...
if exist "%BACKEND_LOG_DIR%" (
    del /q /s "%BACKEND_LOG_DIR%\*.log"
    del /q /s "%BACKEND_LOG_DIR%\*.gz"
    del /q /s "%BACKEND_LOG_DIR%\*.hprof"
)

echo 日志文件清理完成！
pause