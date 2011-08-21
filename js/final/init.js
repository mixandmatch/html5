
// global logger called "log"
var log;
var jqmLog;

/**
 * configure logging
 */
function configureLogging() {
	// Define root logger and log levels
	var logRoot = log4javascript.getRootLogger();
	// var appender = new log4javascript.InPageAppender('log');
	var appender = new log4javascript.PopUpAppender();
	var layout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %-30c - %m%n");
	appender.setLayout(layout);
	logRoot.addAppender(appender);
	//logRoot.setLevel(log4javascript.Level.OFF);
	logRoot.setLevel(log4javascript.Level.DEBUG);
	log4javascript.setEnabled(false);

	// Define log levels
	var urlParams = getUrlVars();
	if (urlParams.logging) {
		$.cookie('logging', urlParams.logging, {path: '/', expires: 1} );
	}

	var cookieLogging = $.cookie('logging');
	//cookieLogging = 'true';
	if (cookieLogging == 'true') {
		log4javascript.setEnabled(true);
		log4javascript.getLogger("de.html5").setLevel(log4javascript.Level.TRACE);
		jqmLog = log4javascript.getLogger("jquerymobile");
		jqmLog.setLevel(log4javascript.Level.TRACE);
	}
	logRoot.info("Logging loaded and configured.");
    
	// the logRoot logger is also known global as "log"
	log = logRoot;
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
