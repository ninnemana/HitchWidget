/* 
 * Created By: Alex Ninneman
 * Created On: October 19, 2010
 * Purpose: This file houses all the of javascript functionality for the Where to Buy page
 */


$(document).ready(function () {

    

    //When page loads...
    $(".tab_content").hide(); //Hide all content
    $("ul.tabs li:first").addClass("active").show(); //Activate first tab
    $(".tab_content:first").show(); //Show first tab content

    //On Click Event
    $("ul.tabs li").click(function () {

        $("ul.tabs li").removeClass("active"); //Remove any "active" class
        $(this).addClass("active"); //Add "active" class to selected tab
        $(".tab_content").hide(); //Hide all tab content

        var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
        $(activeTab).fadeIn(); //Fade in the active ID content
        return false;
    });
});

/*function updateModifyType(){

    var makeField = "selectVehicleMake";
    var yearField = "selectVehicleYear";
    var modelField = "selectVehicleModel";

    var modifyType = document.getElementById("modifyType");

    if(modifyType.checked){
        document.getElementById(makeField).disabled = false;
        document.getElementById(yearField).disabled = false;
        document.getElementById(modelField).disabled = false;
    }else{
        document.getElementById(makeField).disabled = true;
        document.getElementById(yearField).disabled = true;
        document.getElementById(modelField).disabled = true;
    }


}

function getYears(){

    var makeField = "selectVehicleMake";
    var yearField = "selectVehicleYear";
    var modelField = "selectVehicleModel";
    var mountField = "selectVehicleMount";

    // create logging function
    var myOnLog = function(msg){
    }

    // create completion function
    var myOnComplete = function(responseText, responseXML){

        //document.getElementById('outputText').value = responseText;
        var modelNodes = responseXML.getElementsByTagName('vehicle-year');
        var modelNode = '';
        var formObject = document.getElementById(yearField);

        var i = 0;
        var formOption= '';
        var yearName = '';
        var yearValue = '';

        //remove the make
        document.getElementById(makeField).options.length=0;

        //go through and add all the current makes
        formObject.options.length=0;
        formObject.options.length=modelNodes.length;
        for(i=0;i<modelNodes.length;i++){
            modelNode = modelNodes[i];
            yearName = modelNode.getElementsByTagName('year')[0].firstChild.nodeValue;
            yearValue = modelNode.getElementsByTagName('id')[0].firstChild.nodeValue;
            formOption = new Option(yearName,yearValue);
            formObject.options[i] = formOption;
        }

        //refresh the models
        getMakes();


    }

    // create provider instance; wire events
    /*var provider = new oyXMLRPCProvider();
    provider.onComplete = myOnComplete;
    provider.onLog = myOnLog;
    provider.onError = myOnLog;

    var mountid = document.getElementById(mountField).options[document.getElementById(mountField).selectedIndex].value;

    provider.submit("index.cfm?event=yearxml&mount=" + mountid);
}
function getMakes(){

    var makeField = "selectVehicleMake";
    var yearField = "selectVehicleYear";
    var modelField = "selectVehicleModel";
    var mountField = "selectVehicleMount";

    // create logging function
    var myOnLog = function(msg){
    }

    // create completion function
    var myOnComplete = function(responseText, responseXML){

        //document.getElementById('outputText').value = responseText;
        var modelNodes = responseXML.getElementsByTagName('vehicle-make');
        var modelNode = '';
        var formObject = document.getElementById(makeField);

        var i = 0;
        var formOption= '';
        var makeName = '';
        var makeValue = '';

        //remove the model
        document.getElementById(modelField).options.length=0;

        //go through and add all the current makes
        formObject.options.length=0;
        formObject.options.length=modelNodes.length;
        for(i=0;i<modelNodes.length;i++){
            modelNode = modelNodes[i];
            makeName = modelNode.getElementsByTagName('make')[0].firstChild.nodeValue;
            makeValue = modelNode.getElementsByTagName('id')[0].firstChild.nodeValue;
            formOption = new Option(makeName,makeValue);
            formObject.options[i] = formOption;
        }

        //refresh the models
        getModels();


    }

    // create provider instance; wire events
    var provider = new oyXMLRPCProvider();
    provider.onComplete = myOnComplete;
    provider.onLog = myOnLog;
    provider.onError = myOnLog;

    var yearId = document.getElementById(yearField).options[document.getElementById(yearField).selectedIndex].value;

    var mountid = document.getElementById(mountField).options[document.getElementById(mountField).selectedIndex].value;

    provider.submit("index.cfm?event=makexml&year=" + yearId + "&mount=" + mountid);
}

function getModels(){

    var makeField = "selectVehicleMake";
    var yearField = "selectVehicleYear";
    var modelField = "selectVehicleModel";
    var styleField = "selectVehicleStyle";
    var mountField = "selectVehicleMount";

    // create logging function
    var myOnLog = function(msg){
    }

    // create completion function
    var myOnComplete = function(responseText, responseXML){

        //document.getElementById('outputText').value = responseText;
        var modelNodes = responseXML.getElementsByTagName('model');
        var modelNode = '';
        var formObject = document.getElementById(modelField);

        var i = 0;
        var formOption= '';
        var modelName = '';
        var modelValue = '';

        //remove the model
        document.getElementById(styleField).options.length=0;

        //go through and add all the current models
        formObject.options.length=0;
        formObject.options.length=modelNodes.length;
        for(i=0;i<modelNodes.length;i++){
            modelNode = modelNodes[i];
            modelName = modelNode.getElementsByTagName('name')[0].firstChild.nodeValue;
            modelValue = modelNode.getElementsByTagName('id')[0].firstChild.nodeValue;
            formOption = new Option(modelName,modelValue);
            formObject.options[i] = formOption;
        }

        //refresh the models
        getStyles();


    }

    // create provider instance; wire events
    var provider = new oyXMLRPCProvider();
    provider.onComplete = myOnComplete;
    provider.onLog = myOnLog;
    provider.onError = myOnLog;

    var yearId = document.getElementById(yearField).options[document.getElementById(yearField).selectedIndex].value;
    var makeId = document.getElementById(makeField).options[document.getElementById(makeField).selectedIndex].value;
    var mountid = document.getElementById(mountField).options[document.getElementById(mountField).selectedIndex].value;

    provider.submit("index.cfm?event=modelxml&year=" + yearId + "&make=" + makeId + "&mount=" + mountid);
}

function getStyles(){

    var makeField = "selectVehicleMake";
    var yearField = "selectVehicleYear";
    var modelField = "selectVehicleModel";
    var styleField = "selectVehicleStyle";
    var mountField = "selectVehicleMount";

    // create logging function
    var myOnLog = function(msg){
    }

    // create completion function
    var myOnComplete = function(responseText, responseXML){
        var vehicleTypeNodes = responseXML.getElementsByTagName('vehicle-style');
        var vehicleTypeNode = '';
        var formObject = document.getElementById(styleField);

        var i = 0;
        var formOption= '';
        var vehicleTypeModel = '';
        var vehicleTypeValue = '';


        //go through and add all the yearsresponseXML
        formObject.options.length=0;
        formObject.options.length=vehicleTypeNodes.length;
        for(i=0;i<vehicleTypeNodes.length;i++){
            vehicleTypeNode = vehicleTypeNodes[i];
            vehicleTypeModel = vehicleTypeNode.getElementsByTagName('vstyle')[0].firstChild.nodeValue;
            vehicleTypeValue = vehicleTypeNode.getElementsByTagName('id')[0].firstChild.nodeValue;
            formOption = new Option(vehicleTypeModel,vehicleTypeValue);
            formObject.options[i] = formOption;
        }



    }


    // create provider instance; wire events
    var provider = new oyXMLRPCProvider();
    provider.onComplete = myOnComplete;
    provider.onLog = myOnLog;
    provider.onError = myOnLog;

    var yearId = document.getElementById(yearField).options[document.getElementById(yearField).selectedIndex].value;
    var makeId = document.getElementById(makeField).options[document.getElementById(makeField).selectedIndex].value;
    var modelId = document.getElementById(modelField).options[document.getElementById(modelField).selectedIndex].value;
    var mountid = document.getElementById(mountField).options[document.getElementById(mountField).selectedIndex].value;

    provider.submit("index.cfm?event=stylexml&year=" + yearId + "&make=" + makeId + "&model=" + modelId + "&mount=" + mountid);


}

getYears();
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
try {
    var pageTracker = _gat._getTracker("UA-6347715-30");
    pageTracker._trackPageview();
} catch(err) {}

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));

try {
    var pageTracker = _gat._getTracker("UA-11960917-1");
    pageTracker._trackPageview();
} catch(err) {}


*/