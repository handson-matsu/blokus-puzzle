'use strict';
const fs=require('node:fs'),path=require('node:path'),E=require('../engine.js'),S=require('./solver.cjs');
const out=path.join(__dirname,'../analysis/candidates.jsonl');
let seed=20261001;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const pick=a=>a[Math.floor(random()*a.length)];
const all=Object.keys(E.pieces),large=all.filter(id=>E.pieces[id].cells.length>=4),pent=large.filter(id=>E.pieces[id].cells.length===5);
const configurations=[{size:5,count:3,pool:all},{size:5,count:3,pool:pent},{size:5,count:4,pool:all},{size:6,count:4,pool:large},{size:6,count:4,pool:pent},{size:6,count:5,pool:large},{size:7,count:5,pool:pent},{size:7,count:6,pool:large}];
const seen=new Set();fs.writeFileSync(out,'');
const total=Number(process.argv[2]||240);let accepted=0;
for(let i=0;i<total;i++){
 const cfg=configurations[i%configurations.length],pieces=[];while(pieces.length<cfg.count){const id=pick(cfg.pool);if(!pieces.includes(id))pieces.push(id);}
 const start=pick([[0,0],[0,1],[1,1],[Math.floor(cfg.size/2),Math.floor(cfg.size/2)]]);
 const p={width:cfg.size,height:cfg.size,start,pieces};
 const key=JSON.stringify([cfg.size,start,[...pieces].sort()]);if(seen.has(key)){i--;continue;}seen.add(key);
 const result=S.solve(p,{maxNodes:40000,maxSolutions:151});
 const playout=result.witness?S.randomPlay(p,{trials:120}):null;
 fs.appendFileSync(out,JSON.stringify({candidate:i+1,puzzle:p,...result,playout})+'\n');
 if(result.witness)accepted++;
 if((i+1)%20===0)console.log(`${i+1}/${total}: solvable=${accepted}`);
}
