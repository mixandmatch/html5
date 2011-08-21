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
	 * @private
	 */
	this.userid = null;

	/**
	 * constructor like method (is called at the end of this file)
	 */
	var constructor = function() {
	};

	/**
     * public checkin function
     */
	this.getLocations = function(pCallback) {
		log.debug('getLocations()');
		
		if (this.locations == undefined) {
			log.debug('load locations via remote service.');
			this.remoteService.getLocations(function(pData) {
				log.debug('locations loaded');
				that.locations = pData;
				if (pCallback != undefined) {
					pCallback(pData);
				}
			});
		} else {
			log.debug('locations already loaded. Return cached data.');
			pCallback(this.locations);
		}
	}
	
	this.getLocationName = function(pLocationId) {
		log.debug('getLocationName() id:', pLocationId);
		
		return this.getLocation(pLocationId).label;
	}
	
	this.getLocation = function(pLocationId) {
		log.debug('getLocation() id:', pLocationId);
		
		// TODO locations laden falls noch nicht geschehen
		
		var location;
		if (this.locations != null) {
			location = this.getLocationPrivate(pLocationId, this.locations);
		} else {
			log.error('location list not loaded. Can not determine location name.');
		}
		
		log.debug('getLocation() - found location label:', location.label);
		return location;
	}

	
	/**
	 * @private
	 */
	this.getLocationPrivate = function(pLocationId, pLocationList) {
		log.debug('getLocationPrivate() id:', pLocationId);

		var location;
		$.each(pLocationList, function(pIndex, pEntry) {
			if (pEntry.key.toLowerCase() == pLocationId.toLowerCase()) {
				location = pEntry;
			}
		});
		
		log.debug('getLocationPrivate() - found location label:', location.label);
		return location;
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
	this.getLunchRequestsForUser = function(pCallback) {
		log.debug('getLunchRequestsForUser()');
		
		var userId = this.normUserid(this.userid);
		log.debug('user id:', userId);
		
		if (this.locations == null) {
			this.remoteService.getLocations(function(pLocationList) {
				that.locations = pLocationList;
				that.remoteService.getLunchRequestsByUser(pCallback, userId);
			});
		} else {
			this.remoteService.getLunchRequestsByUser(pCallback, userId);
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
	this.getMatchDetails = function(pMatchUrl, pCallback) {
		log.debug('getMatchDetails() matchUrl:', pMatchUrl);
		this.remoteService.getMatchDetails(pCallback, pMatchUrl);
	}
	/**
     * create a lunch request
     */
	this.createLunchRequest = function(pDate, pLocation, pCallback) {
		log.debug('createLunchRequest() date:' +pDate+ ', location:' +pLocation);
		var userDataObject = {};
		userDataObject.name = this.normUserid(this.userid);
		userDataObject.date = pDate;
		userDataObject.place = pLocation;
		this.remoteService.createLunchRequest(userDataObject, pCallback);
	}
	
	/**
	 * Convert to lower case
	 * @private
	 */
	this.normUserid = function(userId) {
		return userId.toLowerCase();
	}

	/** use the private log object */
	constructor();
	log.debug('MixAndMatch object created');
}
