/**
 * This is the main MixAndMatch class.
 */
function MixAndMatch(pRemoteService) {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.MixAndMatch");

	/** the remote service for ajax calls */
	var remoteService = pRemoteService;

	/**
     * public checkin function
     */
	this.getLocations = function(callback) {
		log.debug('getLocations');
		remoteService.getLocations(callback);
	}

	/**
     * public lunch response function
     */
	this.getLunchResponse = function(callback, userDataObject) {
		log.debug('lunch response');
		remoteService.getLunchResponse(callback, userDataObject);
	}

	/** use the private log object */
	log.debug('MixAndMatch created');
}
