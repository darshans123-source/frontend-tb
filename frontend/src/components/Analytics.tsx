import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const data = [
  { site: 'Pulmonary', month: 'Jan', rate: 85 },
  { site: 'Pulmonary', month: 'Feb', rate: 88 },
  { site: 'Pulmonary', month: 'Mar', rate: 92 },
  { site: 'Extra-pulmonary', month: 'Jan', rate: 70 },
  { site: 'Extra-pulmonary', month: 'Feb', rate: 75 },
  { site: 'Extra-pulmonary', month: 'Mar', rate: 78 },
  { site: 'Pediatric', month: 'Jan', rate: 80 },
  { site: 'Pediatric', month: 'Feb', rate: 82 },
  { site: 'Pediatric', month: 'Mar', rate: 85 },
];

export default function Analytics() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 30, left: 110 };
    const width = 600 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const months = [...new Set(data.map(d => d.month))];
    const sites = [...new Set(data.map(d => d.site))];

    const x = d3.scaleBand().range([0, width]).domain(months).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).domain(sites).padding(0.05);

    svg.append('g').call(d3.axisBottom(x)).selectAll('text').attr('fill', '#94a3b8');
    svg.append('g').call(d3.axisLeft(y)).selectAll('text').attr('fill', '#94a3b8');

    const color = d3.scaleLinear<string>()
      .range(['#1e293b', '#06b6d4'])
      .domain([0, 100]);

    svg.selectAll()
      .data(data, (d: any) => d.month + ':' + d.site)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.month)!)
      .attr('y', (d: any) => y(d.site)!)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d: any) => color(d.rate))
      .style('rx', 4)
      .style('ry', 4);

  }, []);

  return (
    <div className="tq-card tq-lift p-4 sm:p-6 w-full max-w-full overflow-hidden tq-fade-up">
      <h2 className="tq-display text-lg sm:text-xl font-bold text-ink-900 dark:text-white mb-1 sm:mb-2">Diagnostic Success Heatmap</h2>
      <div className="w-full overflow-x-auto overflow-auto custom-scrollbar">
        <div className="min-w-[480px]">
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}
