(function(){'use strict';
const root=document.getElementById('baca-ceria');
const stage=root.querySelector('#bc-stage'),starsEl=root.querySelector('#bc-stars'),tabs=root.querySelector('#bc-tabs'),levelEl=root.querySelector('#bc-level'),muteEl=root.querySelector('#bc-mute'),newEl=root.querySelector('#bc-new'),voiceEl=root.querySelector('#bc-voice');
const BANK_SIZE=5;
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const oldSaved=(()=>{try{return JSON.parse(localStorage.getItem('baca-ceria-v1')||'{}')}catch(e){return {}}})();
const saved=(()=>{try{return JSON.parse(localStorage.getItem('baca-ceria-v3')||'{}')}catch(e){return {}}})();
const state={mode:Object.hasOwn(moduleNames,saved.mode)?saved.mode:'learn',level:saved.level||oldSaved.level||'awal',muted:typeof saved.muted==='boolean'?saved.muted:!!oldSaved.muted,voiceMode:saved.voiceMode==='offline'?'offline':'auto',stars:Math.max(0,Number(saved.stars??oldSaved.stars)||0),learnType:'vowels',selected:'a',round:[],index:0,answered:false,chosen:'',used:[],options:[],feedback:'',hint:false,score:0,finished:false,bag:saved.bag||{},recent:saved.recent||{},lastPhoto:saved.lastPhoto||{},images:{}};
if(state.level!=='lanjut')state.level='awal';
levelEl.value=state.level;voiceEl.value=state.voiceMode;
function persist(){try{localStorage.setItem('baca-ceria-v3',JSON.stringify({mode:state.mode,level:state.level,muted:state.muted,stars:state.stars,voiceMode:state.voiceMode,bag:state.bag,recent:state.recent,lastPhoto:state.lastPhoto}))}catch(e){}}
const {say,saySequence,stopAudio,updateVoiceInfo}=createAudio(root,state,allSylls);
const review=createListeningReview();
let reviewing=false;
let needsPractice=false;
let roundPictures=[];
let questionPhoto;
const countedPictures=new Map();
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function updateChrome(){starsEl.textContent=String(state.stars);muteEl.textContent=state.muted?'🔇 Suara mati':'🔊 Suara aktif';tabs.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.mode===state.mode)))}
function pool(){
 const words=state.level==='lanjut'?advanced:basic;
 return state.mode==='build'?words.filter(({word})=>Object.hasOwn(wordPhotos,word)):words;
}
function getQuestions(){return state.level==='lanjut'?allSylls:basicSylls}
// Shuffle-bag persists across refreshes: exhaust a pool before repeating, avoid recently seen answers.
function questionId(item){return typeof item==='string'?item:item.id??item.word}
function drawFromBag(key,items,amount){const ids=items.map(questionId);const pool=new Set(ids);let remaining=(state.bag[key]||[]).filter(x=>pool.has(x));const previous=(state.recent[key]||[]).filter(x=>pool.has(x));const output=[];
 while(output.length<Math.min(amount,ids.length)){
  if(!remaining.length){const fresh=shuffle(ids.filter(x=>!output.includes(x)));const older=fresh.filter(x=>!previous.includes(x));const recent=fresh.filter(x=>previous.includes(x));remaining=[...older,...recent]}
  const pos=remaining.findIndex(x=>!output.includes(x));if(pos===-1){remaining=[];continue}
  output.push(remaining.splice(pos,1)[0]);
 }
 state.bag[key]=remaining;state.recent[key]=output.slice();persist();return output.map(id=>items.find(item=>questionId(item)===id));
}
function selectPhoto(word){
 const photos=(state.mode==='count'&&countingPhotos[word])||wordPhotos[word];
 const key=state.mode+':'+word;
 const alternatives=photos.filter(photo=>photo!==state.lastPhoto[key]);
 const available=alternatives.length?alternatives:photos;
 state.lastPhoto[key]=available[Math.floor(Math.random()*available.length)];
 persist();
 return 'assets/pictures/'+state.lastPhoto[key]+'.jpg';
}
function setMode(mode){if(!Object.hasOwn(moduleNames,mode))return;stopAudio();state.mode=mode;reviewing=false;state.finished=false;state.index=0;state.score=0;state.feedback='';if(mode!=='learn')startRound();else{persist();render()}}
function startRound(){
 reviewing=false;
 const key=state.level+':'+state.mode;
 if(state.mode==='math'){
   const advancedMath=state.level==='lanjut';
   const addition=drawFromBag(key,mathPrompts.addition,advancedMath?3:BANK_SIZE);
   state.round=advancedMath?shuffle([...addition,...drawFromBag(key+':subtraction',mathPrompts.subtraction,2)]):addition;
 }else if(state.mode==='count'){
   const max=state.level==='lanjut'?10:5;
   state.round=drawFromBag(key,countPrompts.slice(0,max),BANK_SIZE);
   roundPictures=shuffle(photoWords);
 }else if(state.mode==='guess'){
   state.round=drawFromBag(key,photoWords,BANK_SIZE);
 }else{
   state.round=drawFromBag(key,state.mode==='listen'?getQuestions():pool(),BANK_SIZE);
 }
 state.index=0;
 state.score=0;
 state.finished=false;
 newQuestion();
}
function reviewTargets(){
 return state.mode==='listen'?review.targets(state.level,getQuestions(),BANK_SIZE):[];
}
function startReview(){
 if(!state.finished)return;
 const targets=reviewTargets();
 if(!targets.length)return;
 reviewing=true;
 state.round=targets;
 state.index=0;
 state.score=0;
 state.finished=false;
 newQuestion();
}
function markListeningDifficulty(distractor){
 needsPractice=true;
 review.mark(state.level,state.round[state.index],distractor);
}
function newQuestion(){stopAudio();needsPractice=false;state.answered=false;state.chosen='';state.used=[];state.feedback='';state.hint=false;state.images={};
 if(state.mode==='listen'){const target=state.round[state.index];const questions=getQuestions();
 const previous=reviewing?review.distractor(state.level,target):null;
 const others=shuffle(questions.filter(x=>x!==target&&x!==previous));
 if(previous&&previous!==target&&questions.includes(previous))others.unshift(previous);
 state.options=shuffle([target,...others.slice(0,3)]);}
 else if(state.mode==='guess'){
   const word=state.round[state.index];
   questionPhoto=selectPhoto(word);
   const distractors=shuffle(photoWords.filter(option=>option!==word)).slice(0,2);
   state.options=shuffle([word,...distractors]);
 }
 else if(state.mode==='math'||state.mode==='count'){
   countedPictures.clear();
   if(state.mode==='count')questionPhoto=selectPhoto(roundPictures[state.index]);
   const {answer}=state.round[state.index];
   const numbers=state.mode==='count'
     ?countPrompts.slice(0,state.level==='lanjut'?10:5).map(question=>question.answer)
     :mathNumberWords.map((_,number)=>number);
   const nearby=numbers.filter(number=>number!==answer&&Math.abs(number-answer)<=3);
   state.options=shuffle([answer,...shuffle(nearby).slice(0,3)]);
 }
 else if(state.mode==='build'){const w=state.round[state.index];const distractors=shuffle(allSylls.filter(x=>!w.parts.includes(x))).slice(0,2);state.options=shuffle([...w.parts,...distractors].map((part,i)=>({id:i,part})));questionPhoto=selectPhoto(w.word)}
 else if(state.mode==='picture'){const w=state.round[state.index];const choices=shuffle(pool().filter(x=>x.word!==w.word&&x.emojis.every(e=>!w.emojis.includes(e)))).slice(0,3);state.options=shuffle([w,...choices]);const used=new Set();state.options.forEach(item=>{state.images[item.word]=shuffle(item.emojis).find(e=>!used.has(e))||item.emojis[0];used.add(state.images[item.word])})}
 render();}
