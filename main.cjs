const {app,BrowserWindow,session,shell,screen,ipcMain}=require('electron');
const path=require('path');const edition=require('./edition.json');
const {execFile}=require('child_process');
const origin=edition.student?'https://universe-explorer-f2-student.vercel.app':'https://universe-explorer-f2-chi.vercel.app';
app.setName(edition.student?'Universe Student':'Universe Teacher');
app.setPath('userData',path.join(app.getPath('appData'),edition.student?'UniverseStudent':'UniverseTeacher'));
let main,audience,projectorTask;
const localUrl=url=>{try{return new URL(url).origin===origin;}catch{return false;}};
const audienceUrl=url=>{try{const u=new URL(url);return u.origin===origin&&/^\/assets\/audience-window-[a-z0-9-]+(?:\.html)?$/i.test(u.pathname)&&/^#universe-presenter-[a-z0-9-]+$/i.test(u.hash);}catch{return false;}};
function secure(win){
 win.webContents.setUserAgent(win.webContents.getUserAgent()+' UniverseDesktop/1.0');
 win.webContents.on('will-navigate',(e,url)=>{if(!localUrl(url)){e.preventDefault();if(/^https:\/\//.test(url))void shell.openExternal(url);}});
 win.webContents.setWindowOpenHandler(({url})=>{if(audienceUrl(url))return {action:'allow',overrideBrowserWindowOptions:{width:960,height:640,autoHideMenuBar:true,backgroundColor:'#000',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}}};if(/^https:\/\//.test(url))void shell.openExternal(url);return {action:'deny'};});
 win.webContents.on('did-create-window',child=>{secure(child);const displays=screen.getAllDisplays(),teacherDisplay=screen.getDisplayMatching(main.getBounds()),target=displays.find(d=>d.id!==teacherDisplay.id);if(target){child.setBounds(target.bounds);child.setFullScreen(true);}});
 win.webContents.on('before-input-event',(e,input)=>{if(input.key==='F11'&&input.type==='keyDown'){e.preventDefault();win.setFullScreen(!win.isFullScreen());}});
}
function separate(a,b){return a.x>=b.x+b.width||b.x>=a.x+a.width||a.y>=b.y+b.height||b.y>=a.y+a.height;}
function displayPair(){
 const displays=screen.getAllDisplays(),current=screen.getDisplayMatching(main.getBounds());
 const home=displays.find(d=>d.internal)||displays.find(d=>d.id===current.id)||displays[0];
 return {home,target:displays.find(d=>d.id!==home.id&&separate(d.bounds,home.bounds))};
}
async function prepareProjector(url){
 let pair=displayPair();
 if(!pair.target&&process.platform==='win32'){
  try{await new Promise((resolve,reject)=>execFile(path.join(app.isPackaged?process.resourcesPath:__dirname,'Universe-Display.exe'),[],{windowsHide:true,timeout:15000},error=>error?reject(error):resolve()));}
  catch{return {ok:false,message:'Windows 未能切换到扩展模式。请检查投影仪连接或系统安全策略，再重试。'};}
  // Display topology changes arrive asynchronously after the Windows API returns.
  for(let attempt=0;attempt<40;attempt++){if(!main||main.isDestroyed())return {ok:false};pair=displayPair();if(pair.target)break;await new Promise(resolve=>setTimeout(resolve,250));}
 }
 const {home,target}=pair;
 if(!target)return {ok:false,message:'尚未识别到独立投影屏幕。请确认投影仪已连接并开机。'};
 if(screen.getDisplayMatching(main.getBounds()).id!==home.id){const area=home.workArea||home.bounds,b=main.getBounds(),width=Math.min(b.width,area.width),height=Math.min(b.height,area.height);main.setBounds({x:area.x+Math.round((area.width-width)/2),y:area.y+Math.round((area.height-height)/2),width,height});}
 if(audience&&!audience.isDestroyed()){audience.setBounds(target.bounds);audience.setFullScreen(true);if(audience.webContents.getURL()!==url)void audience.loadURL(url);audience.showInactive();return {ok:true};}
 const view=new BrowserWindow({...target.bounds,show:false,frame:false,backgroundColor:'#000',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});audience=view;secure(view);
 view.once('ready-to-show',()=>{if(view.isDestroyed())return;view.setBounds(target.bounds);view.setFullScreen(true);view.showInactive();});view.on('closed',()=>{if(audience===view)audience=null;});
 view.webContents.on('before-input-event',(event,input)=>{if(input.key==='Escape'&&input.type==='keyDown'){event.preventDefault();view.close();}});
 void view.loadURL(url);return {ok:true};
}
function openProjector(url){
 if(!audienceUrl(url))return {ok:false,message:'无效的投影地址。'};
 if(!projectorTask)projectorTask=prepareProjector(url).finally(()=>{projectorTask=null;});
 return projectorTask;
}
if(!app.requestSingleInstanceLock())app.quit();else{
 app.on('second-instance',()=>{if(main){if(main.isMinimized())main.restore();main.show();main.focus();}});
 app.whenReady().then(()=>{
  session.defaultSession.setPermissionRequestHandler((contents,permission,callback)=>callback(localUrl(contents.getURL())&&['fullscreen','window-management'].includes(permission)));
  session.defaultSession.setPermissionCheckHandler((contents,permission,requestingOrigin)=>localUrl(requestingOrigin)&&['fullscreen','window-management'].includes(permission));
  ipcMain.handle('universe:projector',(e,url)=>e.sender===main?.webContents&&e.senderFrame===main.webContents.mainFrame&&localUrl(e.senderFrame.url)?openProjector(url):{ok:false,message:'无法打开投影。'});
  main=new BrowserWindow({width:1280,height:800,minWidth:640,minHeight:480,show:false,autoHideMenuBar:true,title:app.getName(),icon:path.join(__dirname,'icon.png'),backgroundColor:'#030711',webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});secure(main);main.once('ready-to-show',()=>main.show());main.on('closed',()=>{if(audience&&!audience.isDestroyed())audience.close();main=null;});
  main.webContents.on('did-fail-load',(_e,code,_text,_url,isMain)=>{if(!isMain||code===-3)return;void main.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent('<body style="background:#030711;color:white;font:20px system-ui;padding:60px"><h1>宇宙漫游</h1><p>暂时无法连接，请检查网络。</p><a style="color:lightblue" href="'+origin+'">重新连接</a></body>'));});
  void main.loadURL(origin+'/?source=desktop');
 });
 app.on('window-all-closed',()=>app.quit());
}
