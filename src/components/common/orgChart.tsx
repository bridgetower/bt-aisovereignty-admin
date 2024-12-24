import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import React, { useEffect, useRef } from 'react';

// Sample Data Fetch URL (or replace with your data source)
const dataUrl =
  'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv';

const OrgChartComponent: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Fetch Data and Render Chart
    d3.csv(dataUrl).then((dataFlattened) => {
      if (!chartContainerRef.current) return;

      if (!chartRef.current) {
        chartRef.current = new OrgChart();
      }

      chartRef.current
        .container(chartContainerRef.current)
        .data(dataFlattened)
        .nodeWidth((d: any) => 250)
        .initialZoom(0.8)
        .nodeHeight((d: any) => 155)
        .childrenMargin((d: any) => 40)
        .compactMarginBetween((d: any) => 15)
        .compactMarginPair((d: any) => 80)
        // .layout('left') // This changes the layout to expand left to right
        .buttonContent(({ node }: any) => {
          return `<div style="border-radius:3px;padding:0 3px;margin:auto auto;background-color:#000;color:#fff; border: 1px solid lightgray; font-weight:600;font-size:14px"> <span >${
            node.children ? `-` : `+`
          }</span>`;
        })
        .nodeContent((d: any) => {
          return `
          <div class="bg-none overflow-visible ml-1 mt-8" style="height:${d.height}px;">
            <div class="bg-white pt-0 border border-gray-400 rounded-3xl" style="height:${d.height - 30}px;">
            <img  src="${'https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg'}" style="margin-top:-30px;margin-left:${d.width / 2 - 35}px;border-radius:100px;width:60px;height:60px;" />
            <div class="flex justify-center items-center text-black">${d.data.id}</div>
            <div class="h-[calc(100%-40px)] flex justify-center items-center flex-col">
                <div style="color:#111672;font-size:16px;font-weight:bold">${d.data.name}</div>
                <div style="color:#404040;font-size:16px;margin-top:4px">${d.data.positionName}</div>
              </div>
   
            </div>
          </div>`;
        })
        .render();
    });

    // Cleanup when unmounting
    return () => {
      if (chartRef.current) {
        chartRef.current.clear();
      }
    };
  }, []);

  return (
    <div
      className="chart-container bg-card rounded-lg shadow-lg p-4"
      ref={chartContainerRef}
      //   style={{ height: '1200px', }}
    ></div>
  );
};

export default OrgChartComponent;
