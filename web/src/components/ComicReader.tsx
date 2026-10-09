"use client";
import {useState} from "react";
import type {ComicReaderData} from "../lib/comic-reader";
import {orderedPages} from "../lib/comic-reader";
export function ComicReader({comic}:{comic:ComicReaderData}){
 const [index,setIndex]=useState(0),pages=orderedPages(comic);
 const current=pages[Math.min(index,pages.length-1)];
 return <section aria-label={comic.title} style={{maxWidth:900,margin:"auto",textAlign:"center"}}>
 <h1>{comic.title}</h1>
 <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"center",marginBottom:16}}>
 <button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>Previous</button>
 <span aria-live="polite">Page {index+1} of {pages.length}</span>
 <button disabled={index===pages.length-1} onClick={()=>setIndex(i=>Math.min(pages.length-1,i+1))}>Next</button>
 </div>
 <img src={current.imageUrl} alt={`Comic page ${current.pageNumber}`} style={{width:"100%",height:"auto",maxHeight:"85vh",objectFit:"contain"}}/>
 </section>;
}
