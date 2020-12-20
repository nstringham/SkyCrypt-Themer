const { join } = require('path');
module.exports = {
    mode: process.env.NODE_ENV,
    devtool: 'inline-source-map',
    entry: {
        contentScript: join(__dirname, 'src/contentScript.ts'),
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
};