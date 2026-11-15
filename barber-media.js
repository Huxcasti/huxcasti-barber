(function(){
"use strict";
const DB_NAME="huxcasti_barber_demo_media_v1", STORE="images";
let viewVersion=0,activeUrls=[];
function photoKey(businessId,slot){return businessId+":"+slot}
function storage(key,method,value){
 return new Promise((resolve,reject)=>{
  if(!window.indexedDB){reject(new Error("El navegador no permite guardar fotos."));return}
  const opening=indexedDB.open(DB_NAME,1);
  opening.onupgradeneeded=()=>opening.result.createObjectStore(STORE);
  opening.onerror=()=>reject(opening.error||new Error("No se pudo abrir el almacenamiento."));
  opening.onsuccess=()=>{
   const db=opening.result,tx=db.transaction(STORE,method==="get"?"readonly":"readwrite"),os=tx.objectStore(STORE);
   const request=method==="get"?os.get(key):method==="put"?os.put(value,key):os.delete(key);
   let result;
   request.onsuccess=()=>{result=request.result};
   tx.oncomplete=()=>{db.close();resolve(result)};
   tx.onerror=()=>{db.close();reject(tx.error||new Error("Error al guardar."))};
   tx.onabort=()=>{db.close();reject(tx.error||new Error("Guardado cancelado."))};
  };
 });
}
async function resize(file,maxSize){
 if(!file.type.startsWith("image/"))throw new Error("Selecciona una imagen.");
 if(file.size>25*1024*1024)throw new Error("La foto supera 25 MB.");
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();image.src=url;await image.decode();
  const width=image.naturalWidth,height=image.naturalHeight;
  if(!width||!height)throw new Error("No se pudo leer la foto.");
  const ratio=Math.min(1,maxSize/Math.max(width,height)),canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));
  const ctx=canvas.getContext("2d");
  if(!ctx)throw new Error("No se puede procesar la imagen.");
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",0.84));
  if(!blob)throw new Error("No se pudo procesar la imagen.");
  return blob;
 }finally{URL.revokeObjectURL(url)}
}
function showPhoto(el,src,alt){
 if(!el)return;
 el.replaceChildren();
 if(!src){el.textContent="✂️";return}
 const img=new Image();img.alt=alt;img.src=src;el.appendChild(img);
}
function status(message){const el=document.getElementById("mediaStatus");if(el)el.textContent=message}
window.huxMediaRefresh=async function(){
 const version=++viewVersion,selected=id,current=biz();
 let values;
 try{values=await Promise.all(["cover","photo1","photo2","photo3"].map(slot=>storage(photoKey(selected,slot),"get")))}
 catch(e){if(version===viewVersion)status("No se pueden leer las fotos guardadas: "+e.message);return}
 if(version!==viewVersion||id!==selected)return;
 activeUrls.forEach(url=>URL.revokeObjectURL(url));activeUrls=[];
 const makeUrl=blob=>{if(!blob)return "";const url=URL.createObjectURL(blob);activeUrls.push(url);return url};
 const background=makeUrl(values[0]),position=["top","center","bottom"].includes(current.coverPosition)?current.coverPosition:"center";
 const fullPage=document.getElementById("fullPageBackground"),preview=document.getElementById("vistaFondo");
 if(fullPage&&preview){
  const overlay='linear-gradient(180deg,rgba(8,16,12,.42),rgba(8,16,12,.68)),url("'+background+'")';
  const fallback='linear-gradient(145deg,var(--accent,#194b36),#091812)';
  fullPage.style.backgroundImage=background?overlay:fallback;
  preview.style.backgroundImage=background?overlay:fallback;
  fullPage.style.backgroundPosition="center "+position;
  preview.style.backgroundPosition="center "+position;
 }
 for(let i=0;i<3;i++){
  const legacy=Array.isArray(current.photos)&&/^https:\/\//i.test(current.photos[i]||"")?current.photos[i]:"";
  const src=makeUrl(values[i+1])||legacy;
  showPhoto(document.querySelector('[data-gallery-slot="'+i+'"]'),src,"Recorte "+(i+1));
  showPhoto(document.getElementById("preview"+(i+1)),src,"Foto "+(i+1)+" de la barbería");
 }
};
async function upload(input,slot,slotIndex){
 const file=input.files&&input.files[0];if(!file)return;
 const selected=id,barber=data.find(b=>b.id===selected);
 input.disabled=true;status("Preparando y guardando la foto…");
 try{
  const blob=await resize(file,slot==="cover"?2000:1200);
  await storage(photoKey(selected,slot),"put",blob);
  if(slot!=="cover"&&barber&&Array.isArray(barber.photos)){barber.photos[slotIndex]="";save()}
  if(selected===id){paint();status("Foto guardada en este navegador. Ya aparece en la página del cliente.")}
 }catch(e){status("No se guardó la foto: "+e.message)}
 finally{input.value="";input.disabled=false}
}
async function remove(slot,slotIndex){
 const selected=id;
 try{
  await storage(photoKey(selected,slot),"delete");
  if(slot!=="cover"){
   const barber=data.find(b=>b.id===selected);
   if(barber&&Array.isArray(barber.photos)){barber.photos[slotIndex]="";save()}
  }
  if(selected===id){paint();status("Foto eliminada de la demostración.")}
 }catch(e){status("No se pudo eliminar: "+e.message)}
}
const cover=document.getElementById("fondo");
cover.addEventListener("change",()=>upload(cover,"cover",-1));
document.getElementById("quitarFondo").onclick=()=>remove("cover",-1);
document.getElementById("fondoPosicion").onchange=e=>{
 biz().coverPosition=e.target.value;save();paint();
};
for(let i=1;i<=3;i++){
 const input=document.getElementById("foto"+i);
 input.addEventListener("change",()=>upload(input,"photo"+i,i-1));
 document.getElementById("quitarFoto"+i).onclick=()=>remove("photo"+i,i-1);
}
window.huxMediaRefresh();
})();
