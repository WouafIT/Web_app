var list = function () {
	var font = 			require('ui/components/font');
	var bottomButton = 	require('ui/components/bottomButton');
	var activity = 		require('ui/components/activityIndicator');
	var notification =  require('ui/components/notification');
	var query = 		require('class/query');
	var utils = 		require('class/utils');
	var postsList = 	require('ui/postsList');
	var post = 			require('ui/post');
	
	//instanciate query object
	var query = new query();
	
	//create window
	var self = Ti.UI.createWindow({
		backgroundColor: font.black,
		exitOnClose: false,
		modal: true,
        navBarHidden: true,
        tabBarHidden: true
	});
	
	//back button
	var animate = false;
	var back = function(e){
		if (animate) {
			return;
		}
		if (self.currentPost) {
			Ti.App.fireEvent('list.post.close');
			return;
		}
		self.removeEventListener('android:back', back);
	}
    
    var listHalfScreen = Ti.App.Properties.getDouble('screenSize') > 5 ? true : false;
	var listView = new postsList({
        width: (listHalfScreen ? '50%' : '100%'),
        top: 0,
        left: 0,
        bottom: '50dp'
    },{
        closeList: false,
        closePost: (listHalfScreen ? false : 'list.post.close'),
        showPost: 'list.post.show',
        removePost: 'list.post.remove'
    });
    self.add(listView);
	
	//show list of post
	Ti.App.addEventListener('list.list.show', function(e) {
		var elementsIds = [], elementsDatas = {};
		for (var i = 0, l = e.datas.length; i < l; i++) {
			elementsIds.push(e.datas[i].id);
			elementsDatas[e.datas[i].id] = e.datas[i];
		}
		listView.showPosts(elementsIds, elementsDatas);
	});
    
    var postView;
	//show post detailled view
	Ti.App.addEventListener('list.post.show', function(datas) {
		self.currentPost = datas;
		var showPostView = function (datas) {
			if (postView.right !== 0 ) {
	        	animate = true;
	        	postView.animate({
	                right: 0,
	                duration: 500,
	            }, function() {
	                animate = false;
	                postView.show(datas);
	            });
			} else {
				postView.show(datas);
			}
        }
        if (!postView) {
			postView = new post({
				width: (listHalfScreen ? '50%' : '100%'),
				top: 0,
				right: (Ti.Platform.osname != 'mobileweb' ? (listHalfScreen ? '-50%' : '-100%') : 0),
				bottom: '50dp'
			},{
				closeList: false,
				closePost: (listHalfScreen ? false : 'list.post.close'),
				showPost: 'list.post.show',
				removePost: 'list.post.remove'
			});
			self.add(postView);
			
			postView.addEventListener('postlayout', function() {
	            if (Ti.Platform.osname != 'mobileweb') {
    	            if (!postView.animated) {
    	                showPostView(datas);
    	            }
    	            postView.animated = true;
	            } else {
	                postView.show(datas);
	            }
	        });
		} else {
			showPostView(datas);
		}
		if (!listHalfScreen) {
			self.addEventListener('android:back', back);
		}
	});
	//close post detailled view
	Ti.App.addEventListener('list.post.close', function() {
		//remove back button handler
		if (!listHalfScreen) {
			self.removeEventListener('android:back', back);
		}
		if (self.currentPost) {
			self.currentPost = null;
			
			animate = true;
			postView.animate({
                right: (listHalfScreen ? '-50%' : '-100%'),
                duration: 500,
            }, function() {
                animate = false;
                postView.clean();
            });
		}
		//hide keyboard on android
        if (Ti.Platform.name === 'android') {
            Ti.UI.Android.hideSoftKeyboard();
        }
	});
	
	Ti.App.addEventListener('list.post.remove', function(datas) {
		Ti.App.fireEvent('list.post.close');
		if (favoritesBBt.isActive()) {
			showFavorites();
		} else if (myWouafBBt.isActive()) {
			showMyWouaf();
		}
	});
	
	var showFavorites = function() {
		var logged = !!Ti.App.Properties.getString('uid');
        if (logged) {
			var getFavoritesIndicator = new activity({
	            message: L('search_current_favorites')
	        });
	        getFavoritesIndicator.show();
	        query.userFavorites(function(returnDatas) {
	            getFavoritesIndicator.hide();
	            if (returnDatas.results) {
	                Ti.App.fireEvent('list.list.show', {datas: returnDatas.results});
	                if (returnDatas.count > 0) {
	                    if (returnDatas.count > 1) {
							new notification(String.format(L('_wouafs_in_your_favorites'), returnDatas.count));
						} else {
							new notification(String.format(L('_wouaf_in_your_favorites'), returnDatas.count));
						}
	                } else {
	                    new notification(L('you_have_no_favorites'));
	                }
	            } else if (returnDatas.msg && returnDatas.msg.length) {
	                utils.alert(utils._L(returnDatas.msg[0]));
	            } else {
	                query.connectionError();
	            }
	        });
        } else {
        	Ti.App.fireEvent('list.list.show', {datas: []});
        }
	}
	
	var showMyWouaf = function() {
		var logged = !!Ti.App.Properties.getString('uid');
        if (logged) {
        	var getPostsIndicator = new activity({
	            message: L('search_your_wouaf_in_progress')
	        });
	        getPostsIndicator.show();
			query.userPosts(Ti.App.Properties.getString('uid'), function(returnDatas) {
	            getPostsIndicator.hide();
	            if (returnDatas.results) {
	                Ti.App.fireEvent('list.list.show', {datas: returnDatas.results});
	                if (returnDatas.count > 0) {
	                    if (returnDatas.count > 1) {
							new notification(String.format(L('you_have__wouafs'), returnDatas.count));
						} else {
							new notification(String.format(L('you_have__wouaf'), returnDatas.count));
						}
	                } else {
	                    new notification(L('you_have_no_wouaf'));
	                }
	            } else if (returnDatas.msg && returnDatas.msg.length) {
	                utils.alert(utils._L(returnDatas.msg[0]));
	            } else {
	                query.connectionError();
	            }
	        });
        } else {
        	Ti.App.fireEvent('list.list.show', {datas: []});
        }
	}
	
	//Bottom buttons bar
	var bottomView = Ti.UI.createView({
		height: '50dp',
		width: '100%',
		bottom: 0,
		layout: 'horizontal'
	});
	
	//favorites buttons
	var favoritesBBt = new bottomButton('your_favorites', function(e) {
		if (favoritesBBt.isActive()) {
			return;
		}
		favoritesBBt.setActive(true);
		myWouafBBt.setActive(false);
		showFavorites();
	}, 2);
	bottomView.add(favoritesBBt);
	
	//my wouaf buttons
	var myWouafBBt = new bottomButton('your_wouaf', function(e) {
		if (myWouafBBt.isActive()) {
			return;
		}
		favoritesBBt.setActive(false);
		myWouafBBt.setActive(true);
		showMyWouaf();
	}, 2);
	bottomView.add(myWouafBBt);
	
	self.add(bottomView);
	
    //used to refresh window content on tab change
    self.refresh = function () {
        if (!favoritesBBt.isActive() && !myWouafBBt.isActive()) {
        	favoritesBBt.fireEvent('click', {});
        } else if (favoritesBBt.isActive()) {
        	showFavorites();
		} else if (myWouafBBt.isActive()) {
        	showMyWouaf();
        }
        var logged = !!Ti.App.Properties.getString('uid');
        if (!logged) {
        	utils.alert(L('you_must_be_logged_in_to_view_your_favorites_and_wouaf'));
        }
    }
    return self;
}
module.exports = list;