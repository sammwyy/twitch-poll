// Global Chart.js types
type ChartJS = {
  data: ChartData;
  update: () => unknown;
};

type ChartJSConstructor = {
  new (id: string, data: ChartBuilder): ChartJS;
};

type withChartJS<A> = A & {
  Chart: ChartJSConstructor;
};

// Chart.js types
type ChartDataSet = {
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverOffset: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataSet[];
};

type ChartBuilder = {
  type: "pie";
  data: ChartData;
};

export const COLORS = [
  "#FFB5E8",
  "#B28DFF",
  "#85E3FF",
  "#BFFCC6",
  "#FFABAB",
  "#6EB5FF",
];

const chartData: ChartData = {
  labels: [],
  datasets: [
    {
      label: "Votes",
      data: [],
      backgroundColor: COLORS,
      hoverOffset: 4,
    },
  ],
};

const _this = globalThis as withChartJS<typeof globalThis>;
const chart = new _this.Chart("chart", {
  type: "pie",
  data: chartData,
});
export default chart;
