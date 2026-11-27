'use strict';

function createAudio(root, state, syllables) {
const voiceInfo=root.querySelector('#bc-voice-info');
let activeAudio=null, activeDone=null, nativeDone=null, speechGeneration=0;
const getIdVoices=()=>{try{return (window.speechSynthesis?.getVoices()||[]).filter(v=>/^id(?:[-_]|$)/i.test(v.lang||''))}catch(e){return []}};
const idVoice=()=>getIdVoices().sort((a,b)=>Number(b.localService)-Number(a.localService))[0]||null;
function updateVoiceInfo(){const v=idVoice();voiceInfo.textContent=state.voiceMode==='offline'?'Memakai rekaman bawaan untuk bunyi yang tersedia.':v?`Contoh pelafalan dan suku kata memakai rekaman Bahasa Indonesia bawaan. Kata lainnya memakai suara perangkat: ${v.name}.`:'Suku kata dan kata yang tersedia memakai rekaman Bahasa Indonesia bawaan (tanpa suara Inggris).';}
function stopAudio(){speechGeneration++;if(activeAudio){activeAudio.onended=null;activeAudio.onerror=null;activeAudio.pause();activeAudio=null}if(activeDone){const done=activeDone;activeDone=null;done(false)}if(nativeDone){const done=nativeDone;nativeDone=null;done(false)}try{window.speechSynthesis?.cancel()}catch(e){}}
let dbPromise=null;
function audioDB(){if(!('indexedDB' in window))return Promise.resolve(null);if(dbPromise)return dbPromise;dbPromise=new Promise(resolve=>{try{const r=indexedDB.open('baca-ceria-parent-recordings',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('clips'))r.result.createObjectStore('clips')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve(null)}catch(e){resolve(null)}});return dbPromise}
async function getRecording(token){const db=await audioDB();if(!db)return null;return new Promise(resolve=>{try{const req=db.transaction('clips','readonly').objectStore('clips').get(token);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)}catch(e){resolve(null)}})}
async function changeRecording(token, blob){
 const db=await audioDB();
 if(!db)throw Error('Penyimpanan rekaman tidak tersedia.');
 await new Promise((resolve,reject)=>{
   const transaction=db.transaction('clips','readwrite');
   transaction.oncomplete=resolve;
   transaction.onabort=()=>reject(transaction.error||Error('Perubahan rekaman gagal.'));
   const clips=transaction.objectStore('clips');
   if(blob)clips.put(blob,token);
   else clips.delete(token);
 });
}
function nativeTalk(token,generation){return new Promise(resolve=>{try{const voice=idVoice();if(!voice||!window.SpeechSynthesisUtterance)return resolve(false);const u=new SpeechSynthesisUtterance(token);u.voice=voice;u.lang='id-ID';u.rate=0.78;u.pitch=1;u.volume=1;let ended=false;const done=(ok)=>{if(ended)return;ended=true;if(nativeDone===done)nativeDone=null;resolve(ok)};nativeDone=done;u.onend=()=>done(true);u.onerror=()=>done(false);if(generation!==speechGeneration)return done(false);window.speechSynthesis.speak(u)}catch(e){resolve(false)}})}
function playClip(src,generation,revokeUrl){return new Promise(resolve=>{try{const a=new Audio(src);activeAudio=a;let ended=false;const done=(ok)=>{if(ended)return;ended=true;if(revokeUrl)URL.revokeObjectURL(src);if(activeAudio===a)activeAudio=null;if(activeDone===done)activeDone=null;resolve(ok)};activeDone=done;a.onended=()=>done(true);a.onerror=()=>done(false);const play=a.play();if(play&&play.catch)play.catch(()=>done(false))}catch(e){if(revokeUrl)URL.revokeObjectURL(src);resolve(false)}})}
async function saySequence(parts){if(state.muted)return;stopAudio();const generation=speechGeneration;for(const token of parts.map(p=>String(p).trim().toLowerCase()).filter(Boolean)){
 if(generation!==speechGeneration||state.muted)return;
 const recording=await getRecording(token);
 if(generation!==speechGeneration||state.muted)return;
 if(recording){await playClip(URL.createObjectURL(recording),generation,true)}
 else if(Object.hasOwn(activityAudio,token)){
   await playClip('data:audio/mpeg;base64,'+activityAudio[token],generation,false);
 }
 else if(Object.hasOwn(mathAudio,token)){
   await playClip('data:audio/mpeg;base64,'+mathAudio[token],generation,false);
 }
 else if(Object.hasOwn(pronunciationAudio, token)){
   const clip = pronunciationAudio[token];
   await playClip('data:audio/mpeg;base64,'+clip,generation,false);
 }
 else if(token==='me')await playClip('data:audio/mpeg;base64,'+pronunciationAudio['mé'],generation,false);
 else if(OFFLINE_AUDIO[token]&&(state.voiceMode==='offline'||syllables.includes(token)))await playClip('data:audio/mpeg;base64,'+OFFLINE_AUDIO[token],generation,false);
 else if(state.voiceMode==='auto'&&idVoice()){const spoken=await nativeTalk(token,generation);if(!spoken&&OFFLINE_AUDIO[token])await playClip('data:audio/mpeg;base64,'+OFFLINE_AUDIO[token],generation,false)}
 else if(OFFLINE_AUDIO[token])await playClip('data:audio/mpeg;base64,'+OFFLINE_AUDIO[token],generation,false);
 else if(idVoice())await nativeTalk(token,generation);
 if(generation!==speechGeneration||state.muted)return;
 await new Promise(r=>setTimeout(r,170));
}}
function say(text){saySequence([text])}
// Parent voice corrections are stored only on this device using IndexedDB.
const recordTarget=root.querySelector('#bc-record-target'),recordInput=root.querySelector('#bc-record-word');
const recordBtn=root.querySelector('#bc-record'),recordPlay=root.querySelector('#bc-record-play'),recordDelete=root.querySelector('#bc-record-delete'),recordStatus=root.querySelector('#bc-record-status');
let recorder=null;
function recordingTarget(){
 return {
   token:recordTarget.value||recordInput.value.trim().toLowerCase().normalize('NFC').replace(/\s+/g,' '),
   label:recordTarget.value?recordTarget.selectedOptions[0].textContent:recordInput.value.trim()
 };
}
function lockRecordingControls(locked){
 recordTarget.disabled=recordInput.disabled=recordPlay.disabled=recordDelete.disabled=locked;
}
recordTarget.addEventListener('change',()=>{
 recordInput.hidden=!!recordTarget.value;
 if(!recordInput.hidden)recordInput.focus();
 recordStatus.textContent='Tekan Mulai rekam, ucapkan bunyinya, lalu berhenti.';
});
recordBtn.addEventListener('click',async()=>{
 if(recorder?.state==='recording'){
   recordBtn.disabled=true;
   recorder.stop();
   return;
 }
 const {token,label}=recordingTarget();
 if(!token){recordStatus.textContent='Ketik dulu bunyi yang mau direkam.';return}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){recordStatus.textContent='Browser ini tidak mendukung rekaman mikrofon.';return}

 lockRecordingControls(true);
 recordBtn.disabled=true;
 stopAudio();
 let stream;
 const finish=()=>{
   stream?.getTracks().forEach(track=>track.stop());
   recorder=null;
   recordBtn.textContent='🎙️ Mulai rekam';
   recordBtn.disabled=false;
   lockRecordingControls(false);
 };
 try{
   stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const chunks=[];
   recorder=new MediaRecorder(stream);
   let recordingError=null;
   recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)};
   recorder.onerror=event=>{recordingError=event.error||Error('Mikrofon berhenti saat merekam.')};
   recorder.onstop=async()=>{
     recordBtn.disabled=true;
     stream.getTracks().forEach(track=>track.stop());
     stream=null;
     try{
       if(recordingError)throw recordingError;
       const clip=new Blob(chunks,{type:recorder.mimeType});
       if(!clip.size)throw Error('Tidak ada audio yang terekam.');
       await changeRecording(token,clip);
       recordStatus.textContent=`✅ Rekaman “${label}” tersimpan. Tekan Dengar untuk memeriksa.`;
     }catch(error){recordStatus.textContent='Gagal menyimpan: '+error.message}
     finally{finish()}
   };
   recorder.start();
   recordBtn.textContent='⏹️ Berhenti & simpan';
   recordStatus.textContent=`🔴 Sedang merekam “${label}”…`;
   recordBtn.disabled=false;
 }catch(error){
   recordStatus.textContent='Mikrofon tidak tersedia: '+error.message;
   finish();
 }
});
recordPlay.addEventListener('click',()=>{
 const {token,label}=recordingTarget();
 if(!token)return;
 if(state.muted){recordStatus.textContent='Aktifkan suara untuk mendengar rekaman.';return}
 recordStatus.textContent=`Memutar “${label}”.`;
 say(token);
});
recordDelete.addEventListener('click',async()=>{
 const {token,label}=recordingTarget();
 if(!token)return;
 lockRecordingControls(true);
 recordBtn.disabled=true;
 try{
   await changeRecording(token,null);
   stopAudio();
   recordStatus.textContent=`Rekaman “${label}” dihapus. Bunyi kembali ke suara bawaan.`;
 }catch(error){recordStatus.textContent='Gagal menghapus: '+error.message}
 finally{
   recordBtn.disabled=false;
   lockRecordingControls(false);
 }
});
const exportBackup=root.querySelector('#bc-backup-export'),importBackup=root.querySelector('#bc-backup-import');
const backupFile=root.querySelector('#bc-backup-file'),backupStatus=root.querySelector('#bc-backup-status');
const maxBackupBytes=32*1024*1024;
const backupFormat='baca-ceria-voice-backup';

