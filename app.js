'use strict';
const E=PuzzleEngine,$=id=>document.getElementById(id);
const palette=['#4a8b79','#d28d48','#638ec2','#ae749e','#8c9950','#bf7263','#7586ae'];
let puzzleIndex=0,placed=[],history=[],selected=null,shape=null,selectedPlaced=null;
const puzzle=()=>PUZZLES[puzzleIndex];
const color=id=>palette[puzzle().pieces.indexOf(id)%palette.length];
function say(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
function remember(){history.push(placed.map(p=>({...p,cells:p.cells.map(c=>[...c])})));}
function start(index){puzzleIndex=index;placed=[];history=[];selected=null;shape=null;selectedPlaced=null;$('problem').value=String(index);render();say('未使用ピースから1つ選びましょう。');}
function selectPiece(id){selected=id;shape=E.pieces[id].cells.map(c=>[...c]);selectedPlaced=null;render();say('● のマスを目印に、盤面の緑の点をタップして置きましょう。');}
function miniature(cells){
 const mini=document.createElement('span');mini.className='mini';mini.setAttribute('aria-hidden','true');
 mini.style.setProperty('--w',Math.max(...cells.map(c=>c[0]))+1);mini.style.setProperty('--h',Math.max(...cells.map(c=>c[1]))+1);
 cells.forEach(([x,y],i)=>{const c=document.createElement('span');c.className='mini-cell';c.style.gridColumn=x+1;c.style.gridRow=y+1;c.textContent=i===0?'●':'';mini.append(c);});return mini;
}
function render(){
 const p=puzzle(),complete=placed.length===p.pieces.length;
 $('problem-title').textContent=p.title;
 $('difficulty').textContent='★'.repeat(p.difficulty);
 $('difficulty').setAttribute('aria-label',`難易度 ${p.difficulty} / 5`);$('progress').textContent=`${placed.length} / ${p.pieces.length} 配置`;
 $('remaining').textContent=`あと ${p.pieces.length-placed.length} 個`;
 const board=$('board');board.replaceChildren();board.style.setProperty('--columns',p.width);
 const occupied=new Map(placed.flatMap(piece=>piece.cells.map(([x,y])=>[`${x},${y}`,piece.id])));
 for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++){
  const cell=document.createElement('button');cell.type='button';cell.className='cell';cell.dataset.x=x;cell.dataset.y=y;
  const id=occupied.get(`${x},${y}`),isStart=x===p.start[0]&&y===p.start[1];
  if(isStart){cell.classList.add('start');cell.textContent='★';}
  if(id){cell.classList.add('occupied');cell.style.setProperty('--piece-color',color(id));if(id===selectedPlaced)cell.classList.add('chosen');}
  const valid=selected&&E.check(p,placed,E.position(shape,x,y)).ok;
  if(valid)cell.classList.add('legal');
  cell.setAttribute('aria-label',`${y+1}行 ${x+1}列${isStart?' スタート':''}${id?` 配置済み ${id}`:valid?' 配置できます':''}`);
  cell.addEventListener('click',()=>activate(x,y,id));
  cell.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')preview(x,y);});
  cell.addEventListener('focus',()=>preview(x,y));
  board.append(cell);
 }
 $('pieces').replaceChildren();
 for(const id of p.pieces.filter(id=>!placed.some(t=>t.id===id))){
  const button=document.createElement('button');button.className='piece';button.style.setProperty('--piece-color',color(id));button.setAttribute('aria-pressed',String(id===selected));
  button.setAttribute('aria-label',`${id}、${E.pieces[id].cells.length}マスのピース`);
  button.append(miniature(id===selected?shape:E.pieces[id].cells));const label=document.createElement('span');label.className='piece-name';label.textContent=`${id} · ${E.pieces[id].cells.length}マス`;button.append(label);button.onclick=()=>selectPiece(id);$('pieces').append(button);
 }
 for(const id of ['left','right','flip'])$(id).disabled=!selected;
 $('remove').disabled=!selectedPlaced;$('undo').disabled=!history.length;$('restart').disabled=!placed.length;
 $('clear').hidden=!complete;$('next').hidden=puzzleIndex===PUZZLES.length-1;$('last').hidden=puzzleIndex!==PUZZLES.length-1;
}
function clearPreview(){document.querySelectorAll('.preview-ok,.preview-no').forEach(c=>c.classList.remove('preview-ok','preview-no'));}
function preview(x,y){clearPreview();if(!selected)return;const cells=E.position(shape,x,y),valid=E.check(puzzle(),placed,cells).ok;
 for(const [cx,cy] of cells){const cell=$('board').querySelector(`[data-x="${cx}"][data-y="${cy}"]`);if(cell)cell.classList.add(valid?'preview-ok':'preview-no');}
}
function activate(x,y,occupiedId){
 if(occupiedId){selected=null;shape=null;selectedPlaced=occupiedId;render();say('「選択した配置を取り消す」で戻せます。つながりが切れるピースも戻ります。');return;}
 if(!selected){selectedPlaced=null;render();say('未使用ピースから1つ選びましょう。');return;}
 const cells=E.position(shape,x,y),result=E.check(puzzle(),placed,cells);
 if(!result.ok){say(result.reason,true);preview(x,y);return;}
 remember();placed.push({id:selected,cells});selected=null;shape=null;selectedPlaced=null;render();
 say(placed.length===puzzle().pieces.length?'クリア！ すべてのピースを正しく置けました。':'置けました。次のピースを選びましょう。');
}
function orient(fn){if(!selected)return;shape=fn(shape);render();say('向きを変えました。● の位置を確認して置きましょう。');}
$('left').onclick=()=>orient(c=>E.rotate(c,-1));$('right').onclick=()=>orient(E.rotate);$('flip').onclick=()=>orient(E.flip);
$('remove').onclick=()=>{if(!selectedPlaced)return;remember();const before=placed.length;placed=E.remove(puzzle(),placed,selectedPlaced);selectedPlaced=null;render();say(`${before-placed.length}個のピースを未使用に戻しました。`);};
$('undo').onclick=()=>{if(!history.length)return;placed=history.pop();selected=null;shape=null;selectedPlaced=null;render();say('1手戻しました。');};
$('restart').onclick=()=>{if(placed.length&&confirm('この問題を最初からやり直しますか？'))start(puzzleIndex);};
$('next').onclick=()=>{if(placed.length===puzzle().pieces.length&&puzzleIndex+1<PUZZLES.length)start(puzzleIndex+1);};
PUZZLES.forEach((p,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`問題 ${p.number} ${'★'.repeat(p.difficulty)}`;$('problem').append(option);});
$('problem').onchange=event=>{const index=Number(event.target.value);if(placed.length&&placed.length!==puzzle().pieces.length&&!confirm('配置をリセットして、別の問題へ進みますか？')){$('problem').value=puzzleIndex;return;}start(index);};
$('board').addEventListener('pointerleave',clearPreview);
start(0);
