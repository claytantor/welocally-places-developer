/*
	copyright 2012 clay graham. NO WARRANTIES PROVIDED
*/
if (!window.WELOCALLY) {
    window.WELOCALLY = {
    	env: {
    		init: function(){
    			
    		},
    		initJQuery: function(){
		    	if (typeof(jQuery.fn.parseJSON) == "undefined" || typeof(jQuery.parseJSON) != "function") { 
		
		    	    //extensions, this is because prior to 1.4 there was no parse json function
		    		jQuery.extend({
		    			parseJSON: function( data ) {
		    				if ( typeof data !== "string" || !data ) {
		    					return null;
		    				}    
		    				data = jQuery.trim( data );    
		    				if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
		    					.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
		    					.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {    
		    					return window.JSON && window.JSON.parse ?
		    						window.JSON.parse( data ) :
		    						(new Function("return " + data))();    
		    				} else {
		    					jQuery.error( "Invalid JSON: " + data );
		    				}
		    			}
		    		});
		    	}
    		}
    	},
    	ui: {
    		setStatus : function(statusArea, message, type, showloading){
    			var _instance  = this;
    			
    			jQuery(statusArea).html('');
    			jQuery(statusArea).removeClass();
    			jQuery(statusArea).addClass(type);
    			
    			if(showloading){
    				jQuery(statusArea).append(showloading);
    			}
    			
    			jQuery(statusArea).append('<em>'+message+'</em>');
    			
    			if(message != ''){
    				jQuery(statusArea).show();
    			} else {
    				jQuery(statusArea).hide();
    			}	
    			
    		}
    	},
    	util: {
    		getErrorString: function(errorModel){
    			//{"errors":[{"errorMessage":"Please provide the name for your site.","errorCode":104}]}
    			var errorString = '';
    			jQuery.each(errorModel, function(i,item){
    				errorString = errorString+(i+1)+'. '+item.errorMessage+' ';
    			});
    			return errorString;
    		},
    		log: function(logString){
    			if (window.console) console.log(logString);
    		},
    		serialize: function(obj, prefix) {
				var str = [];
				for(var p in obj) {
					var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
					str.push(typeof v == "object" ? 
						serialize(v, k) :
						encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
				return str.join("&");
			},
			trim: function (str) { 
	    			return WELOCALLY.util.ltrim(WELOCALLY.util.rtrim(str), ' '); 
			}, 
			ltrim: function (str) { 
				return str.replace(new RegExp("^[" + ' ' + "]+", "g"), ""); 
			},    		 
			rtrim: function (str) { 
				return str.replace(new RegExp("[" + ' ' + "]+$", "g"), ""); 
			},
			preload: function(arrayOfImages) {
				jQuery(arrayOfImages).each(function(){
					jQuery('<img/>')[0].src = this;
					// Alternatively you could use:
					// (new Image()).src = this;
				});
			},
			update: function() {
					var obj = arguments[0], i = 1, len=arguments.length, attr;
					for (; i<len; i++) {
							for (attr in arguments[i]) {
									obj[attr] = arguments[i][attr];
							}
					}
					return obj;
			},
			escape: function(s) {
					return ((s == null) ? '' : s)
							.toString()
							.replace(/[<>"&\\]/g, function(s) {
									switch(s) {
											case '<': return '&lt;';
											case '>': return '&gt;';
											case '"': return '\"';
											case '&': return '&amp;';
											case '\\': return '\\\\';
											default: return s;
									}
							});
			},
			unescape: function (unsafe) {
				  return unsafe
					  .replace(/&amp;/g, "&")
					  .replace(/&lt;/g, "<")
					  .replace(/&gt;/g, ">")
					  .replace(/&quot;/g, '"')
					  .replace(/&#039;/g, "'");
			},
			notundef: function(a, b) {
					return typeof(a) == 'undefined' ? b : a;
			},
			guidGenerator: function() {
				return (WELOCALLY.util.S4()+WELOCALLY.util.S4()+"-"+
						WELOCALLY.util.S4()+"-"+WELOCALLY.util.S4()+"-"+
						WELOCALLY.util.S4()+"-"+
						WELOCALLY.util.S4()+WELOCALLY.util.S4()+WELOCALLY.util.S4());
			},
			keyGenerator: function() {
				return (WELOCALLY.util.S4()+WELOCALLY.util.S4());
			},
			tokenGenerator: function() {
				 return (WELOCALLY.util.S4()+WELOCALLY.util.S4()+
						WELOCALLY.util.S4()+WELOCALLY.util.S4()+
						WELOCALLY.util.S4()+
						WELOCALLY.util.S4()+WELOCALLY.util.S4()+WELOCALLY.util.S4());
			},
			S4: function() {
			   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			},
			replaceAll: function(txt, replace, with_this) {
				  return txt.replace(new RegExp(replace, 'g'),with_this);
			},
			startsWith: function(sourceString, startsWith) {
				  return sourceString.indexOf(startsWith) == 0;
			},
			getParameter: function ( queryString, parameterName ) {
				   // Add "=" to the parameter name (i.e. parameterName=value)
				   var parameterName = parameterName + "=";
				   if ( queryString.length > 0 ) {
				      // Find the beginning of the string
				      begin = queryString.indexOf ( parameterName );
				      // If the parameter name is not found, skip it, otherwise return the value
				      if ( begin != -1 ) {
				         // Add the length (integer) to the beginning
				         begin += parameterName.length;
				         // Multiple parameters are separated by the "&" sign
				         end = queryString.indexOf ( "&" , begin );
				      if ( end == -1 ) {
				         end = queryString.length
				      }
				      // Return the string
				      return unescape ( queryString.substring ( begin, end ) );
				   }
				   // Return "null" if no parameter has been found
				   return "null";
				   }
			}
    	}    	
    };
}
/*
	copyright 2012 welocally. NO WARRANTIES PROVIDED
*/
function WELOCALLY_GoogleDocsLoad (cfg) {		
	
	this.cfg;
	this.jqxhr;
	this.observers;
		
	this.init = function() {
		
		var error = [];
		if (!cfg) {
			error.push("Please provide configuration for the widget");
			cfg = {};
		}
		
		if (!cfg.key) {
			error.push("A key is required to open a spreadsheet.");
		}
		
		if (!cfg.row) {
			error.push("Please specify the row for the place.");
		}
				
		this.cfg = cfg;
				
		return this;
		
	};
	
}


WELOCALLY_GoogleDocsLoad.prototype.load = function() {
	
	//requires event data has the search instance
	var _instance = this;
		
	var surl = 'https://spreadsheets.google.com/feeds/cells/'+_instance.cfg.key
		+'/default/public/basic?alt=json-in-script&callback=?';
	
	//notify all observers
	jQuery.each(_instance.cfg.observers, function(i,observer) {
		WELOCALLY.ui.setStatus(observer.getStatusArea(), 'Finding places','wl_update',true);
	});	
		
	jQuery.ajax({
		  url: surl,
		  dataType: "jsonp",
		  success: function(data) {
			//set to result bounds if enough results
			if(data != null && data.errors != null) {
				//notify all observers
				jQuery.each(_instance.cfg.observers, function(i,observer) {
					WELOCALLY.ui.setStatus(observer.getStatusArea(),'ERROR:'+WELOCALLY.util.getErrorString(data.errors), 'wl_error', false);
				});
				
				
			} else if(data != null && data.feed.entry.length>0){			
				var places = [];
				var row = 0;
				var currentPlace = null;
								
				jQuery.each(data.feed.entry, function(i,entry) {
					
					var rownum = eval(entry.title.$t.substring(1, entry.title.$t.length));
					if(rownum==_instance.cfg.row){	 
						if((/A/).test(entry.title.$t)){
							if(currentPlace != null)
								places.push(currentPlace);
							currentPlace = {};
							currentPlace.properties = {};
							currentPlace.properties.classifiers = [];
							currentPlace.properties.classifiers[0] = {};
							currentPlace.geometry = {};
							currentPlace.geometry.type = 'Point';
							currentPlace.geometry.coordinates = [];							
							currentPlace.properties.name = entry.content.$t;							
						} else if((/B/).test(entry.title.$t)){
							currentPlace.properties.address = entry.content.$t;							
						} else if((/C/).test(entry.title.$t)){
							currentPlace.properties.city = entry.content.$t;						
						} else if((/D/).test(entry.title.$t)){
							currentPlace.properties.province = entry.content.$t;						
						} else if((/E/).test(entry.title.$t)){
							currentPlace.properties.postcode = entry.content.$t;							
						} else if((/F/).test(entry.title.$t)){
							currentPlace.properties.country = entry.content.$t;						
						} else if((/G/).test(entry.title.$t)){
							currentPlace.properties.website = entry.content.$t;						
						} else if((/H/).test(entry.title.$t)){
							currentPlace.properties.phone = entry.content.$t;							
						} else if((/I/).test(entry.title.$t)){
							currentPlace.properties.classifiers[0].type = entry.content.$t;						
						} else if((/J/).test(entry.title.$t)){
							currentPlace.properties.classifiers[0].category = entry.content.$t;						
						} else if((/K/).test(entry.title.$t)){
							currentPlace.properties.classifiers[0].subcategory = entry.content.$t;							
						} else if((/L/).test(entry.title.$t)){
							currentPlace.geometry.coordinates[1] = entry.content.$t;					
						} else if((/M/).test(entry.title.$t)){
							currentPlace.geometry.coordinates[0] = entry.content.$t;		
						} 
					}					
				});
									
				//notify all observers
				jQuery.each(_instance.cfg.observers, function(i,observer) {					
					WELOCALLY.ui.setStatus(observer.getStatusArea(), '','wl_message',false);
					if(currentPlace != null)
						observer.load(currentPlace);
				});
				
			} else {
			
				jQuery.each(_instance.cfg.observers, function(i,observer) {
					WELOCALLY.ui.setStatus(observer.getStatusArea(), 'No results were found matching your search.','wl_warning',false);						
				});	
				
			}														
		}
	});
	

	
	
	return false;

};
/*
	copyright 2012 welocally. NO WARRANTIES PROVIDED
*/
function WELOCALLY_GoogleDocsSearch (cfg) {		
	
	this.cfg;
	this.jqxhr;
	this.observers;
		
	this.init = function() {
		
		var error = [];
		if (!cfg) {
			error.push("Please provide configuration for the widget");
			cfg = {};
		}
		
		if (!cfg.key) {
			error.push("A key is required to open a spreadsheet.");
		}
				
		if (!cfg.zoom) {
			cfg.zoom = 16;
		}
		
		if (!cfg.location) {
			cfg.location = new google.maps.LatLng(
			38.548165, 
			-96.064453);
		}
		
		if (!cfg.showShare) {
			cfg.showShare = false;
		}
					
		this.cfg = cfg;
				
		return this;
		
	};
	
}


WELOCALLY_GoogleDocsSearch.prototype.search = function() {
	
	//requires event data has the search instance
	var _instance = this;
		
	var surl = 'https://spreadsheets.google.com/feeds/cells/'+_instance.cfg.key
		+'/default/public/basic?alt=json-in-script&callback=?';
	
	//notify all observers
	jQuery.each(_instance.cfg.observers, function(i,observer) {
		observer.setStatus(observer.getStatusArea(), 'Finding places','wl_update',true);
	});	
		
	jQuery.ajax({
		  url: surl,
		  dataType: "jsonp",
		  success: function(data) {
			//set to result bounds if enough results
			if(data != null && data.errors != null) {
				//notify all observers
				jQuery.each(_instance.cfg.observers, function(i,observer) {
					observer.setStatus(observer.getStatusArea(),'ERROR:'+WELOCALLY.util.getErrorString(data.errors), 'wl_error', false);
				});
				
				
			} else if(data != null && data.feed.entry.length>0){			
				var places = [];
				var row = 0;
				var currentPlace = null;
								
				jQuery.each(data.feed.entry, function(i,entry) {
					
					var rownum = eval(entry.title.$t.substring(1, entry.title.$t.length));
					if(rownum>1){	
						if((/A/).test(entry.title.$t)){
							if(currentPlace != null)
								places.push(currentPlace);
							currentPlace = {};
							currentPlace.properties = {};
							currentPlace.properties.classifiers = [];
							currentPlace.properties.classifiers[0] = {};
							currentPlace.geometry = {};
							currentPlace.geometry.type = 'Point';
							currentPlace.geometry.coordinates = [];							
							currentPlace.properties.name = entry.content.$t;							
						} else if((/B/).test(entry.title.$t)){
							currentPlace.properties.address = entry.content.$t;							
						} else if((/C/).test(entry.title.$t)){
							currentPlace.properties.city = entry.content.$t;						
						} else if((/D/).test(entry.title.$t)){
							currentPlace.properties.province = entry.content.$t;						
						} else if((/E/).test(entry.title.$t)){
							currentPlace.properties.postcode = entry.content.$t;							
						} else if((/F/).test(entry.title.$t)){
							currentPlace.properties.country = entry.content.$t;						
						} else if((/G/).test(entry.title.$t)){
							currentPlace.properties.website = entry.content.$t;						
						} else if((/H/).test(entry.title.$t)){
							currentPlace.properties.phone = entry.content.$t;							
						} else if((/I/).test(entry.title.$t)){
							currentPlace.properties.classifiers[0].type = entry.content.$t;						
						} else if((/J/).test(entry.title.$t)){
							currentPlace.properties.classifiers[0].category = entry.content.$t;						
						} else if((/K/).test(entry.title.$t)){
							currentPlace.properties.classifiers[0].subcategory = entry.content.$t;							
						} else if((/L/).test(entry.title.$t)){
							currentPlace.geometry.coordinates[1] = entry.content.$t;					
						} else if((/M/).test(entry.title.$t)){
							currentPlace.geometry.coordinates[0] = entry.content.$t;		
						} 
					}					
				});
				
				if(currentPlace != null)
					places.push(currentPlace);
					
				//notify all observers
				jQuery.each(_instance.cfg.observers, function(i,observer) {
					observer.setStatus(observer.getStatusArea(), '','wl_message',false);
					observer.setPlaces(places);
				});
				
			} else {
			
				jQuery.each(_instance.cfg.observers, function(i,observer) {
					observer.setStatus(observer.getStatusArea(), 'No results were found matching your search.','wl_warning',false);						
				});	
				
			}														
		}
	});
	

	
	
	return false;

};
/*
	Derived from Google Utility Library Infobox
	Code license
	Apache License 2.0
	http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
	
*/

/**
 * @name WELOCALLY_InfoBox cfg
 * @class This class represents the optional parameter passed to the {@link InfoBox} constructor.
 * @property {string|Node} content The content of the InfoBox (plain text or an HTML DOM node).
 * @property {boolean} disableAutoPan Disable auto-pan on <tt>open</tt> (default is <tt>false</tt>).
 * @property {number} maxWidth The maximum width (in pixels) of the InfoBox. Set to 0 if no maximum.
 * @property {Size} pixelOffset The offset (in pixels) from the top left corner of the InfoBox
 *  (or the bottom left corner if the <code>alignBottom</code> property is <code>true</code>)
 *  to the map pixel corresponding to <tt>position</tt>.
 * @property {LatLng} position The geographic location at which to display the InfoBox.
 * @property {number} zIndex The CSS z-index style value for the InfoBox.
 *  Note: This value overrides a zIndex setting specified in the <tt>boxStyle</tt> property.
 * @property {string} boxClass The name of the CSS class defining the styles for the InfoBox container.
 *  The default name is <code>infoBox</code>.
 * @property {Object} [boxStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the InfoBox. Style values defined here override those that may
 *  be defined in the <code>boxClass</code> style sheet. If this property is changed after the
 *  InfoBox has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the InfoBox before the new style values are applied.
 * @property {string} closeBoxMargin The CSS margin style value for the close box.
 *  The default is "2px" (a 2-pixel margin on all sides).
 * @property {string} closeBoxURL The URL of the image representing the close box.
 *  Note: The default is the URL for Google's standard close box.
 *  Set this property to "" if no close box is required.
 * @property {Size} infoBoxClearance Minimum offset (in pixels) from the InfoBox to the
 *  map edge after an auto-pan.
 * @property {boolean} isHidden Hide the InfoBox on <tt>open</tt> (default is <tt>false</tt>).
 * @property {boolean} alignBottom Align the bottom left corner of the InfoBox to the <code>position</code>
 *  location (default is <tt>false</tt> which means that the top left corner of the InfoBox is aligned).
 * @property {string} pane The pane where the InfoBox is to appear (default is "floatPane").
 *  Set the pane to "mapPane" if the InfoBox is being used as a map label.
 *  Valid pane names are the property names for the <tt>google.maps.MapPanes</tt> object.
 * @property {boolean} enableEventPropagation Propagate mousedown, click, dblclick,
 *  and contextmenu events in the InfoBox (default is <tt>false</tt> to mimic the behavior
 *  of a <tt>google.maps.InfoWindow</tt>). Set this property to <tt>true</tt> if the InfoBox
 *  is being used as a map label. iPhone note: This property setting has no effect; events are
 *  always propagated.
 */

/**
 * Creates an InfoBox with the options specified in {@link InfoBoxOptions}.
 *  Call <tt>InfoBox.open</tt> to add the box to the map.
 * @constructor
 * @param {cfg} [options]
 */
function WELOCALLY_InfoBox (cfg) {	

	  cfg = cfg || {};

	  google.maps.OverlayView.apply(this, arguments);

	  // Standard options (in common with google.maps.InfoWindow):
	  //
	  this.content_ = cfg.content || "";
	  this.disableAutoPan_ = cfg.disableAutoPan || false;
	  this.maxWidth_ = cfg.maxWidth || 0;
	  this.pixelOffset_ = cfg.pixelOffset || new google.maps.Size(0, 0);
	  this.position_ = cfg.position || new google.maps.LatLng(0, 0);
	  this.zIndex_ = cfg.zIndex || null;

	  // Additional options (unique to InfoBox):
	  //
	  this.boxClass_ = cfg.boxClass || "infoBox";
	  this.boxStyle_ = cfg.boxStyle || {};
	  this.closeBoxMargin_ = cfg.closeBoxMargin || "2px";
	  this.closeBoxURL_ = cfg.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
	  if (cfg.closeBoxURL === "") {
	    this.closeBoxURL_ = "";
	  }
	  this.infoBoxClearance_ = cfg.infoBoxClearance || new google.maps.Size(1, 1);
	  this.isHidden_ = cfg.isHidden || false;
	  this.alignBottom_ = cfg.alignBottom || false;
	  this.pane_ = cfg.pane || "floatPane";
	  this.enableEventPropagation_ = cfg.enableEventPropagation || false;

	  this.div_ = null;
	  this.closeListener_ = null;
	  this.eventListener1_ = null;
	  this.eventListener2_ = null;
	  this.eventListener3_ = null;
	  this.moveListener_ = null;
	  this.contextListener_ = null;
	  this.fixedWidthSet_ = null;
	}

	/* InfoBox extends OverlayView in the Google Maps API v3.
	 */
	WELOCALLY_InfoBox.prototype = new google.maps.OverlayView();

	/**
	 * Creates the DIV representing the InfoBox.
	 * @private
	 */
	WELOCALLY_InfoBox.prototype.createInfoBoxDiv_ = function () {

	  var bw;
	  var me = this;

	  // This handler prevents an event in the InfoBox from being passed on to the map.
	  //
	  var cancelHandler = function (e) {
	    e.cancelBubble = true;

	    if (e.stopPropagation) {

	      e.stopPropagation();
	    }
	  };

	  // This handler ignores the current event in the InfoBox and conditionally prevents
	  // the event from being passed on to the map. It is used for the contextmenu event.
	  //
	  var ignoreHandler = function (e) {

	    e.returnValue = false;

	    if (e.preventDefault) {

	      e.preventDefault();
	    }

	    if (!me.enableEventPropagation_) {

	      cancelHandler(e);
	    }
	  };

	  if (!this.div_) {

	    this.div_ = document.createElement("div");

	    this.setBoxStyle_();

	    if (typeof this.content_.nodeType === "undefined") {
	      this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
	    } else {
	      this.div_.innerHTML = this.getCloseBoxImg_();
	      this.div_.appendChild(this.content_);
	    }

	    // Add the InfoBox DIV to the DOM
	    this.getPanes()[this.pane_].appendChild(this.div_);

	    this.addClickHandler_();

	    if (this.div_.style.width) {

	      this.fixedWidthSet_ = true;

	    } else {

	      if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {

	        this.div_.style.width = this.maxWidth_;
	        this.div_.style.overflow = "auto";
	        this.fixedWidthSet_ = true;

	      } else { // The following code is needed to overcome problems with MSIE

	        bw = this.getBoxWidths_();

	        this.div_.style.width = (this.div_.offsetWidth - bw.left - bw.right) + "px";
	        this.fixedWidthSet_ = false;
	      }
	    }

	    this.panBox_(this.disableAutoPan_);

	    if (!this.enableEventPropagation_) {

	      // Cancel event propagation.
	      //
	      this.eventListener1_ = google.maps.event.addDomListener(this.div_, "mousedown", cancelHandler);
	      this.eventListener2_ = google.maps.event.addDomListener(this.div_, "click", cancelHandler);
	      this.eventListener3_ = google.maps.event.addDomListener(this.div_, "dblclick", cancelHandler);
	      this.eventListener4_ = google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
	        this.style.cursor = "default";
	      });
	      
	    }

	    this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);

	    /**
	     * This event is fired when the DIV containing the InfoBox's content is attached to the DOM.
	     * @name InfoBox#domready
	     * @event
	     */
	    google.maps.event.trigger(this, "domready");
	  }
	};

	/**
	 * Returns the HTML <IMG> tag for the close box.
	 * @private
	 */
	WELOCALLY_InfoBox.prototype.getCloseBoxImg_ = function () {

	  var img = "";

	  
	  if (this.closeBoxURL_ !== "") {
		  var offset = 64;
		  img='<span style=" float: right; cursor: pointer; display:block; width: 16px; height: 16px;'+
			' background:url(' + this.closeBoxURL_ + ') -'+
			offset+'px 0px; background-repeat:no-repeat; margin: 3px;" />';
	  }

	  return img;
	};

	/**
	 * Adds the click handler to the InfoBox close box.
	 * @private
	 */
	WELOCALLY_InfoBox.prototype.addClickHandler_ = function () {

	  var closeBox;

	  if (this.closeBoxURL_ !== "") {

	    closeBox = this.div_.firstChild;
	    this.closeListener_ = google.maps.event.addDomListener(closeBox, 'click', this.getCloseClickHandler_());

	  } else {

	    this.closeListener_ = null;
	  }
	};

	/**
	 * Returns the function to call when the user clicks the close box of an InfoBox.
	 * @private
	 */
	WELOCALLY_InfoBox.prototype.getCloseClickHandler_ = function () {

	  var me = this;

	  return function (e) {

	    // 1.0.3 fix: Always prevent propagation of a close box click to the map:
	    e.cancelBubble = true;

	    if (e.stopPropagation) {

	      e.stopPropagation();
	    }

	    me.close();

	    /**
	     * This event is fired when the InfoBox's close box is clicked.
	     * @name InfoBox#closeclick
	     * @event
	     */
	    google.maps.event.trigger(me, "closeclick");
	  };
	};

	/**
	 * Pans the map so that the InfoBox appears entirely within the map's visible area.
	 * @private
	 */
	WELOCALLY_InfoBox.prototype.panBox_ = function (disablePan) {

	  var map;
	  var bounds;
	  var xOffset = 0, yOffset = 0;

	  if (!disablePan) {

	    map = this.getMap();

	    if (map instanceof google.maps.Map) { // Only pan if attached to map, not panorama

	      if (!map.getBounds().contains(this.position_)) {
	      // Marker not in visible area of map, so set center
	      // of map to the marker position first.
	        map.setCenter(this.position_);
	      }

	      bounds = map.getBounds();

	      var mapDiv = map.getDiv();
	      var mapWidth = mapDiv.offsetWidth;
	      var mapHeight = mapDiv.offsetHeight;
	      var iwOffsetX = this.pixelOffset_.width;
	      var iwOffsetY = this.pixelOffset_.height;
	      var iwWidth = this.div_.offsetWidth;
	      var iwHeight = this.div_.offsetHeight;
	      var padX = this.infoBoxClearance_.width;
	      var padY = this.infoBoxClearance_.height;
	      var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

	      if (pixPosition.x < (-iwOffsetX + padX)) {
	        xOffset = pixPosition.x + iwOffsetX - padX;
	      } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
	        xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
	      }
	      if (this.alignBottom_) {
	        if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
	          yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
	        } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
	          yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
	        }
	      } else {
	        if (pixPosition.y < (-iwOffsetY + padY)) {
	          yOffset = pixPosition.y + iwOffsetY - padY;
	        } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
	          yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
	        }
	      }

	      if (!(xOffset === 0 && yOffset === 0)) {

	        // Move the map to the shifted center.
	        //
	        var c = map.getCenter();
	        map.panBy(xOffset, yOffset);
	      }
	    }
	  }
	};

	/**
	 * Sets the style of the InfoBox by setting the style sheet and applying
	 * other specific styles requested.
	 * @private
	 */
	WELOCALLY_InfoBox.prototype.setBoxStyle_ = function () {

	  var i, boxStyle;

	  if (this.div_) {

	    // Apply style values from the style sheet defined in the boxClass parameter:
	    this.div_.className = this.boxClass_;

	    // Clear existing inline style values:
	    this.div_.style.cssText = "";
	    //jQuery(this.div_).find('table').border='1';

	    // Apply style values defined in the boxStyle parameter:
	    boxStyle = this.boxStyle_;
	    for (i in boxStyle) {

	      if (boxStyle.hasOwnProperty(i)) {

	        this.div_.style[i] = boxStyle[i];
	      }
	    }

	    // Fix up opacity style for benefit of MSIE:
	    //
	    if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {

	      this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")";
	    }

	    // Apply required styles:
	    //
	    this.div_.style.position = "absolute";
	    this.div_.style.visibility = 'hidden';
	    if (this.zIndex_ !== null) {

	      this.div_.style.zIndex = this.zIndex_;
	    }
	  }
	};

	/**
	 * Get the widths of the borders of the InfoBox.
	 * @private
	 * @return {Object} widths object (top, bottom left, right)
	 */
	WELOCALLY_InfoBox.prototype.getBoxWidths_ = function () {

	  var computedStyle;
	  var bw = {top: 0, bottom: 0, left: 0, right: 0};
	  var box = this.div_;

	  if (document.defaultView && document.defaultView.getComputedStyle) {

	    computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");

	    if (computedStyle) {

	      // The computed styles are always in pixel units (good!)
	      bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
	      bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
	      bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
	      bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
	    }

	  } else if (document.documentElement.currentStyle) { // MSIE

	    if (box.currentStyle) {

	      // The current styles may not be in pixel units, but assume they are (bad!)
	      bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
	      bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
	      bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
	      bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
	    }
	  }

	  return bw;
	};

	/**
	 * Invoked when <tt>close</tt> is called. Do not call it directly.
	 */
	WELOCALLY_InfoBox.prototype.onRemove = function () {

	  if (this.div_) {

	    this.div_.parentNode.removeChild(this.div_);
	    this.div_ = null;
	  }
	};

	/**
	 * Draws the InfoBox based on the current map projection and zoom level.
	 */
	WELOCALLY_InfoBox.prototype.draw = function () {

	  this.createInfoBoxDiv_();

	  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

	  this.div_.style.left = (pixPosition.x + this.pixelOffset_.width) + "px";
	  
	  if (this.alignBottom_) {
	    this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px";
	  } else {
	    this.div_.style.top = (pixPosition.y + this.pixelOffset_.height) + "px";
	  }

	  if (this.isHidden_) {

	    this.div_.style.visibility = 'hidden';

	  } else {

	    this.div_.style.visibility = "visible";
	  }
	};

	/**
	 * Sets the options for the InfoBox. Note that changes to the <tt>maxWidth</tt>,
	 *  <tt>closeBoxMargin</tt>, <tt>closeBoxURL</tt>, and <tt>enableEventPropagation</tt>
	 *  properties have no affect until the current InfoBox is <tt>close</tt>d and a new one
	 *  is <tt>open</tt>ed.
	 * @param {InfoBoxOptions} cfg
	 */
	WELOCALLY_InfoBox.prototype.setOptions = function (cfg) {
	  if (typeof cfg.boxClass !== "undefined") { // Must be first

	    this.boxClass_ = cfg.boxClass;
	    this.setBoxStyle_();
	  }
	  if (typeof cfg.boxStyle !== "undefined") { // Must be second

	    this.boxStyle_ = cfg.boxStyle;
	    this.setBoxStyle_();
	  }
	  if (typeof cfg.content !== "undefined") {

	    this.setContent(cfg.content);
	  }
	  if (typeof cfg.disableAutoPan !== "undefined") {

	    this.disableAutoPan_ = cfg.disableAutoPan;
	  }
	  if (typeof cfg.maxWidth !== "undefined") {

	    this.maxWidth_ = cfg.maxWidth;
	  }
	  if (typeof cfg.pixelOffset !== "undefined") {

	    this.pixelOffset_ = cfg.pixelOffset;
	  }
	  if (typeof cfg.alignBottom !== "undefined") {

	    this.alignBottom_ = cfg.alignBottom;
	  }
	  if (typeof cfg.position !== "undefined") {

	    this.setPosition(cfg.position);
	  }
	  if (typeof cfg.zIndex !== "undefined") {

	    this.setZIndex(cfg.zIndex);
	  }
	  if (typeof cfg.closeBoxMargin !== "undefined") {

	    this.closeBoxMargin_ = cfg.closeBoxMargin;
	  }
	  if (typeof cfg.closeBoxURL !== "undefined") {

	    this.closeBoxURL_ = cfg.closeBoxURL;
	  }
	  if (typeof cfg.infoBoxClearance !== "undefined") {

	    this.infoBoxClearance_ = cfg.infoBoxClearance;
	  }
	  if (typeof cfg.isHidden !== "undefined") {

	    this.isHidden_ = cfg.isHidden;
	  }
	  if (typeof cfg.enableEventPropagation !== "undefined") {

	    this.enableEventPropagation_ = cfg.enableEventPropagation;
	  }

	  if (this.div_) {

	    this.draw();
	  }
	};

	/**
	 * Sets the content of the InfoBox.
	 *  The content can be plain text or an HTML DOM node.
	 * @param {string|Node} content
	 */
	WELOCALLY_InfoBox.prototype.setContent = function (content) {
	  this.content_ = content;

	  if (this.div_) {

	    if (this.closeListener_) {

	      google.maps.event.removeListener(this.closeListener_);
	      this.closeListener_ = null;
	    }

	    // Odd code required to make things work with MSIE.
	    //
	    if (!this.fixedWidthSet_) {

	      this.div_.style.width = "";
	    }

	    if (typeof content.nodeType === "undefined") {
	      this.div_.innerHTML = this.getCloseBoxImg_() + content;
	    } else {
	      this.div_.innerHTML = this.getCloseBoxImg_();
	      this.div_.appendChild(content);
	    }

	    // Perverse code required to make things work with MSIE.
	    // (Ensures the close box does, in fact, float to the right.)
	    //
	    if (!this.fixedWidthSet_) {
	      this.div_.style.width = this.div_.offsetWidth + "px";
	      if (typeof content.nodeType === "undefined") {
	        this.div_.innerHTML = this.getCloseBoxImg_() + content;
	      } else {
	        this.div_.innerHTML = this.getCloseBoxImg_();
	        // Note: don't append the content node again
	      }
	    }

	    this.addClickHandler_();
	  }

	  /**
	   * This event is fired when the content of the InfoBox changes.
	   * @name InfoBox#content_changed
	   * @event
	   */
	  google.maps.event.trigger(this, "content_changed");
	};

	/**
	 * Sets the geographic location of the InfoBox.
	 * @param {LatLng} latlng
	 */
	WELOCALLY_InfoBox.prototype.setPosition = function (latlng) {

	  this.position_ = latlng;

	  if (this.div_) {

	    this.draw();
	  }

	  /**
	   * This event is fired when the position of the InfoBox changes.
	   * @name InfoBox#position_changed
	   * @event
	   */
	  google.maps.event.trigger(this, "position_changed");
	};

	/**
	 * Sets the zIndex style for the InfoBox.
	 * @param {number} index
	 */
	WELOCALLY_InfoBox.prototype.setZIndex = function (index) {

	  this.zIndex_ = index;

	  if (this.div_) {

	    this.div_.style.zIndex = index;
	  }

	  /**
	   * This event is fired when the zIndex of the InfoBox changes.
	   * @name InfoBox#zindex_changed
	   * @event
	   */
	  google.maps.event.trigger(this, "zindex_changed");
	};

	/**
	 * Returns the content of the InfoBox.
	 * @returns {string}
	 */
	WELOCALLY_InfoBox.prototype.getContent = function () {

	  return this.content_;
	};

	/**
	 * Returns the geographic location of the InfoBox.
	 * @returns {LatLng}
	 */
	WELOCALLY_InfoBox.prototype.getPosition = function () {

	  return this.position_;
	};

	/**
	 * Returns the zIndex for the InfoBox.
	 * @returns {number}
	 */
	WELOCALLY_InfoBox.prototype.getZIndex = function () {

	  return this.zIndex_;
	};

	/**
	 * Shows the InfoBox.
	 */
	WELOCALLY_InfoBox.prototype.show = function () {

	  this.isHidden_ = false;
	  if (this.div_) {
	    this.div_.style.visibility = "visible";
	  }
	};

	/**
	 * Hides the InfoBox.
	 */
	WELOCALLY_InfoBox.prototype.hide = function () {

	  this.isHidden_ = true;
	  if (this.div_) {
	    this.div_.style.visibility = "hidden";
	  }
	};
	
	
	
	WELOCALLY_InfoBox.prototype.setOffset = function(contentsBox){
		
		//temp holder WELOCALLY.places.map.infobox.baseOffsetX
		var infobox = this;
		var base_cfg = 
		{
			baseOffsetX: 0,
			baseOffsetY: 0
	    };
		
		
		var width = 
			eval(jQuery(contentsBox)
					.css('width')
					.replace('px',''));
		if(width==0){
			width = eval(jQuery(contentsBox)
					.css('min-width')
					.replace('px',''));
		}
		
		var offsetX = ((width/2)+10)*-1;
		infobox.pixelOffset_ = 
			new google.maps.Size(
					offsetX+base_cfg.baseOffsetX, 
					base_cfg.baseOffsetY);
	};

	/**
	 * Adds the InfoBox to the specified map or Street View panorama. If <tt>anchor</tt>
	 *  (usually a <tt>google.maps.Marker</tt>) is specified, the position
	 *  of the InfoBox is set to the position of the <tt>anchor</tt>. If the
	 *  anchor is dragged to a new location, the InfoBox moves as well.
	 * @param {Map|StreetViewPanorama} map
	 * @param {MVCObject} [anchor]
	 */
	WELOCALLY_InfoBox.prototype.open = function (map, anchor) {

	  var me = this;

	  if (anchor) {
	    this.position_ = anchor.getPosition();
	    this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function () {
	      me.setPosition(this.getPosition());
	    });
	  }

	  this.setMap(map);

	  /*if (this.div_) {

	    this.panBox_();
	  }*/
	};

	/**
	 * Removes the InfoBox from the map.
	 */
	WELOCALLY_InfoBox.prototype.close = function () {

	  if (this.closeListener_) {

	    google.maps.event.removeListener(this.closeListener_);
	    this.closeListener_ = null;
	  }

	  if (this.eventListener1_) {

	    google.maps.event.removeListener(this.eventListener1_);
	    google.maps.event.removeListener(this.eventListener2_);
	    google.maps.event.removeListener(this.eventListener3_);
	    google.maps.event.removeListener(this.eventListener4_);
	    this.eventListener1_ = null;
	    this.eventListener2_ = null;
	    this.eventListener3_ = null;
	    this.eventListener4_ = null;
	  }

	  if (this.moveListener_) {

	    google.maps.event.removeListener(this.moveListener_);
	    this.moveListener_ = null;
	  }

	  if (this.contextListener_) {

	    google.maps.event.removeListener(this.contextListener_);
	    this.contextListener_ = null;
	  }

	  this.setMap(null);
};/*
	copyright 2012 welocally. NO WARRANTIES PROVIDED
*/

