import SpotifyPlayer from "react-spotify-player";

// size may also be a plain string using the presets 'large' or 'compact'

const SpotifyPlaylistPlayer = (props) => {
  const size = {
    width: "100%",
    height: 300,
  };
  const view = "list"; // or 'coverart'
  const theme = "black"; // or 'white'
  console.log(props.uri);
  return (
    <SpotifyPlayer uri={props.uri} size={size} view={view} theme={theme} />
  );
};

export default SpotifyPlaylistPlayer;
