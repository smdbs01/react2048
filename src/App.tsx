import { useEffect, useState } from "react";

import { getBackgroundColor, getFontColor, getFontSize } from "./utils/cellProperty";

function App() {
  return (
    <div className="size-screen flex flex-col items-center gap-2 p-2">
      <h1 className="text-3xl font-bold">2048 Demo</h1>
      <Board />
    </div>
  );
}

function Board() {
  // const [cells, setCells] = useState<number[]>(Array(16).fill(0));
  const [cells, setCells] = useState<number[]>([0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        console.log("left");
      } else if (e.key === "ArrowRight") {
        console.log("right");
      } else if (e.key === "ArrowUp") {
        console.log("up");
      } else if (e.key === "ArrowDown") {
        console.log("down");
      } else {
        return 
      }
      generateNewNumber();
    }

    function generateNewNumber() {
      let rnd = Math.floor(Math.random() * 16);
      while (cells[rnd] !== 0) {
        rnd = Math.floor(Math.random() * 16);
      }
      setCells((cells) => {
        const newCells = [...cells];
        newCells[rnd] = 2 * (Math.random() > 0.5 ? 2 : 1);
        return newCells;
      });
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [cells]);

  return (
    <div
      className="grid grid-cols-4 grid-rows-4 size-2xl justify-around gap-6 rounded-lg p-6"
      style={{ background: "rgb(187, 173, 160)", color: "rgb(119, 110, 101)" }}
    >
      {cells.map((val, i) => (
        <Cell key={i} val={val} />
      ))}
    </div>
  );
}

function Cell(props: { val: number }) {
  return (
    <div
      className={"flex items-center justify-center rounded-lg text-gray-100 font-bold text-4xl " + (getFontSize(props.val))}
      style={{ background: getBackgroundColor(props.val), color: getFontColor(props.val) }}
    >
      <span>{props.val === 0 ? "" : props.val}</span>
    </div>
  );
}

export default App;
