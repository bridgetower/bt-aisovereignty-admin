import React, { useEffect, useRef } from 'react';
import { DataSet } from 'vis-data';
import { Edge, Network, Node } from 'vis-network';

import edgesData from './edges.json';
import nodesData from './nodes.json';

interface CustomNode extends Node {
  group: string;
}

interface CustomEdge extends Edge {
  from: string;
  to: string;
}

// const initialNodes: CustomNode[] = [
//   { id: 0, label: 'Project', group: '0' },
//   { id: 1, label: '1', group: '0' },
//   { id: 2, label: '2', group: '0' },
// ];

// const initialEdges: CustomEdge[] = [
//   { from: 0, to: 1 },
//   { from: 0, to: 2 },
// ];

// const allNodes: CustomNode[] = [
//   { id: 0, label: '0', group: '0' },
//   { id: 1, label: '1', group: '0' },
//   { id: 2, label: '2', group: '0' },
//   { id: 3, label: '3', group: '1' },
//   { id: 4, label: '4', group: '1' },
//   { id: 6, label: '6', group: '2' },
//   { id: 7, label: '7', group: '2' },
//   { id: 5, label: '5', group: '1' },
//   { id: 8, label: '8', group: '2' },
//   { id: 9, label: '9', group: '3' },
//   { id: 10, label: '10', group: '3' },
//   { id: 11, label: '11', group: '4' },
// ];

// const allEdges: CustomEdge[] = [
//   { from: 0, to: 1 },
//   { from: 0, to: 2 },
//   { from: 1, to: 3 },
//   { from: 1, to: 4 },
//   { from: 2, to: 5 },
//   { from: 2, to: 6 },
//   { from: 3, to: 7 },
//   { from: 3, to: 8 },
//   { from: 4, to: 9 },
//   { from: 4, to: 10 },
//   { from: 5, to: 11 },
// ];

export const VisJsChart: React.FC = () => {
  const allNodes = nodesData.map((node) => {
    // const metadata = JSON.parse(node.metadata);
    const lebel = node.table_name;
    //   node.table_name === 'stepdetail' ? 'stepdetails' : metadata.name;
    return {
      id: node.node_id,
      label: lebel,
      group: node.node_id,
    };
  });

  const allEdges: CustomEdge[] = edgesData.map((edge) => ({
    from: edge.target,
    to: edge.source,
  }));

  const initialNodes = allNodes.slice(0, 2);
  const initialEdges: CustomEdge[] = [
    {
      from:
        edgesData.find((edge) => edge.target === initialNodes[0].id)?.target ||
        '',
      to:
        edgesData.find((edge) => edge.target === initialNodes[0].id)?.source ||
        '',
    },
  ];
  console.log(allNodes);
  console.log(allEdges);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesDataSetRef = useRef<DataSet<CustomNode>>(
    new DataSet(initialNodes),
  );
  const edgesDataSetRef = useRef<DataSet<CustomEdge>>(
    new DataSet(initialEdges),
  );
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      createNetwork();
    }
  }, []);

  const createNetwork = () => {
    const container = containerRef.current as HTMLElement;

    const nodesData = nodesDataSetRef.current;
    const edgesData = edgesDataSetRef.current;

    const data = {
      nodes: nodesData,
      edges: edgesData,
    };

    const options = {
      nodes: {
        shape: 'box',
        size: 50,
        font: {
          size: 24,
          color: '#fff', // Font color
        },
        borderWidth: 2,
        shadow: true,
        color: {
          background: '#1f77b4', // Default background color
          border: '#2c3e50', // Default border color
          highlight: {
            background: '#ff7f0e', // Background when selected
            border: '#d35400', // Border when selected
          },
          hover: {
            background: '#aec7e8', // Background on hover
            border: '#2980b9', // Border on hover
            color: '#333',
          },
        },
      },
      edges: {
        width: 2,
        shadow: true,
        color: {
          color: 'skyblue', // Default edge color
          highlight: 'skyblue', // Color when selected
          hover: '#999', // Color on hover
        },
      },
      interaction: {
        hover: true, // Enable hover effects
        multiselect: true, // Allow multi-selection
      },
      physics: {
        enabled: true,
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.04,
          damping: 0.1,
        },
        stabilization: {
          iterations: 1000,
        },
      },
      groups: {
        dotsWithLabel: {
          label: "I'm a dot!",
          shape: 'dot',
          color: 'cyan',
        },
      },
    };

    networkRef.current = new Network(container, data, options);

    // Add click event listener
    networkRef.current.on('click', handleNodeClick);
  };

  const handleNodeClick = (params: { nodes: string[] }) => {
    if (params.nodes.length === 0) return;

    const nodeId = params.nodes[0];
    const nodesData = nodesDataSetRef.current;
    const edgesData = edgesDataSetRef.current;

    // Recursive function to find all nodes and edges to be removed
    const collectChildren = (
      parentId: string,
      nodesToRemove: Set<string>,
      edgesToRemove: Set<string | string>,
    ) => {
      // Find edges where the 'from' node is the parentId
      const childrenEdges = edgesData.get({
        filter: (edge) => edge.from === parentId,
      });

      childrenEdges.forEach((edge) => {
        const childNodeId = edge.to;
        nodesToRemove.add(childNodeId);
        edgesToRemove.add(edge.id as string);
        // Recurse to collect children of this child node
        collectChildren(childNodeId, nodesToRemove, edgesToRemove);
      });
    };

    // Collect all nodes and edges to be removed starting from the clicked node
    const nodesToRemove = new Set<string>();
    const edgesToRemove = new Set<string | string>();

    collectChildren(nodeId, nodesToRemove, edgesToRemove);

    if (nodesToRemove.size > 0) {
      // Remove collected edges and nodes
      edgesData.remove(Array.from(edgesToRemove));
      nodesData.remove(Array.from(nodesToRemove));
      console.log(
        `Collapsed node ${nodeId} and its descendants`,
        Array.from(nodesToRemove),
      );
    } else {
      // Expand: Add children nodes and edges
      const newEdges = allEdges.filter((edge) => edge.from === nodeId);
      const newNodes = allNodes.filter((node) =>
        newEdges.some((edge) => edge.to === node.id),
      );

      if (newNodes.length > 0) {
        nodesData.add(newNodes);
        edgesData.add(newEdges);
        console.log(`Expanded node ${nodeId} with children`, newNodes);
      } else {
        console.log(`No children to expand for node ${nodeId}`);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id="mynetwork"
      className="w-[calc(100vw-300px)] h-screen "
    ></div>
  );
};
