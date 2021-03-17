import React from "react";

const Welcome = (props) => {
  return (
    <div>
      <img
        src={props.currentData.profilePicUrl}
        height={280}
        width={280}
        style={{ borderRadius: "50%", padding: "3%" }}
      />
      <h1>Welcome, {props.currentData.name}</h1>
    </div>
  );
};

export default Welcome;