function WELOCALLY_PlaceWidget (cfg) {	
	
	this.selectedSection;
	this.cfg;
	this.wrapper;
	this.map_canvas;
	this.map;
	this.placehoundPath;
	this.imagePath;	
	
	this.init = function() {
		
		var errors = this.initCfg(cfg);
		
		// Get current script object
		var script = jQuery('SCRIPT');
		script = script[script.length - 1];
				
		if(errors){
			var errorsArea = jQuery('<div></div>');
			WELOCALLY.ui.setStatus(errorsArea, errors,'wl_error');
			jQuery(script).parent().before(errorsArea);			
		} else {
			// Build Widget
			this.wrapper = this.makeWrapper();	
			jQuery(script).parent().before(this.wrapper);		
		}
		
		return this;
					
	};	
}

WELOCALLY_PlaceWidget.prototype.initCfg = function(cfg) {
	var errors = [];
	if (!cfg) {
		errors.push('Please provide a configuration');
	}
	
	// hostname (optional) - the name of the host to use
	if (!cfg.endpoint) {
		cfg.endpoint = 'https://api.welocally.com';
	}
	
	// hostname (optional) - the name of the host to use
	if (!cfg.requestPath) {
		cfg.requestPath = '/geodb/place/1_0/';
	}
	
	if (!cfg.imagePath) {
		cfg.imagePath = 'http://placehound.com/images/marker_all_base.png';
	}
	
	if (!cfg.placehoundPath) {
		cfg.placehoundPath = 'http://placehound.com';
	}
	
	if (!cfg.zoom) {
		cfg.zoom = 16;
	}
	
	if (!cfg.showShare) {
		cfg.showShare = false;
	}
	
	//look in query string
	if (!cfg.id) {
		cfg.id = WELOCALLY.util.keyGenerator();
	}
	
	if(errors.length>0)
		return errors;
	
	this.cfg = cfg;
};


