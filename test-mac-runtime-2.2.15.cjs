// Run only on macOS against the apps copied out of the actual release DMGs.
const {_electron}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const version=require('./package.json').version;
(async()=>{
 assert.equal(process.platform,'darwin','This check requires an actual Mac runner');
 const out=path.resolve('smoke-results');fs.mkdirSync(out,{recursive:true});
 for(const edition of ['Teacher','Student']){
  const lower=edition.toLowerCase(),report={edition,expectedVersion:version,runnerArch:process.arch,os:os.release()};
  const executablePath=path.resolve(`dist/${lower}/mac-universal/Universe ${edition}.app/Contents/MacOS/Universe ${edition}`);
  let app,page;
  try{
   app=await _electron.launch({executablePath,args:['--host-resolver-rules=MAP * ~NOTFOUND','--disable-background-networking'],env:{...process.env,UNIVERSE_TEST_DATA:fs.mkdtempSync(path.join(os.tmpdir(),'universe-mac-verify-'))},timeout:60000});
   report.runtime=await app.evaluate(({app})=>({version:app.getVersion(),arch:process.arch,platform:process.platform,gpu:app.getGPUFeatureStatus()}));
   assert.equal(report.runtime.platform,'darwin');assert.equal(report.runtime.version,version);assert.equal(report.runtime.arch,process.arch,'A universal DMG must run natively on this chip');
   const helper=path.resolve(`dist/${lower}/mac-universal/Universe ${edition}.app/Contents/Resources/mac-display-helper`);
   execFileSync('/usr/bin/lipo',[helper,'-verify_arch','arm64','x86_64']);execFileSync('/usr/bin/codesign',['--verify','--strict',helper]);
   report.displays=JSON.parse(execFileSync(helper,['snapshot'],{encoding:'utf8',timeout:15000}));
   assert.equal(report.displays.ok,true);assert.ok(report.displays.displays.length);
   page=await app.firstWindow();page.setDefaultTimeout(30000);
   await page.waitForURL('https://universe-'+lower+'.local/**');
   await page.locator('#space canvas').waitFor();
   assert.equal(await page.evaluate(async()=>{try{await fetch('https://example.com');return false}catch{return true}}),true);
   await page.locator('#teacherToggle').click();
   await page.locator('#appUpdateStatus').waitFor();assert((await page.locator('#appUpdateStatus').textContent()).includes('v'+version));
   // CDP keyboard events do not reach Electron's native before-input-event on Mac.
   // Send through webContents so this exercises the actual F11 handler.
   const f11=()=>app.evaluate(({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];w.webContents.sendInputEvent({type:'keyDown',keyCode:'F11'});w.webContents.sendInputEvent({type:'keyUp',keyCode:'F11'});});
   await f11();
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isSimpleFullScreen()),true);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isFullScreen()),false);
   await f11();
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isSimpleFullScreen()),false);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isFullScreen()),false);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible()),true);
   // Also exercise the classroom button, including its DOM fullscreen exit.
   await page.locator('#fullscreenToggle').click();
   await page.waitForFunction(()=>!!document.fullscreenElement);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isSimpleFullScreen()),true);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isFullScreen()),false);
   await page.locator('#fullscreenToggle').click();
   await page.waitForFunction(()=>!document.fullscreenElement);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isSimpleFullScreen()),false);
   assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible()),true);
   await page.screenshot({path:path.join(out,`mac-${process.arch}-${lower}-startup.png`)});
   report.result='pass';console.log(`${edition}: real macOS ${process.arch}, DMG v${version}, offline WebGL scene and version UI PASS`);
  }catch(error){
   report.result='fail';report.error=error.stack||String(error);
   if(page){await page.screenshot({path:path.join(out,`mac-${process.arch}-${lower}-failure.png`)}).catch(()=>{});report.visibleText=await page.locator('body').innerText().catch(()=>null);}
   throw error;
  }finally{
   fs.writeFileSync(path.join(out,`mac-${process.arch}-${lower}-runtime.json`),JSON.stringify(report,null,2));
   if(app)await app.close();
  }
 }
})().catch(error=>{console.error(error);process.exit(1)});
