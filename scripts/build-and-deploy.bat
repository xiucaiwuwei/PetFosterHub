@echo off
REM PetFosterHub 应用打包部署脚本

echo ========================
echo 打包部署 PetFosterHub 应用
echo ========================

REM 设置部署版本
set /p VERSION=请输入部署版本号 [1.0.0]: 
set VERSION=%VERSION%1.0.0

REM 1. 清理旧构建文件
echo 1. 清理旧构建文件...
rmdir /s /q "%~dp0..\dist" 2>nul
mkdir "%~dp0..\dist"

REM 2. 打包后端应用
echo 2. 打包后端应用...
cd /d "%~dp0..\backend"
mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo 错误: 后端打包失败。
    pause
    exit /b 1
)

copy target\backend-%VERSION%.jar "%~dp0..\dist\backend.jar"

REM 3. 打包前端应用
echo 3. 打包前端应用...
cd /d "%~dp0..\frontend"
npm install
npm run build

if %errorlevel% neq 0 (
    echo 错误: 前端打包失败。
    pause
    exit /b 1
)

xcopy /s /e /i dist "%~dp0..\dist\frontend"

REM 4. 复制配置文件
echo 4. 复制配置文件...
xcopy /s /e /i "%~dp0..\config" "%~dp0..\dist\config"

REM 5. 复制启动脚本
echo 5. 复制启动脚本...
copy "%~dp0start-backend-prod.bat" "%~dp0..\dist\"

REM 6. 创建部署说明
echo 6. 创建部署说明...
echo PetFosterHub v%VERSION% 部署说明 > "%~dp0..\dist\DEPLOYMENT.md"
echo ======================================================== >> "%~dp0..\dist\DEPLOYMENT.md"
echo. >> "%~dp0..\dist\DEPLOYMENT.md"
echo 部署步骤: >> "%~dp0..\dist\DEPLOYMENT.md"
echo 1. 确保目标服务器已安装JDK 21或更高版本 >> "%~dp0..\dist\DEPLOYMENT.md"
echo 2. 确保已配置MySQL和Redis服务 >> "%~dp0..\dist\DEPLOYMENT.md"
echo 3. 修改config\application-prod.yml中的数据库和Redis连接信息 >> "%~dp0..\dist\DEPLOYMENT.md"
echo 4. 运行start-backend-prod.bat启动应用 >> "%~dp0..\dist\DEPLOYMENT.md"
echo. >> "%~dp0..\dist\DEPLOYMENT.md"
echo 注意事项: >> "%~dp0..\dist\DEPLOYMENT.md"
echo - 首次启动前请确保数据库已初始化 >> "%~dp0..\dist\DEPLOYMENT.md"
echo - 生产环境请修改JWT密钥和数据库密码为安全值 >> "%~dp0..\dist\DEPLOYMENT.md"

REM 7. 压缩为部署包
echo 7. 创建部署压缩包...
cd /d "%~dp0.."
set ZIP_NAME=PetFosterHub-%VERSION%-release.zip
powershell Compress-Archive -Path dist\* -DestinationPath %ZIP_NAME%

if %errorlevel% neq 0 (
    echo 警告: 压缩失败，但打包文件已准备在dist目录中。
) else (
    echo 部署包已创建: %ZIP_NAME%
)

echo.
echo ========================
echo 打包部署完成！
echo ========================
echo 部署文件位置: %~dp0..\dist
echo 部署说明: %~dp0..\dist\DEPLOYMENT.md

pause