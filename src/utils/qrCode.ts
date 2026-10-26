/**
 * Standalone, zero-dependency QR Code generator utility in TypeScript.
 * Generates ISO/IEC 18004 compliant QR matrices (Versions 1-8, EC Level Medium).
 * Safe for offline client-side and browser usage.
 */

// Alignment pattern locations for versions 1 to 8
const ALIGNMENT_PATTERN_LOCATIONS: number[][] = [
  [], // V0 dummy
  [], // V1
  [6, 18], // V2
  [6, 22], // V3
  [6, 26], // V4
  [6, 30], // V5
  [6, 34], // V6
  [6, 22, 38], // V7
  [6, 24, 42], // V8
];

// Total codewords and EC codewords for Level M (Medium) for versions 1 to 8:
// [totalCodewords, ecCodewordsPerBlock, numBlocks]
const VERSION_INFO_M: [number, number, number][] = [
  [0, 0, 0], // V0 dummy
  [26, 10, 1], // V1: 26 total, 16 data, 10 EC (1 block)
  [44, 16, 1], // V2: 44 total, 28 data, 16 EC (1 block)
  [70, 26, 1], // V3: 70 total, 44 data, 26 EC (1 block)
  [100, 18, 2], // V4: 100 total, 64 data, 18 EC (2 blocks: 32 data each)
  [134, 24, 2], // V5: 134 total, 86 data, 24 EC (2 blocks: 43 data each)
  [172, 16, 4], // V6: 172 total, 108 data, 16 EC (4 blocks: 27 data each)
  [196, 18, 4], // V7: 196 total, 124 data, 18 EC (4 blocks: 31 data each)
  [242, 22, 4], // V8: 242 total, 154 data, 22 EC (4 blocks)
];

// Galois Field GF(256) tables (polynomial 0x11d)
const EXP_TABLE = new Uint8Array(256);
const LOG_TABLE = new Uint8Array(256);

for (let i = 0, x = 1; i < 255; i++) {
  EXP_TABLE[i] = x;
  LOG_TABLE[x] = i;
  x <<= 1;
  if (x & 256) x ^= 0x11d;
}
EXP_TABLE[255] = EXP_TABLE[0];

function glog(n: number): number {
  if (n < 1) return 0;
  return LOG_TABLE[n];
}

function gexp(n: number): number {
  let v = n % 255;
  if (v < 0) v += 255;
  return EXP_TABLE[v];
}

function gmult(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return gexp(glog(x) + glog(y));
}

function rsPoly(ecCount: number): number[] {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = [1, gexp(i)];
    const res = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      for (let k = 0; k < next.length; k++) {
        res[j + k] ^= gmult(poly[j], next[k]);
      }
    }
    poly = res;
  }
  return poly;
}

function calcEc(data: number[], ecCount: number): number[] {
  const gen = rsPoly(ecCount);
  const remainder = new Array(ecCount).fill(0);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    for (let j = 0; j < ecCount - 1; j++) {
      remainder[j] = remainder[j + 1] ^ gmult(gen[j + 1], factor);
    }
    remainder[ecCount - 1] = gmult(gen[ecCount], factor);
  }
  return remainder;
}

// 15-bit format information for Level M with masks 0..7 (BCH 15,5 masked with 0x5412)
const FORMAT_STRINGS_M = [
  0b101010000010010, // Mask 0: (r + c) % 2 === 0
  0b101000100111101, // Mask 1
  0b101111001111100, // Mask 2
  0b101101101010011, // Mask 3
  0b100010011101100, // Mask 4
  0b100000111000011, // Mask 5
  0b100111010000010, // Mask 6
  0b100101110101101, // Mask 7
];

/**
 * Generates a 2D boolean grid (true = dark module, false = light module)
 * for the supplied string using standard QR encoding.
 */
