// 服务器连接测试脚本
const http = require('http');

async function testServer() {
    console.log('🔍 正在测试服务器连接...\n');
    
    const baseUrl = 'http://localhost:3001';
    
    // 测试健康检查端点
    try {
        console.log('1. 测试健康检查端点...');
        const healthResponse = await fetch(`${baseUrl}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ 健康检查通过:', healthData);
    } catch (error) {
        console.log('❌ 健康检查失败:', error.message);
        return;
    }
    
    // 测试主页
    try {
        console.log('\n2. 测试主页访问...');
        const homeResponse = await fetch(`${baseUrl}/`);
        if (homeResponse.ok) {
            console.log('✅ 主页可以访问');
            const content = await homeResponse.text();
            if (content.includes('Life Coach AI')) {
                console.log('✅ 主页内容正确');
            } else {
                console.log('⚠️ 主页内容可能有问题');
            }
        }
    } catch (error) {
        console.log('❌ 主页访问失败:', error.message);
    }
    
    // 测试 API 端点（简单测试）
    try {
        console.log('\n3. 测试 API 端点...');
        const apiResponse = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'ping'
            })
        });
        
        if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            console.log('✅ API 端点响应正常:', apiData);
        } else {
            console.log('❌ API 端点返回错误:', apiResponse.status);
        }
    } catch (error) {
        console.log('❌ API 端点测试失败:', error.message);
    }
    
    console.log('\n📋 测试完成！');
    console.log('如果所有测试都通过，请尝试在浏览器中打开:');
    console.log('http://localhost:3001');
}

// 检查 fetch 是否可用
if (typeof fetch === 'undefined') {
    // Node.js 18+ 内置 fetch，否则需要导入
    const { default: fetch } = require('node-fetch');
    global.fetch = fetch;
}

testServer().catch(console.error);