#!/bin/bash

# Life Coach AI 快速启动脚本
# 可选择使用真实 API 或模拟模式

echo "🤖 Life Coach AI 快速启动"
echo "=========================="
echo "请选择运行模式："
echo "1) 使用真实 API（需要有效的 API Key）"
echo "2) 使用模拟模式（用于测试界面）"
echo ""
read -p "请输入选择 (1 或 2): " choice

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

case $choice in
    1)
        echo "🚀 启动真实 API 模式..."
        npm start
        ;;
    2)
        echo "🎭 启动模拟模式..."
        MOCK_API=true npm start
        ;;
    *)
        echo "❌ 无效选择，使用默认的模拟模式"
        MOCK_API=true npm start
        ;;
esac