"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function LeadScatter({ data }: any) {

  const accepted = data
    .filter((l: any) => l.carrier_acceptance_status === "Accepted")
    .map((l: any) => [
      Number(l.form_completion_time_sec),
      1,
    ]);

  const rejected = data
    .filter((l: any) => l.carrier_acceptance_status === "Rejected")
    .map((l: any) => [
      Number(l.form_completion_time_sec),
      0,
    ]);

  const options = {
    chart: {
      type: "scatter",
      zoomType: "xy",
      height: 260,
      backgroundColor: "transparent",
    },

    title: {
      text: "Lead Quality Correlation",
      style: {
        color: "#fff",
        fontSize: "16px",
      },
    },

    xAxis: {
      title: {
        text: "Form Completion Time (sec)",
        style: { color: "#94a3b8" },
      },
      labels: {
        style: { color: "#94a3b8" },
      },
      gridLineColor: "rgba(255,255,255,0.05)",
    },

    yAxis: {
      title: {
        text: "Lead Status",
        style: { color: "#94a3b8" },
      },

      categories: ["Rejected", "Accepted"],

      labels: {
        style: { color: "#94a3b8" },
      },

      gridLineColor: "rgba(255,255,255,0.05)",
    },

    legend: {
      itemStyle: {
        color: "#fff",
      },
    },

    series: [
      {
        name: "Accepted",
        color: "#10b981",
        data: accepted,
      },
      {
        name: "Rejected",
        color: "#ef4444",
        data: rejected,
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