/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DependencyNode, DependencyLink } from '../types';

interface Props {
  nodes: DependencyNode[];
  links: DependencyLink[];
  onNodeClick: (id: string) => void;
}

const DependencyGraph: React.FC<Props> = ({ nodes, links, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const defs = svg.append("defs");
    
    // Gradient definitions for nodes
    const gradient = defs.append("radialGradient")
      .attr("id", "node-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#2f81f7");
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#161b22");

    // Standard arrow marker
    defs.append("marker")
      .attr("id", "arrow-std")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#2f81f744");

    // Circular dependency marker
    defs.append("marker")
      .attr("id", "arrow-cycle")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#f85149");

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(250))
      .force("charge", d3.forceManyBody().strength(-1500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.isCircular ? "#f85149" : "#2f81f722")
      .attr("stroke-width", (d: any) => d.isCircular ? 3 : 1.5)
      .attr("stroke-dasharray", (d: any) => d.isCircular ? "8,4" : null)
      .attr("marker-end", (d: any) => d.isCircular ? "url(#arrow-cycle)" : "url(#arrow-std)");

    // Animate circular paths for high-severity visualization
    link.filter((d: any) => d.isCircular)
      .each(function() {
        const sel = d3.select(this);
        function repeat() {
          sel.attr("stroke-dashoffset", 0)
            .transition()
            .duration(800)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", -12)
            .on("end", repeat);
        }
        repeat();
      });

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on("click", (e, d: any) => onNodeClick(d.id));

    // Outer glow for nodes
    node.append("circle")
      .attr("r", (d: any) => 22 + (d.toxicity || 0) / 8)
      .attr("fill", (d: any) => (d.toxicity || 0) > 60 ? "#f8514911" : "#2f81f708")
      .attr("stroke", "transparent");

    // Main node circle
    node.append("circle")
      .attr("r", (d: any) => 18 + (d.toxicity || 0) / 10)
      .attr("fill", (d: any) => (d.toxicity || 0) > 70 ? "#f85149" : "#2f81f7")
      .attr("stroke", "#050505")
      .attr("stroke-width", 3)
      .attr("class", "transition-colors duration-300");

    // Labels with dynamic styling
    node.append("text")
      .text((d: any) => d.label)
      .attr("fill", "#e6edf3")
      .attr("font-size", "11px")
      .attr("font-family", "'JetBrains Mono', monospace")
      .attr("font-weight", "700")
      .attr("text-anchor", "middle")
      .attr("dy", 35);

    // Sub-label for tier
    node.append("text")
      .text((d: any) => d.tier ? d.tier.toUpperCase() : "")
      .attr("fill", "#484f58")
      .attr("font-size", "8px")
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-weight", "900")
      .attr("text-anchor", "middle")
      .attr("dy", 48)
      .attr("letter-spacing", "0.1em");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Center view initially
    svg.transition().duration(750).call(
      zoom.transform as any,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8).translate(-width / 2, -height / 2)
    );

  }, [nodes, links, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col">
      <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
          <h2 className="text-3xl font-black italic text-[#2f81f7] tracking-tighter">STRATEGIC KNOWLEDGE GRAPH</h2>
          <div className="flex flex-col gap-1">
             <div className="text-[#484f58] text-[9px] font-black uppercase tracking-[0.2em]">Active Logic Clusters: {nodes.length}</div>
             <div className="text-[#484f58] text-[9px] font-black uppercase tracking-[0.2em]">Cross-Module Links: {links.length}</div>
          </div>
      </div>
      
      <svg ref={svgRef} className="w-full h-full cursor-move" />

      <div className="absolute bottom-8 right-8 p-6 glass-card rounded-[30px] border border-white/5 bg-[#161b22]/40 space-y-4">
         <div className="text-[10px] font-black text-white uppercase tracking-widest border-b border-white/10 pb-2 mb-2">Legend Protocol</div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#f85149] animate-pulse"></div>
            <span className="text-[9px] font-bold text-[#f85149] uppercase tracking-tighter">Structural Spaghetti Link</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#2f81f7]"></div>
            <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-tighter">Validated Dependency</span>
         </div>
         <div className="pt-2">
            <p className="text-[8px] text-[#484f58] font-bold leading-tight max-w-[140px]">
               Node size scales with toxicity metrics and god-object probability.
            </p>
         </div>
      </div>
    </div>
  );
};

export default DependencyGraph;