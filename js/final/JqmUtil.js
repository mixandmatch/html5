/** 
 * Util methods
 */

function JqmUtilClass() {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.JqmUtil");

	/**
	 * @private
	 */
	this.initialized = {};

	this.live = function(pPage, pEvent, pCallback) {
		log.debug('live() page:' +pPage+ ', event:' +pEvent);
		
		if (this.initialized[pPage] == undefined) {
			this.initialized[pPage] = {};
		}

		if (this.initialized[pPage][pEvent] == true) {
			// nothing to do
			log.debug('page and event already initialized.');
		} else {
			log.info('initialize');
			this.initialized[pPage][pEvent] = true;
			//$('div:jqmData(url="' +pPage+ '")').live(pEvent, pCallback);
			$('#' +pPage ).live(pEvent, function() {
				jqmLog.debug('execution. Page:' +pPage+ ', Event:' +pEvent);
				pCallback();
			});
			log.debug('finished');
		}
	}

	log.debug('JqmUtilClass created');
}

//var JqmUtil = new JqmUtilClass();
