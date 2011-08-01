/** 
 * Util methods
 * 
 * date: http://www.mattkruse.com/javascript/date/
 */

function UtilsClass() {

	/** private property for logging */
	var log = log4javascript.getLogger("de.html5.Utils");
	
	var dateFormatGui      = 'MM/dd/yyyy';
	var dateFormatInternal = 'yyyyMMdd';

	/**
	 * Util method to convert date strings.
	 */
	this.convertGuiDateToInternalDate = function(pGuiDate) {
		log.debug('convertGuiDateToInternalDate() guiDate:', pGuiDate);
		var date = new Date(getDateFromFormat(pGuiDate, dateFormatGui));
		var internalDate = formatDate(date, dateFormatInternal);
		log.debug("internal date:", internalDate);
		return internalDate;
	}
	
	this.convertInternalDateToGuiDate = function(pInternalDate) {
		log.debug('convertInternalDateToGuiDate() internalDate:', pInternalDate);
		var date = new Date(getDateFromFormat(pInternalDate, dateFormatInternal));
		var guiDate = formatDate(date, dateFormatGui);
		log.debug("gui date:", guiDate);
		return guiDate;
	}
}

var Utils = new UtilsClass();

