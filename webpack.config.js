var webpack = require("webpack");
var languages = {
	"fr-fr": './languages/fr-fr.json',
	"en-us": './languages/en-us.json'
};
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = Object.keys(languages).map(function(language) {
	var htmlData = {
		googleApi: 'AIzaSyCXCe5iWx-lVBv89H0teRMFjy8s24TMOiQ',
		language: language,
		timestamp: Math.floor(Date.now() / 1000),
		year: (new Date()).getFullYear()
	};
	var languageData = require(languages[language]);
	return {
		name: language,
		context: __dirname + '/src/js',
		entry: './index.js',
		output: {
			path: __dirname + '/build/www-' + language + '/',
			filename: './js/build.js'
		},
		module: {
			loaders: [
				{ test: /\.css$/, 						loader: "style!css" },
				{ test: /\.less/, 						loader: "style!css!less" },
				{ test: /\.json/, 						loader: "json" },
				{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&name=[path][name]-[hash:6].[ext]&mimetype=application/font-woff" },
				{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&name=[path][name]-[hash:6].[ext]&mimetype=application/octet-stream" },
				{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,   loader: "file?name=[path][name]-[hash:6].[ext]" },
				{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&name=[path][name]-[hash:6].[ext]&mimetype=image/svg+xml" },
				{ test: /\.png$/, 						loader: 'url?mimetype=image/png&limit=8192&name=[path][name]-[hash:6].[ext]' },
				{ test: /\.jpg$/, 						loader: 'url?mimetype=image/jpeg&limit=8192&name=[path][name]-[hash:6].[ext]' },
				{ test: /\.gif$/, 						loader: 'url?mimetype=image/gif&limit=8192&name=[path][name]-[hash:6].[ext]' }
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				"API_ENDPOINT": JSON.stringify('https://api.wouaf.it'),
				"API_KEY_PROD": JSON.stringify('dece0f2d-5c24-4e36-8d1c-bfe9701fc526'),
				"API_KEY_DEV": 	JSON.stringify('deve0f2d-5c24-4e36-8d1c-bfe9701fcdev'),
				"LANGUAGE": 	JSON.stringify(language),
				__DEV__: 		JSON.stringify(JSON.parse(process.env.NODE_ENV === 'dev'))
			}),
			new HtmlWebpackPlugin({
									  filename: 'index.html',
									  template: 'src/html/index.tpl',
									  data: htmlData,
									  i18n: languageData
								  }),
            new HtmlWebpackPlugin({
                filename: 'parts/about.html',
                template: './languages/parts/'+language+'/about.tpl',
                data: htmlData,
                i18n: languageData
            }),
            new HtmlWebpackPlugin({
                filename: 'parts/login.html',
                template: 'src/html/parts/login.tpl',
                data: htmlData,
                i18n: languageData
            }),
			new HtmlWebpackPlugin({
				filename: 'parts/parameters.html',
				template: 'src/html/parts/parameters.tpl',
				data: htmlData,
				i18n: languageData
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/create-account.html',
				template: 'src/html/parts/create-account.tpl',
				data: htmlData,
				i18n: languageData
			}),
			new CopyWebpackPlugin([
				{
					from: '../assets'
				}
			])
		],
		externals: {
			// require("jquery") is external and available
			//  on the global var jQuery
			"jquery": "jQuery"
		}
	}
});