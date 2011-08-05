function moveUp(elementid)
{
	var leftpos = document.getElementById('carouselcont-' + elementid.split('-')[1]).style.top
	var pixels = leftpos.split('p')
	var position = Number(pixels[0])
	if(position < 0)
	{
		$('#carouselcont-' + elementid.split('-')[1]).animate({
			top: (position + 194) + "px"
		}, "normal","easeOutExpo",function (){})
	}
}

function moveDown(elementid)
{
	var leftpos = document.getElementById('carouselcont-' + elementid.split('-')[1]).style.left
	var photocount = $('#carouselcont-' + elementid.split('-')[1]).find('div.carouselimage').length
	var pixels = leftpos.split('p')
	var position = Number(pixels[0])

	var nomore = (photocount * 64) - 194
	if(nomore > (Math.abs(position)))
	{
		$('#carouselcont-' + elementid.split('-')[1]).animate({
			top: (position - 194) + "px"
		}, "normal","easeOutExpo",function (){})
	}
}

function topMoveLeft(elementid)
{
	var leftpos = document.getElementById('topcarouselcont-' + elementid.split('-')[1]).style.left
	var pixels = leftpos.split('p')
	var position = Number(pixels[0])
	if(position < 0)
	{
		$('#topcarouselcont-' + elementid.split('-')[1]).animate({
			left: (position + 560) + "px"
		}, "normal","easeOutExpo")
	}
}

function topMoveRight(elementid)
{
	var leftpos = document.getElementById('topcarouselcont-' + elementid.split('-')[1]).style.left
	var photocount = $('#topcarouselcont-' + elementid.split('-')[1]).find('div.topcarouselimage').length
	var pixels = leftpos.split('p')
	var position = Number(pixels[0])

	var nomore = (photocount * 112) - 560
	if(nomore > (Math.abs(position)))
	{
		$('#topcarouselcont-' + elementid.split('-')[1]).animate({
			left: (position - 560) + "px"
		}, "normal","easeOutExpo")
		
	}
}
