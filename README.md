### 技术栈

后端：

`egg.js`:

前端：

`axios`:发送网络请求

`zarm`:组件库

`propType`:校验`props`类型及默认值

`react-router-dom`:项目路由管理

## 后端部分

### 源码地址:https://github.com/time0verflow/account-h5-back

### 目录结构

应用目录：

```txt
📦app
 ┣ 📂controller //用于解析用户的输入，处理后返回相应的结果
 ┃ ┣ 📜bill.js
 ┃ ┣ 📜home.js
 ┃ ┣ 📜type.js
 ┃ ┣ 📜upload.js
 ┃ ┗ 📜user.js
 ┣ 📂middleware  //用于编写中间件
 ┃ ┗ 📜jwtErr.js
 ┣ 📂public     //用于放置静态资源
 ┃ ┗ 📂upload   //存放上传的图片资源
 ┣ 📂service    //用于数据库的查询
 ┃ ┣ 📜bill.js
 ┃ ┣ 📜home.js
 ┃ ┣ 📜type.js
 ┃ ┗ 📜user.js
 ┣ 📂view
 ┃ ┗ 📜index.html
 ┗ 📜router.js   //用于匹配URL路由规则
```

