(function showCharts() {
  const data = [
    {
      year: 2020,
      totalVictims: [0, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      fatalities: [0, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      injured: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      year: 2021,
      totalVictims: [0, 0, 24, 15, 9, 0, 0, 0, 0, 0, 11, 0],
      fatalities: [0, 0, 22, 8, 9, 0, 0, 0, 0, 0, 4, 0],
      injured: [0, 0, 2, 7, 0, 0, 0, 0, 0, 0, 7, 0],
    },
    {
      year: 2022,
      totalVictims: [0, 4, 4, 0, 51, 17, 58, 0, 0, 7, 47, 0],
      fatalities: [0, 4, 4, 0, 31, 10, 10, 0, 0, 5, 14, 0],
      injured: [0, 0, 0, 0, 20, 7, 48, 0, 0, 2, 33, 0],
    },
  ];

  const sumsByYear = data.map((yearData) => ({
    year: yearData.year,
    totalVictims: d3.sum(yearData.totalVictims),
    fatalities: d3.sum(yearData.fatalities),
    injured: d3.sum(yearData.injured),
  }));

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 650 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3.scale
    .ordinal()
    .domain(sumsByYear.map((d) => d.year))
    .rangeRoundBands([0, width], 0.1);

  const yScale = d3.scale
    .linear()
    .domain([
      0,
      d3.max(sumsByYear, (d) =>
        d3.max([d.totalVictims, d.fatalities, d.injured])
      ),
    ])
    .range([height, 0]);

  const colors = {
    totalVictims: "#800000",
    fatalities: "red",
    injured: "#ff9999",
  };

  const years = svg
    .selectAll(".year")
    .data(sumsByYear)
    .enter()
    .append("g")
    .attr("class", "year")
    .attr("transform", (d) => "translate(" + xScale(d.year) + ",0)");

  years
    .selectAll("rect")
    .data((d) => [
      { type: "totalVictims", value: d.totalVictims },
      { type: "fatalities", value: d.fatalities },
      { type: "injured", value: d.injured },
    ])
    .enter()
    .append("rect")
    .attr("x", (d, i) => (xScale.rangeBand() / 3) * i)
    .attr("width", xScale.rangeBand() / 3)
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value))
    .style("fill", (d) => colors[d.type]);

  svg
    .selectAll(".year-label")
    .data(sumsByYear)
    .enter()
    .append("text")
    .attr("class", "year-label")
    .attr("x", (d) => xScale(d.year) + xScale.rangeBand() / 2)
    .attr("y", height + 20)
    .attr("text-anchor", "middle")
    .text((d) => d.year)
    .attr("fill", "white");

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis().scale(xScale).orient("bottom"))
    .attr("fill", "rgb(213,222,217)");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(yScale).orient("left"))
    .attr("fill", "rgb(213,222,217)");

  const legend = svg
    .selectAll(".legend")
    .data(Object.keys(colors))
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => colors[d]);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => {
      if (d === "totalVictims") {
        return "Total Victims";
      } else if (d === "fatalities") {
        return "Fatalities";
      } else if (d === "injured") {
        return "Injured";
      }
    })
    .attr("fill", "white");
})();
