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
};