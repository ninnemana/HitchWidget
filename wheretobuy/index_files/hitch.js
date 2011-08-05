$(document).ready(function(){

	// Handle the change of the mount type
	$('#selectVehicleMount').change(function(){
		if($(this).val() != '' && $(this).val().toUpperCase() != 'MOUNT'){
			$('#searchStr').append($('#selectVehicleMount option:selected').html() + ' ');
		}
		getYears()
	});
	
	// Handle the change of the vehicle year
	$('#selectVehicleYear').change(function(){
		if($(this).val() != ''){
			$('#searchStr').append($('#selectVehicleYear option:selected').html() + ' ');
			getMakes()
		}
	});
	
	// Handle the change of the vehicle make
	$('#selectVehicleMake').change(function(){
		if($(this).val() != ''){
			$('#searchStr').append($('#selectVehicleMake option:selected').html() + ' ');
			getModels()
		}
	});
	
	// Hande the change of the vehicle model
	$('#selectVehicleModel').change(function(){
		if($(this).val() != ''){
			$('#searchStr').append($('#selectVehicleModel option:selected').html());
			getStyles()
		}
	});
});

function updateModifyType(){

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


function getYears()
{
	var mount = $('#selectVehicleMount').val()

	$.ajax({
		url: "index.cfm?event=yearxml&mount=" + mount,
		type: "GET",
		dataType: "xml",				
		success: function( data )
		{
			var years = $(data).find('year')
			var idlist = $(data).find('id')
			$('#selectVehicleYear').empty()
			for(var i = 0; i < years.length; i++)
			{
				var optobj = document.createElement('option')
				$(optobj).val($(idlist[i]).text())
				$(optobj).html($(years[i]).text())
				$('#selectVehicleYear').append(optobj)
			}
			//getMakes();
		}
	})
}

function getMakes()
{

	var mount = $('#selectVehicleMount').val()
	var year = $('#selectVehicleYear').val()

	$.ajax({
		url: "index.cfm?event=makexml&year=" + year + "&mount=" + mount,
		type: "GET",
		dataType: "xml",				
		success: function( data )
		{
			var makes = $(data).find('make')
			var idlist = $(data).find('id')
			$('#selectVehicleMake').empty()
			for(var i = 0; i < makes.length; i++)
			{
				var optobj = document.createElement('option')
				$(optobj).val($(idlist[i]).text())
				$(optobj).html($(makes[i]).text())
				$('#selectVehicleMake').append(optobj)
			}
			//getModels();
		}
	})
}

function getModels(){

	var mount = $('#selectVehicleMount').val()
	var year = $('#selectVehicleYear').val()
	var make = $('#selectVehicleMake').val()

	$.ajax({
		url: "index.cfm?event=modelxml&year=" + year + "&make=" + make + "&mount=" + mount,
		type: "GET",
		dataType: "xml",				
		success: function( data )
		{
			var models = $(data).find('name')
			var idlist = $(data).find('id')
			$('#selectVehicleModel').empty()
			for(var i = 0; i < models.length; i++)
			{
				var optobj = document.createElement('option')
				$(optobj).val($(idlist[i]).text())
				$(optobj).html($(models[i]).text())
				$('#selectVehicleModel').append(optobj)
			}
			//getStyles();
		}
	})
}

function getStyles(){

	var mount = $('#selectVehicleMount').val()
	var year = $('#selectVehicleYear').val()
	var make = $('#selectVehicleMake').val()
	var model = $('#selectVehicleModel').val()

	$.ajax({
		url: "index.cfm?event=stylexml&year=" + year + "&make=" + make + "&mount=" + mount + "&model=" + model,
		type: "GET",
		dataType: "xml",				
		success: function( data )
		{
			var styles = $(data).find('vstyle')
			var idlist = $(data).find('id')
			$('#selectVehicleStyle').empty()
			for(var i = 0; i < styles.length; i++)
			{
				var optobj = document.createElement('option')
				$(optobj).val($(idlist[i]).text())
				$(optobj).html($(styles[i]).text())
				$('#selectVehicleStyle').append(optobj)
			}
		}
	})
}