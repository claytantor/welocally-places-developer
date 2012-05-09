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
