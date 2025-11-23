# Git 永久修复配置
# 解决 HTTP 400 和连接问题

# HTTP 协议设置
git config --global http.version HTTP/1.1
git config --global http.postBuffer 524288000

# 网络超时设置  
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 300

# 打包设置
git config --global pack.windowMemory 512m
git config --global pack.packSizeLimit 512m

# 安全设置
git config --global http.sslVerify true
git config --global http.followRedirects true

echo "Git 配置已优化完成！"
echo "现在可以使用 git push 进行正常的版本管理了。"