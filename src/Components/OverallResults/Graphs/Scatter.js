import React, { useState } from "react";

import { Scatter } from "react-chartjs-2";

export const ScatterChart = (props) => {
  const dataset = [];

  // //console.log(props.differences);

  props.differences.forEach((song, index) => {
    song.scores.forEach((score) => {
      // //console.log(score);
      dataset.push({
        x: index + 1,
        y: score.difference,
        label: score.compare_song_name,
        color: score.compare_song_color,
        percentageSimilar: score.percentage_similar,
      });
    });
    dataset.push({ x: index + 1, y: 0, label: song.name, color: song.color });
  });

  // //console.log(dataset);

  const data = {
    datasets: [
      {
        data: dataset,
        label: "Differences",
        fill: false,
        backgroundColor: "red",
        pointBorderColor: "white",
        pointBackgroundColor: function (context) {
          let index = context.dataIndex;
          let value = context.dataset.data[index];
          // //console.log(value);
          return value.color;
        },
        // pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointRadius: 8,
        pointHitRadius: 2,
      },
    ],
  };

  let options = {
    maintainAspectRatio: false,

    scales: {
      xAxes: [
        {
          gridLines: {
            borderWidth: 50,
            color: "red",
            display: true,
          },

          // ticks: {
          //   callback: function (value, index, values) {
          //     try {
          //       return dataset.filter(
          //         (point) => point.x === value && point.y === 0
          //       )[0].label;
          //     } catch (error) {}
          //   },
          // },
        },
      ],
    },
    title: {
      display: true,
      text: "Song differences",
    },
    legend: {
      display: false,
    },
    tooltips: {
      mode: "single",
      callbacks: {
        label: function (tooltipItems, data) {
          // //console.log(tooltipItems, data);
          // SET THE LABEL OF THE TOOL TIPS (HOVER OVER POINTS)
          // TO CONTAIN THE SONG NAME, SCORE AND PERCENTAGE
          // //console.log(data);

          let percentage =
            data.datasets[0].data[tooltipItems.index].y === 0
              ? ""
              : " | SCORE: " +
                data.datasets[0].data[tooltipItems.index].y.toFixed(2) +
                " | " +
                data.datasets[0].data[
                  tooltipItems.index
                ].percentageSimilar.toFixed(2) +
                "% similar";

          return data.datasets[0].data[tooltipItems.index].label + percentage;
        },
      },
    },
  };
  return (
    <div className="chart-container scatter">
      <Scatter data={data} options={options} />
    </div>
  );
};
