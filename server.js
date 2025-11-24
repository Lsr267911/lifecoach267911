// Life Coach AI 后端服务器
// 基于 Node.js 和 Express.js 实现
// 集成火山方舟 DeepSeek V3 API

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// 创建 Express 应用实例
const app = express();
const PORT = process.env.PORT || 3001;

// 火山方舟 DeepSeek V3 API 配置
const API_CONFIG = {
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: 'f938b7f1-1697-4b78-b069-dcf1b2fc2c24', // 使用你提供的 Bearer Token
    model: 'deepseek-v3-250324', // 注意模型名称为小写
    timeout: 60000, // 60秒超时
    temperature: 0.6,
    maxTokens: 2000 // 最大回复长度
};

// Life Coach 系统提示词
const SYSTEM_PROMPT = `你是一位专业的 Life Coach AI 助手，拥有丰富的心理学、教育学和个人成长知识背景。你的使命是帮助用户在生活、学习和工作中不断成长和进步。

你的特点和职责：
1. 倾听与理解：仔细倾听用户的问题，理解他们的处境和需求
2. 提供建议：基于你的知识库，为用户提供实用的建议和指导
3. 鼓励支持：用积极的语言鼓励用户，帮助他们建立自信
4. 目标导向：帮助用户明确目标，制定可行的行动计划
5. 情感支持：在用户遇到困难时给予情感上的支持和安慰

对话风格：
- 温暖友善，像一位贴心的朋友
- 专业而不生硬，易于理解
- 积极正面，充满正能量
- 注重实用性，提供可操作的建议

请始终记住：你的目标是帮助用户成为更好的自己。每一次对话都要体现你的专业性和关怀。`;

