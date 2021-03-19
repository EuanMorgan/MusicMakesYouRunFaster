import React, { useState, useCallback } from "react";
import { Collapse } from "react-collapse";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { LineGraph } from "../Results/Graphs/Line";

export function CollapseMenu(props) {
  const accessibilityIds = {
    checkbox: "accessible-marker-example1",
    button: "accessible-marker-example2",
  };

  const [isButtonCollapseOpen, setIsButtonCollapseOpen] = useState(false);

  const onClick = useCallback(
    () => setIsButtonCollapseOpen(!isButtonCollapseOpen),
    [isButtonCollapseOpen]
  );

  return (
    <div className="accessible" style={{ color: "white" }}>
      <div className="collapseMenu">
        <div className="config">
          <p
            aria-controls={accessibilityIds.button}
            aria-expanded={isButtonCollapseOpen}
            onClick={onClick}
            type="button"
            style={{ cursor: "pointer" }}
          >
            {props.name}{" "}
            <Icon
              path={isButtonCollapseOpen ? mdiChevronUp : mdiChevronDown}
              size={1.5}
            />
          </p>
        </div>
        <Collapse isOpened={isButtonCollapseOpen} className="collapseMenu">
          <ul
            style={{
              textAlign: "left",
              listStylePosition: "inside",
              fontSize: "2em",
              background: "#282828",
              display: "inline-block",
              margin: "auto",
              padding: "1em",
              borderRadius: "1em",
            }}
          >
            {console.log(props.data)}
            {props.data.speed_sentences.map((d) => (
              <li>{d}</li>
            ))}
            <LineGraph
              listeningData={props.listeningData}
              labels={props.labels}
              notListeningData={props.notListeningData}
              show={isButtonCollapseOpen}
              isHeartrate={false}
            />
            {props.data.heart_sentences.map((d) => (
              <li>{d}</li>
            ))}
            <LineGraph
              listeningData={props.heartrateData}
              labels={props.labels}
              notListeningData={props.notListeningHeartrates}
              show={isButtonCollapseOpen}
              isHeartrate={true}
            />
          </ul>
        </Collapse>
      </div>
    </div>
  );
}
