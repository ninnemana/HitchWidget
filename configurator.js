/*
 *  This file is going to be used to inject the configurator into the page.
 *  Created by: Alex Ninneman
 *  Created on: October 14, 2010
 */

// Declare our HTML variables as global so we can use them everywhere
var clearHTML;
var mountHTML;
var yearHTML;
var makeHTML;
var modelHTML;
var styleHTML;
var loaderHTML;
var clearHTML;
var inputHTML;
var resultHTML;
var vehicleStr;
var logoImg = '';
var buyNow = false;

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


function initModal(){
    //document.write("<scr" + "ipt type=\"text/javascript\" src=\"http://dev.hitchguys.biz/api_dev/simplemodal.js\"></scr" + "ipt>");   
    document.write("<scr" + "ipt type=\"text/javascript\" src=\"http://dev.hitchguys.biz/api_dev/facebox/facebox.js\"></scr" + "ipt>");   
}

var jQueryScriptOutputted = false;
function initJQuery() {
    //if the jQuery object isn't available
    if (typeof(jQuery) == 'undefined') {
        if (! jQueryScriptOutputted) {
            //only output the script once..
            jQueryScriptOutputted = true;
            
            //output the script (load it from google api)
            document.write("<scr" + "ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js\"></scr" + "ipt>");
            
        }
        setTimeout("initJQuery()", 50);
    } else {    
        //jQuery.noConflict();
        
        (function(jQuery) { 
            
	    /* I had to comment out the if block to check for the configurator element
	     * It was causing issues in Firefox
	    */

            if(jQuery('#configurator').length > 0){
		jQuery('#configurator').css('display','block');
                clearHTML = '<span id="searchStr">&nbsp;</span>';
                jQuery('#configurator').append(clearHTML);
                jQuery('#searchStr').css('display','block');
                
                jQuery('#configurator').css('display','block');
                // Add the first element to select mount type
                mountHTML = '<select name="mount" id="mount" onchange="getYears()">';
                mountHTML += '<option value="">Select Mount</option>';
                mountHTML += '<option value="Front Mount">Front Mount</option>';
                mountHTML += '<option value="Rear Mount">Rear Mount</option>';
                mountHTML += '</select>';
		
                jQuery('#configurator').append(mountHTML);
                jQuery('#mount').css('display','block');

                // Add the second element to select year
                yearHTML = '<select name="year" id="year" onchange="getMake()">';
                yearHTML += '<option value="">Select Year</option>';
                yearHTML += '</select>';
                jQuery('#configurator').append(yearHTML);

                // Add the third element to select make
                makeHTML = '<select name="make" id="make" onchange="getModel()">';
                makeHTML += '<option value="">Select Make</option>';
                makeHTML += '</select>';
                jQuery('#configurator').append(makeHTML);

                // Add the fourth element to select model
                modelHTML = '<select name="model" id="model" onchange="getStyle()">';
                modelHTML += '<option value="">Select Model</option>';
                modelHTML += '</select>';
                jQuery('#configurator').append(modelHTML);

                // Add the fifth element to select style
                styleHTML = '<select name="style" id="style" onchange="styleChange()">';
                styleHTML += '<option value="">Select Style</option>';
                styleHTML += '</select>';
                jQuery('#configurator').append(styleHTML);


                loaderHTML = "<img src='http://dev.hitchguys.biz/api_dev/ajax-loader.gif' id='loader' style='display:none' width='208' height='25' />";
                jQuery('#configurator').append(loaderHTML);

                inputHTML = '<div class="hold"></div><input type="submit" id="lookup_submit" name="lookup_submit" value="Find Hitch" onclick="findHitches()" />';
                jQuery('#configurator').append(inputHTML);
                
                clearHTML = '<a href="javascript:clearResult()" style="display:inline; visibility:hidden;" id="clear">Clear</a>';
                jQuery('#configurator').append(clearHTML);
                
                resultsHTML = '<div id="hitchResults" style="width: 100%"></div>';
                jQuery('#configurator').append(resultsHTML);
                
                // Check if the user has defined a logo and store it if they have
                if(jQuery('#configurator').attr('logo') != null && jQuery('#configurator').attr('logo') != ''){
                    logoImg = jQuery.trim(jQuery('#configurator').attr('logo'));
                }else{
                    //alert('no logo');
                    logoImg = '';
                }
                
                // Check if we want to display the Buy Now link
                if(jQuery('#configurator').attr('buyNow')){
                    buyNow = jQuery('#configurator').attr('buyNow');
                }
                
                jQuery('a.image').live('click',function(){
                    var imgPath = jQuery(this).attr('href');
                    jQuery.facebox({image: imgPath});

                    return false;
                });
                
                
                
                jQuery('.mini').live('click',function(){
                    // Get the clicked images source
                    var miniSrc = jQuery(this).attr('src');
                    // Get the big images source
                    var bigSrc = jQuery('#mainImage img').attr('src');
                    jQuery(this).attr('src',bigSrc);
                    jQuery('#mainImage img').attr('src',miniSrc);
                    
                });
                
                jQuery('.close').live('click',function(){
                    jQuery.facebox.close();
                });
            }
        })(jQuery);
    }
}
initJQuery();
initModal();


