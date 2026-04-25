import React from "react";
import { Typography, Box } from "@mui/material";
import FinalResult from "../FinalResult/FinalResult";
import type {
  AlgorithmType,
  Item,
  AlgorithmResult,
} from "../../Types/lab3Types";
import DPTable from "../DPTable/DPTable";
import BruteForceVisualizer from "../BruteForceVizualizer/BruteForceVizualizer";
import GreedyVisualizer from "../GreedyVisualizer/GreedyVisualizer";
import styles from "./VisualizerContainer.module.css";

interface VisualizerContainerProps {
  algorithm: AlgorithmType;
  items: Item[];
  capacity: number;
  currentSnapshot: any;
  status: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "ERROR";
  finalResult: AlgorithmResult | null;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  algorithm,
  items,
  capacity,
  currentSnapshot,
  status,
  finalResult,
}) => {
  const renderVisualizer = () => {
    switch (algorithm) {
      case "DP":
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Таблиця динамічного програмування
            </Typography>
            {currentSnapshot?.type === 'DP_TABLE' ? (
              <DPTable 
                snapshot={currentSnapshot} 
                items={items} 
                capacity={capacity} 
              />
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Натисніть Play, щоб почати заповнення таблиці...
              </Typography>
            )}
          </Box>
        );

     case "GREEDY": 
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Візуалізація Жадібного алгоритму
            </Typography>
            {currentSnapshot?.type === "LIST_VIEW" ? (
              <GreedyVisualizer 
                snapshot={currentSnapshot} 
                capacity={capacity} 
                allItems={items} 
              />
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Натисніть Play для початку аналізу предметів...
              </Typography>
            )}
          </Box>
        );

      case "BRUTE_FORCE": 
        return (
         <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Візуалізація Повного перебору
            </Typography>
            {currentSnapshot?.type === "LIST_VIEW" ? (
              <BruteForceVisualizer 
                snapshot={currentSnapshot} 
                capacity={capacity} 
                allItems={items} 
              />
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Натисніть Play для початку генерації комбінацій...
              </Typography>
            )}
          </Box>
        );

      case "RECURSION":
      case "BRANCH_AND_BOUND":
        return (
          <Box sx={{ textAlign: "center", p: 4, border: '2px dashed #ccc', borderRadius: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Meow
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Meow meow <br/>
            </Typography>
            {currentSnapshot?.type === "LIST_VIEW" && (
              <Typography variant="caption" sx={{ display: 'block', mt: 2, fontFamily: 'monospace' }}>
                Поточний крок: {currentSnapshot.description}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <div className={styles.placeholder}>Оберіть алгоритм для початку</div>
        );
    }
  };

  return (
    <div className={styles.container}>
      {renderVisualizer()}

      {status === "COMPLETED" && finalResult && (
        <Box sx={{ mt: 4 }}>
          <FinalResult
            result={finalResult}
            allItems={items}
            capacity={capacity}
          />
        </Box>
      )}
    </div>
  );
};

export default VisualizerContainer;