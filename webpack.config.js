const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/js/app.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "js/app.min.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin([{from: "src/", test: /^.+\.(css|html)$/}], {ignore: ["*.js"]}),
    ],
    target: "web"
};