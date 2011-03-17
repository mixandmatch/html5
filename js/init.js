/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var log;
var mixAndMatch;

function initMixAndMatch() {
	mamConfigureLogging();
        mixAndMatch = new MixAndMatch();
        
//	getLocation();
//	test();
}

/**
 * configure logging
 */
function mamConfigureLogging() {
	// Define root logger and log levels
	var logRoot = log4javascript.getRootLogger();
	// var appender = new log4javascript.InPageAppender('log');
	var appender = new log4javascript.PopUpAppender();
	var layout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %-40c - %m%n");
	appender.setLayout(layout);
	logRoot.addAppender(appender);
	logRoot.setLevel(log4javascript.Level.OFF);
	logRoot.setLevel(log4javascript.Level.DEBUG);
	log4javascript.setEnabled(true);

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
	log = logRoot;
}

function mamGetUrlVars()
{
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
