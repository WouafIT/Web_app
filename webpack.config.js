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
				{ test: /\.css$/, loader: "style!css" },
				{ test: /\.less/, loader: "style!css!less" },
				{ test: /\.json/, loader: "json" },
				{
					test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
					loader: 'file?prefix=js/&name=[path][name]-[hash:6].[ext]'
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				"LANGUAGE": JSON.stringify(language)
			})
		]
	}
});