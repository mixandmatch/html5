/**
 * This is the main MixAndMatch class.
 */
function MixAndMatch(pRemoteService) {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.MixAndMatch");

	/**
	 * the remote service for ajax calls
	 * @private
	 */
	this.remoteService = pRemoteService;

	/**
	 * constructor like method (is called at the end of this file)
	 */
	var constructor = function() {
	};

	/**
     * public checkin function
     */
	this.getLocations = function(callback) {
		log.debug('getLocations');
		this.remoteService.getLocations(callback);
	}

	/**
     * public lunch response function
     */
	this.getAllLunchRequests = function(pCallback) {
		log.debug('getAllLunchRequests()');
		this.remoteService.getAllLunchRequests(pCallback);
	}
	
	/**
     * public lunch response function
     */
	this.getLunchRequestsByUser = function(pCallback, pUserid) {
		log.debug('getLunchRequestsByUser()');
		this.remoteService.getLunchRequestsByUser(pCallback, pUserid);
	}
	
	/**
     * public lunch response function
     */
	this.getLunchRequestsByLocationAndDate = function(pCallback, pLocation, pDate) {
		log.debug('getLunchRequestsByLocationAndDate()');
		this.remoteService.getLunchRequestsByLocationAndDate(pCallback, pLocation, pDate);
	}
	
	/**
     * create a lunch request
     */
	this.createLunchRequest = function(callback, userDataObject) {
		log.debug('createLunchRequest()');
		this.remoteService.createLunchRequest(callback, userDataObject);
	}

	/** use the private log object */
	constructor();
	log.debug('MixAndMatch object created');
}
