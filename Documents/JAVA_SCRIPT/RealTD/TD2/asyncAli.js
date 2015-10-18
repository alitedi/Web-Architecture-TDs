var async = require('async');
var modules = require('./allModules');
async.series(
    [
        function(callback) {
            modules.leboncoinModule();
            callback(null);
        },
        function(callback) {
          modules.lacentraleModule();
            callback(null);
        }
    ]
);
/*async.series({
        one: function(callback) {
                modules.leboncoinModule();
                callback(null, 'Node.js');
            },
        two: function(callback) {
                modules.lacentraleModule();
                callback(null, 'JavaScript');
            },
    },
    function(err, response) {
        // response == {one: 'Node.js', two: 'JavaScript'}
    }
);*/
