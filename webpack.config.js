const merge 			= require('webpack-merge');
const webpack 			= require("webpack");
const HtmlWebpackPlugin	= require('html-webpack-plugin');
const CopyWebpackPlugin	= require('copy-webpack-plugin');

const TARGET 			= process.env.npm_lifecycle_event;
const TIMESTAMP 		= Math.floor(Date.now() / 1000);
const DEV_DOMAIN 		= 'wouafit.local'; //must be accessible via https
const PROD_DOMAIN 		= 'wouaf.it';
const API_DOMAIN 		= 'api.wouaf.it';
const IMG_DOMAIN 		= 'img.wouaf.it';
const IS_DEV 			= process.env.NODE_ENV === 'dev';

var config = require('./config/config.json');
const GOOGLE_API 		= config.google_api;
const GOOGLE_ANALYTICS	= config.google_analytics;
const API_KEY_DEV 		= config.api_key_dev;
const API_KEY_PROD 		= config.api_key_prod;
const FACEBOOK_APP_KEY	= config.facebook_app_key;

var languages;
if (process.env.LANG_ENV === 'fr') {
	languages = {
		"fr-fr": './languages/fr-fr.json'
	};
} else if (process.env.LANG_ENV === 'en') {
	languages = {
		"en-us": './languages/en-us.json'
	};
} else {
	languages = {
		"en-us": './languages/en-us.json',
		"fr-fr": './languages/fr-fr.json'
	};
}

var common = Object.keys(languages).map(function(language) {
	var htmlData = {
		cookieDomain:	(IS_DEV ? DEV_DOMAIN : PROD_DOMAIN),
		imgDomain: 		IMG_DOMAIN,
		googleApi: 		GOOGLE_API,
		googleAnalytics: GOOGLE_ANALYTICS,
		language: 		language,
		timestamp: 		TIMESTAMP,
		year: 			(new Date()).getFullYear(),
		devTitle:		(IS_DEV ? ' (DEV)' : '')
	};
	var phpData = {
		domain: 		(IS_DEV ? DEV_DOMAIN : PROD_DOMAIN),
		timestamp: 		TIMESTAMP,
		imgDomain: 		IMG_DOMAIN,
		apiDomain: 		API_DOMAIN,
		apiKey: 		IS_DEV ? API_KEY_DEV : API_KEY_PROD,
		isDev:			IS_DEV,
		facebookAppId:	FACEBOOK_APP_KEY
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
				"DEV_URL": 			JSON.stringify('https://'+ DEV_DOMAIN),
				"PROD_URL": 		JSON.stringify('https://'+ PROD_DOMAIN),
				"API_ENDPOINT": 	JSON.stringify('https://'+ API_DOMAIN),
				"API_KEY": 			IS_DEV ? JSON.stringify(API_KEY_DEV) : JSON.stringify(API_KEY_PROD),
				"FACEBOOK_APP_KEY": JSON.stringify(FACEBOOK_APP_KEY),
				"LANGUAGE": 		JSON.stringify(language),
				"BUILD_VERSION":	JSON.stringify(TIMESTAMP),
				__DEV__: 			JSON.stringify(JSON.parse(IS_DEV))
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
				filename: 'parts/faq.html',
				template: __dirname + '/languages/parts/'+language+'/faq.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: '404.html',
				template: __dirname + '/languages/parts/'+language+'/404.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/facebook-events.html',
				template: __dirname + '/languages/parts/'+language+'/facebook-events.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: 'parts/tos.html',
				template: __dirname + '/languages/parts/'+language+'/tos.tpl',
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
				filename: 'parts/create-profile.html',
				template: __dirname + '/src/html/parts/create-profile.tpl',
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
				filename: 'parts/edit-username.html',
				template: __dirname + '/src/html/parts/edit-username.tpl',
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
				filename: 'parts/calendar.html',
				template: __dirname + '/src/html/parts/calendar.tpl',
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
				filename: 'parts/reset-password.html',
				template: __dirname + '/src/html/parts/reset-password.tpl',
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
			"FB": "FB",
			"jquery": "jQuery",
			"i18next": "i18next",
			"dropzone": "dropzone"
		}
	}
});
if (process.env.LANG_ENV === 'all') {
	var language = 'en-us';
	var htmlData = {
		cookieDomain:	(IS_DEV ? DEV_DOMAIN : PROD_DOMAIN),
		googleApi: 		GOOGLE_API,
		googleAnalytics: GOOGLE_ANALYTICS,
		language: 		language,
		timestamp: 		TIMESTAMP,
		year: 			(new Date()).getFullYear(),
		devTitle:		(IS_DEV ? ' (DEV)' : '')
	};
	var languageData = require(languages[language]);
	var www = {
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
			new HtmlWebpackPlugin({
				filename: '404.html',
				template: __dirname + '/languages/parts/en-us/404.tpl',
				data: htmlData,
				i18n: languageData,
				inject: false
			}),
			(IS_DEV ?
				new CopyWebpackPlugin([
					{
						from: '../assets-dev'
					}
				]) : new CopyWebpackPlugin([
				{
					from: '../assets-prod'
				}
			]))
		]
	};
	if (IS_DEV) {
		//generate apache vhosts for dev
		www.plugins.push(
			new HtmlWebpackPlugin({
				filename: '../../vhosts.conf',
				template: __dirname + '/src/vhosts-dev.conf',
				data: {
					"path": __dirname
				},
				inject: false
			})
		);
	}
	common.push(www);
}
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