const {installAccessProbe,assertAccess}=require('./access-probe.cjs');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {solutions}=require('./rules.cjs');
const E=require('../engine.js');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/^https?:/,r=>{requests.push(r.request().url());return r.abort();});
 await installAccessProbe(page);
 await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
 const tap=async(x,y)=>page.locator(`.cell[data-x="${x}"][data-y="${y}"]`).tap();
 assert.equal(await page.locator('#left').isDisabled(),true);
 await page.getByRole('button',{name:'1、1マスのピース',exact:true}).tap();
 assert.equal(await page.locator('.cell.legal').count(),1);
 await tap(4,4);assert.equal(await page.evaluate(()=>placed.length),0);assert.ok((await page.locator('#message').textContent()).includes('スタート'));
 await tap(0,0);
 await page.getByRole('button',{name:'2、2マスのピース',exact:true}).tap();
 await tap(1,0);assert.equal(await page.evaluate(()=>placed.length),1);
 await tap(1,1);assert.equal(await page.evaluate(()=>placed.length),2);
 await tap(0,0);await page.locator('#remove').tap();assert.equal(await page.evaluate(()=>placed.length),0);
 await page.locator('#undo').tap();assert.equal(await page.evaluate(()=>placed.length),2);
 page.once('dialog',d=>d.accept());await page.locator('#restart').tap();assert.equal(await page.evaluate(()=>placed.length),0);
 for(let index=0;index<solutions.length;index++){
  assert.equal(await page.locator('#difficulty').textContent(),'★'.repeat(Math.ceil((index+1)/5)));
  for(const step of solutions[index]){
   await page.getByRole('button',{name:`${step.id}、${step.cells.length}マスのピース`,exact:true}).tap();
   let local=E.pieces[step.id].cells,found=false;
   for(let f=0;f<2&&!found;f++){
    for(let r=0;r<4;r++){
     if(E.key(local)===E.key(step.shape)){found=true;break;}
     await page.locator('#right').tap();local=E.rotate(local);
    }
    if(!found){await page.locator('#flip').tap();local=E.flip(local);}
   }
   assert.ok(found);await tap(...step.anchor);
  }
  assert.equal(await page.locator('#clear').isVisible(),true);
  assert.equal(await page.evaluate(()=>placed.length===puzzle().pieces.length),true);
  if(index===0){await page.locator('#undo').tap();assert.equal(await page.locator('#clear').isVisible(),false);const last=solutions[index].at(-1);await page.getByRole('button',{name:`${last.id}、${last.cells.length}マスのピース`,exact:true}).tap();
   let orientation=E.pieces[last.id].cells;let matched=false;
   for(let f=0;f<2&&!matched;f++){for(let r=0;r<4;r++){if(E.key(orientation)===E.key(last.shape)){matched=true;break;}await page.locator('#right').tap();orientation=E.rotate(orientation);}if(!matched){await page.locator('#flip').tap();orientation=E.flip(orientation);}}
   assert.ok(matched);await tap(...last.anchor);
  }
  if(index<solutions.length-1)await page.locator('#next').tap();
 }
 assert.equal(await page.locator('#next').isVisible(),false);
 assert.equal(await page.locator('#last').isVisible(),true);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'/private/tmp/blokus-mobile.png',fullPage:true});
 await page.selectOption('#problem','2');
 await page.setViewportSize({width:1280,height:1000});await page.getByRole('button',{name:'O4、4マスのピース',exact:true}).click();
 await page.locator('.cell[data-x="0"][data-y="0"]').hover();
 await page.locator('#left').click();await page.locator('#right').click();
 await page.screenshot({path:'/private/tmp/blokus-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);await assertAccess(page,requests,1);
 console.log('PASS: tap placement, invalid placement blocked, legal indicators, rotate/flip controls, removal and undo, reset, all 25 clears and difficulty stars, next/last, mobile layout, one access request despite all in-app actions, failure isolation.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
