module.exports = (function() {
	var $document = $(document);
	var data = require('./data.js');
	var utils = require('../utils.js');
	var loader = require('./loader.js');
	var xhr;
	//Google geocode usage limits : https://developers.google.com/maps/articles/geocodestrat#client
	//==> illimited from client (browser) requests
	var GOOGLE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=';
	var ENDPOINT 		= API_ENDPOINT;
	if (__DEV__) {
		var KEY 			= API_KEY_DEV;
	} else {
		var KEY 			= API_KEY_PROD;
	}
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
		var xhr_params = {
			url: params.url,
			type: params.method,
			data: params.data,
			dataType: 'json',
			timeout: 10000,
			cache: false,
			success: params.success,
			error: function(xhr) {
				if (__DEV__) {
					console.error('Query error', params, xhr);
				}
				if (params.error) {
					params.error.apply(this, [xhr.responseJSON]);
				}
			},
			complete: function() {
				//nothing ?
			}
		};
		if (__DEV__) {
			console.info('New query', xhr_params);
		}
		xhr = $.ajax(xhr_params);
	};
	var geocode = function(address, callback) {
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
	};
	var self = {
		connectionError: connectionError,
		posts: function(params, callback) {
			var searchId = params.searchId;
			var q = '?key=' + KEY;
			for (var i in params) {
				var param = params[i];
				if (i == 'type' || i == 'searchId' || i == 'source' || !param) { //remove event or empty params
				    continue;
				}
                if (i == 'loc') {
					//precision => http://gis.stackexchange.com/questions/8650/how-to-measure-the-accuracy-of-latitude-and-longitude
                    param = params[i].toUrlValue(3); //~110m
                } else if (i == 'tag') {
                    param = params[i][1];
                } else if (i == 'date' && params[i]) {
					param = Math.round(params[i].getTime() / 1000);
				} else if (i == 'cat' && params[i]) {
					//var serverCategories = data.getObject('categories');
					//param = serverCategories[params[i] - 1]['id'];
				}
				q += '&' + i + '=' + param;
			}
			query({
				method: 'GET',
				url: 	ENDPOINT + '/wouaf/' + q,
				data:	null,
				success: function(results) {
					results.searchId = searchId;
					results.resultsType = 'wouafit';
					callback(results);
				},
				error:	null
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
		post: function(id, successCallback, errorCallback) {
			var q = id + '?key=' + KEY;
			query({
				method: 'GET',
				url: 	ENDPOINT + '/wouaf/' + q,
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
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		init: function(callback) {
			query({
				method: 'POST',
				url: 	ENDPOINT + '/init/',
				data:	{
					key: 		KEY,
					uid: 		data.getString('uid'),
				    token:      data.getString('token'),
                    locale:     LANGUAGE
                },
				success:callback,
				error:	callback
			});
		},
		login: function(datas, successCallback, errorCallback) {
            query({
                method: 'POST',
                url:    ENDPOINT + '/user/login/',
                data:  {
                    key:        KEY,
                    login:      datas.login,
                    pass:       datas.pass,
                    did:        'web_app_'+ utils.md5(navigator.userAgent)
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
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						errorCallback()
					}
				}
            });
        },
        fblogin: function(datas, success, error) {
            datas.key = KEY;
            datas.did = 'web_app';
            query({
                method: 'POST',
                url:    ENDPOINT + '/user/fblogin/',
                data:  datas,
                success:success,
                error:  error
            });
        },
        logout: function(callback) {
			query({
				method: 'POST',
				url: 	ENDPOINT + '/user/logout/',
				data:	{
					key: 		KEY,
					uid: 		data.getString('uid'),
					token: 		data.getString('token')
				},
				success:callback,
				error:	callback
			});
		},
		resetPassword: function(email, successCallback, errorCallback) {
            query({
                method: 'POST',
                url:    ENDPOINT + '/user/resetPassword/',
                data:  {
                    key:        KEY,
                    email:      email
                },
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
            });
        },
		createUser: function(datas, successCallback, errorCallback) {
			datas.key = KEY;
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/user/',
				data:	datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		updateUser: function(datas, successCallback, errorCallback) {
			datas.key = KEY;
			datas.uid = data.getString('uid');
			datas.token = data.getString('token');
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/user/',
				data:	datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		deleteUser: function(callback) {
            query({
                method: 'DELETE',
                url:    ENDPOINT + '/user/',
                data:  {
                    key:        KEY,
                    uid:        data.getString('uid'),
                    token:      data.getString('token')
                },
                success:callback,
                error:  callback
            });
        },
		activateUser: function(datas, successCallback, errorCallback) {
			datas.key = KEY;
			query({
				method: 'POST',
				url: 	ENDPOINT + '/user/activation/',
				data:	datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
        userPosts: function(uid, callback) {
            var q = '?key=' + KEY + '&uid=' + uid;
            query({
                method: 'GET',
                url:    ENDPOINT + '/user/wouaf/' + q,
                success:callback,
                error:  callback
            });
        },
        userFavorites: function(callback) {
            var q = '?key=' + KEY + '&uid=' + data.getString('uid') + '&token=' + data.getString('token');
            query({
                method: 'GET',
                url:    ENDPOINT + '/user/favorites/' + q,
                success:callback,
                error:  callback
            });
        },
        createPost: function(datas, successCallback, errorCallback) {
			datas.key = KEY;
			datas.uid = data.getString('uid');
			datas.token = data.getString('token');
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/wouaf/',
				data:	datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		addFavorite: function(id, successCallback, errorCallback) {
			var datas = {
				key: KEY,
				uid: data.getString('uid'),
				token: data.getString('token'),
				id: id
			};
			query({
				method: 'PUT',
				url: 	ENDPOINT + '/user/favorite/',
				data:	datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		removeFavorite: function(id, successCallback, errorCallback) {
			var datas = {
				key: KEY,
				uid: data.getString('uid'),
				token: data.getString('token'),
				id: id
			};
			query({
				method: 'DELETE',
				url: 	ENDPOINT + '/user/favorite/',
				data:	datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		getComments: function(id, callback) {
            var q = '?key=' + KEY + '&id=' + id;
            query({
                method: 'GET',
                url:    ENDPOINT + '/wouaf/comment/' + q,
                data:  null,
                success:callback,
                error:  callback
            });
        },
		createComment: function(datas, callback) {
		    datas.key = KEY;
            datas.uid = data.getString('uid');
            datas.token = data.getString('token');
            query({
                method: 'PUT',
                url:    ENDPOINT + '/wouaf/comment/',
                data:  datas,
                success:callback,
                error:  callback
            });
		},
		deleteComment: function(id, callback) {
            var datas = {
				key: KEY,
				uid: data.getString('uid'),
				token: data.getString('token'),
				id: id
			};
            query({
                method: 'DELETE',
                url:    ENDPOINT + '/wouaf/comment/',
                data:  datas,
                success:callback,
                error:  callback
            });
       },
		contactUser: function(datas, successCallback, errorCallback) {
			datas.key = KEY;
			datas.uid = data.getString('uid');
			datas.token = data.getString('token');
			query({
				method: 'POST',
				url:    ENDPOINT + '/user/contact/',
				data:  datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		contact: function(datas, successCallback, errorCallback) {
			datas.key = KEY;
			datas.uid = data.getString('uid');
			datas.token = data.getString('token');
			query({
				method: 'POST',
				url:    ENDPOINT + '/contact/',
				data:  datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
			});
		},
		deletePost: function(id, successCallback, errorCallback) {
            var datas = {
                key: KEY,
                uid: data.getString('uid'),
                token: data.getString('token'),
                id: id
            };
            query({
                method: 'DELETE',
                url:    ENDPOINT + '/wouaf/',
                data:  datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
            });
       },
       reportPost: function(id, successCallback, errorCallback) {
            var datas = {
                key: KEY,
                uid: data.getString('uid'),
                token: data.getString('token'),
                id: id
            };
            query({
                method: 'POST',
                url:    ENDPOINT + '/wouaf/abuse/',
                data:  datas,
				success:function (result) {
					if (result && result.result && result.result == 1) {
						successCallback(result);
					} else if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				},
				error:	function (result) {
					if (result && result.msg) {
						errorCallback(result.msg);
					} else {
						connectionError();
					}
				}
            });
       }
	};
	return self;
})();