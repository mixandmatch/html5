/**
 * @class
 * This is the main MixAndMatch class.
 *
 * @constructor
 */
function MixAndMatch() {
   // this.log = log4javascript.getLogger("de.demo.MixAndMatch");
}

/**
 * Checkin to mix and match.
 *
 */
MixAndMatch.prototype.checkin = function() {
    log.debug("checkin()");
    $.getJSON('http://mixmatch-t.elasticbeanstalk.com/locations?callback=?', function(data) {
        log.info("Data:", JSON.stringify(data));
        $('#checkinResponse').text(JSON.stringify(data));
    });
};
