juke.factory('ArtistFactory', function ($q, $http, $log, HTTPFactory) {
	var obj = {};
	var initialLink = '/api/artists/';
	var getData = function(res) { return res.data };

  	obj.fetchAll = function() {
		return $http.get(initialLink).then(getData).catch($log.error)
	}

	obj.fetchById = function(artistId) {
		return $http.get('/api/artists/' + artistId).then(function (res) { return res.data; }).catch($log.error)
	}

	obj.fetchAlbumsById = function(artistId) {
		return $http.get('/api/artists/' + artistId + '/albums').then(function (res) {
		    	res.data.forEach(function(album) {
		    		HTTPFactory.normalizeAlbumData(album);
		    	})
		    	return res.data;
		    }).catch($log.error)
	}

	obj.fetchSongsById = function(artistId) {
		return $http.get('/api/artists/' + artistId + '/songs').then(function (res) {
		    	res.data.forEach(function(song) {
		    		HTTPFactory.fetchById(song.albumId).then(function(album) {
		    			song.album = album;
		    			delete song.albumId;
		    		})
		    	})
		    	return res.data;
		    }).catch($log.error)
	}

	return obj;
});