var webpack = require("webpack");
var languages = [
	"fr-fr",
	"en-us"
];

module.exports = languages.map(function(language) {
	return {
		name: language,
		context: __dirname + "/www/js",
		entry: "./index.js",
		output: {
			path: __dirname + "/www/js/build",
			filename: "./bundle_" + language + ".js"
		},
		module: {
			loaders: [
				{ test: /\.css$/, loader: "style!css" },
				{ test: /\.less/, loader: "style!css!less" },
				{ test: /\.json/, loader: "json-loader" }
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				"LANGUAGE": JSON.stringify(language)
			})
		]
	}
});