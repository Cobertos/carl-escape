module.exports =  {
    mode : "development",
    //entry : , //handled by gulp
    output : {
        //path : //handled by gulp
        filename : "[name].js",
        library : "partyPerson",
        libraryTarget : "umd"
    },
    module : {
        rules : [{
            test : /\.html$/,
            loader : "html-loader"
        }, {
            test : /\.(js|json)$/,
            exclude : /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            "targets": {
                                "browsers": [
                                    "last 2 versions",
                                    "IE >= 11"
                                ]
                            }
                        }],
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime', {
                            "regenerator": true,
                        }]
                    ],
                    cacheDirectory : true
                }
            }]
        }]
    },
    devtool: "source-map"
};