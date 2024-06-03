(function () {
  var histogramWidth = 1200;
  var histogramHeight = 500;
  var nutritionData;

  d3.json("nutrition.json", function (error, data) {
    if (error) throw error;

    nutritionData = data;

    // Initialize with McDonald's data
    updateHistogram("McDonald's");
  
  });

  function updateHistogram(restaurantName) {
    var data = nutritionData.filter(function (d) {
      return d.restaurant === restaurantName;
    }).sort(function (a, b) {
      return b.calories - a.calories;
    }).slice(0, 10);  // Select top 10 items by calories

    var margin = { top: 20, right: 350, bottom: 50, left: 150 };
    var width = histogramWidth - margin.left - margin.right;
    var height = histogramHeight - margin.top - margin.bottom;

    d3.select("#histogram").selectAll("*").remove();

    var svg = d3
      .select("#histogram")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + (margin.left + 220) + "," + margin.top + ")");

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);

    x.domain([0, d3.max(data, function (d) { return d.calories; })]);
    y.domain(data.map(function (d) { return d.item; }));

    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll(".rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr("width", 0) // Početna širina pravokutnika je 0
      .attr("y", function (d) { return y(d.item); })
      .attr("height", y.rangeBand())
      .style("fill", "blue")
      .style("opacity", 0.7)
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.calories + " calories")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition() // tranzicija
      .duration(1000) // Trajanje tranzicije u ms
      .attr("width", function (d) { return x(d.calories); }); // sirina pravokutnika tranzicije

    // Isto tako kod ažuriranja, možemo primijeniti tranziciju na postojeće pravokutnike
    svg
      .selectAll(".rect")
      .data(data)
      .transition()
      .duration(1000)
      .attr("width", function (d) { return x(d.calories); });



    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));
  }

  window.updateHistogram = updateHistogram;
})();
