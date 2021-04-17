import { CollapseMenu } from "../ReusableComponents/Collapse";
import { sort } from "../../Functions/MainApiCalls";

import { Redirect, Link } from "react-router-dom";
import OverallStats from "./Components/OverallStats";
import FastestSongs from "./Components/FastestSongs";
import AllSongs from "./Components/AllSongs";

export const RunStats = (props) => {
  let bpm_order = [...props.run.run_map].sort(sort("heart_rate_bpm"));
  let speed_order = [...props.run.run_map].sort(sort("pace"));
  //console.log(props.run.songs);

  return (
    <div className="results">
      <h1>
        Run:{" "}
        {props.run.run_map[0].time
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-") +
          " " +
          props.run.run_map[0].time.split("T")[1].split(".")[0]}
      </h1>
      <p>Overall Stats</p>
      <OverallStats
        run={props.run}
        speed_order={speed_order}
        bpm_order={bpm_order}
      />
      <div style={{ paddingTop: "5vh", paddingBottom: "5vh" }}>
        <Link
          className="button"
          to={{
            pathname: "/runs",

            state: { load_run: props.run },
          }}
        >
          View run on map
        </Link>
      </div>

      <AllSongs songs={props.run.songs} />
      <FastestSongs
        run={props.run}
        speed_order={speed_order}
        bpm_order={bpm_order}
      />
    </div>
  );
};
