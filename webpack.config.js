var webpack = require("webpack");
var languages = {
	"fr-fr": './languages/fr-fr.json',
	"en-us": './languages/en-us.json'
};
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var timestamp = Math.floor(Date.now() / 1000);

var websites = Object.keys(languages).map(function(language) {
	var htmlData = {
		googleApi: 'AIzaSyCXCe5iWx-lVBv89H0teRMFjy8s24TMOiQ',
		language: language,
		timestamp: timestamp,
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
				{ test: /\.html/, 						loader: "html" },
				{ test: /\.css$/, 						loader: "style!css" },
				{ test: /\.less/, 						loader: "style!css!less" },
				{ test: /\.json/, 						loader: "json" },
				{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&name=/[path][name]-[hash:6].[ext]&mimetype=application/font-woff" },
				{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&name=/[path][name]-[hash:6].[ext]&mimetype=application/octet-stream" },
				{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,   loader: "file?name=/[path][name]-[hash:6].[ext]" },
				{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&name=/[path][name]-[hash:6].[ext]&mimetype=image/svg+xml" },
				{ test: /\.png$/, 						loader: 'url?mimetype=image/png&limit=8192&name=[path][name]-[hash:6].[ext]' },
				{ test: /\.jpg$/, 						loader: 'url?mimetype=image/jpeg&limit=8192&name=[path][name]-[hash:6].[ext]' },
				{ test: /\.gif$/, 						loader: 'url?mimetype=image/gif&limit=8192&name=[path][name]-[hash:6].[ext]' }
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				"DEV_URL": 		JSON.stringify('http://wouafit.local'),
				"PROD_URL": 	JSON.stringify('https://wouaf.it'),
				"API_ENDPOINT": JSON.stringify('https://api.wouaf.it'),
				"API_KEY_PROD": JSON.stringify('dece0f2d-5c24-4e36-8d1c-bfe9701fc526'),
				"API_KEY_DEV": 	JSON.stringify('deve0f2d-5c24-4e36-8d1c-bfe9701fcdev'),
				"LANGUAGE": 	JSON.stringify(language),
				"BUILD_VERSION":JSON.stringify(timestamp),
				__DEV__: 		JSON.stringify(JSON.parse(process.env.NODE_ENV === 'dev'))
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: __dirname + '/src/html/index.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/index.html',
				template: __dirname + '/src/html/parts/index.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/about.html',
				template: __dirname + '/languages/parts/'+language+'/about.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
                filename: 'parts/login.html',
                template: __dirname + '/src/html/parts/login.tpl',
                data: htmlData,
                i18n: languageData,
				inject: false
            }),
			new HtmlWebpackPlugin({
				filename: 'parts/parameters.html',
				template: __dirname + '/src/html/parts/parameters.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/contact.html',
				template: __dirname + '/src/html/parts/contact.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/create-account.html',
				template: __dirname + '/src/html/parts/create-account.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/profile.html',
				template: __dirname + '/src/html/parts/profile.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/lost-password.html',
				template: __dirname + '/src/html/parts/lost-password.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/add.html',
				template: __dirname + '/src/html/parts/add.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/comments.html',
				template: __dirname + '/src/html/parts/comments.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/activation.html',
				template: __dirname + '/src/html/parts/activation.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/user.html',
				template: __dirname + '/src/html/parts/user.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new CopyWebpackPlugin([
				{
					from: '../assets-local'
				}
			])
		],
		externals: {
			// require("jquery") is external and available
			//  on the global var jQuery
			"jquery": "jQuery",
			"i18next": "i18next",
			"dropzone": "dropzone"
		}
	}
});
websites.push({
	  name: 'www',
	  context: __dirname + '/src/js',
	  entry: './null.js',
	  output: {
		  path: __dirname + '/build/www/',
		  filename: './js/null.js'
	  },
	  plugins: [
		  new CopyWebpackPlugin([
				{
					from: '../assets-root'
				}
			]),
		  (process.env.NODE_ENV === 'dev' ?
			  new CopyWebpackPlugin([
			  {
				  from: '../assets-dev'
			  }
		  ]) :  new CopyWebpackPlugin([
			  {
				  from: '../assets-prod'
			  }
		  ]))
	  ]
});

module.exports = websites;
