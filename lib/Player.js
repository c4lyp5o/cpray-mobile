import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    console.log('remote play clicked');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    console.log('remote pause clicked');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy();
  });

  TrackPlayer.addEventListener('remote-seek', ({ position }) => {
    // TrackPlayer.destroy();
    console.log('remote seek:', position);
    TrackPlayer.seekTo(position);
  });
};
