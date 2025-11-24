# 🚀 立即部署指南

## 方案 1：在 Vercel Dashboard 手动重新部署

1. **访问 Vercel Dashboard**
   - 打开：https://vercel.com/dashboard
   - 登录账号

2. **找到项目**
   - 项目名：`lifecoach267911`
   - 点击项目名称

3. **重新部署**
   - 点击顶部 **"Deployments"** 标签
   - 找到最新的部署（应该显示为 Deployed 状态）
   - 点击右侧的 **"⋮"** 菜单
   - 选择 **"Redeploy"**
   - 确认重新部署

## 方案 2：强制清除缓存重新部署

1. **在重新部署时选择选项**
   - Redeploy 对话框中
   - 勾选 **"Skip build cache"**
   - 勾选 **"Rebuild without cache"**

## 方案 3：创建新的预览部署

1. **进入 Git 仓库页面**
   - 访问：https://github.com/Lsr267911/lifecoach267911
   - 点击 **"Actions"** 标签
   - 查看 Vercel 部署状态

## 方案 4：使用 Vercel CLI（如果已安装）

```bash
# 进入项目目录
cd "/Users/liushirong/CodeBuddy/20251119201229/第四课-life coach"

# 强制重新部署
vercel --prod
```

## 🔄 验证部署成功

部署完成后，检查：
1. **浏览器控制台**应该显示：
   ```
   🌐 环境检测详情: {
     hostname: "lifecoach2679110.vercel.app",
     isLocalhost: false,
     finalApiUrl: "/api/chat"
   }
   ```

2. **不再出现 localhost 错误**

3. **API 请求**应该发送到：
   ```
   https://lifecoach2679110.vercel.app/api/chat
   ```

## ⏱️ 等待时间

- Vercel 自动部署：通常 1-3 分钟
- 手动重新部署：通常 2-5 分钟
- 首次部署：可能需要 5-10 分钟

---

**📱 部署完成后立即访问**：
https://lifecoach2679110.vercel.app/