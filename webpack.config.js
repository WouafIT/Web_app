const merge = require('webpack-merge');
const webpack = require("webpack");
const languages = {
	//"en-us": './languages/en-us.json',
	"fr-fr": './languages/fr-fr.json'
};
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;
const timestamp = Math.floor(Date.now() / 1000);
const GOOGLE_API = 'AIzaSyCXCe5iWx-lVBv89H0teRMFjy8s24TMOiQ';
const API_KEY_DEV = 'deve0f2d-5c24-4e36-8d1c-bfe9701fcdev';
const API_KEY_PROD = 'dece0f2d-5c24-4e36-8d1c-bfe9701fc526';

var common = Object.keys(languages).map(function(language) {
	var htmlData = {
		googleApi: GOOGLE_API,
		language: language,
		timestamp: timestamp,
		year: (new Date()).getFullYear()
	};
	var phpData = {
		"API_KEY": 	process.env.NODE_ENV === 'dev'
						? API_KEY_DEV
						: API_KEY_PROD
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
				"API_KEY": 		process.env.NODE_ENV === 'dev'
					? JSON.stringify(API_KEY_DEV)
					: JSON.stringify(API_KEY_PROD),
				"LANGUAGE": 	JSON.stringify(language),
				"BUILD_VERSION":JSON.stringify(timestamp),
				__DEV__: 		JSON.stringify(JSON.parse(process.env.NODE_ENV === 'dev'))
			}),
			new HtmlWebpackPlugin({
				filename: 'index.php',
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
			new HtmlWebpackPlugin({
				filename: 'php/index.php',
				template: __dirname + '/src/php/index.php',
				data: phpData,
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
common.push({
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

if(TARGET === 'start') {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			contentBase: __dirname + '/build/www-fr-fr',

			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',

			host: '0.0.0.0',
			port: 8080
		}
	});
} else {
	module.exports = common;
}