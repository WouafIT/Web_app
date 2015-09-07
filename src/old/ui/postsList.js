var postsList = function (view, events) {
	var font = require('ui/components/font');
	var postElement = require('ui/postListElement');
	
	//all show/hide events
	var listClosable = events.closeList ? true : false;
	var postClosable = events.closePost ? true : false;
	var closeList = events.closeList || 'map.list.close';
	var closePost = events.closePost || 'map.post.close';
	var showPost = events.showPost || 'map.post.show';
	var removePost = events.removePost || 'map.post.remove';
	
	var maxPostsPerPage = 10;
	
	//view
	var viewConf = {
		backgroundColor: font.black,
		layout: 'composite'
	};
	for (var i in view) {
		viewConf[i] = view[i];
	}
	var self = Ti.UI.createView(viewConf);
	if (listClosable) {
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
			Ti.App.fireEvent(closeList, e);
		});
		self.add(closeBtn);
	}
	var listHalfScreen = Ti.App.Properties.getDouble('screenSize') > 5 ? true : false;
	if (listHalfScreen) {
		//right border
		self.add(Ti.UI.createView({
			top: 0,
            right: 0,
            width: 1,
            bottom: 0,
			height: Ti.UI.FILL,
			backgroundColor: font.grey
		}));
	}
	
	var tableView;
	self.showPosts = function (elements, elementsDatas) {
		self.clean();
		var datas = [];
		var nextElements = [];
		
		//sort elements by creation date => most recent first
		var sortPost = function compare(a,b) {
            if (elementsDatas[a].ts.sec < elementsDatas[b].ts.sec)
                return 1;
            if (elementsDatas[a].ts.sec > elementsDatas[b].ts.sec)
                return -1;
            return 0;
        }
        elements.sort(sortPost);
		
		for (var i = 0, l = elements.length; i < l && i < maxPostsPerPage; i++) {
			datas.push(new postElement(elementsDatas[elements[i]], elements[i]));
		}
		if (l > maxPostsPerPage) {
		    nextElements = elements.slice(maxPostsPerPage, elements.length);
            datas.push(Ti.UI.createTableViewRow({
                height: '50dp',
                width: '100%',
                className: 'nextrow',
                clickName: 'next',
                title: String.format(L('next__left'), nextElements.length)
            }));
		}
        
		tableView = Ti.UI.createTableView({
			headerTitle: (elements.length > 0 ? String.format((elements.length > 1 ? L('_wouafs') : L('_wouaf')), elements.length) : L('no_wouaf')),
			top: 0,
			left: 0,
			right: (listHalfScreen ? 1 : 0),
			bottom: 0,
			data: datas,
			separatorColor: font.grey,
			elements: nextElements
		});
		tableView.addEventListener('click', function(e) {
			if (e.rowData.clickName == 'next') {
				var elements = tableView.elements;
				tableView.startLayout();
				tableView.deleteRow(e.index);
				var datas = [];
				for (var i = 0, l = elements.length; i < l && i < maxPostsPerPage; i++) {
                    datas.push(new postElement(elementsDatas[elements[i]], elements[i]));
                }
                if (l > maxPostsPerPage) {
                    elements = elements.slice(maxPostsPerPage, elements.length);
                    datas.push(Ti.UI.createTableViewRow({
                        height: '50dp',
                        width: '100%',
                        className: 'nextrow',
                        clickName: 'next',
                        title: String.format(L('next__left'), elements.length)
                    }));
                }
				tableView.appendRow(datas);
				tableView.elements = elements;
				tableView.finishLayout();
			} else if (e.rowData.clickName == 'row') {
				if (tableView.selectedRow) {
					tableView.selectedRow.setSelected(false);
				}
				if (tableView.selectedRow != e.row) {
					tableView.selectedRow = e.row;
					e.row.setSelected(true);
					Ti.App.fireEvent(showPost, elementsDatas[e.rowData.elementIndex]);
				} else {
					tableView.selectedRow = null;
					Ti.App.fireEvent(closePost);
				}
			}
		});
		self.add(tableView);
	}
	self.clean = function () {
		if (tableView) {
    		self.remove(tableView);
    		tableView = null;
    	}
	}
	return self;
}
module.exports = postsList;