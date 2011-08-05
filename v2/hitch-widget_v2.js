var REQUIRED_JQUERY = 1.6;
var STORAGE = true;
var USER_AGENT = navigator.userAgent.toLowerCase();
var clearHTML;
var mountHTML;
var yearHTML;
var makeHTML;
var modelHTML;
var styleHTML;
var loaderHTML;
var clearHTML;
var inputHTML;
var resultHTML = '';
var vehicleStr;
var logoImg = '';
var buyNow = false;
var wiring = false;
var accessories = false;
var preloaded = false;
var facebox = true;
var merchant_id = 0;
var customer_id = 0;
var year = '';
var make = '';
var model = '';
var style = '';
var partID = '';
var checkout = 'google';
var jQueryScriptOutputted = false;

init();
initJQuery();

function init(){
    if(document.createStyleSheet) {
        /* Get the declared stylesheet */

        // Make sure we have a style attribute
        var declaredStyle = document.getElementById('configurator').getAttribute('lookupStyle');
        declaredStyle = (declaredStyle == null)?'default':declaredStyle;
        document.createStyleSheet('http://dev.hitchguys.biz/api_dev/'+ declaredStyle +'.css');

    }else{

        /* Get the declared stylesheet */

        // Make sure we have a style attribute
        var declaredStyle = document.getElementById('configurator').getAttribute('lookupStyle');
        declaredStyle = (declaredStyle == null)?'default':declaredStyle;


        // Load configurator stylesheet
        var styles = "@import url(' http://dev.hitchguys.biz/api_dev/" + declaredStyle +".css');";
        var newSS=document.createElement('link');
        newSS.rel='stylesheet';
        newSS.href='data:text/css,'+escape(styles);
        document.getElementsByTagName("head")[0].appendChild(newSS);

    }
}

function initJQuery(){

	// Check to see if jQuery is already installed
	if(typeof(jQuery) == 'undefined'){ // jQuery has not been loaded
		if(!jQueryScriptOutputted){
			// only output the script once...			
			jQueryScriptOutputted = true;

			document.write("<scr"+"ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js\"></scr" + "ipt>");
		}
		setTimeout('initJQuery()',50);
	}else if(!checkVersion('jquery')){
		
		// only output the script once...
		jQueryScriptOutputted = true;

		document.write("<scr"+"ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js\"></scr" + "ipt>");
		setTimeout('initJQuery()',50);
	}else{ // jQuery has been loaded
		jQuery.noConflict();

        jQuery.get('http://docs.curthitch.biz/API/GetYear?dataType=JSONP&callback=loadConfigurator',function(resp){},'jsonp');
        // Create function for getting the URL GET data
        jQuery.extend({
            
            // This function will return all of the GET data inside the 'vars' array
            getUrlVars: function(){
                var vars = [], hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                jQuery.each(hashes,function(i, hash){
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                });
                return vars;
            },

            // This function will return the GET variable declared in the 'name' variable
            // @param : GET variable name to be retrieved
            getUrlVar: function(name){
                var hashes = jQuery.getUrlVars();
                if(hashes != undefined && hashes[name] != undefined){
                    return hashes[name];
                }else{
                    return '';
                }
            }
        });
		
		jQuery.fn.sort = function() {  
			return this.pushStack( [].sort.apply( this, arguments ), []);  
		};
		
        jQuery('#year').live('change',function(){
            year = jQuery(this).val();
            jQuery(this).parent().remove();
            jQuery('#loader').show();
            jQuery.get('http://docs.curthitch.biz/API/GetMake?year='+jQuery(this).val()+'&dataType=JSONP&callback=loadMakes',function(makes){},'jsonp');
			jQuery('#searchStr').text(year);
        });
        
        jQuery('#make').live('change',function(){
            make = jQuery(this).val();
            jQuery(this).parent().remove();
            jQuery('#loader').show();
            jQuery.get('http://docs.curthitch.biz/API/GetModel?year='+year+'&make='+make+'&dataType=JSONP&callback=loadModels',function(models){},'jsonp');
			var str = jQuery('#searchStr').text();
			jQuery('#searchStr').text(str + ' ' + make);
        });
        
        jQuery('#model').live('change',function(){
            model = jQuery(this).val();
            jQuery(this).parent().remove();
            jQuery('#loader').show();
            jQuery.get('http://docs.curthitch.biz/API/GetStyle?year='+year+'&make='+make+'&model='+model+'&dataType=JSONP&callback=loadStyles',function(styles){},'jsonp');
			var str = jQuery('#searchStr').text();
			jQuery('#searchStr').text(str + ' ' + model);
        });
        
        jQuery('#style').live('change',function(){
            jQuery('#hitchResults').html('');
            style = jQuery(this).val();
            jQuery(this).parent().remove();
            jQuery('#loader').show();
			var get_data = 'year='+year+'&make='+encodeURIComponent(make)+'&model='+encodeURIComponent(model)+'&style='+encodeURIComponent(style)+'&cust_id='+customer_id+'&dataType=JSONP&callback=loadParts';
            jQuery.get('http://docs.curthitch.biz/API/GetParts?'+get_data,function(parts){},'jsonp');
        });
	}
}

