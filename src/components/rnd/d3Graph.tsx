import React, { useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import { toast, Toaster } from 'react-hot-toast';

import edgesData from './edges.json';
import nodesData from './nodes.json';

// Type definitions for nodes and links
interface Node {
  id: string;
  name: string;
  symbolType?: string;
  svg?: string;
  size?: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// Graph configuration
const initialConfig = {
  directed: true,
  automaticRearrangeAfterDropNode: true,
  collapsible: true,
  height: 600,
  highlightDegree: 2,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 12,
  minZoom: 5,
  nodeHighlightBehavior: true,
  // staticGraph: true,
  // staticGraphWithDragAndDrop: true,
  width: 1200,
  d3: {
    alphaTarget: 0.05,
    gravity: -200,
    linkLength: 120,
    linkStrength: 2,
  },
  node: {
    color: '#d3d3d3',
    fontColor: 'orange',
    fontSize: 10,
    highlightColor: '#999',
    highlightFontSize: 14,
    highlightFontWeight: 'bold',
    highlightStrokeColor: '#999',
    highlightStrokeWidth: 1.5,
    labelProperty: (n: Node) => n.name || n.id,
    opacity: 0.9,
    renderLabel: true,
    size: 200,
    draggable: true,
  },
  link: {
    color: 'lightgray',
    highlightColor: 'skyblue',
    opacity: 1,
    strokeWidth: 3,
    // type: 'CURVE_SMOOTH',
  },
};

export const D3Graph: React.FC = () => {
  const [config, setConfig] = useState(initialConfig);

  const allNodes: Node[] = nodesData.map((node) => ({
    id: node.node_id,
    name: node.table_name,
    symbolType: 'circle',
    size: 400,
  }));

  const allEdges: Link[] = edgesData.map((edge) => ({
    target: edge.source,
    source: edge.target,
  }));

  // Helper to get child nodes and edges for a given parent node
  const getChildren = (parentId: string) => {
    const childrenEdges = allEdges.filter((edge) => edge.source === parentId);
    const childrenNodes = childrenEdges
      .map((edge) => allNodes.find((node) => node.id === edge.target))
      .filter((node): node is Node => node !== undefined);

    return { childrenNodes, childrenEdges };
  };

  // Initialize graph with the root node and its direct children
  const rootNode = allNodes[0];
  const initialChildren = getChildren(rootNode.id);

  const [data, setData] = useState<GraphData>({
    nodes: [rootNode, ...initialChildren.childrenNodes],
    links: [...initialChildren.childrenEdges],
  });

  const graphRef = useRef<any>(null);

  // Log initial data for debugging
  // useEffect(() => {
  //   setConfig((prev) => ({ ...prev, initialZoom: 1 }));
  // }, [data]);

  // Handle graph click
  const onClickGraph = () => toast('Clicked the graph');

  // Handle node click and load child nodes dynamically
  const onClickNode = (id: string) => {
    toast(`Clicked node ${id}`);

    const { childrenNodes, childrenEdges } = getChildren(id);

    if (childrenNodes.length === 0) {
      toast('No child nodes found');
      return;
    }

    setData((prevData) => {
      const newNodes = [
        ...prevData.nodes,
        ...childrenNodes.filter(
          (node) => !prevData.nodes.some((n) => n.id === node.id),
        ),
      ];
      const newLinks = [
        ...prevData.links,
        ...childrenEdges.filter(
          (link) =>
            !prevData.links.some(
              (existingLink) =>
                existingLink.source === link.source &&
                existingLink.target === link.target,
            ),
        ),
      ];

      return { nodes: newNodes, links: newLinks };
    });
  };

  // Handle link click
  const onClickLink = (source: string, target: string) =>
    toast(`Clicked link between ${source} and ${target}`);

  return (
    <div className="h-screen w-screen">
      <Toaster />
      {data.nodes.length > 0 && data.links.length > 0 && (
        <Graph
          id="graph-id" // Unique identifier for the graph
          ref={graphRef}
          data={data}
          config={config}
          onClickNode={onClickNode}
          onClickLink={onClickLink}
          onClickGraph={onClickGraph}
          onZoomChange={() => {}}
        />
      )}
    </div>
  );
};
