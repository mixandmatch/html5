/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function RemoteServiceValidator() {

	var log = log4javascript.getLogger("RemoteServiceValidator");

	/**
	 * one entry = {}
	 * id:      the id/index of the entry
	 * url:     the url of the backend
	 * time:    the time for the test request
	 * status:  the status of the backend online/offline
	 * 
	 * @private
	 */
	this.entries = new Array();

	/**
	 * add an url to test
	 */
	this.addUrl = function(pUrl) {
		log.debug("addUrl()", pUrl);
		var entry = {};
		entry.id = this.entries.length;
		entry.url = pUrl;

		this.entries.push(entry);
	}

	/**
	 * validates all entries
	 */
	this.validate = function(pCallback) {
		log.debug("validate()");
		for (var i=0; i<this.entries.length; i++) {
			this.checkEntry(i);
		}
		
		$(this).oneTime(2000,'label', function() {
			pCallback(this.entries); 
		});
	}

	/**
	 * creates a html table with the results.
	 */
	this.createResultTable = function() {
		log.debug("createResultTable()");
		
		var content = '<table border="1">';
		$.each(this.entries, function(index, entry) {
			log.debug('log entry:', index);
			content += '<tr>';
			content += '<td>' +entry.status+ '</td>';
			content += '<td>' +entry.time+ '</td>';
			content += '<td>' +entry.url+ '</td>';
			content += '</tr>';
		});
		content += '</table>';
		
		return content;
	}
	
	/**
	 * returns the best (=first) working backend
	 */
	this.getBestBackend = function() {
		log.debug("getBestBackend()");
		var bestBackend;
		
		$.each(this.entries, function(index, entry) {
			if (entry.status == 'online') {
				log.debug("working backend: ", entry.url);
				bestBackend = entry.url;
			}
		});
		
		return bestBackend;
	}

	/**
	 * @private
	 */
	this.checkEntry = function(pIndex) {
		log.debug("checkEntry()", pIndex);
		var entry = this.entries[pIndex];

		var startTime = new Date().getTime();

		// jQuery Ajax call with an anonymous callback function
		try {
			entry.status = 'offline';
			$.getJSON(entry.url + '/locations?callback=?', function(data) {
				log.debug("Entry [" +pIndex+ "] successful:", JSON.stringify(data));
				var endTime = new Date().getTime();
				var dif = endTime - startTime;
				log.debug("Time:", dif);
				entry.time = dif;
				entry.status = 'online';
			});
		} catch (e) {
			log.error("Error while getting index [" +pIndex+ "] and url [" +entry.url+ "]", e);
			entry.status = 'error';
		}
	}

}