import React from "react";
import { useWindowSize } from "../../Hooks/useWindowSize";
const Welcome = (props) => {
  const size = useWindowSize();
  if (!props.currentData) {
    return <div></div>;
  }

  return (
    <div>
      <img
        src={props.currentData.profilePicUrl}
        // height={size.width > 1000 ? "15%" : "30%"}
        width={size.width > 1000 ? "15%" : "200px"}
        style={{ borderRadius: "50%", marginTop: "2%" }}
      />
      <h1>Welcome, {props.currentData.name}</h1>
    </div>
  );
};

export default Welcome;
