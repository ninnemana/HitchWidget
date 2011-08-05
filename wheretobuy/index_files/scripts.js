$(window).load(function () {
	// Load image scroller
	$("div#makeMeScrollable").smoothDivScroll({ autoScroll: "onstart", autoScrollDirection: "endlessloopleft", autoScrollStep: 1, autoScrollInterval: 25, startAtElementId: "startAtMe", visibleHotSpots: "always"});

	// If the scroller is moused over, stop the scrolling.
	// This is for when we want to wrap the images in links to lifestyles later
	$('#makeMeScrollable').mouseover(function(){
		$('div#makeMeScrollable').smoothDivScroll('stopAutoScroll');
	});
	
	// Restart the scroller when the mouse moves out of the scrollable area
	$('#makeMeScrollable').mouseout(function(){
		$('div#makeMeScrollable').smoothDivScroll('startAutoScroll');
	});
});

$(document).ready(function(){  

	// Display the lookup: we do this via javascript because its functionality is javascript based, so why let non-js users see it?
	$('div.header-home div.hitchlookup').css('display','block');

	$('#clearSearch').live('click',function(){
		// Empty the search string
		$('#searchStr').html('');
		$('#btnSubmit').css('display','none')
		$('.hitchlookup select').attr('selectedIndex',0);
		$('.hitchlookup select').css('display','none');
		$('#selectVehicleMount').css('display','block');
	});

	$("ul#nav li").hoverIntent(makeTall,makeShort);
	$("a.mainImglink").fancybox();
	$("a.magnifier").fancybox();
	$("a.connImgLink").fancybox();
	$("li p.install").qtip({
		content: 'Estimate is based on professional installation.<br />Novice installers - see "How to" below.',
		style: { 
			width: 300,
			name: 'dark', // Inherit from preset style
			tip: 'bottomMiddle'
		},
		position: {
			corner: {
				target: 'topMiddle',
				tooltip: 'bottomMiddle'
			}
		}
	});	
	function makeTall() 
	{ //When list item is hovered over ...  
		$(this).find("ul.subnav").fadeIn('fast')
	}
	
	function makeShort()
	{
		$(this).parent().find("ul.subnav").hide(); //When the mouse hovers out of the subnav, move it back up  
	}
	
	$("div.floatinglinks a").hover(
		function () {
			$(this).fadeTo(0,.3)
			$(this).css({'background-color': '#D74E1A'})
		},
		function () {
			$(this).fadeTo(0,0)
	})
	
	$(".carouselleft").fadeTo('0','.7')
	$(".carouselright").fadeTo('0','.7')
	$(".carouselleft").hover(function(){$(this).fadeTo('fast',1)},function(){$(this).fadeTo('fast',.7)})
	$(".carouselright").hover(function(){$(this).fadeTo('fast',1)},function(){$(this).fadeTo('fast',.7)})
	$(".carouselleft").click(function(){moveUp($(this).attr('id'))})
	$(".carouselright").click(function(){moveDown($(this).attr('id'))})
	$(".carouselcont div.carouselimage img").click(function(){
		var elementid = $(this).attr('id')
		$('#carouselimages-' + elementid.split('-')[1] + ' div.carouselimage').each(function(){$(this).removeClass('selected')})
		$(this).parent().addClass('selected')
		var idstr = $(this).attr('id')
		var sourceval = $(this).attr('src')
		var sourcestr = sourceval.split('_')
		var bigsource = sourcestr[0] + '_300x225_' + sourcestr[2]
		var fullsource = sourcestr[0] + '_1024x768_' + sourcestr[2]
		$('#mainImg-' + idstr.split('-')[1]).attr('src',bigsource)
		$('#mainImglink-' + idstr.split('-')[1]).attr('href',fullsource)
		$('#magnifier-' + idstr.split('-')[1]).attr('href',fullsource)
		})
	setTabs()
	$("div.topcarouselimages img").click(function(){activateHitch($(this).attr('id'))})
	$(".topcarouselleft").fadeTo('0','.7')
	$(".topcarouselright").fadeTo('0','.7')
	$(".topcarouselleft").hover(function(){$(this).fadeTo('fast',1)},function(){$(this).fadeTo('fast',.7)})
	$(".topcarouselright").hover(function(){$(this).fadeTo('fast',1)},function(){$(this).fadeTo('fast',.7)})
	$(".topcarouselleft").click(function(){topMoveLeft($(this).attr('id'))})
	$(".topcarouselright").click(function(){topMoveRight($(this).attr('id'))})
	$(".hitchOption").click(function(){
		var elementid = $(this).attr('id')
		var parentstr = elementid.split('-')[1].split('_')[0] + "_" + elementid.split('-')[1].split('_')[1]
		$('#optionTitleCont-' + parentstr + ' p.optionTitle').each(function (){$(this).hide()})
		$('#optionCont-' + parentstr + ' div.hitchOption').each(function (){
			$(this).removeClass('activeOption');
			$(this).find('img').fadeTo(0,.5)
		})
		$(this).addClass('activeOption')
		$(this).find('img').fadeTo(0,1)
		$('#hitchright-' + parentstr + ' div.optioninfo').each(function (){$(this).css('display','none');})
		$('#hitchleft-' + parentstr + ' div.optionimages').each(function (){$(this).css('display','none');})
		$('#optionimages-' + elementid.split('-')[1]).css('display','block');
		$('#optioninfo-' + elementid.split('-')[1]).css('display','block');
		$('#optionTitle-' + elementid.split('-')[1]).css('display','block');
	})
	$(".hitchOption").each(function (){if($(this).attr('class') != 'hitchOption activeOption') $(this).find('img').fadeTo(0,.5)})
	$(".hitchOption").hover(function (){
			if($(this).attr('class') != 'hitchOption activeOption') {$(this).find('img').fadeTo(0,1)}
		},function(){
			if($(this).attr('class') != 'hitchOption activeOption')	{$(this).find('img').fadeTo(0,.5)}
		}
	)
	$(".reviewSeeMore").click(function (){
		$(this).hide()
		var targetstr = $(this).attr('id').split('-')[1]
		$('#reviews-' + targetstr).slideDown('slow');
	})

	$(".reviewSeeLess").click(function (){
		$('#seemore-' + $(this).attr('id').split('-')[1]).show()
		var targetstr = $(this).attr('id').split('-')[1]
		$('#reviews-' + targetstr).slideUp('slow');
	})

	$("ul.classtabs li a").click(function(){
		if($(this).attr('class') != 'inactive' && $(this).attr('class') != 'inactive right')
		{
			$("ul.classtabs li a").each(function (i,obj) {
				$(obj).removeClass("active")
				$(obj).removeClass("right")
			})
			$(this).addClass("active")
			setTabs()
			classval = $(this).attr('id').split('_')[1]
			$("div.hitches").each(function(){
				$(this).hide()
			})
			$("#hitchcont_" + classval).show()
		}
	})
	$("ul.lowertabs li a").click(function(){
		clearTabs($(this).attr('id'))
		$(this).addClass("active")
		$(this).parent().addClass("active")
		hideTabContent($(this).attr('id'))
		tabnum = $(this).attr('id').split('-')[1]
		$('#tab-' + tabnum).show()
	})
});

