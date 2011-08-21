/** 
 * Util methods
 * 
 * date: http://www.mattkruse.com/javascript/date/
 */

function UtilsClass() {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.Utils");
	
	//this.dateFormatDatepicker = 'MM/dd/yyyy';
	this.dateFormatDatepicker = 'yyyy-MM-dd';
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

	/**
	 * Util method to convert date strings.
	 */
	this.formatDate = function(pDate, pFormatTo) {
		log.debug('formatDate() date:' +pDate+ ', to:' +pFormatTo);
		var newDate = formatDate(pDate, pFormatTo);
		log.debug("internal date:", newDate);
		return newDate;
	}
	
	log.debug('UtilsClass created');
}

//var Utils = new UtilsClass();