async function runBackupAction(action){
 exportBackup.disabled=importBackup.disabled=true;
 try{backupStatus.textContent=await action()}
 catch(error){backupStatus.textContent=error.message}
 finally{exportBackup.disabled=importBackup.disabled=false}
}
async function readBackupClips(){
 const db=await audioDB();
 if(!db)throw Error('Penyimpanan rekaman tidak tersedia.');
 return new Promise((resolve,reject)=>{
   const transaction=db.transaction('clips','readonly');
   const clips=transaction.objectStore('clips');
   const keys=clips.getAllKeys();
   const values=clips.getAll();
   transaction.oncomplete=()=>resolve(keys.result.map((token,index)=>({token,clip:values.result[index]})));
   transaction.onabort=()=>reject(Error('Rekaman tidak bisa dibaca.'));
 });
}
function toBase64(buffer){
 const bytes=new Uint8Array(buffer);
 let binary='';
 for(let offset=0;offset<bytes.length;offset+=8192){
   binary+=String.fromCharCode(...bytes.subarray(offset,offset+8192));
 }
 return btoa(binary);
}
function decodeBackup(text){
 let backup;
 try{backup=JSON.parse(text)}
 catch(error){throw Error('File cadangan tidak valid.')}
 if(backup?.format!==backupFormat||backup.version!==1||!Array.isArray(backup.clips)||!backup.clips.length){
   throw Error('Format cadangan suara tidak didukung.');
 }
 const tokens=new Set();
 return backup.clips.map(entry=>{
   const {token,type,audio}=entry||{};
   if(typeof token!=='string'||!token||token.length>40||token!==token.trim().toLowerCase()||tokens.has(token)||
      typeof type!=='string'||(type&&!/^audio\/[a-z0-9.+-]+(?:;[ -~]*)?$/i.test(type))||typeof audio!=='string'||!audio){
     throw Error('Ada rekaman yang tidak valid di file cadangan.');
   }
   tokens.add(token);
   let binary;
   try{binary=atob(audio)}
   catch(error){throw Error('Data audio di file cadangan rusak.')}
   return {token,clip:new Blob([Uint8Array.from(binary,character=>character.charCodeAt(0))],{type})};
 });
}
async function restoreBackupClips(entries){
 const db=await audioDB();
 if(!db)throw Error('Penyimpanan rekaman tidak tersedia.');
 return new Promise((resolve,reject)=>{
   const transaction=db.transaction('clips','readwrite');
   const clips=transaction.objectStore('clips');
   let added=0;
   transaction.oncomplete=()=>resolve(added);
   transaction.onabort=()=>reject(Error('Impor gagal. Periksa ruang penyimpanan browser.'));
   for(const {token,clip} of entries){
     const existing=clips.getKey(token);
     existing.onsuccess=()=>{
       if(existing.result!==undefined)return;
       clips.add(clip,token);
       added++;
     };
   }
 });
}
exportBackup.addEventListener('click',()=>runBackupAction(async()=>{
 const entries=await readBackupClips();
 if(!entries.length)return 'Belum ada rekaman untuk dicadangkan.';
 if(entries.reduce((size,{clip})=>size+Math.ceil(clip.size/3)*4,0)>maxBackupBytes)throw Error('Cadangan melebihi batas 32 MB.');
 const clips=await Promise.all(entries.map(async({token,clip})=>({
   token,type:clip.type,audio:toBase64(await clip.arrayBuffer())
 })));
 const file=new Blob([JSON.stringify({format:backupFormat,version:1,clips})],{type:'application/json'});
 if(file.size>maxBackupBytes)throw Error('Cadangan melebihi batas 32 MB.');
 const url=URL.createObjectURL(file);
 const link=document.createElement('a');
 link.href=url;
 link.download='baca-ceria-cadangan-suara.json';
 document.body.append(link);
 link.click();
 link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 return `${clips.length} rekaman siap diunduh.`;
}));
importBackup.addEventListener('click',()=>backupFile.click());
backupFile.addEventListener('change',()=>{
 const file=backupFile.files[0];
 backupFile.value='';
 if(!file)return;
 return runBackupAction(async()=>{
   if(file.size>maxBackupBytes)throw Error('Cadangan melebihi batas 32 MB.');
   const entries=decodeBackup(await file.text());
   const added=await restoreBackupClips(entries);
   return `${added} rekaman ditambahkan. ${entries.length-added} dipertahankan karena sudah ada.`;
 });
});
try{window.speechSynthesis?.addEventListener?.('voiceschanged',updateVoiceInfo)}catch(e){}
return {say,saySequence,stopAudio,updateVoiceInfo};
}
