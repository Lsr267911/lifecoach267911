# Life Coach AI - Vercel 部署监控与调试指南

## 修复内容概要

### ✅ 已完成的修复

1. **Function Max Duration 设置为 60 秒**
   - 在 `vercel.json` 中配置了 `maxDuration: 60`
   - 同时在 `functions` 和 `builds` 中都设置了该配置

2. **环境变量验证**
   - 创建了 `.env.example` 文件
   - 更新了 API 配置以使用环境变量
   - 添加了配置验证日志

3. **API 请求重试机制**
   - 实现了指数退避重试算法
   - 最多重试 3 次
   - 基础延迟 1 秒，最大延迟 8 秒
   - 智能判断是否需要重试

4. **增强的错误处理**
   - 详细的错误码分类
   - 更完整的错误信息
   - 开发环境下显示详细错误信息

## 部署检查清单

### 🔍 部署前检查

1. **确认文件结构**：
   ```
   ├── api/
   │   └── chat.js          # ✅ Vercel Serverless Function
   ├── vercel.json           # ✅ Vercel 配置文件
   ├── index.html           # ✅ 前端页面
   ├── package.json         # ✅ 依赖管理
   └── .env.example         # ✅ 环境变量示例
   ```

2. **验证 Vercel.json 配置**：
   - ✅ `maxDuration: 60` 设置正确
   - ✅ `routes` 配置正确指向 API
   - ✅ `headers` 配置了 CORS

### 🚀 部署步骤

1. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "优化 Vercel 部署配置：API 重试、超时设置、环境变量"
   git push origin main
   ```

2. **在 Vercel 中设置环境变量**：
   ```
   DEEPSEEK_API_KEY=f938b7f1-1697-4b78-b069-dcf1b2fc2c24
   DEEPSEEK_MODEL=deepseek-v3-250324
   DEEPSEEK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
   NODE_ENV=production
   API_TIMEOUT=60000
   MAX_TOKENS=2000
   ```

### 📊 监控和调试

#### 1. Vercel 控制台监控

**查看 Function 日志**：
1. 访问 Vercel Dashboard
2. 选择项目 `lifecoach267911`
3. 点击 "Functions" 标签
4. 查看最近的调用日志

**关键日志内容**：
```
API配置检查: { baseURL: '已设置', apiKey: '已设置', model: 'deepseek-v3-250324', timeout: 60000, maxTokens: 2000 }
收到用户消息: [用户消息]
API 请求尝试 1/3
DeepSeek API 响应状态: 200 (尝试 1)
AI 回复长度: [字符数] 字符
```

#### 2. 常见错误码及解决方案

**HTTP 401 错误**：
```
错误: API 密钥无效或已过期
解决: 检查 DEEPSEEK_API_KEY 环境变量设置
```

**HTTP 429 错误**：
```
错误: 请求频率过高，请稍后重试
解决: 检查重试机制是否正常工作
```

**HTTP 500/502/503 错误**：
```
错误: DeepSeek 服务器错误/网关错误/服务不可用
解决: 重试机制应该能处理，关注是否达到最大重试次数
```

**超时错误**：
```
错误: 请求超时，请稍后重试
解决: 已设置 60 秒超时，如果仍然超时可能需要检查网络连接
```

#### 3. 实时调试方法

**使用浏览器开发者工具**：
1. 打开 F12 开发者工具
2. 切换到 Network 标签
3. 发送测试消息
4. 查看 `/api/chat` 请求的响应

**测试 API 连接**：
```javascript
// 在浏览器控制台执行
fetch('/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: '测试连接'})
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

#### 4. 错误诊断流程

**第一步：检查基础配置**
- [ ] 环境变量是否正确设置
- [ ] Function Duration 是否为 60 秒
- [ ] API 路由配置是否正确

**第二步：查看实时日志**
- [ ] Vercel Function 日志
- [ ] 浏览器 Network 请求
- [ ] 控制台错误信息

**第三步：测试 API 连接**
- [ ] 发送简单测试消息
- [ ] 检查响应状态码
- [ ] 验证返回数据格式

**第四步：性能优化**
- [ ] 监控响应时间
- [ ] 检查重试机制触发情况
- [ ] 优化超时设置

## 性能优化建议

### 🚀 响应时间优化
1. **请求压缩**：已自动启用
2. **连接复用**：Vercel 自动处理
3. **缓存策略**：对静态资源启用缓存

### 🛡️ 错误处理优化
1. **重试机制**：指数退避，最多 3 次
2. **熔断保护**：暂时未实现（可考虑）
3. **降级策略**：暂时未实现（可添加模拟回复）

## 紧急故障排除

### 🆘 完全无法访问
1. 检查 Vercel 部署状态
2. 验证域名解析
3. 查看最近的部署日志

### 🔄 API 频繁失败
1. 检查 DeepSeek API 状态
2. 验证 API 密钥有效性
3. 监控请求频率限制

### 📱 前端连接问题
1. 检查 CORS 配置
2. 验证 API URL 配置
3. 查看浏览器网络请求

## 联系支持

如果遇到无法解决的问题：

1. **Vercel 支持团队**：通过 Vercel Dashboard 提交工单
2. **DeepSeek API 支持**：检查火山方舟控制台
3. **项目日志收集**：保存完整的错误日志和重现步骤

---

**最后更新时间**：2025-11-23
**版本**：v2.0 with enhanced retry and monitoring