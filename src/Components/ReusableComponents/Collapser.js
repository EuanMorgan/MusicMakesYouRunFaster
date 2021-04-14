import React, { useState, useCallback } from "react";
import { Collapse } from "react-collapse";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { LineGraph } from "../Results/Graphs/Line";
import { RadarChart } from "../Results/Graphs/Radar";
import { useHistory } from "react-router-dom";
import { keys, mode } from "../../Common/Data";
import "./collapse.css";

export function Collapser({ children, ...props }) {
  const [isButtonCollapseOpen, setIsButtonCollapseOpen] = useState(false);

  //   const onClick = useCallback(
  //     () => setIsButtonCollapseOpen(!isButtonCollapseOpen),
  //     [isButtonCollapseOpen]
  //   );
  let x;
  if (props.audioFeatures) {
    x = props.audioFeatures[0];
  }

  return (
    <div style={{ color: "white" }}>
      <div>
        <div>
          {/* <p aria-expanded={isButtonCollapseOpen} type="button"> */}
          <Icon
            path={props.show ? mdiChevronUp : mdiChevronDown}
            size={1.5}
            style={{ cursor: "pointer" }}
          />
        </div>
        <Collapse isOpened={props.show} className="collapseMenu">
          {children}
        </Collapse>
      </div>
    </div>
  );
}