WELOCALLY_PlaceWidget.prototype.makeWrapper = function() { 
	// Build Widget
	var _instance = this;
	
	// Build Widget
	var wrapper = jQuery('<div></div>');
	jQuery(wrapper).css('display','none');			
	jQuery(wrapper).attr('class','welocally_place_widget');
	jQuery(wrapper).attr('id','welocally_place_widget_'+_instance.cfg.id);
	
	//status area
	this.statusArea = jQuery('<div class="wl_place_status"></div>');
	jQuery(wrapper).append(this.statusArea);
	
	
	//google maps does not like jquery instances
	this.map_canvas = document.createElement('DIV');
	jQuery(this.map_canvas).css('display','none');	
    jQuery(this.map_canvas).attr('class','wl_places_place_map_canvas');
	jQuery(this.map_canvas).attr("id","wl_place_map_canvas_widget_"+_instance.cfg.id);
	jQuery(wrapper).append(this.map_canvas);
	
	
	this.wrapper = wrapper; 
	
	return this.wrapper;
	
};



WELOCALLY_PlaceWidget.prototype.load = function(placeJson) {
	var _instance = this;
	_instance.map = _instance.initMapForPlace(placeJson,_instance.map_canvas);
	_instance.show(placeJson);
	_instance.setMapEvents(_instance.map);
	
	var latlng = new google.maps.LatLng(
			placeJson.geometry.coordinates[1], 
			placeJson.geometry.coordinates[0]);
	
	//forced to refresh
	setTimeout(function () {
     	_instance.refreshMap(latlng);
 	}, 200);
	
};

