var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 80
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
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = data.smokes;

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
             .attr("y", height + margin.top + 20)
             .attr("class", "axisText")
             .text("In Poverty (%)");
            
   // Y axis label
   chartGroup.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0 - margin.left + 20)
             .attr("x", 0 - (height / 2))
             .attr("class", "axisText")
             .text("Lack's Healthcare (%)"); 

   var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) { return `${d.state}<br>$${d.income}<br>Poverty: ${d[chosenXAxis]}%<br>Healthcare:\
            ${d[chosenYAxis]}%<hr>Age: ${d.age}<br>Obesity: ${d.obesity}%<br>Smoke: ${d.smokes}%`});
      //.html(function(d) { return "hello tip!"});
     //.html(function(d) { return `${d.state}<hr>$${d.income}<hr>Obesity: ${d.obesity}, Smoke: ${d.smokes}`});
     //.html(function(d) { return `${d.state}<hr>$${d.income}<hr>Obesity Index: ${d.obesity}, Smoking Index: ${d.smokes}`});       
           svg.call(toolTip);
       

   // Add circles to the SVG canvas
   var circleGroup = chartGroup.selectAll("circle")
       .data(censusData)
       .enter();
       
   // Add the circles Element
   circleGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", "0.5");

   //Add SVG Text Element 
   circleGroup
     .append("text")
     .attr("x", d => xLinearScale(d[chosenXAxis]))
     .attr("y", d => yLinearScale(d[chosenYAxis]))
     .attr("text-anchor", "middle")   
     .text(function(d) {
        return d.abbr;
     })
     .attr("font-family", "sans-serif")
     .attr("font-size", "10px")
     .attr("fill", "white")

   
      .on("mouseover", function(data) {
         //console.log("data");
         toolTip.show(data);
      })
        // onmouseout event
      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });
    
});

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
       .domain([d3.min(censusData, d => d[chosenXAxis])* 0.9,
                d3.max(censusData, d => d[chosenXAxis]) * 1.1])
       .range([0, width]);
    
    return xLinearScale;
  }

function yScale(censusData,chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
       .domain([0, d3.max(censusData, d => d[chosenYAxis]) * 1.1])
       .range([height, 0]);
    
    return yLinearScale;
}

