import { useState, useCallback, useEffect } from "react";

import { animated, useSpring } from "react-spring";

import AnimatedCell from "./components/AnimatedCell";

import {
  handleLeft,
  handleRight,
  handleUp,
  handleDown,
  resetBoard,
  isGameOver,
  type Animation,
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
  const [animations, setAnimations] = useState<Animation[]>([]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "r") {
        const { newCells, animations: newAnimations } = resetBoard();
        setCells(newCells);
        setScore(0);
        setGameState(1);
        setAnimations(newAnimations);
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
      setAnimations(animations);
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
        className="relative grid grid-cols-4 grid-rows-4 size-2xl justify-around gap-6 rounded-lg p-6"
        style={{ background: "rgb(187, 173, 160)" }}
      >
        {cells.map((val, i) => (
          <div className="relative">
            <div
              className="absolute left-0 top-0 size-full rounded-lg"
              style={{
                background: getBackgroundColor(0),
                color: getFontColor(0),
                fontSize: getFontSize(0),
                lineHeight: getLineHeight(0),
              }}
            >
              {val > 0 && <Cell key={i} val={val} />}
            </div>
          </div>
        ))}

        {animations.map((animation) => (
          <AnimatedCell
            key={animation.from + " " + animation.to + " " + animation.val} // SMH
            val={animation.val}
            from={animation.from}
            to={animation.to}
            isStay={animation.val === cells[animation.to]}
          />
        ))}
      </div>
    </div>
  );
}

function Cell(props: { val: number }) {
  const spring = useSpring({
    from: {
      scale: 0,
    },
    to: {
      scale: 1,
    },
    config: { mass: 5, tension: 300, friction: 5, clamp: true },
  });

  return (
    <animated.div
      className={
        "flex items-center justify-center rounded-lg font-bold size-full relative z-10"
      }
      style={{
        background: getBackgroundColor(props.val),
        color: getFontColor(props.val),
        fontSize: getFontSize(props.val),
        lineHeight: getLineHeight(props.val),
        scale: spring.scale,
      }}
    >
      {props.val === 0 ? "" : props.val}
    </animated.div>
  );
}

export default App;