function setTabs()
{
	var zind = 5;
	var isactive = false;
	$("ul.classtabs li").each(function () {
		var tabclass = $(this).find('a').attr('class')
		if(tabclass == 'active')
		{
			isactive = true
			$(this).css('z-index',10)
		} else {
			if(isactive)
			{
				zind--
				$(this).find('a').addClass('right')
			} else {
				zind++
			}
			$(this).css('z-index',zind)
		}
	})
}

function clearTabs(elementid)
{
	fullid = elementid.split('-')[1]
	tabnum = fullid.split('_')[0] + '_' + fullid.split('_')[1]
	
	$("ul#lowertabs-" + tabnum + " li").each(function () {
		$(this).removeClass("active")
		$(this).find('a').removeClass("active")
	})
}

function hideTabContent(elementid)
{
	fullid = elementid.split('-')[1]
	tabnum = fullid.split('_')[0] + '_' + fullid.split('_')[1]

	$("div#lowercontent-" + tabnum + " div.tabcontent").each(function(){
		$(this).hide()
	})
}

function activateHitch(elementid)
{
	$('#topcarouselimages-' + elementid.split('-')[1].split('_')[0] + ' div.topcarouselimage').each(function(){$(this).removeClass('selected')})
	$('#hitchcont_' + elementid.split('-')[1].split('_')[0] + ' div.mainhitchcont').each(function(){$(this).hide();})
	var target = elementid.split('-')[1]
	$('div#hitch-' + target).show()
	$('#' + elementid).parent().addClass('selected')
}