// 配置 CORS - 允许前端跨域访问
app.use(cors({
    origin: [
        'http://localhost:3001', 
        'http://127.0.0.1:3001', 
        'file://', 
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        'https://lifecoach2679110.vercel.app',
        'https://lifecoach2679110-d8421sjjy-lsrs-projects-789ce81d.vercel.app',
        /^https?:\/\/.*\.vercel\.app$/,
        /^https?:\/\/.*\.github\.io$/,
        'http://localhost:*',
        'https://localhost:*',
        null // 支持 file:// 协议
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200
}));

// 解析 JSON 请求体
app.use(express.json({ limit: '10mb' }));

// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务 - 提供 HTML 文件
app.use(express.static(path.join(__dirname)));

// 请求日志记录
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// favicon.ico 处理 - 避免控制台报错
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 根路径 - 返回前端页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// AI 对话 API 端点
app.post('/api/chat', async (req, res) => {
    try {
        // 检查请求体
        if (!req.body || !req.body.message) {
            return res.status(400).json({
                success: false,
                error: '请提供有效的消息内容'
            });
        }
        
        const userMessage = req.body.message.trim();
        
        // 检查消息长度
        if (userMessage.length > 1000) {
            return res.status(400).json({
                success: false,
                error: '消息长度不能超过1000字'
            });
        }
        
        // 如果是 ping 请求，直接返回
        if (userMessage === 'ping') {
            return res.json({
                success: true,
                reply: 'pong'
            });
        }
        
        console.log(`收到用户消息: ${userMessage}`);
        
        // 检查是否启用模拟模式（用于测试）
        if (process.env.MOCK_API === 'true' || API_CONFIG.apiKey === 'mock-key') {
            // 模拟 AI 回复
            const mockResponses = [
                "这是一个很好的问题！作为你的生活教练，我建议你先从小目标开始，逐步建立信心。记住，每个伟大的成就都始于第一步。",
                "我理解你的困扰。生活中遇到挑战是正常的。让我们一起来分析一下这个问题，找到最适合你的解决方案。",
                "很高兴看到你这么积极地寻求成长！持续学习是成功的关键。我建议你可以制定一个具体的学习计划，并且坚持下去。",
                "谢谢你与我分享你的想法。这表明你对自己的人生有深入的思考。让我们一起探讨如何将这些想法转化为实际行动。"
            ];
            
            const mockReply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            console.log('使用模拟回复:', mockReply.substring(0, 50) + '...');
            
            return res.json({
                success: true,
                reply: mockReply,
                model: 'mock-model',
                usage: null
            });
        }
        
        // 准备发送到 DeepSeek API 的请求数据
        const requestData = {
            model: API_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: API_CONFIG.temperature,
            max_tokens: API_CONFIG.maxTokens,
            stream: false // 暂不使用流式输出，以便更好地处理错误
        };
        
        console.log('发送请求到 DeepSeek API...');
        
        // 发送请求到火山方舟 DeepSeek API
        const response = await axios.post(API_CONFIG.baseURL, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            timeout: API_CONFIG.timeout
        });
        
        console.log(`DeepSeek API 响应状态: ${response.status}`);
        
        // 检查响应数据结构
        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            throw new Error('API 响应格式异常');
        }
        
        const aiReply = response.data.choices[0].message?.content;
        
        if (!aiReply) {
            throw new Error('AI 回复内容为空');
        }
        
        console.log(`AI 回复长度: ${aiReply.length} 字符`);
        
        // 返回成功响应
        res.json({
            success: true,
            reply: aiReply.trim(),
            model: API_CONFIG.model,
            usage: response.data.usage || null
        });
        
    } catch (error) {
        console.error('处理聊天请求时出错:', error);
        
        let errorMessage = '服务器内部错误';
        let statusCode = 500;
        
        // 根据错误类型提供具体的错误信息
        if (error.response) {
            // API 返回了错误响应
            statusCode = error.response.status;
            console.error(`DeepSeek API 错误响应: ${error.response.status}`, error.response.data);
            
            switch (error.response.status) {
                case 400:
                    errorMessage = '请求参数错误';
                    break;
                case 401:
                    errorMessage = 'API 密钥无效或已过期';
                    break;
                case 403:
                    errorMessage = 'API 访问被拒绝';
                    break;
                case 429:
                    errorMessage = '请求频率过高，请稍后重试';
                    break;
                case 500:
                    errorMessage = 'DeepSeek 服务器错误，请稍后重试';
                    break;
                default:
                    errorMessage = `API 请求失败 (${error.response.status})`;
            }
        } else if (error.request) {
            // 网络请求失败
            console.error('网络请求失败:', error.message);
            if (error.code === 'ECONNABORTED') {
                errorMessage = '请求超时，请稍后重试';
            } else {
                errorMessage = '网络连接失败，请检查网络连接';
            }
        } else {
            // 其他错误
            console.error('其他错误:', error.message);
        }
        
        // 返回错误响应
        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('未处理的错误:', error);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});

// 404 处理
app.use((req, res) => {
    console.warn(`404 - 未找到路径: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        error: '接口不存在'
    });
});

// 优雅关闭处理
function gracefulShutdown(signal) {
    console.log(`收到 ${signal} 信号，开始优雅关闭...`);
    
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
    
    // 强制关闭超时
    setTimeout(() => {
        console.log('强制关闭服务器');
        process.exit(1);
    }, 10000);
}

// 启动服务器
const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Life Coach AI 服务器启动成功！');
    console.log(`📡 服务器运行在: http://localhost:${PORT}`);
    console.log(`🏠 前端页面: http://localhost:${PORT}/`);
    console.log(`🔗 API 端点: http://localhost:${PORT}/api/chat`);
    console.log(`💊 健康检查: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
    console.log('💡 提示：按 Ctrl+C 可以优雅关闭服务器');
});

// 注册优雅关闭处理器
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 依赖检查和启动提示
console.log('检查依赖...');
const requiredPackages = ['express', 'cors', 'axios'];
let missingPackages = [];

requiredPackages.forEach(pkg => {
    try {
        require.resolve(pkg);
    } catch (e) {
        missingPackages.push(pkg);
    }
});

if (missingPackages.length > 0) {
    console.error('❌ 缺少依赖包:', missingPackages.join(', '));
    console.log('请运行以下命令安装依赖:');
    console.log(`npm install ${missingPackages.join(' ')}`);
    process.exit(1);
}

console.log('✅ 所有依赖检查通过');

// 导出应用实例（用于测试）
module.exports = app;