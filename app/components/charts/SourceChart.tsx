"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function SourceChart({ data }: any) {
  const options = {
    chart: { type: "column" },
    title: { text: "Acceptance by Source" },
    xAxis: {
      categories: data.map((d: any) => d.source),
    },
    series: [
      {
        name: "Acceptance %",
        data: data.map((d: any) => d.acceptance_rate * 100),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}