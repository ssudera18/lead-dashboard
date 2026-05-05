"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function SourceBar({ data }: any) {
  const sourceMap: any = {};

  data.forEach((l: any) => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });

  const categories = Object.keys(sourceMap);
  const values = Object.values(sourceMap);

  const options = {
    chart: { type: "column" },
    title: { text: "Leads by Source" },
    xAxis: { categories },
    series: [{ name: "Leads", data: values }],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}