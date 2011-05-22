/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function RemoteServiceValidator() {

    var log = log4javascript.getLogger("RemoteServiceValidator");

    /** @private */
    this.entries = new Array();

    this.addUrl = function(pUrl) {
        log.debug("addUrl()", pUrl);
        var entry = {};
        entry.id = this.entries.length;
        entry.url = pUrl;

        this.entries.push(entry);
    //
    }

    this.validate = function(pCallback) {
        log.debug("validate()");
        for (var i=0; i<this.entries.length; i++) {
            this.checkEntry(i);
        }
    }

    this.getStatus = function() {
        log.debug("getStatus()");
		
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
            $.getJSON(entry.url, function(data) {
                log.debug("Entry [" +pIndex+ "] successful:", JSON.stringify(data));
                var endTime = new Date().getTime();
                var dif = endTime - startTime;
                log.debug("Time:", dif);
            });
        } catch (e) {
            log.error("Error while getting index [" +pIndex+ "] and url [" +entry.url+ "]", e);
        }
    }

}