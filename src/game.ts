const compareArray = (arr1: number[], arr2: number[]) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((val, index) => val === arr2[index])
  );
};

const merge = (
  cellGroup: number[]
): { newCells: number[]; newScore: number } => {
  const newCells = [0, 0, 0, 0];
  let newScore = 0;
  let curIdx = 0;
  let isLastCellAvaiable = true;
  for (let i = 0; i < 4; i += 1) {
    if (cellGroup[i] === 0) continue;
    if (
      isLastCellAvaiable &&
      curIdx > 0 &&
      cellGroup[i] === newCells[curIdx - 1]
    ) {
      newCells[curIdx - 1] = cellGroup[i] * 2;
      newScore += cellGroup[i] * 2;
      isLastCellAvaiable = false;
    } else {
      newCells[curIdx] = cellGroup[i];
      curIdx += 1;
      isLastCellAvaiable = true;
    }
  }
  // console.log(newCells);

  return { newCells, newScore };
};

const resetBoard = (): number[] => {
  console.log("reset");
  return generateNewNumber(Array(16).fill(0), 2);
};

const handleLeft = (
  curCells: number[]
): { newCells: number[]; newScore: number } => {
  console.log("left");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let row = 0; row < 4; row += 1) {
    const { newCells: newRowCells, newScore: newRowScore } = merge(
      curCells.slice(row * 4, row * 4 + 4)
    );

    newCells[row * 4] = newRowCells[0];
    newCells[row * 4 + 1] = newRowCells[1];
    newCells[row * 4 + 2] = newRowCells[2];
    newCells[row * 4 + 3] = newRowCells[3];

    newScore += newRowScore;
  }
  if (compareArray(curCells, newCells)) {
    return { newCells, newScore: 0 };
  }

  return { newCells: generateNewNumber(newCells), newScore };
};

const handleRight = (
  curCells: number[]
): { newCells: number[]; newScore: number } => {
  console.log("right");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let row = 0; row < 4; row += 1) {
    const { newCells: newRowCells, newScore: newRowScore } = merge(
      curCells.slice(row * 4, row * 4 + 4).reverse()
    );

    newCells[row * 4 + 3] = newRowCells[0];
    newCells[row * 4 + 2] = newRowCells[1];
    newCells[row * 4 + 1] = newRowCells[2];
    newCells[row * 4] = newRowCells[3];

    newScore += newRowScore;
  }

  if (compareArray(curCells, newCells)) {
    return { newCells, newScore: 0 };
  }
  return { newCells: generateNewNumber(newCells), newScore };
};

const handleUp = (
  curCells: number[]
): { newCells: number[]; newScore: number } => {
  console.log("up");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let col = 0; col < 4; col += 1) {
    const { newCells: newColCells, newScore: newColScore } = merge(
      curCells.filter((_, idx) => idx % 4 === col)
    );

    newCells[col] = newColCells[0];
    newCells[col + 4] = newColCells[1];
    newCells[col + 8] = newColCells[2];
    newCells[col + 12] = newColCells[3];

    newScore += newColScore;
  }

  if (compareArray(curCells, newCells)) {
    return { newCells, newScore: 0 };
  }
  return { newCells: generateNewNumber(newCells), newScore };
};

const handleDown = (
  curCells: number[]
): { newCells: number[]; newScore: number } => {
  console.log("down");

  const newCells: number[] = Array(16).fill(0);
  let newScore = 0;
  for (let col = 0; col < 4; col += 1) {
    const { newCells: newColCells, newScore: newColScore } = merge(
      curCells.filter((_, idx) => idx % 4 === col).reverse()
    );

    newCells[col + 12] = newColCells[0];
    newCells[col + 8] = newColCells[1];
    newCells[col + 4] = newColCells[2];
    newCells[col] = newColCells[3];

    newScore += newColScore;
  }

  if (compareArray(curCells, newCells)) {
    return { newCells, newScore: 0 };
  }
  return { newCells: generateNewNumber(newCells), newScore };
};

const generateNewNumber = (curCells: number[], times: number = 1): number[] => {
  const newCells = [...curCells];
  for (let i = 0; i < times; i++) {
    let rnd = Math.floor(Math.random() * 16);
    while (newCells[rnd] !== 0) {
      rnd = Math.floor(Math.random() * 16);
    }
    newCells[rnd] = Math.random() < 0.9 ? 2 : 4;
  }

  return newCells;
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
