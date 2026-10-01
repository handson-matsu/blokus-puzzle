/* Verified with tools/solver.cjs. Regenerate metrics with tools/curate.cjs. */
(function(root){
  const puzzles = [
  {
    "number": 1,
    "title": "角で、こんにちは",
    "width": 5,
    "height": 5,
    "start": [
      0,
      0
    ],
    "pieces": [
      "1",
      "2",
      "L3"
    ],
    "difficulty": 1,
    "solutionCount": 73,
    "solutionCountExact": true,
    "searchNodes": 2763,
    "initialPlacements": 6,
    "solvableInitialPlacements": 6,
    "randomSuccessRate": 1
  },
  {
    "number": 2,
    "title": "向きを変えてみよう",
    "width": 6,
    "height": 6,
    "start": [
      0,
      0
    ],
    "pieces": [
      "L3",
      "I3",
      "O4",
      "1"
    ],
    "difficulty": 1,
    "solutionCount": 317,
    "solutionCountExact": true,
    "searchNodes": 27380,
    "initialPlacements": 7,
    "solvableInitialPlacements": 7,
    "randomSuccessRate": 0.922
  },
  {
    "number": 3,
    "title": "四角とジグザグ",
    "width": 7,
    "height": 7,
    "start": [
      0,
      0
    ],
    "pieces": [
      "O4",
      "S4",
      "T4",
      "2",
      "L3"
    ],
    "difficulty": 1,
    "solutionCount": 10000,
    "solutionCountExact": false,
    "searchNodes": 202424,
    "initialPlacements": 10,
    "solvableInitialPlacements": null,
    "randomSuccessRate": 0.96
  },
  {
    "number": 4,
    "title": "5マスのピースに挑戦",
    "width": 8,
    "height": 8,
    "start": [
      0,
      0
    ],
    "pieces": [
      "P5",
      "L5",
      "T5",
      "I3",
      "2"
    ],
    "difficulty": 1,
    "solutionCount": 10000,
    "solutionCountExact": false,
    "searchNodes": 896387,
    "initialPlacements": 18,
    "solvableInitialPlacements": null,
    "randomSuccessRate": 0.9985
  },
  {
    "number": 5,
    "title": "真ん中から広げよう",
    "width": 8,
    "height": 8,
    "start": [
      3,
      3
    ],
    "pieces": [
      "F5",
      "U5",
      "W5",
      "L4",
      "1",
      "2"
    ],
    "difficulty": 1,
    "solutionCount": 10000,
    "solutionCountExact": false,
    "searchNodes": 330485,
    "initialPlacements": 117,
    "solvableInitialPlacements": null,
    "randomSuccessRate": 0.9625
  },
  {
    "number": 6,
    "title": "四角からジグザグへ",
    "width": 6,
    "height": 6,
    "start": [
      0,
      0
    ],
    "pieces": [
      "I4",
      "O4",
      "W5",
      "S4"
    ],
    "difficulty": 2,
    "solutionCount": 76,
    "solutionCountExact": true,
    "searchNodes": 975,
    "initialPlacements": 7,
    "solvableInitialPlacements": 7,
    "randomSuccessRate": 0.463
  },
  {
    "number": 7,
    "title": "斜めのすき間",
    "width": 5,
    "height": 5,
    "start": [
      1,
      1
    ],
    "pieces": [
      "S4",
      "N5",
      "I3"
    ],
    "difficulty": 2,
    "solutionCount": 33,
    "solutionCountExact": true,
    "searchNodes": 364,
    "initialPlacements": 36,
    "solvableInitialPlacements": 22,
    "randomSuccessRate": 0.3775
  },
  {
    "number": 8,
    "title": "長い腕、短い腕",
    "width": 5,
    "height": 5,
    "start": [
      0,
      0
    ],
    "pieces": [
      "L3",
      "L5",
      "I3",
      "2"
    ],
    "difficulty": 2,
    "solutionCount": 52,
    "solutionCountExact": true,
    "searchNodes": 819,
    "initialPlacements": 13,
    "solvableInitialPlacements": 11,
    "randomSuccessRate": 0.266
  },
  {
    "number": 9,
    "title": "四角と二つの分かれ道",
    "width": 5,
    "height": 5,
    "start": [
      0,
      1
    ],
    "pieces": [
      "O4",
      "T4",
      "Z5"
    ],
    "difficulty": 2,
    "solutionCount": 11,
    "solutionCountExact": true,
    "searchNodes": 66,
    "initialPlacements": 11,
    "solvableInitialPlacements": 6,
    "randomSuccessRate": 0.2385
  },
  {
    "number": 10,
    "title": "小さな一歩の行き先",
    "width": 5,
    "height": 5,
    "start": [
      2,
      2
    ],
    "pieces": [
      "1",
      "F5",
      "S4",
      "L3"
    ],
    "difficulty": 2,
    "solutionCount": 44,
    "solutionCountExact": true,
    "searchNodes": 933,
    "initialPlacements": 69,
    "solvableInitialPlacements": 32,
    "randomSuccessRate": 0.1875
  },
  {
    "number": 11,
    "title": "中央の折り返し",
    "width": 5,
    "height": 5,
    "start": [
      2,
      2
    ],
    "pieces": [
      "P5",
      "L4",
      "S4"
    ],
    "difficulty": 3,
    "solutionCount": 10,
    "solutionCountExact": true,
    "searchNodes": 384,
    "initialPlacements": 88,
    "solvableInitialPlacements": 24,
    "randomSuccessRate": 0.157
  },
  {
    "number": 12,
    "title": "十字のための空間",
    "width": 5,
    "height": 5,
    "start": [
      0,
      0
    ],
    "pieces": [
      "1",
      "2",
      "X5",
      "L5"
    ],
    "difficulty": 3,
    "solutionCount": 20,
    "solutionCountExact": true,
    "searchNodes": 137,
    "initialPlacements": 9,
    "solvableInitialPlacements": 7,
    "randomSuccessRate": 0.122
  },
  {
    "number": 13,
    "title": "二本の棒の居場所",
    "width": 6,
    "height": 6,
    "start": [
      0,
      0
    ],
    "pieces": [
      "I4",
      "Y5",
      "S4",
      "I5"
    ],
    "difficulty": 3,
    "solutionCount": 14,
    "solutionCountExact": true,
    "searchNodes": 526,
    "initialPlacements": 10,
    "solvableInitialPlacements": 4,
    "randomSuccessRate": 0.1055
  },
  {
    "number": 14,
    "title": "くぼみの向こうへ",
    "width": 5,
    "height": 5,
    "start": [
      0,
      1
    ],
    "pieces": [
      "F5",
      "U5",
      "L5"
    ],
    "difficulty": 3,
    "solutionCount": 18,
    "solutionCountExact": true,
    "searchNodes": 192,
    "initialPlacements": 26,
    "solvableInitialPlacements": 10,
    "randomSuccessRate": 0.0865
  },
  {
    "number": 15,
    "title": "三つで一意",
    "width": 5,
    "height": 5,
    "start": [
      2,
      2
    ],
    "pieces": [
      "L5",
      "T5",
      "Y5"
    ],
    "difficulty": 3,
    "solutionCount": 1,
    "solutionCountExact": true,
    "searchNodes": 108,
    "initialPlacements": 60,
    "solvableInitialPlacements": 4,
    "randomSuccessRate": 0.0335
  },
  {
    "number": 16,
    "title": "四つの折れ曲がり",
    "width": 6,
    "height": 6,
    "start": [
      0,
      0
    ],
    "pieces": [
      "Y5",
      "V5",
      "N5",
      "T5"
    ],
    "difficulty": 4,
    "solutionCount": 14,
    "solutionCountExact": true,
    "searchNodes": 1103,
    "initialPlacements": 13,
    "solvableInitialPlacements": 9,
    "randomSuccessRate": 0.0155
  },
  {
    "number": 17,
    "title": "十字と階段のすき間",
    "width": 5,
    "height": 5,
    "start": [
      1,
      1
    ],
    "pieces": [
      "L3",
      "X5",
      "S4",
      "I3"
    ],
    "difficulty": 4,
    "solutionCount": 2,
    "solutionCountExact": true,
    "searchNodes": 117,
    "initialPlacements": 31,
    "solvableInitialPlacements": 3,
    "randomSuccessRate": 0.0105
  },
  {
    "number": 18,
    "title": "折り返しの一本道",
    "width": 6,
    "height": 6,
    "start": [
      0,
      0
    ],
    "pieces": [
      "W5",
      "Z5",
      "I4",
      "N5"
    ],
    "difficulty": 4,
    "solutionCount": 1,
    "solutionCountExact": true,
    "searchNodes": 564,
    "initialPlacements": 10,
    "solvableInitialPlacements": 2,
    "randomSuccessRate": 0.006
  },
  {
    "number": 19,
    "title": "四つの長い影",
    "width": 6,
    "height": 6,
    "start": [
      1,
      1
    ],
    "pieces": [
      "W5",
      "Z5",
      "N5",
      "L5"
    ],
    "difficulty": 4,
    "solutionCount": 5,
    "solutionCountExact": true,
    "searchNodes": 2278,
    "initialPlacements": 60,
    "solvableInitialPlacements": 6,
    "randomSuccessRate": 0.002
  },
  {
    "number": 20,
    "title": "最後の一片のために",
    "width": 6,
    "height": 6,
    "start": [
      3,
      3
    ],
    "pieces": [
      "O4",
      "I4",
      "S4",
      "T4",
      "Z5"
    ],
    "difficulty": 4,
    "solutionCount": 2,
    "solutionCountExact": true,
    "searchNodes": 1092,
    "initialPlacements": 62,
    "solvableInitialPlacements": 4,
    "randomSuccessRate": 0
  },
  {
    "number": 21,
    "title": "十字を残すな",
    "width": 7,
    "height": 7,
    "start": [
      1,
      1
    ],
    "pieces": [
      "T4",
      "I4",
      "I5",
      "Z5",
      "Y5",
      "X5"
    ],
    "difficulty": 5,
    "solutionCount": 2,
    "solutionCountExact": true,
    "searchNodes": 7493,
    "initialPlacements": 53,
    "solvableInitialPlacements": 3,
    "randomSuccessRate": 0
  },
  {
    "number": 22,
    "title": "中心からの設計図",
    "width": 7,
    "height": 7,
    "start": [
      3,
      3
    ],
    "pieces": [
      "L4",
      "T5",
      "I5",
      "F5",
      "W5",
      "I4"
    ],
    "difficulty": 5,
    "solutionCount": 2,
    "solutionCountExact": true,
    "searchNodes": 17046,
    "initialPlacements": 126,
    "solvableInitialPlacements": 8,
    "randomSuccessRate": 0
  },
  {
    "number": 23,
    "title": "角から閉じる迷路",
    "width": 7,
    "height": 7,
    "start": [
      0,
      0
    ],
    "pieces": [
      "X5",
      "W5",
      "F5",
      "U5",
      "P5",
      "I4"
    ],
    "difficulty": 5,
    "solutionCount": 2,
    "solutionCountExact": true,
    "searchNodes": 21324,
    "initialPlacements": 16,
    "solvableInitialPlacements": 2,
    "randomSuccessRate": 0
  },
  {
    "number": 24,
    "title": "二つだけの道筋",
    "width": 7,
    "height": 7,
    "start": [
      0,
      0
    ],
    "pieces": [
      "W5",
      "Z5",
      "T5",
      "O4",
      "F5",
      "T4"
    ],
    "difficulty": 5,
    "solutionCount": 2,
    "solutionCountExact": true,
    "searchNodes": 39331,
    "initialPlacements": 11,
    "solvableInitialPlacements": 4,
    "randomSuccessRate": 0
  },
  {
    "number": 25,
    "title": "六片の一意解",
    "width": 7,
    "height": 7,
    "start": [
      1,
      1
    ],
    "pieces": [
      "T5",
      "Y5",
      "N5",
      "U5",
      "F5",
      "L5"
    ],
    "difficulty": 5,
    "solutionCount": 1,
    "solutionCountExact": true,
    "searchNodes": 222846,
    "initialPlacements": 104,
    "solvableInitialPlacements": 2,
    "randomSuccessRate": 0
  }
];
  if(typeof module!=='undefined'&&module.exports)module.exports=puzzles;else root.PUZZLES=puzzles;
})(globalThis);
