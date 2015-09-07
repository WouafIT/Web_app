function switchBt(switchCnf) {
    var font = require('ui/components/font');
    var switchCnf = switchCnf || {};
    if (Ti.Platform.osname === 'android') {
        //switch
        var switchConf = {
            style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            bottom: '10dp',
            left: '5dp',
            right: '5dp'
        };
        for (var i in switchCnf) {
            switchConf[i] = switchCnf[i];
        }
        var self = Ti.UI.createSwitch(switchConf);
    } else {
        //View
        var selfConf = {
            layout: 'composite',
            top: 0,
            bottom: '10dp',
            left: '5dp',
            right: '5dp',
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL
        };
        for (var i in switchCnf) {
            if (i != 'title' && i != 'value' && i != 'enabled') {
                selfConf[i] = switchCnf[i];
            }
        }
        var self = Ti.UI.createView(selfConf);
        
        //label
        var label = Ti.UI.createLabel({
            color: (switchCnf.enabled === false ? font.grey : font.white),
            font: font.arial22normal,
            left: '70dp',
            right: 0,
            height: Ti.UI.SIZE,
            text: (switchCnf.title || '')
        });
        self.add(label);
        //switch
        var switchConf = {
            style: null,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            left: '5dp',
            titleOn: '',
            titleOff: ''
        };
        for (var i in switchCnf) {
            if (i == 'value' || i == 'enabled') {
                switchConf[i] = switchCnf[i];
            }
        }
        var sw = Ti.UI.createSwitch(switchConf);
        //proxy some switch methods from the view
        self.value = sw.value;
        sw.addEventListener('change', function() {
            self.value = sw.value;
        });
        self.setValue = sw.setValue;
        self.getValue = sw.getValue;
        self.getEnabled = sw.getEnabled;
        self.setEnabled = function (value) {
            label.setColor(!value ? font.grey : font.white);
            sw.setEnabled(value);
        }
        self.add(sw);
    }
    return self;
};

module.exports = switchBt;