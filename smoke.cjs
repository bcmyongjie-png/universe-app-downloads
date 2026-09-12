const {_electron}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 fs.mkdirSync('smoke-results',{recursive:true});
 for(const edition of ['Teacher','Student']){
  const lower=edition.toLowerCase();
  const app=await _electron.launch({executablePath:`dist/${lower}/mac-universal/Universe ${edition}.app/Contents/MacOS/Universe ${edition}`,timeout:60000});
  try{
   const page=await app.firstWindow();
   await page.waitForURL(edition==='Teacher'?'https://universe-explorer-f2-chi.vercel.app/**':'https://universe-explorer-f2-student.vercel.app/**',{timeout:90000});
   await page.locator('canvas').first().waitFor({state:'visible',timeout:90000});
   assert.equal(await page.evaluate(()=>typeof window.universeDesktop?.openProjector),'function');
   await page.screenshot({path:`smoke-results/${lower}.png`});
   console.log(`${edition}: packaged universal app starts on ${process.platform}/${process.arch}, HTTPS lesson canvas visible, native bridge available.`);
  }finally{await app.close()}
 }
})().catch(error=>{console.error(error);process.exit(1)});
