"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function StatusPie({ accepted, rejected }: any) {
  const options = {
    chart: { type: "pie" },
    title: { text: "Lead Status Distribution" },
    series: [
      {
        name: "Leads",
        data: [
          { name: "Accepted", y: accepted, color: "#10b981" },
          { name: "Rejected", y: rejected, color: "#ef4444" },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}