//WELOCALLY_PlaceWidget.prototype.load = function(map_canvas) {
//	var _instance = this;
//	
//	if(WELOCALLY.util.startsWith(_instance.cfg.id,"WL_")){			
//		var surl = _instance.cfg.endpoint +
//			_instance.cfg.requestPath+_instance.cfg.id+'.json?callback=?';
//		
//		
//		_instance.jqxhr = jQuery.ajax({
//			url: surl,
//			dataType: "json",
//			beforeSend: function(jqXHR){
//				_instance.jqxhr = jqXHR;
//				_instance.jqxhr.setRequestHeader("key", _instance.cfg.key);
//				_instance.jqxhr.setRequestHeader("token", _instance.cfg.token);
//		  	},
//			success: function(data) {
//				if(data != null && data.errors != null) {
//					var errorsArea = jQuery('<div></div>');
//					WELOCALLY.ui.setStatus(errorsArea, WELOCALLY.util.getErrorString(data.errors),'wl_error');
//					jQuery(_instance.wrapper).attr('class','');
//					jQuery(_instance.wrapper).html(errorsArea);
//					jQuery(_instance.wrapper).show();
//					
//				} else if(data != null && data.length>0){	
//					_instance.show(data[0]);
//					_instance.setMapEvents(_instance.map);
//					
//					var latlng = new google.maps.LatLng(
//							data[0].geometry.coordinates[1], 
//							data[0].geometry.coordinates[0]);
//					
//					//forced to refresh
//					setTimeout(function () {
//				     	_instance.refreshMap(latlng);
//				 	}, 200);
//				} else {
//					var errorsArea = jQuery('<div></div>');
//					WELOCALLY.ui.setStatus(errorsArea, 'No data was returned.','wl_update');
//					jQuery(_instance.wrapper).attr('class','');
//					jQuery(_instance.wrapper).html(errorsArea);
//					jQuery(_instance.wrapper).show();
//				}
//				
//				
//			},
//			error: function() {
//			}
//		});
//	}		
//};	


