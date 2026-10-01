/* Pure puzzle rules. Also loadable by Node.js for verification. */
(function(root) {
  'use strict';
  const normalize = cells => {
    const minX = Math.min(...cells.map(c=>c[0])), minY = Math.min(...cells.map(c=>c[1]));
    return cells.map(([x,y])=>[x-minX,y-minY]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
  };
  const rotate = (cells, direction=1) => normalize(cells.map(([x,y])=>direction===1?[-y,x]:[y,-x]));
  const flip = cells => normalize(cells.map(([x,y])=>[-x,y]));
  const key = cells => JSON.stringify(normalize(cells));
  const variants = cells => {
    const result = new Map();
    for (const base of [cells,flip(cells)]) {
      let shape=base;
      for(let i=0;i<4;i++){result.set(key(shape),normalize(shape));shape=rotate(shape);}
    }
    return [...result.values()];
  };
  const definitions = {
    '1': [[0,0]], '2': [[0,0],[1,0]],
    'I3': [[0,0],[1,0],[2,0]], 'L3': [[0,0],[0,1],[1,1]],
    'I4': [[0,0],[1,0],[2,0],[3,0]], 'O4': [[0,0],[1,0],[0,1],[1,1]],
    'T4': [[0,0],[1,0],[2,0],[1,1]], 'L4': [[0,0],[0,1],[0,2],[1,2]],
    'S4': [[1,0],[2,0],[0,1],[1,1]],
    'F5': [[1,0],[2,0],[0,1],[1,1],[1,2]], 'I5': [[0,0],[1,0],[2,0],[3,0],[4,0]],
    'L5': [[0,0],[0,1],[0,2],[0,3],[1,3]], 'P5': [[0,0],[1,0],[0,1],[1,1],[0,2]],
    'N5': [[0,0],[0,1],[1,1],[1,2],[1,3]], 'T5': [[0,0],[1,0],[2,0],[1,1],[1,2]],
    'U5': [[0,0],[2,0],[0,1],[1,1],[2,1]], 'V5': [[0,0],[0,1],[0,2],[1,2],[2,2]],
    'W5': [[0,0],[0,1],[1,1],[1,2],[2,2]], 'X5': [[1,0],[0,1],[1,1],[2,1],[1,2]],
    'Y5': [[0,0],[0,1],[1,1],[0,2],[0,3]], 'Z5': [[0,0],[1,0],[1,1],[1,2],[2,2]],
  };
  const pieces = Object.fromEntries(Object.entries(definitions).map(([id,cells])=>[id,{id,cells:normalize(cells)}]));
  const position = (shape,x,y) => shape.map(([cx,cy])=>[cx-shape[0][0]+x,cy-shape[0][1]+y]);
  const cellKey = (x,y) => `${x},${y}`;
  const edges = [[1,0],[-1,0],[0,1],[0,-1]], corners = [[1,1],[1,-1],[-1,1],[-1,-1]];
  function check(puzzle,placed,cells) {
    if(cells.some(([x,y])=>x<0||y<0||x>=puzzle.width||y>=puzzle.height)) return {ok:false,reason:'盤面からはみ出しています。'};
    const occupied=new Set(placed.flatMap(p=>p.cells.map(([x,y])=>cellKey(x,y))));
    if(cells.some(([x,y])=>occupied.has(cellKey(x,y)))) return {ok:false,reason:'ほかのピースと重なっています。'};
    if(cells.some(([x,y])=>edges.some(([dx,dy])=>occupied.has(cellKey(x+dx,y+dy))))) return {ok:false,reason:'ほかのピースと辺が接しています。角だけでつなげましょう。'};
    if(!placed.length) return cells.some(([x,y])=>x===puzzle.start[0]&&y===puzzle.start[1])?{ok:true}:{ok:false,reason:'最初のピースは ★ のスタートマスを含めてください。'};
    if(!cells.some(([x,y])=>corners.some(([dx,dy])=>occupied.has(cellKey(x+dx,y+dy))))) return {ok:false,reason:'配置済みのピースと、少なくとも1か所で角をつなげてください。'};
    return {ok:true};
  }
  // Keep only the corner-connected component containing the start square.
  function remove(puzzle,placed,id) {
    const remaining=placed.filter(p=>p.id!==id);
    const first=remaining.find(p=>p.cells.some(([x,y])=>x===puzzle.start[0]&&y===puzzle.start[1]));
    if(!first)return [];
    const reached=new Set([first.id]);let changed=true;
    while(changed){changed=false;
      const cells=new Set(remaining.filter(p=>reached.has(p.id)).flatMap(p=>p.cells.map(([x,y])=>cellKey(x,y))));
      for(const p of remaining)if(!reached.has(p.id)&&p.cells.some(([x,y])=>corners.some(([dx,dy])=>cells.has(cellKey(x+dx,y+dy))))){reached.add(p.id);changed=true;}
    }
    return remaining.filter(p=>reached.has(p.id));
  }
  const api={pieces,normalize,rotate,flip,key,variants,position,check,remove};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PuzzleEngine=api;
})(globalThis);
