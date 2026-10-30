// Exercise 6.1 – histogram of TV energy consumption (EXTRA: horizontal bars)

const drawHistogram = (data) => {
  const svg = d3
    .select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${histWidth} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Histogram of yearly energy consumption of TVs");

  const innerChart = svg
    .append("g")
    .attr("class", "inner-chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const bins = binGenerator(data);
  console.log("Bins:", bins);

  const minEng = bins[0].x0;
  const maxEng = bins[bins.length - 1].x1;
  const binsMaxLength = d3.max(bins, (d) => d.length);

  // EXTRA: lock bin edges so filtered bars keep the same size
  binGenerator
    .domain([minEng, maxEng])
    .thresholds(bins.slice(1).map((d) => d.x0));

  // horizontal bars: x = number of TVs, y = energy bins
  xScale.domain([0, binsMaxLength]).range([0, histInnerWidth]).nice();

  yScale.domain([minEng, maxEng]).range([0, innerHeight]);

  // bars
  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", (d) => yScale(d.x0))
    .attr("width", (d) => xScale(d.length))
    .attr("height", (d) => yScale(d.x1) - yScale(d.x0))
    .attr("fill", barColor)
    .attr("stroke", bodyBackgroundColor)
    .attr("stroke-width", 2)
    // EXTRA: <title> tooltip on each bar
    .append("title")
    .text((d) => `${d.x0}–${d.x1} kWh/year: ${d.length} TVs`);

  // axes
  const bottomAxis = d3.axisBottom(xScale).ticks(7).tickFormat(d3.format("d"));
  innerChart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").attr("class", "y-axis").call(leftAxis);

  // axis labels
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + histInnerWidth / 2)
    .attr("y", height - 12)
    .attr("text-anchor", "middle")
    .text("Frequency (number of TV models)");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Labelled energy consumption (kWh/year)");
};
