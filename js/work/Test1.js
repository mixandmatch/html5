var Test1 = {
    
    var1: 'juhu',
    
    // log: log4javascript.getLogger('de.meta.Test'),
    
    get: function (n) {
        log4javascript.getLogger('de.meta.Test').debug("logging:", n);
        var tmp = 'juhu';
    },
    
    /**
     * @private
     */
    set: function (n,v,e) {
        document.cookie = n + "=" + escape(v) + 
        ";expires=" + (new Date(e * 1000)).toGMTString() + 
        ";path=/" + ";domain=www.yahoo.com";
    }
};