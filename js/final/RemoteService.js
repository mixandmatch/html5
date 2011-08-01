/**
 * Dummy implementation for the remote service.
 */
function RemoteService() {

	/** private property for logging */
	var log = log4javascript.getLogger('de.html5.RemoteServiceDummy');
	
	var backend = 'http://ec2-46-137-12-115.eu-west-1.compute.amazonaws.com/api';
	//var backend = 'http://mixmatch-t.elasticbeanstalk.com/locations?callback=?';

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
	this.getLunchResponse = function(pCallback, userRequestObject) {
		var url = backend + '/requests?callback=?'

		$.getJSON(url, function(data) {
			log.debug("Response data:", JSON.stringify(data));
			// execute the callback parameter to get back to the Response object
			pCallback(data);
		});
	}

	/** use the private log object */
	log.debug('RemoteServiceDummy created');
}

