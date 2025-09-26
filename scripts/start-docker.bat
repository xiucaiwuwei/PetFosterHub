@echo off
REM PetFosterHub Docker环境启动脚本

echo ========================
echo 启动 PetFosterHub Docker环境
echo ========================

REM 检查Docker是否安装
echo 检查Docker环境...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Docker，请先安装Docker Desktop。
    pause
    exit /b 1
)

REM 检查Docker服务是否运行
sc query docker | findstr "RUNNING" >nul
if %errorlevel% neq 0 (
    echo 警告: Docker服务未启动，正在尝试启动...
    net start docker
    if %errorlevel% neq 0 (
        echo 错误: 无法启动Docker服务，请手动启动Docker Desktop。
        pause
        exit /b 1
    )
)

REM 进入配置目录
cd /d "%~dp0..\config"

REM 启动Docker容器
echo 正在启动Docker容器...
docker-compose up -d

if %errorlevel% neq 0 (
    echo 错误: Docker容器启动失败。
    pause
    exit /b 1
)

echo Docker环境启动成功！
echo 服务访问地址:
echo - 后端API: http://localhost:8080/api
echo - Swagger文档: http://localhost:8080/swagger-ui.html
echo - phpMyAdmin: http://localhost:8081
echo - Redis Commander: http://localhost:8082

REM 显示容器状态
echo.
echo 容器状态:
docker-compose ps

pause