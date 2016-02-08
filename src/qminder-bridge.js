function QminderBridge() {

  "use strict";
  
  var onLoadCallback = null;
  var inputFieldListeners = [];
  var keyboardSubmitListeners = [];

  var receiveMessage = function(event) {
    if (event.data.secretKey) {
      if (onLoadCallback) {
        onLoadCallback(event.data.secretKey);
      }
    }
    else if (typeof event.data.inputFieldValue != "undefined") {
      inputFieldListeners.forEach(function(listener) {
        listener(event.data.inputFieldValue);
      });
    }
    else if (event.data.keyboardSubmitted) {
      keyboardSubmitListeners.forEach(function(listener) {
        listener();
      });
    }

  };

  window.addEventListener("message", receiveMessage, false);
  
  this.onLoad = function(callback) {
    onLoadCallback = callback;
  };
  
  this.onInputFieldChange = function(callback) {
    inputFieldListeners.push(callback);
  };
  
  this.onKeyboardSubmit = function(callback) {
    keyboardSubmitListeners.push(callback);
  };
  
  this.showKeyboard = function(type) {
    window.location = "qminder-signin://showKeyboardWithType/" + type;
  };
  
  this.hideKeyboard = function() {
    window.location = "qminder-signin://hideKeyboard";
  };
  
  this.clearInputText = function() {
    window.location = "qminder-signin://clearInputText";
  };
  
  this.setInputText = function(value) {
    window.location = "qminder-signin://setInputText/" + value;
  };
  
  this.playAlertSound = function() {
    parent.postMessage({"command": "playAlertSound"}, "*");
  };
  
  this.getParameters = function() {
    var url = window.location.search.substring(1);
    var variables = url.split("&");

    var result = {};
    variables.forEach(function(variable) {
      var pair = variable.split("=");
      var id = pair[0];
      var value = decodeURIComponent(pair[1]);
      
      if (typeof result[id] == "undefined") {
        result[id] = value;
      }
      else if (typeof result[id] == "string") {
        result[id] = [result[id], value];
      }
      else {
        result[id].push(value);
      }
    });

    return result;
	};
	
	this.getSettings = function() {
  	var settings = this.getParameters().settings;
  	if (settings) {
    	return JSON.parse(settings);
  	}
  	return null;
	};
}

var QminderBridge = new QminderBridge();

