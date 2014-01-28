
function Qminder() {

	"use strict";

	var BASE_URL = "https://api.qminderapp.com/v1/";
	var secretKey = null;
	
	this.setKey = function(key) {
		apiKey = key;
	};
	
	this.locations = {
		
		list: function(callback) {
      assertNotNull(callback, "Callback function not provided");
			get("locations/", callback);
		},
		
		details: function(id, callback) {
      assertNotNull(id, "Location ID not provided");
      assertNotNull(callback, "Callback function not provided");
      
			get("locations/" + id, callback);
		},
		
		lines: function(id, callback) {
      assertNotNull(id, "Location ID not provided");
      assertNotNull(callback, "Callback function not provided");

			get("locations/" + id + "/lines", callback);
		},
		
		createLine: function(location, name, callback) {
      assertNotNull(location, "Location ID not provided");
      assertNotNull(name, "Name not provided");
      assertNotNull(callback, "Callback function not provided");
		
      var data = "name=" + encodeURIComponent(name);
			postData("locations/" + location + "/lines", data, callback);
		}
	};
	
	this.lines = {
    delete: function(line, callback) {
      deleteRequest("lines/" + line, callback);
    },
    
    reset: function(line, callback) {
      post("lines/" + line + "/reset", callback);
    },
    
    notificationSettings: function(line, callback) {
      get("lines/" + line + "/settings/notifications/waiting", callback);
    },
    
    updateNotificationSettings: function(line, pattern, callback) {
      var data = "pattern=" + encodeURIComponent(pattern);
      postData("lines/" + line + "/settings/notifications/waiting", data, callback);
    }
	};
	
	this.tickets = {
	
    create: function(line, parameters, callback) {
    
      var data = null;
    
      if (parameters) {
        for (var key in parameters) {
          var value = parameters[key];
          data += "&" + key + "=";
          
          if (key == "extra") {
            data += JSON.stringify(value);
          }
          else {
            data += encodeURIComponent(value);
          }
        }
      }
    
      postData("lines/" + line + "/ticket", data, callback);
    },
    
    search: function(parameters, callback) {
      var url = "tickets/search?";
      
      if (parameters) {
        for (var key in parameters) {
          url += "&" + key + "=" + encodeURIComponent(parameters[key]);
        }
      }
      
      get(url, callback);
    },
	
		call: function(lines, user, callback) {
			var data = "lines=" + lines + "&user=" + user;
			postData("tickets/call", data, callback);
		},
		
		details: function(id, callback) {
			get("tickets/" + id, callback);
		}
	};
	
	// Private
	
	var assertNotNull = function(value, message) {
    if (typeof value === "undefined" || value === null) {
      throw message;
    }
	};
	
	var get = function(url, callback) {
    request("GET", url, null, callback);
	};
	
	var post = function(url, callback) {
    request("POST", url, null, callback);
	};
	
	var postData = function(url, data, callback) {
    request("POST", url, data, callback);
	};
	
	var deleteRequest = function(url, callback) {
    request("DELETE", url, null, callback);
	};
	
	var request = function(method, url, data, callback) {
		var request = createCORSRequest(method, BASE_URL + url);
		
		if (!apiKey) {
      throw "Key not set. Please call Qminder.setKey before calling any other methods";
		}

		request.setRequestHeader("X-Qminder-REST-API-Key", apiKey);

		request.onload = function() {
			var responseText = request.responseText;
			var response = JSON.parse(responseText);
			if (callback) {
				callback(response);
			}
			else {
				console.log("No callback function specified");
			}
		};

		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send(data);
	};

	var createCORSRequest = function(method, url) {
		var request = new XMLHttpRequest();
		if ("withCredentials" in request) {
			request.open(method, url, true);
		}
		else if (typeof XDomainRequest != "undefined") {
			request = new XDomainRequest();
			request.open(method, url);
		}
		else {
			request = null;
		}


		return request;
	};
}

var Qminder = new Qminder();
