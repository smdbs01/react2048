import { useState, useCallback, useEffect } from "react";

import {
  handleLeft,
  handleRight,
  handleUp,
  handleDown,
  resetBoard,
  isGameOver,
} from "./game";

import {
  getBackgroundColor,
  getFontColor,
  getFontSize,
  getLineHeight,
} from "./utils/cellProperty";

function App() {
  const [cells, setCells] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(0); // 0: ready, 1: playing, 2: gameover

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "r") {
        const newCells = resetBoard();
        setCells(newCells);
        setScore(0);
        setGameState(1);
        return;
      }

      if (gameState === 2) {
        return;
      }
      let newCells, newScore;
      if (e.key === "ArrowLeft") {
        ({ newCells, newScore } = handleLeft(cells));
      } else if (e.key === "ArrowRight") {
        ({ newCells, newScore } = handleRight(cells));
      } else if (e.key === "ArrowUp") {
        ({ newCells, newScore } = handleUp(cells));
      } else if (e.key === "ArrowDown") {
        ({ newCells, newScore } = handleDown(cells));
      } else {
        return;
      }
      setCells(newCells);
      setScore(score + newScore);
      if (isGameOver(newCells)) {
        setGameState(2);
      }
    },
    [cells, score, gameState]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div className="size-screen flex flex-col items-center gap-2 p-2">
      <h1 className="text-3xl font-bold">2048 Demo</h1>
      <p className="text-2xl">Score: {score}</p>
      <div
        className="grid grid-cols-4 grid-rows-4 size-2xl justify-around gap-6 rounded-lg p-6"
        style={{ background: "rgb(187, 173, 160)" }}
      >
        {cells.map((val, i) => (
          <Cell key={i} val={val} />
        ))}
      </div>
    </div>
  );
}

function Cell(props: { val: number }) {
  return (
    <div
      className={
        "flex items-center justify-center rounded-lg text-gray-100 font-bold"
      }
      style={{
        background: getBackgroundColor(props.val),
        color: getFontColor(props.val),
        fontSize: getFontSize(props.val),
        lineHeight: getLineHeight(props.val),
      }}
    >
      <span>{props.val === 0 ? "" : props.val}</span>
    </div>
  );
}

export default App;
