@echo off
REM PetFosterHub 前端开发环境启动脚本

echo ========================
echo 启动 PetFosterHub 前端开发环境
echo ========================

REM 检查Node.js环境
echo 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js环境，请先安装Node.js 16或更高版本。
    pause
    exit /b 1
)

REM 检查npm环境
echo 检查npm环境...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm环境。
    pause
    exit /b 1
)

REM 进入前端目录
cd /d "%~dp0..\frontend"

REM 安装依赖（可选，如果已经安装过可以注释掉）
echo 正在安装依赖...
npm install

if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败。
    pause
    exit /b 1
)

REM 启动开发服务器
echo 正在启动前端开发服务器...
npm run dev

if %errorlevel% neq 0 (
    echo 错误: 前端开发服务器启动失败。
    pause
    exit /b 1
)

pause