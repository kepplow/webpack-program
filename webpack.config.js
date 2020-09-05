var path = require('path');
var glob = require('glob-all');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin'); // 模板html自动引入依赖文件。。。插件
var webpackDeepScopePlugin = require('webpack-deep-scope-plugin').default; // js tree shaking
var miniCssExtractPlugin = require('mini-css-extract-plugin'); // 单独打包出css文件 不支持热更新
var PurifyCSSPlugin = require('purifycss-extended-webpack'); // css 抖动 tree shaking
var {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 每次打包清除上次的包
var UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin') //压缩js代码插件，解决webpack4默认压缩报错问题
var webpackConfig = {
    // entry: './src/index.js', // 单入口
    // 多入口
    entry: {
        index: './src/pages/index/index.js'
    },
    //出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][hash:5].bundle.js',
        chunkFilename: '[name][hash:5].js'
    },
    // 优化
    optimization: {
        minimizer: [
            // 代替webpack4 默认js压缩
            new UglifyJSWebpackPlugin({
                test: [/\.(js|jsx)$/],
                exclude: [/node_modules/, /src\/components\/vendor/],
                cache: "./.cache",
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    warnings: false,
                    compress: {
                    inline: 1,
                    keep_fnames: true
                    },
                    mangle: {
                    keep_fnames: true
                    }
                }
            })
        ]
    //     // 公共引入的模块
    //     splitChunks: {
    //         // 公共组
    //         cacheGroups: {
    //             // 业务代码
    //             common: {
    //                 // 打包出的名字
    //                 name: "common",
    //                 // 匹配的文件地址
    //                 // test: /[\\/node_modules[\\/]]/,
    //                 // 哪些需要抽离
    //                 chunks: 'all',
    //                 // 优先级
    //                 priority: 1,
    //                 // 文件最低引入大小
    //                 minSize: 1,
    //                 // 文件最低引入次数
    //                 minChunks: 1
    //             },
    //             // 依赖模块代码
    //             vendor: {
    //                 name: 'vender',
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: 10,
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    },
    // 模块
    module: { 
        // 规则
        rules: [
            // 匹配文件，使用不同加载器，从右到左 
            {
                test: /\.js$/,
                use: {
                    // js语法糖编译
                    loader: 'babel-loader',
                    options: {
                        // 预设
                        presets: ['@babel/preset-env'],
                        // 插件
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                },
                // 忽略目录
                exclude: /(node_modules|bower_components)/
            },
            {test: /\.less$/, use: [
                miniCssExtractPlugin.loader,
                'css-loader',
                // 抽象语法树 加载器
                {
                    loader: 'postcss-loader',
                    // 配置项
                    options: {
                        ident: 'postcss', // 配置对象
                        // 插件
                        plugins: [
                            // 包含autoprefixer的功能，增加前缀，定义变量
                            require('postcss-cssnext')(),
                            // require('autoprefixer')(),
                            // 压缩代码
                            require('cssnano')()
                        ]
                    }
                }, 
                'less-loader'
            ]},
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
            //处理sass中的loader
            {
                test: /\.(scss)$/,
                use: [{
                  loader: 'style-loader', // inject CSS to page
                }, {
                  loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                  loader: 'postcss-loader', // Run postcss actions
                  options: {
                    plugins: function () { // postcss plugins, can be exported to postcss.config.js
                      return [
                        require('autoprefixer')
                      ];
                    }
                  }
                }, {
                  loader: 'sass-loader' // compiles Sass to CSS
                }]
              },
            {
                test: /\.(jpg|png|jpeg|gif)$/,
                use: [
                    // 图片解析
                    {
                        loader: 'url-loader',
                        options: {
                            //输出图片名
                            name: '[name][hash:5].[ext]',
                            // 限制图片大小 《= 100kb 进行base64编码
                            limit: 100000,
                            // 如果图片过大 输出路径
                            outputPath: 'images'
                        }
                    },
                    // 图片压缩
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                // 引入插件
                                require('imagemin-pngquant')({
                                    // 压缩质量
                                    qualit: [0.3, 0.7]
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            // 对img的src属性进行处理
                            attrs: ['img:src']
                        }
                    }
                ]
            }
        ]
    },
    // 插件
    plugins: [
        // 打包为单独css文件的插件
        new miniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
        }),
        // 筛除文件中无用的css代码插件
        new PurifyCSSPlugin({
        // Give paths to parse for rules. These should be absolute!
            paths: glob.sync([
                // 匹配js中的结构
                path.join(__dirname, './src/pages/*/*.js'),
                // 匹配html中的结构
                path.join(__dirname, './src/pages/*/*.html')
            ]),
        }),
        // 深度筛除无用js代码
        new webpackDeepScopePlugin(),
        // 清除旧包
        new CleanWebpackPlugin(),
        // 自动生成dist中的HTML 插件
        // new HtmlWebpackPlugin({
        //     // 模板地址
        //     template: './src/pages/index/index.html',
        //     chunks: ['index'],
        //     // 页面标题
        //     title: 'myhtml',
        //     // 输出文件名
        //     filename: 'index.html',
        //     miniify: {
        //         //清理注释
        //         removeComments: true,
        //         // 清除空格
        //         collapseWhitespace: true
        //     }
        // }),
        // 热更新插件
        new Webpack.HotModuleReplacementPlugin()
    ],
    // 配置 webpack-dev-server
    devServer: {
        // 端口号
        port: '8080',
        // 打包文件位置
        contentBase: 'dist',
        // 开启热加载
        hot: true,
        proxy: {
            '/api': {
                target: 'http://shequ.ztworks.cn',
                changeOrigin: true
            }
        }
    },
    // 模式
    mode: 'development'   
}

function getEntries(globPath) {
    var files = glob.sync(globPath),
      entries = {};

    files.forEach(function(filepath) {
        // 取倒数第二层(view下面的文件夹)做包名
        var split = filepath.split('/');
        var name = split[split.length - 2];

        entries[name] = './' + filepath;
    });

    return entries;
}
       
var entries = getEntries('src/pages/**/index.js');

Object.keys(entries).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];
    
    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './src/pages/' + name + '/template.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name],
        miniify: {
            //清理注释
            removeComments: true,
            // 清除空格
            collapseWhitespace: true
        }
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;