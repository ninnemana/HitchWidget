
	var contents = new Array();


		contents[0] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[0] += '<div class="linkContainer"><a class="toolLink" href="http://www.autoanything.com/towing/20a52080a1.aspx" target="_blank"><span>AutoAnything.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[0] += '</td>';


		contents[1] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[1] += '<div class="linkContainer"><a class="toolLink" href="http://www.discounthitches.com" target="_blank"><span>DiscountHtiches.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[1] += '</td>';


		contents[2] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[2] += '<div class="linkContainer"><a class="toolLink" href="http://www.hitchsource.com/" target="_blank"><span>HitchSource.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[2] += '</td>';


		contents[3] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[3] += '<div class="linkContainer"><a class="toolLink" href="http://www.jcwhitney.com/Hitches_Towing_and_Trailers?ID=7;1101002309;510001250;0;100001;Category;0;0;0;0;0;0" target="_blank"><span>JCWhitney.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[3] += '</td>';


		contents[4] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[4] += '<div class="linkContainer"><a class="toolLink" href="http://www.thehitchstore.com/" target="_blank"><span>TheHitchStore.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[4] += '</td>';


		contents[5] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[5] += '<div class="linkContainer"><a class="toolLink" href="http://www.BuyCurtHitches.com" target="_blank"><span>BuyCURTHitches.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[5] += '</td>';


		contents[6] =  '<td style="text-align: center; vertical-align: middle;">';
		contents[6] += '<div class="linkContainer"><a class="toolLink" href="http://hitchdepotusa.com" target="_blank"><span>HitchDepotUSA.com</span><br /><span>Click Here to Buy Online.</span></a></div>';
		contents[6] += '</td>';



var ZipCode = "";

