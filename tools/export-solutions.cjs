'use strict';
const fs=require('node:fs'),path=require('node:path');
const puzzles=require('../puzzles.js'),verified=require('../analysis/verified.json');
const solutions=Object.fromEntries(puzzles.map(p=>{
 const entry=verified.find(v=>v.number===p.number);
 if(!entry?.witness)throw Error(`Missing solution: ${p.number}`);
 return [p.number,entry.witness.map(({id,cells})=>({id,cells}))];
}));
fs.writeFileSync(path.join(__dirname,'../solutions.js'),`/* Solver witnesses from analysis/verified.json. Regenerate: node tools/export-solutions.cjs */\n(function(root){\n const solutions=${JSON.stringify(solutions)};\n if(typeof module!=='undefined'&&module.exports)module.exports=solutions;else root.SOLUTIONS=solutions;\n})(globalThis);\n`);
