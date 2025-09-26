@echo off
REM PetFosterHub 后端生产环境启动脚本

echo ========================
echo 启动 PetFosterHub 后端生产环境
echo ========================

REM 检查Java环境
echo 检查Java环境...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Java运行环境，请先安装JDK 21或更高版本。
    pause
    exit /b 1
)

REM 设置环境变量
echo 设置生产环境变量...
set SPRING_PROFILES_ACTIVE=prod

REM 设置JVM参数
echo 设置JVM参数...
set JAVA_OPTS=-Xms2g -Xmx4g -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m -XX:+UseG1GC -XX:+UseStringDeduplication
set JAVA_OPTS=%JAVA_OPTS% -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8
set JAVA_OPTS=%JAVA_OPTS% -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=../logs/heapdump.hprof
set JAVA_OPTS=%JAVA_OPTS% -Dlogback.configurationFile=../config/logback-spring.xml

REM 进入后端目录
cd /d "%~dp0..\backend"

REM 构建项目（可选，如果已经构建过可以注释掉）
echo 正在构建项目...
mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo 错误: 项目构建失败。
    pause
    exit /b 1
)

REM 运行jar包
echo 正在启动生产环境后端服务...
java %JAVA_OPTS% -jar target/backend-1.0.0.jar

if %errorlevel% neq 0 (
    echo 错误: 后端服务启动失败。
    pause
    exit /b 1
)

pause