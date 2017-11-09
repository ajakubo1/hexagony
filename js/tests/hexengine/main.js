/**
 * Created by claim on 26.04.15.
 */

window.MAIN = (function(){

    function loaded() {
        HEXENGINE.setup(1024, 786);
        HEXENGINE.setHexTypes(HEXTYPES);
        HEXENGINE.setHexGrid(HEXGRID);
        HEXENGINE.start();
    }

    return {
        loaded: loaded
    }
})();