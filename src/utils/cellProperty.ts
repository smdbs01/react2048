const backgroundColorMap: { [key: number]: string } = {
  0: "rgb(205, 193, 180)",
  2: "rgb(238, 228, 218)",
  4: "rgb(238, 225, 201)",
  8: "rgb(243, 178, 122)",
  16: "rgb(246, 150, 100)",
  32: "rgb(247, 124, 95)",
  64: "rgb(247, 95, 59)",
  128: "rgb(237, 208, 115)",
  256: "rgb(237, 204, 98)",
  512: "rgb(237, 201, 80)",
  1024: "rgb(237, 197, 63)",
  2048: "rgb(237, 194, 46)",
  4096: "rgb(0, 120, 120)",
  8192: "rgb(33, 99, 99)",
  16384: "rgb(66, 99, 99)",
  32768: "rgb(100, 99, 99)",
};

export function getBackgroundColor(val: number) {
  return backgroundColorMap[val] || "rgb(0, 0, 0)";
}

export function getFontColor(val: number) {
  if (val <= 4) {
    return "rgb(119, 110, 101)";
  } else {
    return "rgb(240, 240, 240)";
  }
}

export function getFontSize(val: number) {
  if (val <= 8) {
    return "text-6xl";
  } else if (val <= 64) {
    return "text-6xl";
  } else if (val <= 512) {
    return "text-5xl";
  } else if (val <= 8192) {
    return "text-4xl";
  } else if (val <= 98304) {
    return "text-3xl";
  } else {
    return "text-2xl";
  }
}
