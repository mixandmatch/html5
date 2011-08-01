
// global logger called "log"
var log;

/**
 * configure logging
 */
function configureLogging() {
	// Define root logger and log levels
	var logRoot = log4javascript.getRootLogger();
	// var appender = new log4javascript.InPageAppender('log');
	var appender = new log4javascript.PopUpAppender();
	var layout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %-40c - %m%n");
	appender.setLayout(layout);
	logRoot.addAppender(appender);
	logRoot.setLevel(log4javascript.Level.OFF);
	logRoot.setLevel(log4javascript.Level.DEBUG);

	log4javascript.setEnabled(false);

	// Define log levels
	/*
	var urlParams = mamGetUrlVars();
	if (urlParams.mamLogging) {
		$.cookie('mamLogging', urlParams.mamLogging, {path: '/', expires: 1} );
	}

	var cookieMamLogging = $.cookie('mamLogging');
	if (cookieMamLogging === 'true') {
		log4javascript.setEnabled(true);
		logRoot.setLevel(log4javascript.Level.ERROR);
		log4javascript.getLogger("de.mixandmatch").setLevel(log4javascript.Level.DEBUG);
	}
	*/
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
