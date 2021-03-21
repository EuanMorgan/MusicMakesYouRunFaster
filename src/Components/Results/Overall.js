import { CollapseMenu } from "../ReusableComponents/Collapse";
import { sort } from "../../Functions/MainApiCalls";
import { calcPercentIncDec, msToHMS } from "../../Common/CommonFunctions";
export const Overall = (props) => {
  return (
    <div className="results">
      <h1>Overall results</h1>
      <p>
        You ran for{" "}
        {msToHMS(
          props.run.run_map[props.run.run_map.length - 1].epoch_ms -
            props.run.run_map[0].epoch_ms
        )}
      </p>
      <p>
        You travelled{" "}
        {props.run.run_map[props.run.run_map.length - 2].distance_meters} metres
      </p>
    </div>
  );
};