function handleMake(data){
    jQuery('#clear').css('visibility','visible');
    jQuery('#make').html('<option value="">Select Make</option>');
    jQuery.each(data,function(i,make){
        jQuery('#make').append('<option>'+ make +'</option>');
    });
    //jQuery('#year').css('display','none');
    jQuery('#loader').css('display','none');
    jQuery('#make').css('display','block');
    jQuery('#selectVehicleMake').focus();
}

function handleModel(data){
    jQuery('#clear').css('visibility','visible');
    jQuery('#model').html('<option value="">Select Model</option>');
    jQuery.each(data,function(i,model){
        jQuery('#model').append('<option>'+ model +'</option>');
    });
    //jQuery('#make').css('display','none');
    jQuery('#loader').css('display','none');
    jQuery('#model').css('display','block');
    jQuery('#selectVehicleModel').focus();
}

function handleStyle(data){
    jQuery('#clear').css('visibility','visible');
    jQuery('#style').html('<option value="">Select Style</option>');
    jQuery.each(data,function(i,style){
        jQuery('#style').append('<option>'+ style +'</option>');
    });
    //jQuery('#model').css('display','none');
    jQuery('#loader').css('display','none');
    jQuery('#style').css('display','block');
    jQuery('#selectVehicleStyle').focus();
}

function styleChange(){
    jQuery('#lookup_submit').css('display','inline');
}

function handleHitch(data){
    if(data == null || data.length == 0){
            noneFound();
    }else{

        var returnType = jQuery('#configurator').attr('hitchdata').toLowerCase();
        if(returnType =="raw"){
            renderHTML(data);
        }else if(returnType == "html"){
            renderHTML(data);
        }
        resetLookup();
    }
}

function getYears(){
    jQuery('#clear').css('visibility','visible');
    var mount = jQuery('#mount').val();
    jQuery('#searchStr').text(mount + ' ');
    jQuery('#searchStr').css('display','block');
    var date = new Date();
    var curYear = date.getFullYear();
    var i = 0;
    jQuery('#year').html('<option value="">Select Year</option>');
    if(jQuery.trim(mount) == 'Front Mount'){
        for(i = date.getFullYear(); i > 1983; i--){
            jQuery('#year').append('<option>' + i + '</option>');
        }
        jQuery('#year').css('display','block');
        jQuery('#mount').css('display','none');
    }else if(jQuery.trim(mount) == 'Rear Mount'){
        for(i = date.getFullYear(); i > 1961; i--){
            jQuery('#year').append('<option>' + i + '</option>');
        }
        jQuery('#year').css('display','block');
        jQuery('#mount').css('display','none');
    }
    jQuery('#selectVehicleYear').focus();
    
}

function getMake(){
    
  //  jQuery('#clear').css('visibility','hidden');
    jQuery('#year').css('display','none');
    jQuery('#loader').css('display','block');
    var year = jQuery('#year').val();
    var mount = jQuery('#mount').val();
    jQuery('#searchStr').html(mount + ' ' + year);
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetMake&year=' + year + '&mount='+mount+'&dataType=JSONP&callback=?', function(data){},'jsonp');
}

