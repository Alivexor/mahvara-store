import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const baseURL=process.env.QA_BASE_URL??"http://localhost:3010";
const executablePath=process.env.CHROME_PATH??"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser=await chromium.launch({headless:true,executablePath});
const routes=["/","/shop","/product/hydra-serum","/cart","/checkout","/login","/register","/account","/admin","/blog","/contact"];
const failures=[];
await mkdir("docs/screenshots",{recursive:true});
try{
  for(const device of [{name:"desktop",width:1440,height:1000},{name:"mobile",width:390,height:844}]){
    const context=await browser.newContext({viewport:{width:device.width,height:device.height},locale:"fa-IR",colorScheme:"light"});
    const page=await context.newPage();
    page.on("console",message=>{if(message.type()==="error"&&!message.text().includes("favicon"))failures.push(`${device.name} console: ${message.text()}`)});
    for(const route of routes){
      let response;
      try { response=await page.goto(`${baseURL}${route}`,{waitUntil:"domcontentloaded",timeout:30_000}); }
      catch(error) { if (!String(error).includes("ERR_ABORTED")) throw error; }
      await page.waitForLoadState("networkidle",{timeout:10_000}).catch(()=>{});
      const redirectedToLogin = ["/account","/admin"].includes(route) && new URL(page.url()).pathname==="/login";
      const status=response?.status()??0;
      if(status>=400&&!redirectedToLogin)failures.push(`${device.name} ${route}: HTTP ${status}`);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
      if(overflow)failures.push(`${device.name} ${route}: horizontal overflow`);
      if(route==="/"){await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,45))}window.scrollTo(0,0)});await page.waitForTimeout(250);await page.screenshot({path:`docs/screenshots/home-${device.name}.png`,fullPage:true});}
    }
    await context.close();
  }
}finally{await browser.close()}
if(failures.length){console.error(failures.join("\n"));process.exit(1)}
console.log(`Browser QA passed: ${routes.length} routes × 2 viewports; screenshots saved in docs/screenshots.`);
