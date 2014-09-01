var tabs = require("sdk/tabs");
var timers = require("sdk/timers");

let { window: {navigator} } = require('sdk/addon/window');

var prefs = require("sdk/simple-prefs").prefs;

var showTab = function(index) {
	var url = prefs["url"+(index+1)];

	var m = url.replace(/^https?:\/\//i, "");

	for each (var tab in tabs) {
		//console.log(tab.url, tab.url.indexOf(m), m)
		if (tab.url.indexOf(m) >= 0) {
			tab.activate();
			return;
		}
	}

	tabs.open(url);
};

var testGamepadId = /shift/i;

var globalStates = {};

var checkGamePad = function() {
	var gamepads = navigator.getGamepads();
	if (!gamepads) return;

	for (var i = 0, l = gamepads.length; i < l; ++i) {
		var gamepad = gamepads[i];

		if (!gamepad || !testGamepadId.test(gamepad.id)) continue;

		var states = globalStates[gamepad.id];
		if (!states) {
			states = globalStates[gamepad.id] = new Array(gamepad.buttons.length);
		}

		for (var j = 0, ll = gamepad.buttons.length; j < ll; ++j) {
			var button = gamepad.buttons[j];

			if (button.pressed && !states[j]) {
				showTab(j);
			}

			states[j] = button.pressed;
		}
	}
};

timers.setInterval(checkGamePad, 133);

