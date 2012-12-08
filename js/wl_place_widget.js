/*
	Copyright 2012 clay graham, welocally & RateCred Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
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
	
	jQuery(placeWrapper).append(links);
	
	//userdata wrapper
	if(selectedPlace.properties.userdata != null && selectedPlace.properties.userdata.length>0){
		var embed = jQuery('<div id="wl_place_userdata" class="wl_place_userdata"></div>');

		jQuery.each(selectedPlace.properties.userdata, function(i,item){
			if(/^http:\/\//.test(item.value)) {
				jQuery(embed).append('<div class="wl_place_userdata_item"><a href="'+item.value+'">'+item.name+'</a></div>');
			} else if(/^https:\/\//.test(item.value)) {
				jQuery(embed).append('<div class="wl_place_userdata_item"><a href="'+item.value+'">'+item.name+'</a></div>');
			} else if(/^mailto:/.test(item.value)) {
				jQuery(embed).append('<div class="wl_place_userdata_item"><a href="'+item.value+'">'+item.name+'</a></div>');
			} else if(/^tel:/.test(item.value)) {
				jQuery(embed).append('<div class="wl_place_userdata_item"><a href="'+item.value+'">'+item.name+'</a></div>');
			} else {
				jQuery(embed).append('<div class="wl_place_userdata_item">'+item.name+': '+item.value+'</div>');
			}
			
		});
		
		jQuery(placeWrapper).append(embed);
	}
			
		
	
		
	
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
};