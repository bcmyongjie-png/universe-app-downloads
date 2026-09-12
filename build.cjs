const {build,Platform,Arch}=require('electron-builder');
const fs=require('node:fs');
(async()=>{
 if(process.platform!=='darwin')throw new Error('Build and verify macOS installers on macOS.');
 for(const student of [false,true]){
  const edition=student?'Student':'Teacher';
  fs.writeFileSync('edition.json',JSON.stringify({student}));
  fs.copyFileSync(`${edition.toLowerCase()}-512.png`,'icon.png');
  await build({targets:Platform.MAC.createTarget(['dmg'],Arch.universal),config:{
   appId:`net.yurenedu.universe.${edition.toLowerCase()}`,productName:`Universe ${edition}`,
   artifactName:`Universe-${edition}-Mac.dmg`,directories:{output:`dist/${edition.toLowerCase()}`},
   files:['main.cjs','preload.cjs','edition.json','icon.png','package.json'],asar:true,
   mac:{category:'public.app-category.education',icon:'icon.png',identity:'-',hardenedRuntime:false,notarize:false,target:'dmg'},
   dmg:{format:'ULFO',writeUpdateInfo:false,title:`Universe ${edition}`,contents:[{x:130,y:150,type:'file'},{x:410,y:150,type:'link',path:'/Applications'}]},
   publish:null
  }});
 }
})().catch(error=>{console.error(error);process.exit(1)});
