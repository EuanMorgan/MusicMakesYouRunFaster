import React, { useState, useCallback } from "react";
import { Collapse } from "react-collapse";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import "./collapse.css";

export function Collapser({ children, ...props }) {
  const [isButtonCollapseOpen, setIsButtonCollapseOpen] = useState(false);

  return (
    <div
      style={{
        color: "white",
        cursor: props.onlyArrowClickable ? "default" : "pointer",
      }}
      onClick={
        props.onlyArrowClickable
          ? () => {}
          : () => setIsButtonCollapseOpen(!isButtonCollapseOpen)
      }
    >
      <div>
        <div>
          <p style={{ fontSize: "0.9em", textAlign: "left" }}>
            {props.title}
            <Icon
              path={
                props.show || isButtonCollapseOpen
                  ? mdiChevronUp
                  : mdiChevronDown
              }
              size={1.5}
              style={{ cursor: "pointer" }}
              onClick={
                !props.onlyArrowClickable
                  ? () => {}
                  : () => setIsButtonCollapseOpen(!isButtonCollapseOpen)
              }
            />
          </p>
        </div>
        <Collapse
          isOpened={props.show || isButtonCollapseOpen}
          className="collapseMenu"
        >
          {children}
        </Collapse>
      </div>
    </div>
  );
}
