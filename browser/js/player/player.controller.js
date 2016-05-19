'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {

  // // initialize audio player (note this kind of DOM stuff is odd for Angular)
  // var audio = document.createElement('audio');
  // audio.addEventListener('ended', function () {
  //   $scope.next();
  //   // $scope.$apply(); // triggers $rootScope.$digest, which hits other scopes
  //   $scope.$evalAsync(); // likely best, schedules digest if none happening
  // });
  // audio.addEventListener('timeupdate', function () {
  //   $scope.progress = 100 * audio.currentTime / audio.duration;
  //   // $scope.$digest(); // re-computes current template only (this scope)
  //   $scope.$evalAsync(); // likely best, schedules digest if none happening
  // });

  // state
  $scope.currentSong = function() {
    return PlayerFactory.getCurrentSong();
  }

  $scope.currentSongList = function() {
    return PlayerFactory.getCurrentSongList();
  }

  $scope.playing = function() {
    return PlayerFactory.isPlaying();
  }

  $scope.progress = function() {
    return PlayerFactory.getProgress();
  }

  // main toggle
  $scope.toggle = function (song, songList) {
    if (PlayerFactory.isPlaying()) PlayerFactory.pause();
    else PlayerFactory.start(song, songList);
  };
  
  $scope.next = function () { PlayerFactory.next() };
  $scope.prev = function () { PlayerFactory.previous() };

});
