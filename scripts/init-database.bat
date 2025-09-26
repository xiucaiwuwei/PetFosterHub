@echo off
REM PetFosterHub 数据库初始化脚本

echo ========================
echo 初始化 PetFosterHub 数据库
echo ========================

REM 数据库配置
echo 请输入数据库配置信息
set /p DB_HOST=数据库主机 [localhost]: 
set DB_HOST=%DB_HOST%localhost
set /p DB_PORT=数据库端口 [3306]: 
set DB_PORT=%DB_PORT%3306
set /p DB_USERNAME=数据库用户名 [root]: 
set DB_USERNAME=%DB_USERNAME%root
set /p DB_PASSWORD=数据库密码 [123456]: 
set DB_PASSWORD=%DB_PASSWORD%123456
set /p DB_NAME=数据库名称 [pet_foster_hub]: 
set DB_NAME=%DB_NAME%pet_foster_hub

REM 检查MySQL命令行工具
echo 检查MySQL命令行工具...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到MySQL命令行工具，请确保已安装MySQL并添加到环境变量。
    pause
    exit /b 1
)

REM 执行SQL创建数据库和用户
echo 正在创建数据库和用户...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USERNAME% -p%DB_PASSWORD% -e "
CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'petuser'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON %DB_NAME%.* TO 'petuser'@'localhost';
CREATE USER IF NOT EXISTS 'petuser'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON %DB_NAME%.* TO 'petuser'@'%';
FLUSH PRIVILEGES;
"

if %errorlevel% neq 0 (
    echo 错误: 数据库创建失败，请检查配置信息。
    pause
    exit /b 1
)

echo 数据库初始化成功！
echo 数据库名称: %DB_NAME%
echo 用户名: petuser

echo 提示: 首次启动后端服务时，JPA会自动创建表结构。
pause