import SpotifyPlayer from "react-spotify-player";

// size may also be a plain string using the presets 'large' or 'compact'
import { useWindowSize } from "../../Hooks/useWindowSize";
const SpotifyPlaylistPlayer = (props) => {
  const dimensions = useWindowSize();
  const size = {
    width: dimensions.width > 800 ? "50%" : "90%",
    height: 300,
  };
  const view = "list"; // or 'coverart'
  const theme = "black"; // or 'white'
  //console.log(props.uri);
  return (
    <SpotifyPlayer uri={props.uri} size={size} view={view} theme={theme} />
  );
};

export default SpotifyPlaylistPlayer;
