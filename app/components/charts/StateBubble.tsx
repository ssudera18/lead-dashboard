"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";

(HC_more as any)(Highcharts);

export default function StateBubble({ data }: any) {

  const stateMap: any = {};

  data.forEach((l: any) => {
    const state = l.state;

    if (!stateMap[state]) {
      stateMap[state] = {
        total: 0,
        accepted: 0,
      };
    }

    stateMap[state].total++;

    if (l.carrier_acceptance_status === "Accepted") {
      stateMap[state].accepted++;
    }
  });

  const bubbleData = Object.entries(stateMap).map(
    ([state, values]: any) => ({
      name: state,
      x: values.total,
      y: Math.round((values.accepted / values.total) * 100),
      z: values.total,
    })
  );

  const options = {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      zoomType: "xy",
      height: 320,
      backgroundColor: "transparent",
    },

    title: {
      text: "State-wise Lead Quality",
      style: {
        color: "#fff",
        fontSize: "16px",
      },
    },

    xAxis: {
      title: {
        text: "Lead Volume",
        style: {
          color: "#94a3b8",
        },
      },

      labels: {
        style: {
          color: "#94a3b8",
        },
      },

      gridLineColor: "rgba(255,255,255,0.05)",
    },

    yAxis: {
      title: {
        text: "Acceptance Rate (%)",
        style: {
          color: "#94a3b8",
        },
      },

      labels: {
        style: {
          color: "#94a3b8",
        },
      },

      gridLineColor: "rgba(255,255,255,0.05)",
    },

    tooltip: {
      useHTML: true,
      pointFormat:
        "<b>{point.name}</b><br/>Leads: {point.x}<br/>Acceptance: {point.y}%",
    },

    plotOptions: {
      bubble: {
        minSize: 15,
        maxSize: 60,

        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            color: "#fff",
            textOutline: "none",
            fontSize: "10px",
          },
        },
      },
    },

    legend: {
      enabled: false,
    },

    series: [
      {
        data: bubbleData,
        color: "rgba(99,102,241,0.6)",
      },
    ],

    credits: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}