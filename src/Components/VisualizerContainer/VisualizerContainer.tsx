import React from "react";
import { Typography, Box } from "@mui/material";
import type { AlgorithmType, Item } from "../../Types/lab3Types";
import styles from "./VisualizerContainer.module.css";

interface VisualizerContainerProps {
  algorithm: AlgorithmType;
  items: Item[];
  capacity: number;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  algorithm,
  items,
  capacity,
}) => {
  const renderVisualizer = () => {
    switch (algorithm) {
      case "DP":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">
              Таблиця динамічного програмування
            </Typography>
          </Box>
        );

      case "RECURSION":
      case "BRANCH_AND_BOUND":
        return (
          <Box sx={{ width: "100%", height: "500px" }}>
            <Typography variant="h6" align="center">
              Дерево рішень
            </Typography>
            <Typography variant="body2" align="center">
            </Typography>
          </Box>
        );

      case "GREEDY":
      case "BRUTE_FORCE":
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Список та анімація</Typography>
            <Typography variant="body2">
            </Typography>
          </Box>
        );

      default:
        return (
          <div className={styles.placeholder}>Оберіть алгоритм для початку</div>
        );
    }
  };

  return <div className={styles.container}>{renderVisualizer()}</div>;
};

export default VisualizerContainer;
