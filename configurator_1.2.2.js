/*
 *  This file is going to be used to inject the configurator into the page.
 *  Created by: Alex Ninneman
 *  Created on: December 14, 2010
 *
 *  Release Note
 *  -------------------------------
 *  1. This version only loads hitch tabs if content is returned
 */

// Declare our HTML variables as global so we can use them everywhere
var REQUIRED_JQUERY = 1.4;
var STORAGE = true;
var USER_AGENT = navigator.userAgent.toLowerCase();
var jQueryScriptOutputted = false;
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
var wiring = false;
var accesories = false;
var preloaded = false;
var facebox = true;
var merchant_id = 0;
var year = '';
var make = '';
var model = '';
var style = '';
var mount = '';
var pricingRatio = 1;
var pricingType = '';
var checkout = 'google';
var upc = '';
var activeTab = '';

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
    }else if(!checkVersion('jquery')){
        //only output the script once..
        jQueryScriptOutputted = true;

        //output the script (load it from google api)
        document.write("<scr" + "ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js\"></scr" + "ipt>");
        setTimeout("initJQuery()", 50);
    } else {

        (function(jQuery) {

            // Create functions for getting the URL GET data
            jQuery.extend({

                // This function will return all of the GET data inside the 'vars' array
                getUrlVars: function(){
                    var vars = [], hash;
                    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                    for(var i = 0; i < hashes.length; i++)
                    {
                        hash = hashes[i].split('=');
                        vars.push(hash[0]);
                        vars[hash[0]] = hash[1];
                    }
                    return vars;
                },

                // This function will return the GET variable declared in the 'name' variable
                // @param :   GET variable name to be retrieved
                getUrlVar: function(name){
                    return jQuery.getUrlVars()[name];
                }
            });

            // Make sure we have a configurator
            if(jQuery('#configurator').length > 0){

                // Display configurator
                jQuery('#configurator').css('display','block');

                // Create element to store the vehicle string
                clearHTML = '<span id="searchStr">&nbsp;</span>';
                jQuery('#configurator').append(clearHTML);
                jQuery('#searchStr').css('display','block');

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

                // We need to create our loading GIF for transition on AJAX calls
                loaderHTML = "<img src='http://dev.hitchguys.biz/api_dev/ajax-loader.gif' id='loader' style='display:none' width='208' height='25' />";
                jQuery('#configurator').append(loaderHTML);

                // Create our submit button
                // This won't be displayed until the user selects a style
                inputHTML = '<div class="hold"></div><input type="button" id="lookup_submit" name="lookup_submit" value="Find Hitch" onclick="findHitches()" />';
                jQuery('#configurator').append(inputHTML);

                // Create link to use as a 'Clear' action on the search results and vehicle string
                clearHTML = '<a href="javascript:clearResult()" style="display:inline; visibility:hidden;" id="clear">Clear</a>';
                jQuery('#configurator').append(clearHTML);

                // Check if an element for the hitchResults already exists, otherwise we will create it
                if(jQuery('#hitchResults').length == 0){
                    resultsHTML = '<div id="hitchResults" style="width: 100%"></div>';
                    jQuery('#configurator').append(resultsHTML);
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
                    if(jQuery('#configurator').attr('checkout')){
                        checkout = jQuery('#configurator').attr('checkout');
                    }else{ // No platform defined, so we abandon the checkout
                        buyNow = false;
                        merchant_id = 0;
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

                // Check for a pricing structure
                if(jQuery('#configurator').attr('pricing')){
                    var p = jQuery('#configurator').attr('pricing');
                    var pArr = p.split('_');
                    pricingType = pArr[0];
                    pricingRatio = pArr[1];
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
                mount = jQuery.getUrlVar('mount');
                year = jQuery.getUrlVar('year');
                make = jQuery.getUrlVar('make');
                model = jQuery.getUrlVar('model');
                style = jQuery.getUrlVar('style');
                var hitchID = jQuery.getUrlVar('hitchID');
                var hitchCode = jQuery.getUrlVar('hitchCode');

                // Add tab effects
                jQuery(".tab_content").hide(); //Hide all content
                jQuery("ul.tabs li:first").addClass("active").show(); //Activate first tab
                jQuery(".tab_content:first").show(); //Show first tab content

                //On Click Event
                jQuery("ul.tabs li").live('click',function() {

                    jQuery("ul.tabs li").removeClass("active"); //Remove any "active" class
                    jQuery(this).addClass("active"); //Add "active" class to selected tab
                    jQuery(".tab_content").hide(); //Hide all tab content

                    var activeTab = jQuery(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
                    jQuery(activeTab).fadeIn(); //Fade in the active ID content
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

                        jQuery(tabContainer).find('.content').hide();
                        jQuery(tabContainer).slideUp();
                        activeTab = tabContent;
                        if(tab == 'wiringTab'){ // Get the wiring content
                            var vehicleID = jQuery(this).find('a').attr('id');
                            jQuery(this).addClass('activeHitchTab');
                            tabContent = tabContent[0];
                        }else if(tab == 'accTab'){ // Get the accessories;
                            upcs = jQuery(this).find('a').attr('id');
                            jQuery(this).addClass('activeHitchTab');
                            getAccessories(upcs);
                        }else{
                            jQuery(this).addClass('activeHitchTab');
                        }
                        jQuery(tabContent).fadeIn();
                        jQuery(tabContainer).slideDown();
                    }

                    return false;
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

                // Check if we are able to implement local storage
                if (USER_AGENT.search("safari") > -1 && USER_AGENT.search("chrome") == -1){  // No local storage support
                    STORAGE = false;
                }else{ // Webkit
                    mount = localStorage.mount;
                    year = localStorage.year;
                    make = localStorage.make;
                    model = localStorage.model;
                    style = localStorage.style;
                }

                // Check if we are linking to a specific hitch by either the hitchID or the hitchCode
                if(hitchID){
                    facebox = false;
                    readMore(hitchID);
                }else if(hitchCode){
                    facebox = false;
                    readMoreByCode(hitchCode);
                }

                // Check if we have a predefined hitch query
                if(mount != "" && year != "" && make != "" & model != "" && style != ""){
                    if(mount != undefined && year != undefined && make != undefined & model != undefined && style != undefined){
                        preloaded = true;
                        findHitches(mount,year,make,model,style);
                    }
                }
            }
        })(jQuery);
    }
}

// Load intial function
init();

// Load jQuery
initJQuery();

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


/*
 * This function takes in a JSON object that contains a list of vehicle makes
 * It iterates through them, appending each to the 'make' select box
*/
function handleMake(data){
    jQuery('#clear').css('visibility','visible');
    jQuery('#make').html('<option value="">Select Make</option>');
    jQuery.each(data,function(i,make){
        jQuery('#make').append('<option>'+ make +'</option>');
    });
    jQuery('#loader').css('display','none');
    jQuery('#make').css('display','block');
}

/*
 * This function takes in a JSON object that contains a list of vehicle models
 * It iterates through them, appending each to the 'model' select box
 */
function handleModel(data){
    jQuery('#clear').css('visibility','visible');
    jQuery('#model').html('<option value="">Select Model</option>');
    jQuery.each(data,function(i,model){
        jQuery('#model').append('<option>'+ model +'</option>');
    });
    jQuery('#loader').css('display','none');
    jQuery('#model').css('display','block');
}

/*
 * This function takes in a JSON object that contains a list of vehicle styles
 * It iterates through them, append each to the 'style' select box
 */
function handleStyle(data){
    jQuery('#clear').css('visibility','visible');
    jQuery('#style').html('<option value="">Select Style</option>');
    jQuery.each(data,function(i,style){
        jQuery('#style').append('<option>'+ style +'</option>');
    });
    //jQuery('#model').css('display','none');
    jQuery('#loader').css('display','none');
    jQuery('#style').css('display','block');
}

/*
 * When a user selects a style, we want to display the submit button
 */
function styleChange(){
    jQuery('#lookup_submit').css('display','inline');
}

/*
 * This is the response function for handling that AJAX call that retrieves hitch information
 */
function handleHitch(data){

    // make sure we found a hitch
    if(data == null || data.length == 0){
        noneFound(); // Display empty result message
    }else{
        // Print data
        /*var returnType = jQuery('#configurator').attr('hitchdata').toLowerCase();
        if(returnType =="raw"){
            renderHTML(data);
        }else if(returnType == "html"){
            renderHTML(data);
        }*/
        jQuery('#hitchResults').html('');
        renderHTML(data);
        resetLookup(); // Reset the hitch lookup
    }
}

function handleYears(years){
    jQuery.each(years,function(i,year){
        jQuery('#year').append('<option>'+year+'</option>');
    });
    jQuery('#mount').css('display','none');
    jQuery('#year').css('display','block');
}

// This function is used to take in the selected mount option and calculate years based on selection
function getYears(){
    jQuery('#clear').css('visibility','visible');
    var mount = jQuery('#mount').val();
    if(STORAGE){
        localStorage.mount = mount;
    }
    jQuery('#searchStr').text(mount + ' ');
    jQuery('#searchStr').css('display','block');
    jQuery('#year').html('<option value="">Select Year</option>');

    jQuery.get('http://api.curthitch.biz/AJAX_Curt.aspx?action=GetYear&mount='+mount+'&dataType=JSONP&callback=?',function(){},'jsonp');
}

function getMake(){

    //  jQuery('#clear').css('visibility','hidden');
    jQuery('#year').css('display','none');
    jQuery('#loader').css('display','block');
    var year = jQuery('#year').val();
    var mount = jQuery('#mount').val();
    if(STORAGE){
        localStorage.mount = mount;
        localStorage.year = year;
    }
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
    if(STORAGE){
        localStorage.mount = mount;
        localStorage.year = year;
        localStorage.make = make;
    }
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
    if(STORAGE){
        localStorage.mount = mount;
        localStorage.year = year;
        localStorage.make = make;
        localStorage.model = model;
    }
    jQuery('#searchStr').html(mount + ' ' + year + ' ' + make + ' ' + model);
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetStyle&mount=' +mount +'&year='+year+'&make='+make+'&model='+model+'&dataType=JSONP&callback=?', function(data){},'jsonp');
}

function findHitches(_mount,_year,_make,_model,_style){
    jQuery('#lookup_submit').css('display','none');
    jQuery('#clear').css('display','none');
    jQuery('#hitchResults').html('');
    jQuery('#loader').css('display','block');

    if(!preloaded){ // We want to use the select boxes to populate our query
        var mount = jQuery('#mount').val();
        var year = jQuery('#year').val();
        var make = jQuery('#make').val();
        var model = jQuery('#model').val();
        var style = jQuery('#style').val();
        if(STORAGE){
            localStorage.mount = mount;
            localStorage.year = year;
            localStorage.make = make;
            localStorage.model = model;
            localStorage.style = style;
        }
        jQuery('#searchStr').html(mount + ' ' + year + ' ' + make + ' ' + model + ' ' + style);
        vehicleStr = jQuery('#searchStr').text();
        facebox = true;
    }else{ // Query the API using the GET data
        mount = _mount;
        year = _year;
        make = _make;
        model = _model;
        style = _style;
        vehicleStr = mount + ' ' + year + ' ' + make + ' ' + model + ' ' + style;
        vehicleStr = decodeURI(vehicleStr);
    }

    var returnType = jQuery('#configurator').attr('hitchdata');
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetHitch&mount=' +mount +'&year='+year+'&make='+make+'&model='+model+'&style='+style+'&returnType='+returnType+'&dataType=JSONP&callback=?', function(data){},'jsonp');
    preloaded = false;
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
    jQuery('#hitchResults').html('').hide();
    resetLookup();
}

// This function will display the result of findHitches()
function renderHTML(data){

    var productCodes = new Array();
    jQuery('#clear').css('display','inline');
    jQuery('#clear').css('visibility','visible');
    if(data != null){
        var resultHTML = '<div id="resultBox_outline"><div id="resultBox"><p id="vehicleStr">' + vehicleStr + '</p>';
        if(logoImg != ''){
            resultHTML += '<div id="logo"><img src="'+ logoImg +'" /></div>';
        }
        resultHTML += '<div style="clear:both"></div><span>( <span id="hitchCount"></span> ) hitches found.</span>';
        resultHTML += '</div></div><div style="clear:both"></div>';
        jQuery('#hitchResults').html(resultHTML);
        jQuery.each(data,function(i,hitch){
            if(jQuery.inArray(hitch.vchProductCode,productCodes) == -1){ // Make sure this hitch hasn't already been printed
                var vClass = '';
                switch (hitch.iProductClassID) {
                    case '1':
                        vClass = "Class 1 Hitch";
                        break;
                    case '2':
                        vClass = "Class 2 Hitch";
                        break;
                    case '3':
                        vClass = "Class 3 Hitch";
                        break;
                    case '4':
                        vClass = "Class 1 Hitch";
                        break;
                    case '7':
                        vClass = "Front Mount Hitch";
                        break;
                    case '8':
                        vClass = "Heavy Duty Hitch";
                        break;
                    case '9':
                        vClass = "Class 5 Hitch";
                        break;
                    case '10':
                        vClass = "Class 5 HD Hitch";
                        break;
                    case '11':
                        vClass = "Class 5 ID Hitch";
                        break;
                    default:
                        vClass = "";
                        break;
                }

                // Add vchProductCode to array
                productCodes[productCodes.length + 1] = hitch.vchProductCode;
                // Begin Compiling HTML
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
                hitchHTML += "<a title='" + hitch.vchShortDesc + "' href='http://graphics.curthitch.biz/masterlibrary/"+ hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_1024x768_a.jpg' class='image prodImg'>";
                hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+ hitch.vchProductCode + "/images/" + hitch.vchProductCode + "_300x225_a.jpg' onerror='jQuery(this).parent().remove();' />";
                hitchHTML += "<span>Click to Enlarge</span></a>";
                hitchHTML += "<div class='longDesc'>";
                hitchHTML += "<div class='hitchSpecs'>";
                hitchHTML += "<span><strong>"+vClass+"</strong></span><br />";
                hitchHTML += "<span><strong>Install Time:</strong> "+hitch.InstallTime+" minutes</span><br />";
                hitchHTML += "<img src='http://dev.hitchguys.biz/api_dev/file_pdf.png' />";
                hitchHTML += "<a target='_blank' href='http://graphics.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/installsheet/CM_"+hitch.vchProductCode+"_INS.pdf'>Instruction Sheet "+hitch.vchProductCode+"</a>";
                if(jQuery.trim(hitch.txtNote1).length > 0){
                    hitchHTML += "<br /><span><strong>"+hitch.txtNote1+"</strong></span>";
                }
                if(jQuery.trim(hitch.txtNote2).length > 0){
                    hitchHTML += "<br /><span><strong>"+hitch.txtNote2+"</strong></span>";
                }
                if(jQuery.trim(hitch.txtNote3).length > 0){
                    hitchHTML += "<br /><span><strong>"+hitch.txtNote3+"</strong></span>";
                }
                if(jQuery.trim(hitch.txtNote4).length > 0){
                    hitchHTML += "<br /><span><strong>"+hitch.txtNote4+"</strong></span>";
                }
                hitchHTML += "</div>";

                // Render Gross Load Capacity
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

                hitchHTML += "<div class='grossLoad'>";
                hitchHTML += "<table>";
                hitchHTML += "<caption>Gross Load Capacity</caption>";
                hitchHTML += "<tr><td>Weight Carrying</td><td>"+weightCarrying+"</td></tr>";
                hitchHTML += "<tr><td>Tongue Weight</td><td>"+tongueWeight+"</td></tr>";
                hitchHTML += "<tr><td>Weight Distribution (WD)</td><td>"+wd+"</td></tr>";
                hitchHTML += "<tr><td>WD Tongue Weight</td><td>"+wdTongue+"</td></tr>";
                hitchHTML += "</table>";
                hitchHTML += "</div>";

                hitchHTML += "</div>";
                hitchHTML += "<div class='prodLinks'>";

                if(buyNow){
                    var longDesc = hitch.vchLongDesc.replace('"','');
                    if(checkout == 'google'){
                        hitchHTML += loadCheckout('bigGoogle',hitch.mHitchList,hitch.vchShortDesc,longDesc,1);
                    }else{
                        hitchHTML += loadCheckout(checkout,hitch.mHitchList,hitch.vchProductCode,hitch.vchShortDesc,1);
                    }
                }
                hitchHTML += "</div>";
                hitchHTML += "<div style='clear:both'></div>";

                // Begin tabbed architecture
                hitchHTML += "<div><div class='hitchTabs'>";
                hitchHTML  += "<div class='hitchTab imageTab activeHitchTab'><a href='"+window.location.href+"' class='imageTab' id='"+hitch.vchProductCode+"'>Images</a></div>";
                hitchHTML  += "<div class='hitchTab wiringTab'><a href='"+window.location.href+"' class='wiringTab' id='"+ hitch.iVehicleID +"'>Wiring</a></div>";
                if(jQuery.trim(hitch.vchUPCList).length > 0 && jQuery.trim(hitch.vchUPCList) != '%20'){
                    hitchHTML  += "<div class='hitchTab accTab'><a href='"+window.location.href+"' class='accTab' id='"+ hitch.vchUPCList +"'>Accessories</a></div>";
                }
                hitchHTML += "</div>";
                hitchHTML += "<div class='hitchTab_container'>";
                hitchHTML += "<div class='imageTab_content content' id='"+hitch.vchProductCode+"_content'>";
                hitchHTML += "<img rel='facebox' src='http://graphics.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_b.jpg' onerror='jQuery(this).hide()' />";
                hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_c.jpg' onerror='jQuery(this).hide()' />";
                hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_d.jpg' onerror='jQuery(this).hide()' />";
                hitchHTML += "<img src='http://graphics.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_e.jpg' onerror='jQuery(this).hide()' />";
                hitchHTML += "</div>";
                hitchHTML += "<div class='wiringTab_content content "+hitch.iVehicleID+"_content'></div>";
                
                if(jQuery.trim(hitch.vchUPCList).length > 0 && jQuery.trim(hitch.vchUPCList) != '%20'){

                    var upcList = hitch.vchUPCList.toString().replace('"','');
                    upcList = upcList.replace(/,/g,'');
                    hitchHTML += "<div class='accTab_content content' id='"+upcList+"_content'></div>";
                    
                }
                hitchHTML += "</div></div>";

                jQuery('#hitchResults').append(hitchHTML);
                jQuery('#hitchResults').show();
                jQuery('#hitchCount').text(productCodes.length/2);
                activeTab = $('#'+hitch.iVehicleID+'_content').get()[0];
                getWiring(hitch.iVehicleID);
            }
        });

    }else{
        jQuery('#hitchResults').html('<p id="vehicleStr">No results for ' + vehicleStr + '</p>');
    }
    jQuery('#loader').css('display','none');
}

function noneFound(){
    jQuery('#hitchResults').html('<p id="noneFound">We\'re sorry but we were unable to locate any products that fit your vehicle specifications.</p>');
    jQuery('#hitchResults').fadeIn();
    jQuery('#loader').css('display','none');
    resetLookup();
}


function readMoreByCode(prodCode){
    jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetDetailsByCode&prodCode=' + prodCode + '&dataType=JSONP&callback=?', function(data){},'jsonp');
}



function loadNextImage(element){

    var imgChars = new Array("a","b","c","d","e");
    var imageSrc = jQuery(element).attr('str');
    var extensionPosition = jQuery(element).search('.jpg');
    var imgCharPosition = extensionPosition - 1;

}


function getWiring(vehicleID){
    // Retrive the wiring connector info from the API
    // Returned into function loadWiring()
    jQuery.get('http://api.curthitch.biz/AJAX_Curt.aspx?action=GetConnector&iVehicleID='+vehicleID+'&dataType=JSONP&callback=?',function(){},'jsonp');
}

function loadWiring(connectors){
    if(connectors != null){
        wiringHTML = '';
        jQuery.each(connectors,function(i,connector){
            if(connector.vchConnectorCode.length > 0){
                var notes = connector.txtConnectorNotes.split(',');

                // Render wiring content
                //wiringHTML = '<div class="tab_content" id="wiring" style="display:none">';
                wiringHTML += '<div class="connector">';
                wiringHTML += '<div class="wiringContainer">';
                wiringHTML += '<div class="wiringImage">';
                wiringHTML += '<img src="http://graphics.curthitch.biz/masterlibrary/'+connector.vchConnectorCode+'/images/'+connector.vchConnectorCode+'_300x225_a.jpg" onerror="jQuery(this).parent().hide()" />';
                wiringHTML += '</div>';

                if(buyNow){
                    var shortDesc = 'CURT Wiring Connector #'+connector.vchConnectorCode;
                    if(checkout == 'google'){
                        wiringHTML += loadCheckout('smallGoogle',connector.mConnectorList,shortDesc,'',1);
                    }else{
                        wiringHTML += loadCheckout(checkout,connector.mConnectorList,connector.vchConnectorCode,shortDesc,1);
                    }

                }
                wiringHTML += '</div>';
                wiringHTML += '<div id="wiringInfo">';
                wiringHTML += '<span><strong>Connector #</strong>'+connector.vchConnectorCode+'</span><br />';
                wiringHTML += '<span><strong>Install Time</strong> '+connector.vchConnectorInstallTime+' minutes</span><br />';
                jQuery.each(notes,function(i,note){
                    wiringHTML += '<span>'+note+'</span><br />';
                });
                wiringHTML += "<a target='_blank' class='installSheet' style='text-decoration:underline' href='http://graphics.curthitch.biz/masterlibrary/"+connector.vchConnectorCode+"/installSheet/CME_"+connector.vchConnectorCode+"_INS.pdf'><span>Instruction Sheet</span>";
                wiringHTML += "<img width='25' src='http://dev.hitchguys.biz/api_dev/file_pdf.png' /></a><br />";


                wiringHTML += '</div>';
                wiringHTML += '<div style="clear:both"></div>';
                wiringHTML += '</div>';
            }
        });
    }else{ // No wiring kit found
        wiringHTML = '';
            
    }
    jQuery('.'+connectors[0].iVehicleID+'_content').html(wiringHTML);
}

function calculatePrice(price){
    price = price * pricingRatio;
    price = Math.round(price * Math.pow(10,2))/Math.pow(10,2);
    var priceArray = price.toString().split('.');
    if(priceArray[1].length == 1){
        price += "0";
    }

    return price;
}

function getAccessories(upcList){
    if(jQuery.trim(upcList).length > 0){
        jQuery.get('http://api.curthitch.biz/AJAX_Curt.aspx?action=GetAccessories&upcList='+upcList+'&dataType=JSONP',function(){},'jsonp');
    }
}


function loadAcc(accs){
    if(accs != null){
        //accHTML = '<div class="tab_content" id="accessories" style="display:none;max-height: 500px;overflow:auto">';
        accHTML = '';
        // Begin Compiling Accessory HTML
        jQuery.each(accs,function(i,acc){

            var paramArr = acc.vchParams.split(';');

            accHTML += '<div class="accessory">';

            // Display Accessory Image
            accHTML += '<div class="imgContainer">';
            accHTML += '<div class="imgBorder">';
            accHTML += '<img onerror="jQuery(this).parent().hide()" src="http://graphics.curthitch.biz/masterlibrary/'+acc.vchProductCode+'/images/'+acc.vchProductCode+'_300x225_a.jpg" />';
            accHTML += '</div>';

            if(buyNow){
                if(checkout == 'google'){
                    accHTML += loadCheckout('smallGoogle',acc.SGRetail,acc.vchSDesc,'',1);
                }else{
                    accHTML += loadCheckout(checkout,acc.SGRetail,acc.vchProductCode,acc.vchSDesc,1);
                }
            }
            accHTML += '</div>';

            // Display Accessory Specs
            accHTML += '<div class="specs">';
            accHTML += '<span style="display:block;font-weight: bold">'+ acc.vchSDesc +'</span>';
            accHTML += '<div class="details">';
            accHTML += '<ul>';
            for(var i = 0; i < paramArr.length; i++){
                if(i < 5 && jQuery.trim(paramArr[i]) != ''){
                    accHTML += '<li>'+ paramArr[i] +'</li>';
                }
            }
            accHTML += '</ul>';

            if(paramArr.length > 5){
                accHTML += '<ul>';
                for(var i = 6; i < paramArr.length; i++){
                    if(jQuery.trim(paramArr[i]) != ''){
                        accHTML += '<li>'+ paramArr[i] + '</li>';
                    }
                }
                accHTML += '</ul>';
            }
            accHTML += '<div style="clear:both"></div>';
            accHTML += '</div>';
            accHTML += '<div style="clear:both"></div>';
            accHTML += '</div>';

            accHTML += '<div style="clear:both"></div>';
            accHTML += '</div>';

        });

        jQuery(activeTab).html(accHTML);

    }
}


function loadCheckout(platform,price,shortDesc,longDesc,itemNum){
    var checkoutHTML = '';
    switch(platform){

        // Load Google Checkout [ big button ]
        case 'bigGoogle':
            checkoutHTML += '<form target="_blank" method="POST" action="https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/' + merchant_id +'" accept-charset="utf-8">';
            checkoutHTML += '<div style="padding-top: 15px"><span class="price accPrice">$'+ calculatePrice(price) +'</span>';
            checkoutHTML += '<label>Qty</label>';
            checkoutHTML += '<select name="item_quantity_1" style="min-width:40px;display:inline">';
            checkoutHTML += '<option>1</option>';
            checkoutHTML += '<option>2</option>';
            checkoutHTML += '<option>3</option>';
            checkoutHTML += '<option>4</option>';
            checkoutHTML += '<option>5</option>';
            checkoutHTML += '</select>';
            checkoutHTML += '</div>';
            checkoutHTML += '<input type="hidden" name="item_name_'+itemNum+'" value="'+shortDesc+'" />';
            checkoutHTML += '<input type="hidden" name="item_description_'+itemNum+'" value="'+longDesc.replace('""',' inch').replace('"','')+'" />';
            checkoutHTML += '<input type="hidden" name="item_price_'+itemNum+'" value="'+ calculatePrice(price) + '" />';
            checkoutHTML += '<input type="hidden" name="item_currency_'+itemNum+'" value="USD" />';
            checkoutHTML += '<input type="hidden" name="item_merchant_id_'+itemNum+'" value="' + merchant_id + '" />';
            checkoutHTML += '<input type="hidden" name="_charset_" />';
            checkoutHTML += '<input type="image" name="Google Checkout" alt="Fast checkout through Google" src="http://sandbox.google.com/checkout/buttons/checkout.gif?merchant_id=' + merchant_id + '&w=180&h=46&style=white&variant=text&loc=en_US" height="46" width="180" />';
            checkoutHTML += '</form>';
            break;

        // Load Google Checkout [ little buy ]
        case 'smallGoogle':
            checkoutHTML += '<form target="_blank" method="POST" action="https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/' + merchant_id +'" accept-charset="utf-8">';
            checkoutHTML += '<div style="padding-top: 15px"><span class="price accPrice">$'+ calculatePrice(price) +'</span>';
            checkoutHTML += '<label>Qty <input type="text" class="qtyBox" name="item_quantity_'+itemNum+'" value="1" /></label></div>';
            checkoutHTML += '<input type="hidden" name="item_name_'+itemNum+'" value="'+shortDesc+'" />';
            checkoutHTML += '<input type="hidden" name="item_description_'+itemNum+'" value="'+longDesc.replace('""',' inch').replace('"','')+'" />';
            checkoutHTML += '<input type="hidden" name="item_price_'+itemNum+'" value="'+ calculatePrice(price) + '" />';
            checkoutHTML += '<input type="hidden" name="item_currency_'+itemNum+'" value="USD" />';
            checkoutHTML += '<input type="hidden" name="item_merchant_id_'+itemNum+'" value="' + merchant_id + '" />';
            checkoutHTML += '<input type="hidden" name="_charset_" />';
            checkoutHTML += '<input type="image" name="Google Checkout" alt="Fast checkout through Google" src="http://sandbox.google.com/checkout/buttons/buy.gif?merchant_id=' + merchant_id + '&w=121&h=44&style=trans&variant=text&loc=en_US" />';
            checkoutHTML += '</form>';
            break;

        // Load Paypal
        case 'paypal':
            checkoutHTML += '<form target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post">';
            checkoutHTML += '<div style="padding-top: 15px"><span class="price accPrice">$'+ calculatePrice(price) +'</span>';
            checkoutHTML += '<label>Qty</label>';
            checkoutHTML += '<select name="quantity" style="min-width:40px;display:inline">';
            checkoutHTML += '<option>1</option>';
            checkoutHTML += '<option>2</option>';
            checkoutHTML += '<option>3</option>';
            checkoutHTML += '<option>4</option>';
            checkoutHTML += '<option>5</option>';
            checkoutHTML += '</select>';
            checkoutHTML += '</div>';
            checkoutHTML += '<input type="hidden" name="item_number" value="'+shortDesc+'" />';
            checkoutHTML += '<input type="hidden" name="cmd" value="_xclick" />';
            checkoutHTML += '<input type="hidden" name="no_note" value="1" />';
            checkoutHTML += '<input type="hidden" name="business" value="aninneman@curtmfg.com" />';
            checkoutHTML += '<input type="hidden" name="currency_code" value="USD" />';
            checkoutHTML += '<input type="hidden" name="return" value="'+window.location.href+'" />';
            checkoutHTML += '<input type="hidden" name="item_name" value="'+longDesc.replace('""',' inch').replace('"','')+'" />';
            checkoutHTML += '<input type="hidden" name="amount" value="'+ calculatePrice(price) +'" />';
            checkoutHTML += '<input type="image" name="submit" src="https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif" border="0" align="top" alt="Check out with PayPal" />';
            checkoutHTML += '</form>';
            break;

        // Nothing passed [ don't load anything ]
        default:
    // DO NOTHING
    }
    return checkoutHTML;

}
