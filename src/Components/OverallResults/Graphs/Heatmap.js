import React from "react";
import { HeatMapGrid } from "react-grid-heatmap";
import { useWindowSize } from "../../../Hooks/useWindowSize";
import ReactTooltip from "react-tooltip";
const Heatmap = (props) => {
  const size = useWindowSize();
  //   //console.log(props.differences);
  const xLabels = props.differences.map((song) => song.name.split("-")[0]);
  const yLabels = props.differences.map((song) =>
    song.name
      .split("-")[0]
      .slice(0, song.name.length < 15 ? song.name.length : 18)
  );
  const data = new Array(yLabels.length).fill(0).map((item, xIndex) =>
    new Array(xLabels.length).fill(0).map((item, yIndex) => {
      //   //console.log(xIndex, yIndex);
      //   //console.log(props.differences[yIndex].id);
      //   //console.log(
      //     `x ${props.differences[xIndex].name}, y ${
      //       props.differences[xIndex].scores.filter(
      //         (song) => song.compare_song_id === props.differences[yIndex].id
      //       )[0]
      //     }`
      //   );

      let filtered = props.differences[xIndex].scores.filter(
        (song) => song.compare_song_id === props.differences[yIndex].id
      );
      //   //console.log(filtered);
      return filtered[0] ? filtered[0].percentage_similar : 100;
    })
  );
  //   //console.log(data);
  return (
    <div className="chart-container heatmap">
      <p>Similarity</p>
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        // Reder cell with tooltip
        cellRender={(x, y, value) => (
          <div
            data-tip={`${xLabels[x]} is ${value.toFixed(0)}% similar to ${
              yLabels[y]
            }`}
            data-effect={"solid"}
            data-type="light"
            // title={`Pos(${x}, ${y}) = ${value}`}
          >
            {value.toFixed(0)}%
          </div>
        )}
        xLabelsStyle={(index) => ({
          //   color: index % 2 ? "transparent" : "#777",
          //   background: props.differences[index].color,
          color: "#fff",
          fontSize: size.width < 900 ? "0.5rem" : ".7vw",
          fontWeight: "bold",
        })}
        yLabelsStyle={() => ({
          fontSize: size.width < 900 ? "1.2vw" : ".7vw",
          textTransform: "uppercase",
          color: "#FFF",
          marginTop: ".1vh",
          marginBottom: size.width < 900 ? "-.1vh" : "0vh",
          //   paddingRight: "1vw",
          textAlign: "right",
          overflow: "hidden",
          wordBreak: "break-all",
          whiteSpace: "nowrap",
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(196, 24, 24, ${ratio})`,
          fontSize: size.width < 900 ? "0.7rem" : "1vw",
          color: `rgb(255, 255, 255, ${ratio / 2 + 0.4})`,
          width: size.width < 900 ? ".5vw" : "1vw",
        })}
        cellHeight={size.width < 900 ? "4vh" : "2.5vw"}
        xLabelsPos="bottom"
        // onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
        yLabelsPos="left"
      />
      <ReactTooltip />
    </div>
  );
};

export default Heatmap;
