# 🌟 Vercel 环境变量快速设置指南

## 🎯 最少必需的 3 个环境变量

### 1️⃣ DEEPSEEK_API_KEY
```
变量名: DEEPSEEK_API_KEY
值: f938b7f1-1697-4b78-b069-dcf1b2fc2c24
说明: 火山方舟 API 密钥
```

### 2️⃣ DEEPSEEK_MODEL  
```
变量名: DEEPSEEK_MODEL
值: deepseek-v3-250324
说明: DeepSeek 模型版本
```

### 3️⃣ DEEPSEEK_BASE_URL
```
变量名: DEEPSEEK_BASE_URL
值: https://ark.cn-beijing.volces.com/api/v3/chat/completions
说明: API 端点地址
```

## 📋 设置步骤（图解）

### 第一步：进入 Vercel Dashboard
1. 访问：https://vercel.com/dashboard
2. 登录账号

### 第二步：选择项目
1. 找到项目：`lifecoach267911`
2. 点击项目名称

### 第三步：添加环境变量
1. 点击顶部 **"Settings"** 标签
2. 左侧菜单点击 **"Environment Variables"**
3. 点击 **"Add"** 按钮

### 第四步：填写环境变量
对每个变量，按以下格式填写：

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| DEEPSEEK_API_KEY | f938b7f1-1697-4b78-b069-dcf1b2fc2c24 | Production, Preview, Development |
| DEEPSEEK_MODEL | deepseek-v3-250324 | Production, Preview, Development |
| DEEPSEEK_BASE_URL | https://ark.cn-beijing.volces.com/api/v3/chat/completions | Production, Preview, Development |

### 第五步：保存并重新部署
1. 点击 **"Save"**
2. 进入 **"Deployments"** 标签
3. 点击最新部署的 **"⋮"** → **"Redeploy"**

## ⚡ 验证设置

部署完成后，在浏览器控制台应该看到：
```javascript
🌐 环境检测详情: {
  hostname: "xxx.vercel.app",
  isVercel: true,
  finalApiUrl: "https://xxx.vercel.app/api/chat"
}
```

## 🔍 故障排除

### 如果 API 仍然失败：
1. **检查环境变量是否正确设置**
2. **确保重新部署了项目**
3. **查看 Vercel Function 日志**

### 环境变量设置页面示例：
```
🔑 Environment Variables
┌─────────────────────────────────────────────┐
│ Variable Name          │ Value               │
├─────────────────────────────────────────────┤
│ DEEPSEEK_API_KEY     │ f938b7f1-16...     │
│ DEEPSEEK_MODEL       │ deepseek-v3-250324 │
│ DEEPSEEK_BASE_URL    │ https://ark.cn...  │
└─────────────────────────────────────────────┘
```

---

**⚠️ 重要提醒**：设置环境变量后必须重新部署项目才能生效！