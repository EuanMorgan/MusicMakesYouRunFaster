import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = (props) => {
  const [key, setKey] = useState();

  useEffect(() => {
    if (props.uri[0] === undefined) return;
    setKey(Math.random());
  }, [props.uri]);

  //console.log(props.token);
  //console.log(props.uri);

  return (
    <SpotifyPlayer
      token={props.token}
      uris={[...props.uri]}
      autoPlay={props.play}
      play={props.play}
      styles={{ height: "2.2rem" }}
      syncExternalDevice={true}
    />
  );
};

export default Player;
