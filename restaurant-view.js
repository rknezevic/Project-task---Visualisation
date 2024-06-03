(function () {
  var mapWidth = 500;
  var mapHeight = 500;
  var projection = d3.geo.albersUsa().scale([1000]);
  var path = d3.geo.path().projection(projection);

  var svgMap = d3
    .select("#restaurants-map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

  var div = d3
    .select("#restaurants-map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var restaurantData;

  d3.json("states.json", function (error, states) {
    if (error) throw error;

    svgMap
      .selectAll("path")
      .data(states.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", "rgb(213,222,217)");
  });

  d3.json("restaurants.json", function (error, data) {
    if (error) throw error;

    restaurantData = data;

    updateMap("McDonald's");

  });

  function updateMap(restaurantName) {
    var filteredData = restaurantData.filter(function (d) {
      return d.name === restaurantName;
    });

    var circles = svgMap.selectAll("circle").data(filteredData);

    circles
      .enter()
      .append("circle")
      .attr("class", "restaurant")
      .attr("cx", function (d) {
        var coords = projection([d.longitude, d.latitude]);
        return coords[0];
      })
      .attr("cy", function (d) {
        var coords = projection([d.longitude, d.latitude]);
        return coords[1];
      })
      .attr("r", 5)
      .style("fill", "blue")
      .style("opacity", 0.6)
      .style("stroke", "white")
      .on("mouseover", function (d) {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(
            "<span class='tooltip-text-bold'>" +
              d.name +
              "<br><br>" +
              d.address +
              "<br>" +
              d.city + ", " + d.province + " " + d.postalCode +
              "<br>" +
              "Category: " +
              d.categories +
              "<br>" +
              "<a href='" + d.websites.split(",")[0] + "' target='_blank'>Website</a>"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
      });

    circles.exit().remove();

    circles
      .attr("cx", function (d) {
        var coords = projection([d.longitude, d.latitude]);
        return coords[0];
      })
      .attr("cy", function (d) {
        var coords = projection([d.longitude, d.latitude]);
        return coords[1];
      });

    updateHistogram(restaurantName);
  }

  d3.selectAll('input[name="fastFood"]').on("change", function () {
    updateMap(this.nextElementSibling.innerText);
  });

  window.updateMap = updateMap;
})();
