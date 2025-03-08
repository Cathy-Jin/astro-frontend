import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CircleGraph = ({ relationships }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 300,
      height = 300,
      radius = Math.min(width, height) * 0.4;

    const relationColor = "green", numColor = "#3c3744", backgroundColor = "#ffffff";

    // Select and clear the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .html("") // Clear previous drawings
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw background circle
    svg.append("circle")
    .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", Math.min(width, height) * 0.45)
      .attr("fill", backgroundColor)
      .attr("transform", `translate(${-width / 2}, ${-height / 2})`);;

    // Generate 12 evenly spaced positions (360° / 12 = 30° intervals)
    const angleScale = d3
      .scaleLinear()
      .domain([0, 12])
      .range([Math.PI / 6, 2 * Math.PI + Math.PI / 6]);

    const positions = Array.from({ length: 12 }, (_, i) => {
      const angle = angleScale(i);
      return {
        index: i + 1,
        x: Math.cos(angle - Math.PI / 2) * radius,
        y: Math.sin(angle - Math.PI / 2) * radius,
      };
    });

    // Draw relationship lines
    svg
      .append("g")
      .selectAll("path")
      .data(relationships)
      .enter()
      .each(function (d) {
        const g = d3.select(this);

        if (d[0] === d[1]) {
          // Self-relationship: Draw a small circular arc
          const pos = positions[d[0] - 1]; // Get the number's position
          const loopRadius = 15; // Size of the self-loop

          g.append("path")
            .attr(
              "d",
              d3
                .arc()
                .innerRadius(loopRadius)
                .outerRadius(loopRadius)
                .startAngle(0)
                .endAngle(Math.PI * 2)() // Full circle
            )
            .attr("fill", "none")
            .attr("stroke", relationColor)
            .attr("stroke-width", 2) // TODO: increase stroke width by pattern occurence
            .attr("transform", `translate(${pos.x}, ${pos.y})`); // Slight offset
        } else {
          // Normal relationship: Draw a straight line
          g.append("line")
            .attr("x1", positions[d[0] - 1].x)
            .attr("y1", positions[d[0] - 1].y)
            .attr("x2", positions[d[1] - 1].x)
            .attr("y2", positions[d[1] - 1].y)
            .attr("stroke", relationColor)
            .attr("stroke-width", 2); // TODO: increase stroke width by pattern occurence
        }
      });

    // Draw number nodes
    svg
      .append("g")
      .selectAll("circle")
      .data(positions)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 12)
      .attr("fill", backgroundColor);

    // Add labels (numbers)
    svg
      .append("g")
      .selectAll("text")
      .data(positions)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("stroke", numColor)
      .style("fill", "#000")
      .text((d) => d.index);
  }, [relationships]);

  return <svg ref={svgRef}></svg>;
};

export default CircleGraph;
