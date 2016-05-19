'use strict';

juke.controller('AlbumCtrl', function ($scope, $rootScope, $log, StatsFactory, HTTPFactory, PlayerFactory) {
  // main toggle
  $scope.toggle = function (song) {
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      PlayerFactory.pause();
    } else PlayerFactory.start(song, $scope.album.songs);
  };

  $scope.isPlaying = function() {
    return PlayerFactory.isPlaying();
  }

  $scope.getCurrentSong = function() {
    return PlayerFactory.getCurrentSong();
  }
  
  $rootScope.$on('viewSwap', function(event, data) {
    if (data.albumId) {
      HTTPFactory.fetchById(data.albumId)
      .then(function (album) {
        StatsFactory.totalTime(album);
        $scope.album = album;
      })
      .catch($log.error); // $log service can be turned on and off; also, pre-bound  
    }
    $scope.showMe = (data.name === 'oneAlbum');
  })

});

juke.controller('AllAlbumsCtrl', function ($scope, $rootScope, $log, StatsFactory, HTTPFactory) {
  $scope.showMe = true;
  console.log($scope.showMe);
  HTTPFactory.fetchAll().then(function(albums) {
    Promise.all(albums.map(function(album) {
      return HTTPFactory.fetchById(album.id).catch($log.error);
    })).then(function(albums) {$scope.allAlbums = albums});
  })

  $scope.viewOneAlbum = function (albumId) {
    $rootScope.$broadcast('viewSwap', { name: 'oneAlbum', albumId: albumId });
  };

  $rootScope.$on('viewSwap', function(event, data) {
    $scope.showMe = (data.name === 'allAlbums');
  })
});