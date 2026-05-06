"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function LeadTrend({ data }: any) {

  const grouped: any = {};

  data.forEach((l: any) => {
    const date = l.timestamp?.split(" ")[0];

    if (!grouped[date]) {
      grouped[date] = {
        accepted: 0,
        rejected: 0,
      };
    }

    if (l.carrier_acceptance_status === "Accepted") {
      grouped[date].accepted++;
    } else {
      grouped[date].rejected++;
    }
  });

  const dates = Object.keys(grouped);

  const accepted = dates.map((d) => grouped[d].accepted);
  const rejected = dates.map((d) => grouped[d].rejected);

  const options = {
    chart: {
      type: "areaspline",
      height: 280,
      backgroundColor: "transparent",
    },

    title: {
      text: "Lead Conversion Trend",
      style: {
        color: "#fff",
        fontSize: "16px",
      },
    },

    xAxis: {
      categories: dates,
      labels: {
        style: {
          color: "#94a3b8",
        },
      },
      lineColor: "rgba(255,255,255,0.1)",
    },

    yAxis: {
      title: {
        text: "Leads",
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

    legend: {
      itemStyle: {
        color: "#fff",
      },
    },

    tooltip: {
      shared: true,
    },

    plotOptions: {
      areaspline: {
        fillOpacity: 0.15,
        marker: {
          radius: 4,
        },
      },
    },

    series: [
      {
        name: "Accepted",
        data: accepted,
        color: "#10b981",
      },
      {
        name: "Rejected",
        data: rejected,
        color: "#ef4444",
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