function sortByClass(a,b){  
     if (a.pClass == b.pClass){
       return 0;
     }
     return a.pClass> b.Class ? 1 : -1;  
 };

function loadConfigurator(years){
    
    // Make sure we have a configurator
    if(jQuery('#configurator').length > 0){
        // Display the configurator
        jQuery('#configurator').css('display','block');
        
        // Create  element to store the vehicle string
        cleanHTML = '<span id="searchStr">&nbsp;</span>';
        jQuery('#configurator').append(cleanHTML);
        jQuery('#searchStr').css('display','block');
        
        // Add the first element to select vehicle yearHTML
        yearHTML = '<label for="year"><select name="year" id="year">';
        yearHTML += '<option value="0">- Select Year - </option>';
        jQuery.each(years,function(i,year){
            yearHTML += '<option value="'+year+'">'+year+'</option>';
        });
        yearHTML += '</select></label>';
        
        jQuery('#configurator').append(yearHTML);
        jQuery('#year').css('display','block');
        
        // Add the make select box
        makeHTML = '<label for="make"><select name="make" id="make">';
        makeHTML += '<option value="0">- Select Make -</option>';
        makeHTML += '</select></label>';
        
        // Add the model select box
        modelHTML = '<label for="model"><select name="model" id="model">';
        modelHTML += '<option value="0">- Select Model -</option>';
        modelHTML += '</select></label>';
        
        // Add the model select box
        styleHTML = '<label for="style"><select name="style" id="style">';
        styleHTML += '<option value="0">- Select Style -</option>';
        styleHTML += '</select></label>';
        
        // We need to create our loading GIF for transition on AJAX calls
        loaderHTML = "<img src='http://dev.hitchguys.biz/api_dev/ajax-loader.gif' id='loader' style='display:none' width='208' height='25' />";
        jQuery('#configurator').append(loaderHTML);
        
        // Create our submit button
        // This won't be displayed until the user selects a style
        inputHTML = '<div class="hold"></div><input type="button" id="lookup_submit" name="lookup_submit" value="Find Hitch" />';
        jQuery('#configurator').append(inputHTML);
        
        // Create link to use as a 'Clear' action on the search results and vehicle string
        clearHTML = '<a href="javascript:clearResult()" style="display:inline; visibility:hidden;" id="clear">Clear</a>';
        jQuery('#configurator').append(clearHTML);
        
        if(jQuery('#hitchResults').get().length == 0){
            resultHTML = '<div id="hitchResults"></div>';
            jQuery('#configurator').append(resultHTML);
        }
        jQuery('#configurator').after('<div style="clear:both"></div>');
        jQuery('#hitchResults').hide();
        
        // Check if the user has defined a logo and store it if they have
        if(jQuery('#configurator').attr('logo') != null && jQuery('#configurator').attr('logo') != ''){
            logoImg = jQuery.trim(jQuery('#configurator').attr('logo'));
        }else{
            logoImg = '';
        }
        
        // Check if we want to display the Buy Now link
        if(jQuery('#configurator').attr('buyNow')){
            buyNow = jQuery('#configurator').attr('buyNow');
            merchant_id = jQuery('#configurator').attr('merchant_id');
			
            // Check which checkout platform we are going to run
            if(!jQuery('#configurator').attr('checkout')){
				// No checkout platform determined                
				buyNow = false;
                merchant_id = 0;
            }else{
				checkout = jQuery('#configurator').attr('checkout');
				if(checkout.toLowerCase() == 'google'){
					// Load the Google mutli-item checkout script
					//var checkout_script = "<script  id='googlecart-script' type='text/javascript' src='https://checkout.google.com/seller/gsc/v2_2/cart.js?mid="+merchant_id+"' integration='jscart-wizard' post-cart-to-sandbox='false' currency='USD'></script>";
					//jQuery('#configurator').after(checkout_script);
				}
			}
        }
        
        // Check if we want to bring wiring results with the hitch
        if(jQuery('#configurator').attr('wiring')){
            if(jQuery('#configurator').attr('wiring') == 'true'){
                wiring = true;
            }
        }
        
        // Check if we want to bring the accessories of a hitch into the hitch details pane
        if(jQuery('#configurator').attr('accessories')){
            if(jQuery('#configurator').attr('accessories') == 'true'){
                accessories = true;
            }
        }
        
        if(jQuery('#configurator').attr('customer_id')){
            customer_id = jQuery('#configurator').attr('customer_id');
        }
        
        // Handle the image swap from little image to big image
        jQuery('.mini').live('click',function(){
            // Get the clicked images source
            var miniSrc = jQuery(this).attr('src');
            // Get the big images source
            var bigSrc = jQuery('#mainImage img').attr('src');
            jQuery(this).attr('src',bigSrc);
            jQuery('#mainImage img').attr('src',miniSrc);
        });
        
        // Get our URL variables
        year = jQuery.getUrlVar('year');
        make = jQuery.getUrlVar('make');
        model = jQuery.getUrlVar('model');
        style = jQuery.getUrlVar('style');
        partID = jQuery.getUrlVar('partID');
        
        // Add the tab effects
        jQuery('.tab_content').hide();
        jQuery('ul.tabs li:first').addClass('active').show();
        jQuery('.tab_content:first').show();
        
        // Handle the click event for our tabs
        jQuery('ul.tabs li').live('click',function(){
            jQuery('ul.tabs li').removeClass('active'); // Remove any 'active' class
            jQuery(this).addClass('active'); // Add 'active' class to selected tab
            jQuery('.tab_content').hide(); // Hide all tab content
            
            var activeTab = jQuery(this).find('a').attr('href'); // Find the id of the 'tab_content' that this link is referencing
            jQuery(activeTab).fadeIn(); // Fade in the active ID content
            return false;
        });
        
        jQuery('.hitchTab').live('click',function(){
            jQuery(this).parent().find('.hitchTab').removeClass('activeHitchTab');
            
            var tab = jQuery(this).find('a').attr('class');
            var tabContainer = jQuery(this).parent().parent().find('.hitchTab_container');
            var tabContent = jQuery(tabContainer).find('.'+tab+'_content');
            
            if(jQuery(tabContent).is(':visible')){
                jQuery(this).removeClass('activeHitchTab');
                jQuery(tabContent).fadeOut();
                jQuery(tabContainer).slideUp();
            }else{
                
            }
        });
        
        jQuery('.imageTab_content img').live('click',function(){
            var imgSrc = jQuery(this).attr('src');
            imgSrc = imgSrc.replace('300x225','1024x768');
            window.open(imgSrc,'','resizeable=yes;toolbar=no;status=no');
        });
        
        jQuery('.prodImg').live('click',function(){
            var imgSrc = jQuery(this).find('img').attr('src');
            imgSrc = imgSrc.replace('300x225','1024x768');
            window.open(imgSrc,'','resizeable=yes;toolbar=no;status=no');
            return false;
        });
        
        if(partID > 0){
            showPart(partID);
        }
    }

}

