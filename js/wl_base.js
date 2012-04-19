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
