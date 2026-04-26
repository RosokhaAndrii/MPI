import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { calculateCoordinatesDagre } from "../../Utils/calculateCoordiatesDagre";
import { Box, Typography } from "@mui/material";

interface TreeVisualizerProps {
  snapshot: any;
  history: any[];
}

const RecursiveVisualizer: React.FC<TreeVisualizerProps> = ({
  snapshot,
  history,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!history || history.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    history.forEach((step) => {
      if (!step.nodeId) return;

      const isCurrentNode = step.nodeId === snapshot?.nodeId;

      newNodes.push({
        id: step.nodeId,
        position: { x: 0, y: 0 },
        data: {
          label: (
            <div style={{ padding: "5px", textAlign: "center" }}>
              <strong>{step.label}</strong>
              <br />
              <small>
                v: {step.currentTotalValue} | w: {step.currentTotalWeight}
              </small>
            </div>
          ),
        },
        style: {
          background: step.label.includes("❌") ? "#ffebee" : "#e3f2fd",
          border: isCurrentNode ? "3px solid #ff9800" : "1px solid #1976d2",
          boxShadow: isCurrentNode
            ? "0 4px 12px rgba(255, 152, 0, 0.4)"
            : "none",
          borderRadius: "8px",
          width: 150,
          opacity: isCurrentNode ? 1 : 0.85,
        },
      });

      if (step.parentId) {
        newEdges.push({
          id: `e-${step.parentId}-${step.nodeId}`,
          source: step.parentId,
          target: step.nodeId,
          type: "smoothstep",
          animated: isCurrentNode,
        });
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } =
      calculateCoordinatesDagre(newNodes, newEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [history?.length, snapshot?.nodeId]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "65vh",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        position: "relative",
        backgroundColor: "#fafafa",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          zIndex: 10,
          p: 1,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "0 0 8px 0",
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        {snapshot?.description}
      </Typography>

      <Box sx={{ width: "100%", height: "100%", flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          minZoom={0.1}
          style={{ width: "100%", height: "100%" }}
        >
          <Background gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default RecursiveVisualizer;
