'use strict';
const E=require('../engine.js');
const sides=[[1,0],[-1,0],[0,1],[0,-1]],diagonals=[[1,1],[1,-1],[-1,1],[-1,-1]];
function validate(p){
 if(!Number.isInteger(p.width)||!Number.isInteger(p.height)||p.width<1||p.height<1)throw Error('Invalid board');
 if(!Array.isArray(p.start)||p.start.length!==2||!p.start.every(Number.isInteger)||p.start[0]<0||p.start[1]<0||p.start[0]>=p.width||p.start[1]>=p.height)throw Error('Invalid start');
 if(!p.pieces.length||new Set(p.pieces).size!==p.pieces.length||p.pieces.some(id=>!E.pieces[id]))throw Error('Invalid pieces');
}
function prepare(p){
 validate(p);
 const bit=(x,y)=>1n<<BigInt(y*p.width+x);
 const mask=cells=>cells.reduce((m,[x,y])=>m|bit(x,y),0n);
 let uid=0;
 return p.pieces.map(id=>E.variants(E.pieces[id].cells).flatMap(shape=>{
  const result=[];
  for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++){
   const cells=E.position(shape,x,y);
   if(cells.some(([x,y])=>x<0||y<0||x>=p.width||y>=p.height))continue;
   const neighbours=offsets=>cells.flatMap(([x,y])=>offsets.map(([dx,dy])=>[x+dx,y+dy])).filter(([x,y])=>x>=0&&y>=0&&x<p.width&&y<p.height);
   const occupied=mask(cells);
   result.push({id,uid:uid++,cells,shape,anchor:[x,y],mask:occupied,blocked:occupied|mask(neighbours(sides)),corners:mask(neighbours(diagonals)),start:cells.some(([x,y])=>x===p.start[0]&&y===p.start[1])});
  }return result;
 }));
}
// Only board symmetries that preserve the distinguished start square are equivalent.
function symmetries(p){
 const w=p.width,h=p.height;
 const transforms=[(x,y)=>[x,y],(x,y)=>[w-1-x,y],(x,y)=>[x,h-1-y],(x,y)=>[w-1-x,h-1-y]];
 if(w===h)transforms.push((x,y)=>[y,x],(x,y)=>[w-1-y,x],(x,y)=>[y,h-1-x],(x,y)=>[w-1-y,h-1-x]);
 return transforms.filter(fn=>{const [x,y]=fn(...p.start);return x===p.start[0]&&y===p.start[1];});
}
function arrangementKey(p,placements,transforms=symmetries(p)){
 return transforms.map(fn=>placements.map(t=>`${t.id}:${t.cells.map(c=>{const [x,y]=fn(...c);return y*p.width+x;}).sort((a,b)=>a-b).join(',')}`).sort().join('|')).sort()[0];
}
// A full arrangement is playable iff its corner graph is connected to its start piece.
// A graph traversal supplies a legal placement order, replayed with the actual game checker.
function replay(p,arrangement){
 const pending=[...arrangement],order=[];
 while(pending.length){const i=pending.findIndex(t=>E.check(p,order,t.cells).ok);if(i<0)return null;order.push(pending.splice(i,1)[0]);}
 return order.map(({id,cells,shape,anchor})=>({id,cells,shape,anchor}));
}
function solve(p,options={}){
 const maxNodes=options.maxNodes??2000000,maxSolutions=options.maxSolutions??Infinity;
 const domains=prepare(p),transforms=symmetries(p),keys=new Set();
 const stats={solutionCount:0,rawSolutionCount:0,searchNodes:0,firstSolutionNodes:null,initialPlacements:domains.flat().filter(t=>t.start).length,solvableInitialPlacements:0,testedInitialPlacements:0,deadEnds:0,branchPoints:0,branchChoices:0,maxBranching:0,complete:true,stopReason:null};
 let witness=null,stopped=false;
 const startBit=1n<<BigInt(p.start[1]*p.width+p.start[0]);
 function visit(assigned,remaining,blocked){
  if(stats.searchNodes>=maxNodes){stopped=true;stats.complete=false;stats.stopReason='node-limit';return false;}
  stats.searchNodes++;
  if(!remaining.length){
   const order=replay(p,assigned);if(!order){stats.deadEnds++;return false;}
   stats.rawSolutionCount++;
   keys.add(arrangementKey(p,assigned,transforms));stats.solutionCount=keys.size;
   if(!witness){witness=order;stats.firstSolutionNodes=stats.searchNodes;}
   if(stats.solutionCount>=maxSolutions){stopped=true;stats.complete=false;stats.stopReason='solution-limit';}
   return true;
  }
  let best=null,bestIndex=-1;
  const filtered=[];
  for(let i=0;i<remaining.length;i++){
   const available=remaining[i].filter(t=>(t.mask&blocked)===0n);
   if(!available.length){stats.deadEnds++;return false;}
   filtered.push(available);if(!best||available.length<best.length){best=available;bestIndex=i;}
  }
  // Conservative graph pruning: a piece must be able to reach the start component,
  // even when mutually incompatible candidates are optimistically allowed together.
  let reachable=assigned[0].mask,changed=true;
  const groups=[...assigned.slice(1).map(t=>[t]),...filtered],seen=new Set();
  while(changed){changed=false;for(let i=0;i<groups.length;i++)if(!seen.has(i)&&groups[i].some(t=>(t.corners&reachable)!==0n)){
   seen.add(i);for(const t of groups[i])reachable|=t.mask;changed=true;
  }}
  if(seen.size!==groups.length){stats.deadEnds++;return false;}
  stats.branchChoices+=best.length;stats.maxBranching=Math.max(stats.maxBranching,best.length);if(best.length>1)stats.branchPoints++;
  const rest=filtered.filter((_,i)=>i!==bestIndex);let found=false;
  for(const t of best){found=visit([...assigned,t],rest,blocked|t.blocked)||found;if(stopped)break;}
  return found;
 }
 for(let i=0;i<domains.length&&!stopped;i++)for(const root of domains[i].filter(t=>t.start)){
  const remaining=domains.filter((_,j)=>i!==j).map(d=>d.filter(t=>(t.mask&startBit)===0n));
  const found=visit([root],remaining,root.blocked);
  if(found)stats.solvableInitialPlacements++;if(!stopped)stats.testedInitialPlacements++;
  if(stopped)break;
 }
 return {...stats,witness};
}
// Deterministic random legal playouts estimate how often uninformed play gets stuck.
function randomPlay(p,{trials=200,seed=20261001}={}){
 const domains=prepare(p);let randomState=seed>>>0;
 const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
 let successes=0,totalDepth=0;const stuckAt={};
 for(let i=0;i<trials;i++){
  let occupied=0n,blocked=0n,corners=0n;const used=new Set();
  while(used.size<p.pieces.length){
   const moves=domains.flatMap(d=>used.has(d[0]?.id)?[]:d.filter(t=>(t.mask&blocked)===0n&&(used.size?(t.mask&corners)!==0n:t.start)));
   if(!moves.length)break;
   const t=moves[Math.floor(random()*moves.length)];used.add(t.id);occupied|=t.mask;blocked|=t.blocked;corners|=t.corners;
  }
  totalDepth+=used.size;if(used.size===p.pieces.length)successes++;else stuckAt[used.size]=(stuckAt[used.size]||0)+1;
 }
 return {trials,seed,successes,successRate:successes/trials,meanPlaced:totalDepth/trials,stuckAt};
}
module.exports={prepare,symmetries,arrangementKey,replay,solve,randomPlay};
if(require.main===module){
 const puzzles=require('../puzzles.js');const number=Number(process.argv[2]||1),p=puzzles.find(p=>p.number===number);
 if(!p)throw Error('Unknown puzzle');console.log(JSON.stringify(solve(p),null,2));
}
