/**
 * Created by claim on 26.04.15.
 */

window.TESTS = (function () {


    function loaded () {
        test("HEXENGINE initialized", function() {
            assert(document.getElementById('background') !== null, "Foreground canvas is present");
            assert(document.getElementById('foreground') !== null, "Background canvas is present")
        });
    }

    return {
        loaded : loaded
    }
})();