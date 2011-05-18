// load css files
requiredCSS("../../css/jqm/jquery.ui.datepicker.mobile.css")

// load js files
//reset type=date inputs to text before including the datepicker lib
$( document ).bind( "mobileinit", function(){
	$.mobile.page.prototype.options.degradeInputs.date = true;
});
requiredJS("../../js/lib/jQuery.ui.datepicker.js");
requiredJS("../../js/lib/jquery.ui.datepicker.mobile.js");
