const assert=require('node:assert/strict'),E=require('../engine.js'),S=require('../tools/solver.cjs');
// Independent chronological search visits all piece orders and deduplicates completed layouts.
function brute(p){const domains=S.prepare(p),results=new Set();let sequences=0;function search(placed){if(placed.length===p.pieces.length){sequences++;results.add(S.arrangementKey(p,placed));return;}for(const list of domains)if(!placed.some(t=>t.id===list[0]?.id))for(const t of list)if(E.check(p,placed,t.cells).ok)search([...placed,t]);}search([]);return {count:results.size,sequences};}
for(const p of [
 {width:3,height:3,start:[0,0],pieces:['1','2']},
 {width:4,height:4,start:[0,0],pieces:['1','2','L3']},
 {width:4,height:3,start:[1,1],pieces:['L3','2','1']},
 {width:4,height:4,start:[0,1],pieces:['L3','O4']},
 {width:3,height:3,start:[1,1],pieces:['X5','I3']},
 {width:2,height:2,start:[0,0],pieces:['1']},
 {width:4,height:4,start:[0,0],pieces:['I3','L3','2']},
]){const actual=S.solve(p),expected=brute(p);assert.ok(actual.complete);assert.equal(actual.solutionCount,expected.count,JSON.stringify(p));if(actual.witness)assert.ok(S.replay(p,actual.witness));}
// Optimized non-overlap/edge/corner rules agree with the game's checker at every step.
const p={width:5,height:5,start:[2,2],pieces:['F5','L3','2']},domains=S.prepare(p);
for(const a of domains[0])if(a.start)for(const b of domains[1]){
 assert.equal((b.mask&a.blocked)===0n&&(b.mask&a.corners)!==0n,E.check(p,[a],b.cells).ok);
 if(!E.check(p,[a],b.cells).ok)continue;
 for(const c of domains[2])assert.equal((c.mask&(a.blocked|b.blocked))===0n&&(c.mask&(a.corners|b.corners))!==0n,E.check(p,[a,b],c.cells).ok);
}
const cutoff=S.solve({width:5,height:5,start:[0,0],pieces:['1','2','L3']},{maxNodes:1});assert.equal(cutoff.complete,false);assert.equal(cutoff.stopReason,'node-limit');
console.log('PASS: exact counts match all-order brute force, start-preserving symmetries, no-solution cases, optimized checks match engine, bounded search is explicit.');
