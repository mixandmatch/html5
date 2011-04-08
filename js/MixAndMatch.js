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
    this.getLocations = function() {
        log.debug('checkin()');
        remoteService.getLocations(getLocationsCallback);
    }
    
    /**
     * callback function for the getLocations method
     */
    function getLocationsCallback(data) {
        log.debug('getLocationsCallback');
        log.debug('list object:', JSON.stringify(data));
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
