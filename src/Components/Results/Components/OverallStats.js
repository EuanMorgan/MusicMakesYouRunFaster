import React from "react";
import { msToHMS } from "../../../Common/CommonFunctions";
const OverallStats = (props) => {
  ////console.log(props);
  return (
    <div>
      <div className="data-list-top-container">
        <div className="data-list-top">
          <p>
            <span className="data-list-title">You ran for:</span>{" "}
            {props.combinedData
              ? props.combinedData.totalTime
              : msToHMS(
                  props.run.run_map[props.run.run_map.length - 1].epoch_ms -
                    props.run.run_map[0].epoch_ms
                )}
          </p>
          <p>
            <span className="data-list-title">You travelled:</span>{" "}
            {props.combinedData
              ? props.combinedData.totalDistance
              : props.run.run_map[
                  props.run.run_map.length - 2
                ].distance_meters.toFixed(2)}{" "}
            metres
          </p>
          <p>
            <span className="data-list-title">Average speed:</span>{" "}
            {props.combinedData
              ? props.combinedData.averageSpeed
              : props.run.avg_pace.toFixed(2)}{" "}
            m/s
          </p>
          <p className="end">
            <span className="data-list-title">Average heartrate:</span>{" "}
            {props.combinedData
              ? props.combinedData.averageHeartRate
              : props.run.avg_bpm.toFixed(0)}{" "}
            BPM
          </p>
        </div>

        <div className="data-list-top">
          <p>
            <span className="data-list-title">Peak speed:</span>{" "}
            {props.combinedData
              ? props.combinedData.highestSpeed
              : props.run.fastest_points[0].pace}{" "}
            m/s
          </p>
          <p>
            <span className="data-list-title">Slowest speed:</span>{" "}
            {props.combinedData
              ? props.combinedData.lowestSpeed
              : props.speed_order[props.speed_order.length - 2].pace}{" "}
            m/s
          </p>
          <p>
            <span className="data-list-title">Peak heartrate:</span>{" "}
            {props.combinedData
              ? props.combinedData.highestHeart
              : props.bpm_order[0].heart_rate_bpm}{" "}
            BPM
          </p>
          <p className="end">
            <span className="data-list-title">Slowest heartrate:</span>{" "}
            {props.combinedData
              ? props.combinedData.lowestHeart
              : props.bpm_order[props.bpm_order.length - 1].heart_rate_bpm}{" "}
            BPM
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverallStats;
