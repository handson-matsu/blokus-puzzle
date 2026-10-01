const assert=require('node:assert/strict');
const E=require('../engine.js'),puzzles=require('../puzzles.js');
const canonical=c=>E.variants(c).map(E.key).sort()[0];
const pieces=Object.values(E.pieces);
assert.equal(pieces.length,21);
assert.deepEqual([1,2,3,4,5].map(n=>pieces.filter(p=>p.cells.length===n).length),[1,1,2,5,12]);
assert.equal(new Set(pieces.map(p=>canonical(p.cells))).size,21);
// Independently grow all free polyominoes up to order five to verify completeness.
let generated=new Map([[canonical([[0,0]]),[[0,0]]]]);
for(let n=1;n<=5;n++){
 assert.deepEqual(new Set(pieces.filter(p=>p.cells.length===n).map(p=>canonical(p.cells))),new Set(generated.keys()));
 const next=new Map();for(const shape of generated.values())for(const [x,y] of shape)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const cell=[x+dx,y+dy];if(shape.some(c=>c[0]===cell[0]&&c[1]===cell[1]))continue;
  const grown=E.normalize([...shape,cell]);next.set(canonical(grown),grown);
 }generated=next;
}
for(const p of pieces){
 let shape=p.cells;for(let i=0;i<4;i++)shape=E.rotate(shape);
 assert.deepEqual(shape,p.cells);assert.deepEqual(E.flip(E.flip(p.cells)),p.cells);
 assert.deepEqual(E.rotate(E.rotate(p.cells),-1),p.cells);
}
const p={width:5,height:5,start:[0,0]},a=[{id:'a',cells:[[0,0]]}];
assert.ok(E.check(p,[],[[0,0]]).ok);assert.ok(!E.check(p,[],[[1,1]]).ok);
assert.ok(!E.check(p,a,[[0,0]]).ok);assert.ok(!E.check(p,a,[[1,0]]).ok);assert.ok(!E.check(p,a,[[0,1]]).ok);
assert.ok(E.check(p,a,[[1,1]]).ok);assert.ok(!E.check(p,a,[[2,2]]).ok);
assert.ok(!E.check(p,a,[[-1,1]]).ok);assert.ok(!E.check(p,a,[[5,4]]).ok);
// A corner contact cannot override a forbidden edge contact.
assert.ok(!E.check(p,a,[[1,0],[1,1]]).ok);
assert.ok(E.check(p,[],[[0,0],[1,0],[2,0]]).ok,'edges within one piece are allowed');
const chain=[...a,{id:'b',cells:[[1,1]]},{id:'c',cells:[[2,2]]}];
assert.deepEqual(E.remove(p,chain,'b'),a);assert.deepEqual(E.remove(p,chain,'a'),[]);
const branch=[...a,{id:'b',cells:[[1,1]]},{id:'c',cells:[[2,0]]},{id:'d',cells:[[3,1]]},{id:'e',cells:[[2,2]]}];
assert.deepEqual(E.remove(p,branch,'c').map(p=>p.id),['a','b','d','e']);
const verified=require('../analysis/verified.json');
const solutions=puzzles.map(p=>{
 assert.equal(new Set(p.pieces).size,p.pieces.length);
 const answer=verified.find(r=>r.number===p.number)?.witness;
 assert.ok(answer,`Puzzle ${p.number} has a solver witness`);
 const placed=[];
 for(const step of answer){
  assert.ok(p.pieces.includes(step.id));assert.ok(!placed.some(t=>t.id===step.id));
  assert.ok(E.variants(E.pieces[step.id].cells).some(shape=>E.key(shape)===E.key(step.cells)));
  assert.deepEqual(E.position(step.shape,...step.anchor),step.cells);
  assert.ok(E.check(p,placed,step.cells).ok,`Puzzle ${p.number}: invalid step ${step.id}`);placed.push(step);
 }
 assert.equal(placed.length,p.pieces.length);return answer;
});
if(require.main===module)console.log('PASS: all 21 free polyominoes, transformations, bounds, overlaps, edges/corners, removal connectivity, all 25 solver witnesses replay successfully.');
module.exports={solutions};
