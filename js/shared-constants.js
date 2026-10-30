// Exercise 6 – shared constants (loaded before the chart files)

const margin = { top: 40, right: 30, bottom: 60, left: 80 };
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// EXTRA: narrower histogram so it fits beside the filters
const histWidth = 600;
const histInnerWidth = histWidth - margin.left - margin.right;

let innerChartS;

const tooltipWidth = 170;
const tooltipHeight = 58;

const barColor = "#2563eb";
const bodyBackgroundColor = "#ffffff";

// histogram scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// scatterplot scales
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

const binGenerator = d3.bin().value((d) => d.energyConsumption);

const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];

// EXTRA: screen size filter
const filters_size = [
  { id: "all", label: "All sizes", isActive: true },
  { id: 24, label: '24"', isActive: false },
  { id: 32, label: '32"', isActive: false },
  { id: 55, label: '55"', isActive: false },
  { id: 65, label: '65"', isActive: false },
  { id: 98, label: '98"', isActive: false },
];
