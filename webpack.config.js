const path = require("path");

module.exports = {
  entry: "./app/Main.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "app"),
    filename: "bundled.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "app"),
    },
    hot: true,
    historyApiFallback: { index: "index.html" },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              ["@babel/preset-env", { targets: { node: "12" } }],
            ],
          },
        },
      },
    ],
  },
};

// const path = require("path");

// console.log(path.resolve(__dirname, "app"));

// module.exports = {
//   entry: "./app/main.js",
//   output: {
//     path: path.resolve(__dirname, "app"),
//     publicPath: "/",
//     filename: "bundled.js",
//   },
//   mode: "development",
//   devServer: {
//     port: 3000,
//     static: {
//       directory: path.join(__dirname, "app"),
//     },
//     hot: true,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /(node_modules)/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: [
//               "@babel/preset-react",
//               [
//                 "@babel/preset-env",
//                 {
//                   targets: {
//                     node: "12",
//                   },
//                 },
//               ],
//             ],
//           },
//         },
//       },
//     ],
//   },
// };
