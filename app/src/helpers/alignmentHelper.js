/* eslint-disable no-bitwise */
export const directions = {
  TOP: 1,
  BOTTOM: 2,
  RIGHT: 4,
  LEFT: 8,
};

export const alignments = {
  TOP_LEFT: directions.TOP | directions.LEFT,
  TOP_RIGHT: directions.TOP | directions.RIGHT,
  BOTTOM_LEFT: directions.BOTTOM | directions.LEFT,
  BOTTOM_RIGHT: directions.BOTTOM | directions.RIGHT,
};

export const isAlignedTowards = (alignment, direction) => (alignment & direction) === direction;
