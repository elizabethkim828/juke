'use strict';

juke.factory('PlayerFactory', function($rootScope){
	var obj = {};
	var playing = false;
	var currentSong = null;
	var currentSongList = null;
	var progress = 0;
	var audio = document.createElement('audio');
	audio.addEventListener('timeupdate', function() {
		progress = audio.currentTime / audio.duration;
		$rootScope.$digest();
	})
	audio.addEventListener('ended', function() {
	    obj.next();
	    $rootScope.$digest();
	})
	
	obj.start = function (song, songList) {
	    // stop existing audio (e.g. other song) in any case
	    obj.pause();
	    // resume current song
	    var regex = audio.src.match(/\/api\/songs\/\d+\/audio/)
	    if (!regex || regex[0] !== song.audioUrl) {
			currentSong = song;
			currentSongList = songList;
			audio.src = song.audioUrl;
			audio.load();
			audio.play();	
		} else {
			audio.play();
		}
	    playing = true;
	}

	obj.pause = function() {
		audio.pause();
    	playing = false;
	}

	obj.resume = function() {
		audio.play();
    	playing = true;
	}

	obj.isPlaying = function() {
		return playing;
	}

	obj.getCurrentSong = function() {
		return currentSong;
	}

	obj.getCurrentSongList = function() {
		return currentSongList;
	}

	obj.skip = function(interval) {
		var newIndex = currentSongList.indexOf(currentSong) + interval;
		if (newIndex > currentSongList.length - 1) newIndex = 0;
		if (newIndex < 0) newIndex = currentSongList.length - 1;
		if (playing) obj.start(currentSongList[newIndex], currentSongList);
		else {
			currentSong = currentSongList[newIndex];
			progress = 0;
		}
	}

	obj.next = function() {
		obj.skip(1);
	}

	obj.previous = function() {
		obj.skip(-1);
	}

	obj.getProgress = function() {
		return progress;
	}

	return obj;
});
