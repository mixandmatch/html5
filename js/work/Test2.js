/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function() {
    
    function Test2() {}
   
    Test2.prototype.log = log4javascript.getLogger('de.Test2');
    //test2 = new Test2();
    
    Test2.prototype.setEnabled = function(enable) {
        log.debug("setEnabled");
        enabled = enable;
    };
    
})();