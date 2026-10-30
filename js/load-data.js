// Exercise 6 – load the data and draw everything

d3.csv("data/Ex6_TVdata_withStar.csv", (d) => {
  return {
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,
    star: +d.star,
  };
}).then((data) => {
  console.log("Exercise 6 data:", data);
  console.log("Number of TVs:", data.length);
  console.log(
    "Energy extent:",
    d3.extent(data, (d) => d.energyConsumption),
  );

  drawHistogram(data);
  populateFilters(data);
  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();
});
