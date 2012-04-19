/*
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
		
		var error;
		if (!cfg) {
			error = "Please provide configuration for the widget";
			cfg = {};
		}
		
		// hostname (optional) - the name of the host to use
		if (!cfg.endpoint) {
			cfg.endpoint = 'https://api.welocally.com';
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
			
		this.cfg = cfg;
		
		// Get current script object
		var script = jQuery('SCRIPT');
		script = script[script.length - 1];

		// Build Widget
		this.wrapper = jQuery('<div></div>');
		jQuery(this.wrapper).css('display','none');			
		jQuery(this.wrapper).attr('class','welocally_place_widget');
		jQuery(this.wrapper).attr('id','welocally_place_widget_'+this.cfg.id);
		
		//google maps does not like jquery instances
		this.map_canvas = document.createElement('DIV');
		jQuery(this.map_canvas).css('display','none');	
	    jQuery(this.map_canvas).attr('class','wl_places_place_map_canvas');
		jQuery(this.map_canvas).attr("id","wl_place_map_canvas_widget_"+cfg.id);
		jQuery(this.wrapper).append(this.map_canvas);				
	
		jQuery(script).parent().before(this.wrapper);
		
		return this;
					
	};
	
}

WELOCALLY_PlaceWidget.prototype.setWrapper = function(cfg, wrapper) {
	this.cfg = cfg;
	this.wrapper = wrapper;
	return this;
};

WELOCALLY_PlaceWidget.prototype.loadWithWrapper = function(cfg, map_canvas, wrapper) {
	this.cfg = cfg;
	this.wrapper = wrapper;
	jQuery(this.wrapper).html(map_canvas);
	this.load(map_canvas);
	return this;
};

WELOCALLY_PlaceWidget.prototype.loadRemote = function() {
	this.load(this.map_canvas);
};

WELOCALLY_PlaceWidget.prototype.loadLocal = function(placeJson) {
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

WELOCALLY_PlaceWidget.prototype.load = function(map_canvas) {
	var _instance = this;
	
	if(WELOCALLY.util.startsWith(_instance.cfg.id,"WL_")){			
		var surl = _instance.cfg.endpoint +
		'/geodb/place/1_0/'+_instance.cfg.id+'.json?callback=?';
		
		
		jQuery.ajax({
			url: surl,
			dataType: "json",
			success: function(data) {
				_instance.map = _instance.initMapForPlace(data[0],map_canvas);
				_instance.show(data[0]);
				_instance.setMapEvents(_instance.map);
				
				var latlng = new google.maps.LatLng(
						data[0].geometry.coordinates[1], 
						data[0].geometry.coordinates[0]);
				
				//forced to refresh
				setTimeout(function () {
			     	_instance.refreshMap(latlng);
			 	}, 200);
				
			},
			error: function() {
			}
		});
	}		
};	


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
	
	//get the map if its visible and add it
	//jQuery(placeWrapper).append(this.map_canvas);
	
	
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


WELOCALLY_PlaceWidget.prototype.show = function(selectedPlace) {	
	this.wrapper.append(this.makePlaceContent(selectedPlace, this.cfg));	
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