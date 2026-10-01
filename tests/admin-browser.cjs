'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url'),path=require('node:path');
const solutions=require('../solutions.js');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 for(const mobile of [true,false]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:1000},isMobile:mobile,hasTouch:mobile});
  const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https?:/,r=>{requests.push(r.request().url());return r.abort();});
  await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
  const press=async selector=>{await page.locator(selector)[mobile?'tap':'click']();};
  const toggle=async()=>{for(let i=0;i<5;i++)await press('#game-title');};
  const state=()=>page.evaluate(()=>JSON.stringify({puzzleIndex,placed,history,selected,shape,selectedPlaced,message:$('message').textContent,error:$('message').classList.contains('error')}));
  assert.equal(await page.locator('#admin-tools').isVisible(),false);
  for(let i=0;i<4;i++)await press('#game-title');
  assert.equal(await page.locator('#admin-tools').isVisible(),false);
  await page.waitForTimeout(2100);await press('#game-title');
  assert.equal(await page.locator('#admin-tools').isVisible(),false);
  await page.waitForTimeout(2100);await toggle();
  assert.equal(await page.locator('#show-answer').isVisible(),true);
  await page.getByRole('button',{name:'1、1マスのピース',exact:true})[mobile?'tap':'click']();
  await press('.cell[data-x="0"][data-y="0"]');
  await page.getByRole('button',{name:'2、2マスのピース',exact:true})[mobile?'tap':'click']();
  await press('#right');
  let before=await state();await press('#show-answer');
  for(const id of ['problem','left','right','flip','remove','undo','restart'])assert.equal(await page.locator('#'+id).isDisabled(),true);
  assert.equal(await page.locator('#clear').isVisible(),false);
  await press('#close-answer');assert.equal(await state(),before);
  await press('#show-answer');await toggle();assert.equal(await state(),before);
  assert.equal(await page.locator('#admin-tools').isVisible(),false);
  await press('#undo');assert.equal(await page.evaluate(()=>placed.length),0);
  await toggle();
  for(let i=0;i<25;i++){
   await page.selectOption('#problem',String(i));before=await state();await press('#show-answer');
   const actual=await page.locator('.cell.occupied').evaluateAll(cells=>cells.map(c=>[Number(c.dataset.x),Number(c.dataset.y),c.getAttribute('aria-label').split(' 配置済み ')[1]]).sort());
   const expected=solutions[i+1].flatMap(p=>p.cells.map(([x,y])=>[x,y,p.id])).sort();
   assert.deepEqual(actual,expected);assert.equal(await page.locator('.cell.legal').count(),0);
   assert.equal(await page.locator('#clear').isVisible(),false);
   await press('#close-answer');assert.equal(await state(),before);
  }
  // A selected placed piece and its removal/undo history also survive viewing.
  await page.selectOption('#problem','0');
  await page.getByRole('button',{name:'1、1マスのピース',exact:true})[mobile?'tap':'click']();
  await press('.cell[data-x="0"][data-y="0"]');await press('.cell[data-x="0"][data-y="0"]');
  before=await state();await press('#show-answer');await press('#close-answer');assert.equal(await state(),before);
  await press('#remove');await press('#undo');assert.equal(await page.evaluate(()=>placed.length),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await press('#show-answer');await page.screenshot({path:`/private/tmp/blokus-admin-${mobile?'mobile':'desktop'}.png`,fullPage:true});
  await page.reload();assert.equal(await page.locator('#admin-tools').isVisible(),false);
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);await page.close();
 }
 console.log('PASS: mobile taps and desktop clicks, five-tap timeout, ON/OFF and reload, all 25 answer boards, read-only display, exact play-state restoration, undo/removal, layout, no network or browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