function getModel(){
  //  jQuery('#clear').css('visibility','hidden');
    jQuery('#make').css('display','none');
    jQuery('#loader').css('display','block');
    var year = jQuery('#year').val();
    var mount = jQuery('#mount').val();
    var make = jQuery('#make').val();
    jQuery('#searchStr').html(mount + ' ' + year + ' ' + make);
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetModel&mount=' +mount +'&year='+year+'&make='+make+'&dataType=JSONP&callback=?', function(data){},'jsonp');
}

function getStyle(){
  //  jQuery('#clear').css('visibility','hidden');
    jQuery('#model').css('display','none');
    jQuery('#loader').css('display','block');
    var year = jQuery('#year').val();
    var mount = jQuery('#mount').val();
    var make = jQuery('#make').val();
    var model = jQuery('#model').val();
    jQuery('#searchStr').html(mount + ' ' + year + ' ' + make + ' ' + model);
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetStyle&mount=' +mount +'&year='+year+'&make='+make+'&model='+model+'&dataType=JSONP&callback=?', function(data){},'jsonp');
}

function findHitches(){
    jQuery('#lookup_submit').css('display','none');
    jQuery('#clear').css('display','none');
    jQuery('#hitchResults').html('');
    jQuery('#loader').css('display','block');
    var mount = jQuery('#mount').val();
    var year = jQuery('#year').val();
    var make = jQuery('#make').val();
    var model = jQuery('#model').val();
    var style = jQuery('#style').val();
    jQuery('#searchStr').html(mount + ' ' + year + ' ' + make + ' ' + model + ' ' + style);
    vehicleStr = jQuery('#searchStr').text();
    var returnType = jQuery('#configurator').attr('hitchdata');
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetHitch&mount=' +mount +'&year='+year+'&make='+make+'&model='+model+'&style='+style+'&returnType='+returnType+'&dataType=JSONP&callback=?', function(data){},'jsonp');
}

function resetLookup(){
    jQuery('#searchStr').html('&nbsp;');
    jQuery('#searchStr').css('display','block');
    
    jQuery('#lookup_submit').css('display','none');
    jQuery('#style').replaceWith(styleHTML);
    jQuery('#style').css('display','none');
    jQuery('#model').replaceWith(modelHTML);
    jQuery('#model').css('display','none');
    jQuery('#make').replaceWith(makeHTML);
    jQuery('#make').css('display','none');
    jQuery('#year').replaceWith(yearHTML);
    jQuery('#year').css('display','none');
    jQuery('#mount').replaceWith(mountHTML);
    jQuery('#mount').css('display','block');
}

function clearResult(){
    jQuery('#clear').css('visibility','hidden');
    jQuery('#hitchResults').html('');
    resetLookup();
}

