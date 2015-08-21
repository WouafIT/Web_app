module.exports = {
	context: __dirname + "/www/js",
	entry: "./index.js",
	output: {
		path: __dirname + "/www/js/build",
		filename: "./bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.less/, loader: "style!css!less" }
		]
	}
};