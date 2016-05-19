juke.controller('AllArtistsCtrl', function ($scope, $rootScope, $log, $http, ArtistFactory) {

  $rootScope.$on('viewSwap', function(event, data) {
    ArtistFactory.fetchAll()
    .then(function (artists) {
      $scope.artists = artists;
    })
    .catch($log.error); // $log service can be turned on and off; also, pre-bound  
    $scope.showMe = (data.name === 'allArtists');
  })

  $scope.viewOneArtist = function(artistId) {
    $rootScope.$broadcast('viewSwap', { name: 'oneArtist', artistId: artistId });
  }

});

juke.controller('ArtistCtrl', function ($scope, $rootScope, $log, $http, ArtistFactory) {

  $rootScope.$on('viewSwap', function(event, data) {
    if (data.artistId) {
      ArtistFactory.fetchById(data.artistId)
      .then(function (artist) {
        $scope.artist = artist;
        return ArtistFactory.fetchAlbumsById(artist.id)
      })
      .then(function(albums) {
        $scope.artist.albums = albums;
        return ArtistFactory.fetchSongsById(data.artistId)
      }).then(function(songs) {
        $scope.artist.songs = songs;
      })
      .catch($log.error); // $log service can be turned on and off; also, pre-bound    
    }
    
    $scope.showMe = (data.name === 'oneArtist');
  })

  $scope.viewOneAlbum = function (albumId) {
      $rootScope.$broadcast('viewSwap', { name: 'oneAlbum', albumId: albumId });
  };

});