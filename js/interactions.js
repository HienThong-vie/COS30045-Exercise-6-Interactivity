// Exercise 6.2 – filters and 6.4 – tooltip

// 6.2 filters
const populateFilters = (data) => {
  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
    .attr("type", "button")
    .attr("class", (d) => `filter ${d.isActive ? "active" : ""}`)
    .attr("aria-pressed", (d) => d.isActive)
    .text((d) => d.label)
    .on("click", (e, d) => {
      console.log("DOM event:", e);
      console.log("Attached datum:", d);

      if (!d.isActive) {
        filters_screen.forEach((filter) => {
          filter.isActive = d.id === filter.id ? true : false;
        });

        d3.selectAll("#filters_screen .filter")
          .classed("active", (filter) => (filter.id === d.id ? true : false))
          .attr("aria-pressed", (filter) => filter.id === d.id);

        updateHistogram(data);
      }
    });

  // EXTRA: screen size filter
  d3.select("#filters_size")
    .selectAll(".filter")
    .data(filters_size)
    .join("button")
    .attr("type", "button")
    .attr("class", (d) => `filter ${d.isActive ? "active" : ""}`)
    .attr("aria-pressed", (d) => d.isActive)
    .text((d) => d.label)
    .on("click", (e, d) => {
      if (!d.isActive) {
        filters_size.forEach((filter) => {
          filter.isActive = d.id === filter.id;
        });
        d3.selectAll("#filters_size .filter")
          .classed("active", (filter) => filter.id === d.id)
          .attr("aria-pressed", (filter) => filter.id === d.id);
        updateHistogram(data);
      }
    });

  // EXTRA: rescale y checkbox
  d3.select("#rescale-count").on("change", () => updateHistogram(data));
};

const updateHistogram = (data) => {
  const activeScreen = filters_screen.find((f) => f.isActive).id;
  const activeSize = filters_size.find((f) => f.isActive).id;

  let updatedData =
    activeScreen === "all"
      ? data
      : data.filter((tv) => tv.screenTech === activeScreen);

  updatedData =
    activeSize === "all"
      ? updatedData
      : updatedData.filter((tv) => tv.screenSize === activeSize);

  console.log(
    `Filter: ${activeScreen} / ${activeSize} →`,
    updatedData.length,
    "TVs",
  );

  const updatedBins = binGenerator(updatedData);

  // EXTRA: rescale the count axis to the filtered data
  const rescale = d3.select("#rescale-count").property("checked");
  const xMax = rescale
    ? d3.max(updatedBins, (d) => d.length) || 1
    : d3.max(binGenerator(data), (d) => d.length);
  xScale.domain([0, xMax]).nice();

  d3.select("#histogram .x-axis")
    .transition()
    .duration(500)
    .call(
      d3.axisBottom(xScale).ticks(Math.min(7, xMax)).tickFormat(d3.format("d")),
    );

  // horizontal bars: width = count, y and height = bin
  d3.select("#histogram .inner-chart")
    .selectAll("rect")
    .data(updatedBins)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", (d) => yScale(d.x0))
          .attr("height", (d) => Math.max(0, yScale(d.x1) - yScale(d.x0)))
          .attr("width", 0)
          .attr("fill", barColor)
          .attr("stroke", bodyBackgroundColor)
          .attr("stroke-width", 2),
      (update) => update,
      (exit) => exit.transition().duration(300).attr("width", 0).remove(),
    )
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y", (d) => yScale(d.x0))
    .attr("height", (d) => Math.max(0, yScale(d.x1) - yScale(d.x0)))
    .attr("width", (d) => xScale(d.length));

  d3.selectAll("#histogram .inner-chart rect").each(function (d) {
    d3.select(this)
      .selectAll("title")
      .data([d])
      .join("title")
      .text(`${d.x0}–${d.x1} kWh/year: ${d.length} TVs`);
  });

  // EXTRA: count of TVs shown
  d3.select("#filter-count").text(
    updatedData.length === 0
      ? "No TV models match this combination. Try another screen type or size."
      : `Showing ${d3.format(",")(updatedData.length)} of ${d3.format(",")(data.length)} TV models`,
  );

  // EXTRA: empty state message inside the chart
  d3.select("#histogram svg")
    .selectAll(".empty-state")
    .data(updatedData.length === 0 ? [1] : [])
    .join("text")
    .attr("class", "empty-state")
    .attr("x", margin.left + histInnerWidth / 2)
    .attr("y", margin.top + innerHeight / 2)
    .attr("text-anchor", "middle")
    .text("No TVs match these filters");

  // EXTRA: linked view – fade scatterplot circles that don't match
  innerChartS
    .selectAll("circle")
    .transition()
    .duration(500)
    .attr("opacity", (d) => {
      const matchScreen =
        activeScreen === "all" || d.screenTech === activeScreen;
      const matchSize = activeSize === "all" || d.screenSize === activeSize;
      return matchScreen && matchSize ? 0.5 : 0.04;
    })
    .attr("pointer-events", (d) => {
      const matchScreen =
        activeScreen === "all" || d.screenTech === activeScreen;
      const matchSize = activeSize === "all" || d.screenSize === activeSize;
      return matchScreen && matchSize ? "all" : "none";
    });
};

// 6.4 tooltip
const createTooltip = () => {
  const tooltip = innerChartS
    .append("g")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("pointer-events", "none");

  tooltip
    .append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.9);

  // EXTRA: three lines of text instead of just the screen size
  const text = tooltip
    .append("text")
    .attr("x", 10)
    .attr("y", 18)
    .attr("fill", "white")
    .style("font-size", "12px");
  text
    .append("tspan")
    .attr("class", "tt-line1")
    .attr("x", 10)
    .style("font-weight", 700);
  text.append("tspan").attr("class", "tt-line2").attr("x", 10).attr("dy", 16);
  text.append("tspan").attr("class", "tt-line3").attr("x", 10).attr("dy", 16);
};

const handleMouseEvents = () => {
  innerChartS
    .selectAll("circle")
    .on("mouseenter", (e, d) => {
      console.log("Mouse entered circle", d);

      d3.select(".tooltip .tt-line1").text(d.brand.toUpperCase());
      d3.select(".tooltip .tt-line2").text(
        `Model ${d.model.length > 20 ? d.model.slice(0, 20) + "…" : d.model}`,
      );
      d3.select(".tooltip .tt-line3").text(
        `${d.screenSize}" ${d.screenTech} · ${d.energyConsumption} kWh`,
      );

      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // EXTRA: keep the tooltip inside the chart
      let x = cx - tooltipWidth / 2;
      x = Math.max(0, Math.min(x, innerWidth - tooltipWidth));
      let y = cy - tooltipHeight - 10;
      if (y < 0) y = cy + 10;

      d3.select(".tooltip")
        .attr("transform", `translate(${x}, ${y})`)
        .transition()
        .duration(200)
        .style("opacity", 1);

      // EXTRA: highlight hovered circle
      d3.select(e.target)
        .attr("r", 7)
        .attr("stroke", "#1c1917")
        .attr("stroke-width", 1.5);
    })
    .on("mouseleave", (e) => {
      d3.select(".tooltip")
        .interrupt()
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");

      d3.select(e.target).attr("r", 4).attr("stroke", null);
    });
};
