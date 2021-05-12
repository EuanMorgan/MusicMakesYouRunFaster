import React, { useState } from "react";
import ScrollTrigger from "react-scroll-trigger";
import { Pie } from "react-chartjs-2";
import { useWindowSize } from "../../../Hooks/useWindowSize";
import { keys, mode } from "../../../Common/Data";

export const PieChart = (props) => {
  const size = useWindowSize();
  const [visible, setVisible] = useState(false);

  let keyList = {};
  let labels = [];
  let colors = [];

  props.data.forEach((song) => {
    let val =
      keys[song.audio_features[0].key] +
      " " +
      mode[song.audio_features[0].mode];

    keyList[val] ? keyList[val]++ : (keyList[val] = 1);
    labels.push(song.name);
    colors.push(song.color);
  });

  const data = {
    labels: Object.keys(keyList),
    datasets: [
      {
        label: "Songs",
        data: Object.values(keyList),

        backgroundColor: colors,
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    animation: {
      duration: 2000,
    },
    legend: {
      display: true,
    },
    title: {
      text: "Song Keys",
      display: true,
      fontSize: 15,
    },

    // scale: {
    //   gridLines: {
    //     color: "rgba(200,200,200,0.18)",
    //   },
    //   ticks: {
    //     showLabelBackdrop: false,
    //     fontColor: "grey",
    //     // min: lowest,
    //   },
    // },
    tooltips: {
      //   callbacks: {
      //     label: function (tooltipItem, data) {
      //       let dataset = data.datasets[tooltipItem.datasetIndex];
      //       let index = tooltipItem.index;
      //       console.log(tooltipItem);
      //       console.log(data);
      //       return (
      //         data.labels[index] + " | Loudness: " + tooltipItem.value + " DB"
      //       ); //+ ": " + dataset.data[index];
      //     },
      //     title: function (tooltipItem, data) {
      //       //   //console.log(tooltipItem);
      //       return tooltipItem[0].label;
      //     },
    },
  };

  return (
    <ScrollTrigger
      onEnter={() => {
        setVisible(true);
      }}
    >
      <div className="chart-container radar polar">
        {visible ? <Pie data={data} options={options} /> : null}
      </div>
    </ScrollTrigger>
  );
};
