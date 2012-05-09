/*
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