function done(){if(state.answered)return;state.answered=true;state.score++;state.stars++;persist();state.feedback='🎉 Hebat! Jawabanmu benar!';updateChrome()}
function response(){return state.feedback?`<div class="bc-feedback ${state.answered?'good':'try'}" role="status">${esc(state.feedback)}</div>`:'<div class="bc-feedback" role="status">&nbsp;</div>'}
function progress(){return `<div class="bc-progress-row"><span>Soal ${state.index+1} dari ${state.round.length}</span><span>⭐ ${state.score} benar</span></div><div class="bc-progress" aria-label="Progres permainan"><div style="width:${((state.index+1)/state.round.length)*100}%"></div></div>`}
function controls(){return `<div class="bc-footer-actions">${state.answered?`<button class="bc-action" data-action="next">${state.index===state.round.length-1?'Lihat hasil 🏆':'Lanjut ➜'}</button>`:''}</div>`}
function sessionNote(){
 if(reviewing)return '<div class="bc-session-note"><button class="bc-mini-btn" data-action="again">Sesi baru ↻</button></div>';
 return `<div class="bc-session-note"><span class="bc-banklabel">🔀 ${state.mode==='listen'?getQuestions().length:pool().length} pilihan · sesi acak</span><button class="bc-mini-btn" data-action="again">Sesi baru ↻</button></div>`}
