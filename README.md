# README
由于项目前端迁移到了webpack,开发模式上有一些变化，下面逐一说明。
## 项目依赖：
本想目采用Rails开发，前端采用Webpack+Vue+ES6 Module技术，运行前需满足以下关键依赖：

1. 系统依赖：（需自己安装）   
ruby >= 2.3   
node.js >= 6   
yarn >= 1   

2. Ruby GEM依赖：（已配置好，执行bundle install、bundle update即可）     
rails ~> 5.1.4  
webpacker >= 3   

3. webpack关键依赖:（已配置好，执行yarn install 即可）   
babel相关      
webpack ^3.6.0   
vue ^2.4.4   
**jquery ^3.2.1**   
**turbolinks ^5.0.3**   
jquery-ujs ^1.2.2   


## 项目运行：
项目有两个分支master和dev,后者是迁移到webpack之后的分支，目前的开发都在dev分支上进行。
1. 克隆项目  
```
git clone https://github.com/sguo2017/clue-platform.git
```
2. 安装ruby依赖
```
bundle install   
bundle update   
```
3. 数据库迁移
```
rails db:migrate
```
4. 安装nodejs依赖
```
yarn install
```
5. 编译前端资源
```
 ./bin/webpack
```
6. 运行
```
rails s
```   

## 项目开发
1. 后端开发    
开发模式与以前的rails应用没啥区别。   
2. 关于assets pipiline   
虽然使用了webpack,但是目前assets pipeline 还保留着，因为go.js没有node npm的包，而且直接放到webpack中会大大拖慢编译速度，因此暂时放在assets pipeline中；
另外，以前写的css文件也还在assets pipeline中（还没来得及迁移，但迁移起来没什么难度）。   
3. 前端开发流程    
依然采用all in one（所有资源打包为同一个文件）的开发模式：   


- 资源文件目录变化   
app/assets => app/javascripts/packs
- 引入方式变化   
javascript_include_tag => javascript_pack_tag   
stylesheet_link_tag => stylesheet_pack_tag   
- 文件组织方式变化   
**传统方式：**   
app/assets/javascript/controllers/demo.js
app/assets/stylesheets/controllers/demo.scss
app/views/demos/index.html.erb
js/css在相应清单文件中被引入，view中引入清单文件。   
缺点是容易引起js/css冲突，且不容易实现页面级别的组件化、模块化；优点是使用后端渲染，速度快，可以很方面地使用erb标签。   
**当前方式：**   
app/javascripts/pack/controllers/demos/index/app.js   
app/javascripts/pack/controllers/demos/index/app.scss   
app/javascripts/pack/controllers/demos/index/app.vue   
app/views/demos/index.html.erb   
每个页面都有一组以上的目录。   
其中app.vue 会引入app.scss，app.js会引入app.vue，并把此vue组件挂载到view中,view中除了一个一个<app></app>标签和一个父div以外没有其它东西，
在app/javascript/packs/application.js中需要引入app.js。   
优点是模块化彻底，不会因此css、js全局冲突，可复用性高；缺点是不能使用erb标签，需要用ajax获取。   
**当然这些目录要求并不是强制的，可灵活修改，但是推荐统一按照第二种方式，除非需要使用大量的erb标签。**   
- 关于vue单文件组件   
app/javascript/packs/components目录下是自定义的可复用的页面组件，可直接使用，当然你也可以定义自己的组件。      
可以使用第三方插件组件，若需要全局使用，可在app/javascript/packs/extensions/active_vue_plugins.js中进行全局注册，注册方式参考插件说明。   
.vue单文件组件中，分为三个部分：   
`<template></template>`标签中编写html代码；   
`<script></script>`标签中编写vue组件对象以及其他js，并使用export default 将vue对象导出;   
`<style scoped></style>`标签中编写css,仅对当前页面有效，不会引起全局污染。   
- 关于css   
webpack中，js文件可以直接import css文件，并生成一个与该js同名的css,使用stylesheet_pack_tag可将其引入。
- 关于webpack
本项目中使用的是rails官方支持的webpacker插件，其中包含了webpack3,并且与rails进行了集成。webpack的配置文件有以下几个
package.json   
confug/webpacker.yml   
config/webpack/\*.js   
**配置文件十分复杂，而在rails中的配置又与单纯的webpack配置不太一样，目前我已经配置好了并且可以满足当前的需求，所以在没有出现问题的情况下，最好不要改动配置文件或者升级相关的包。**   
编译webpack资源有两种方式：   
（1）手动运行./bin/webpack       
（2）文件修改后，刷新浏览器页面会自动重新编译
- 编码风格要求（非强制）   
(1)尽量不使用jquery操作dom；  
(2)不使用全局变量（在webpack中不适用var/let关键字声明变量会报错）；   
(3)如非必须，js句末不使用分号；   
(4)js中使用单引号而非双引号；   
(5)以前的文件不用管它；   
(6)要有模块化、面向对象、可复用的编程思想；   
(7)插件尽量使用vue版本的而非jquery版本的。  

## 项目下一阶段需求
1. 首页：嫌疑犯、案件侧栏应该放在其它页面；   
2. 战法首页：为每个战法/任务生成一个较为美观的缩略图，用户可上传自定义封面；   
3. 战法状态：定义战法的状态，分为完成/未完成，当所有任务完成时才可以将战法的状态设为完成，战法完成后除系统管理员外不可修改；   
4. 战法权限：定义战法的权限，并非每个人都可以编辑战法，需授权，默认创建者拥有所有权限；   
5. 战法分享：当战法完成后，可设为经典战法，一旦设为经典战法，代表战法已经发布到公共资源池，对其他人可见，同时，他人可将资源池中的战法进行复制（类似于github的fork），作为自己的模板，并在此基础上进行修改；   
6. 查看进度页面：显示的文件列表为战法的总结性文件而非战法过程任务所产生的附件；   
7. 增加"完成战法"页面，可将战法状态设置为完成，并使用“富文本编辑器”编写战法总结，同时上传战法总结附件；
8. 分析工具：增加右键菜单，可对节点进行操作（删除节点、复制节点、切换切点显示的属性、编辑节点属性）；
9. 分析工具： 增加数据增量导入功能；
10. 封面编辑：用户可上传自定义封面、选取封面商城中的图片作为自己战法的封面。    


## 参考资料
1. vue(必看)   
https://cn.vuejs.org/v2/guide/   
2. vue插件集合(按需寻找)   
https://github.com/vuejs/awesome-vue   
3. yarn(必看，掌握常用的即可)   
https://yarn.bootcss.com/docs/   
4. ES6 Module（必看）   
http://es6.ruanyifeng.com/#docs/module   
5. webpacker（可选）  
https://github.com/rails/webpacker/
6. webpack3中文文档（可选）   
http://www.css88.com/doc/webpack/
7. webpack3官方文档（可选）   
https://webpack.js.org/guides/
8. 前端模块化方案（可选）   
http://web.jobbole.com/83761/
9. element-ui（可选）    
http://element.eleme.io/#/zh-CN/component/installation
10. ES 2015（ES6）教程（可选）  
https://babeljs.io/learn-es2015/
