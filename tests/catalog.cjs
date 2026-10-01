'use strict';
const assert=require('node:assert/strict'),S=require('../tools/solver.cjs'),puzzles=require('../puzzles.js'),verified=require('../analysis/verified.json');
const originals=[
 {number:1,title:'角で、こんにちは',width:5,height:5,start:[0,0],pieces:['1','2','L3']},
 {number:2,title:'向きを変えてみよう',width:6,height:6,start:[0,0],pieces:['L3','I3','O4','1']},
 {number:3,title:'四角とジグザグ',width:7,height:7,start:[0,0],pieces:['O4','S4','T4','2','L3']},
 {number:4,title:'5マスのピースに挑戦',width:8,height:8,start:[0,0],pieces:['P5','L5','T5','I3','2']},
 {number:5,title:'真ん中から広げよう',width:8,height:8,start:[3,3],pieces:['F5','U5','W5','L4','1','2']},
];
assert.deepEqual(puzzles.slice(0,5).map(({number,title,width,height,start,pieces})=>({number,title,width,height,start,pieces})),originals);
assert.equal(puzzles.length,25);assert.equal(new Set(puzzles.map(p=>p.number)).size,25);
assert.equal(new Set(puzzles.slice(5).map(p=>[...p.pieces].sort().join(','))).size,20);
for(const p of puzzles){
 assert.equal(p.difficulty,Math.ceil(p.number/5));
 const r=S.solve(p,{maxNodes:3000000,maxSolutions:p.number<=5?10000:Infinity});
 assert.ok(r.witness);assert.equal(r.solutionCount,p.solutionCount);assert.equal(r.searchNodes,p.searchNodes);assert.equal(r.complete,p.solutionCountExact);
 assert.equal(r.rawSolutionCount,verified.find(v=>v.number===p.number).metrics.rawSolutionCount);
 if(p.number>5)assert.ok(r.complete);
 if(p.number>=21)assert.ok(r.solutionCount<=2);
}
assert.deepEqual(puzzles.filter(p=>p.solutionCountExact&&p.solutionCount===1).map(p=>p.number),[15,18,25]);
const allOrder=S.solve({width:5,height:5,start:[0,0],pieces:['X5','1']});assert.ok(allOrder.witness);assert.equal(allOrder.witness[0].id,'1','solver must not force puzzle list order');
console.log('PASS: original five unchanged, 20 distinct piece sets, 25 reproducible solution/node counts, capped counts flagged, all new counts exact, unique problems 15/18/25, all piece orders supported.');
