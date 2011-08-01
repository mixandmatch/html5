/**
 * This is the main MixAndMatch class.
 */
function MixAndMatch(pRemoteService) {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.MixAndMatch");
	var that = this;

	/**
	 * the remote service for ajax calls
	 * @private
	 */
	this.remoteService = pRemoteService;
	
	/**
	 * location cache
	 * @private
	 */
	this.locations = null;

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
		this.remoteService.getLocations(function(pData) {
			this.locations = pData;
			callback(pData);
		});
	}
	
	this.getLocationName = function(pLocationId) {
		log.debug('getLocationName');
		
		// TODO locations laden falls noch nicht geschehen
		
		var locationName = pLocationId;
		if (this.locations != null) {
			locationName = this.getLocationNamePrivate(pLocationId, this.locations);
		} else {
			log.error('location list not loaded. Can not determine location name.');
		}
		
		return locationName;
	}
	
	/**
	 * @private
	 */
	this.getLocationNamePrivate = function(pLocationId, pLocationList) {
		log.debug('getLocationNamePrivate');

		var locationName = pLocationId;
		$.each(pLocationList, function(pIndex, pEntry) {
			if (pEntry.key.toLowerCase() == pLocationId.toLowerCase()) {
				locationName = pEntry.label;
			}
		});
		return locationName;
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
		
		if (this.locations == null) {
			this.remoteService.getLocations(function(pLocationList) {
				that.locations = pLocationList;
				that.remoteService.getLunchRequestsByUser(pCallback, pUserid);
			});
		} else {
			this.remoteService.getLunchRequestsByUser(pCallback, pUserid);
		}
	}
	
	/**
     * public lunch response function
     */
	this.getLunchRequestsByLocationAndDate = function(pCallback, pLocation, pDate) {
		log.debug('getLunchRequestsByLocationAndDate()');
		this.remoteService.getLunchRequestsByLocationAndDate(pCallback, pLocation, pDate);
	}
	
	/**
     * 
     */
	this.getMatchDetails = function(pCallback, pMatchUrl) {
		log.debug('getMatchDetails() matchUrl:', pMatchUrl);
		this.remoteService.getMatchDetails(pCallback, pMatchUrl);
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
