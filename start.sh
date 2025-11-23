#!/bin/bash

# Life Coach AI 启动脚本
# 自动安装依赖并启动服务器

echo "🤖 Life Coach AI 启动脚本"
echo "=========================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo "请先安装 Node.js (版本 >= 14.0.0)"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm"
    echo "请确保 npm 已正确安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "🚀 正在启动 Life Coach AI 服务器..."
echo "📡 服务器将在 http://localhost:3001 运行"
echo "💡 按 Ctrl+C 可以停止服务器"
echo ""

# 启动服务器
npm start