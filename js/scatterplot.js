// Exercise 6.3 – scatterplot: energy consumption by star rating

const drawScatterplot = (data) => {
  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr(
      "aria-label",
      "Scatterplot of TV energy consumption against star rating, coloured by screen type",
    );

  innerChartS = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // scales
  const maxStar = d3.max(data, (d) => d.star);
  const maxEng = d3.max(data, (d) => d.energyConsumption);

  xScaleS.domain([0, maxStar]).range([0, innerWidth]).nice();

  yScaleS.domain([0, maxEng]).range([innerHeight, 0]).nice();

  colorScale
    .domain(filters_screen.filter((f) => f.id !== "all").map((f) => f.id))
    .range(["#1b9e77", "#d95f02", "#7570b3"]);

  // circles
  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 4)
    .attr("cx", (d) => xScaleS(d.star))
    .attr("cy", (d) => yScaleS(d.energyConsumption))
    .attr("fill", (d) => colorScale(d.screenTech))
    .attr("opacity", 0.5);

  // axes
  innerChartS
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScaleS));
  innerChartS.append("g").call(d3.axisLeft(yScaleS));

  // axis labels
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 12)
    .attr("text-anchor", "middle")
    .text("Star rating");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Labelled energy consumption (kWh/year)");

  // legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      `translate(${width - margin.right - 90}, ${margin.top})`,
    );

  colorScale.domain().forEach((screenTech, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale(screenTech));

    legendRow.append("text").attr("x", 18).attr("y", 10).text(screenTech);
  });
};
