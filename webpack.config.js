var webpack = require("webpack");
var languages = {
	"fr-fr": require('./languages/fr-fr.json'),
	"en-us": require('./languages/en-us.json')
};
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = Object.keys(languages).map(function(language) {
	return {
		name: language,
		context: __dirname + "/src/js",
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
			}),
			new HtmlWebpackPlugin({
				filename: 'index-' + language + '.html',
				template: 'src/html/index.html',
				data: {
					googleApi: 'AIzaSyCXCe5iWx-lVBv89H0teRMFjy8s24TMOiQ',
					language: language,
					time: Math.floor(Date.now() / 1000)
				},
				i18n: languages[language]
			})
		],
		externals: {
			// require("jquery") is external and available
			//  on the global var jQuery
			"jquery": "jQuery"
		}
	}
});