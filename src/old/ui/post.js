var post = function (view, events) {
	var font = require('ui/components/font');
	var picviewerWindow = require('ui/components/picviewer');
    var textarea = require('ui/components/textarea');
    var switchBt = require('ui/components/switch');
	var buttons = require('ui/components/buttons');
    var notification = require('ui/components/notification');
	var activity = require('ui/components/activityIndicator');
	var comment = require('ui/comment');
    var twitter = require('lib/twitter-text');
	var utils = require('class/utils');
	var query = require('class/query');
	//instanciate query object
	var query = new query();
	
	//all show/hide events
	var listClosable = events.closeList ? true : false;
	var postClosable = events.closePost ? true : false;
	var closeList = events.closeList || 'map.list.close';
	var closePost = events.closePost || 'map.post.close';
	var showPost = events.showPost || 'map.post.show';
	var removePost = events.removePost || 'map.post.remove';
	
	//view
	var viewConf = {
		backgroundColor: font.black
	};
	for (var i in view) {
		viewConf[i] = view[i];
	}
	var self = Ti.UI.createView(viewConf);
	if (postClosable) {
		var closeBtn = Ti.UI.createView({
			backgroundImage:'/images/close.png',
			top: '2dp',
			right: '2dp',
			width: '20dp',
			clickName: 'close',
			height: '20dp',
			zIndex: 4
		});
		closeBtn.addEventListener('click', function(e) {
			Ti.App.fireEvent(closePost);
		});
		self.add(closeBtn);
	}
	
	var postView;
	var webView;
	var setViewSize;
	
	Ti.App.addEventListener('app.orientation', function () {
   		Ti.App.fireEvent('post:getSize', {});
    });
	
	Ti.App.addEventListener('post:clickHash', function(e) {
        var hash = e.hash;
        var dialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: [L('cancel'), L('confirm')],
            message: String.format(L('search_the_tag_'), hash)
        });
        dialog.addEventListener('click', function(e){
            if (e.index === e.source.cancel){
                return;
            }
            var searchParams = {
            	'tag': [999999, hash],
            	'appendParams': true
            }
            Ti.App.fireEvent('search.posts', searchParams);
            //close post if we are not in tablet mode
            if (Ti.App.Properties.getDouble('screenSize') <= 5) {
            	if (postClosable) {
            		Ti.App.fireEvent(closePost);
            	}
            	if (listClosable) {
            		Ti.App.fireEvent(closeList);
            	}
            }
        });
        dialog.show();
    });
    Ti.App.addEventListener('post:clickLink', function(e) {
        var url = e.url;
        var dialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: [L('cancel'), L('confirm')],
            message: utils.formatText(String.format(L('see_link_'), url))
        });
        dialog.addEventListener('click', function(e){
            if (e.index === e.source.cancel){
                return;
            }
            Ti.Platform.openURL(url);
        });
        dialog.show();
    });
	
	self.show = function (datas) {
	    self.clean();
	    
        postView = Ti.UI.createScrollView({
            contentHeight: 'auto',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            layout: 'vertical'
        });
        
        //var isEventful = (datas.author[0] == 'eventful');
        
        var headView = Ti.UI.createView({
            backgroundColor: font.green,
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            top: 0,
            left: 0,
            layout: 'composite'
        });
        
        //category image
        headView.add(Ti.UI.createView({
            backgroundImage: /*(isEventful ? '/images/maps/cat/eventful.png' : */'/images/maps/cat/'+ datas.cat +'.png'/*)*/,
            top: '5dp',
            left: '2dp',
            width: '24dp',
            height: '31dp'
        }));
        
        var headLabel = Ti.UI.createView({
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            top:  '3dp',
            left: '35dp',
            right: '23dp',
            layout: 'vertical'
        });
        
        //category name
        /*if (isEventful) {
        	var catName = datas.cat;
        } else {*/
	        var cats = Ti.App.Properties.getList('categories');
	        var catName;
	        for(var i = 0, l = cats.length; i < l; i++) {
	            if (cats[i]['id'] == datas.cat) {
	                catName = utils._L(cats[i]['label']);
	            } 
	        }
        /*}*/
        headLabel.add(Ti.UI.createLabel({
            color: font.white,
            font: font.harlequin24normal,
            height: Ti.UI.SIZE,
            left: 0,
            text: (catName ? String.format(L('category_'), catName) : L('category_unknown'))
        }));
        
        //author
        /*if (isEventful) {
        	var authorView = Ti.UI.createView({
	            height: Ti.UI.SIZE,
	            width: Ti.UI.SIZE,
	            left: 0,
				layout: 'horizontal'
	        });
        	authorView.add(Ti.UI.createLabel({
	            color: font.white,
	            font: font.arial22normal,
	            height: Ti.UI.SIZE,
	            width: Ti.UI.SIZE,
				text: L('event_by')
	        }));
	        authorView.add(Ti.UI.createView({
	            backgroundImage: '/images/eventful.png',
	            width: '63dp',
	            height: '20dp',
	            left: '5dp'
	        }));
	        authorView.addEventListener('click', function() {
	        	Ti.Platform.openURL('http://eventful.com/');
	        });
	        headLabel.add(authorView);
        } else {*/
	        headLabel.add(Ti.UI.createLabel({
	            height: Ti.UI.SIZE,
	            left: 0,
	            color: font.white,
	            font: font.arial22normal,
	            text: String.format(L('by_'), datas.author[1])
	        }));
        /*}*/
        headView.add(headLabel);
        postView.add(headView);
        
        var time = new Date();
		datas.status = (datas.date[0].sec * 1000) > time.getTime() ? 'post' : ((datas.date[1].sec * 1000) < time.getTime() ? 'past' : 'current');
        if (datas.status != 'current') {
        	//alert user than this post is not currently active
        	var timeView = Ti.UI.createView({
	            backgroundColor: font.lightorange,
	            height: Ti.UI.SIZE,
	            width: Ti.UI.FILL,
	            top: 0,
	            left: 0,
	            layout: 'composite'
	        });
	        /*if (isEventful) {
	        	var inactiveLabel = datas.status == 'post' ? L('attention_this_event_is_not_yet_active') : L('attention_this_event_is_over')
	        } else {*/
	        	var inactiveLabel = datas.status == 'post' ? L('attention_this_wouaf_is_not_yet_active') : L('attention_this_wouaf_is_over')
	        /*} */
        	timeView.add(Ti.UI.createLabel({
	            color: font.orange,
	            font: font.arial22bold,
	            height: Ti.UI.SIZE,
	            width: Ti.UI.FILL,
	            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	            text: inactiveLabel
	        }));
	        postView.add(timeView);
	   	}
        
        //create HTML text content
        //grab links and tags positions
        var entities = twitter.extractUrlsWithIndices(datas.text)
                       .concat(twitter.extractHashtagsWithIndices(datas.text, {checkUrlOverlap: false}));
        if (entities.length) {
            twitter.removeOverlappingEntities(entities);
        }
        
        var pos = 0;
        var textContent = '';
        for (var i = 0, l = entities.length; i < l; i++) {
            var hash = entities[i].hashtag;
            var url = entities[i].url;
            var indices = entities[i].indices;
            //text before entity
            textContent += datas.text.substr(pos, indices[0] - pos);
            //entity
            if (hash) { //hash
                textContent += '<a href="#" onclick="return fireEvent(\'post:clickHash\', {hash: \'' + hash + '\'})">#' + hash + '</a>';
            } else if (url) { //link
                textContent += '<a href="#" onclick="return fireEvent(\'post:clickLink\', {url: \'' + url + '\'})">' + url + '</a>';
            }
            pos = indices[1];
        }
        if (pos != datas.text.length) {
            //text after entities
            textContent += datas.text.substr(pos, datas.text.length - pos);
        }
        if (Ti.Platform.osname != 'mobileweb') {
            webView = Ti.UI.createWebView({
                top: '15dp',
                left: '5dp',
                right: '5dp',
                width: Ti.UI.FILL,
                height: '180dp',
                url: 'post.html',
                backgroundColor: 'transparent',
                touchEnabled: true,
                enableZoomControls: false
            });
            var setPostContent = function(e) {
                Ti.App.fireEvent('post:set', { datas: textContent });
                Ti.App.removeEventListener('post:loaded', setPostContent);
            }
            Ti.App.addEventListener('post:loaded', setPostContent);
            
            setViewSize = function(e) {
                var size = (e.size + 10) + 'dp';
                webView.setHeight(size);
           	}
            Ti.App.addEventListener('post:resize', setViewSize);
            
            postView.add(webView);
        } else {
            postView.add(Ti.UI.createLabel({
                top: '15dp',
                left: '5dp',
                right: '5dp',
                width: Ti.UI.FILL,
                height: Ti.UI.SIZE,
                text: textContent
            }));
        }
        //Pics
        if (datas.pics && datas.pics.length) {
            var showPic = function(e) {
                //show pics viewver
                new picviewerWindow(datas.pics, e.source.picIndex).open();
            }
            
            var photosView = Ti.UI.createView({
                layout: 'horizontal',
                backgroundColor: font.black,
                borderColor: font.grey,
                borderWidth: 1,
                top: '5dp',
                left: '5dp',
                right: '5dp',
                height: Ti.UI.SIZE,
                width: Ti.UI.FILL
            });
            var l = datas.pics.length;
            var left = Math.floor((100 - (l * 19.5)) / (l + 1)) + '%';
            
            for (var i = 0; i < l; i++) {
                var pic = datas.pics[i];
                if (pic) {
                    var picView = Ti.UI.createImageView({
                        image: (pic.t ? pic.t : pic.p), //thumbnail or full photo
                        backgroundColor: font.black,
                        left: left,
                        width: '19.5%',
                        height: Ti.UI.SIZE,
                        picIndex: i
                    });
                    picView.addEventListener('click', showPic);
                    photosView.add(picView);
                }
            }
            postView.add(photosView);
        }
        
        //Post length
        var start = new Date();
        start.setTime(datas.date[0].sec * 1000);
        var length = datas.date[1].sec - datas.date[0].sec;
        var eventLength;
        var oneDay = 86400;
        var oneHour = 3600;
        
        if (length >= oneDay) {
            if (length % oneDay == 0 && (length / oneDay) < 10) {
                eventLength = length / oneDay;
                eventLength += eventLength > 1 ? ' ' + L('days') : ' ' + L('day');
            }
        } else  {
            if (length % oneHour == 0) {
                eventLength = length / oneHour;
                eventLength += eventLength > 1 ? ' ' + L('hours') : ' ' + L('hour');
            }
        }
        if (!eventLength) {
            var end = new Date();
            end.setTime(datas.date[1].sec * 1000);
            var timeStart = utils.formatTime(start);
            var timeEnd = utils.formatTime(end);
            eventLength = String.format(L('from_to'), utils.formatDate(start, 'long') + (timeStart != '00:00' ? ' '+ L('at') +' '+ timeStart : ''), utils.formatDate(end, 'long') + (timeEnd != '00:00' ? ' '+ L('at') +' '+ timeEnd : ''));
        } else {
            var timeStart = utils.formatTime(start);
            eventLength = String.format(L('on_for'), utils.formatDate(start, 'long') + (timeStart != '00:00' ? ' '+ L('at') +' '+ timeStart : ''), eventLength);
        }
        
        postView.add(Ti.UI.createLabel({
            color: font.grey,
            font: font.arial20normal,
            top: '2dp',
            left: '5dp',
            text: eventLength
        }));
        
        // create action view data object
        var data = [];
        /*if (isEventful) {
        	data.push({title: '>> ' + L('more_details'), dataId: 'eventful', rightImage: utils.img + '/actions/eventful.png'});
        	data.push({title: L('view_on_google_map'), dataId: 'map', leftImage: utils.img + '/actions/gmap.png'});
	        data.push({title: L('go_to_this_place'), dataId: 'goto', leftImage: utils.img + '/actions/navigation.png'});
	    } else {*/
	        if (Ti.App.Properties.getString('uid') && Ti.App.Properties.getString('uid') == datas.author[0]) {
	            data.push({title: L('delete_this_wouaf'), dataId: 'delete', leftImage: utils.img + '/actions/delete.png'});
	        } else {
	            if (datas.contact == 1) {
	            	data.push({title: L('contact_the_author'), dataId: 'contact', leftImage: utils.img + '/actions/contact.png'});
	            }
	        }
	        var favs = Ti.App.Properties.getList('favorites');
	        favs = favs || [];
	        if (utils.indexOf(favs, datas.id) !== -1) {
	        	data.push({title: L('in_your_favorites')+(datas.fav > 0 ? ' ('+String.format(L('like__wouaffers'), datas.fav)+')' : ''), dataId: 'favorites', leftImage: utils.img + '/actions/star-on.png'});
	        } else {
	        	data.push({title: L('add_to_your_favorites')+(datas.fav > 0 ? ' ('+String.format(L('like__wouaffers'), datas.fav)+')' : ''), dataId: 'favorites', leftImage: utils.img + '/actions/star-off.png'});
	        }
	        if (datas.status == 'current') {
	        	data.push({title: (datas.com <= 1 ? (datas.com === 0 ? L('add_a_comment') : L('see_the_comment')) : String.format(L('view_all__comments'), datas.com)), dataId: 'comments', leftImage: utils.img + '/actions/comments.png'});
	        } else {
	        	data.push({title: (datas.com <= 1 ? (datas.com === 0 ? L('no_comments_yet') : L('see_the_comment')) : String.format(L('view_all__comments'), datas.com)), dataId: 'comments', leftImage: utils.img + '/actions/comments.png'});
	        }
	        data.push({title: L('like'), dataId: 'like', leftImage: utils.img + '/actions/like.png'});
	        data.push({title: L('share_on_facebook'), dataId: 'fbshare', leftImage: utils.img + '/actions/fbshare.png'});
	        if (Ti.Platform.osname != 'mobileweb') {
	           data.push({title: L('share_to_your_applications'), dataId: 'share', leftImage: utils.img + '/actions/share.png'});
	        }
	        data.push({title: L('view_on_google_map'), dataId: 'map', leftImage: utils.img + '/actions/gmap.png'});
	        data.push({title: L('go_to_this_place'), dataId: 'goto', leftImage: utils.img + '/actions/navigation.png'});
	        data.push({title: L('report_abuse'), dataId: 'alert', leftImage: utils.img + '/actions/alert.png'});
        /*}*/
        for (var i = 0; i < data.length; i++ ) {
            data[i].font = font.arial22normal;
            data[i].color = font.white;
            data[i].height = '40dp';
        };
        
        var actionsView = Ti.UI.createTableView({
            headerTitle: L('your_actions'),
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            top: '7dp',
            data:data
        });
        
        // create actions view event listener
        actionsView.addEventListener('click', function(e) {
            var logged = !!Ti.App.Properties.getString('uid');
            switch (e.rowData.dataId) {
                case 'delete': //OK
                    var dialog = Ti.UI.createAlertDialog({
                        cancel: 0,
                        buttonNames: [L('cancel'), L('confirm')],
                        message: utils.formatText(L('do_you_confirm_the_suppression_of_this_wouaf_and_all_associated_comments_you_can_not_go_back')),
                        title: L('attention')
                    });
                    dialog.addEventListener('click', function(e){
                        if (e.index === e.source.cancel){
                            return;
                        }
                        var deleteIndicator = new activity({
                            message: L('deleting')
                        });
                        deleteIndicator.show();
                        query.deletePost(datas.id, function(returnDatas) {
                            deleteIndicator.hide();
                            if (returnDatas.result && returnDatas.result == 1) {
                                Ti.App.fireEvent(removePost, {'post': datas.id});
                                utils.alert(L('your_wouaf_was_deleted'));
                            } else if (returnDatas.msg && returnDatas.msg.length) {
                                utils.alert(utils._L(returnDatas.msg[0]));
                            } else {
                                query.connectionError();
                            }
                        });
                    });
                    dialog.show();
                break;
                case 'contact': //OK
                    if (!logged) {
                        utils.alert(L('you_must_be_logged_in_to_contact_an_author'));
                        return;
                    }
                    if (datas.contact == 1) {
                    	//show contact page
                   		var contactWindow = require('ui/contact');
                    	var contact = new contactWindow(datas);
                    	contact.open();
                    }
                break;
                case 'favorites': //OK
                    if (!logged) {
                        utils.alert(L('you_must_be_logged_in_to_add_this_wouaf_in_your_favorites'));
                        return;
                    }
                    var favs = Ti.App.Properties.getList('favorites');
                    favs = favs || [];
                    if (e.row.leftImage.indexOf('star-on') !== -1) {
                    	datas.fav--;
                    	e.row.leftImage = utils.img + '/actions/star-off.png';
                    	e.row.title = L('add_to_your_favorites') + (datas.fav > 0 ? ' ('+String.format(L('like__wouaffers'), datas.fav)+')' : '');
                    	query.removeFavorite(datas.id, function() {});
                    	delete favs[utils.indexOf(favs, datas.id)];
                    } else {
                    	datas.fav++;
                    	e.row.leftImage = utils.img + '/actions/star-on.png';
                    	e.row.title = L('in_your_favorites') + (datas.fav > 0 ? ' ('+String.format(L('like__wouaffers'), datas.fav)+')' : '');
                    	query.addFavorite(datas.id, function() {});
                    	favs.push(datas.id);
                    }
                    Ti.App.Properties.setList('favorites', favs);
                break;
                case 'like': //OK
                    if (!logged || !Ti.Facebook.loggedIn) {
                        utils.alert(L('you_must_be_logged_with_your_facebook_account_to_like_a_wouaf'));
                        return;
                    }
                    var data = {
                        access_token : Ti.Facebook.accessToken,
                        object: utils.WOUAF_SHORT_URL + '/' + datas.id
                    }
                    var fbPublishIndicator = new activity({
                        message: L('facebook_communication_in_progress')
                    });
                    fbPublishIndicator.show();
                    Ti.Facebook.requestWithGraphPath('me/og.likes', data, 'POST', function(e) {
                        fbPublishIndicator.hide();
                        if (e.success) {
                            utils.alert(L('you_like_this_wouaf'));
                        } else {
                            utils.alert(L('facebook_reports_that_you_already_like_this_wouaf'));
                        }
                    });
                break;
                case 'fbshare': //OK
                    if (!logged || !Ti.Facebook.loggedIn) {
                        utils.alert(L('you_must_be_logged_with_your_facebook_account_to_post_a_wouaf_on_your_wall'));
                        return;
                    }
                    var fbPublishIndicator = new activity({
                        message: L('publish_on_facebook_in_progress')
                    });
                    fbPublishIndicator.show();
                    var fbfields = {
                        'message':      catName + ' : ' + datas.text + '\n' + eventLength + ' '+ L('by') +' ' + datas.author[1],
                        'name':         L('learn_more_about_this_event'),
                        'description':  L('join_me_on_wouaf_it_the_first_micro_events_network'),
                        'link':         utils.WOUAF_SHORT_URL + '/' + datas.id,
                        'picture':      utils.WOUAF_LOGO_URL
                    }
                    Ti.Facebook.requestWithGraphPath('me/feed/', fbfields, 'POST', function(e) {
                        fbPublishIndicator.hide();
                        if (!e.success) {
                            utils.alert(L('facebook_publication_failed'));
                        } else {
                            utils.alert(L('this_wouaf_is_successfully_published_on_facebook'));
                        }
                    });
                break;
                case 'share': //OK
                    //open share dialog
                    var intent = Ti.Android.createIntent({
                        action: Ti.Android.ACTION_SEND,
                        type:'text/plain'
                    });
                    var message = catName + ' : ' + datas.text + '\n' + eventLength + ' '+ L('by') +' ' + datas.author[1] + '\n'+ L('learn_more') +' ' + utils.WOUAF_SHORT_URL + '/' + datas.id;
                    intent.putExtra(Ti.Android.EXTRA_TEXT, message);
                    Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intent, L('share_this_wouaf')));
                break;
                case 'map': //OK
                    //open map
                    var intent = Ti.Android.createIntent({
                        action: Ti.Android.ACTION_VIEW,
                        data:'geo:' + datas.loc[0] + ',' + datas.loc[1] + '?q=' + datas.loc[0] + ',' + datas.loc[1]// + '(marker label)'
                    });
                    Ti.Android.currentActivity.startActivity(intent);
                break;
                case 'goto': //OK
                    //open navigation
                    var navIntent = Ti.Android.createIntent({
                      action: Ti.Android.ACTION_VIEW,
                      data: 'google.navigation:q=' + datas.loc[0] + ',' + datas.loc[1]
                    });
                    Ti.Android.currentActivity.startActivity(navIntent);
                break;
                case 'alert'://OK
                    if (!logged) {
                        utils.alert(L('you_must_be_logged_in_to_report_a_wouaf_as_abusive'));
                        return;
                    }
                    var dialog = Ti.UI.createAlertDialog({
                        cancel: 0,
                        buttonNames: [L('cancel'), L('confirm')],
                        message: utils.formatText(L('do_you_confirm_the_report_of_this_wouaf_as_abusive_attention_in_case_of_error_kittens_will_die')),
                        title: L('attention')
                    });
                    dialog.addEventListener('click', function(e){
                        if (e.index === e.source.cancel){
                            return;
                        }
                        var abuseIndicator = new activity({
                            message: L('report_in_progress')
                        });
                        abuseIndicator.show();
                        query.reportPost(datas.id, function(returnDatas) {
                            abuseIndicator.hide();
                            if (returnDatas.result && returnDatas.result == 1) {
                                utils.alert(utils.formatText(L('your_report_is_sent_our_team_will_review_it_quickly_and_take_appropriate_action_thank_you_for_your_help')));
                            } else if (returnDatas.msg && returnDatas.msg.length) {
                                utils.alert(utils._L(returnDatas.msg[0]));
                            } else {
                                query.connectionError();
                            }
                        });
                    });
                    dialog.show();
                break;
                case 'comments': //OK
                    showComments(datas.id, datas.author[0], datas.status, 'top');
                break;
                /*case 'eventful': //OK
                	Ti.Platform.openURL(datas.url);
                break;*/
            }
        });
        
        // add table view to the window
        postView.add(actionsView);
        
        /*if (isEventful) {
        	postView.add(Ti.UI.createLabel({
	            color: font.grey,
	            font: font.arial18normal,
	            top:  '10dp',
	            left: '5dp',
	            right: '5dp',
	            text: L('wouaf_it_eventful')
	        }));
        }*/
        
        var commentsView, createComView;
        var showComments = function(postId, authorId, status, scrollTo) {
            if (commentsView) {
                postView.remove(commentsView);
                commentsView = null;
            }
            if (createComView) {
                postView.remove(createComView);
                createComView = null;
            }
            
            var commentsIndicator = new activity({
                message: L('loading_comments')
            });
            commentsIndicator.show();
            query.getComments(postId, function(datas) {
                commentsIndicator.hide();
                var uid = Ti.App.Properties.getString('uid');
                var logged = !!uid;
                var data = [];
                if (datas.count > 0 && datas.comments.length > 0) {
                    for (var i = 0, l = datas.comments.length; i < l; i++) {
                        var c = new comment(datas.comments[i], (datas.comments[i].author[0] == uid ? true : false), (datas.comments[i].author[0] == uid ? true : false));
                        c.deleteComment = function(commentId) {
                        	var dialog = Ti.UI.createAlertDialog({
								cancel: 0,
								buttonNames: [L('cancel'), L('confirm')],
								message: L('are_you_sure_you_want_to_delete_this_comment'),
								title: L('delete_comment')
							});
							dialog.addEventListener('click', function(e){
								if (e.index === e.source.cancel){
									return;
								}
                            	var commentsDeletionIndicator = new activity({
					                message: L('deleting')
					            });
					            commentsDeletionIndicator.show();
					            query.deleteComment(commentId, function(datas) {
		                            commentsDeletionIndicator.hide();
		                            if (datas.result && datas.result == 1) {
		                                //update comments view
		                                showComments(postId, authorId, status, 'top');
		                            } else if (datas.msg && datas.msg.length) {
		                                utils.alert(utils._L(datas.msg[0]));
		                            } else {
		                                query.connectionError();
		                            }
		                        });
                         	});
                         	dialog.show();
                        }
                        data.push(c);
                    }
                } else {
                    data.push({
                        title: L('no_comments_yet'),
                        font: font.arial22normal,
                        color: font.white,
                        left: '5dp',
                        height: '40dp',
                    });
                }
				if (!logged) {
                    data.push({
                        title: L('you_must_be_logged_in_to_post_a_comment'),
                        font: font.arial22normal,
                        color: font.white,
                        left: '5dp',
                        height: '40dp',
                    });
                }
                
                commentsView = Ti.UI.createTableView({
                    headerTitle: (datas.count ? (datas.count > 1 ? String.format(L('_comments'), datas.count) : String.format(L('_comment'), datas.count)) : L('no_comments_yet')),
                    height: Ti.UI.SIZE,
                    width: Ti.UI.FILL,
                    top: '7dp',
                    data: data,
                    separatorColor: font.grey
                });
                var scrollToComments = function() {
                    var rect = commentsView.getRect();
                    if (!scrollTo || scrollTo == 'top') {
                        postView.scrollTo(0, (rect.y - 20));
                    } else {
                        postView.scrollTo(0, (rect.y + rect.height - 100));
                    }
                    postView.removeEventListener('postlayout', scrollToComments);
                }
                postView.addEventListener('postlayout', scrollToComments);
                // add comments view to the window
                postView.add(commentsView);
                
                if (logged) {
                    //create comment form
                    createComView = Ti.UI.createView({
                        height: Ti.UI.SIZE,
                        width: Ti.UI.FILL,
                        layout: 'vertical'
                    });
                    //top border
                    createComView.add(Ti.UI.createView({
						top: 0,
			            left: 0,
			            right: 0,
			            width: Ti.UI.FILL,
			            height: 1,
						backgroundColor: font.grey
					}));
                    
                    //textarea (+tags / tinyurl)
                    var textView = new textarea({
                        text: String.format(L('your_comment_still'), 300)
                    }, {
                        fieldId: 'text',
                        hintText: L('enter_your_text'),
                        height: '120dp',
                        font: font.arial24normal,
                        value: ''
                    }, {
                        top: '5dp'
                    });
                    createComView.add(textView);
                    
                    var countLabel = Ti.UI.createLabel({
                        color: font.white,
                        font: font.arial18normal,
                        left: '10dp',
                        top: '1dp',
                        height: 'auto',
                        right: '10dp',
                        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                        text: String.format(L('still'), 300)
                    });
                    createComView.add(countLabel);
                    
                    var firstAlert = false;
                    var ldf = Ti.Platform.osname === 'mobileweb' ? 1 : Ti.Platform.displayCaps.getLogicalDensityFactor();
    				var countText = function () {
                        var t = textView.textArea;
                        var l = t.value.length;
                        //trim at 300 chars if needed
                        if (300 - l < 0) {
                            t.value = t.value.substr(0, 300);
                            l = t.value.length;
                            //alert user
                            if (!firstAlert) {
                                firstAlert = true;
                                utils.alert(L('max_length_reached'));
                            } else {
                                new notification(L('max_length_reached'));
                            }
                        }
                        //auto height
                        if (l > 0) {
                            var linecount = 0;
                            var splitresult = t.value.split("\n");
                            for (var i = 0, ll = splitresult.length; i < ll; i++) {
                                var charCount = splitresult[i].length;
                                linecount += charCount ? Math.ceil( charCount / ((t.getRect().width - (20 * ldf)) / (8 * ldf)) ) : 1;
                            }
                            var h = (linecount + 1) * 25;
                            t.height = h > 120 ? (h * ldf) : '120dp';
                        } else {
                            t.height = '120dp';
                        }
                        //display chars left
                        textView.label.text = String.format(L('your_comment_still'), (300 - l));
                        countLabel.text = String.format(L('still'), (300 - l));
                        
                        return false;
                    }
                    textView.textArea.addEventListener('change', countText);
                    
                    var commentsNotification = new switchBt({
                        title: L('receive_an_email_every_new_comment'),
                        value: !!Ti.App.Properties.getBool('commentNotif')
                    });
                    createComView.add(commentsNotification);
                    
                    //Buttons
                    var buttonsView = new buttons({
                        title: L('post')
                    }, function() {
                        if (!textView.textArea.getValue()) {
                            utils.alert(L('please_enter_a_comment'));
                            return;
                        }
                        if (textView.textArea.getValue().length > 300 ) {
                            utils.alert(L('your_text_is_too_long'));
                            return;
                        }
                        var createCommentsIndicator = new activity({
                            message: L('publish_in_progress')
                        });
                        createCommentsIndicator.show();
                        query.createComment({
                            text: textView.textArea.getValue(),
                            id: postId,
                            notif: (commentsNotification.value ? 1 : 0)
                        }, function(datas) {
                            createCommentsIndicator.hide();
                            if (datas.result && datas.result == 1) {
                                //update comments view
                                showComments(postId, authorId, status, 'bottom');
                            } else if (datas.msg && datas.msg.length) {
                                utils.alert(utils._L(datas.msg[0]));
                            } else {
                                query.connectionError();
                            }
                        });
                    });
                    createComView.add(buttonsView);
                    postView.add(createComView);
                }
            });
        }
        
        self.add(postView);
	}
	self.clean = function () {
		if (postView) {
    		if (Ti.Platform.osname != 'mobileweb') {
        		Ti.App.removeEventListener('post:resize', setViewSize);
            	postView.remove(webView);
        		if (Ti.Platform.osname === 'android') {
        			webView.release();
        		}
        		webView = null;
    		}
    		self.remove(postView);
    		postView = null;
    	}
	}
	return self;
}
module.exports = post;