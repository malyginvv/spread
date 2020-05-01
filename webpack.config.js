const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/js/app.js",
    output: {
        path: path.resolve(__dirname, "js"),
        filename: "app.min.js"
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
    target: "web"
};