function strip(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

ZipCode = strip("UserZip");

var map = null;
var geocoder = null;
var vPrefContent = "";
var bounds;
var southWest;
var northEast;
var lngSpan;
var latSpan;
var Mfeatured = "";
var MTitle = "";
var MfeaturedTrim = "";
var MarkerOptions = "";
var MPosit = "";
var vAdd1 = "";
var vCity = "";
var vState = "";
var vZip = "";
var vPhone = "";
var blackIcon = new GIcon(G_DEFAULT_ICON);
blackIcon.image = "Images/blackball.png";

var greyIcon = new GIcon(G_DEFAULT_ICON);
greyIcon.image = "Images/greyball.png";


var z = 1;
var zfalse = 1;
var vInstallersString = "";
var vPrefString = "";

var bounds = "";
var southWest = "";
var northEast = "";
var lngSpan = "";
var latSpan = "";
var latMin = "";
var latMax = "";
var lngMin = "";
var lngMax = "";
var vMiddle;
var vMidList;
var vPrefStarted = false;

var vFromStreet = "";
var vFromCity = "";
var vFromState = "";
var CURTCenter = new GLatLng(44.7945598, -91.41051130);
var defaultCenter = new GLatLng(44.90646871, -91.94183349)

var map;
var geocoder;

function load() {


    var i = 0;
    var printedCount = 0;
    //variable used to contain controlled random number
    var random;

    //while all of array elements haven't been cycled thru
    while (i < contents.length) {
        //generate random num between 0 and arraylength-1
        random = Math.floor(Math.random() * contents.length);
        //if element hasn't been marked as "selected"
        if (contents[random] != "selected") {
            if (i < 3) {
                $('#openingPreferred3').append(contents[random]);
            } else if (i < 6) {
                $('#openingPreferred6').append(contents[random]);
            } else {
                $('#openingPreferred9').append(contents[random]);
            }
            //mark element as selected
            contents[random] = "selected";
            i++;
        }
    }
    $('.toolLink').tooltip({
        position: 'top right'
    });



    if (GBrowserIsCompatible()) {
        geocoder = new GClientGeocoder();
        map = new GMap2(document.getElementById('map_canvas'));
        map.setCenter(defaultCenter, 8);
        var vCURTHTML = "<div>" +
    	                 "<span class='ins'> CURT Manufacturing </span>" +
    	                 "<br />" +
    	                 "3017 Industrial Dr." +
    	                 "<br />" +
    	                 "Eau Claire, WI 54701</div>";
        //map.setMapType(G_HYBRID_MAP);
        map.addControl(new GLargeMapControl());
        map.addControl(new GMapTypeControl());
        searchLocationsNear(defaultCenter, false);
        /*MarkerOptions = { title: "CURT Manufacturing", icon: blackIcon };
        var ThisMark = new GMarker(map.getCenter(), MarkerOptions);
        ThisMark.bindInfoWindowHtml(vCURTHTML);
        map.addOverlay(ThisMark);*/


    }

    directionsPanel = document.getElementById("MapRoute");
    directions = new GDirections(map, directionsPanel);
}

function searchLocations() {

    if (document.getElementById('UserZip').value != "" && document.getElementById('UserZip').value != "CURT") {
        var address = document.getElementById('UserZip').value;
        geocoder.getLatLng(address, function (latlng) {
            if (!latlng) {
                alert(address + ' not found');
            } else {
                searchLocationsNear(latlng, false);
            }
        });
        setTimeout(document.getElementById('UserZip').value = "", 1000);
    }
    else if (document.getElementById('UserZip').value == "CURT") {
        searchLocationsNear(CURTCenter, true);
    }
}

function searchLocationsNear(center, showAll) {
    var radius = 100;
    var vToggle = 1;
    vInstallersString = "";
    vPrefString = "";
    vStyleDealInfo = "";
    vDealInfoTxt = "";
    var searchUrl = "data/MASTER_dealerLocatorList.txt";
    GDownloadUrl(searchUrl, function (data) {
        latMin = center.lat() - 0.86;
        latMax = center.lat() + 0.86;
        lngMin = center.lng() - 2.0;
        lngMax = center.lng() + 2.0;

        var DataLines = data.split("\r\n");

        map.clearOverlays();
        map.setMapType(G_NORMAL_MAP);

        var BottomBar = document.getElementById('BottomBar');
        var PrefBar = document.getElementById('preferred');
        var vPrefStarted = false;

        BottomBar.innerHTML = '';
        map.setCenter(center, 8);

        var i = 0;
        for (i = 1; i < DataLines.length - 1; i++)  // skip first line
        {

            var markers = [];
            var DElems = DataLines[i].split("\t");
            z = z + 1;
            MTitle = "";
            Mfeatured = "";
            vAdd1 = "";
            vCity = "";
            vState = "";
            vZip = "";
            vPhone = "";
            MPosit = "";
            vDealInfo = "";

            {

                MTitle = DElems[5];
                Mfeatured = DElems[3];
                vAdd1 = DElems[10];
                vCity = DElems[11];
                vState = DElems[12];
                vZip = DElems[13];
                vPhone = DElems[9];

                MPosit = new GLatLng(DElems[19], DElems[20]);

                MfeaturedTrim = Mfeatured;

                if (MfeaturedTrim.indexOf('TRUE') > -1) {
                    MarkerOptions = { title: MTitle, icon: blackIcon };
                }
                else {
                    MarkerOptions = { title: MTitle, icon: greyIcon };
                }




                if (vToggle == 1) {
                    var vStyleDealInfo = "";
                    var vDealInfoHead = "";
                    vStyleDealInfo = "<div class='inst'>";
                    vDealInfoHead = "<div class='inst'>";
                    vPrefInfoHead = "<div class='pref'>";
                }
                else {
                    var vStyleDealInfo = "";
                    var vDealInfoHead = "";
                    vStyleDealInfo = "<div class='inst2'>";
                    vDealInfoHead = "<div class='inst'>";
                    vPrefInfoHead = "<div class='pref'>";
                    vToggle = 0;
                }
                var vDealInfoTxt = "<span class='ins'>" + MTitle +
    	                 " </span><br />" +
    	                  vAdd1 + "<br />" +
    	                  vCity + " " + vState + ", " + vZip + "<br />" +
    	                  vPhone + "<br />" +
    	                  "<a style='font: 10px arial,sans-serif; padding-left: 2px; padding-right: 2px;' href='javascript:GetDir(" + DElems[19] + "," + DElems[20] + ")'>Get Directions</a>";

                var vDealInfo = vDealInfoHead + vDealInfoTxt + "</div>";

                if (MfeaturedTrim.indexOf('T') > -1 && latMin < DElems[19] && DElems[19] < latMax && lngMin < DElems[20] && DElems[20] < lngMax) {
                    var vNewPref = vPrefInfoHead + vDealInfoTxt;
                    vPrefString = vPrefString + vPrefInfoHead + vDealInfoTxt;

                    if (vPrefStarted == false) {
                        vPrefStarted = StartPref();
                    }
                    var ThisMark = new GMarker(MPosit, MarkerOptions);
                    ThisMark.bindInfoWindowHtml(vDealInfo);
                    map.addOverlay(ThisMark);

                    var PrefBarEntry = createPrefBarEntry(ThisMark, vDealInfoTxt);
                    PrefBar.appendChild(PrefBarEntry);

                }
                else if (latMin < DElems[19] && DElems[19] < latMax && lngMin < DElems[20] && DElems[20] < lngMax) {
                    var vNewInst = vStyleDealInfo + vDealInfoTxt;
                    vInstallersString = vInstallersString + vStyleDealInfo + vDealInfoTxt + "</div>";
                    var vToggle = vToggle + 1;

                    if (showAll) {
                        var ThisMark = new GMarker(MPosit, MarkerOptions);
                        ThisMark.bindInfoWindowHtml(vDealInfo);
                        map.addOverlay(ThisMark);
                    }

                }
                else if (showAll) {
                    var ThisMark = new GMarker(MPosit, MarkerOptions);
                    ThisMark.bindInfoWindowHtml(vDealInfo);
                    map.addOverlay(ThisMark);
                }

            }  //if in 100 mile range

        }  // for each data line

        if (vPrefString != "") {

            var vInstFooter = " ";
            var PrefBarEntry = createPrefBarFooter(vInstFooter);
            PrefBar.appendChild(PrefBarEntry);
        }

        if (vInstallersString != "") {
            var vInstHeader = "<div class='pHead'><img src='images/logo.png' width='75' style='position:relative;top:4px' />Other Preferred Dealers </div>";
            var vInstFooter = "<div class='clear'>  </div>";
            var InstallersDiv = document.getElementById("Installers");
            InstallersDiv.innerHTML = vInstHeader + vInstallersString + vInstFooter;
        }
        else {
            var InstallersDiv = document.getElementById("Installers");
            InstallersDiv.innerHTML = "";


        }




    });
}

function createMarker(point, name, address) {
    var marker = new GMarker(point);
    var html = '<b>' + name + '</b> <br/>' + address;
    GEvent.addListener(marker, 'click', function () {
        marker.openInfoWindowHtml(html);
    });
    return marker;
}

function createBottomBarEntry(marker, vHtml) {
    var div = document.createElement('div');
    var html = vHtml;
    div.innerHTML = html;
    div.style.cursor = 'pointer';
    div.style.marginBottom = '5px';
    GEvent.addDomListener(div, 'click', function () {
        GEvent.trigger(marker, 'click');
    });
    GEvent.addDomListener(div, 'mouseover', function () {
        div.style.backgroundColor = '#eee';
    });
    GEvent.addDomListener(div, 'mouseout', function () {
        div.style.backgroundColor = '#fff';
    });
    return div;
}

function createPrefBarFooter(vHtml) {
    var div = document.createElement('div');
    var html = vHtml;
    div.innerHTML = html;
    div.style.cursor = 'pointer';
    div.style.marginBottom = '5px';

    div.setAttribute("class", "pref");
    div.style.height = '0px';
    div.style.width = '728px';
    div.style.clear = "both";


    return div;
}

function createPrefBarEntry(marker, vHtml) {
    var div = document.createElement('div');
    var html = vHtml;
    div.innerHTML = html;
    div.style.cursor = 'pointer';
    div.style.paddingBottom = '5px';
    div.style.paddingLeft = '20px';
    div.style.float = "left";
    div.style.cssFloat = "left";  //old firefox
    div.style.styleFloat = "left";  //ie specific
    div.setAttribute("class", "pref");
    div.setAttribute("className", "pref");  //ie specific
    div.style.height = '90px';
    div.style.width = '325px';


    GEvent.addDomListener(div, 'click', function () {
        GEvent.trigger(marker, 'click');
    });
    GEvent.addDomListener(div, 'mouseover', function () {
        div.style.backgroundColor = '#ccc';
    });
    GEvent.addDomListener(div, 'mouseout', function () {
        div.style.backgroundColor = '#fff';
    });
    return div;
}

function GetDir(lat, lng) {
    var DivRoute = document.getElementById("route");
    var DivCanvas = document.getElementById("map_canvas");

    var vHidLat = document.getElementById("HidLat");
    var vHidLng = document.getElementById("HidLng");

    vHidLat.value = lat;
    vHidLng.value = lng;

    DivRoute.style.height = "auto";
    DivRoute.style.visibility = "visible";
    DivRoute.style.display = "block";

    vCenter = "(" + lat + "," + lng + ")";

    map.panTo(new GLatLng(lat, lng));

    var vStreetInput = document.getElementById('UserStreet').value;
    var vCityInput = document.getElementById('UserCity').value;
    var vStateInput = document.getElementById('UserState').value;

    directions.load("from:" + vStreetInput + ", " + vCityInput + "," + vStateInput + " to: " + lat + " ," + lng);

}
function ShowDir() {
    var vHidLat = document.getElementById("HidLat");
    var vHidLng = document.getElementById("HidLng");

    GetDir(vHidLat.value, vHidLng.value);
}
function CloseDir() {
    var DivRoute = document.getElementById("route");
    var DivCanvas = document.getElementById("map_canvas");

    DivRoute.style.height = "0px";
    DivRoute.style.visibility = "hidden";
    DivRoute.style.display = "none";

    DivCanvas.style.width = "700px";

}

function Validate() {
    var SubmitOK = true;

    return SubmitOK;

}

function StartPref() {
    vPrefContent = "<div class='grnhead'><img src='images/logo.png' width='100' style='position:relative;top:4px' />Platinum Preferred Installers</div>";
    vPrefStarted = true;
    var PreferredDiv = document.getElementById("preferred");
    PreferredDiv.innerHTML = vPrefContent;
    return (vPrefStarted);
}


function whichButton(event) {
    key = event.keyCode;
    if (key == '13') {
        if (document.getElementById("UserZip").value != "") {
            searchLocations();
        }
        else {
            if (document.getElementById('UserCity').value != "") {
                ShowDir();
            }

        }
    }
}


