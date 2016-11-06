var data = require('./data.js');
var utils = require('../utils.js');
var loader = require('./loader.js');
var toast = require('./toast.js');
var i18n = require('./i18n.js');

module.exports = (function() {
	var $document = $(document);
	var xhr;
	var ENDPOINT 		= API_ENDPOINT;
	$document.ajaxStart(function() {
		if (__DEV__) {
			console.info('Ajax start');
		}
		loader.show(0);
	}).ajaxStop(function() {
		if (__DEV__) {
			console.info('Ajax stop');
		}
		loader.hide();
	});
	var connectionError = function() {
		toast.show(i18n.t('Connexion error. Are you connected to the Internet? Please try again later'), 5000);
	};
	var query = function (params) {
		for (var i in params.data) {
			if (params.data.hasOwnProperty(i)) {
				if (params.data[i] === null) {
					delete params.data[i];
				}
			}
		}
		var start = new Date().getTime();
		var caller = arguments.callee.caller.name;
		var xhr_params = {
			url: params.url,
			type: params.method,
			data: params.data,
			dataType: 'json',
			timeout: 10000,
			cache: true,
			success: function(result) {
				if (params.success) {
					params.success.apply(this, [result]);
				} else {
					if (result && result.result && result.result === 1) {
						params.successCallback(result);
					} else if (result && result.msg) {
						params.errorCallback(result.msg);
					} else {
						params.connectionError();
					}
				}
			},
			headers: {'Authorization': utils.getAuthorization()},
			error: function(xhr) {
				if (__DEV__) {
					console.error('Query error', params, xhr);
				}
				if (params.error) {
					params.error.apply(this, [xhr.responseJSON]);
				} else {
					var result = xhr.responseJSON;
					if (result && result.msg) {
						params.errorCallback(result.msg);
					} else if (params.connectionError) {
						params.connectionError();
					} else {
						toast.show(i18n.t('Error_details {{status}} {{error}}', { 'status': xhr.status ? xhr.status : 'Status: Server error', 'error': xhr.statusText ? xhr.statusText : '' }), 5000);
					}
				}
			},
			complete: function() {
				$document.triggerHandler('app.query', {time: (new Date().getTime() - start), caller: caller});
			}
		};
		if (__DEV__) {
			console.info('New query', xhr_params);
		}
		xhr = $.ajax(xhr_params);
	};
	return {
		connectionError: connectionError,
		posts: function posts(params, successCallback, errorCallback) {
			var searchId = params.searchId;
			var q = '';
			for (var i in params) {
				if (params.hasOwnProperty(i)) {
					var param = params[i];
					if (i === 'type' || i === 'searchId' || i === 'refresh' || !param) { //remove event or empty params
						continue;
					}
					if (i === 'loc') {
						//precision => http://gis.stackexchange.com/questions/8650/how-to-measure-the-accuracy-of-latitude-and-longitude
						param = params[i].toUrlValue(2); //~1.1km
					}
					q += (q ? '&' : '?') + i + '=' + param;
				}
			}
			query({
				method: 'GET',
				url: 	ENDPOINT + '/wouafs' + q,
				data:	null,
				success:function (result) {
					if (result && result.results) {
						result.searchId = searchId;
						result.resultsType = 'wouafit';
						successCallback(result, params);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		post: function post(id, successCallback, errorCallback) {
			query({
				method: 'GET',
				url: 	ENDPOINT + '/wouafs/' + id,
				data:	null,
				success:function (result) {
					if (result && result.wouaf) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		init: function init(callback) {
			query({
				method: 'POST',
				url: 	ENDPOINT + '/init',
				data:	{
					locale:	 	LANGUAGE,
					geolocate:	(data.getBool('geolocation') ? 0 : 1)
				},
				success:callback,
				error:	callback
			});
		},
		login: function login(datas, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/login',
				data:  {
					login:	  	datas.login,
					pass:		datas.pass,
					did:		'web_app_'+ utils.md5(navigator.userAgent)
				},
				success:function (result) {
					if (result && result.user) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						errorCallback()
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		fblogin: function fblogin(data, successCallback, errorCallback) {
			data.did = 'web_app_'+ utils.md5(navigator.userAgent);
			query({
				method: 'POST',
				url:	ENDPOINT + '/fblogin',
				data:  	data,
				success:function (result) {
					if (result && result.user) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						errorCallback()
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		logout: function logout(callback) {
			query({
				method: 'POST',
				url: 	ENDPOINT + '/logout',
				success:callback,
				error:	callback
			});
		},
		resetPassword: function resetPassword(email, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/reset-password',
				data:  {
					email:	  email
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		createUser: function createUser(datas, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/users',
				data:	datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		getUser: function getUser(user, successCallback, errorCallback) {
			query({
				method: 'GET',
				url:	ENDPOINT + '/users/' + user,
				success:function (result) {
					if (result && result.user) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		updateUser: function updateUser(datas, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/users/'+ data.getString('uid'),
				data:	datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		deleteUser: function deleteUser(callback) {
			query({
				method: 'DELETE',
				url:	ENDPOINT + '/users/'+ data.getString('uid'),
				success:callback,
				error:  callback
			});
		},
		activateUser: function activateUser(datas, successCallback, errorCallback) {
			query({
				method: 'POST',
				url: 	ENDPOINT + '/user-activation',
				data:	datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		userPosts: function userPosts(uid, successCallback, errorCallback) {
			query({
				method: 'GET',
				url:	ENDPOINT + '/users/'+ uid +'/wouafs',
				success:function (result) {
					if (result && result.results) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		userFavorites: function userFavorites(successCallback, errorCallback) {
			query({
				method: 'GET',
				url:	ENDPOINT + '/users/'+ data.getString('uid') +'/favorites',
				success:function (result) {
					if (result && result.results) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		requestFbImport: function requestFbPagesImport(datas, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/users/'+ data.getString('uid') +'/fb-import',
				data:	datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		requestFbPagesImport: function requestFbPagesImport(datas, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/users/'+ data.getString('uid') +'/fb-pages-import',
				data:	datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		createPost: function createPost(datas, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/wouafs',
				data:	datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		addFavorite: function addFavorite(id, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/users/'+ data.getString('uid') +'/favorites',
				data:	{
					id: id
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		removeFavorite: function removeFavorite(id, successCallback, errorCallback) {
			query({
				method: 'DELETE',
				url: 	ENDPOINT + '/users/'+ data.getString('uid') +'/favorites',
				data:	{
					id: id
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		addInterest: function addInterest(id, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/users/'+ data.getString('uid') +'/interests',
				data:	{
					id: id
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		removeInterest: function removeInterest(id, successCallback, errorCallback) {
			query({
				method: 'DELETE',
				url: 	ENDPOINT + '/users/'+ data.getString('uid') +'/interests',
				data:	{
					id: id
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		getComments: function getComments(id, successCallback, errorCallback) {
			query({
				method: 'GET',
				url:	ENDPOINT + '/wouafs/'+ id +'/comments',
				data:  null,
				success:function (result) {
					if (result && result.comments) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		subscribeWouaf: function subscribeWouaf(id, subscribe, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url:	ENDPOINT + '/wouafs/'+ id +'/subscribe',
				data:  {
					subscribe: subscribe
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		unsubscribeComments: function unsubscribeComments(id, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url:	ENDPOINT + '/wouafs/'+ id +'/comments/unsubscribe',
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		createComment: function createComment(datas, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url:	ENDPOINT + '/wouafs/'+ datas.id +'/comments',
				data:  datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		deleteComment: function deleteComment(id, successCallback, errorCallback) {
			query({
				method: 'DELETE',
				url:	ENDPOINT + '/comments/'+ id,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		contactUser: function contactUser(datas, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/wouafs/'+ datas.id +'/contact',
				data:  datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		contact: function contact(datas, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/contact',
				data:  datas,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		deletePost: function deletePost(id, successCallback, errorCallback) {
			query({
				method: 'DELETE',
				url:	ENDPOINT + '/wouafs/'+ id,
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		reportPost: function reportPost(id, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/wouafs/'+ id +'/abuse',
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		reportComment: function reportComment(id, successCallback, errorCallback) {
			query({
				method: 'POST',
				url:	ENDPOINT + '/comments/'+ id +'/abuse',
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		followUser: function followUser(uid, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url:	ENDPOINT + '/users/'+ data.getString('uid') +'/following',
				data:	{
					uid: uid
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		unfollowUser: function unfollowUser(uid, successCallback, errorCallback) {
			query({
				method: 'DELETE',
				url:	ENDPOINT + '/users/'+ data.getString('uid') +'/following',
				data:	{
					uid: uid
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		userFollowing: function userFollowing(uid, successCallback, errorCallback) {
			query({
				method: 'GET',
				url:	ENDPOINT + '/users/'+ uid +'/following',
				success:function (result) {
					if (result && result.results) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		},
		userFollowers: function userFollowers(uid, successCallback, errorCallback) {
			query({
				method: 'GET',
				url:	ENDPOINT + '/users/'+ uid +'/followers',
				success:function (result) {
					if (result && result.results) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				successCallback: successCallback,
				errorCallback: errorCallback
			});
		}
	};
}());