const { join } = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => ({
    mode: process.env.NODE_ENV,
    devtool: (argv.mode === 'development') ? 'inline-source-map' : undefined,
    entry: {
        contentScript: join(__dirname, 'src/contentScript.ts'),
        contentScriptStart: join(__dirname, 'src/contentScriptStart.ts'),
        background: join(__dirname, 'src/background.ts'),
        injectable: join(__dirname, 'src/injectable.ts'),
        popup: join(__dirname, 'src/popup.ts'),
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // {
            //     test: /\.scss$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            // },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "static", to: "." },
            ],
        }),
    ],
});