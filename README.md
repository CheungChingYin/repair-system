# 一、项目简介
&nbsp;&nbsp;&nbsp;&nbsp;本项目是机房报修管理系统的后端，基于Vue框架搭建而成。机房报修机房管理系统实现前后端分离，所以此处项目仅是前端部分，如需后端部分请点击右侧的超链接：[点我跳转](https://github.com/CheungChingYin/RepairSystem)。
## 项目体验
&nbsp;&nbsp;&nbsp;&nbsp;本项目已托管服务器中，各位可以通过下面的的连接访问网站进行体验，由于我提供的是超级管理员账户，所以任何人都能够自主删除管理员，希望各位体验的同学能够在做到以下几点：

- 不要胡乱删除管理员账号。
- 在产生了数据，如添加了管理员，实训室等操作，能够在登出的时候删除产生的数据，保持数据库的洁净。
- 添加维修工单可以上传图片，但希望不要涉及色情暴力的图片，亦不要上传过多的图片导致占满服务器带宽和容量。

- 体验地址：[点我跳转](http://139.199.66.197:8082)
- 账户名：`13842512341`
- 密码：`test13456`

&nbsp;&nbsp;&nbsp;&nbsp;本项目我将会以【机房报修管理系统】系列，以教程的形式发放在我的博客上：[点我跳转](https://blog.csdn.net/qq_33596978)，欢迎各位阅读我的文章。

[【机房报修管理系统】1.简介篇 机房报修管理系统简介](https://blog.csdn.net/qq_33596978/article/details/85330814)

## 文章目录：

# 二、涉及到的技术
## 1.前端
### JS框架：Vue.js
### UI库：Element-UI
### 异步请求：Axios
### Cookie：VueCookies

# 部署步骤（开发环境）

**请注意：部署步骤基于搭建好node.js的情况下**
## （一）点击上方的`Clone or download`按钮，点击`Download ZIP`
[![F5QUWn.md.png](https://s2.ax1x.com/2019/01/01/F5QUWn.md.png)](https://imgchr.com/i/F5QUWn)
## （二）解压文件
## （三）打开`CMD`或者`powershell`（Windows）输入以下命令
```
# 转到项目文件夹地址（请修改.\repair-syystem为自己解压的项目地址）
cd .\repair-syystem

# 安装依赖
npm install

# 服务将会重载在localhost:8080
npm run dev
```
## 部署成功会出现以下图片内容
![F5lifs.png](https://s2.ax1x.com/2019/01/01/F5lifs.png)

访问localhost:8080,能够显示登录页面即可
[![F5lm0U.md.png](https://s2.ax1x.com/2019/01/01/F5lm0U.md.png)](https://imgchr.com/i/F5lm0U)
