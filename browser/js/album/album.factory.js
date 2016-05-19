juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    }).then(function(result) {
      var mins = Math.floor(result % 60);
      var hours = Math.floor(result/60)
      if (mins < 10) mins = '0' + mins;
      album.time = hours + ":" + mins;
    })
  };
  return statsObj;
});

juke.factory('HTTPFactory', function ($http, $q) {
  var serverData = {};
  serverData.fetchAll = function() {
    return $q(function (resolve, reject) {
      resolve(
        $http.get('/api/albums/')
        .then(function (res) { return res.data; })
      )
    });
  }

  serverData.normalizeAlbumData = function(album) {
    album.imageUrl = '/api/albums/' + album.id + '/image';
  }

  serverData.normalizeSongsData = function(songs) {
    songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });
  }

  serverData.fetchById = function(albumId) {
    return $q(function (resolve, reject) {
      resolve(
        $http.get('/api/albums/' + albumId)
        .then(function(res) {
          var album = res.data;
          serverData.normalizeAlbumData(album);
          serverData.normalizeSongsData(album.songs);
          return album;
        })
      )
    });
  }
  return serverData;
});