/*
 * This function will check a given library and see if it is the version that we are looking for
 */
function checkVersion(library){
    if(library == 'jquery'){
        var currentJS = parseFloat(jQuery.fn.jquery);
        if(currentJS < REQUIRED_JQUERY){
            return false;
        }else{
            return true;
        }
    }
    return false;
}

function showPart(partID){
	if(partID > 0){
		jQuery.get('http://docs.curthitch.biz/API/GetPart?partID='+partID+'&dataType=JSONP&callback=loadPart',function(part_result){},'jsonp');
	}
}

function loadPart(part_result){
    if(part_result.partID != undefined){
        console.log(part_result.partID);
    }
}

function loadMakes(makes){
    jQuery('#loader').after(makeHTML);
    jQuery.each(makes,function(i,make){
        jQuery('#make').append('<option>'+make+'</option>');
    });
    jQuery('#loader').hide();
    jQuery('#make').show();
}

function loadModels(models){
    jQuery('#loader').after(modelHTML);
    jQuery.each(models,function(i,model){
        jQuery('#model').append('<option>'+model+'</option>');
    });
    jQuery('#loader').hide();
    jQuery('#model').show();
}

function loadStyles(styles){
    jQuery('#loader').after(styleHTML);
    jQuery.each(styles,function(i,style){
        jQuery('#style').append('<option>'+style+'</option>');
    });
    jQuery('#loader').hide();
    jQuery('#style').show();
}