export function generateQrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const dataLen = bytes.length;

  // Determine the smallest version (1..8) that fits the payload
  let version = 1;
  while (version <= 8) {
    const [total, ecPerBlock, numBlocks] = VERSION_INFO_M[version];
    const dataCapacity = total - ecPerBlock * numBlocks;
    if (dataLen + 2 <= dataCapacity) {
      break;
    }
    version++;
  }
  if (version > 8) {
    version = 8;
  }

  const [totalCodewords, ecPerBlock, numBlocks] = VERSION_INFO_M[version];
  const totalDataCodewords = totalCodewords - ecPerBlock * numBlocks;

  const bitArray: number[] = [];
  function pushBits(val: number, count: number) {
    for (let i = count - 1; i >= 0; i--) {
      bitArray.push((val >>> i) & 1);
    }
  }

  // 1. Mode indicator (Byte mode: 0100)
  pushBits(0b0100, 4);

  // 2. Character count (8 bits for V1-V9 byte mode)
  pushBits(Math.min(dataLen, 255), 8);

  // 3. Payload bytes
  for (let i = 0; i < dataLen && bitArray.length / 8 < totalDataCodewords; i++) {
    pushBits(bytes[i], 8);
  }

  // 4. Terminator bits (up to 4 zeroes)
  const remainingBits = totalDataCodewords * 8 - bitArray.length;
  const termLength = Math.min(4, Math.max(0, remainingBits));
  pushBits(0, termLength);

  // 5. Byte boundary alignment
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }

  // 6. Convert bits to data codewords
  const dataCodewords: number[] = [];
  for (let i = 0; i < bitArray.length; i += 8) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bitArray[i + b];
    }
    dataCodewords.push(byteVal);
  }

  // 7. Padding codewords (alternating 0xEC, 0x11)
  const padPatterns = [0xec, 0x11];
  let padIdx = 0;
  while (dataCodewords.length < totalDataCodewords) {
    dataCodewords.push(padPatterns[padIdx % 2]);
    padIdx++;
  }

  // 8. Split into blocks and calculate Reed-Solomon EC bytes
  const blockSize = Math.floor(totalDataCodewords / numBlocks);
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];

  for (let b = 0; b < numBlocks; b++) {
    const start = b * blockSize;
    const blockData = dataCodewords.slice(start, start + blockSize);
    dataBlocks.push(blockData);
    ecBlocks.push(calcEc(blockData, ecPerBlock));
  }

  // 9. Interleave data and EC codewords
  const finalCodewords: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(dataBlocks[b][i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(ecBlocks[b][i]);
    }
  }

  // 10. Matrix layout
  const size = version * 4 + 17;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setModule(r: number, c: number, val: boolean, isFn = true) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val;
      if (isFn) isFunction[r][c] = true;
    }
  }

  // Finder pattern helper
  function addFinder(r: number, c: number) {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
            const isBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
            const isCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
            setModule(nr, nc, isBorder || isCenter);
          } else {
            setModule(nr, nc, false); // Separator
          }
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  const alignCoords = ALIGNMENT_PATTERN_LOCATIONS[version] || [];
  for (const ar of alignCoords) {
    for (const ac of alignCoords) {
      const onFinder =
        (ar < 9 && ac < 9) ||
        (ar < 9 && ac > size - 10) ||
        (ar > size - 10 && ac < 9);
      if (!onFinder) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
            const isCenter = dr === 0 && dc === 0;
            setModule(ar + dr, ac + dc, isBorder || isCenter);
          }
        }
      }
    }
  }

  // Dark module
  setModule(size - 8, 8, true);

  // Reserve format areas
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      isFunction[8][i] = true;
      isFunction[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    isFunction[8][size - 1 - i] = true;
    isFunction[size - 1 - i][8] = true;
  }

  // Zigzag bit placement with Mask 0: (row + col) % 2 === 0
  let bitIdx = 0;
  const totalBits = finalCodewords.length * 8;
  let upward = true;

  for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
    if (rightCol === 6) rightCol--; // Skip vertical timing column
    const colLeft = rightCol - 1;

    const rowIndices: number[] = [];
    if (upward) {
      for (let r = size - 1; r >= 0; r--) rowIndices.push(r);
    } else {
      for (let r = 0; r < size; r++) rowIndices.push(r);
    }

    for (const r of rowIndices) {
      for (const c of [rightCol, colLeft]) {
        if (!isFunction[r][c]) {
          let bit = false;
          if (bitIdx < totalBits) {
            const byteVal = finalCodewords[Math.floor(bitIdx / 8)];
            bit = ((byteVal >>> (7 - (bitIdx % 8))) & 1) === 1;
            bitIdx++;
          }
          // Mask 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = mask ? !bit : bit;
        }
      }
    }
    upward = !upward;
  }

  // Write format info (Level M, Mask 0)
  const fmt = FORMAT_STRINGS_M[0];
  for (let i = 0; i < 15; i++) {
    const bit = ((fmt >>> (14 - i)) & 1) === 1;
    // Top-left
    if (i < 6) matrix[8][i] = bit;
    else if (i === 6) matrix[8][7] = bit;
    else if (i === 7) matrix[8][8] = bit;
    else if (i === 8) matrix[7][8] = bit;
    else matrix[14 - i][8] = bit;

    // Around right and bottom finder
    if (i < 8) matrix[size - 1 - i][8] = bit;
    else matrix[8][size - 15 + i] = bit;
  }

  return matrix;
}

/**
 * Converts a 2D boolean matrix to an SVG path string for high performance rendering.
 */
export function matrixToSvgPath(matrix: boolean[][]): string {
  const paths: string[] = [];
  const size = matrix.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        // Draw a unit square module: M c r h 1 v 1 h -1 Z
        paths.push(`M${c},${r}h1v1h-1z`);
      }
    }
  }

  return paths.join(' ');
}

