var webpack = require("webpack");
var languages = [
	"fr-fr",
	"en-us"
];

module.exports = languages.map(function(language) {
	return {
		name: language,
		context: __dirname + "/app/js",
		entry: "./index.js",
		output: {
			path: __dirname + "/www/",
			filename: "./js/build-" + language + ".js"
		},
		module: {
			loaders: [
				{ test: /\.css$/, 						loader: "style!css!postcss" },
				{ test: /\.less/, 						loader: "style!css!postcss!less" },
				{ test: /\.json/, 						loader: "json" },
				{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&name=[path][name]-[hash:6].[ext]&mimetype=application/font-woff" },
				{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&name=[path][name]-[hash:6].[ext]&mimetype=application/octet-stream" },
				{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,   loader: "file?name=[path][name]-[hash:6].[ext]" },
				{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&name=[path][name]-[hash:6].[ext]&mimetype=image/svg+xml" },
				{ test: /\.(png|jpg|gif)$/, 			loader: 'file?name=[path][name]-[hash:6].[ext]' }
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				"LANGUAGE": JSON.stringify(language)
			})
		]
	}
});