WELOCALLY_PlaceWidget.prototype.initMapForPlace = function(place, map_canvas) {
	
	var _instance = this;
	
	var latlng = new google.maps.LatLng(
			place.geometry.coordinates[1], 
			place.geometry.coordinates[0]);
    
	var options = {
      center: latlng,
      zoom: _instance.cfg.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    if(_instance.cfg.styles){
		options.styles = _instance.cfg.styles;
	}
    
    var map = new google.maps.Map(
    	map_canvas, 
    	options);

    var markerIcon =  
		new google.maps.MarkerImage(
				_instance.cfg.imagePath, 
				new google.maps.Size(32, 32), 
				new google.maps.Point(32, 0));

    
    var marker = new google.maps.Marker({
    	position: latlng,
    	map: map,
    	icon: markerIcon
      });
    jQuery(map).show();
    jQuery(map_canvas).show();
    
      
    return map;

};


WELOCALLY_PlaceWidget.prototype.setMapEvents = function(map){
	var tilesHandle = google.maps.event.addListener(map, 'tilesloaded', function() {
		
		//jQuery('.wl_places_place_map_canvas').find('img').css('max-width','none');
		google.maps.event.removeListener(tilesHandle);
		WELOCALLY.util.preload([
				 'http://maps.google.com/mapfiles/openhand.cur'
		]);          				
	}); 
	
	var idleHandle = google.maps.event.addListener(map, 'idle', function() {
		
		//jQuery(map).find('img').css('max-width','none');
		WELOCALLY.util.preload([
				 'http://maps.google.com/mapfiles/openhand.cur'
		]);          				
	}); 
},

WELOCALLY_PlaceWidget.prototype.makePlaceContent = function(selectedPlace, cfg) {
	
	var _instance= this;
	
	var placeWrapper = jQuery('<div class="wl_places_place_wrapper"></div>');
	
	//set the map location, hide if cfg to off
	if(!_instance.cfg.hidePlaceSectionMap){
		jQuery(placeWrapper).append(this.map_canvas);
		_instance.map = _instance.initMapForPlace(selectedPlace, this.map_canvas);
	} else {
		jQuery(this.map_canvas).hide();
	}
	
	if (selectedPlace.properties.titlelink != null
					&& selectedPlace.properties.titlelink != '') {

		jQuery(placeWrapper).append(
				'<a href="'
						+ selectedPlace.properties.titlelink
						+ '"><div class="wl_places_place_name">'
						+ selectedPlace.properties.name
						+ '</a></div>');

	} else {
		jQuery(placeWrapper)
				.append(
						'<div class="wl_places_place_name">' + selectedPlace.properties.name + '</div>');
	}
	
	jQuery(placeWrapper)
	.append('<div class="wl_places_place_adress">'+selectedPlace.properties.address+' '+
		selectedPlace.properties.city+
		' '+selectedPlace.properties.province+
		' '+selectedPlace.properties.postcode+'</div>');
	
	if(selectedPlace.properties.phone != null) {
		jQuery(placeWrapper)
			.append('<div class="wl_places_place_phone">'+selectedPlace.properties.phone+'</div>');
	}

	//make the link items
	var links = jQuery('<div id="wl_place_links" class="wl_place_links"></div>');
	
	if (selectedPlace.properties.titlelink != null
					&& selectedPlace.properties.titlelink != '') {
		jQuery(links)
				.append(
						'<div class="wl_places_place_post_link"><a target="_new" href="' + 
						selectedPlace.properties.titlelink + '">See Post</a></div>');
	} 	
	
	if(selectedPlace.properties.website != null && 
		selectedPlace.properties.website != '' ) {
		var website = selectedPlace.properties.website;
		if(selectedPlace.properties.website.indexOf('http://') == -1) {
			website = 'http://'+selectedPlace.properties.website;				
		}
		
		jQuery(links)
			.append('<div class="wl_places_place_web_link"><a target="_new" href="'+website+'">Website</a></div>');

	} 

	if(selectedPlace.properties.city != null && 
		selectedPlace.properties.province != null){
			var qS = selectedPlace.properties.city+" "+
				selectedPlace.properties.province;
			if(selectedPlace.properties.address != null)
				qs=selectedPlace.properties.address+" "+qS;
			if(selectedPlace.properties.postcode != null)
				qs=qs+" "+selectedPlace.properties.postcode;
			var qVal = qs.replace(" ","+");
			
			jQuery(links)
			.append('<div class="wl_places_place_driving_link"><a href="http://maps.google.com/maps?f=d&source=s_q&hl=en&geocode=&q='+
				qVal+'" target="_new">Directions</a></div>');		
	}
	
	//embed wrapper
	var embed = jQuery('<div id="wl_place_embed" class="wl_place_embed"></div>');
	if(!cfg.showShare){
		jQuery(embed).hide();
	}
	
	//tag
	//we wont make a permalink or tag unless an id is available for the place
	if(selectedPlace._id)
	{
		//share link
		var shareToggle = jQuery('<div class="wl_places_place_share_link"></div>');
		var shareLink = jQuery('<a href="#" target="_new">Share</a>');
		jQuery(shareLink).click(function() {
			jQuery(embed).toggle();
			return false;
		});
		jQuery(shareToggle).append(shareLink);
		jQuery(links).append(shareToggle);
		
		var wlSelectedTagArea = jQuery('<div id="wl_place_widget_tag" class="wl_places_place_tag"></div>');	
		var title = jQuery('<div class="wl_place_title">Use this tag to share with <a href="http://welocally.com/?page_id=2" target="_new">Welocally Places</a> for <a href="http://wordpress.org/extend/plugins/welocally-places/" target="_new">WordPress</a></div>');
		jQuery(wlSelectedTagArea).append(title);
		
		//the tag
		var tag = '[welocally id="'+selectedPlace._id+'" /]';
		var inputAreaTag = jQuery('<input/>');
		jQuery(inputAreaTag).val(tag);	
		jQuery(wlSelectedTagArea).append(inputAreaTag);
		
		jQuery(embed).append(wlSelectedTagArea); 
		
		//placehound permalink
		jQuery(embed).append('<div class="wl_place_title"><a target="_new" href="'+_instance.cfg.placehoundPath+'/place.html?id='+selectedPlace._id+'">Place Permalink</a></div>');		
		
		jQuery(placeWrapper).append(embed); 

	}
	
	jQuery(placeWrapper).append(links);
		
	
	return placeWrapper;
};

//for place selectors
WELOCALLY_PlaceWidget.prototype.show = function(selectedPlace) {	
	this.wrapper.html(this.makePlaceContent(selectedPlace, this.cfg));	  
	jQuery(this.wrapper).show();
};


WELOCALLY_PlaceWidget.prototype.refreshMap = function(searchLocation) {
	var _instance = this;
	google.maps.event.trigger(_instance.map, 'resize');
	
	
	var listener = google.maps.event.addListener(_instance.map, "tilesloaded", function() {

		_instance.map.setCenter(searchLocation);
		
		google.maps.event.removeListener(listener);
		
	});
	
};


//use map status area
WELOCALLY_PlaceWidget.prototype.getStatusArea = function (){
	var _instance = this;
	return _instance.statusArea;
};/*
	copyright 2012 welocally. NO WARRANTIES PROVIDED
*/

function WELOCALLY_PlacesMultiWidget (cfg) {	
	
	this.map;
	this.map_canvas;
	this.searchLocation;
	this.cfg;
	this.options;
	this.placeMarkers = [];
	this.mapStatus;
	this.results;
	this.selectedSection;
	this.infoBox;
	this.boxText;
	this.selectedMarkerIndex;

	this.init = function() {
		
		var errors = this.initCfg(cfg);
		
		// Get current script object
		var script = jQuery('SCRIPT');
		script = script[script.length - 1];
		
		if(errors){
			var errorsArea = jQuery('<div></div>');
			WELOCALLY.ui.setStatus(errorsArea, errors,'wl_error');
			jQuery(script).parent().before(errorsArea);			
		} else {
			// Build Widget
			this.wrapper = this.makeWrapper();	
			jQuery(script).parent().before(this.wrapper);		
		}
				
		return this;
					
	};
	
}

WELOCALLY_PlacesMultiWidget.prototype.initCfg = function(cfg) {
	var errors = [];
	if (!cfg) {
		errors.push("Please provide configuration for the widget");
		cfg = {};
	}
	
	//temporary until we can deal with refresh event
	if (!cfg.hidePlaceSectionMaps) {
		cfg.hidePlaceSectionMap=true;
	}
	
	if (!cfg.id) {
		cfg.id = WELOCALLY.util.keyGenerator();
	}
	
	// hostname (optional) - the name of the host to use
	if (!cfg.endpoint) {
		cfg.endpoint = 'https://api.welocally.com';
	}
	
	if (!cfg.baseUrl) {
		cfg.baseUrl = 'http://placehound.com';
	}
	
	if (!cfg.imagePath) {
		cfg.imagePath = cfg.baseUrl+'/images/marker_all_base.png';
	}
	
	if (cfg.showSelection==null) {
		cfg.showSelection = true;
	}
		
	if (!cfg.zoom) {
		cfg.zoom = 16;
	}
	
	if(errors.length>0)
		return errors;
	
	this.cfg = cfg;
					
	
};

WELOCALLY_PlacesMultiWidget.prototype.makeWrapper = function() {
	// Build wrapper
	var _instance = this;
	var wrapper = jQuery('<div></div>');		
	jQuery(wrapper).attr('class','wl_places_multi_widget');
	jQuery(wrapper).attr('id','wl_places_multi_widget_'+_instance.cfg.id);
	
	//selected area
	this.selectedSection = 
		jQuery('<div class="wl_places_multi_selected"></div>');
	jQuery(this.selectedSection).css('display', 'none');
	jQuery(wrapper).append(this.selectedSection);
	
	
	//google maps does not like jquery instances
	this.map_canvas = document.createElement('DIV');
	jQuery(this.map_canvas).css('display','none');	
    jQuery(this.map_canvas).attr('class','wl_places_multi_map_canvas');
	jQuery(this.map_canvas).attr("id","welocally_places_multi_map_canvas_"+_instance.cfg.id);
	jQuery(wrapper).append(this.map_canvas);
	
	this.mapStatus = jQuery('<div class="wl_places_multi_map_status"></div>');
	jQuery(wrapper).append(this.mapStatus);
	
	//results
	this.results = 
		jQuery('<ol id="wl_places_mutli_selectable"></ol>');	
	
	jQuery(this.results).css('display','none');
	jQuery( this.results ).bind( "selectableselected", {instance: this}, this.selectedItemHandler);
	jQuery(wrapper).append(this.results);
	

	if(this.cfg.places != null && this.cfg.places.length>0){
		this.setPlaces(this.cfg.places);
	} else {
		//just the map init
		this.map = this.initMap(this.map_canvas);
	}
	
	jQuery(this.results).selectable({ cancel: 'a' });
	
	//make sure it knows its own wrapper
	this.wrapper = wrapper;
	
	return wrapper;
};

WELOCALLY_PlacesMultiWidget.prototype.setPlaces = function(places) {
	var _instance = this;
	if(_instance.map == null){
		_instance.map = _instance.initMapForPlaces(_instance.cfg.places, _instance.map_canvas, _instance.placeMarkers);
	} else {
		_instance.deleteOverlays(_instance.placeMarkers);
	    _instance.addPlaces(_instance.map, places, _instance.placeMarkers);
	    _instance.setMapEvents(_instance.map, _instance.placeMarkers);		
	}	
	
	if(!_instance.cfg.hideMap){
		jQuery(_instance.map_canvas).show();
	}
	
};

WELOCALLY_PlacesMultiWidget.prototype.initMap = function(map_canvas) {
	
	var _instance = this;
    
	var options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: _instance.cfg.zoom
    };
    
    if(_instance.cfg.styles){
		options.styles = _instance.cfg.styles;
	}
    
    var map = new google.maps.Map(
    	map_canvas, 
        options);
    
    //init the infobox for the map
    _instance.boxText = document.createElement("div");
    _instance.boxText.className = "wl_places_mutli_infobox"; 
    _instance.boxText.innerHTML = "none selected";
    
    _instance.infoBox = this.makeInfoBox(_instance.boxText);
    
    return map;
	
};

