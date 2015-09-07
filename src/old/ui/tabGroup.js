function tabGroup() {
	var font = require('ui/components/font');
	var notification = 	require('ui/components/notification');
	var mapWindow = require('ui/map');
	var listWindow = require('ui/list');
	var publishWindow = require('ui/publish');
	var settingWindow = require('ui/setting');
	
	//create module instance
	if (Ti.Platform.osname != 'mobileweb') {
    	var self = Ti.UI.createTabGroup({
    	    activeTabBackgroundColor: font.green,
            tabsBackgroundColor: font.black,
            color: font.white,
            tabsAtBottom: false,
            modal: true,
            navBarHidden: true,
            tabBarHidden: true
    	});
	} else {
	    var self = Ti.UI.createTabGroup({
            activeTabBackgroundColor: font.green,
            tabsBackgroundColor: font.black,
            color: font.white,
            tabsAtBottom: false
        });
	}
	//create app tabs
	var win1 = new mapWindow(),
		win2 = new listWindow(),
		win3 = new publishWindow(),
		win4 = new settingWindow();
	
	var tab1 = Ti.UI.createTab({
		title: L('map'),
		icon: 'images/tabs/map.png',
		window: win1,
		backgroundSelectedColor: font.green
	});
	win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: L('your_wouaf'),
		icon: 'images/tabs/list.png',
		window: win2,
		backgroundSelectedColor: font.green
	});
	win2.containingTab = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: L('post'),
		icon: 'images/tabs/post.png',
		window: win3,
		backgroundSelectedColor: font.green
	});
	win3.containingTab = tab3;
	
	var tab4 = Ti.UI.createTab({
		title: L('settings'),
		icon: 'images/tabs/settings.png',
		window: win4,
		backgroundSelectedColor: font.green
	});
	win4.containingTab = tab4;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	
	self.addEventListener('focus', function(e) {
		if (e.previousTab && e.previousTab.window && e.previousTab.window.end) {
			e.previousTab.window.end();
		}
		if (e.tab && e.tab.window && e.tab.window.refresh) {
            e.tab.window.refresh();
        }
	});
	//general back to quit application (need confirmation within 3 seconds)
	var back = function() {
		new notification(L('press_again_to_exit_wouaf_it'));
		self.removeEventListener('android:back', back);
		setTimeout(function() {
			self.addEventListener('android:back', back);
		}, 3000);
	}
	self.addEventListener('android:back', back);
	
	return self;
};

module.exports = tabGroup;