function renderHTML(data){
	
	  jQuery('#clear').css('display','inline');
    jQuery('#clear').css('visibility','visible');
    if(data != null){
        var resultHTML = '<div id="resultBox_outline"><div id="resultBox"><p id="vehicleStr">' + vehicleStr + '</p>';
        if(logoImg != ''){
            
            resultHTML += '<div id="logo"><img src="'+ logoImg +'" onerror="jQuery(this).remove()" /></div>';
        }
        resultHTML += '</div></div><div style="clear:both"></div>';
        jQuery('#hitchResults').html(resultHTML);
        jQuery.each(data,function(i,hitch){
            var shortDesc = hitch.vchShortDesc.replace("CURT ","");
            var hitchHTML = "<div class='hitch'>";
            hitchHTML += "<a href='javascript:readMore(" + hitch.iProductID + ")' class='shortDesc_link'>";
            hitchHTML += "<img class='curtLogo' src='http://dev.hitchguys.biz/api_dev/logo.png' width='80' style='display:inline' /><span class='trademark'>&trade;</span> <span class='hitchTitle'>" + shortDesc + "</span></a><br />";

            var bulletStr = '';
            bulletStr += (jQuery.trim(hitch.txtBullet1) != '')?hitch.txtBullet1:'';
            bulletStr += (jQuery.trim(hitch.txtBullet2) != '')?hitch.txtBullet2:'';
            bulletStr += (jQuery.trim(hitch.txtBullet3) != '')?hitch.txtBullet3:'';

            hitchHTML += "<span class='txtBullets'>" + bulletStr + "</span>";
            hitchHTML += "<p>Product Code: <strong>" +hitch.vchProductCode + "</strong></p>";
            hitchHTML += "<a title='" + hitch.vchShortDesc + "' href='http://test.curthitch.biz/masterlibrary/"+ hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_1024x768_a.jpg' class='image prodImg'>";
            hitchHTML += "<img src='http://test.curthitch.biz/masterlibrary/"+ hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_a.jpg' />";
            hitchHTML += "<span>Click to Enlarge</span></a>";
            hitchHTML += "<div class='longDesc'>";
            hitchHTML += "<p>" + hitch.vchLongDesc + "</p>";
            hitchHTML += "<a class='more' href='javascript:readMore(" + hitch.iProductID + ")'>>>Read More</a><br />";
            hitchHTML += "</div>";
            hitchHTML += "<div class='prodLinks'>";
            hitchHTML += "<a target='_blank' href='http://test.curthitch.biz/masterlibrary/" + hitch.vchProductCode + "/installsheet/CM_" + hitch.vchProductCode +"_INS.pdf'><span>Instruction Sheet</span>";
            hitchHTML += "<img src='http://dev.hitchguys.biz/api_dev/file_pdf.png' width='20' /></a><br />";
            
            if(buyNow){
                hitchHTML += "<div class='button_outer buynow'><div class='button'><span>Buy Now</span></div></div>"; 
            }
            hitchHTML += "</div>";
            hitchHTML += "<div style='clear:both'></div>";
            hitchHTML += "</div>";
            
            jQuery('#hitchResults').append(hitchHTML);
        });
        
    }else{
        jQuery('#hitchResults').html('<p id="vehicleStr">No results for ' + vehicleStr + '</p>');
    }
    jQuery('#loader').css('display','none');
}


function noneFound(){
    jQuery('#hitchResults').html('<p id="noneFound">We\'re sorry but we were unable to locate any products that fit your vehicle specifications.</p>');
    jQuery('#loader').css('display','none');
    resetLookup();
}


function readMore(prodID){
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetDetails&prodID=' + prodID + '&dataType=JSONP&callback=?', function(data){},'jsonp');    
}

