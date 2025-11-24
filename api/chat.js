// Vercel Serverless Function for AI Chat
// 处理 AI 对话请求

const axios = require('axios');

// 火山方舟 DeepSeek V3 API 配置
const API_CONFIG = {
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY || 'f938b7f1-1697-4b78-b069-dcf1b2fc2c24',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-v3-250324',
    timeout: parseInt(process.env.API_TIMEOUT) || 60000,
    temperature: 0.6,
    maxTokens: parseInt(process.env.MAX_TOKENS) || 2000
};

// 验证必要的环境变量
console.log('API配置检查:', {
    baseURL: API_CONFIG.baseURL ? '已设置' : '未设置',
    apiKey: API_CONFIG.apiKey ? '已设置' : '未设置',
    model: API_CONFIG.model,
    timeout: API_CONFIG.timeout,
    maxTokens: API_CONFIG.maxTokens
});

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

// API 请求重试函数
async function makeAPIRequest(requestData, maxRetries = 3) {
    const baseDelay = 1000; // 基础延迟 1 秒
    const maxDelay = 8000;  // 最大延迟 8 秒
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`API 请求尝试 ${attempt}/${maxRetries}`);
            
            const response = await axios.post(API_CONFIG.baseURL, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.apiKey}`
                },
                timeout: API_CONFIG.timeout
            });

            console.log(`DeepSeek API 响应状态: ${response.status} (尝试 ${attempt})`);
            
            // 验证响应数据
            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                throw new Error('API 响应格式异常');
            }

            const aiReply = response.data.choices[0].message?.content;
            if (!aiReply) {
                throw new Error('AI 回复内容为空');
            }

            console.log(`AI 回复长度: ${aiReply.length} 字符`);
            return {
                success: true,
                reply: aiReply.trim(),
                model: API_CONFIG.model,
                usage: response.data.usage || null,
                attempt: attempt
            };

        } catch (error) {
            console.error(`API 请求失败 (尝试 ${attempt}):`, error.message);
            
            // 检查是否应该重试
            const shouldRetry = 
                attempt < maxRetries && (
                    error.code === 'ECONNABORTED' ||  // 超时
                    error.code === 'ECONNRESET' ||    // 连接重置
                    error.response?.status >= 500 ||   // 服务器错误
                    error.response?.status === 429    // 频率限制
                );

            if (!shouldRetry) {
                throw error;
            }

            // 指数退避延迟
            const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
            console.log(`等待 ${delay}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw new Error(`API 请求在 ${maxRetries} 次尝试后仍然失败`);
}

module.exports = async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: '请提供有效的消息内容'
            });
        }

        const userMessage = message.trim();

        if (userMessage.length > 1000) {
            return res.status(400).json({
                success: false,
                error: '消息长度不能超过1000字'
            });
        }

        if (userMessage === 'ping') {
            return res.json({
                success: true,
                reply: 'pong'
            });
        }

        console.log(`收到用户消息: ${userMessage}`);

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
            stream: false
        };

        // 使用重试机制发送请求
        const result = await makeAPIRequest(requestData);

        // 返回成功响应
        res.json({
            success: true,
            reply: result.reply,
            model: result.model,
            usage: result.usage,
            attempts: result.attempt
        });

    } catch (error) {
        console.error('处理聊天请求时出错:', error);

        let errorMessage = '服务器内部错误';
        let statusCode = 500;
        let errorDetails = {};

        if (error.response) {
            statusCode = error.response.status;
            errorDetails = {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            };
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
                case 502:
                    errorMessage = 'DeepSeek 网关错误，请稍后重试';
                    break;
                case 503:
                    errorMessage = 'DeepSeek 服务暂时不可用，请稍后重试';
                    break;
                default:
                    errorMessage = `API 请求失败 (${error.response.status})`;
            }
        } else if (error.request) {
            errorDetails = {
                code: error.code,
                message: error.message
            };
            console.error('网络请求失败:', error.message);
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = '请求超时，请稍后重试';
            } else if (error.code === 'ECONNRESET') {
                errorMessage = '网络连接被重置，请稍后重试';
            } else if (error.code === 'ENOTFOUND') {
                errorMessage = '无法解析 API 服务器地址';
            } else {
                errorMessage = '网络连接失败，请检查网络连接';
            }
        } else {
            errorDetails = { message: error.message };
            console.error('其他错误:', error.message);
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
            timestamp: new Date().toISOString()
        });
    }
};