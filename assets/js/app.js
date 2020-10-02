var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
  
    // parse data
    censusData.forEach(function(data) {
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.healthcare = +data.healthcare;
      //console.log(data.abbr + " " + data.poverty + " " + data.healthcare);
    });
    //Create scale functions for output value from input values from file
    var xLinearScale = xScale(censusData,chosenXAxis);   
    var yLinearScale = yScale(censusData,chosenYAxis);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    // append initial circles
    var circleGroup = chartGroup.selectAll("circle")
       .data(censusData)
       .enter()
       .append("circle")
       .attr("cx", d => xLinearScale(d.poverty))
       .attr("cy", d => yLinearScale(d.healthcare))
       .attr("r", 10)
       .attr("fill", "blue")
       .attr("opacity", "0.6")
       .style("stroke", "white")

       circleGroup.append("text")
       .text(function(d) {
           return d.abbr;
        })
       .attr("x", d => xLinearScale(d.poverty) - 20 )
       .attr("y", d => xLinearScale(d.healthcare) + 6)
       
       //.on("click", tool_tip.show)
       //.on("mouseout", tool_tip.hide)

     
     // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

/*var inPovertyLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");
*/
var inPovertyLabel = labelsGroup.append("text")
.attr("y", 30)
.attr("data-name", "poverty")
.attr("data-axis", "x")
.attr("class", "aText active x")
.text("In Poverty (%)");

// append y axis
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Lack's Healthcare (%");
  
   
})

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
       .domain([d3.min(censusData, d => d[chosenXAxis])* 0.8,
          d3.max(censusData, d => d[chosenXAxis]) * 1.2
       ])
      .range([0, width]);
    //console.log("min: " , d3.min(censusData, d => d[chosenXAxis]));
    //console.log("xScale: " ,d3.max(censusData, d => d[chosenXAxis]));
    
    return xLinearScale;
  
  }

function yScale(censusData,chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
       .domain([0, d3.max(censusData, d => d.healthcare)])
       .range([height, 0]);

    console.log("ymin: ", d3.min(censusData, d => d.healthcare));
    console.log("yScale: ", d3.max(censusData, d => d.healthcare));
    return yLinearScale;
}
  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "hair_length") {
      label = "Hair Length:";
    }
    else {
      label = "# of Albums:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
