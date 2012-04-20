/*
	copyright 2012 welocally. NO WARRANTIES PROVIDED
*/
function WELOCALLY_GeoDbSearch (cfg) {		
	
	this.cfg;
	this.jqxhr;
	this.observers;
		
	this.init = function() {
		
		this.initCfg(cfg);
		return this;
		
	};	
}

WELOCALLY_GeoDbSearch.prototype.initCfg = function(cfg) {
	var errors = [];
	if (!cfg) {
		errors.push('Please provide a configuration');
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
	
	if(errors.length>0)
		return errors;
	
	this.cfg = cfg;
	
	return this.cfg;
	
};


WELOCALLY_GeoDbSearch.prototype.search = function() {
	
	//requires event data has the search instance
	var _instance = this;
		
	var query = {
		q: _instance.cfg.q,
		loc: _instance.cfg.loc[0]+'_'+_instance.cfg.loc[1],
		radiusKm: _instance.cfg.radiusKm
	};
		
	var surl = _instance.cfg.endpoint +
		'/geodb/place/1_0/search.json?'+WELOCALLY.util.serialize(query)+"&callback=?";
	
	//notify all observers
	jQuery.each(_instance.cfg.observers, function(i,observer) {
		observer.setStatus(observer.getStatusArea(), 'Finding places','wl_update',true);
	});	
	
					
	jQuery.ajax({
			  url: surl,
			  dataType: "json",
			  success: function(data) {
				//set to result bounds if enough results
				if(data != null && data.length>0){							
					//notify all observers
					jQuery.each(_instance.cfg.observers, function(i,observer) {
						observer.setStatus(observer.getStatusArea(), '','wl_message',false);
						observer.setPlaces(data);
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
