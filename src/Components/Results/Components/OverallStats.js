import React from "react";
import { msToHMS } from "../../../Common/CommonFunctions";
const OverallStats = (props) => {
  return (
    <div>
      <p>Overall Stats</p>
      <div className="data-list-top-container">
        <div className="data-list-top">
          <p>
            <span className="data-list-title">You ran for:</span>{" "}
            {msToHMS(
              props.run.run_map[props.run.run_map.length - 1].epoch_ms -
                props.run.run_map[0].epoch_ms
            )}
          </p>
          <p>
            <span className="data-list-title">You travelled:</span>{" "}
            {props.run.run_map[props.run.run_map.length - 2].distance_meters}{" "}
            metres
          </p>
          <p>
            <span className="data-list-title">Average speed:</span>{" "}
            {props.run.avg_pace.toFixed(2)} m/s
          </p>
          <p>
            <span className="data-list-title">Average heartrate:</span>{" "}
            {props.run.avg_bpm.toFixed(0)} BPM
          </p>
        </div>

        <div className="data-list-top">
          <p>
            <span className="data-list-title">Peak speed:</span>{" "}
            {props.run.fastest_points[0].pace} m/s
          </p>
          <p>
            <span className="data-list-title">Slowest speed:</span>{" "}
            {props.speed_order[props.speed_order.length - 2].pace} m/s
          </p>
          <p>
            <span className="data-list-title">Peak heartrate:</span>{" "}
            {props.bpm_order[0].heart_rate_bpm} BPM
          </p>
          <p>
            <span className="data-list-title">Slowest heartrate:</span>{" "}
            {props.bpm_order[props.bpm_order.length - 1].heart_rate_bpm} BPM
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverallStats;
