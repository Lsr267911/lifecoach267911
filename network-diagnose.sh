#!/bin/bash

echo "🔍 Git 网络连接诊断工具"
echo "========================"

# 1. 检查网络连接
echo "1. 检查网络连接..."
if ping -c 1 github.com &> /dev/null; then
    echo "✅ GitHub 基础连接正常"
else
    echo "❌ GitHub 基础连接失败"
fi

# 2. 检查 HTTPS 连接
echo "2. 检查 HTTPS 连接..."
if curl -s --connect-timeout 5 https://github.com > /dev/null; then
    echo "✅ GitHub HTTPS 连接正常"
else
    echo "❌ GitHub HTTPS 连接失败"
fi

# 3. 检查 Git 配置
echo "3. 检查 Git 配置..."
echo "Git 版本: $(git --version)"
echo "HTTP 版本: $(git config --global http.version || echo '未设置')"
echo "HTTP 代理: $(git config --global http.proxy || echo '未设置')"
echo "HTTPS 代理: $(git config --global https.proxy || echo '未设置')"

# 4. 尝试不同的连接方式
echo "4. 测试不同的 Git 连接方式..."
echo "当前远程 URL: $(git remote get-url origin)"

# 5. 网络超时测试
echo "5. 网络超时测试..."
timeout 10 git ls-remote origin > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Git 远程连接正常"
else
    echo "❌ Git 远程连接超时"
fi

echo "========================"
echo "📋 建议的解决方案："
echo "1. 如果在中国大陆，可能需要配置 Git 代理"
echo "2. 尝试使用 SSH 协议替代 HTTPS"
echo "3. 检查系统代理设置"
echo "4. 联系网络管理员"