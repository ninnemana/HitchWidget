var clearHTML;var mountHTML;var yearHTML;var makeHTML;var modelHTML;var styleHTML;var loaderHTML;var clearHTML;var inputHTML;var resultHTML;var vehicleStr;var logoImg='';var buyNow=false;var facebox=true;if(document.createStyleSheet){var declaredStyle=document.getElementById('configurator').getAttribute('lookupStyle');declaredStyle=(declaredStyle==null)?'default':declaredStyle;document.createStyleSheet('http://dev.hitchguys.biz/api_dev/'+declaredStyle+'.css');}else{var declaredStyle=document.getElementById('configurator').getAttribute('lookupStyle');declaredStyle=(declaredStyle==null)?'default':declaredStyle;var styles="@import url(' http://dev.hitchguys.biz/api_dev/"+declaredStyle+".css');";var newSS=document.createElement('link');newSS.rel='stylesheet';newSS.href='data:text/css,'+escape(styles);document.getElementsByTagName("head")[0].appendChild(newSS);var styles="@import url(' http://dev.hitchguys.biz/api_dev/facebox/facebox.css');";var newSS=document.createElement('link');newSS.rel='stylesheet';newSS.href='data:text/css,'+escape(styles);document.getElementsByTagName("head")[0].appendChild(newSS);}
function initModal(){document.write("<scr"+"ipt type=\"text/javascript\" src=\"http://dev.hitchguys.biz/api_dev/facebox/facebox.js\"></scr"+"ipt>");}
var jQueryScriptOutputted=false;function initJQuery(){if(typeof(jQuery)=='undefined'){if(!jQueryScriptOutputted){jQueryScriptOutputted=true;document.write("<scr"+"ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js\"></scr"+"ipt>");}
setTimeout("initJQuery()",50);}else{(function(jQuery){$.extend({getUrlVars:function(){var vars=[],hash;var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');for(var i=0;i<hashes.length;i++)
{hash=hashes[i].split('=');vars.push(hash[0]);vars[hash[0]]=hash[1];}
return vars;},getUrlVar:function(name){return $.getUrlVars()[name];}});if(jQuery('#configurator').length>0){jQuery('#configurator').css('display','block');clearHTML='<span id="searchStr"> </span>';jQuery('#configurator').append(clearHTML);jQuery('#searchStr').css('display','block');jQuery('#configurator').css('display','block');mountHTML='<select name="mount" id="mount" onchange="getYears()">';mountHTML+='<option value="">Select Mount</option>';mountHTML+='<option value="Front Mount">Front Mount</option>';mountHTML+='<option value="Rear Mount">Rear Mount</option>';mountHTML+='</select>';jQuery('#configurator').append(mountHTML);jQuery('#mount').css('display','block');yearHTML='<select name="year" id="year" onchange="getMake()">';yearHTML+='<option value="">Select Year</option>';yearHTML+='</select>';jQuery('#configurator').append(yearHTML);makeHTML='<select name="make" id="make" onchange="getModel()">';makeHTML+='<option value="">Select Make</option>';makeHTML+='</select>';jQuery('#configurator').append(makeHTML);modelHTML='<select name="model" id="model" onchange="getStyle()">';modelHTML+='<option value="">Select Model</option>';modelHTML+='</select>';jQuery('#configurator').append(modelHTML);styleHTML='<select name="style" id="style" onchange="styleChange()">';styleHTML+='<option value="">Select Style</option>';styleHTML+='</select>';jQuery('#configurator').append(styleHTML);loaderHTML="<img src='http://dev.hitchguys.biz/api_dev/ajax-loader.gif' id='loader' style='display:none' width='208' height='25' />";jQuery('#configurator').append(loaderHTML);inputHTML='<div class="hold"></div><input type="submit" id="lookup_submit" name="lookup_submit" value="Find Hitch" onclick="findHitches()" />';jQuery('#configurator').append(inputHTML);clearHTML='<a href="javascript:clearResult()" style="display:inline; visibility:hidden;" id="clear">Clear</a>';jQuery('#configurator').append(clearHTML);resultsHTML='<div id="hitchResults" style="width: 100%"></div>';jQuery('#configurator').append(resultsHTML);if(jQuery('#configurator').attr('logo')!=null&&jQuery('#configurator').attr('logo')!=''){logoImg=jQuery.trim(jQuery('#configurator').attr('logo'));}else{logoImg='';}
if(jQuery('#configurator').attr('buyNow')){buyNow=jQuery('#configurator').attr('buyNow');}
jQuery('a.image').live('click',function(){var imgPath=jQuery(this).attr('href');jQuery.facebox({image:imgPath});return false;});jQuery('.mini').live('click',function(){var miniSrc=jQuery(this).attr('src');var bigSrc=jQuery('#mainImage img').attr('src');$(this).attr('src',bigSrc);$('#mainImage img').attr('src',miniSrc);});jQuery('.close').live('click',function(){$.facebox.close();});var mount=jQuery.getUrlVar('mount');var year=jQuery.getUrlVar('year');var make=jQuery.getUrlVar('make');var model=jQuery.getUrlVar('model');var style=jQuery.getUrlVar('style');var hitchID=jQuery.getUrlVar('hitchID');var hitchCode=jQuery.getUrlVar('hitchCode');if(hitchID){facebox=false;readMore(hitchID);}else if(hitchCode){facebox=false;readMoreByCode(hitchCode);}}})(jQuery);}}
initJQuery();initModal();function getURLVars(){var vars=[],hash;var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');for(var i=0;i<hashes.length;i++){hash=hashes[i].split('=');alert(hash[0]);alert(hash[1]);}}
function handleMake(data){jQuery('#clear').css('visibility','visible');jQuery('#make').html('<option value="">Select Make</option>');jQuery.each(data,function(i,make){jQuery('#make').append('<option>'+make+'</option>');});jQuery('#loader').css('display','none');jQuery('#make').css('display','block');}
function handleModel(data){jQuery('#clear').css('visibility','visible');jQuery('#model').html('<option value="">Select Model</option>');jQuery.each(data,function(i,model){jQuery('#model').append('<option>'+model+'</option>');});jQuery('#loader').css('display','none');jQuery('#model').css('display','block');}
function handleStyle(data){jQuery('#clear').css('visibility','visible');jQuery('#style').html('<option value="">Select Style</option>');jQuery.each(data,function(i,style){jQuery('#style').append('<option>'+style+'</option>');});jQuery('#loader').css('display','none');jQuery('#style').css('display','block');}
function styleChange(){jQuery('#lookup_submit').css('display','inline');}
function handleHitch(data){if(data==null||data.length==0){noneFound();}else{var returnType=jQuery('#configurator').attr('hitchdata').toLowerCase();if(returnType=="raw"){renderHTML(data);}else if(returnType=="html"){renderHTML(data);}
resetLookup();}}
function getYears(){jQuery('#clear').css('visibility','visible');var mount=jQuery('#mount').val();jQuery('#searchStr').text(mount+' ');jQuery('#searchStr').css('display','block');var date=new Date();var curYear=date.getFullYear();var i=0;jQuery('#year').html('<option value="">Select Year</option>');if(jQuery.trim(mount)=='Front Mount'){for(i=date.getFullYear();i>1983;i--){jQuery('#year').append('<option>'+i+'</option>');}
jQuery('#year').css('display','block');jQuery('#mount').css('display','none');}else if(jQuery.trim(mount)=='Rear Mount'){for(i=date.getFullYear();i>1961;i--){jQuery('#year').append('<option>'+i+'</option>');}
jQuery('#year').css('display','block');jQuery('#mount').css('display','none');}}
function getMake(){jQuery('#year').css('display','none');jQuery('#loader').css('display','block');var year=jQuery('#year').val();var mount=jQuery('#mount').val();jQuery('#searchStr').html(mount+' '+year);jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetMake&year='+year+'&mount='+mount+'&dataType=JSONP&callback=?',function(data){},'jsonp');}
function getModel(){jQuery('#make').css('display','none');jQuery('#loader').css('display','block');var year=jQuery('#year').val();var mount=jQuery('#mount').val();var make=jQuery('#make').val();jQuery('#searchStr').html(mount+' '+year+' '+make);jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetModel&mount='+mount+'&year='+year+'&make='+make+'&dataType=JSONP&callback=?',function(data){},'jsonp');}
function getStyle(){jQuery('#model').css('display','none');jQuery('#loader').css('display','block');var year=jQuery('#year').val();var mount=jQuery('#mount').val();var make=jQuery('#make').val();var model=jQuery('#model').val();jQuery('#searchStr').html(mount+' '+year+' '+make+' '+model);jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetStyle&mount='+mount+'&year='+year+'&make='+make+'&model='+model+'&dataType=JSONP&callback=?',function(data){},'jsonp');}
function findHitches(){jQuery('#lookup_submit').css('display','none');jQuery('#clear').css('display','none');jQuery('#hitchResults').html('');jQuery('#loader').css('display','block');var mount=jQuery('#mount').val();var year=jQuery('#year').val();var make=jQuery('#make').val();var model=jQuery('#model').val();var style=jQuery('#style').val();jQuery('#searchStr').html(mount+' '+year+' '+make+' '+model+' '+style);vehicleStr=jQuery('#searchStr').text();var returnType=jQuery('#configurator').attr('hitchdata');jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetHitch&mount='+mount+'&year='+year+'&make='+make+'&model='+model+'&style='+style+'&returnType='+returnType+'&dataType=JSONP&callback=?',function(data){},'jsonp');}
function resetLookup(){jQuery('#searchStr').html(' ');jQuery('#searchStr').css('display','block');jQuery('#lookup_submit').css('display','none');jQuery('#style').replaceWith(styleHTML);jQuery('#style').css('display','none');jQuery('#model').replaceWith(modelHTML);jQuery('#model').css('display','none');jQuery('#make').replaceWith(makeHTML);jQuery('#make').css('display','none');jQuery('#year').replaceWith(yearHTML);jQuery('#year').css('display','none');jQuery('#mount').replaceWith(mountHTML);jQuery('#mount').css('display','block');}
function clearResult(){jQuery('#clear').css('visibility','hidden');jQuery('#hitchResults').html('');resetLookup();}
function renderHTML(data){jQuery('#clear').css('display','inline');jQuery('#clear').css('visibility','visible');if(data!=null){var resultHTML='<div id="resultBox_outline"><div id="resultBox"><p id="vehicleStr">'+vehicleStr+'</p>';if(logoImg!=''){resultHTML+='<div id="logo"><img src="'+logoImg+'" /></div>';}
resultHTML+='</div></div><div style="clear:both"></div>';jQuery('#hitchResults').html(resultHTML);jQuery.each(data,function(i,hitch){var shortDesc=hitch.vchShortDesc.replace("CURT ","");var hitchHTML="<div class='hitch'>";hitchHTML+="<a href='javascript:readMore("+hitch.iProductID+")' class='shortDesc_link'>";hitchHTML+="<img class='curtLogo' src='http://dev.hitchguys.biz/api_dev/logo.png' width='80' style='display:inline' /><span class='trademark'>™</span> <span class='hitchTitle'>"+shortDesc+"</span></a><br />";var bulletStr='';bulletStr+=(jQuery.trim(hitch.txtBullet1)!='')?hitch.txtBullet1:'';bulletStr+=(jQuery.trim(hitch.txtBullet2)!='')?hitch.txtBullet2:'';bulletStr+=(jQuery.trim(hitch.txtBullet3)!='')?hitch.txtBullet3:'';hitchHTML+="<span class='txtBullets'>"+bulletStr+"</span>";hitchHTML+="<p>Product Code: <strong>"+hitch.vchProductCode+"</strong></p>";hitchHTML+="<a title='"+hitch.vchShortDesc+"' href='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_1024x768_a.jpg' class='image prodImg'>";hitchHTML+="<img src='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_a.jpg' onerror='jQuery(this).parent().remove();' />";hitchHTML+="<span>Click to Enlarge</span></a>";hitchHTML+="<div class='longDesc'>";hitchHTML+="<p>"+hitch.vchLongDesc+"</p>";hitchHTML+="<a class='more' href='javascript:readMore("+hitch.iProductID+")'>>>Read More</a><br />";hitchHTML+="</div>";hitchHTML+="<div class='prodLinks'>";hitchHTML+="<a target='_blank' href='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/installsheet/CM_"+hitch.vchProductCode+"_INS.pdf'><span>Instruction Sheet</span>";hitchHTML+="<img src='http://dev.hitchguys.biz/api_dev/file_pdf.png' width='20' /></a><br />";if(buyNow){hitchHTML+="<div class='button_outer buynow'><div class='button'><span>Buy Now</span></div></div>";}
hitchHTML+="</div>";hitchHTML+="<div style='clear:both'></div>";hitchHTML+="</div>";jQuery('#hitchResults').append(hitchHTML);});}else{jQuery('#hitchResults').html('<p id="vehicleStr">No results for '+vehicleStr+'</p>');}
jQuery('#loader').css('display','none');}
function noneFound(){jQuery('#hitchResults').html('<p id="noneFound">We\'re sorry but we were unable to locate any products that fit your vehicle specifications.</p>');jQuery('#loader').css('display','none');resetLookup();}
function readMore(prodID){jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetDetails&prodID='+prodID+'&dataType=JSONP&callback=?',function(data){},'jsonp');}
function readMoreByCode(prodCode){jQuery.get('http://api.curthitch.biz/AJAX_CURT.aspx?action=GetDetailsByCode&prodCode='+prodCode+'&dataType=JSONP&callback=?',function(data){},'jsonp');}
function loadDetails(data){if(data){var hitch=data[0];}else{noneFound();return false;}
var shortDesc=hitch.vchShortDesc.replace('CURT ','');var hitchHTML="<div class='hitchDetails'>";hitchHTML+="<span class='title'><img class='shortLogo' src='http://dev.hitchguys.biz/api_dev/logo.png' />"+shortDesc+"</span>";if(facebox){hitchHTML+="<span class='close'><img src='http://dev.hitchguys.biz/api_dev/close-icon.png' /></span>";}else{hitchHTML+="<br /><br />";}
hitchHTML+="<div id='imageContainer'>";hitchHTML+="<div id='mainImage'>";hitchHTML+="<img src='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_a.jpg' onerror='jQuery(this).parent().hide()' />";hitchHTML+="</div>";hitchHTML+="<img class='mini' src='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_b.jpg' onerror='jQuery(this).hide()' />";hitchHTML+="<img class='mini' src='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_c.jpg' onerror='jQuery(this).hide()' />";hitchHTML+="<img class='mini' src='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_d.jpg' onerror='jQuery(this).hide()' />";hitchHTML+="<img class='mini' style='margin-right:0px' src='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/images/"+hitch.vchProductCode+"_300x225_e.jpg' onerror='jQuery(this).hide()' />";hitchHTML+="</div>";hitchHTML+="<p class='detailsLongDesc'>"+hitch.vchLongDesc+"</p>";hitchHTML+="<div class='prodDetails'><table style='border-bottom: 2px solid black'>";hitchHTML+="<tr><td class='label'>Product #<td class='val'>"+hitch.vchProductCode+"</td></tr>";hitchHTML+="<tr><td class='label'>MSRP<td class='val'>$"+hitch.mHitchList+"</td></tr>";hitchHTML+="<tr><td class='label'>UPC<td class='val'>"+hitch.vchHitchUPC+"</td></tr>";hitchHTML+="<tr><td class='label'>Receiver Tube<td class='val'>"+hitch.txtBullet1+"</td></tr>";hitchHTML+="<tr><td class='label'>Install Time<td class='val'>"+hitch.InstallTime+"*</td></tr>";hitchHTML+="<tr><td class='label'>Instruction Sheet<td class='val'>";hitchHTML+="<a target='_blank' class='installSheet' href='http://test.curthitch.biz/masterlibrary/"+hitch.vchProductCode+"/installSheet/CM_"+hitch.vchProductCode+"_INS.pdf'><span>Download</span>";hitchHTML+="<img width='25' src='http://dev.hitchguys.biz/api_dev/file_pdf.png' /></a>";hitchHTML+="</td></tr>";if(jQuery.trim(hitch.txtNote1)!=''||jQuery.trim(hitch.txtNote2)!=''||jQuery.trim(hitch.txtNote3)!=''||jQuery.trim(hitch.txtNote4)!=''){hitchHTML+="<tr><td colspan='2' class='label noteHeader'>Notes</td></tr>";}
if(jQuery.trim(hitch.txtNote1)!=''){hitchHTML+="<tr><td colspan='2' class='val notes'>"+hitch.txtNote1+"</td></tr>";}
if(jQuery.trim(hitch.txtNote2)!=''){hitchHTML+="<tr><td colspan='2' class='val notes'>"+hitch.txtNote2+"</td></tr>";}
if(jQuery.trim(hitch.txtNote3)!=''){hitchHTML+="<tr><td colspan='2' class='val notes'>"+hitch.txtNote3+"</td></tr>";}
if(jQuery.trim(hitch.txtNote4)!=''){hitchHTML+="<tr><td colspan='2' class='val notes'>"+hitch.txtNote4+"</td></tr>";}
var weightCarrying='n/a';var tongueWeight='n/a';var wdTongue='n/a';var wd='n/a';var vchWC=new String(hitch.vchWC);var vchWD=new String(hitch.vchWD);var ratings1=vchWC.split('/');var ratings2=vchWD.split('/');if(jQuery.trim(hitch.vchWC).toUpperCase()!='N/A'){weightCarrying=ratings1[0]+' lb.';tongueWeight=ratings1[1]+' lb.';}
if(jQuery.trim(hitch.vchWD).toUpperCase()!='N/A'){wd=ratings2[0]+' lb.';wdTongue=ratings2[1]+' lb.';}
hitchHTML+="<tr><td colspan='2' class='label noteHeader'>Gross Load Capacity</td></tr>";hitchHTML+="<tr><td class='label'>Weight Carrying</td><td class='val'>"+weightCarrying+"</td></tr>";hitchHTML+="<tr><td class='label'>Tongue Weight</td><td class='val'>"+tongueWeight+"</td></tr>";hitchHTML+="<tr><td class='label'>Weight Distribution (WD)</td><td class='val'>"+wd+"</td></tr>";hitchHTML+="<tr><td class='label'>Tongue Weight (WD)</td><td class='val'>"+wdTongue+"</td></tr>";hitchHTML+="</table>";hitchHTML+="<p class='disclaimer'>* Estimate is based on professional installation.</p>";hitchHTML+="</div>";hitchHTML+="</div>";if(facebox==true){jQuery.facebox(hitchHTML);}else{hitchHTML+="<div style='clear:both'></div>";jQuery('#configurator').append(hitchHTML);}}
function loadNextImage(element){var imgChars=new Array("a","b","c","d","e");var imageSrc=jQuery(element).attr('str');var extensionPosition=jQuery(element).search('.jpg');var imgCharPosition=extensionPosition-1;console.log(imgCharPosition);}