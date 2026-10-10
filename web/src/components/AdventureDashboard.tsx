"use client";
import {useState,type FormEvent} from "react";
import {createClient,type SupabaseClient} from "@supabase/supabase-js";
type Quest={id:string;quest_id:number;quest_title:string|null;completed_at:string;status:string};
type ImportResult={characterId:string;received:number;detectedCompletions:number;newCandidates:number};
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client:SupabaseClient|null=url&&key?createClient(url,key):null;
export default function AdventureDashboard(){
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [token,setToken]=useState("");
 const [name,setName]=useState("");
 const [realm,setRealm]=useState("");
 const [file,setFile]=useState<File|null>(null);
 const [quests,setQuests]=useState<Quest[]>([]);
 const [characterId,setCharacterId]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 async function signIn(e:FormEvent){
  e.preventDefault();if(!client)return;
  setBusy(true);setMessage("");
  try{const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
   setToken(data.session?.access_token??"");setMessage("Signed in. Choose your SavedVariables file.");
  }catch(e){setMessage(e instanceof Error?e.message:"Sign in failed");}finally{setBusy(false);}
 }
 async function loadQuests(id:string,accessToken:string){
  const response=await fetch("/api/quest-candidates?characterId="+encodeURIComponent(id),{headers:{Authorization:"Bearer "+accessToken}});
  const body=await response.json();if(!response.ok)throw new Error(body.error??"Could not load quests");
  setQuests(body.quests);
 }
 async function upload(e:FormEvent){
  e.preventDefault();if(!file||!token)return;
  setBusy(true);setMessage("");
  try{
   const form=new FormData();form.append("file",file);form.append("characterName",name.trim());form.append("realm",realm.trim());
   const response=await fetch("/api/import",{method:"POST",headers:{Authorization:"Bearer "+token},body:form});
   const body=await response.json() as ImportResult & {error?:string};
   if(!response.ok)throw new Error(body.error??"Import failed");
   setCharacterId(body.characterId);await loadQuests(body.characterId,token);
   setMessage(`Imported ${body.received} events. Found ${body.detectedCompletions} completed quests in the file; ${body.newCandidates} new quest candidates.`);
  }catch(e){setMessage(e instanceof Error?e.message:"Upload failed");}finally{setBusy(false);}
 }
 if(!client)return <p>Supabase configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</p>;
 return <section style={{background:"#1e293b",padding:24,borderRadius:12}}>
  <h2>My adventures</h2>
  {!token?<form onSubmit={signIn} style={{display:"grid",gap:12,maxWidth:420}}>
   <label>Email <input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label>Password <input required type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <button disabled={busy} type="submit">Sign in</button>
   <p>Create your account in Supabase Authentication during this early development stage.</p>
  </form>:<>
   <form onSubmit={upload} style={{display:"grid",gap:12,maxWidth:480}}>
    <label>Character <input required maxLength={80} value={name} onChange={e=>setName(e.target.value)}/></label>
    <label>Realm <input required maxLength={100} value={realm} onChange={e=>setRealm(e.target.value)}/></label>
    <label>WoW SavedVariables .lua file <input required type="file" accept=".lua,text/plain" onChange={e=>setFile(e.target.files?.[0]??null)}/></label>
    <button disabled={busy||!file} type="submit">Import adventures</button>
   </form>
   {characterId&&<button disabled={busy} onClick={()=>loadQuests(characterId,token).catch(e=>setMessage(String(e)))}>Refresh quest list</button>}
   <button onClick={async()=>{await client.auth.signOut();setToken("");setQuests([]);setCharacterId("");}}>Sign out</button>
   <h3>Completed quests ({quests.length})</h3>
   {quests.length===0?<p>No completed quests imported yet.</p>:<ul>{quests.map(q=><li key={q.id}>{q.quest_title??`Quest #${q.quest_id}`} — {new Date(q.completed_at).toLocaleString()} ({q.status})</li>)}</ul>}
   <p>Comic generation is not connected yet; importing does not use credits.</p>
  </>}
  {message&&<p role="status">{message}</p>}
 </section>;
}
