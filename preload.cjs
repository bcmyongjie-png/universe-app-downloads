const {contextBridge,ipcRenderer}=require('electron');
const allowed=['https://universe-explorer-f2-chi.vercel.app','https://universe-explorer-f2-student.vercel.app'];
if(allowed.includes(location.origin))contextBridge.exposeInMainWorld('universeDesktop',{openProjector:url=>ipcRenderer.invoke('universe:projector',url)});
