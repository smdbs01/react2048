export type Animation = {
  from: number;
  to: number;
  val: number;
};

const compareArray = (arr1: number[], arr2: number[]) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((val, index) => val === arr2[index])
  );
};

const merge = (
  cellGroup: number[]
): {
  newCells: number[];
  newScore: number;
  animations: { from: number; to: number; val: number }[];
} => {
  const newCells = [0, 0, 0, 0];
  let newScore = 0;
  let curIdx = 0;
  let isLastCellAvaiable = true;
  const animations: Animation[] = [];
  for (let i = 0; i < 4; i += 1) {
    if (cellGroup[i] === 0) continue;
    if (
      isLastCellAvaiable &&
      curIdx > 0 &&
      cellGroup[i] === newCells[curIdx - 1]
    ) {
      newCells[curIdx - 1] = cellGroup[i] * 2;
      newScore += cellGroup[i] * 2;
      animations.push({ from: i, to: curIdx - 1, val: cellGroup[i] });
      isLastCellAvaiable = false;
    } else {
      newCells[curIdx] = cellGroup[i];
      animations.push({ from: i, to: curIdx, val: cellGroup[i] });
      isLastCellAvaiable = true;
      curIdx += 1;
    }
  }
  // console.log(newCells);

  return { newCells, newScore, animations };
};

const resetBoard = (): {
  newCells: number[];
  animations: Animation[];
} => {
  console.log("reset");

  return {
    ...generateNewNumber(Array(16).fill(0), 2),
    animations: [],
  };
};

const handleLeft = (
  curCells: number[]
): {
  newCells: number[];
  newScore: number;
  animations: Animation[];
} => {
  console.log("left");

  return moveHandler(curCells, (i, j) => i * 4 + j);
};

const handleRight = (
  curCells: number[]
): {
  newCells: number[];
  newScore: number;
  animations: Animation[];
} => {
  console.log("right");

  return moveHandler(curCells, (i, j) => i * 4 + 3 - j);
};

const handleUp = (
  curCells: number[]
): {
  newCells: number[];
  newScore: number;
  animations: Animation[];
} => {
  console.log("up");

  return moveHandler(curCells, (i, j) => i + j * 4);
};

const handleDown = (
  curCells: number[]
): {
  newCells: number[];
  newScore: number;
  animations: Animation[];
} => {
  console.log("down");

  return moveHandler(curCells, (i, j) => i + (3 - j) * 4);
};

const moveHandler = (
  curCells: number[],
  transformer: (i: number, j: number) => number
): {
  newCells: number[];
  newScore: number;
  animations: Animation[];
} => {
  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  const animations: { from: number; to: number; val: number }[] = [];

  for (let group = 0; group < 4; group += 1) {
    const {
      newCells: newGroupCells,
      newScore: newGroupScore,
      animations: groupAnimations,
    } = merge([0, 1, 2, 3].map((idx) => curCells[transformer(group, idx)]));

    newGroupCells.forEach((cell, idx) => {
      newCells[transformer(group, idx)] = cell;
    });

    newScore += newGroupScore;

    groupAnimations.forEach(({ from, to, val }) => {
      animations.push({
        from: transformer(group, from),
        to: transformer(group, to),
        val,
      });
    });
  }
  if (compareArray(curCells, newCells)) {
    return { newCells, newScore: 0, animations: [] };
  }

  const generateResult = generateNewNumber(newCells);
  return {
    newCells: generateResult.newCells,
    newScore,
    animations,
  };
};

const generateNewNumber = (
  curCells: number[],
  times: number = 1
): { newCells: number[] } => {
  const newCells = [...curCells];
  for (let i = 0; i < times; i++) {
    let rnd = Math.floor(Math.random() * 16);
    while (newCells[rnd] !== 0) {
      rnd = Math.floor(Math.random() * 16);
    }
    newCells[rnd] = Math.random() < 0.9 ? 2 : 4;
  }

  return { newCells };
};

const isGameOver = (curCells: number[]): boolean => {
  let isOver = true;
  for (let i = 0; i < 16; i++) {
    if (
      curCells[i] === 0 ||
      (i % 4 !== 3 && curCells[i] === curCells[i + 1]) ||
      (i < 12 && curCells[i] === curCells[i + 4])
    ) {
      isOver = false;
      break;
    }
  }
  return isOver;
};

export {
  handleLeft,
  handleRight,
  handleUp,
  handleDown,
  isGameOver,
  resetBoard,
};
