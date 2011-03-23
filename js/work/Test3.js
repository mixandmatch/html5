function Test3(param) {

    /**
     * @private
     * @return {Boolean} Wert
     */
    function dec() {
        if (secret > 0) {
            secret -= 1;
            return true;
        } else {
            return false;
        }
    }

    this.member = param;
    var secret = 3;
    var that = this;

    /**
     * @public
     */
    this.service = function () {
        if (dec()) {
            return that.member;
        } else {
            return null;
        }
        
    };
}