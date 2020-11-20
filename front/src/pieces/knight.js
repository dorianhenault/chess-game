import Piece from './piece.js';
import { isSameRow } from '../helpers'
const knightUrls = require('../dictionaries/piecesUrls.json')["Knight"];

export default class Knight extends Piece {
  constructor(player) {
    super(player, (player === 1 ? knightUrls["white"] : knightUrls["black"]));
  }

  isMovePossible(src, dest) {
    return ((src - 17 === dest && !isSameRow(src, dest)) ||
      (src - 10 === dest && !isSameRow(src, dest)) ||
      (src + 6 === dest && !isSameRow(src, dest)) ||
      (src + 15 === dest && !isSameRow(src, dest)) ||
      (src - 15 === dest && !isSameRow(src, dest)) ||
      (src - 6 === dest && !isSameRow(src, dest)) ||
      (src + 10 === dest && !isSameRow(src, dest)) ||
      (src + 17 === dest && !isSameRow(src, dest)))
  }

  /**
   * always returns empty array because of jumping
   * @return {[]}
   */
  getSrcToDestPath() {
    return [];
  }
}
