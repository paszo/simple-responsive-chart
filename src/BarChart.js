import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

function BarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);

    if (!dimensions) return;

    const width = dimensions.width;
    const height = dimensions.height;

    const margin = { top: 50, bottom: 50, left: 50, right: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("height", height).attr("width", width);

    // scales
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = scaleLinear().domain([0, 150]).range([innerHeight, 0]);

    // create x-axis
    const xAxis = axisBottom(xScale).ticks(data.length);

    svg
      .select(".x-axis")
      .attr(
        "transform",
        `translate(${margin.left} ${margin.top + innerHeight})`
      )
      .call(xAxis);

    // create y-axis
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left} ${margin.top})`)
      .call(yAxis);

    // draw the bars
    const mainGroup = svg.select(".main-group");

    mainGroup.attr("transform", `translate(${margin.left} ${margin.top})`);

    mainGroup
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (value, index) => xScale(index))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("fill", "green")
      .attr("height", (d) => innerHeight - yScale(d));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} className="wrapper">
      <svg ref={svgRef}>
        <g className="main-group"></g>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default BarChart;
