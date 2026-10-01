'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js');
const puzzles=require('../puzzles.js'),solutions=require('../solutions.js'),verified=require('../analysis/verified.json');
assert.equal(puzzles.length,25);assert.equal(Object.keys(solutions).length,25);
for(const p of puzzles){
 const answer=solutions[p.number];
 assert.deepEqual(answer,verified.find(v=>v.number===p.number).witness.map(({id,cells})=>({id,cells})));
 assert.deepEqual(answer.map(t=>t.id).sort(),[...p.pieces].sort());
 const placed=[];
 for(const step of answer){
  assert.ok(step.cells.every(c=>c.length===2&&c.every(Number.isInteger)));
  assert.equal(new Set(step.cells.map(c=>c.join(','))).size,step.cells.length);
  assert.ok(E.variants(E.pieces[step.id].cells).some(v=>E.key(v)===E.key(step.cells)),`Problem ${p.number}: shape`);
  assert.ok(E.check(p,placed,step.cells).ok,`Problem ${p.number}: illegal placement ${step.id}`);
  placed.push(step);
 }
}
console.log('PASS: all 25 answers match solver witnesses, use exactly the required pieces, have valid shapes, and replay legally under current game rules.');