function getBallMounts(elementid)
{
	var categories = document.getElementById('ballmounts-' + elementid).value
	var ajaxData = new Object();

	ajaxData.event = "getBallMounts";
	ajaxData.categories = $('#ballmounts-' + elementid).val();

	$.ajax({ 
		url: "index.cfm",
		type: "GET",
		data: ajaxData,
		dataType: "xml",				
		success: function( data )
		{
			var success		= $(data).find('success').text();
			var error		= $(data).find('error').text();

			if( error )
			{
				alert( error );	
			}
			else
			{
				var idlist = $(data).find('id')
				var namelist = $(data).find('name')
				var imagelist = $(data).find('image')
				var parent = $('#tab-' + elementid + '_1')
				if(idlist.length > 0)
				{
					for(var i = 0; i < idlist.length; i++)
					{
						var mountcont = document.createElement('div')
						mountcont.className = 'accessorybox'
						var linkstr = 'index.cfm?event=iframeprodetail&categoryid=47&id=' + $(idlist[i]).text()
						var linkobj = document.createElement('a')
						linkobj.className = 'iframe'
						linkobj.href = linkstr
						linkobj.innerHTML = $(namelist[i]).text()
						var imgobj = document.createElement('img')
						imgobj.src = $(imagelist[i]).text()
						imgobj.alt = $(namelist[i]).text()
						var linkobj2 = document.createElement('a')
						linkobj2.href = linkstr
						linkobj2.className = 'iframe'
						linkobj2.appendChild(imgobj)
						if($(namelist[i]).text() != '')
						{
							mountcont.appendChild(linkobj)
							mountcont.appendChild(linkobj2)
							parent.append(mountcont)
						}
					}
					$("a.iframe").fancybox({'width':760,'height':500});
				} else {
					var pobj = document.createElement('p')
					pobj.innerHTML = 'No Ball Mounts are available for this hitch.'
					parent.append(pobj)
				}
				var clearer = document.createElement('div')
				clearer.style.clear = 'both'
				parent.append(clearer)
			}
		}

	});

}

function getAccessories(elementid)
{
	var ajaxData = new Object();

	ajaxData.event = "getAccessories";
	ajaxData.list = $('#accessories-' + elementid).val();

	$.ajax({ 
		url: "index.cfm",
		type: "GET",
		data: ajaxData,
		dataType: "xml",				
		success: function( data )
		{
			var success		= $(data).find('success').text();
			var error		= $(data).find('error').text();

			if( error )
			{
				alert( error );	
			}
			else
			{
				var idlist = $(data).find('id')
				var namelist = $(data).find('name')
				var imagelist = $(data).find('image')
				var oldCodes = $(data).find('oldCode')
				var newCodes = $(data).find('newCode')
				var parent = $('#tab-' + elementid + '_3')
				if(namelist.length > 0)
				{
					for(var i = 0; i < namelist.length; i++)
					{
						var mountcont = document.createElement('div')
						mountcont.className = 'accessorybox'
						var imgobj = document.createElement('img')
						imgobj.className = 'accessory'
						imgobj.src = $(imagelist[i]).text()
						imgobj.alt = $(namelist[i]).text()
						var pobj = document.createElement('p')
						var spanobj = document.createElement('span')
						spanobj.innerHTML = $(namelist[i]).text()
						pobj.appendChild(spanobj)
						if($(newCodes[i]).text() != '')
						{
							pobj.innerHTML = pobj.innerHTML + '#' + $(newCodes[i]).text() + ' / ' + $(oldCodes[i]).text()
						} else {
							pobj.innerHTML = pobj.innerHTML + $(oldCodes[i]).text()
						}
						if($(namelist[i]).text() != '')
						{
							mountcont.appendChild(imgobj)
							mountcont.appendChild(pobj)
							parent.append(mountcont)
						}
					}
				} else {
					var pobj = document.createElement('p')
					pobj.innerHTML = 'No Accesseries are available for this hitch.'
					parent.append(pobj)
				}
				var clearer = document.createElement('div')
				clearer.style.clear = 'both'
				parent.append(clearer)
			}
		}

	});

}