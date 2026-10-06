import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const cli = process.env.NOCTURNE_BROWSER_CLI || 'agent-browser';
const results=[];
function command(...args){const parsed=JSON.parse(execFileSync(cli,['--session','nocturne-qa','--pin-tab','--json',...args],{encoding:'utf8',timeout:60000}));if(!parsed.success)throw new Error(JSON.stringify(parsed));return parsed.data;}
function evaluate(js){const d=command('eval',js);return d.result??d;}
function check(name,expression){const value=evaluate(expression);assert.ok(value,name);results.push({name,passed:true});fs.writeFileSync('docs/qa/motion-results.json',JSON.stringify(results,null,2));console.log('PASS',name);}
command('open','http://127.0.0.1:3000');
command('wait','canvas');
command('set','viewport','1440','1000');
evaluate("history.replaceState(null,'', '/');window.scrollTo({top:1100,behavior:'instant'})");
command('wait','200');
command('reload');
command('wait','canvas');
command('wait','700');
check('refresh restores mid-sequence',`Math.abs(Number(document.querySelector('.hero-sequence').dataset.progress)-scrollY/2000)<.02&&scrollY>500`);
command('screenshot','docs/qa/desktop-refresh-mid.png');
evaluate(`(async()=>{for(const y of [1900,100,1500,0,2000,1000,0]){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}return true})()`);
command('wait','200');
check('rapid forward/reverse scroll returns to initial state',`scrollY===0&&Number(document.querySelector('.hero-sequence').dataset.progress)===0&&getComputedStyle(document.querySelector('.hero-copy')).visibility==='visible'`);
command('set','media','dark','reduced-motion');
command('wait','500');
check('reduced-motion removes pin duration',`matchMedia('(prefers-reduced-motion: reduce)').matches&&document.querySelector('.hero-sequence').offsetHeight===innerHeight&&getComputedStyle(document.querySelector('.studio-reveal')).display==='none'`);
command('screenshot','docs/qa/desktop-reduced-motion.png');
check('reduced-motion scene remains rendered',`!!document.querySelector('canvas')&&getComputedStyle(document.querySelector('.hero-copy')).visibility==='visible'`);
command('set','media','dark');
command('set','viewport','390','844');
evaluate("window.scrollTo({top:844,behavior:'instant'})");
command('wait','400');
command('screenshot','docs/qa/mobile-exploded.png');
check('mobile exploded state',`Math.abs(Number(document.querySelector('.hero-sequence').dataset.progress)-.5)<.03&&document.documentElement.scrollWidth===390`);
check('no framework error overlay',`!document.querySelector('[data-nextjs-dialog]')`);
results.push({name:'browser errors',details:command('errors')});
fs.writeFileSync('docs/qa/motion-results.json',JSON.stringify(results,null,2));
