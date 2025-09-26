@echo off
REM PetFosterHub 后端开发环境启动脚本

echo ========================
echo 启动 PetFosterHub 后端开发环境
echo ========================

REM 检查Java环境
echo 检查Java环境...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Java运行环境，请先安装JDK 21或更高版本。
    pause
    exit /b 1
)

REM 进入后端目录
cd /d "%~dp0..\backend"

REM 使用Maven启动Spring Boot应用
echo 正在启动后端服务...
mvn spring-boot:run -Dspring-boot.run.profiles=dev

if %errorlevel% neq 0 (
    echo 错误: 后端服务启动失败。
    pause
    exit /b 1
)

pause