/** 
 * Util methods
 * 
 * date: http://www.mattkruse.com/javascript/date/
 */

function UtilsClass() {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.Utils");
	
	this.dateFormatDatepicker = 'MM/dd/yyyy';
	this.dateFormatInternal   = 'yyyyMMdd';
	this.dateFormatGui        = 'dd.MM.yyyy';
	
	/**
	 * Util method to convert date strings.
	 */
	this.convertDate = function(pDate, pFormatFrom, pFormatTo) {
		log.debug('convertDate() date:' +pDate+ ', from:' +pFormatFrom+ ', to:' +pFormatTo);
		var date = new Date(getDateFromFormat(pDate, pFormatFrom));
		var newDate = formatDate(date, pFormatTo);
		log.debug("internal date:", newDate);
		return newDate;
	}
}

var Utils = new UtilsClass();