WELOCALLY_PlacesMultiWidget.prototype.initMapForPlaces = function(places, map_canvas, placeMarkers) {
		
    var _instance = this;
    var map = _instance.initMap(map_canvas);
    
       
    //add all the markers
    _instance.addPlaces(map, places, placeMarkers);
           
    _instance.setMapEvents(map, placeMarkers);
        
    return map;
    

};

WELOCALLY_PlacesMultiWidget.prototype.makeInfoBox = function(boxText){
	
	var _instance = this;

	var infobox_cfg = {
				content: boxText
				,disableAutoPan: false
				,maxWidth: 0
				,pixelOffset: new google.maps.Size(0, 5)
				,zIndex: null
				,boxStyle: { 
				  	opacity: 0.85
				 }
				,closeBoxMargin: '2px 2px 2px 2px'
				,closeBoxURL: _instance.cfg.imagePath
				,infoBoxClearance: new google.maps.Size(1, 1)
				,isHidden: false
				,pane: "floatPane"
				,enableEventPropagation: false
			};
			
	var ib = new WELOCALLY_InfoBox(infobox_cfg);
	return ib;
};


WELOCALLY_PlacesMultiWidget.prototype.addPlaces = function(map, places, placeMarkers){
	
	var _instance = this;
	var bounds = new google.maps.LatLngBounds();
	
	_instance.deleteOverlays(_instance.placeMarkers);
	jQuery(_instance.results).empty();
	jQuery(_instance.results).hide();
	
	_instance.infoBox.close();
	
	jQuery.each(places, function(i,item){
		
		var latlng = new google.maps.LatLng(item.geometry.coordinates[1], item.geometry.coordinates[0]);
		bounds.extend(latlng);
		
		var itemLocation = 
			new google.maps.LatLng(
				item.geometry.coordinates[1], 
				item.geometry.coordinates[0]);	
				
		var markerIcon = null;
		
		if(_instance.cfg.showLetters){
			//fourth element
			var offset = (3*32)+(32*i);
			
			markerIcon = 
				new google.maps.MarkerImage(_instance.cfg.imagePath, new google.maps.Size(32, 32), new google.maps.Point(offset, 0));		
			
		} else {
			
			markerIcon = 
				new google.maps.MarkerImage(_instance.cfg.imagePath, new google.maps.Size(32, 32), new google.maps.Point(32, 0));

		
		}
		
		_instance.addMarker(
			i,	
			placeMarkers,
			map,
			itemLocation,
			item,
			markerIcon);
		
		//add result to list
		if(_instance.cfg.showSelection){
			var listItem = _instance.makeItemContents(item,i, true);
			
			if(_instance.cfg.overrideSelectableStyle){
				jQuery(listItem).attr('style',_instance.cfg.overrideSelectableStyle);
			}
			
			
			jQuery(listItem).attr('id','wl_places_mutli_selectable_'+i);
			jQuery(listItem).attr('class','ui-widget-content');
			
			jQuery(listItem).mouseover(function() {
		    	jQuery(this).css('cursor', 'pointer');
		    });
			
			jQuery(_instance.results).append(jQuery(listItem));
			
			jQuery(_instance.results).show();
		}
		
	
	});		
	
	map.fitBounds(_instance.makeMinimumBounds(bounds));
	
	
	var markerIconLocation = 
		new google.maps.MarkerImage(_instance.cfg.imagePath, new google.maps.Size(32, 32), new google.maps.Point(0, 0));
	
	_instance.addMarkerCenter(
			placeMarkers,
			map,
			bounds.getCenter(),
			markerIconLocation);
	
	//forced to refresh
	setTimeout(function () {
     	_instance.refreshMap(bounds.getCenter(), bounds);
 	}, 100);
	
 	setTimeout(function () {
     	_instance.refreshMap(bounds.getCenter(), bounds);
 	}, 200);
	
	
};

