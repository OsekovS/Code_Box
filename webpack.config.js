//vars;
const path = require('path');
const webpack = require('webpack');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const UglifyJSPackPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebPackPlugin=require("copy-webpack-plugin");

var isProduction = (process.env.NODE_ENV === 'production');
//plugins

//module settings
module.exports = {
    mode: 'none',
  
        //базовый путь
    context: path.resolve(__dirname,'src'),
        //точка входа
    entry: {
        //основной файл приложения
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },
        //выходные файлы
        output: {
        filename: 'js/[name].js', 
        path: path.resolve(__dirname,'dist'),
        publicPath: '../'
        },
        devServer: {
            contentBase: './app'
          },
        devtool: (isProduction)? '' : 'inline-source-map',  
        module:{
            rules: [
                {
                     test:/\.scss$/,
                    use: ExtractTextPlugin.extract({
                          use: [
                              {
                                  loader: 'css-loader',
                                  options: { sourceMap: true}
                              },
                              {
                                loader: 'postcss-loader',
                                options: { sourceMap: true}
                            },
                              {
                                loader: 'sass-loader',
                                options: { sourceMap: true}
                            },
                          ],
                          fallback: 'style-loader',
                      })
                  },
                  {
                    test: /\.(png|gif|jpe?g)$/,
                    loaders: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                        'img-loader',
                            ]
                  },
           
          //fonts
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                }
            ]
          },
//svg-coonverter
          {
            test:/\.svg$/,
            loader: 'svg-url-loader',
          },
        ],
    },
          plugins: [
            new ExtractTextPlugin(
                './css/[name].css'
            ),
            new webpack.ProvidePlugin({
                $:'jquery',
                jQuery: 'jquery',
                jquery: 'jpuery',
                Popper: ['popper.js','default']
            }),
            new CleanWebPackPlugin(),//['dist']
            new CopyWebPackPlugin(
                [
                    {from: './img', to: 'img'}
                ],
                {
                    ignore:[
                        {glob:'svg/*'},//чтобы файл не трогался и все его содержимое
                    ]
                }
            )
          ],
}
if (isProduction){
    module.exports.plugins.push(
        new UglifyJSPackPlugin({
        sourceMap:true
        }),
    );
    module.exports.plugins.push(
        new ImageminPlugin({
        test: /\.(png|jpe?g|gif|svg)$/
        }),
    )
    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
        minimize: true
        }),
    );
                }