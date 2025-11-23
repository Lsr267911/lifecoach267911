@echo off
chcp 65001 >nul
title Life Coach AI 启动器

echo 🤖 Life Coach AI 启动脚本
echo ==========================

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Node.js
    echo 请先安装 Node.js (版本 ^>= 14.0.0)
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm 是否安装
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 npm
    echo 请确保 npm 已正确安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo.
    echo 📦 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo 🚀 正在启动 Life Coach AI 服务器...
echo 📡 服务器将在 http://localhost:3001 运行
echo 💡 按 Ctrl+C 可以停止服务器
echo.

REM 启动服务器
npm start