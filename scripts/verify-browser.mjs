import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const cli = process.env.NOCTURNE_BROWSER_CLI || 'agent-browser';
const output = [];
function command(...args) {
  const result = execFileSync(cli, ['--session', 'nocturne-qa', '--pin-tab', '--json', ...args], { encoding: 'utf8', timeout: 60000 });
  const parsed = JSON.parse(result);
  if (!parsed.success) throw new Error(JSON.stringify(parsed));
  return parsed.data;
}
function evaluate(js) { const data = command('eval', js); return data.result ?? data; }
function check(name, value) { output.push({name, value}); console.log(name, JSON.stringify(value)); }
command('open', 'http://127.0.0.1:3000');
command('set', 'viewport', '1440', '1000');
command('wait', 'canvas');
check('initial', evaluate('({url:location.href,width:innerWidth,canvas:!!document.querySelector("canvas"),overflow:document.documentElement.scrollWidth>innerWidth})'));
for (const y of [0, 600, 1100, 1800, 2000, 1100, 600, 0]) {
  evaluate(`window.scrollTo({top:${y},behavior:'instant'})`);
  command('wait', '120');
  check(`scroll-${y}`, evaluate('({y:scrollY,progress:document.querySelector(".hero-sequence").dataset.progress,copy:getComputedStyle(document.querySelector(".hero-copy")).visibility,scene:getComputedStyle(document.querySelector(".machine-stage")).opacity,reveal:getComputedStyle(document.querySelector(".studio-reveal")).opacity})'));
}
for (const [width,height] of [[1440,1000],[768,1024],[390,844]]) {
  command('set','viewport',String(width),String(height));
  for (const id of ['top','studio','artists','work','appointment','visit','book']) {
    evaluate(`document.getElementById('${id}').scrollIntoView({behavior:'instant',block:'start'})`);
    command('wait','500');
    command('screenshot',`docs/qa/${width}-${id}.png`);
    check(`${width}-${id}`,evaluate('({overflow:document.documentElement.scrollWidth>innerWidth,loaded:[...document.images].filter(i=>i.getBoundingClientRect().bottom>0&&i.getBoundingClientRect().top<innerHeight).every(i=>i.complete&&i.naturalWidth>0)})'));
  }
}
fs.writeFileSync('docs/qa/layout-results.json', JSON.stringify(output,null,2));
