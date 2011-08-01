/**
 * Dummy implementation for the remote service.
 */
function RemoteService(pBackendUrl) {

	/** private property for logging */
	var log = log4javascript.getLogger('de.html5.RemoteServiceDummy');
	
	var backend = pBackendUrl;

	/**
     * call the backend to get a list of available locations
     */
	this.getLocations = function(pCallback) {
		log.debug('getLocations()');

		// jQuery Ajax call with an anonymous callback function
		$.getJSON(backend + '/locations?callback=?', function(data) {
			log.debug("Location data:", JSON.stringify(data));
			// execute the callback parameter to get back to the MixAndMatch object
			pCallback(data);
		});
	}

	/**
     * call the backend to get a list of all lunch responses
     */
	this.getAllLunchRequests = function(pCallback) {
		log.debug('getAllLunchRequests()');
		var url = backend + '/requests?callback=?'

		$.getJSON(url, function(data) {
			log.debug("Response data:", JSON.stringify(data));
			pCallback(data);
		});
	}
	
	/**
     * call the backend to get a list of all lunch responses
     */
	this.getLunchRequestsByUser = function(pCallback, pUserid) {
		log.debug('getLunchRequestsByUser() user:', pUserid);
		var url = backend + '/users/' +pUserid+ '?callback=?'

		$.getJSON(url, function(data) {
			log.debug("Response data:", JSON.stringify(data));
			pCallback(data);
		});
	}
	
	/**
     * call the backend to get a list of all lunch responses
     */
	this.getLunchRequestsByLocationAndDate = function(pCallback, pLocation, pDate) {
		log.debug('getLunchRequestsByLocationAndDate() location: ' +pLocation+ ', date: ' +pDate);
		var url = backend + '/' +pLocation+ '/' +pDate+ '?callback=?'

		$.getJSON(url, function(data) {
			log.debug("Response data:", JSON.stringify(data));
			pCallback(data);
		});
	}	

	/**
     * call the backend to get a list of all lunch responses
     */
	this.createLunchRequest = function(pCallback, userRequestObject) {
		log.debug('createLunchRequest()');
		log.debug('userRequestObject:', JSON.stringify(userRequestObject));
		
		var url = backend + '/requests/dirty?callback=?'
		
		var createLunchRequestObject = {};
		createLunchRequestObject.locationKey = userRequestObject.place;
		createLunchRequestObject.userid = userRequestObject.name;
		createLunchRequestObject.date = userRequestObject.date
		log.debug('createLunchRequestObject:', JSON.stringify(createLunchRequestObject));
		
		$.getJSON(url, createLunchRequestObject, function(data) {
			log.debug("Response data:", JSON.stringify(data));
			pCallback(data);
		});
	}

	/** use the private log object */
	log.debug('RemoteServiceDummy created');
}

