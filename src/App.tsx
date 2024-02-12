import { useState, useCallback, useEffect } from "react";

import { useSprings, animated } from "react-spring";

import {
  handleLeft,
  handleRight,
  handleUp,
  handleDown,
  resetBoard,
  isGameOver,
} from "./utils/game";

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

  const [cellSprings, api] = useSprings(
    cells.length,
    () => ({
      x: 0,
      y: 0,
    }),
    [cells]
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "r") {
        const { newCells, animations } = resetBoard();
        setCells(newCells);
        setScore(0);
        setGameState(1);
        return;
      }

      if (gameState === 2) {
        return;
      }
      let newCells, newScore, animations;
      if (e.key === "ArrowLeft") {
        ({ newCells, newScore, animations } = handleLeft(cells));
      } else if (e.key === "ArrowRight") {
        ({ newCells, newScore, animations } = handleRight(cells));
      } else if (e.key === "ArrowUp") {
        ({ newCells, newScore, animations } = handleUp(cells));
      } else if (e.key === "ArrowDown") {
        ({ newCells, newScore, animations } = handleDown(cells));
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
        {cellSprings.map((spring, i) => (
          <Cell key={i} val={cells[i]} spring={spring} />
        ))}
      </div>
    </div>
  );
}

function Cell(props: { val: number; spring?: object }) {
  return (
    <div style={{ background: "rgb(205, 193, 180)" }}>
      {props.val === 0 ? (
        <div
          className="size-full rounded-lg"
          style={{
            background: getBackgroundColor(0),
            color: getFontColor(0),
            fontSize: getFontSize(0),
            lineHeight: getLineHeight(0),
          }}
        ></div>
      ) : (
        <animated.div
          className={
            "flex items-center justify-center rounded-lg text-gray-100 font-bold size-full"
          }
          style={{
            background: getBackgroundColor(props.val),
            color: getFontColor(props.val),
            fontSize: getFontSize(props.val),
            lineHeight: getLineHeight(props.val),
            ...props.spring,
          }}
        >
          {props.val === 0 ? "" : props.val}
        </animated.div>
      )}
    </div>
  );
}

export default App;