function renderLearn(){const consonants=state.level==='lanjut'?learnConsonants:['b','m','s','k','p','t'];const chars=state.learnType==='vowels'?vowels:consonants.flatMap(c=>vowels.map(v=>c+v));return `<h2>🔤 Kenal Bunyi</h2><p class="bc-sub">Sentuh huruf atau suku kata, lalu tirukan suaranya!</p><div class="bc-pills"><button class="bc-pill ${state.learnType==='vowels'?'active':''}" data-action="learn-type" data-value="vowels">Huruf vokal</button><button class="bc-pill ${state.learnType==='syllables'?'active':''}" data-action="learn-type" data-value="syllables">Suku kata</button></div><div class="bc-learn-display"><div class="bc-huge">${esc(state.selected)}</div><div class="bc-hint">🔊 Ketuk kartu untuk mendengar</div></div><div class="${state.learnType==='vowels'?'bc-letter-grid':'bc-syll-grid'}">${chars.map(c=>`<button class="bc-letter ${state.selected===c?'active':''}" data-action="learn" data-value="${esc(c)}" aria-label="Bunyi ${esc(c)}">${esc(c)}</button>`).join('')}</div><p class="bc-note">Huruf <b>e</b> punya bunyi berbeda. Dengarkan bunyi <b>me</b> dalam dua kata ini.</p><div class="bc-footer-actions"><button class="bc-outline" data-action="pronunciation-example" data-value="meja">🔊 Meja · e taling</button><button class="bc-outline" data-action="pronunciation-example" data-value="melati">🔊 Melati · e pepet</button></div>`}
function renderListen(){const target=state.round[state.index];return `${progress()}${sessionNote()}<h2>${reviewing?"Latihan Lagi":"👂 Dengar &amp; Pilih"}</h2><p class="bc-sub">Dengarkan bunyinya, lalu sentuh suku kata yang tepat.</p><button class="bc-audio" data-action="sound">🔊 Dengarkan suara</button><div class="bc-options">${state.options.map(x=>`<button class="bc-choice ${state.answered&&x===target?'ok':''} ${state.chosen===x&&!state.answered?'no':''}" data-action="choose-listen" data-value="${esc(x)}" ${state.answered?'disabled':''}>${esc(x)}</button>`).join('')}</div>${response()}<button class="bc-mini-btn" data-action="hint">${state.hint?'Petunjuk: '+esc(target):'Tidak terdengar? Lihat petunjuk'}</button>${controls()}`}
function renderBuild(){const w=state.round[state.index];return `${progress()}${sessionNote()}<h2>🧩 Susun Kata</h2><p class="bc-sub">Lihat gambar. Susun potongan bunyi menjadi satu kata!</p><img class="bc-activity-photo" src="${questionPhoto}" alt="Foto ${esc(w.word)}"><div class="bc-slots" style="flex-wrap:wrap">${w.parts.map((p,i)=>`<div class="bc-slot ${state.used[i]!==undefined?'filled':''}">${state.used[i]!==undefined?esc(p):'?'}</div>`).join('')}</div><div class="bc-tilebar">${state.options.map(t=>`<button class="bc-tile ${state.used.includes(t.id)?'used':''}" data-action="tile" data-value="${t.id}" ${state.answered?'disabled':''}>${esc(t.part)}</button>`).join('')}</div>${response()}<div class="bc-footer-actions"><button class="bc-outline" data-action="say-word">🔊 Dengar kata</button>${state.used.length&&!state.answered?'<button class="bc-outline" data-action="undo">↶ Ulang susun</button>':''}</div>${controls()}`}
function renderPicture(){const w=state.round[state.index];return `${progress()}${sessionNote()}<h2>🖼️ Baca Gambar</h2><p class="bc-sub">Baca katanya, lalu pilih gambar yang cocok.</p><div class="bc-word">${esc(w.word)}</div><div class="bc-cut">${state.hint?esc(w.parts.join(' • ')):'Baca perlahan, ya!'}</div><div class="bc-options">${state.options.map(x=>`<button class="bc-choice bc-emoji-choice ${state.answered&&x.word===w.word?'ok':''} ${state.chosen===x.word&&!state.answered?'no':''}" data-action="choose-picture" data-value="${esc(x.word)}" aria-label="Gambar ${esc(x.word)}" ${state.answered?'disabled':''}>${state.images[x.word]}</button>`).join('')}</div>${response()}<div class="bc-footer-actions"><button class="bc-outline" data-action="say-word">🔊 Dengar kata</button><button class="bc-outline" data-action="hint">${state.hint?'Petunjuk tampil':'Bantuan suku kata'}</button></div>${controls()}`}
function renderNumberChoices(answer){
 return state.options.map(number=>{
   const result=state.answered&&number===answer?'ok':!state.answered&&number===state.chosen?'no':'';
   return `<button class="bc-choice ${result}" data-action="choose-number" data-value="${number}" ${state.answered?'disabled':''}>${number}</button>`;
 }).join('');
}
function renderMath(){
 const {left,right,symbol,spokenOperator,answer}=state.round[state.index];
 const spokenQuestion=`${mathNumberWords[left]} ${spokenOperator} ${mathNumberWords[right]}, berapa?`;
 return `${progress()}<h2>Berhitung</h2>
 <div class="bc-word" role="math" aria-label="${spokenQuestion}">${left} ${symbol} ${right} = ${state.answered?answer:'?'}</div>
 <button class="bc-audio" data-action="say-math">🔊 Dengarkan soal</button>
 <div class="bc-options">${renderNumberChoices(answer)}</div>${response()}${controls()}`;
}
function renderCount(){
 const {answer}=state.round[state.index];
 const word=roundPictures[state.index];
 const pictures=Array.from({length:answer},(_,index)=>{
   const count=countedPictures.get(index);
   return `<button type="button" class="bc-count-picture" data-action="count-picture" data-value="${index}" aria-label="Hitung ${word}" aria-pressed="${Boolean(count)}" ${state.answered?'disabled':''}>
     <img src="${questionPhoto}" alt=""><span class="bc-count-number">${count??''}</span>
   </button>`;
 }).join('');
 return `${progress()}<h2>Hitung Gambar</h2>
 <p class="bc-sub">Ada berapa ${word}? Ketuk satu per satu, lalu pilih jumlahnya.</p>
 <button class="bc-audio" data-action="say-count">🔊 Dengarkan soal</button>
 <div class="bc-count-grid" role="group" aria-label="Gambar untuk dihitung">${pictures}</div>
 <div class="bc-options">${renderNumberChoices(answer)}</div>${response()}${controls()}`;
}
function renderGuess(){
 const word=state.round[state.index];
 const choices=state.options.map(option=>{
   const result=state.answered&&option===word?'ok':!state.answered&&option===state.chosen?'no':'';
   return `<button class="bc-choice bc-word-choice ${result}" data-action="choose-word" data-value="${option}">${option}</button>`;
 }).join('');
 return `${progress()}<h2>Tebak Gambar</h2>
 <p class="bc-sub">Gambar apa ini? Ketuk kata untuk mendengarnya.</p>
 <img class="bc-activity-photo" src="${questionPhoto}" alt="Foto ${word}">
 <div class="bc-options">${choices}</div>${response()}${controls()}`;
}
function chooseWord(word){
 if(!state.options.includes(word))return;
 say(word);
 if(state.answered)return;
 state.chosen=word;
 if(word===state.round[state.index])done();
 else state.feedback='Belum cocok. Coba kata lain, ya!';
 render();
}
function countPicture(button){
 const index=Number(button.dataset.value);
 if(state.answered||countedPictures.has(index))return;
 const count=countedPictures.size+1;
 countedPictures.set(index,count);
 button.setAttribute('aria-pressed','true');
 button.querySelector('.bc-count-number').textContent=String(count);
 say(mathNumberWords[count]);
}
function sayMathQuestion(){
 const {left,right,spokenOperator}=state.round[state.index];
 saySequence([mathNumberWords[left],spokenOperator,mathNumberWords[right],'berapa']);
}
function chooseNumber(number){
 if(state.answered||!state.options.includes(number))return;
 state.chosen=number;
 if(number===state.round[state.index].answer){
   done();
   say('bagus');
 }else{
   state.feedback='Belum tepat. Coba lagi, ya!';
   say('coba lagi');
 }
 render();
}
function renderFinished(){return `<div class="bc-celebrate"><div class="big">🏆</div><h2>Luar biasa!</h2><p>Kamu sudah menyelesaikan ${state.round.length} soal!</p><p style="font-size:27px">⭐ +${state.score} bintang</p><div class="bc-footer-actions">${reviewTargets().length?'<button class="bc-action" data-action="review">Latihan Lagi</button>':''}<button class="bc-outline" data-action="again">🔀 Main sesi baru</button></div></div>`}
function render(){updateChrome();stage.innerHTML=state.finished?renderFinished():state.mode==='learn'?renderLearn():state.mode==='listen'?renderListen():state.mode==='build'?renderBuild():state.mode==='math'?renderMath():state.mode==='count'?renderCount():state.mode==='guess'?renderGuess():renderPicture()}
function chooseListen(v){if(state.answered)return;state.chosen=v;if(v===state.round[state.index]){if(reviewing&&!needsPractice)review.clear(state.level,v);done();saySequence(['bagus',v])}else{markListeningDifficulty(v);state.feedback='Belum tepat. Coba dengarkan lagi!';say('coba lagi')}render()}
function choosePicture(v){if(state.answered)return;state.chosen=v;const w=state.round[state.index];if(v===w.word){done();saySequence(['hebat',w.word])}else{state.feedback='Belum cocok. Coba baca lagi, ya!';say('coba lagi')}render()}
function chooseTile(id){if(state.answered)return;const tile=state.options.find(t=>t.id===id);if(!tile||state.used.includes(id))return;const w=state.round[state.index];const expected=w.parts[state.used.length];if(tile.part===expected){state.used.push(id);state.feedback='';if(state.used.length===w.parts.length){done();saySequence([...w.parts,w.word])}else say(tile.part)}else{state.feedback='Hampir! Coba potongan bunyi yang lain.';say('coba lagi')}render()}
root.addEventListener('click',e=>{const nav=e.target.closest('[data-mode]');if(nav){const mode=nav.dataset.mode;setMode(mode);say(moduleNames[mode]);return}const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,v=b.dataset.value;switch(a){case 'learn-type':state.learnType=v;state.selected=v==='vowels'?'a':'ba';render();break;case 'learn':state.selected=v;render();say(v);break;case 'pronunciation-example':saySequence([pronunciationExamples[v],v]);break;case 'sound':say(state.round[state.index]);break;case 'review':startReview();break;case 'hint':if(state.mode==='listen'&&!state.answered&&!state.hint)markListeningDifficulty();state.hint=!state.hint;render();break;case 'say-math':sayMathQuestion();break;case 'say-count':say(`ada berapa ${roundPictures[state.index]}?`);break;case 'choose-word':chooseWord(v);break;case 'count-picture':countPicture(b);break;case 'choose-number':chooseNumber(Number(v));break;case 'choose-listen':chooseListen(v);break;case 'choose-picture':choosePicture(v);break;case 'tile':chooseTile(Number(v));break;case 'say-word':say(state.round[state.index].word);break;case 'undo':state.used=[];state.feedback='';render();break;case 'next':if(!state.answered)return;if(state.index===state.round.length-1){state.finished=true;render();say('hebat! kamu luar biasa!')}else{state.index++;newQuestion()}break;case 'again':if(state.mode==='learn'){state.learnType='syllables';state.selected='ba';render()}else startRound();break}});
newEl.addEventListener('click',()=>{if(state.mode==='learn'){state.learnType='syllables';state.selected='ba';render()}else startRound()});
levelEl.addEventListener('change',()=>{state.level=levelEl.value;state.selected=state.learnType==='vowels'?'a':'ba';setMode(state.mode)});
muteEl.addEventListener('click',()=>{state.muted=!state.muted;stopAudio();persist();updateChrome()});
voiceEl.addEventListener('change',()=>{state.voiceMode=voiceEl.value;stopAudio();persist();updateVoiceInfo()});
updateVoiceInfo();
if(state.mode==='learn')render();else startRound();
})();
