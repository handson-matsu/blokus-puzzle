'use strict';
// Human-reviewed selection: diversity of shapes, start locations, root traps,
// exact solution scarcity, and seeded random-play success; not piece count alone.
const fs=require('node:fs'),path=require('node:path'),S=require('./solver.cjs');
const base=path.join(__dirname,'..');
const candidates=fs.readFileSync(path.join(base,'analysis/candidates.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const practice=require('../puzzles.js').slice(0,5).map(({number,title,width,height,start,pieces})=>({number,title,width,height,start,pieces}));
const selection=[
 [124,'四角からジグザグへ','棒・四角・階段を組み合わせる。初手はすべて救済可能だが、その後の選択に失敗がある。'],
 [41,'斜めのすき間','3個でもSとNの折れ方を見分ける。内側のスタートから方向を選ぶ。'],
 [235,'長い腕、短い腕','大小のLと棒を使う。角スタートで短いピースを置く順番を考える。'],
 [33,'四角と二つの分かれ道','回転しても同じ四角とT・Zを組み合わせる。辺上のスタートから広げる。'],
 [139,'小さな一歩の行き先','1マスの置き場所とFの凹みが焦点。中央スタートで進む方向が増える。'],
 [65,'中央の折り返し','3個でも中央開始の初手の多くが行き止まり。P・L・Sを回して組み合わせる。'],
 [131,'十字のための空間','回転しても同じXに必要な空間を、1・2マスのピースと長いLで確保する。'],
 [60,'二本の棒の居場所','4・5マスの直線とY・Sの混在。長い直線を置く方向で選択肢が狭まる。'],
 [18,'くぼみの向こうへ','F・U・Lの3個だけで構成。辺上スタートとUのくぼみの向きが制約になる。'],
 [98,'三つで一意','5×5の中央開始、L・T・Yの3個。少数ピースでも対称性を除き一意になる。'],
 [76,'四つの折れ曲がり','Y・V・N・Tの4種。角から伸ばすだけでは最後のピースが残りやすい。'],
 [123,'十字と階段のすき間','5×5でL3・X5・S4・I3。小さな盤面の2解で、内側スタートの初手を絞る。'],
 [524,'折り返しの一本道','W・Z・I4・N。角開始の一意解で、折れ曲がり方の違いを読む。'],
 [149,'四つの長い影','W・Z・N・Lの5マス4個。内側スタートで、配置の多くが3個目の後に詰まる。'],
 [478,'最後の一片のために','四連4種とZ5。6×6で2解しかなく、初手62通り中4通りだけが解に続く。'],
 [512,'十字を残すな','棒2種とT4・Z5・Y5・X5。6個の2解で、内側スタートの選択を迫る。'],
 [144,'中心からの設計図','中央スタートと棒2種・L4・T5・F5・W5。盤全体の広げ方を先に考える。'],
 [208,'角から閉じる迷路','角開始でX・W・F・U・Pの5マス5種とI4。合法な初手16通り中2通りが生き残る。'],
 [952,'二つだけの道筋','角開始でW・Z・T5・O4・F5・T4。棒に頼れない構成を2解に絞る。'],
 [664,'六片の一意解','5マス6種のみ。7×7内側スタート、104初手中2通り、対称性を除き一意。'],
];
const inputs=[...practice.map(p=>({p,candidate:null,review:'既存の練習問題を変更せず維持。'})),...selection.map(([id,title,review],i)=>({p:{number:i+6,title,...candidates.find(c=>c.candidate===id).puzzle},candidate:id,review}))];
const records=[],catalog=[];
for(const {p,candidate,review} of inputs){
 const result=S.solve(p,{maxNodes:3000000,maxSolutions:p.number<=5?10000:Infinity});
 if(!result.witness||p.number>5&&!result.complete)throw Error(`Unverified problem ${p.number}`);
 const difficulty=p.number<=5?1:Math.ceil(p.number/5),playout=S.randomPlay(p,{trials:2000});
 const {witness,...stats}=result;
 const metrics={...stats,solutionCountExact:result.complete,solutionEquivalence:'piece-labelled arrangements modulo board symmetries preserving start',playout};
 const data={...p,difficulty,solutionCount:result.solutionCount,solutionCountExact:result.complete,searchNodes:result.searchNodes,initialPlacements:result.initialPlacements,solvableInitialPlacements:result.complete?result.solvableInitialPlacements:null,randomSuccessRate:playout.successRate};
 catalog.push(data);records.push({number:p.number,candidate,review,puzzle:data,metrics,witness});
 console.log(p.number,result.solutionCount,result.complete,result.searchNodes,playout.successes);
}
fs.writeFileSync(path.join(base,'puzzles.js'),`/* Verified with tools/solver.cjs. Regenerate metrics with tools/curate.cjs. */\n(function(root){\n  const puzzles = ${JSON.stringify(catalog,null,2)};\n  if(typeof module!=='undefined'&&module.exports)module.exports=puzzles;else root.PUZZLES=puzzles;\n})(globalThis);\n`);
fs.writeFileSync(path.join(base,'analysis/verified.json'),JSON.stringify(records,null,2)+'\n');
const labels=['','練習','初級','中級','上級','難問'];
let report='# 問題の検証・難易度評価\n\n1,000候補から、形状・開始位置・数値を比較して20問を選定しました。練習1〜5の盤面・開始位置・ピース・タイトルは保持しています。\n\n';
report+='## 解の数え方と指標\n\n- 解数は配置順序を区別せず、ピースIDごとの最終配置で数えます。スタートマスを同じ位置に保つ盤面全体の回転・鏡映は同一解です。平行移動やスタートを移す対称変換は同一視しません。\n- 問題6〜25は全探索完了の確定値です。練習3〜5は10,000解に達した時点で打ち切った下限です。未探索分を含む総数や一意性は断定しません。\n- ノード数は、下記CSPソルバーが訪問した部分配置（失敗・完成を含む）の数です。人間の手数ではなく、ピース順と探索戦略に依存します。\n- 「有効初手」はその時点で合法な全配置、「解につながる初手」は全ピースを置ける完成形が存在する初手です。\n- 無作為成功率は、各手で合法なピース配置を一様に1つ選ぶ2,000試行の結果です。seed=20261001。人間のクリア率ではありません。0%も解がない意味ではありません。\n- starsは評価指標と構成のレビューから設定した段階です。同じ段階の個人差や好みまでは保証しません。\n\n';
report+='| 問題 | 難易度 | 盤面 | 個数 | 解数 | 探索ノード | 最初の解まで | 解につながる初手 / 有効初手 | 無作為成功 |\n|---|---|---|---:|---:|---:|---:|---:|---:|\n';
for(const r of records){const p=r.puzzle,m=r.metrics;report+=`| ${p.number} | ${'★'.repeat(p.difficulty)} ${labels[p.difficulty]} | ${p.width}×${p.height} | ${p.pieces.length} | ${m.complete?'':'≥'}${m.solutionCount.toLocaleString('en-US')} | ${m.searchNodes.toLocaleString('en-US')} | ${m.firstSolutionNodes.toLocaleString('en-US')} | ${m.complete?m.solvableInitialPlacements:'未確定'} / ${m.initialPlacements} | ${m.playout.successes}/2000 |\n`;}
report+='\n## 選定レビュー\n\n';for(const r of records.filter(r=>r.number>5))report+=`- 問題${r.number}（候補${r.candidate}、${r.puzzle.pieces.join(' / ')}）：${r.review}\n`;
report+='\n## 探索方式\n\n回転・反転はゲームの engine.js の variants で重複を除きます。盤内の全配置を列挙し、スタートを覆うピースを全種類・全向き・全位置で試します。残りは候補が最少のピースから割り当てるCSP探索で、重複と異なるピース間の辺接触をビットマスクで排除します。配置順序を探索しないため、途中の仮配置は角でつながっていなくても保持します。完成形の角接触グラフがスタートから連結であることを確認し、ゲーム本体の check を使って合法な配置順を復元・再検証します。この連結条件は「最初はスタート、以後は既存ピースに角接触」の配置順が存在することと同値です。\n\n途中の到達可能性枝刈りは、未配置ピースの全候補を併合する楽観的判定です。完成しうる配置を除外しません。小盤面の全配置順探索との解数一致、ゲーム判定とビットマスク判定の一致を tests/solver.cjs で確認します。\n\nanalysis/verified.json に全25問の合法な解手順、分岐数、行き止まり数、初手数、無作為試行結果を保存しています。解や解析情報はUIでは表示しません。ソルバーは開発用Node.jsツールで、ゲーム起動時には動きません。\n\n## 再現\n\n```sh\nnode tests/solver.cjs\nnode tools/generate.cjs 1000\nnode tools/curate.cjs\nnode tools/solver.cjs 25\n```\n\n標準実行の探索上限は2,000,000ノードです。採用評価は3,000,000ノードを上限とし、上限到達で解未発見の場合は「解なし」とせず未確定と扱います。候補生成時は40,000ノード・151解で打ち切ります。採用問題はその後に別途全探索しています。\n';
fs.writeFileSync(path.join(base,'analysis/REPORT.md'),report);
const columns=['candidate','size','start','pieces','solutionCount','complete','searchNodes','firstSolutionNodes','initialPlacements','solvableInitialPlacements','randomSuccesses','randomTrials'];
const csv=[columns.join(','),...candidates.map(c=>[c.candidate,c.puzzle.width,c.puzzle.start.join(':'),c.puzzle.pieces.join(' '),c.solutionCount,c.complete,c.searchNodes,c.firstSolutionNodes,c.initialPlacements,c.solvableInitialPlacements,c.playout?.successes??'',c.playout?.trials??''].join(','))].join('\n');
fs.writeFileSync(path.join(base,'analysis/candidates.csv'),csv+'\n');