function loadDetails(data){
    var hitch = data[0];
    
    var hitchHTML = "<div class='hitchDetails'>";
    hitchHTML += "<span class='title'>" + hitch.vchShortDesc + "</span>";
    hitchHTML += "<span class='close'><img src='http://dev.hitchguys.biz/api_dev/close-icon.png' /></span>";
    hitchHTML += "<div id='imageContainer'>";

    /* Render Images */
    hitchHTML += "<div id='mainImage'>";
    hitchHTML += "<img src='http://test.curthitch.biz/masterlibrary/" + hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_a.jpg' onerror='jQuery(this).parent().hide()' />";
    hitchHTML += "</div>";
    hitchHTML += "<img class='mini' src='http://test.curthitch.biz/masterlibrary/" + hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_b.jpg' onerror='jQuery(this).hide()' />";
    hitchHTML += "<img class='mini' src='http://test.curthitch.biz/masterlibrary/" + hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_c.jpg' onerror='jQuery(this).hide()' />";
    hitchHTML += "<img class='mini' src='http://test.curthitch.biz/masterlibrary/" + hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_d.jpg' onerror='jQuery(this).hide()' />";
    hitchHTML += "<img class='mini' style='margin-right:0px' src='http://test.curthitch.biz/masterlibrary/" + hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_e.jpg' onerror='jQuery(this).hide()' />";
    hitchHTML += "</div>";
    
    /* Render Long Desc */
    hitchHTML += "<p class='detailsLongDesc'>"+ hitch.vchLongDesc + "</p>";
    
    /* Render Product Details */
    hitchHTML += "<div class='prodDetails'><table style='border-bottom: 2px solid black'>";
    hitchHTML += "<tr><td class='label'>Product #<td class='val'>"+ hitch.vchProductCode +"</td></tr>";
    hitchHTML += "<tr><td class='label'>MSRP<td class='val'>$"+ hitch.mHitchList +"</td></tr>";
    hitchHTML += "<tr><td class='label'>UPC<td class='val'>"+ hitch.vchHitchUPC +"</td></tr>";
    hitchHTML += "<tr><td class='label'>Receiver Tube<td class='val'>"+ hitch.txtBullet1 +"</td></tr>";
    hitchHTML += "<tr><td class='label'>Install Time<td class='val'>"+ hitch.InstallTime +"*</td></tr>";
    hitchHTML += "<tr><td class='label'>Instruction Sheet<td class='val'>";
    hitchHTML += "<a target='_blank' class='installSheet' href='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/installSheet/CM_"+hitch.vchProductCode+"_INS.pdf'><span>Download</span>";
    hitchHTML += "<img width='25' src='http://dev.hitchguys.biz/api_dev/file_pdf.png' /></a>";
    hitchHTML += "</td></tr>";
    
    /* Render Notes */
    if(jQuery.trim(hitch.txtNote1) != '' || jQuery.trim(hitch.txtNote2) != '' || jQuery.trim(hitch.txtNote3) != '' || jQuery.trim(hitch.txtNote4) != ''){
        hitchHTML += "<tr><td colspan='2' class='label noteHeader'>Notes</td></tr>";
    }
    if(jQuery.trim(hitch.txtNote1) != ''){
        hitchHTML += "<tr><td colspan='2' class='val notes'>"+ hitch.txtNote1 +"</td></tr>";
    }
    if(jQuery.trim(hitch.txtNote2) != ''){
        hitchHTML += "<tr><td colspan='2' class='val notes'>"+ hitch.txtNote2 +"</td></tr>";
    }
    if(jQuery.trim(hitch.txtNote3) != ''){
        hitchHTML += "<tr><td colspan='2' class='val notes'>"+ hitch.txtNote3 +"</td></tr>";
    }
    if(jQuery.trim(hitch.txtNote4) != ''){
        hitchHTML += "<tr><td colspan='2' class='val notes'>"+ hitch.txtNote4 +"</td></tr>";
    }
    
    /* Render Gross Load Capacity */
    var weightCarrying = 'n/a';
    var tongueWeight = 'n/a';
    var wdTongue = 'n/a';
    var wd = 'n/a';
    var vchWC = new String(hitch.vchWC);
    var vchWD = new String(hitch.vchWD);
    var ratings1 = vchWC.split('/');
    var ratings2 = vchWD.split('/');
    if(jQuery.trim(hitch.vchWC).toUpperCase() != 'N/A'){
        weightCarrying = ratings1[0] +' lb.';
        tongueWeight = ratings1[1] +' lb.';
    }
    if(jQuery.trim(hitch.vchWD).toUpperCase() != 'N/A'){
        wd = ratings2[0] +' lb.';
        wdTongue = ratings2[1] +' lb.';
    }
    hitchHTML += "<tr><td colspan='2' class='label noteHeader'>Gross Load Capacity</td></tr>";
    hitchHTML += "<tr><td class='label'>Weight Carrying</td><td class='val'>"+ weightCarrying + "</td></tr>";
    hitchHTML += "<tr><td class='label'>Tongue Weight</td><td class='val'>"+ tongueWeight + "</td></tr>";
    hitchHTML += "<tr><td class='label'>Weight Distribution (WD)</td><td class='val'>"+ wd + "</td></tr>";
    hitchHTML += "<tr><td class='label'>Tongue Weight (WD)</td><td class='val'>"+ wdTongue + "</td></tr>";
    
    hitchHTML += "</table>";
    hitchHTML += "<p class='disclaimer'>* Estimate is based on professional installation.</p>";
    hitchHTML += "</div>";
    
    hitchHTML += "</div>";
    /*jQuery.modal(hitchHTML,{
        containerCss:{
            backgroundColor: 'black',
            opacity: '70%',
            top: '100px',
            width: '90%'
        },
        overlayClose: true});*/
    console.log(hitchHTML.length);
    jQuery.facebox(hitchHTML);
}