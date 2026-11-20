'use strict';

function createListeningReview() {
 const key='baca-ceria-listening-review-v1';
 function read(){
   try{
     const saved=JSON.parse(localStorage.getItem(key));
     return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};
   }catch(error){return null}
 }
 let history=read()||{};
 function queue(level){
   const entries=history[level];
   return new Map(Array.isArray(entries)?entries.filter(entry=>Array.isArray(entry)&&typeof entry[0]==='string'):[]);
 }
 function change(level,update){
   history=read()||history;
   const entries=queue(level);
   update(entries);
   history[level]=[...entries];
   try{localStorage.setItem(key,JSON.stringify(history))}catch(error){}
 }
 return {
   targets(level,syllables,limit){
     return [...queue(level).keys()].filter(syllable=>syllables.includes(syllable)).slice(0,limit);
   },
   distractor(level,syllable){return queue(level).get(syllable)},
   mark(level,syllable,distractor){
     change(level,entries=>{
       const wrongAnswer=distractor||entries.get(syllable)||null;
       entries.delete(syllable);
       entries.set(syllable,wrongAnswer);
     });
   },
   clear(level,syllable){change(level,entries=>entries.delete(syllable))}
 };
}
