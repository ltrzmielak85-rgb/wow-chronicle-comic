import AdventureDashboard from "@/components/AdventureDashboard";
export default function Home(){
 return <main style={{maxWidth:880,margin:"60px auto",padding:24}}>
  <h1>WoW Comic Chronicle</h1>
  <p>Turn your adventures into illustrated fantasy comics.</p>
  <AdventureDashboard/>
  <section style={{marginTop:24}}>
   <h2>How to import</h2>
   <p>Install the addon, complete a quest, then exit WoW or use /reload to save the data. Upload the WoWComicChronicle.lua file from your character's SavedVariables folder.</p>
   <p>Comics, credits, and subscriptions are not enabled yet. No payments are collected.</p>
  </section>
 </main>;
}
