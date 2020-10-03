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
       data.healthcare = +data.healthcare;
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

    // Create Axes Labels
    // X axis label
    chartGroup.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 50)
            .attr("class", "axisText")
            .text("In Poverty (%)");
            
    // Y axis label
    chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            .attr("class", "axisText")
            .text("Lack's Healthcare (%)"); 

    // Add circles to the SVG canvas
    var circleGroup = chartGroup.selectAll("circle")
       .data(censusData)
       .enter();
        
    // Add the circles Element
    var circleAttributes = circleGroup
                           .append("circle")
                           .attr("cx", d => xLinearScale(d[chosenXAxis]))
                           .attr("cy", d => yLinearScale(d[chosenYAxis]))
                           .attr("r", 10)
                           .attr("fill", "blue")
                           .attr("opacity", "0.6");

    //Add the SVG Text Element to the svgContainer
   /* var text = chartGroup.selectAll("text")
                .data(censusData)
                .enter()
                .append("text");
    */
   var textElement = chartGroup.enter();
    //Add SVG Text Element 
                     circleGroup
                     .append("text")
                     .attr("x", d => xLinearScale(d[chosenXAxis]))
                     .attr("y", d => yLinearScale(d[chosenYAxis]))
                     .text(function(d) {
                        return d.abbr;
                     })
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "10px")
                     .attr("fill", "white")
                     .attr("text-anchor", "middle");   
});

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
       .domain([d3.min(censusData, d => d[chosenXAxis])* 0.8,
                d3.max(censusData, d => d[chosenXAxis]) * 1.2])
       .range([0, width]);
    
    return xLinearScale;
  }

function yScale(censusData,chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
       .domain([0, d3.max(censusData, d => d[chosenYAxis])])
       .range([height, 0]);
    
    return yLinearScale;
}