function loadParts(parts){
		vehicleStr = year + ' ' + make + ' ' + model + ' ' +style; 
	    if(parts != null){
        var resultHTML = '<div id="resultBox_outline"><div id="resultBox"><p id="vehicleStr">' + vehicleStr + '</p>';
        if(logoImg != ''){
            resultHTML += '<div id="logo"><img src="'+ logoImg +'" /></div>';
        }
		
		// We need to spool out the categories that the products are under.
		parts = jQuery(parts).sort(sortByClass);
		var class_array = new Array();
		jQuery.each(parts,function(i,part){
			if(jQuery.inArray(part.pClass,class_array == -1)){
				class_array[i+1] = part.pClass;
			}
		});
		
        resultHTML += '<div style="clear:both"></div><span>( <span id="hitchCount"></span> ) hitches found.</span>';
		if(class_array.length > 0){
			resultHTML += '<ul class="tabs">';
			jQuery.each(class_array,function(i,class){
				if(class != undefined && class.length > 0){
					resultHTML += '<li><a href="class'+i+'_content" title="'+class+'">'+class+'</a></li>';
				}
			});
			resultHTML += '</ul>';
		}
        resultHTML += '</div></div><div style="clear:both"></div>';
        jQuery('#hitchResults').html(resultHTML);
        jQuery.each(parts,function(i,hitch){

            // Begin Compiling HTML
            var shortDesc = hitch.shortDesc.replace("CURT ","");
            var hitchHTML = "<div class='hitch'>";
            hitchHTML += "<span class='shortDesc_link'>";
            hitchHTML += "<img class='curtLogo' src='http://dev.hitchguys.biz/api_dev/logo.png' width='80' style='display:inline' /><span class='trademark'>&trade;</span> <span class='hitchTitle'>" + shortDesc + "</span></a><br /></span>";


            hitchHTML += "<p>Part #: <strong>" +hitch.partID + "</strong></p>";
            hitchHTML += "<a title='" + hitch.shortDesc + "' href='http://graphics.curthitch.biz/masterlibrary/"+ hitch.partID + "/images/" + hitch.partID + "_1024x768_a.jpg' class='image prodImg'>";
            hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+ hitch.partID + "/images/" + hitch.partID + "_300x225_a.jpg' onerror='jQuery(this).parent().remove();' />";
            hitchHTML += "<span>Click to Enlarge</span></a>";
            hitchHTML += "<div class='longDesc'>";
            hitchHTML += "<div class='hitchSpecs'>";
            hitchHTML += "<span><strong>"+hitch.pClass+"</strong></span><br />";
            hitchHTML += "<span><strong>Install Time:</strong> "+0+" minutes</span><br />";
            hitchHTML += "<img src='http://dev.hitchguys.biz/api_dev/file_pdf.png' />";
            hitchHTML += "<a target='_blank' href='http://graphics.curthitch.biz/masterlibrary/"+hitch.partID+"/installsheet/CM_"+hitch.partID+"_INS.pdf'>Instruction Sheet "+hitch.partID+"</a>";
			if(hitch.attributes.length > 0){
				hitchHTML += '<table class="attribute_table">';
				var attr_keys = new Array();
				jQuery.each(hitch.attributes,function(i, attribute){
					if(jQuery.inArray(attribute.key,attr_keys) == -1){
						hitchHTML += '<tr><td>'+attribute.key+'</td><td>'+attribute.value+'</td></tr>';
						attr_keys[i + 1] = attribute.key;
					}
				});
				hitchHTML += '</table>';
			}
			var content_values = new Array();
			jQuery.each(hitch.content,function(i, content_item){
				if(jQuery.inArray(content_item.value,content_values) == -1){
					hitchHTML += '<p class="content_piece">'+content_item.value+'</p>';
					content_values[i + 1] = content_item.value;
				}
			});
            hitchHTML += "</div>";

            hitchHTML += "</div>";
            hitchHTML += "<div class='prodLinks'>";

			hitchHTML += loadCheckout(hitch.listPrice,hitch.shortDesc);
            hitchHTML += "</div>";
            hitchHTML += "<div style='clear:both'></div>";

            // Begin tabbed architecture
            hitchHTML += "<div><div class='hitchTabs'>";
            hitchHTML  += "<div class='hitchTab imageTab activeHitchTab'><a href='"+window.location.href+"' class='imageTab' id='"+hitch.partID+"'>Images</a></div>";
            if(hitch.relatedCount > 0){
                hitchHTML  += "<div class='hitchTab accTab'><a href='"+window.location.href+"' class='accTab' id='"+ hitch.partID +"'>Accessories</a></div>";
            }
            hitchHTML += "</div>";
            hitchHTML += "<div class='hitchTab_container'>";
            hitchHTML += "<div class='imageTab_content content' id='"+hitch.partID+"_content'>";
            hitchHTML += "<img rel='facebox' src='http://graphics.curthitch.biz/masterlibrary/"+hitch.partID+"/images/"+hitch.partID+"_300x225_b.jpg' onerror='jQuery(this).hide()' />";
            hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+hitch.partID+"/images/"+hitch.partID+"_300x225_c.jpg' onerror='jQuery(this).hide()' />";
            hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+hitch.partID+"/images/"+hitch.partID+"_300x225_d.jpg' onerror='jQuery(this).hide()' />";
            hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+hitch.partID+"/images/"+hitch.partID+"_300x225_e.jpg' onerror='jQuery(this).hide()' />";
            hitchHTML += "</div>";
            //hitchHTML += "<div class='wiringTab_content content "+hitch.iVehicleID+"_content'></div>";
            
            if(hitch.relatedCount > 0){

                hitchHTML += "<div class='accTab_content content' id='"+0+"_content'></div>";
                
            }
            hitchHTML += "</div></div>";
            //activeTab = $('#'+hitch.iVehicleID+'_content').get()[0];
            //getWiring(hitch.iVehicleID);
			jQuery('#hitchResults').append(hitchHTML);
        });
		jQuery('#hitchCount').text(parts.length);        
        jQuery('#hitchResults').show();
		
		jQuery('#loader').before(yearHTML);
		jQuery('#year').show();
		jQuery('#searchStr').text('');
    }else{
        jQuery('#hitchResults').html('<p id="vehicleStr">No results for ' + vehicleStr + '</p>');
    }


    jQuery('#loader').hide();
    jQuery('#hitchResults').show();
	
}

function loadCheckout(price,title){
	var checkoutHTML = '';
	console.log(checkout);
	if(merchant_id > 0){
		switch(checkout){
			case 'google':
				checkoutHTML += '<span class="price">'+price+'</span><br />';
				checkoutHTML += '<div class="product">';
				checkoutHTML += '<input type="hidden" class="product-title" value="'+title.replace('""',' inch').replace('"','')+'">';
				checkoutHTML += '<input type="hidden" class="product-price" value="'+price+'">';
				checkoutHTML += '<div class="googlecart-add-button" tabindex="0" role="button" title="Add to cart"></div>';
				checkoutHTML += '</div>';
		}
	}
	console.log(checkoutHTML);
	return checkoutHTML;
}
