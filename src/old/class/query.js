
var query = function () {
	var utils = require('class/utils');
	var xhr;
	var GOOGLE_BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=';
	//if needed someday : http://ws.geonames.org/search?q=toulouse&maxRows=5&style=LONG
    //or http://api.geonames.org/postalCodeSearch
    // Better ====>>> http://open.mapquestapi.com/geocoding/v1/address?location=Toulouse&callback=renderGeocode
	//doc : http://open.mapquestapi.com/geocoding/
	
	//OSM Static maps Images : http://wiki.openstreetmap.org/wiki/Static_map_images
	//see http://wiki.openstreetmap.org/wiki/StaticMap
	// http://ojw.dev.openstreetmap.org/StaticMap/ => PHP code : https://trac.openstreetmap.org/browser/sites/other/StaticMap
	// Better ====>>> http://open.mapquestapi.com/staticmap/
	
	//Create user agent using app and platform infos.
    var caps = Ti.Platform.displayCaps;
    var USER_AGENT = 'Mozilla/5.0 ('+ Ti.Platform.osname +'; U; '+ Ti.Platform.name +' '+ Ti.Platform.version +'; '+ Ti.Platform.getLocale() +'; '+ Ti.Platform.model +'; '+ caps.platformWidth +'/'+ caps.platformHeight +'/'+ caps.dpi +') AppleWebKit/535.7 (KHTML, like Gecko) WouafIT/'+ Ti.App.version +' Mobile Safari/535.7';
    if (Ti.Platform.osname != 'mobileweb') {
        Titanium.userAgent = USER_AGENT;
    }
    var connectionError = function() {
		//check if last alert append in the last 2 seconds
		var now = new Date();
		if (Ti.App.Properties.getInt('connectionAlert') > 0) {
			if (now.getTime() - Ti.App.Properties.getInt('connectionAlert') > 2000) {
				var notification =  require('ui/components/notification');
				new notification(L('error_connecting_to_server_verify_that_your_device_is_properly_connected_and_try_again_later'));
			}
		} else {
			utils.alert(L('error_connecting_to_server_verify_that_your_device_is_properly_connected_and_try_again_later'));
		}
		Ti.App.Properties.setInt('connectionAlert', now.getTime());
	}
    var query = function (params) {
		xhr = Ti.Network.createHTTPClient({
			validatesSecureCertificate: true,
			// function called when the response data is available
			onload : function(e) {
			    var json = JSON.parse(this.responseText);
			    params.success(json);
			    Ti.App.fireEvent('query.stop');
				xhr = null;
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				if (params.error) {
					var json = this.responseText ? JSON.parse(this.responseText): {};
                    params.error(json, e);
				} else {
					connectionError();
				}
				Ti.App.fireEvent('query.stop');
				xhr = null;
			},
			timeout : 5000  // in milliseconds
		});
		if (params.method == 'DELETE') {
			//seems to be a probem with DELETE requests ...
			xhr.open('POST', params.url);
			xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
		} else {
			xhr.open(params.method, params.url);
		}
		if (Ti.Platform.osname != 'mobileweb') {
			xhr.setRequestHeader('User-Agent', USER_AGENT);
		} else {
			for (var i in params.datas) {
				if (params.datas[i] === null) {
					delete params.datas[i];
				}
			}
		}
		if (params.method == 'GET') {
		  xhr.send();
		} else {
		  xhr.send(params.datas);
		}
		Ti.App.fireEvent('query.start');
	}
	var geocodeNative = function(address, callback) {
		var xhr = Ti.Network.createHTTPClient();
		xhr.open('GET', GOOGLE_BASE_URL + address);
		xhr.onload = function() {
		    var json = JSON.parse(this.responseText);
		    Ti.App.fireEvent('query.stop');
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
		};
		xhr.onerror = function(e) {
			Ti.App.fireEvent('query.stop');
			connectionError();
			callback(false);
		}; 
		xhr.send();
		Ti.App.fireEvent('query.start');
	};
	var geocodeWeb = function(address, callback) {
		var geocoder = new google.maps.Geocoder();
		if (geocoder) {
	      	geocoder.geocode({ 'address': address }, function (results, status) {
	        	Ti.App.fireEvent('query.stop');
				if (status == google.maps.GeocoderStatus.OK) {
	        		var longitudeDelta = 0.04;
				    var latitudeDelta = 0.04;
		    		if (results[0].geometry.viewport) {
				    	latitudeDelta = (results[0].geometry.viewport.getNorthEast().lat() - results[0].geometry.viewport.getSouthWest().lat()) / 2;
				    	longitudeDelta = (results[0].geometry.viewport.getNorthEast().lng() - results[0].geometry.viewport.getSouthWest().lng()) / 2;
				    	latitudeDelta = Math.round((latitudeDelta) * 1000000) / 1000000;
				    	longitudeDelta = Math.round((longitudeDelta) * 1000000) / 1000000;
				    }
	        		callback(new utils.LatLng(
	        			results[0].geometry.location.lat(),
	        			results[0].geometry.location.lng()
	        		), latitudeDelta, longitudeDelta);
	         	} else {
	         		callback(false);
	         	}
	      	});
	      	Ti.App.fireEvent('query.start');
		} else {
			utils.alert(L('google_maps_geocoder_not_supported'));	
		}
	};
	var self = {
		connectionError: connectionError,
		posts: function(params, callback) {
			var searchId = params.searchId;
			var q = '?key=' + Ti.App.Properties.getString('apiKey');
			for (var i in params) {
				var param = params[i];
				if (i == 'type' || i == 'searchId' || i == 'source' || !param) { //remove event or empty params
				    continue;
				}
				if (i == 'tag') {
					param = params[i][1];
				} else if (i == 'date' && params[i]) {
					param = Math.round(params[i].getTime() / 1000);
				} else if (i == 'cat' && params[i]) {
					var serverCategories = Ti.App.Properties.getList('categories');
					param = serverCategories[params[i] - 1]['id'];
				}
				q += '&' + i + '=' + param;
			}
			//Ti.API.info(utils.WOUAF_API_URL + '/wouaf/' + q);
			query({
				method: 'GET',
				url: 	utils.WOUAF_API_URL + '/wouaf/' + q,
				datas:	null,
				success: function(results) {
					results.searchId = searchId;
					results.resultsType = 'wouafit';
					callback(results);
				},
				error:	null
			});
			/*
			if (Ti.Platform.osname != 'mobileweb' && Ti.App.Properties.getString('eventfulKey') && !!Ti.App.Properties.getBool('eventfulSearch')) {
				//duplicate search on eventful	
				var q = 'app_key='+ Ti.App.Properties.getString('eventfulKey') +'&units=km&page_size=100&mature=normal&include=categories&sort_order=popularity';
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
				//Ti.API.info(utils.EVENTFUL_API_URL + '/events/search?' + q);
				query({
					method: 'GET',
					url: 	utils.EVENTFUL_API_URL + '/events/search?' + q,
					datas:	null,
					success:function(results) {
						var datas = {
							'count': 0,
							'results': [],
							'searchId': searchId,
							'resultsType': 'eventful'
						};
						if (results && results.events && results.events.event) {
							//Ti.API.info('eventful ok : '+results.events.event.length);
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
					    //Ti.API.info('eventful error');
                        //Ti.API.info(JSON.stringify(arguments));
                    }
				});
			}*/
		},
		post: function(id, callback) {
			var q = id + '?key=' + Ti.App.Properties.getString('apiKey');
			query({
				method: 'GET',
				url: 	utils.WOUAF_API_URL + '/wouaf/' + q,
				datas:	null,
				success:callback,
				error:	null
			});
		},
		geocode: function(address, callback) {
			if (Ti.Platform.osname === 'mobileweb') {
				geocodeWeb(address, callback);
			} else {
				geocodeNative(address, callback);
			}
		},
		init: function(callback) {
			query({
				method: 'POST',
				url: 	utils.WOUAF_API_URL + '/init/',
				datas:	{
					key: 		Ti.App.Properties.getString('apiKey'),
					uid: 		Ti.App.Properties.getString('uid'),
				    token:      Ti.App.Properties.getString('token'),
                    locale:     (Ti.Platform.osname != 'mobileweb' ? Ti.Platform.getLocale() : Ti.Platform.getLocale().getCurrentLocale())
                },
				success:callback,
				error:	callback
			});
		},
		login: function(datas, success, error) {
            query({
                method: 'POST',
                url:    utils.WOUAF_API_URL + '/user/login/',
                datas:  {
                    key:        Ti.App.Properties.getString('apiKey'),
                    login:      datas.login,
                    pass:       datas.pass,
                    did:        Ti.Platform.getId()
                },
                success:success,
                error:  error
            });
        },
        fblogin: function(datas, success, error) {
            datas.key = Ti.App.Properties.getString('apiKey');
            datas.did = Ti.Platform.getId();
            query({
                method: 'POST',
                url:    utils.WOUAF_API_URL + '/user/fblogin/',
                datas:  datas,
                success:success,
                error:  error
            });
        },
        logout: function(callback) {
			query({
				method: 'POST',
				url: 	utils.WOUAF_API_URL + '/user/logout/',
				datas:	{
					key: 		Ti.App.Properties.getString('apiKey'),
					uid: 		Ti.App.Properties.getString('uid'),
					token: 		Ti.App.Properties.getString('token')
				},
				success:callback,
				error:	callback
			});
		},
		resetPassword: function(email, callback) {
            query({
                method: 'POST',
                url:    utils.WOUAF_API_URL + '/user/resetPassword/',
                datas:  {
                    key:        Ti.App.Properties.getString('apiKey'),
                    email:      email
                },
                success:callback,
                error:  callback
            });
        },
		createUser: function(datas, success, error) {
			datas.key = Ti.App.Properties.getString('apiKey');
			query({
				method: 'PUT',
				url: 	utils.WOUAF_API_URL + '/user/',
				datas:	datas,
				success:success,
				error:	error
			});
		},
		updateUser: function(datas, success, error) {
			datas.key = Ti.App.Properties.getString('apiKey');
			datas.uid = Ti.App.Properties.getString('uid');
			datas.token = Ti.App.Properties.getString('token');
			query({
				method: 'PUT',
				url: 	utils.WOUAF_API_URL + '/user/',
				datas:	datas,
				success:success,
				error:	error
			});
		},
		deleteUser: function(callback) {
            query({
                method: 'DELETE',
                url:    utils.WOUAF_API_URL + '/user/',
                datas:  {
                    key:        Ti.App.Properties.getString('apiKey'),
                    uid:        Ti.App.Properties.getString('uid'),
                    token:      Ti.App.Properties.getString('token')
                },
                success:callback,
                error:  callback
            });
        },
        userPosts: function(uid, callback) {
            var q = '?key=' + Ti.App.Properties.getString('apiKey') + '&uid=' + uid;
            query({
                method: 'GET',
                url:    utils.WOUAF_API_URL + '/user/wouaf/' + q,
                success:callback,
                error:  callback
            });
        },
        userFavorites: function(callback) {
            var q = '?key=' + Ti.App.Properties.getString('apiKey') + '&uid=' + Ti.App.Properties.getString('uid') + '&token=' + Ti.App.Properties.getString('token');
            query({
                method: 'GET',
                url:    utils.WOUAF_API_URL + '/user/favorites/' + q,
                success:callback,
                error:  callback
            });
        },
        createPost: function(datas, callback) {
			datas.key = Ti.App.Properties.getString('apiKey');
			datas.uid = Ti.App.Properties.getString('uid');
			datas.token = Ti.App.Properties.getString('token');
			query({
				method: 'PUT',
				url: 	utils.WOUAF_API_URL + '/wouaf/',
				datas:	datas,
				success:callback,
				error:	callback
			});
		},
		addFavorite: function(id, callback) {
			var datas = {
				key: Ti.App.Properties.getString('apiKey'),
				uid: Ti.App.Properties.getString('uid'),
				token: Ti.App.Properties.getString('token'),
				id: id
			};
			query({
				method: 'PUT',
				url: 	utils.WOUAF_API_URL + '/user/favorite/',
				datas:	datas,
				success:callback,
				error:	callback
			});
		},
		removeFavorite: function(id, callback) {
			var datas = {
				key: Ti.App.Properties.getString('apiKey'),
				uid: Ti.App.Properties.getString('uid'),
				token: Ti.App.Properties.getString('token'),
				id: id
			};
			query({
				method: 'DELETE',
				url: 	utils.WOUAF_API_URL + '/user/favorite/',
				datas:	datas,
				success:callback,
				error:	callback
			});
		},
		getComments: function(id, callback) {
            var q = '?key=' + Ti.App.Properties.getString('apiKey') + '&id=' + id;
            query({
                method: 'GET',
                url:    utils.WOUAF_API_URL + '/wouaf/comment/' + q,
                datas:  null,
                success:callback,
                error:  callback
            });
        },
		createComment: function(datas, callback) {
		    datas.key = Ti.App.Properties.getString('apiKey');
            datas.uid = Ti.App.Properties.getString('uid');
            datas.token = Ti.App.Properties.getString('token');
            query({
                method: 'PUT',
                url:    utils.WOUAF_API_URL + '/wouaf/comment/',
                datas:  datas,
                success:callback,
                error:  callback
            });
		},
		deleteComment: function(id, callback) {
            var datas = {
				key: Ti.App.Properties.getString('apiKey'),
				uid: Ti.App.Properties.getString('uid'),
				token: Ti.App.Properties.getString('token'),
				id: id
			};
            query({
                method: 'DELETE',
                url:    utils.WOUAF_API_URL + '/wouaf/comment/',
                datas:  datas,
                success:callback,
                error:  callback
            });
       },
       contact: function(datas, callback) {
            datas.key = Ti.App.Properties.getString('apiKey');
            datas.uid = Ti.App.Properties.getString('uid');
            datas.token = Ti.App.Properties.getString('token');
            query({
                method: 'POST',
                url:    utils.WOUAF_API_URL + '/user/contact/',
                datas:  datas,
                success:callback,
                error:  callback
            });
       },
       deletePost: function(id, callback) {
            var datas = {
                key: Ti.App.Properties.getString('apiKey'),
                uid: Ti.App.Properties.getString('uid'),
                token: Ti.App.Properties.getString('token'),
                id: id
            };
            query({
                method: 'DELETE',
                url:    utils.WOUAF_API_URL + '/wouaf/',
                datas:  datas,
                success:callback,
                error:  callback
            });
       },
       reportPost: function(id, callback) {
            var datas = {
                key: Ti.App.Properties.getString('apiKey'),
                uid: Ti.App.Properties.getString('uid'),
                token: Ti.App.Properties.getString('token'),
                id: id
            };
            query({
                method: 'POST',
                url:    utils.WOUAF_API_URL + '/wouaf/abuse/',
                datas:  datas,
                success:callback,
                error:  callback
            });
       }
	}
	return self;
}
module.exports = query;