(function (){

    var running = false,
        queue = [],
        loadedCount = 0,
        allCount = 0,
        jsCount = 0,
        executing = false,
        intervalTimer,
        startTime;

    this.LOAD_TYPES = {
        js: 'js',
        css: 'css',
        image: 'image'
    };

    this.generateObject = function (src, description, name, type, callback) {

        description = description || "";
        name = name || "";
        type = type || LOAD_TYPES.js;

        return {
            src: src,
            description: description,
            name: name,
            type: type,
            callback: callback,
            loaded: false
        }
    };

    this.LOAD = function (objects) {
        if(!running) {
            intervalTimer = setInterval(monitorProgress, 10);
            startTime = Date.now();
        }
        running = true;
        for(var i = 0, objectsLength = objects.length ; i < objectsLength ; i++) {
            addToQueue(objects[i]);
        }
    };

    function addToQueue(object) {
        queue.push(object);
        allCount += 1;

        if(object.type === LOAD_TYPES.js) {
            initialJS(object);
        }
    }

    function initialJS (object){
        jsCount += 1;

        var first = document.getElementsByTagName('script')[0];
        var script = document.createElement('script');

        script.onload = function () {
            object.loaded = true;
            if (!executing) {
                executeScript();
            }
        };
        script.src = object.src;
        first.parentNode.insertBefore(script, first);
    }

    function executeScript() {
        var toExecute = queue[0];
        if (toExecute && toExecute.loaded) {
            console.info('script loaded: ' + toExecute.description);
            executing = true;
            queue.shift();
            loadedCount += 1;
            if(toExecute.type === LOAD_TYPES.js) {
                jsCount += 1;
            }

            if (toExecute.callback) {
                window[toExecute.name].loaded();
            }

            executeScript();

            if(loadedCount === allCount) {
                loadFinished();
            }

        } else {
            executing = false;
        }
    }

    function loadFinished(){
        clearInterval(intervalTimer);
        console.info('Loaded & executed all additional scripts in: ' + (Date.now() - startTime) + 'ms');
    }

    function monitorProgress() {
        console.info("Load progress: " + (loadedCount/allCount * 100) + "%");
    }

})();