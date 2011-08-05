/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function($) { 
    $.fn.extend({

       CURTConfig: function(options){

           var defaults = {
               submit:      'AJAX_html',
               resultBox:   '#configurator_result'
           };
           var options = $.extend(defaults,options);
           return this.each(function(){
               var o = options;
               alert(o.submit);
           });
       }

    })(jQuery);

    if($('#configurator').length > 0){

        var clearHTML = '<span id="searchStr"></span>';
        $('#configurator').append(clearHTML);

        $('#configurator').css('display','block');
        // Add the first element to select mount type
        var mountHTML = '<select name="mount" id="mount" onchange="getYears()">';
        mountHTML += '<option value="">Select Mount</option>';
        mountHTML += '<option value="Front Mount">Front Mount</option>';
        mountHTML += '<option value="Rear Mount">Rear Mount</option>';
        mountHTML += '</select>';
        $('#configurator').append(mountHTML);
        $('#mount').css('display','block');

        // Add the second element to select year
        var yearHTML = '<select name="year" id="year" onchange="getMake()">';
        yearHTML += '<option value="">Select Year</option>';
        yearHTML += '</select>';
        $('#configurator').append(yearHTML);

        // Add the third element to select make
        var makeHTML = '<select name="make" id="make" onchange="getModel()">';
        makeHTML += '<option value="">Select Make</option>';
        makeHTML += '</select>';
        $('#configurator').append(makeHTML);

        // Add the fourth element to select model
        var modelHTML = '<select name="model" id="model" onchange="getStyle()">';
        modelHTML += '<option value="">Select Model</option>';
        modelHTML += '</select>';
        $('#configurator').append(modelHTML);

        // Add the fifth element to select style
        var styleHTML = '<select name="style" id="style">';
        styleHTML += '<option value="">Select Style</option>';
        styleHTML += '</select>';
        $('#configurator').append(styleHTML);

        var inputHTML = '<input type="submit" id="lookup_submit" name="lookup_submit" value="Find Hitch" onclick="findHitches()" />';
        $('#configurator').append(inputHTML);
    }
})(jQuery);