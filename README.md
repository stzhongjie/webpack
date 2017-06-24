# **前言**

本文是基于昕哥的*Webpack学习系列（一）初学者使用教程* 这篇文章做构建。可能昕哥的文章是基于Mac环境，我是windows环境，在学习时遇到了很多坑，询问昕哥，他让我搞个基于windows环境的，我想了想，正好这几天需求不多，webpack3.0也来了，那就干吧！

## 什么是webpack？

> [Webpack](https://github.com/webpack/webpack) 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。通过 `loader` 的转换，任何形式的资源都可以视作模块，比如 CommonJs 模块、 AMD 模块、 ES6 模块、CSS、图片、 JSON、Coffeescript、 SASS 等。

webpack是基于node.js环境的前端自动化打包工具，本文默认你已有一定使用node和npm安装的基础。

# **安装**

**1.1 webpack安装**

首先新建一个练习文件夹demo，在文件中打开命令终端，输入下列指令即可安装webpack

> //全局安装
>
> npm install -g webpack
>
> //安装到项目文件夹
>
> npm install --save-dev webpack

安装完之后，demo里会多一个node_modules文件夹。

接下来输入

> npm init

会自动创建package.json文件。安装的时候一路回车即可，需要修改后面再进入package.json文件编辑。

package.json文件是webpack的骨架，在里面可以看到各个关键节点，设置快捷命令等。

**1.2 文件夹部署**

安装好上面的东西，我们开始往demo文件夹塞东西，新建**dist**，**src**文件夹、**webpack.config.js**配置文件来模拟开发环境。最终目录如下：

```
demo                      //webpack的模拟开发文件夹
   | - webpack.config.js  //配置webpack出入口、插件、loader
   | - node_modules
   | - dist               //打包输出文件夹
   | - src            	  //开发资源文件夹
     | - webpack.js     //配置webpack引入资源
     | - index.html     /*   基础html文件
     | - index.js            基础js文件
     | - index.css           基础css文件
     | - index.scss          基础scss文件            
     | - images              基础图片文件夹   */
         | - img1.png
         | - img2.png
```

**1.3 配置webpack.config.js**

```
var path = require('path')
var webpack = require('webpack')
module.exports = {
  // bundle入口
  entry: ['./src/webpack'],
  // bundle输出
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js' //可重命名
  }
}
```

# **运行**

按上面步骤安装后，运行

> webpack

即可打包，我们可以看到dist文件夹中生成了bundle.js，此时还未压缩，大小为3k。![QQ截图20170622162129](http://images.vrm.cn/2017/06/24/bundle未压缩.png)

**2.1 多入口** 

我们看到打包后生成了一个js文件，那假如我们项目需求生成几个不同类别的js呢？例如当js文件数量多，就模块化打包后按需加载。

 例如：webpack.js和webpack2.js要作为一个模块，而index.js和index2.js要作为另一个模块。这时entry和output就要换一种写法了：

配置webpack.config.js：

```
var path = require('path')
var webpack = require('webpack')
module.exports = {
  // 多入口
  entry: {
        name1: ['./src/webpack','./src/webpack2'],
        name2: ['./src/index','./src/index2']
  },
  // 输出
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js' //可重命名
  }
}
```

运行打包后可以在dist里看到两个name.js

![QQ截图20170623105907](http://images.vrm.cn/2017/06/24/多入口.png)

js模块化分离打包成功。

**2.2 *UglifyJsPlugin***

UglifyJsPlugin是webpack自带的核心插件，无需安装，无需声明require直接使用。它运行UglifyJs来压缩输入文件。

配置webpack.config.js，增加plugins项，里面放置插件

```
var path = require('path')
var webpack = require('webpack')
module.exports = {
  // bundle入口
  entry: ['./src/webpack'],
  // bundle输出
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js' //可重命名
  },
  //插件
  plugins: [
  		//压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
   ]
}
```

更改配置后，运行*webpack*打包，可以看到大小1k（实际是500多字节），压小了不少。

![QQ截图20170622162857](http://images.vrm.cn/2017/06/24/bundle已压缩.png)

# **loader**

Webpack 本身只能理解、处理 JavaScript 模块，如果要处理其他类型的文件，就需要使用 loader 进行转换。通过使用不同的loader，webpack通过调用外部的脚本或工具可以对各种各样的格式的文件进行处理。

总结：Webpack 只能看懂JavaScript ，对于其他静态文件，需要用loader帮助理解转换。

Loaders的配置选项包括以下几方面：

- `test`：一个匹配loaders所处理的文件的拓展名的正则表达式（必须）
- `loader`：loader的名称（必须）
- `include/exclude`:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
- `query`：为loaders提供额外的设置选项（可选）

介绍完毕，撸起来！

**3.1 编译CSS**

命令安装 *css-loader*

> npm install --save-dev style-loader css-loader

关于loaders的放置顺序：loader解析是从右向左，css-loader用于解析，而style-loader则将解析后的样式嵌入js代码。

配置webpack.config.js，增加module项，里面放置css-loader

```
var path = require('path')
var webpack = require('webpack')
module.exports = {
    // bundle入口
    entry: ['./src/webpack'],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    //组件loader
    module: {
    loaders: [{
       // css转换
       test: /\.css$/,
       loaders: ['style-loader', 'css-loader']
    }]
  }
}
```

配置webpack.js文件，引入index.css

```
require('./index.css') 
```

运行 *webpack* 打包，无报错即编译成功，可以在bundle.js文件里看到压缩进去的css文件。

**注意：**这里有个小坑，网上很多资料都说可以省略"-loader"，即：

```
loaders: [{
       // css转换
       test: /\.css$/,
       loaders: ['style', 'css']
}]
```

在windows环境我们按这种写法打包一下，会发现报错：

![编译css不加-loader时打包报错](http://images.vrm.cn/2017/06/24/编译css不加-loader时打包报错.png)

可以看到，里面提到不再允许省略"-loader"的写法。所以当我们写loader名称时不要简写。

**3.2 编译sass(scss)**

命令安装 *sass-loader*

> npm install --save-dev style-loader sass-loader

发现有飘红信息：![node-sass](http://images.vrm.cn/2017/06/24/node-sass.png)

缺少 node-sass 依赖，我们再敲一行命令装上去就可以了：

> npm install --save-dev style-loader node-sass

然后 *npm list* 命令看看有没有安装成功，后面带别的名称即可查其他分支。如sass-loader

> npm list node-sass

配置webpack.config.js，增加sass-loader

```
var path = require('path')
var webpack = require('webpack')
module.exports = {
    // bundle入口
    entry: ['./src/webpack'],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    //组件loader
    module: {
        loaders: [ 
            // css转换
            {
                test: /\.css$/, 
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
}
```

配置webpack.js文件，引入index.scss

```
require('./index.css') 
require('./index.scss') 
```

运行 *webpack* ，没报错就是编译sass成功了。编译less同理，不赘述。

# **plugins**

顾名思义，Plugins 就是webpack的插件。loader只能对静态文件做处理，而Plugins 不处理单个文件，而是作用于整个构建流程。上面提到的UglifyJsPlugin，也是插件的一种。

**4.1 分离CSS和JavaScript** ——Extract Text Plugin

进行到这里，我们会发现，打包之后的css和js都集合在一起，那到时候引入到页面上，是放到头部，还是尾部呢？显然都是不可取的：无论放头部和尾部，js都会阻塞页面渲染。而插件 *Extract Text Plugin* 可以帮助我们分离css和js。

命令安装：

> npm install --save-dev extract-text-webpack-plugin

配置webpack.config.js  

头部增加Extract Text Plugin插件引入，在plugins那里new一个你想输出的样式文件，最后在loader那增加插件写法。

```
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    // bundle入口
    entry: ['./src/webpack'],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("styles.css")
    ],
    //组件loader
    module: {
        loaders: [ 
            // css转换
            {
                test: /\.css$/, 
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
            }
        ]
    }
}
```

**注意：**没错，这里又有坑。

先运行打包一下：![QQ图片20170622183908](http://images.vrm.cn/2017/06/24/-loader报错.png)

日常报错。所幸日志里面有提醒我们：你的代码老掉牙了，换种写法吧！

来，把sass转换那部分用新的格式重写一遍：

```
// sass转换 
{
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract({
          fallback:'style-loader', 
          use:['css-loader','sass-loader']
  })
}
```

运行打包，终于成功，看到dist文件夹里生成了styles.css和bundle.js

![QQ截图20170622184502](http://images.vrm.cn/2017/06/24/分离css和js.png)

**4.2 生成html**

经历各种报错，终于完成编译css和js。接下来我们利用插件*html-webpack-plugin*来生成集成html

命令安装：

> npm install --save-dev html-webpack-plugin

配置webpack.config.js，添加插件方法和 **4.1** 一样

```
var path = require('path')
var webpack = require('webpack')
//分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
//生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry: ['./src/webpack'],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    }
}
```

运行打包，可以看到再dist文件夹里生成了一个html文件，webpack自动把css和js分别帮我们插入到头部和尾部，这一点很智能。

![QQ截图20170622190331](http://images.vrm.cn/2017/06/24/自动输出到html.png)

# **图片**

**5.1 图片打包** 

让webpack看得懂图片格式，需要用到 *url-loader* ，命令安装：

> npm install --save-dev url-loader

**注意：**这时候如果继续往下，到后面打包可能又会报错，因为url-loader是依赖于 *file-loader* 才运行的，我们命令安装：

>npm install --save-dev file-loader

*url-loader* 还有另外一个功能，将小图片（可自设大小）自动转为base64，减少页面请求数，大赞的功能啊！在html和css写好背景图片后，

配置webpack.config.js：

```
var path = require('path')
var webpack = require('webpack')
    //分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    //生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry: ['./src/webpack'],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            //css背景图片转换
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    }
}
```

运行打包后，打开index.html看看效果：

![未标题-3](http://images.vrm.cn/2017/06/24/跑起src图片.png)

**5.2 html中的src图片**

Webpack 不善于处理纯粹的 HTML, 要让webpack可以打包html中的src图片，需要用到*html-withimg-loader*。我们在index.html页面中添加一个src的img后命令安装：

>npm install --save-dev html-withimg-loader

配置webpack.config.js：

```
var path = require('path')
var webpack = require('webpack')
    //分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    //生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry: ['./src/webpack'],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            //css背景图片转换
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            //读取html，打包src图片
            {
                test: /\.html$/,
                loader: "html-withimg-loader"
            }
        ]
    }
}
```

loader增加html-withimg-loader

然后在webpack.js里引入index.html：

```
require('./index.html')
```

运行打包，没报错即成功，打开dist文件夹里的html看看效果：

![html src](http://images.vrm.cn/2017/06/24/html src.png)

可以看到src的图片已经被成功引入进来。

**5.3 图片整理**

我们仔细看看输入文件夹，![图片打包散乱](http://images.vrm.cn/2017/06/24/图片打包散乱.png)

图片直接输出在dist文件夹，而且名称被重命名。当图片数量上去，非常不利于管理。我们在loader那完善：

```
{
	test: /\.(png|jpg)$/,
	loader: 'url-loader?limit=8192&name=images/[name].[ext]'
},           
```

name字段指定了在输出目录（dist）新建一个images文件夹，来存放打包后的图片，名称是原图片命名。

![整理过的图1](http://images.vrm.cn/2017/06/24/整理过的图1.png)

# **调试**

到这里，基础页面已经成型，接下来就是开发了，开发需要调试。那么我们怎么调试这个页面呢？

如果每次改一次页面，就要打包一次，严重降低效率。运行命令：

> webpack --watch

开着这个命令终端，我们修改的html，css(sass)，js等静态文件都可以通过*刷新*html页面直接看到效果。

看到这，有同学说我F5键已抠，懒得每次都要按刷新怎么办？

这时候*热加载(HMR)*可以帮到你，首先，跑起一个服务。

# **服务**

**6.1** 轻量的node.js express服务器——Webpack-dev-server

webpack可以跑起一个微型服务器，直接作用于资源文件，方便我们开发调试。其中*热加载*是一个非常实用的功能。命令安装Webpack-dev-server

>npm install --save-dev webpack-dev-server

配置webpack.config.js：

```
var path = require('path')
var webpack = require('webpack')
    //分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    //生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry:  [
        './node_modules/webpack-dev-server/client?http://localhost:8080',
        './node_modules/webpack/hot/dev-server',
        './src/webpack'
    ],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename:  'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            //css背景图片转换
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
```

增加两个入口，用于关联服务器；devServer里面的contentBase指向你的输出文件夹dist（或其他命名），hot表示是否开启热加载。

可以从入口看出项目服务访问地址是：http://localhost:8080。

跑服务的命令是：

>webpack-dev-server --config webpack.config.js

每次都这么输入太累赘，可以在*package.json*里配置命令：

```
"scripts": {
    "dev": "webpack-dev-server --config webpack.config.js"
},
```

这样每次跑服务，直接：

>npm run dev

就可以了，当然你也可以自由更改端口号，例如把8080改为8888：

```
"scripts": {
    "dev": "webpack-dev-server --host localhost --port 8888 --config webpack.config.js"
 },
```

运行服务命名，在浏览器输入相应端口号，就可以看到运行于webpack服务的页面了

![跑起服务](http://images.vrm.cn/2017/06/24/跑起服务.png)

**6.2 热加载(HMR)**

终于到重点了。跑起来的8080服务页面，目标调试需要刷新页面才能生效，但只要我们使用HMR，只要代码有改动，无需刷新页面，浏览器会自动更新。

在上文的图片模块中（**5.2**），已引入了*html-withimg-loader* ——可以将html转为字符串的loader，在这就省略引入解析html-loader的步骤。

配置webpack.config.js：

```
var path = require('path')
var webpack = require('webpack')
    //分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    //生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry: [
        './node_modules/webpack-dev-server/client?http://localhost:8080',
        './node_modules/webpack/hot/dev-server',
        './src/webpack'
    ],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        //分离css和js
        new ExtractTextPlugin("styles.css"),
        //生成html页面
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //热加载
        new webpack.HotModuleReplacementPlugin()
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            //css背景图片转换
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }, 
            //读取html，热加载
            {
                test: /\.html$/,
                loader: "html-withimg-loader" 
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
```

在plugins增加热加载插件；loader增加raw-loader，正则匹配html。

运行：

> npm run dev

现在你随意修改页面内容，会发现不用手动刷新浏览器就自动更新了你所更改的内容。

# **Babel**

Babel 是一款转码编译器，可以很方便地将 ES6、ES7 等当前浏览器不兼容的 JavaScript 新特性转码为 ES5 等当前浏览器普遍兼容的代码。将两者结合起来可以很方便地在项目中一边使用 ES6 编写代码，一边自动生成 ES5 代码。

Babel有不同的插件，可以按需安装：http://babeljs.io/docs/plugins/preset-es2015/

安装相关组件：

>//安装加载器 babel-loader 和 Babel 的 API 代码 babel-core
>npm install --save-dev babel-loader babel-core
>
>安装 ES2015（ES6）的代码，用于转码
>npm install babel-preset-es2015 --save-dev
>
>//用于转换一些 ES6 的新 API，如 Generator，Promise 等
>npm install --save babel-polyfill

配置webpack.config.js：

```
var path = require('path')
var webpack = require('webpack')
    //分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    //生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry: [
        './node_modules/webpack-dev-server/client?http://localhost:8080',
        './node_modules/webpack/hot/dev-server',
        './node_modules/babel-polyfill',
        './src/webpack',
        './src/index'
    ],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        //分离css和js
        new ExtractTextPlugin("styles.css"),
        //生成html页面
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //热加载
        new webpack.HotModuleReplacementPlugin()
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            //css背景图片转换
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            },
            //读取html，打包src图片
            {
                test: /\.html$/,
                loader: "html-withimg-loader"
            },
            //编译es6，转化为es5
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader', 
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
```

entry入口那里增加了*babel-polyfill*，loader增加*babel-loader*。由于要验证打包后的js是否已编译转为es5，所以这里注释代码压缩的插件。

在index.js里任意输入一个es6语法的语句：

![es6](http://images.vrm.cn/2017/06/24/es6.png)

然后再打开打包后的bundle.js文件，拉到最下面，可以发现该es6语句已被转为es5语法输出：

![es5](http://images.vrm.cn/2017/06/24/es5.png)

编译转码成功。

# **问题**

至此webpack打包大致的步骤已完成。在行文过程中，发现了几个问题不得其解，网上谷歌搜索也搜不出个所以然，故在这里把问题抛出，希望知道的大神不吝赐教。

一：热加载那里，我发现假如引用的是css文件，修改内容热加载有效果，但引用scss文件热加载就失效了，如何让引用scss文件也能实现热加载呢？

二：html-withimg-loader和raw-loader的区别是什么呢？网上的解释都说是对html解析成字符串，让js读懂。昕哥的文章里，热加载用的loader是raw-loader，但我发现用html-withimg-loader也能跑起来。



