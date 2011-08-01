function requiredJS(jspath) {
	document.write('<script type="text/javascript" src="'+jspath+'"></script>');
}

function requiredCSS(jspath) {
	document.write('<link rel="stylesheet" href="'+jspath+'"/>');
}

// load css files
requiredCSS("../../css/jqm/jquery.ui.datepicker.mobile.css");
//requiredCSS("../../css/jqm/jquery.mobile-1.0a3.min.css");
requiredCSS("../../css/jqm/jquery.mobile-1.0b1.min.css");
requiredCSS("../../css/jqm/jqm-docs.css");

// load js files
requiredJS("../../js/lib/jquery-1.6.2.min.js");
//requiredJS("../../js/lib/jquery.mobile-1.0a3.min.js");
requiredJS("../../js/lib/jquery.mobile-1.0b1.min.js");

requiredJS("../../js/lib/jquery.cookie.js");
requiredJS("../../js/lib/log4javascript.js");
requiredJS("../../js/lib/simpledateformat.js");
requiredJS("../../js/lib/json2.js");
requiredJS("../../js/lib/jquery.timers-1.2.js");
requiredJS("../../js/lib/date.js");

requiredJS("../../js/final/init.js");
requiredJS("../../js/final/MixAndMatch.js");
requiredJS("../../js/final/RemoteService.js");
requiredJS("../../js/final/RemoteServiceValidator.js");
requiredJS("../../js/final/StorageService.js");
requiredJS("../../js/final/Utils.js");

/*
$(document).ready(function(){
	configureLogging();
});
*/

