import Piece from './piece.js';
import { isSameDiagonal, isSameRow } from '../helpers'
const kingUrls= require('../dictionaries/piecesUrls.json')["King"];


export default class King extends Piece {
  constructor(player) {
    super(player, (player === 1 ? kingUrls["white"] : kingUrls["black"]));
  }

  isMovePossible(src, dest) {
    return ((src - 9 === dest && isSameDiagonal(src, dest)) ||
      src - 8 === dest ||
      (src - 7 === dest && isSameDiagonal(src, dest)) ||
      (src + 1 === dest && isSameRow(src, dest)) ||
      (src + 9 === dest && isSameDiagonal(src, dest)) ||
      src + 8 === dest ||
      (src + 7 === dest && isSameDiagonal(src, dest)) ||
      (src - 1 === dest && isSameRow(src, dest)))
  }

  /**
   * always returns empty array because of one step
   * @return {[]}
   */
  getSrcToDestPath(src, dest) {
    return [];
  }
}
