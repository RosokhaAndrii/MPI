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
import RecursiveVisualizer from "../RecursiveVisualizer/RecursiveVisualizer";
import styles from "./VisualizerContainer.module.css";

interface VisualizerContainerProps {
  algorithm: AlgorithmType;
  items: Item[];
  capacity: number;
  currentSnapshot: any;
  history: any[];
  status: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "ERROR";
  finalResult: AlgorithmResult | null;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  algorithm,
  items,
  capacity,
  currentSnapshot,
  history,
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
            {currentSnapshot?.type === "DP_TABLE" ? (
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              color="primary"
            >
              Дерево рішень (
              {algorithm === "RECURSION" ? "Рекурсія" : "Гілки та межі"})
            </Typography>

            {currentSnapshot?.type === "LIST_VIEW" ? (
              <RecursiveVisualizer snapshot={currentSnapshot} history={history} />
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Натисніть Play, щоб почати будувати дерево рішень...
                </Typography>
              </Box>
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
