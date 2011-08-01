
/**
 * This is a workaround file.
 * First (in CommonHeaderLibs.js) we have to load all JS-libs.
 * Here we can work with all libs
 */

var mixAndMatch;

$(document).ready(function(){
	configureLogging();
	
	// create the remote service object which should be used in MixAndMatch
	var remoteService = new RemoteService('http://ec2-46-137-12-115.eu-west-1.compute.amazonaws.com/api');

/*
	var remoteServiceValidator = new RemoteServiceValidator();
	remoteServiceValidator.addUrl('http://192.168.99.23:8080');
	remoteServiceValidator.addUrl('http://ec2-46-137-12-115.eu-west-1.compute.amazonaws.com/api');
	remoteServiceValidator.validate(function() {
		var bestBackend = remoteServiceValidator.getBestBackend();
		remoteService  = new RemoteService(bestBackend);
	});
*/

	// create the MixAndMatch instance
	mixAndMatch = new MixAndMatch(remoteService);

});