WELOCALLY_PlacesMultiWidget.prototype.makeMinimumBounds= function(bounds){
	var _instance = this;
	
	var distance = _instance.getBoundsDistance(bounds);
	
	if(distance<0.03){
		var p1 = new google.maps.LatLng(bounds.getCenter().lat()-0.002, bounds.getCenter().lng()-0.002 );
		var p2 = new google.maps.LatLng(bounds.getCenter().lat()+0.002, bounds.getCenter().lng()+0.002 );	
		bounds.extend(p1);
		bounds.extend(p2);
	}

	return bounds;

};

WELOCALLY_PlacesMultiWidget.prototype.makeItemContents = function (item, i, showMarker) {
	
	var _instance = this;
	
	var wrapper = jQuery('<li></il>');
	
	if(_instance.cfg.showLetters && showMarker){
		
		//fourth element
		var offset = (3*32)+(32*i);
		
		var markerImage = jQuery('<span class="wl_selectable_marker" style="display:block; width: 32px; height: 32px;'+
				' background:url(' + _instance.cfg.imagePath + ') -'+
				offset+'px 0px; background-repeat:no-repeat;" />');
		
		jQuery(wrapper).append(markerImage);
				
	} 
	
		
	if(_instance.cfg.idLinks){
			jQuery(wrapper).append('<a href="'+_instance.cfg.baseUrl+'/place.html?id='
							+ item.id
							+ '"><div class="selectable_title">'
							+ item.properties.name
							+ '</a></div>');
		
	} else if (item.properties.titlelink != null
			&& item.properties.titlelink != '') {

		jQuery(wrapper).append('<a href="'
						+ item.properties.titlelink
						+ '"><div class="selectable_title">'
						+ item.properties.name
						+ '</a></div>');
		
	} else {
		jQuery(wrapper)
			.append('<div class="selectable_title">' + item.properties.name + '</div>');
	}

	
	jQuery(wrapper)
		.append(jQuery('<div class="selectable_address">'+
			item.properties.address+' '+item.properties.city+' '+item.properties.province+'</div>'));
	if(item.distance){
		jQuery(wrapper)
		.append(jQuery('<div class="selectable_distance">'+
				item.distance.toFixed(2)+'km </div>'));
	}

	
	
	wrapper.item = item;
			
	return wrapper;
};

WELOCALLY_PlacesMultiWidget.prototype.setMapEvents = function(map, markers){
	
	var _instance = this;
	
	google.maps.event.addListener(map, 'zoom_changed', function() {
		zoomChangeBoundsListener = google.maps.event.addListener(map, 'bounds_changed', function(event) {
			
			_instance.setStatus(
					_instance.mapStatus, 
					_instance.makeMapStatus(_instance.map, _instance.placeMarkers) , 
					'wl_message', false);

		});
	});		
	
	var tilesHandle = google.maps.event.addListener(map, 'tilesloaded', function() {
		
		_instance.setStatus(
				_instance.mapStatus, 
				_instance.makeMapStatus(_instance.map, _instance.placeMarkers) , 
				'wl_message', false);
		
		google.maps.event.removeListener(tilesHandle);
		WELOCALLY.util.preload([
				 'http://maps.google.com/mapfiles/openhand.cur'
		]);          				
	}); 
	
},

