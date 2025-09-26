@echo off
REM PetFosterHub Docker环境停止脚本

echo ========================
echo 停止 PetFosterHub Docker环境
echo ========================

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Docker，请先安装Docker Desktop。
    pause
    exit /b 1
)

REM 进入配置目录
cd /d "%~dp0..\config"

REM 停止Docker容器
echo 正在停止Docker容器...
docker-compose down

if %errorlevel% neq 0 (
    echo 错误: Docker容器停止失败。
    pause
    exit /b 1
)

echo Docker环境已成功停止！

REM 显示剩余运行中的容器
echo.
echo 当前运行中的其他容器:
docker ps

pause