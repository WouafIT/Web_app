module.exports = {
	context: __dirname + "/js",
	entry: "./index.js",
	output: {
		path: __dirname + "/js",
		filename: "./bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.less/, loader: "style!css!less" }
		]
	}
};