WELOCALLY_PlacesMultiWidget.prototype.selectedItemHandler = function(event, ui) {
	
	var _instance = null;
	
	var marker;
	var index;
	
	if(this.nodeName=='OL'){
		_instance = event.data.instance;
		index = ui.selected.id.replace("wl_places_mutli_selectable_","");
		marker = _instance.placeMarkers[index];		
		_instance.selectedPlace = 
			_instance.placeMarkers[index].item;
		
	} else if(this.nodeName=='MARKER'){
		_instance = this.instance;
		marker = this;
		index = marker.index;
		jQuery('#wl_places_mutli_selectable_'+_instance.selectedMarkerIndex).removeClass('ui-selected');
		
		jQuery('#wl_places_mutli_selectable_'+index).addClass('ui-selected');
			
		_instance.selectedPlace = 
			this.item; 
	}
	
	_instance.selectedMarkerIndex = index;
		
	//should probably do this
	marker.map.panTo(marker.position);
	
	//lets do this the jquery way	
	var contents = _instance.makeItemContents(_instance.selectedPlace, 0, false);	
	jQuery(contents).attr('class','wl_places_multi_infobox');
	jQuery(contents).css('min-width','100px');
	jQuery(contents).css('min-height','30px');				
	jQuery(_instance.boxText).html(contents);
	 
	jQuery(_instance.boxText).find('li a img').load(function(){
		jQuery(_instance.boxText).find('li a').css('background','none').css('padding','0px'); 
		jQuery(_instance.boxText).css('line-height','5px');
		jQuery(_instance.boxText).find('ul').css('margin','0px');
	});
	
	_instance.infoBox.setOffset(contents);
	_instance.infoBox.open(marker.map, marker);
	
	if(_instance != null){
		//broadcast to listeners
		if(_instance.cfg.observers != null && _instance.cfg.observers.length>0){
			
			jQuery.each(_instance.cfg.observers, function(i,item){
				item.show(_instance.selectedPlace);
			});
			jQuery(_instance.getSelectedArea()).show();
		}	
	}

};

//will remove all overlays except for the search location
WELOCALLY_PlacesMultiWidget.prototype.resetOverlays=function (location, markersArray) {
	
	var _instance = this; 
	_instance.map.setCenter(location);
	jQuery(_instance.map_canvas).show();
	jQuery(_instance.map).show();
	
	_instance.deleteOverlays(markersArray);
	_instance.placeMarkers = [];

};

WELOCALLY_PlacesMultiWidget.prototype.refreshMap = function(searchLocation, bounds) {
	var _instance = this;
	google.maps.event.trigger(_instance.map, 'resize');
	
	if(_instance.placeMarkers.length==0){
		var markerIconLocation = 
			new google.maps.MarkerImage(_instance.cfg.imagePath, new google.maps.Size(32, 32), new google.maps.Point(0, 0));

		_instance.addMarkerCenter(
				_instance.placeMarkers,
				_instance.map,
				searchLocation,
				markerIconLocation);
				
	}
	
	_instance.setStatus(
			_instance.mapStatus, 
			_instance.makeMapStatus(_instance.map, _instance.placeMarkers) , 
			'wl_message', false);
	
	_instance.map.setCenter(searchLocation);
	if(bounds != null){
		_instance.map.fitBounds(bounds);
	}
	
	var listener = google.maps.event.addListener(_instance.map, "tilesloaded", function() {

		google.maps.event.removeListener(listener);
		
		_instance.map.setCenter(searchLocation);
						
		_instance.setStatus(
				_instance.mapStatus, 
				_instance.makeMapStatus(_instance.map, _instance.placeMarkers) , 
				'wl_message', false);	
		
	});
	
};


// Shows any overlays currently in the array
WELOCALLY_PlacesMultiWidget.prototype.showOverlays = function (markersArray, map) {
	if (markersArray) {
		for (i in markersArray) {
		  markersArray[i].setMap(map);
		}
	}
};
	
// Deletes all markers in the array by removing references to them
WELOCALLY_PlacesMultiWidget.prototype.deleteOverlays=function (markersArray) {
  if (markersArray) {
	for (i in markersArray) {
	  markersArray[i].setMap(null);
	}	
	markersArray.length = 0;
  }
};


WELOCALLY_PlacesMultiWidget.prototype.colName = function (n) {
	
	var _instance = this;
	
	var s = "";
	while(n >= 0) {
		s = String.fromCharCode(n % 26 + 65) + s;
		n = Math.floor(n / 26) - 1;
	}
	return s;
};



WELOCALLY_PlacesMultiWidget.prototype.addMarker = function(i, markersArray, markerMap, location, item, icon) {
	var _instance = this;
	var marker = new google.maps.Marker({
		index: i,
	    nodeName: 'MARKER',
	    instance: this,
		position: location,
		title: item.properties.name,
		map: markerMap,
		icon: icon,
		item: item
	});
	google.maps.event.addListener(marker, 'click', this.selectedItemHandler);
	markersArray.push(marker);

};

WELOCALLY_PlacesMultiWidget.prototype.addMarkerCenter = function(markersArray, markerMap, location, icon) {
	var _instance = this;
	var marker = new google.maps.Marker({
	    instance: this,
		position: location,
		map: markerMap,
		icon: icon
	});
	markersArray.push(marker);

};
	
// Removes the overlays from the map, but keeps them in the array
WELOCALLY_PlacesMultiWidget.prototype.clearOverlays = function (markersArray) {
  if (markersArray) {
	for (i in markersArray) {
	  markersArray[i].setMap(null);
	}
  }
};


WELOCALLY_PlacesMultiWidget.prototype.getMapRadius = function(map) {
	
	var _instance = this;
	
	if(_instance.map.getBounds()){
		var bounds = _instance.map.getBounds();		
		return _instance.getBoundsDistance(bounds)/2.0;
	} else {
		return 0.0;
	}

	
};

WELOCALLY_PlacesMultiWidget.prototype.getBoundsDistance = function(bounds) {
	var _instance = this;
	
	if(bounds){
		var center = bounds.getCenter();
		var ne = bounds.getNorthEast();
		
		// r = radius of the earth in statute km
		var r = 6378.8;  
		
		// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
		var lat1 = center.lat() / 57.2958; 
		var lon1 = center.lng() / 57.2958;
		var lat2 = ne.lat() / 57.2958;
		var lon2 = ne.lng() / 57.2958;
		
		// distance = circle radius from center to Northeast corner of bounds
		var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
		  Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));	
		
		return dis;
	}

	
	return 0.0;

	
};

WELOCALLY_PlacesMultiWidget.prototype.setStatus = function(statusArea, message, type, showloading){
	var _instance  = this;
	
	jQuery(statusArea).html('');
	jQuery(statusArea).removeClass();
	jQuery(statusArea).addClass(type);
	
	if(showloading){
		//commented for example
		/*jQuery(statusArea).append('<div><img class="wl_ajax_loading" src="'+
				_instance.cfg.imagePath+'/ajax-loader.gif"/></div>');*/
	}
	
	jQuery(statusArea).append('<em>'+message+'</em>');
	
	if(message != ''){
		jQuery(statusArea).show();
	} else {
		jQuery(statusArea).hide();
	}	
	
};

WELOCALLY_PlacesMultiWidget.prototype.makeMapStatus = function (map, markers) {	
	
	var _instance = this;
	
	var status = '';
	
	var radius = _instance.getMapRadius(_instance.map);
	if(markers != null && markers.length>1) {
		status = status + ' places found: '+eval(markers.length-1);
	}
	status = status + ' search radius: '+radius.toFixed(2)+'km';
	status = status + ' zoom: '+map.getZoom();
	return status;
};


//same as selected for this widget when being observer
WELOCALLY_PlacesMultiWidget.prototype.getSelectedArea = function (){
	var _instance = this;
	return _instance.selectedSection;
};

//use map status area
WELOCALLY_PlacesMultiWidget.prototype.getStatusArea = function (){
	var _instance = this;
	return _instance.mapStatus;
};

WELOCALLY_PlacesMultiWidget.prototype.triggerResize = function(){
	
	var _instance = this;
	
	google.maps.event.trigger(_instance.map, 'resize');
		
};

//for place selectors
WELOCALLY_PlacesMultiWidget.prototype.show = function(selectedPlace) {	
	jQuery( this.results ).trigger( "observerselected", {instance: this, type:observer, place:selectedPlace}, this.selectedItemHandler);
	
};




