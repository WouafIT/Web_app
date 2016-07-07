module.exports = (function() {
	var $document = $(document);
	var data = require('./data.js');
	var utils = require('../utils.js');
	var loader = require('./loader.js');
	var xhr;
	//Google geocode usage limits : https://developers.google.com/maps/articles/geocodestrat#client
	//==> illimited from client (browser) requests
	//var GOOGLE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=';
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
	//if needed someday : http://ws.geonames.org/search?q=toulouse&maxRows=5&style=LONG
	//or http://api.geonames.org/postalCodeSearch
	// Better ====>>> http://open.mapquestapi.com/geocoding/v1/address?location=Toulouse&callback=renderGeocode
	//doc : http://open.mapquestapi.com/geocoding/
	
	//OSM Static maps Images : http://wiki.openstreetmap.org/wiki/Static_map_images
	//see http://wiki.openstreetmap.org/wiki/StaticMap
	// http://ojw.dev.openstreetmap.org/StaticMap/ => PHP code : https://trac.openstreetmap.org/browser/sites/other/StaticMap
	// Better ====>>> http://open.mapquestapi.com/staticmap/
	
	var connectionError = function() {
		var toast = require('./toast.js');
		var i18n = require('./i18n.js');
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
					if (result && result.result && result.result == 1) {
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
					} else {
						params.connectionError();
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
	/*var geocode = function(address, callback) {
		$.ajax({
			url: GOOGLE_BASE_URL + address,
			type: 'GET',
			data: data,
			done: function(json) {
				if (json.status != 'OK' || !json.results[0]) {
					callback(false);
					return;
				}
				var longitudeDelta = 0.04;
				var latitudeDelta = 0.04;
				if (json.results[0].geometry && json.results[0].geometry.viewport) {
					latitudeDelta = (json.results[0].geometry.viewport.northeast.lat - json.results[0].geometry.viewport.southwest.lat) / 2;
					longitudeDelta = (json.results[0].geometry.viewport.northeast.lng - json.results[0].geometry.viewport.southwest.lng) / 2;
					latitudeDelta = Math.round((latitudeDelta) * 1000000) / 1000000;
					longitudeDelta = Math.round((longitudeDelta) * 1000000) / 1000000;
				}
				callback(new utils.LatLng(
					json.results[0].geometry.location.lat,
					json.results[0].geometry.location.lng
				), latitudeDelta, longitudeDelta);
			},
			fail: function() {
				connectionError();
				callback(false);
			}
		});
	};*/
	var self = {
		connectionError: connectionError,
		posts: function posts(params, successCallback, errorCallback) {
			var searchId = params.searchId;
			var q = '';
			for (var i in params) {
				if (params.hasOwnProperty(i)) {
					var param = params[i];
					if (i == 'type' || i == 'searchId' || i == 'refresh' || !param) { //remove event or empty params
						continue;
					}
					if (i == 'loc') {
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
			/*
			if (Ti.Platform.osname != 'mobileweb' && data.getString('eventfulKey') && !!data.getBool('eventfulSearch')) {
				//duplicate search on eventful	
				var q = 'app_key='+ data.getString('eventfulKey') +'&units=km&page_size=100&mature=normal&include=categories&sort_order=popularity';
				if (!params.date) {
					params.date = new Date();
				}
				if (!params.duration) {
					params.duration = 86400;
				}
				for (var i in params) {
					var param = params[i];
					if (i == 'type' || i == 'searchId' || i == 'source' || i == 'tag' || i == 'cat' || !param) { //remove event or empty params
						continue;
					}
					if (i == 'date') {
						//start
						var year = param.getFullYear();
						var month = param.getMonth() + 1;
						month = month < 10 ? '0' + month : month;
						var day = param.getDate();
						day = day < 10 ? '0' + day : day;
						//end
						var endDate = new Date();
						endDate.setTime(param.getTime() + ((params.duration - 86400) * 1000));
						var endYear = endDate.getFullYear();
						var endMonth = endDate.getMonth() + 1;
						endMonth = endMonth < 10 ? '0' + endMonth : endMonth;
						var endDay = endDate.getDate();
						endDay = endDay < 10 ? '0' + endDay : endDay;
						
						q += '&date=' + year + month + day + '00-' + endYear + endMonth + endDay + '00';
					} else if (i == 'loc') {
						q += '&location=' + param;
					} else if (i == 'radius') {
						q += '&within=' + param;
					}
				}
				console.info(utils.EVENTFUL_API_URL + '/events/search?' + q);
				query({
					method: 'GET',
					url: 	utils.EVENTFUL_API_URL + '/events/search?' + q,
					data:	null,
					success:function(results) {
						var datas = {
							'count': 0,
							'results': [],
							'searchId': searchId,
							'resultsType': 'eventful'
						};
						if (results && results.events && results.events.event) {
							console.info('eventful ok : '+results.events.event.length);
							//reformat datas
							datas.count = results.events.event.length;
							for (var i = 0, l = datas.count; i < l; i++) {
								var result = results.events.event[i];
								var data = {
									'id': result.id,
									'loc': [result.latitude, result.longitude],
									'cat': '',
									'text': result.title,
									'date': [],
									'pics': [],
									'tags': [],
									'author': ['eventful', (result.owner == 'evdb' ? 'Eventful.com' : result.owner)],
									'url': result.url
								};
								//text
								var len = data.text.length;
								if (result.description && len < 200) {
									var desc = utils.strip_tags(result.description.replace(/<br\s*\/?>/mg, "\n").replace(/\&#39;/g, "'").replace(/\&quot;/g, '"'));
									if (desc.length + len > 300) {
										data.text += '\n'+ desc.substr(0, (296 - len)) + ' ...';
									} else {
										data.text += '\n'+ desc;
									}
								}
								//categories
								if (result.categories && result.categories.category && result.categories.category.length) {
									for (var j = 0, lc = result.categories.category.length; j < lc; j++) {
										data.cat += data.cat ? ' / ' : '';
										data.cat += L(result.categories.category[j].id);
									}
								} else if (result.categories && result.categories.category && result.categories.category.id) {
									data.cat = L(result.categories.category.id);
								}
								//pics
								if (result.image && result.image.medium) {
									data.pics.push({'p': result.image.medium.url});
								}
								//timestamp
								var date = new Date();
								if (result.created) {
									date.setFullYear(result.created.substr(0,4));
									date.setMonth(result.created.substr(5,2) - 1);
									date.setDate(result.created.substr(8,2));
									date.setHours(result.created.substr(11,2));
									date.setMinutes(result.created.substr(14,2));
									date.setSeconds(result.created.substr(17,2));
								}
								data.ts = {'sec': Math.round(date.getTime() / 1000), 'usec': 0};
								//date start and stop
								var date = new Date();
								if (result.start_time) {
									date.setFullYear(result.start_time.substr(0,4));
									date.setMonth(result.start_time.substr(5,2) - 1);
									date.setDate(result.start_time.substr(8,2));
									date.setHours(result.start_time.substr(11,2));
									date.setMinutes(result.start_time.substr(14,2));
									date.setSeconds(result.start_time.substr(17,2));
								}
								data.date.push({'sec': Math.round(date.getTime() / 1000), 'usec': 0});
								if (result.stop_time) {
									var date = new Date();
									date.setFullYear(result.stop_time.substr(0,4));
									date.setMonth(result.stop_time.substr(5,2) - 1);
									date.setDate(result.stop_time.substr(8,2));
									date.setHours(result.stop_time.substr(11,2));
									date.setMinutes(result.stop_time.substr(14,2));
									date.setSeconds(result.stop_time.substr(17,2));
									data.date.push({'sec': Math.round(date.getTime() / 1000), 'usec': 0});
								} else {
									data.date.push({'sec': Math.round(date.getTime() / 1000) + 86400, 'usec': 0}); //one day
								}
								datas.results.push(data);
							}
						}
						callback(datas);
					},
					error:	function() {
						//empty function to avoid double connection error alert
						console.info('eventful error');
						console.info(JSON.stringify(arguments));
					}
				});
			}*/
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
					locale:	 LANGUAGE
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
					login:	  datas.login,
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
		/*fblogin: function fblogin(datas, success, error) {
			datas.did = 'web_app_'+ utils.md5(navigator.userAgent);
			query({
				method: 'POST',
				url:	ENDPOINT + '/user/fblogin/',
				data:  datas,
				success:success,
				error:  error
			});
		},*/
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
		suscribeWouaf: function suscribeWouaf(id, suscribe, successCallback, errorCallback) {
			query({
				method: 'PUT',
				url:	ENDPOINT + '/wouafs/'+ id +'/suscribe',
				data:  {
					suscribe: suscribe
				},
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
	return self;
})();