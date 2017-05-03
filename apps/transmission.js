module.exports = function (legos) {
    "use strict";
    var express = require('express'),
        router = express.Router(),
        request = require('request');

    function queryTransmission(query, queryCallback) {
        var options = {
            url: 'http://localhost:9091/transmission/rpc',
            method: 'POST',
            headers: {
                'x-transmission-session-id': null
            },
            body: JSON.stringify(query)
        };

        function requestCallback(error, response, body) {
            if (error) {
                console.error(error);
                return queryCallback(error);
            }

            if (response.statusCode === 409) {
                console.log('statuscode:409');
                options.headers['x-transmission-session-id'] = response.headers['x-transmission-session-id'];
                return request(options, requestCallback);
            }


            if (response) {
                console.log(response.statusCode);
            }
            return queryCallback(null, JSON.parse(body));
        }

        request(options, requestCallback);
    }

    function getSession(req, res) {
        var body = {
                method: 'session-get',
                arguments: {
                }
            },
            options = {
                url: 'http://localhost:9091/transmission/rpc',
                method: 'POST',
                headers: {
                    'x-transmission-session-id': null
                }
            };

        function callback(error, response, body) {
            if (error) {
                console.log(error);
                return res.json({error: true});
            }

            if (response.statusCode === 409) {
                console.log('statuscode:409');
                options.headers['x-transmission-session-id'] = response.headers['x-transmission-session-id'];
                return request(options, callback);
            }


            if (response) {
                console.log(response.statusCode);
            }
            return res.json(JSON.parse(body));
        }

        options.body = JSON.stringify(body);
        request(options, callback);
    }
    function getTorrent(req, res) {
        var body = {
                method: 'torrent-get',
                arguments: {
                    fields: ['activityDate', 'addedDate', 'bandwidthPriority', 'comment', 'corruptEver', 'creator', 'dateCreated', 'desiredAvailable', 'doneDate', 'downloadDir', 'downloadedEver', 'downloadLimit', 'downloadLimited', 'error', 'errorString', 'eta', 'files', 'fileStats', 'hashString', 'haveUnchecked', 'haveValid', 'honorsSessionLimits', 'id', 'isFinished', 'isPrivate', 'leftUntilDone', 'magnetLink', 'manualAnnounceTime', 'maxConnectedPeers', 'metadataPercentComplete', 'name', 'peer-limit', 'peers', 'peersConnected', 'peersFrom', 'peersGettingFromUs', 'peersKnown', 'peersSendingToUs', 'percentDone', 'pieces', 'pieceCount', 'pieceSize', 'priorities', 'rateDownload', 'rateUpload', 'recheckProgress', 'seedIdleLimit', 'seedIdleMode', 'seedRatioLimit', 'seedRatioMode', 'sizeWhenDone', 'startDate', 'status', 'trackers', 'trackerStats', 'totalSize', 'torrentFile', 'uploadedEver', 'uploadLimit', 'uploadLimited', 'uploadRatio', 'wanted', 'webseeds', 'webseedsSendingToUs']
                }
            },
            options = {
                url: 'http://localhost:9091/transmission/rpc',
                method: 'POST',
                headers: {
                    'x-transmission-session-id': null
                }
            };

        function callback(error, response, body) {
            if (error) {
                console.log(error);
                return res.json({error: true});
            }

            if (response.statusCode === 409) {
                console.log('statuscode:409');
                options.headers['x-transmission-session-id'] = response.headers['x-transmission-session-id'];
                return request(options, callback);
            }


            if (response) {
                console.log(response.statusCode);
            }
            return res.json(JSON.parse(body));
        }

        if (req.params.id) {
            body.arguments.ids = [parseInt(req.params.id)];
        }

        options.body = JSON.stringify(body);

        request(options, callback);
    }
    function addTorrent(req, res) {
        var body = {
                method: 'torrent-add',
                arguments: {
                    filename: req.body.filename
                }
            },
            options = {
                url: 'http://localhost:9091/transmission/rpc',
                method: 'POST',
                headers: {
                    'x-transmission-session-id': null
                }
            };

        function callback(error, response, body) {
            if (error) {
                console.log(error);
                return res.json({error: true});
            }

            if (response.statusCode === 409) {
                console.log('statuscode:409');
                options.headers['x-transmission-session-id'] = response.headers['x-transmission-session-id'];
                return request(options, callback);
            }


            if (response) {
                console.log(response.statusCode);
            }
            return res.json(JSON.parse(body));
        }

        if (!req.body.filename) {
            console.log(req.body);
            return res.json({error: 'no filename'});
        }

        options.body = JSON.stringify(body);
        request(options, callback);
    }
    function updateTorrent(req, res) {
        var actions = {
                start: 'torrent-start',
                stop: 'torrent-stop',
                verify: 'torrent-verify',
                reannounce: 'torrent-reannounce',
                set: 'torrent-set'
            },
            query = {
                method: actions[req.body.action],
                arguments: {
                    ids: [parseInt(req.params.id)]
                }
            };

        return queryTransmission(query, function (err, result) {
            if (err) {
                return res.json({error: true});
            }
            return res.json(result);
        });
    }
    function deleteTorrent(req, res) {
        var body = {
                method: 'torrent-remove',
                arguments: {
                    ids: [parseInt(req.params.id)]
                }
            },
            options = {
                url: 'http://localhost:9091/transmission/rpc',
                method: 'POST',
                headers: {
                    'x-transmission-session-id': null
                }
            };

        function callback(error, response, body) {
            if (error) {
                console.log(error);
                return res.json({error: true});
            }

            if (response.statusCode === 409) {
                console.log('statuscode:409');
                options.headers['x-transmission-session-id'] = response.headers['x-transmission-session-id'];
                return request(options, callback);
            }


            if (response) {
                console.log(response.statusCode);
            }
            return res.json(JSON.parse(body));
        }

        options.body = JSON.stringify(body);
        request(options, callback);
    }




    // REST endpoints
    router.route('/')
        .get(getSession);
    //     .put();
    router.route('/torrents/')
        .get(getTorrent)
        .post(addTorrent);
    //     .put();
    router.route('/torrents/:id')
        .get(getTorrent)
        .put(updateTorrent)
        .delete(deleteTorrent);

    return router;
};