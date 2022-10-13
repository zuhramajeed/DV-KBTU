async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const yAccessor_2 = d => d.temperatureHigh;

    const xAccessor = (d) => dateParser(d.date);

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 100,
            left: 0,
            bottom: 50,
            right: 30
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height)
       .attr("width",dimension.width);

    svg.append("text")      // text label for the x axis
        .attr("x", dimension.boundedWidth/2 )
        .attr("y",  dimension.boundedHeight+dimension.margin.bottom+10 )
        .style("text-anchor", "middle")
        .text("Month");

    svg.append("text") // text label for the y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - dimension.margin.left)
        .attr("x",0 - (dimension.boundedHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");

    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);

    const yhScaler = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor_2))
        .range([dimension.boundedHeight, 0]);

    bounded.append("g")
        .call(d3.axisLeft(yhScaler));

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var line2Generator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yhScaler(yAccessor_2(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill","none")
        .attr("stroke","blue");
    bounded.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2) //
        .attr("d", line2Generator(data));


    var xAxis = d3.axisBottom()
        .scale(xScaler);
    var xAxisTranslate = dimension.boundedHeight;
    bounded.append('g')
        .attr("transform", "translate(0, " + xAxisTranslate + ")")
        .call(xAxis)
    var yAxis = d3.axisRight().scale(yScaler);
    bounded.append('g')
        .attr("transform", "translate(0,0)")

        .call(yAxis)


}

buildPlot();
