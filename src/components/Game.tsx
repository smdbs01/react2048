import { useCallback, useEffect, useState } from "react";

import { getBackgroundColor, getFontColor, getFontSize, getLineHeight } from "../utils/cellProperty";

const compareArray = (arr1: number[], arr2: number[]) => {
  return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
}

const merge = (cellGroup: number[]): {newCells: number[], newScore: number} => {
  const newCells = [0, 0, 0, 0];
  let newScore = 0;
  let curIdx = 0;
  for (let i = 0; i < 4; i += 1) {
    if (cellGroup[i] === 0) continue;
    if (curIdx > 0 && cellGroup[i] === newCells[curIdx - 1]) {
      newCells[curIdx - 1] = cellGroup[i] * 2;
      newScore += cellGroup[i] * 2;
    } else {
      newCells[curIdx] = cellGroup[i];
      curIdx += 1;
    }
  }
  // console.log(newCells);

  return {newCells, newScore};
}

const resetBoard = (): number[] => {
  console.log("reset");
  return generateNewNumber(Array(16).fill(0), 2);
}

const handleLeft = (curCells: number[]): {newCells: number[], newScore: number} => {
  console.log("left");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let row = 0; row < 4; row += 1) {
    const {newCells: newRowCells, newScore: newRowScore} = merge(curCells.slice(row * 4, row * 4 + 4));

    newCells[row * 4] = newRowCells[0];
    newCells[row * 4 + 1] = newRowCells[1];
    newCells[row * 4 + 2] = newRowCells[2];
    newCells[row * 4 + 3] = newRowCells[3];

    newScore += newRowScore;
  }
  if (compareArray(curCells, newCells)) {
    return {newCells, newScore: 0};
  }

  return {newCells: generateNewNumber(newCells), newScore};
}

const handleRight = (curCells: number[]): {newCells: number[], newScore: number} => {
  console.log("right");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let row = 0; row < 4; row += 1) {
    const {newCells: newRowCells, newScore: newRowScore} = merge(curCells.slice(row * 4, row * 4 + 4).reverse());

    newCells[row * 4 + 3] = newRowCells[0];
    newCells[row * 4 + 2] = newRowCells[1];
    newCells[row * 4 + 1] = newRowCells[2];
    newCells[row * 4] = newRowCells[3];

    newScore += newRowScore;
  }

  if (compareArray(curCells, newCells)) {
    return {newCells, newScore: 0};
  }
  return {newCells: generateNewNumber(newCells), newScore};
}

const handleUp = (curCells: number[]): {newCells: number[], newScore: number} => {
  console.log("up");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let col = 0; col < 4; col += 1) {
    const {newCells: newColCells, newScore: newColScore} = merge(curCells.filter((_, idx) => idx % 4 === col));

    newCells[col] = newColCells[0];
    newCells[col + 4] = newColCells[1];
    newCells[col + 8] = newColCells[2];
    newCells[col + 12] = newColCells[3];

    newScore += newColScore;
  }

  if (compareArray(curCells, newCells)) {
    return {newCells, newScore: 0};
  }
  return {newCells: generateNewNumber(newCells), newScore};
}

const handleDown = (curCells: number[]): {newCells: number[], newScore: number} => {
  console.log("down");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let col = 0; col < 4; col += 1) {
    const {newCells: newColCells, newScore: newColScore} = merge(curCells.filter((_, idx) => idx % 4 === col).reverse());

    newCells[col + 12] = newColCells[0];
    newCells[col + 8] = newColCells[1];
    newCells[col + 4] = newColCells[2];
    newCells[col] = newColCells[3];

    newScore += newColScore;
  }

  if (compareArray(curCells, newCells)) {
    return {newCells, newScore: 0};
  }
  return {newCells: generateNewNumber(newCells), newScore};
}

function generateNewNumber(curCells: number[], times: number = 1): number[] {
  const newCells = [...curCells];
  for (let i = 0; i < times; i++) {
    let rnd = Math.floor(Math.random() * 16);
    while (newCells[rnd] !== 0) {
      rnd = Math.floor(Math.random() * 16);
    }
    newCells[rnd] = Math.random() < 0.9 ? 2 : 4;
  }

  return newCells;
}

function isGameOver(curCells: number[]) {
  let isOver = true;
  for (let i = 0; i < 16; i++) {
    if (curCells[i] === 0 || (i % 4 !== 3 && curCells[i] === curCells[i + 1]) || (i < 12 && curCells[i] === curCells[i + 4])) {
      isOver = false;
      break;
    }
  }
  return isOver;
}

export default function Board() {
  const [cells, setCells] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(1); // 0: ready, 1: playing, 2: gameover

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "r") {
      const newCells = resetBoard();
      setCells(newCells);
      setScore(0);
      setGameState(1);
      return
    }
    
    if (gameState === 2) {
      return;
    }
    let newCells, newScore;
    if (e.key === "ArrowLeft") {
      ({ newCells, newScore } = handleLeft(cells));
    }  else if (e.key === "ArrowRight") {
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
  }, [cells, score, gameState]);
 
  // ONMOUNTED, REACT WHAT?
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div
      className="grid grid-cols-4 grid-rows-4 size-2xl justify-around gap-6 rounded-lg p-6"
      style={{ background: "rgb(187, 173, 160)" }}
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
      className={"flex items-center justify-center rounded-lg text-gray-100 font-bold"}
      style={{ background: getBackgroundColor(props.val), color: getFontColor(props.val), fontSize: getFontSize(props.val), lineHeight: getLineHeight(props.val) }}
    >
      <span>{props.val === 0 ? "" : props.val}</span>
    </div>
  );
}