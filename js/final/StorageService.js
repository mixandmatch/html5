/**
 * This is the main MixAndMatch class.
 */
function StorageService() {
	
	/** local storage keys **/
	this.nameKey = "userRequestNameKey";
	this.emailKey = "userRequestEmailKey";
	this.dateKey = "userRequestDateKey";
	this.placeKey = "userRequestPlaceKey";
	
    /**
     * saves all values of the UserRequestObject in the local storage
     */
    this.saveUserRequestObject = function(userRequestObject) {
    	localStorage[this.nameKey] = userRequestObject.name;
    	localStorage[this.emailKey] = userRequestObject.email;
    	localStorage[this.dateKey] = userRequestObject.date;
    	localStorage[this.placeKey] = userRequestObject.place;
    }
    
    /**
     * load all values of the UserRequestObject from the local storage
     */
    this.getSavedUserRequestObject = function(){
    	var userRequest = new UserRequestObject();
    	userRequest.name=localStorage[this.nameKey];
    	userRequest.email=localStorage[this.emailKey];
    	userRequest.date=localStorage[this.dateKey];
    	userRequest.place=localStorage[this.placeKey];
    	return userRequest;
    }
}

function UserRequestObject() {
	var name;
	var email;
	var date;
	var place;
}