import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const SUBJECTS = ["Step 1","Step 2 CK","Step 3","Match Prep","Internal Medicine","Surgery","Pediatrics","Psychiatry","OB/GYN","Pharmacology","Pathology","Anatomy","Microbiology","Biochemistry","Radiology"];
const SC = {"Step 1":"#6366f1","Step 2 CK":"#3b82f6","Step 3":"#8b5cf6","Match Prep":"#f59e0b","Internal Medicine":"#10b981","Surgery":"#ef4444","Pediatrics":"#22c55e","Psychiatry":"#ec4899","OB/GYN":"#f97316","Pharmacology":"#14b8a6","Pathology":"#a855f7","Anatomy":"#06b6d4","Microbiology":"#84cc16","Biochemistry":"#64748b","Radiology":"#0ea5e9"};
const FILTERS = ["All","Step 1","Step 2 CK","Match Prep","Specialty"];
const COUNTRIES = ["Nigeria","India","Egypt","Pakistan","Philippines","Brazil","Mexico","Iran","Italy","Japan","South Korea","Romania","Ukraine","Other"];
const EXAM_STAGES = ["Haven't started","Preparing Step 1","Passed Step 1","Preparing Step 2 CK","Passed Step 2 CK","Preparing Step 3","Applied to Match","Matched!","Practicing physician"];
const MATCH_YEARS = ["2026","2027","2028","2029","Not sure yet"];
const SPECIALTIES = ["Internal Medicine","General Surgery","Pediatrics","Psychiatry","Family Medicine","OB/GYN","Radiology","Anesthesiology","Emergency Medicine","Neurology"];

const USERS = [
  {id:1,name:"Aisha Kamara",avatar:"AK",country:"Nigeria",flag:"🇳🇬",interests:["Step 1","Pharmacology"],bio:"IMG from Nigeria. Step 1 in August. Let's grind together!",online:true,sessions:24,friends:12,joined:"Jan 2025",streak:14,matchYear:"2027",stage:"Preparing Step 1",specialty:"Internal Medicine",score:235},
  {id:2,name:"Luca Ferretti",avatar:"LF",country:"Italy",flag:"🇮🇹",interests:["Step 2 CK","Internal Medicine"],bio:"Italian IMG, passed Step 1 (245). Now Step 2 CK focus.",online:true,sessions:18,friends:8,joined:"Feb 2025",streak:8,matchYear:"2027",stage:"Preparing Step 2 CK",specialty:"Internal Medicine",score:245},
  {id:3,name:"Priya Nair",avatar:"PN",country:"India",flag:"🇮🇳",interests:["Match Prep","Surgery"],bio:"Indian IMG targeting general surgery. Happy to share resources.",online:false,sessions:31,friends:19,joined:"Nov 2024",streak:21,matchYear:"2026",stage:"Applied to Match",specialty:"General Surgery",score:242},
  {id:4,name:"Carlos Mendez",avatar:"CM",country:"Mexico",flag:"🇲🇽",interests:["Step 1","Anatomy"],bio:"First-time Step 1 examinee. Anatomy is my weak point!",online:true,sessions:12,friends:5,joined:"Mar 2025",streak:5,matchYear:"2027",stage:"Preparing Step 1",specialty:"Family Medicine",score:null},
  {id:5,name:"Sofia Reyes",avatar:"SR",country:"Brazil",flag:"🇧🇷",interests:["Match Prep","Pediatrics"],bio:"Brazilian IMG. Matched IM last year. Now helping others!",online:false,sessions:27,friends:14,joined:"Dec 2024",streak:33,matchYear:"2026",stage:"Matched!",specialty:"Pediatrics",score:238},
  {id:6,name:"Kenji Mori",avatar:"KM",country:"Japan",flag:"🇯🇵",interests:["Psychiatry","Step 2 CK"],bio:"Japanese IMG, psychiatry-bound. Step 2 CK in 3 months.",online:true,sessions:9,friends:6,joined:"Apr 2025",streak:3,matchYear:"2027",stage:"Preparing Step 2 CK",specialty:"Psychiatry",score:null},
  {id:7,name:"Amara Osei",avatar:"AO",country:"Ghana",flag:"🇬🇭",interests:["Step 1","Pathology"],bio:"Ghanaian IMG. Pathology + Pharma deep dives every weekend.",online:true,sessions:16,friends:9,joined:"Jan 2025",streak:19,matchYear:"2027",stage:"Preparing Step 1",specialty:"Internal Medicine",score:null},
  {id:8,name:"Yuna Park",avatar:"YP",country:"South Korea",flag:"🇰🇷",interests:["Step 2 CK","Pediatrics"],bio:"Korean IMG aiming for Peds. UWorld daily!",online:false,sessions:22,friends:11,joined:"Feb 2025",streak:11,matchYear:"2027",stage:"Preparing Step 2 CK",specialty:"Pediatrics",score:240},
];

const ROOMS = [
  {id:1,title:"USMLE Step 1 Rapid Review",subject:"Step 1",host:"Aisha Kamara",hostId:1,members:4,max:6,active:true,tags:["High Yield","Anki","NBMEs"],desc:"Daily cardio/renal/neuro rapid-fire Q&A. Bring Anki."},
  {id:2,title:"Step 2 CK Question Discussion",subject:"Step 2 CK",host:"Luca Ferretti",hostId:2,members:3,max:5,active:true,tags:["UWorld","CCS Cases"],desc:"UWorld block review + CCS case walkthroughs."},
  {id:3,title:"IMG Match 2027 Prep",subject:"Match Prep",host:"Carlos Mendez",hostId:4,members:5,max:8,active:true,tags:["ERAS","LORs","PS"],desc:"ERAS timeline, personal statement workshop, LOR strategy."},
  {id:4,title:"Internal Medicine Study Group",subject:"Internal Medicine",host:"Priya Nair",hostId:3,members:2,max:6,active:false,tags:["Shelf","Inpatient"],desc:"Medicine shelf + inpatient pearls for the wards."},
  {id:5,title:"Pharmacology High Yield Session",subject:"Pharmacology",host:"Kenji Mori",hostId:6,members:4,max:6,active:true,tags:["Sketchy","FA"],desc:"Sketchy Pharm + First Aid integration. Beta blockers today."},
  {id:6,title:"Surgery Shelf Prep",subject:"Surgery",host:"Sofia Reyes",hostId:5,members:3,max:5,active:true,tags:["Pestana","NMS"],desc:"Pestana + NMS Surgery. Chapter-based review."},
  {id:7,title:"Pathology Deep Dive",subject:"Pathology",host:"Amara Osei",hostId:7,members:2,max:6,active:true,tags:["Robbins","Sketchy"],desc:"Robbins + Sketchy Path. Neoplasia week."},
  {id:8,title:"Step 2 CK Ethics & Stats",subject:"Step 2 CK",host:"Yuna Park",hostId:8,members:4,max:5,active:false,tags:["Biostats","Ethics"],desc:"Ethics/biostats are free points. Let's nail them together."},
];

const FEED_POSTS = [
  {id:1,uid:5,user:"Sofia Reyes",flag:"🇧🇷",avatar:"SR",time:"2h ago",text:"Just got my ERAS token activated for 2027 cycle! 🎉 For anyone applying this cycle — start your personal statement NOW. I can review yours. DM me.",likes:34,comments:12,stage:"Matched!"},
  {id:2,uid:2,user:"Luca Ferretti",flag:"🇮🇹",avatar:"LF",time:"4h ago",text:"Step 1 score report tip: if you used Anki + UWorld for 3 months, your weak areas will be exactly what you skipped in Anki. Don't skip cards. 🃏",likes:87,comments:23,stage:"Preparing Step 2 CK"},
  {id:3,uid:3,user:"Priya Nair",flag:"🇮🇳",avatar:"PN",time:"6h ago",text:"Matched into General Surgery at a university program! 🎉 3 years of USMLE prep, 2 research papers, 1 US clinical experience. If I can do it so can you. Happy to answer any questions.",likes:203,comments:61,stage:"Matched!"},
  {id:4,uid:7,user:"Amara Osei",flag:"🇬🇭",avatar:"AO",time:"8h ago",text:"Anyone else feel like pathology is the backbone of Step 1? Spent 4 hours on Robbins today and finally understood why nephrotic vs nephritic matters clinically. Game changer.",likes:45,comments:18,stage:"Preparing Step 1"},
  {id:5,uid:1,user:"Aisha Kamara",flag:"🇳🇬",avatar:"AK",time:"12h ago",text:"FREE RESOURCE: I compiled a Google Sheet with the best free USMLE resources by subject. Anki decks, YouTube channels, PDFs. Will share in the Step 1 study room tonight at 8 PM EST. 🙌",likes:156,comments:44,stage:"Preparing Step 1"},
];

const MENTORS = [
  {id:5,name:"Sofia Reyes",avatar:"SR",flag:"🇧🇷",country:"Brazil",specialty:"Pediatrics",stage:"Matched!",matchYear:"2026",score:238,bio:"Matched IMG. Happy to help with ERAS, PS, and interview prep.",sessions:27,rating:4.9,helped:23},
  {id:2,name:"Luca Ferretti",avatar:"LF",flag:"🇮🇹",country:"Italy",specialty:"Internal Medicine",stage:"Preparing Step 2 CK",matchYear:"2027",score:245,bio:"Step 1: 245. Can help with exam strategy and resource selection.",sessions:18,rating:4.8,helped:15},
  {id:3,name:"Priya Nair",avatar:"PN",flag:"🇮🇳",country:"India",specialty:"General Surgery",stage:"Matched!",matchYear:"2026",score:242,bio:"Matched surgeon. 2 research papers. US clinical experience tips.",sessions:31,rating:5.0,helped:31},
];

const INIT_MSGS = {
  1:[{id:1,uid:1,user:"Aisha K.",text:"Let's start with cardio HY — mitral stenosis vs aortic regurg!",time:"10:02"},{id:2,uid:4,user:"Carlos M.",text:"I always mix up the murmurs. Which resource do you use?",time:"10:03"},{id:3,uid:1,user:"Aisha K.",text:"Sketchy + Anki. Retention is unreal after 3 weeks.",time:"10:04"}],
  2:[{id:1,uid:2,user:"Luca F.",text:"Today: CCS cases for acute MI. Correct order of interventions?",time:"09:45"},{id:2,uid:3,user:"Priya N.",text:"ASA → heparin → cath if STEMI. Right?",time:"09:46"},{id:3,uid:2,user:"Luca F.",text:"Almost — oxygen only if sat <94%. Common mistake!",time:"09:47"}],
  3:[{id:1,uid:4,user:"Carlos M.",text:"Anyone know a good ERAS personal statement editor?",time:"11:00"},{id:2,uid:5,user:"Sofia R.",text:"I can review yours! I sent to 180 programs last cycle.",time:"11:02"},{id:3,uid:4,user:"Carlos M.",text:"That would be amazing, thank you Sofia!",time:"11:03"}],
  4:[],5:[{id:1,uid:6,user:"Kenji M.",text:"Starting with beta blockers — non-selective vs selective?",time:"08:30"}],
  6:[{id:1,uid:3,user:"Priya N.",text:"Pestana is the bible for surgery shelf. Chapter 3 today.",time:"07:00"}],
  7:[{id:1,uid:7,user:"Amara O.",text:"Neoplasia today — benign vs malignant features?",time:"09:00"}],
  8:[],
};

const INIT_NOTIFS = [
  {id:1,type:"friend",text:"Aisha Kamara accepted your connection request.",time:"2m ago",read:false},
  {id:2,type:"room",text:"New room: 'Step 1 Pathology Sprint' matches your subjects.",time:"15m ago",read:false},
  {id:3,type:"session",text:"IMG Match 2027 Prep session starts in 30 minutes.",time:"28m ago",read:true},
  {id:4,type:"friend",text:"Priya Nair wants to connect with you.",time:"1h ago",read:false},
  {id:5,type:"streak",text:"🔥 You're on a 12-day streak! Top 15% of learners.",time:"2h ago",read:true},
  {id:6,type:"mentor",text:"Sofia Reyes accepted your mentorship request.",time:"3h ago",read:false},
];

const INIT_SESSIONS = [
  {id:1,title:"USMLE Step 1 Rapid Review",subject:"Step 1",date:"2026-06-02",time:"14:00",duration:90,host:"Aisha Kamara",attendees:["Aisha","Carlos"],maxAttendees:6,notes:"Cardio + Renal HY topics. Bring Anki decks."},
  {id:2,title:"IMG Match 2027 Prep",subject:"Match Prep",date:"2026-06-04",time:"10:00",duration:60,host:"You",attendees:["You","Sofia"],maxAttendees:8,notes:"ERAS timeline + PS workshop"},
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const avBg = id => `hsl(${id*55+10},52%,42%)`;
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric"});
function useIsMobile(){const[m,setM]=useState(window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return m;}
function avSt(id,isMe=false){return{borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",fontWeight:"bold",color:"#fff",flexShrink:0,background:isMe?"#6366f1":avBg(id)};}
function Btn(bg,border="none",pad="9px 16px",fs="13px"){return{background:bg==="none"?"transparent":bg,border:border==="none"?"none":`1px solid ${border}`,color:"#fff",padding:pad,borderRadius:8,cursor:"pointer",fontSize:fs,fontFamily:"sans-serif",fontWeight:"bold",lineHeight:1.2};}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [onboarded, setOnboarded] = useState(false);
  const [myProfile, setMyProfile] = useState({name:"",country:"",flag:"🌍",stage:"",matchYear:"",specialty:"",subjects:[],bio:""});

  if (!onboarded) return <Onboarding onComplete={(profile)=>{setMyProfile(profile);setOnboarded(true);}} isMobile={isMobile}/>;
  return <MainApp isMobile={isMobile} myProfile={myProfile}/>;
}

// ─────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────
function Onboarding({onComplete, isMobile}){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({name:"",country:"Nigeria",stage:"Preparing Step 1",matchYear:"2027",specialty:"Internal Medicine",subjects:["Step 1"],bio:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleSub=s=>setForm(f=>({...f,subjects:f.subjects.includes(s)?f.subjects.filter(x=>x!==s):[...f.subjects,s]}));
  const countryFlag={"Nigeria":"🇳🇬","India":"🇮🇳","Egypt":"🇪🇬","Pakistan":"🇵🇰","Philippines":"🇵🇭","Brazil":"🇧🇷","Mexico":"🇲🇽","Iran":"🇮🇷","Italy":"🇮🇹","Japan":"🇯🇵","South Korea":"🇰🇷","Romania":"🇷🇴","Ukraine":"🇺🇦","Other":"🌍"};

  const steps=[
    {title:"Welcome to StudyMeet",sub:"The #1 community for IMGs & USMLE students worldwide.",content:(
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>📚</div>
        <h2 style={{fontSize:isMobile?22:28,color:"#f1f5f9",marginBottom:10}}>Welcome to StudyMeet</h2>
        <p style={{color:"#94a3b8",fontFamily:"sans-serif",fontSize:15,lineHeight:1.6,maxWidth:360,margin:"0 auto 28px"}}>Connect with IMGs worldwide. Study USMLE together, share resources, and ace your match.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:280,margin:"0 auto"}}>
          {[{icon:"🌍",t:"4,000+ IMGs from 60+ countries"},{icon:"📖",t:"Live study rooms 24/7"},{icon:"🎯",t:"Match prep & mentorship"},{icon:"🔥",t:"Streaks, leaderboards & more"}].map(x=>(
            <div key={x.t} style={{display:"flex",alignItems:"center",gap:12,background:"#0f1e35",borderRadius:10,padding:"10px 14px",border:"1px solid #1a2740"}}>
              <span style={{fontSize:20}}>{x.icon}</span><span style={{fontFamily:"sans-serif",fontSize:13,color:"#cbd5e1"}}>{x.t}</span>
            </div>
          ))}
        </div>
      </div>
    )},
    {title:"What's your name?",content:(
      <div style={{maxWidth:360,margin:"0 auto"}}>
        <label style={labelSt}>Your full name</label>
        <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Aisha Kamara" style={inputSt}/>
        <label style={{...labelSt,marginTop:16}}>Where are you from?</label>
        <select value={form.country} onChange={e=>set("country",e.target.value)} style={inputSt}>
          {COUNTRIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <label style={{...labelSt,marginTop:16}}>Tell us about yourself (optional)</label>
        <textarea value={form.bio} onChange={e=>set("bio",e.target.value)} placeholder="e.g. IMG from Nigeria preparing for Step 1. Looking for study partners!" style={{...inputSt,height:80,resize:"none"}}/>
      </div>
    )},
    {title:"Where are you in your journey?",content:(
      <div style={{maxWidth:400,margin:"0 auto"}}>
        <label style={labelSt}>Your current exam stage</label>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:6}}>
          {EXAM_STAGES.map(s=>(
            <button key={s} onClick={()=>set("stage",s)} style={{background:form.stage===s?"#1e1b6e":"#0f1e35",border:`2px solid ${form.stage===s?"#6366f1":"#1a2740"}`,color:form.stage===s?"#c7d2fe":"#94a3b8",padding:"11px 14px",borderRadius:9,cursor:"pointer",textAlign:"left",fontSize:13,fontFamily:"sans-serif",transition:"all .15s"}}>{s}</button>
          ))}
        </div>
      </div>
    )},
    {title:"Target match year & specialty",content:(
      <div style={{maxWidth:360,margin:"0 auto"}}>
        <label style={labelSt}>Target match year</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6,marginBottom:18}}>
          {MATCH_YEARS.map(y=>(
            <button key={y} onClick={()=>set("matchYear",y)} style={{background:form.matchYear===y?"#1e1b6e":"#0f1e35",border:`2px solid ${form.matchYear===y?"#6366f1":"#1a2740"}`,color:form.matchYear===y?"#c7d2fe":"#94a3b8",padding:"9px 14px",borderRadius:9,cursor:"pointer",fontSize:13,fontFamily:"sans-serif"}}>{y}</button>
          ))}
        </div>
        <label style={labelSt}>Target specialty</label>
        <select value={form.specialty} onChange={e=>set("specialty",e.target.value)} style={inputSt}>
          {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
    )},
    {title:"What are you studying?",content:(
      <div style={{maxWidth:440,margin:"0 auto"}}>
        <p style={{fontFamily:"sans-serif",fontSize:13,color:"#94a3b8",marginBottom:12}}>Select all that apply — we'll find you the right study rooms and partners.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {SUBJECTS.map(s=>{const on=form.subjects.includes(s);const c=SC[s]||"#6366f1";return(
            <button key={s} onClick={()=>toggleSub(s)} style={{background:on?c+"22":"#0f1e35",border:`2px solid ${on?c:"#1a2740"}`,color:on?c:"#94a3b8",padding:"10px 12px",borderRadius:9,cursor:"pointer",fontSize:12,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:7,transition:"all .15s"}}>
              <span>{on?"✓":"+"}</span>{s}
            </button>
          );})}
        </div>
      </div>
    )},
  ];

  const cur=steps[step];
  const canNext=(step===0)||(step===1&&form.name.trim())||(step===2&&form.stage)||(step===3&&form.matchYear&&form.specialty)||(step===4&&form.subjects.length>0);

  return (
    <div style={{minHeight:"100vh",background:"#0b1120",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:isMobile?"16px":"24px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        {step>0&&(
          <div style={{display:"flex",gap:6,marginBottom:24}}>
            {steps.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:4,background:i<=step?"#6366f1":"#1a2740",transition:"background .3s"}}/>)}
          </div>
        )}
        <div style={{background:"#0f1e35",borderRadius:16,border:"1px solid #1a2740",padding:isMobile?"20px 16px":"32px"}}>
          {step>0&&<h2 style={{fontSize:isMobile?18:22,fontWeight:"bold",color:"#f1f5f9",marginBottom:6,textAlign:"center"}}>{cur.title}</h2>}
          <div style={{marginTop:step>0?16:0}}>{cur.content}</div>
          <div style={{display:"flex",gap:10,marginTop:24,justifyContent:step===0?"center":"space-between"}}>
            {step>0&&<button onClick={()=>setStep(s=>s-1)} style={Btn("#0b1120","#334155")}>← Back</button>}
            {step<steps.length-1
              ? <button onClick={()=>canNext&&setStep(s=>s+1)} style={{...Btn("#6366f1"),opacity:canNext?1:0.4,minWidth:120,textAlign:"center"}}>
                  {step===0?"Get Started →":"Continue →"}
                </button>
              : <button onClick={()=>canNext&&onComplete({...form,flag:countryFlag[form.country]||"🌍"})} style={{...Btn("#6366f1"),opacity:canNext?1:0.4,minWidth:160,textAlign:"center"}}>
                  🚀 Enter StudyMeet
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const labelSt={fontSize:12,color:"#94a3b8",fontFamily:"sans-serif",display:"block",marginBottom:5};
const inputSt={width:"100%",background:"#080f1e",border:"1px solid #1a2740",color:"#e2e8f0",padding:"10px 12px",borderRadius:8,fontSize:13,fontFamily:"sans-serif",outline:"none",boxSizing:"border-box"};

// ─────────────────────────────────────────────
// MAIN APP SHELL
// ─────────────────────────────────────────────
function MainApp({isMobile, myProfile}){
  const [page,setPage]=useState("home");
  const [activeTab,setActiveTab]=useState("rooms");
  const [currentRoom,setCurrentRoom]=useState(null);
  const [msgs,setMsgs]=useState(INIT_MSGS);
  const [notifs,setNotifs]=useState(INIT_NOTIFS);
  const [sessions,setSessions]=useState(INIT_SESSIONS);
  const [friends,setFriends]=useState([1,5]);
  const [viewUser,setViewUser]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [showNotifs,setShowNotifs]=useState(false);
  const [showModal,setShowModal]=useState(false);
  const [showPro,setShowPro]=useState(false);
  const [roomFilter,setRoomFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [likedPosts,setLikedPosts]=useState([]);
  const [streak]=useState(12);
  const [profileComplete]=useState(65);

  const unread=notifs.filter(n=>!n.read).length;
  const nav=(pg,tab)=>{setPage(pg);if(tab)setActiveTab(tab);setSidebarOpen(false);setShowNotifs(false);};
  const toggleFriend=uid=>setFriends(f=>f.includes(uid)?f.filter(x=>x!==uid):[...f,uid]);
  const sendMsg=(rid,text)=>{const t=new Date();const ts=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(m=>({...m,[rid]:[...(m[rid]||[]),{id:Date.now(),uid:0,user:myProfile.name||"You",text,time:ts}]}));};
  const joinRandom=()=>{const a=ROOMS.filter(r=>r.active&&r.members<r.max);if(a.length){setCurrentRoom(a[Math.floor(Math.random()*a.length)]);nav("room");}};

  if(page==="profile"&&viewUser) return <ProfilePage user={viewUser} friends={friends} toggleFriend={toggleFriend} onBack={()=>nav("explore","people")} isMobile={isMobile}/>;
  if(page==="myprofile") return <MyProfilePage profile={myProfile} streak={streak} profileComplete={profileComplete} friends={friends} sessions={sessions} onBack={()=>nav("home")} isMobile={isMobile}/>;
  if(page==="room"&&currentRoom) return <RoomPage room={currentRoom} messages={msgs[currentRoom.id]||[]} onSend={t=>sendMsg(currentRoom.id,t)} onBack={()=>nav("explore","rooms")} isMobile={isMobile}/>;

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:"#0b1120",color:"#e2e8f0",fontFamily:"'Palatino Linotype',Palatino,serif",overflow:"hidden"}}>
      {/* Mobile top bar */}
      {isMobile&&(
        <div style={{background:"#080f1e",borderBottom:"1px solid #1a2740",padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,flexShrink:0}}>
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{background:"none",border:"none",color:"#e2e8f0",fontSize:22,cursor:"pointer",padding:"2px 4px",lineHeight:1}}>☰</button>
          <div style={{fontSize:16,fontWeight:"bold",color:"#f1f5f9"}}>📚 StudyMeet</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:13,color:"#fb923c",fontWeight:"bold"}}>🔥{streak}</span>
            <button onClick={()=>setShowNotifs(o=>!o)} style={{background:"none",border:"none",color:"#94a3b8",fontSize:18,cursor:"pointer",position:"relative",padding:"2px 4px"}}>
              🔔{unread>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#ef4444",color:"#fff",borderRadius:10,fontSize:9,padding:"1px 4px",fontFamily:"sans-serif"}}>{unread}</span>}
            </button>
          </div>
        </div>
      )}

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
        {isMobile&&sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"#00000077",zIndex:90}}/>}

        {/* Sidebar */}
        <aside style={{width:232,flexShrink:0,background:"#080f1e",borderRight:"1px solid #1a2740",padding:"16px 13px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto",...(isMobile?{position:"fixed",top:0,left:0,height:"100vh",zIndex:100,transform:sidebarOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(.4,0,.2,1)"}:{position:"sticky",top:0,height:"100vh"})}}>
          {!isMobile&&<div style={{fontSize:17,fontWeight:"bold",color:"#f1f5f9",marginBottom:4,display:"flex",alignItems:"center",gap:8}}>📚 StudyMeet</div>}
          {isMobile&&<div style={{height:50}}/>}

          {/* Streak */}
          <div style={{background:"linear-gradient(90deg,#7c2d12,#431407)",border:"1px solid #9a3412",borderRadius:9,padding:"8px 11px",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>🔥</span>
            <div><div style={{fontSize:13,fontWeight:"bold",color:"#fed7aa"}}>{streak} Day Streak!</div><div style={{fontSize:10,color:"#fb923c",fontFamily:"sans-serif"}}>Top 15% of learners</div></div>
          </div>

          {/* Profile completion */}
          <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:9,padding:"10px 11px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,color:"#94a3b8",fontFamily:"sans-serif"}}>Profile Completion</span>
              <span style={{fontSize:12,fontWeight:"bold",color:"#818cf8"}}>{profileComplete}%</span>
            </div>
            <div style={{background:"#1a2740",borderRadius:4,height:6,marginBottom:7}}>
              <div style={{background:"linear-gradient(90deg,#6366f1,#a5b4fc)",height:"100%",borderRadius:4,width:`${profileComplete}%`}}/>
            </div>
            <button onClick={()=>nav("myprofile")} style={{...Btn("none","#334155","4px 10px","11px"),color:"#818cf8",width:"100%",textAlign:"center"}}>Complete Profile →</button>
          </div>

          <nav style={{display:"flex",flexDirection:"column",gap:2}}>
            {[{pg:"home",icon:"⌂",label:"Home"},{pg:"feed",icon:"📰",label:"Feed"},{pg:"explore",icon:"⊞",label:"Rooms",tab:"rooms"},{pg:"explore",icon:"⊙",label:"People",tab:"people"},{pg:"mentors",icon:"🎓",label:"Mentors"},{pg:"schedule",icon:"◷",label:"Schedule"}].map((item,i)=>(
              <button key={i} onClick={()=>nav(item.pg,item.tab)} style={{background:page===item.pg&&(item.tab?activeTab===item.tab:true)?"#162035":"none",border:"none",color:page===item.pg&&(item.tab?activeTab===item.tab:true)?"#c7d2fe":"#64748b",padding:"8px 10px",borderRadius:7,cursor:"pointer",textAlign:"left",fontSize:13,display:"flex",alignItems:"center",gap:9,transition:"all .15s"}}>
                <span style={{fontSize:15,width:20,textAlign:"center"}}>{item.icon}</span>{item.label}
              </button>
            ))}
            <button onClick={()=>setShowPro(true)} style={{background:"linear-gradient(90deg,#1a1040,#1e1560)",border:"1px solid #4338ca",color:"#a5b4fc",padding:"8px 10px",borderRadius:7,cursor:"pointer",textAlign:"left",fontSize:13,display:"flex",alignItems:"center",gap:9,marginTop:2}}>
              <span style={{fontSize:15,width:20,textAlign:"center"}}>⭐</span>StudyMeet Pro
            </button>
          </nav>

          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1a2740"}}>
            <div style={{fontSize:10,color:"#334155",textTransform:"uppercase",letterSpacing:1.1,marginBottom:7}}>Your Subjects</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {(myProfile.subjects||[]).slice(0,4).map(i=><span key={i} style={{fontSize:11,padding:"3px 8px",borderRadius:20,fontFamily:"sans-serif",background:(SC[i]||"#6366f1")+"22",color:SC[i]||"#818cf8",border:`1px solid ${(SC[i]||"#6366f1")}44`}}>{i}</span>)}
            </div>
          </div>

          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1a2740"}}>
            <div style={{fontSize:10,color:"#334155",textTransform:"uppercase",letterSpacing:1.1,marginBottom:7}}>Friends Online</div>
            {USERS.filter(u=>friends.includes(u.id)&&u.online).map(u=>(
              <div key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0",cursor:"pointer"}} onClick={()=>{setViewUser(u);nav("profile");}}>
                <div style={{position:"relative"}}><div style={{...avSt(u.id),width:26,height:26,fontSize:9}}>{u.avatar}</div><span style={{position:"absolute",bottom:0,right:0,color:"#22c55e",fontSize:9}}>●</span></div>
                <span style={{fontSize:12,color:"#94a3b8",fontFamily:"sans-serif"}}>{u.name.split(" ")[0]}</span>
              </div>
            ))}
            {!USERS.filter(u=>friends.includes(u.id)&&u.online).length&&<div style={{fontSize:12,color:"#334155",fontFamily:"sans-serif"}}>No friends online</div>}
          </div>

          {!isMobile&&(
            <>
              <div style={{flex:1}}/>
              <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 6px",borderTop:"1px solid #1a2740",marginTop:6}}>
                <div style={{...avSt(0,true),width:32,height:32,fontSize:11,cursor:"pointer"}} onClick={()=>nav("myprofile")}>{(myProfile.name||"ME").split(" ").map(w=>w[0]).join("").slice(0,2)||"ME"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:"bold",color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{myProfile.name||"You"}</div>
                  <div style={{fontSize:11,color:"#475569"}}>{friends.length} friends</div>
                </div>
                <button style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:16,position:"relative",padding:"4px 6px"}} onClick={()=>setShowNotifs(o=>!o)}>
                  🔔{unread>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#ef4444",color:"#fff",borderRadius:10,fontSize:9,padding:"1px 4px",fontFamily:"sans-serif"}}>{unread}</span>}
                </button>
              </div>
            </>
          )}
        </aside>

        {showNotifs&&<NotifPanel notifs={notifs} setNotifs={setNotifs} onClose={()=>setShowNotifs(false)} isMobile={isMobile}/>}
        {showPro&&<ProModal onClose={()=>setShowPro(false)} isMobile={isMobile}/>}

        <main style={{flex:1,overflowY:"auto",padding:isMobile?"14px 14px 80px":"24px 28px",minWidth:0}}>
          {page==="home"&&<HomePage rooms={ROOMS} users={USERS} friends={friends} myProfile={myProfile} onJoin={r=>{setCurrentRoom(r);nav("room");}} onViewUser={u=>{setViewUser(u);nav("profile");}} onNav={nav} sessions={sessions} isMobile={isMobile} onCreateRoom={()=>setShowModal(true)} onJoinRandom={joinRandom} streak={streak} profileComplete={profileComplete} onShowPro={()=>setShowPro(true)} roomFilter={roomFilter} setRoomFilter={setRoomFilter}/>}
          {page==="feed"&&<FeedPage posts={FEED_POSTS} users={USERS} friends={friends} likedPosts={likedPosts} setLikedPosts={setLikedPosts} onViewUser={u=>{setViewUser(u);nav("profile");}} isMobile={isMobile}/>}
          {page==="explore"&&<ExplorePage rooms={ROOMS} users={USERS} friends={friends} toggleFriend={toggleFriend} myProfile={myProfile} search={search} setSearch={setSearch} activeTab={activeTab} setActiveTab={setActiveTab} onJoin={r=>{setCurrentRoom(r);nav("room");}} onViewUser={u=>{setViewUser(u);nav("profile");}} onCreateRoom={()=>setShowModal(true)} isMobile={isMobile} roomFilter={roomFilter} setRoomFilter={setRoomFilter}/>}
          {page==="mentors"&&<MentorsPage mentors={MENTORS} friends={friends} toggleFriend={toggleFriend} onViewUser={u=>{setViewUser(u);nav("profile");}} isMobile={isMobile}/>}
          {page==="schedule"&&<SchedulePage sessions={sessions} setSessions={setSessions} isMobile={isMobile}/>}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMobile&&(
        <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"#080f1e",borderTop:"1px solid #1a2740",display:"flex",zIndex:80,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          {[{pg:"home",icon:"⌂",label:"Home"},{pg:"feed",icon:"📰",label:"Feed"},{pg:"explore",icon:"⊞",label:"Rooms",tab:"rooms"},{pg:"mentors",icon:"🎓",label:"Mentors"},{pg:"myprofile",icon:"👤",label:"Me",isProfile:true}].map((item,i)=>{
            const active=item.isProfile?page==="myprofile":page===item.pg&&(item.tab?activeTab===item.tab:true);
            return <button key={i} onClick={()=>{if(item.isProfile)nav("myprofile");else nav(item.pg,item.tab);}} style={{flex:1,background:"none",border:"none",color:active?"#818cf8":"#475569",padding:"10px 0 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:17}}>
              <span>{item.icon}</span><span style={{fontSize:9,fontFamily:"sans-serif"}}>{item.label}</span>
            </button>;
          })}
        </nav>
      )}

      {showModal&&<ScheduleModal onClose={()=>setShowModal(false)} onSave={s=>{setSessions(p=>[...p,{...s,id:Date.now(),host:myProfile.name||"You",attendees:[myProfile.name||"You"]}]);setShowModal(false);}} isMobile={isMobile}/>}
    </div>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function HomePage({rooms,users,friends,myProfile,onJoin,onViewUser,onNav,sessions,isMobile,onCreateRoom,onJoinRandom,streak,profileComplete,onShowPro,roomFilter,setRoomFilter}){
  const upcoming=sessions.filter(s=>new Date(s.date)>=new Date()).slice(0,2);
  const filtRooms=rooms.filter(r=>r.active&&(roomFilter==="All"||r.subject===roomFilter||(roomFilter==="Specialty"&&!["Step 1","Step 2 CK","Match Prep"].includes(r.subject)))).slice(0,3);

  return (
    <div>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#0f1e3a 0%,#0b1120 100%)",border:"1px solid #1a2740",borderRadius:14,padding:isMobile?"18px 15px":"36px 32px",marginBottom:18}}>
        <div style={{fontSize:11,color:"#64748b",fontFamily:"sans-serif",marginBottom:5,letterSpacing:.5}}>THE #1 COMMUNITY FOR IMGs & USMLE STUDENTS 🩺</div>
        <h1 style={{fontSize:isMobile?22:32,fontWeight:"bold",margin:"0 0 8px",color:"#f1f5f9",lineHeight:1.25}}>
          {myProfile.name?`Welcome back, ${myProfile.name.split(" ")[0]}. `:""}
          <em style={{fontStyle:"italic",color:"#a5b4fc"}}>Study smarter. Match stronger.</em>
        </h1>
        <p style={{color:"#94a3b8",fontSize:isMobile?13:14,fontFamily:"sans-serif",margin:"0 0 16px",lineHeight:1.5}}>Connect with IMGs worldwide. Study USMLE together, share resources, and ace your match.</p>
        <button onClick={onJoinRandom} style={{width:"100%",background:"linear-gradient(90deg,#4f46e5,#7c3aed)",border:"none",color:"#fff",padding:isMobile?"13px 0":"15px 0",borderRadius:10,cursor:"pointer",fontSize:isMobile?14:15,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:11,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 0 24px #6366f133"}}>
          ⚡ Join Random Study Room <span style={{fontSize:11,background:"#ffffff22",padding:"2px 8px",borderRadius:20}}>Start now</span>
        </button>
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
          <button style={Btn("#6366f1","none","8px 14px","12px")} onClick={()=>onNav("explore","rooms")}>🏠 Browse Rooms</button>
          <button style={Btn("#0f1e35","#334155","8px 14px","12px")} onClick={()=>onNav("explore","people")}>👥 Find Partners</button>
          <button style={Btn("#0f1e35","#334155","8px 14px","12px")} onClick={onCreateRoom}>＋ Create Room</button>
          <button style={Btn("#0f1e35","#334155","8px 14px","12px")} onClick={()=>onNav("schedule")}>◷ My Schedule</button>
        </div>
        <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:8,marginTop:14}}>
          {[{n:"4,127",l:"IMGs Worldwide"},{n:"134",l:"Live Rooms"},{n:"61",l:"Countries"}].map(s=>(
            <div key={s.l} style={{background:"#080f1e",borderRadius:9,padding:isMobile?"8px 13px":"12px 14px",border:"1px solid #1a2740",display:"flex",alignItems:"center",gap:isMobile?10:0,flexDirection:isMobile?"row":"column",flex:isMobile?0:1}}>
              <div style={{fontSize:isMobile?18:22,fontWeight:"bold",color:"#818cf8"}}>{s.n}</div>
              <div style={{fontSize:11,color:"#475569",fontFamily:"sans-serif",marginTop:isMobile?0:1}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak + Profile */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:11,marginBottom:18}}>
        <div style={{background:"linear-gradient(90deg,#1c0a00,#2d1200)",border:"1px solid #7c2d12",borderRadius:12,padding:"13px 15px",display:"flex",alignItems:"center",gap:13}}>
          <span style={{fontSize:30}}>🔥</span>
          <div><div style={{fontSize:15,fontWeight:"bold",color:"#fed7aa"}}>{streak} Day Streak!</div><div style={{fontSize:11,color:"#fb923c",fontFamily:"sans-serif"}}>Keep studying daily to maintain it</div></div>
        </div>
        <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:12,padding:"13px 15px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,color:"#94a3b8",fontFamily:"sans-serif"}}>Profile Completion</span><span style={{fontSize:13,fontWeight:"bold",color:"#818cf8"}}>{profileComplete}%</span></div>
          <div style={{background:"#1a2740",borderRadius:4,height:6,marginBottom:7}}><div style={{background:"linear-gradient(90deg,#6366f1,#a5b4fc)",height:"100%",borderRadius:4,width:`${profileComplete}%`}}/></div>
          <button onClick={()=>onNav("myprofile")} style={{...Btn("none","#334155","4px 12px","11px"),color:"#818cf8"}}>Complete Profile →</button>
        </div>
      </div>

      {/* Room filters */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {FILTERS.map(f=><button key={f} onClick={()=>setRoomFilter(f)} style={{background:roomFilter===f?"#6366f1":"#0f1e35",border:`1px solid ${roomFilter===f?"#6366f1":"#1a2740"}`,color:roomFilter===f?"#fff":"#64748b",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>{f}</button>)}
      </div>

      {upcoming.length>0&&<Sec title="Upcoming Sessions" action={()=>onNav("schedule")} aLabel="View all"><div style={{display:"flex",flexDirection:"column",gap:9}}>{upcoming.map(s=><SessCard key={s.id} s={s}/>)}</div></Sec>}

      <Sec title="Live Rooms" action={()=>onNav("explore","rooms")} aLabel="See all">
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(225px,1fr))",gap:11}}>
          {filtRooms.map(r=><RoomCard key={r.id} room={r} onJoin={()=>onJoin(r)}/>)}
        </div>
      </Sec>

      <Sec title="IMGs Studying Now" action={()=>onNav("explore","people")} aLabel="See all">
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(170px,1fr))",gap:11}}>
          {users.filter(u=>u.online).slice(0,4).map(u=><PersonCard key={u.id} user={u} onView={()=>onViewUser(u)}/>)}
        </div>
      </Sec>

      {/* Pro teaser */}
      <div style={{background:"linear-gradient(135deg,#1a1040,#0f1e35)",border:"1px solid #4338ca",borderRadius:14,padding:isMobile?"15px":"20px 24px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><span style={{fontSize:17}}>⭐</span><span style={{fontSize:14,fontWeight:"bold",color:"#c7d2fe"}}>StudyMeet Pro</span><span style={{background:"#4338ca",color:"#a5b4fc",fontSize:10,padding:"2px 7px",borderRadius:20,fontFamily:"sans-serif"}}>NEW</span></div>
          <div style={{fontSize:12,color:"#94a3b8",fontFamily:"sans-serif"}}>AI study assistant · Private groups · Profile boost · Advanced matching</div>
        </div>
        <button onClick={onShowPro} style={Btn("#4f46e5","none","9px 16px","12px")}>Upgrade Free →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FEED PAGE
// ─────────────────────────────────────────────
function FeedPage({posts,users,friends,likedPosts,setLikedPosts,onViewUser,isMobile}){
  const toggleLike=id=>setLikedPosts(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return (
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <h2 style={{fontSize:isMobile?17:20,fontWeight:"bold",color:"#f1f5f9",marginBottom:16}}>IMG Community Feed</h2>
      {/* Post composer */}
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:12,padding:"13px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{...avSt(0,true),width:34,height:34,fontSize:11,flexShrink:0}}>ME</div>
        <div style={{flex:1}}>
          <div style={{background:"#080f1e",border:"1px solid #1a2740",borderRadius:8,padding:"10px 12px",color:"#475569",fontFamily:"sans-serif",fontSize:13,cursor:"text"}}>Share a tip, resource, or question with the community…</div>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button style={Btn("#6366f1","none","6px 12px","12px")}>Post</button>
            <button style={{...Btn("#0f1e35","#334155","6px 12px","12px"),color:"#94a3b8"}}>📎 Resource</button>
          </div>
        </div>
      </div>
      {posts.map(p=>{
        const liked=likedPosts.includes(p.id);
        return (
          <div key={p.id} style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:12,padding:"14px",marginBottom:12}}>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <div style={{...avSt(p.uid),width:38,height:38,fontSize:13,flexShrink:0,cursor:"pointer"}} onClick={()=>onViewUser(users.find(u=>u.id===p.uid))}>{p.avatar}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                  <span style={{fontSize:14,fontWeight:"bold",color:"#f1f5f9",cursor:"pointer"}} onClick={()=>onViewUser(users.find(u=>u.id===p.uid))}>{p.user}</span>
                  <span style={{fontSize:13}}>{p.flag}</span>
                  <span style={{fontSize:11,color:"#475569",fontFamily:"sans-serif"}}>{p.time}</span>
                </div>
                <span style={{fontSize:11,color:p.stage==="Matched!"?"#22c55e":"#818cf8",background:p.stage==="Matched!"?"#14532d":"#1e1b6e",padding:"2px 7px",borderRadius:20,fontFamily:"sans-serif"}}>{p.stage}</span>
              </div>
            </div>
            <p style={{fontFamily:"sans-serif",fontSize:13,color:"#cbd5e1",lineHeight:1.6,marginBottom:12}}>{p.text}</p>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <button onClick={()=>toggleLike(p.id)} style={{background:"none",border:"none",color:liked?"#ef4444":"#64748b",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:4,padding:0}}>
                {liked?"❤️":"🤍"} {p.likes+(liked?1:0)}
              </button>
              <button style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:4,padding:0}}>💬 {p.comments}</button>
              <button style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"sans-serif",marginLeft:"auto",padding:0}}>↗ Share</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// EXPLORE PAGE
// ─────────────────────────────────────────────
function ExplorePage({rooms,users,friends,toggleFriend,myProfile,search,setSearch,activeTab,setActiveTab,onJoin,onViewUser,onCreateRoom,isMobile,roomFilter,setRoomFilter}){
  const fRooms=rooms.filter(r=>r.title.toLowerCase().includes(search.toLowerCase())&&(roomFilter==="All"||r.subject===roomFilter||(roomFilter==="Specialty"&&!["Step 1","Step 2 CK","Match Prep"].includes(r.subject))));
  const fUsers=users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:"flex",gap:4,marginBottom:11,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:3,flex:1}}>
          {["rooms","people"].map(t=><button key={t} onClick={()=>setActiveTab(t)} style={{background:activeTab===t?"#162035":"none",border:"none",color:activeTab===t?"#c7d2fe":"#64748b",padding:"7px 12px",borderRadius:7,cursor:"pointer",fontSize:12,fontFamily:"sans-serif",textTransform:"capitalize"}}>{t}</button>)}
        </div>
        {activeTab==="rooms"&&<button style={Btn("#6366f1","none","7px 12px","12px")} onClick={onCreateRoom}>＋ Create Room</button>}
      </div>
      <input placeholder={activeTab==="rooms"?"Search rooms…":"Search IMGs worldwide…"} value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",boxSizing:"border-box",background:"#0f1e35",border:"1px solid #1a2740",color:"#e2e8f0",padding:"9px 12px",borderRadius:8,fontSize:13,fontFamily:"sans-serif",outline:"none",marginBottom:11}}/>
      {activeTab==="rooms"&&(
        <>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
            {FILTERS.map(f=><button key={f} onClick={()=>setRoomFilter(f)} style={{background:roomFilter===f?"#6366f1":"#0f1e35",border:`1px solid ${roomFilter===f?"#6366f1":"#1a2740"}`,color:roomFilter===f?"#fff":"#64748b",padding:"4px 11px",borderRadius:20,cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>{f}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(225px,1fr))",gap:11}}>
            {fRooms.map(r=><RoomCard key={r.id} room={r} onJoin={()=>onJoin(r)}/>)}
            {!fRooms.length&&<Empty text="No rooms match. Create one!"/>}
          </div>
        </>
      )}
      {activeTab==="people"&&(
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(170px,1fr))",gap:11}}>
          {fUsers.map(u=><PersonCard key={u.id} user={u} isFriend={friends.includes(u.id)} onToggle={()=>toggleFriend(u.id)} onView={()=>onViewUser(u)} showConnect/>)}
          {!fUsers.length&&<Empty text="No IMGs match your search."/>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MENTORS PAGE
// ─────────────────────────────────────────────
function MentorsPage({mentors,friends,toggleFriend,onViewUser,isMobile}){
  return (
    <div>
      <div style={{marginBottom:18}}>
        <h2 style={{fontSize:isMobile?17:20,fontWeight:"bold",color:"#f1f5f9",marginBottom:6}}>IMG Mentors</h2>
        <p style={{fontFamily:"sans-serif",fontSize:13,color:"#64748b",lineHeight:1.5}}>Connect with matched IMGs and high-scorers who have been where you are. Get real advice on ERAS, Step exams, and interviews.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {mentors.map(m=>(
          <div key={m.id} style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:13,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#1a1040,#0f1e35)",padding:"18px 16px 14px",borderBottom:"1px solid #1a2740"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{position:"relative"}}>
                  <div style={{...avSt(m.id),width:48,height:48,fontSize:15}}>{m.avatar}</div>
                  {m.stage==="Matched!"&&<span style={{position:"absolute",bottom:-2,right:-2,fontSize:13}}>✅</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,fontWeight:"bold",color:"#f1f5f9",cursor:"pointer"}} onClick={()=>onViewUser(m)}>{m.name}</span>
                    <span>{m.flag}</span>
                  </div>
                  <div style={{fontSize:12,color:"#64748b",fontFamily:"sans-serif"}}>{m.specialty} · {m.stage}</div>
                  {m.score&&<div style={{fontSize:12,color:"#818cf8",fontFamily:"sans-serif",marginTop:2}}>Step 1: {m.score}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:3,marginTop:10}}>
                <span style={{fontSize:11,color:"#f59e0b",marginRight:2}}>{"★".repeat(Math.round(m.rating))}</span>
                <span style={{fontSize:11,color:"#64748b",fontFamily:"sans-serif"}}>{m.rating} · helped {m.helped} IMGs</span>
              </div>
            </div>
            <div style={{padding:"13px 16px"}}>
              <p style={{fontFamily:"sans-serif",fontSize:12,color:"#94a3b8",lineHeight:1.5,marginBottom:12}}>{m.bio}</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>toggleFriend(m.id)} style={{...Btn(friends.includes(m.id)?"#ef4444":"#6366f1","none","7px 14px","12px"),flex:1}}>{friends.includes(m.id)?"Connected ✓":"Request Mentorship"}</button>
                <button onClick={()=>onViewUser(m)} style={{...Btn("none","#334155","7px 12px","12px"),color:"#94a3b8"}}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCHEDULE PAGE
// ─────────────────────────────────────────────
function SchedulePage({sessions,setSessions,isMobile}){
  const [showModal,setShowModal]=useState(false);
  const upcoming=sessions.filter(s=>new Date(s.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const past=sessions.filter(s=>new Date(s.date)<new Date());
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontSize:isMobile?17:20,fontWeight:"bold",color:"#f1f5f9",margin:0}}>My Schedule</h2>
        <button style={Btn("#6366f1")} onClick={()=>setShowModal(true)}>＋ New Session</button>
      </div>
      <Sec title={`Upcoming (${upcoming.length})`}>
        {upcoming.length?<div style={{display:"flex",flexDirection:"column",gap:9}}>{upcoming.map(s=><SessCard key={s.id} s={s} full/>)}</div>:<Empty text="No upcoming sessions. Schedule one now!"/>}
      </Sec>
      {past.length>0&&<Sec title="Past Sessions"><div style={{display:"flex",flexDirection:"column",gap:9,opacity:.6}}>{past.map(s=><SessCard key={s.id} s={s} full/>)}</div></Sec>}
      {showModal&&<ScheduleModal onClose={()=>setShowModal(false)} onSave={s=>{setSessions(p=>[...p,{...s,id:Date.now(),host:"You",attendees:["You"]}]);setShowModal(false);}} isMobile={isMobile}/>}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFILE PAGES
// ─────────────────────────────────────────────
function ProfilePage({user,friends,toggleFriend,onBack,isMobile}){
  const isFriend=friends.includes(user.id);
  return (
    <div style={{background:"#0b1120",minHeight:"100vh",padding:isMobile?"14px 14px 80px":"24px 28px",fontFamily:"'Palatino Linotype',Palatino,serif",color:"#e2e8f0"}}>
      <button onClick={onBack} style={{...Btn("none","#1a2740","6px 13px","12px"),color:"#64748b",marginBottom:14}}>← Back</button>
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:14,padding:isMobile?14:22,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
          <div style={{...avSt(user.id),width:60,height:60,fontSize:18}}>{user.avatar}</div>
          <div style={{flex:1,minWidth:140}}>
            <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap",marginBottom:3}}>
              <h2 style={{fontSize:isMobile?17:20,fontWeight:"bold",color:"#f1f5f9",margin:0}}>{user.name}</h2>
              <span style={{fontSize:14}}>{user.flag}</span>
              {user.online?<span style={{fontSize:11,color:"#22c55e",fontFamily:"sans-serif"}}>🟢 Online now</span>:<span style={{fontSize:11,color:"#475569",fontFamily:"sans-serif"}}>⚫ Offline</span>}
            </div>
            <div style={{fontSize:12,color:"#64748b",fontFamily:"sans-serif",marginBottom:5}}>{user.country} · 🎯 Match {user.matchYear} · {user.specialty}</div>
            <div style={{fontSize:12,color:"#94a3b8",fontFamily:"sans-serif",background:"#162035",padding:"3px 9px",borderRadius:20,display:"inline-block",marginBottom:6}}>{user.stage}</div>
            <p style={{color:"#94a3b8",fontFamily:"sans-serif",fontSize:13,margin:"0 0 8px",lineHeight:1.4}}>{user.bio}</p>
            <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:9}}><span style={{fontSize:16}}>🔥</span><span style={{fontSize:13,color:"#fed7aa",fontWeight:"bold"}}>{user.streak} day streak</span></div>
            {user.score&&<div style={{fontSize:12,color:"#818cf8",fontFamily:"sans-serif",marginBottom:6}}>Step 1 Score: <strong>{user.score}</strong></div>}
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {[{n:user.sessions,l:"Sessions"},{n:user.friends,l:"Friends"},{n:user.interests.length,l:"Subjects"}].map(s=>(
                <div key={s.l}><span style={{fontSize:14,fontWeight:"bold",color:"#818cf8"}}>{s.n}</span><span style={{fontSize:12,color:"#475569",fontFamily:"sans-serif"}}> {s.l}</span></div>
              ))}
            </div>
          </div>
          <button onClick={()=>toggleFriend(user.id)} style={Btn(isFriend?"#ef4444":"#6366f1","none","8px 14px","12px")}>{isFriend?"Disconnect":"Connect"}</button>
        </div>
      </div>
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:12,padding:14}}>
        <div style={{fontSize:11,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:9,fontFamily:"sans-serif"}}>Studying</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{user.interests.map(i=><span key={i} style={{fontSize:12,padding:"4px 10px",borderRadius:20,fontFamily:"sans-serif",color:SC[i]||"#818cf8",background:(SC[i]||"#6366f1")+"22"}}>{i}</span>)}</div>
      </div>
    </div>
  );
}

function MyProfilePage({profile,streak,profileComplete,friends,sessions,onBack,isMobile}){
  const incomplete=[!profile.bio&&"Add a bio",!profile.stage&&"Set your exam stage",profile.subjects.length===0&&"Choose subjects"].filter(Boolean);
  return (
    <div style={{background:"#0b1120",minHeight:"100vh",padding:isMobile?"14px 14px 80px":"24px 28px",fontFamily:"'Palatino Linotype',Palatino,serif",color:"#e2e8f0"}}>
      <button onClick={onBack} style={{...Btn("none","#1a2740","6px 13px","12px"),color:"#64748b",marginBottom:14}}>← Back</button>
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:14,padding:isMobile?14:22,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
          <div style={{...avSt(0,true),width:60,height:60,fontSize:18}}>{(profile.name||"ME").split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
          <div style={{flex:1}}>
            <h2 style={{fontSize:isMobile?17:20,fontWeight:"bold",color:"#f1f5f9",margin:"0 0 3px"}}>{profile.name||"Your Name"}</h2>
            <div style={{fontSize:12,color:"#64748b",fontFamily:"sans-serif",marginBottom:6}}>{profile.flag} {profile.country} · 🎯 Match {profile.matchYear} · {profile.specialty}</div>
            <div style={{fontSize:12,color:"#94a3b8",fontFamily:"sans-serif",background:"#162035",padding:"3px 9px",borderRadius:20,display:"inline-block",marginBottom:8}}>{profile.stage}</div>
            <p style={{color:"#94a3b8",fontFamily:"sans-serif",fontSize:13,lineHeight:1.4,marginBottom:8}}>{profile.bio||"No bio yet."}</p>
            <div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:16}}>🔥</span><span style={{fontSize:13,color:"#fed7aa",fontWeight:"bold"}}>{streak} day streak</span></div>
          </div>
        </div>
      </div>
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:12,padding:14,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:13,color:"#94a3b8",fontFamily:"sans-serif"}}>Profile Completion</span><span style={{fontSize:13,fontWeight:"bold",color:"#818cf8"}}>{profileComplete}%</span></div>
        <div style={{background:"#1a2740",borderRadius:4,height:7,marginBottom:8}}><div style={{background:"linear-gradient(90deg,#6366f1,#a5b4fc)",height:"100%",borderRadius:4,width:`${profileComplete}%`}}/></div>
        {incomplete.length>0&&<div style={{display:"flex",flexDirection:"column",gap:5}}>
          {incomplete.map(t=><div key={t} style={{fontSize:12,color:"#f59e0b",fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:6}}>⚠ {t}</div>)}
        </div>}
      </div>
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:12,padding:14}}>
        <div style={{fontSize:11,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:9,fontFamily:"sans-serif"}}>Your Subjects</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(profile.subjects||[]).map(i=><span key={i} style={{fontSize:12,padding:"4px 10px",borderRadius:20,fontFamily:"sans-serif",color:SC[i]||"#818cf8",background:(SC[i]||"#6366f1")+"22"}}>{i}</span>)}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOM / CHAT PAGE
// ─────────────────────────────────────────────
function RoomPage({room,messages,onSend,onBack,isMobile}){
  const [input,setInput]=useState("");
  const bottomRef=useRef(null);
  const c=SC[room.subject]||"#6366f1";
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send=()=>{if(input.trim()){onSend(input.trim());setInput("");}};
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#0b1120",color:"#e2e8f0",fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{background:"#080f1e",borderBottom:"1px solid #1a2740",padding:"11px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button onClick={onBack} style={{...Btn("none","#1a2740","5px 11px","12px"),color:"#64748b"}}>← Leave</button>
        <div style={{width:9,height:9,borderRadius:"50%",background:c,flexShrink:0}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:"bold",color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{room.title}</div>
          <div style={{fontSize:11,color:"#64748b",fontFamily:"sans-serif"}}>{room.subject} · {room.members}/{room.max} members</div>
        </div>
        {room.active&&<span style={{fontSize:11,color:"#22c55e",fontWeight:"bold",flexShrink:0}}>● LIVE</span>}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:9}}>
        <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:9,padding:"10px 13px",marginBottom:4,fontFamily:"sans-serif",fontSize:12,color:"#64748b",lineHeight:1.5}}>📌 {room.desc}</div>
        {!messages.length&&<div style={{color:"#475569",textAlign:"center",marginTop:32,fontFamily:"sans-serif",fontSize:13}}>No messages yet. Say hi! 👋</div>}
        {messages.map(m=>(
          <div key={m.id} style={{display:"flex",gap:8,alignItems:"flex-start",flexDirection:m.uid===0?"row-reverse":"row"}}>
            {m.uid!==0&&<div style={{...avSt(m.uid),width:28,height:28,fontSize:10,flexShrink:0}}>{m.user.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>}
            <div>
              {m.uid!==0&&<div style={{fontSize:11,color:"#64748b",fontFamily:"sans-serif",marginBottom:2}}>{m.user} <span style={{color:"#334155"}}>{m.time}</span></div>}
              <div style={{background:m.uid===0?"#4f46e5":"#162035",padding:"8px 12px",borderRadius:10,fontSize:13,fontFamily:"sans-serif",color:"#e2e8f0",maxWidth:280,lineHeight:1.45}}>{m.text}</div>
              {m.uid===0&&<div style={{fontSize:10,color:"#475569",textAlign:"right",marginTop:2}}>{m.time}</div>}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,padding:"10px 13px",borderTop:"1px solid #1a2740",background:"#080f1e",flexShrink:0,paddingBottom:"calc(10px + env(safe-area-inset-bottom,0px))"}}>
        <input style={{flex:1,background:"#162035",border:"1px solid #1a2740",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,fontFamily:"sans-serif",outline:"none"}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message the group…"/>
        <button onClick={send} style={{background:"#6366f1",border:"none",color:"#fff",width:38,height:38,borderRadius:8,cursor:"pointer",fontSize:17,flexShrink:0}}>↑</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────
function NotifPanel({notifs,setNotifs,onClose,isMobile}){
  const icons={friend:"👥",room:"🏠",session:"📅",message:"💬",streak:"🔥",mentor:"🎓"};
  return (
    <div style={{position:"fixed",top:0,right:0,width:isMobile?"100vw":"300px",height:"100vh",background:"#080f1e",borderLeft:"1px solid #1a2740",zIndex:110,display:"flex",flexDirection:"column",boxShadow:"-8px 0 32px #00000066"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 15px",borderBottom:"1px solid #1a2740",flexShrink:0}}>
        <span style={{fontSize:15,fontWeight:"bold",color:"#f1f5f9"}}>Notifications</span>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))} style={{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>Mark all read</button>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1}}>
        {notifs.map(n=>(
          <div key={n.id} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 15px",cursor:"pointer",borderBottom:"1px solid #0f1e35",background:n.read?"transparent":"#0f1e35"}}>
            <div style={{fontSize:17,flexShrink:0}}>{icons[n.type]||"🔔"}</div>
            <div style={{flex:1}}><div style={{fontSize:13,color:"#cbd5e1",fontFamily:"sans-serif",lineHeight:1.4}}>{n.text}</div><div style={{fontSize:11,color:"#475569",fontFamily:"sans-serif",marginTop:3}}>{n.time}</div></div>
            {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#6366f1",flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProModal({onClose,isMobile}){
  const features=[{icon:"🤖",t:"AI Study Assistant",d:"Personalized explanations + weak-area detection"},{icon:"♾️",t:"Unlimited Room Creation",d:"Create as many study rooms as you need"},{icon:"🔒",t:"Private Study Groups",d:"Invite-only rooms for your close circle"},{icon:"🎯",t:"Advanced IMG Matching",d:"Matched with IMGs at your exact stage"},{icon:"🚀",t:"Profile Boost",d:"Get seen first by study partners & mentors"},{icon:"📊",t:"Study Analytics",d:"Track hours, streaks, and progress over time"}];
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:"#080f1e",border:"1px solid #4338ca",borderRadius:isMobile?"16px 16px 0 0":"16px",width:isMobile?"100%":"92%",maxWidth:460,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{background:"linear-gradient(135deg,#1a1040,#0f1540)",padding:"18px 20px 14px",borderBottom:"1px solid #4338ca",position:"sticky",top:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span style={{fontSize:20}}>⭐</span><span style={{fontSize:18,fontWeight:"bold",color:"#c7d2fe"}}>StudyMeet Pro</span></div><div style={{fontSize:12,color:"#818cf8",fontFamily:"sans-serif"}}>Everything you need to match successfully</div></div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:20}}>✕</button>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:5,marginTop:12}}><span style={{fontSize:30,fontWeight:"bold",color:"#f1f5f9"}}>$9</span><span style={{fontSize:13,color:"#64748b",fontFamily:"sans-serif"}}>/month · Cancel anytime</span></div>
        </div>
        <div style={{padding:"14px 18px"}}>{features.map(f=>(
          <div key={f.t} style={{display:"flex",gap:11,alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #0f1e35"}}>
            <span style={{fontSize:19,flexShrink:0}}>{f.icon}</span>
            <div><div style={{fontSize:13,fontWeight:"bold",color:"#e2e8f0",marginBottom:2}}>{f.t}</div><div style={{fontSize:12,color:"#64748b",fontFamily:"sans-serif",lineHeight:1.4}}>{f.d}</div></div>
            <span style={{marginLeft:"auto",color:"#22c55e",fontSize:15,flexShrink:0}}>✓</span>
          </div>
        ))}</div>
        <div style={{padding:"12px 18px 18px",position:"sticky",bottom:0,background:"#080f1e",borderTop:"1px solid #1a2740"}}>
          <button style={{width:"100%",background:"linear-gradient(90deg,#4f46e5,#7c3aed)",border:"none",color:"#fff",padding:"13px 0",borderRadius:10,cursor:"pointer",fontSize:14,fontFamily:"sans-serif",fontWeight:"bold"}}>Start 7-Day Free Trial</button>
          <button onClick={onClose} style={{width:"100%",background:"none",border:"none",color:"#475569",padding:"9px 0",cursor:"pointer",fontSize:12,fontFamily:"sans-serif",marginTop:2}}>Continue with Free</button>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({onClose,onSave,isMobile}){
  const [form,setForm]=useState({title:"",subject:"Step 1",date:"",time:"14:00",duration:60,maxAttendees:6,notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=form.title&&form.date;
  const iSt={width:"100%",background:"#080f1e",border:"1px solid #1a2740",color:"#e2e8f0",padding:"8px 11px",borderRadius:8,fontSize:13,fontFamily:"sans-serif",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{position:"fixed",inset:0,background:"#000000bb",display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:"#0f1e35",border:"1px solid #1a2740",borderRadius:isMobile?"16px 16px 0 0":"16px",width:isMobile?"100%":"92%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 17px",borderBottom:"1px solid #1a2740",position:"sticky",top:0,background:"#0f1e35"}}>
          <span style={{fontSize:14,fontWeight:"bold",color:"#f1f5f9"}}>New Study Session</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        <div style={{padding:"15px 17px",display:"flex",flexDirection:"column",gap:12}}>
          {[["Title","title","text","e.g. Step 1 Cardio Sprint"],["Notes","notes","text","What will you cover?"]].map(([l,k,t,ph])=>(
            <div key={k} style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={labelSt}>{l}</label>
              {k==="notes"?<textarea value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{...iSt,height:58,resize:"none"}}/>:<input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={iSt}/>}
            </div>
          ))}
          <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={labelSt}>Subject</label><select value={form.subject} onChange={e=>set("subject",e.target.value)} style={iSt}>{SUBJECTS.map(i=><option key={i}>{i}</option>)}</select></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Date","date","date"],["Time","time","time"]].map(([l,k,t])=>(
              <div key={k} style={{display:"flex",flexDirection:"column",gap:4}}><label style={labelSt}>{l}</label><input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={iSt}/></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Duration (min)","duration"],["Max Attendees","maxAttendees"]].map(([l,k])=>(
              <div key={k} style={{display:"flex",flexDirection:"column",gap:4}}><label style={labelSt}>{l}</label><input type="number" value={form[k]} onChange={e=>set(k,+e.target.value)} style={iSt} min={k==="duration"?15:2}/></div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:9,padding:"11px 17px",borderTop:"1px solid #1a2740",position:"sticky",bottom:0,background:"#0f1e35"}}>
          <button onClick={onClose} style={{...Btn("none","#334155"),color:"#94a3b8"}}>Cancel</button>
          <button onClick={()=>valid&&onSave(form)} style={{...Btn("#6366f1"),opacity:valid?1:0.4}}>Create</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
function RoomCard({room,onJoin}){
  const c=SC[room.subject]||"#6366f1";const full=room.members>=room.max;
  return (
    <div style={{background:"#0f1e35",borderRadius:12,overflow:"hidden",border:"1px solid #1a2740"}}>
      <div style={{height:3,background:c}}/>
      <div style={{padding:"12px 13px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,fontFamily:"sans-serif",fontWeight:"bold",color:c,background:c+"22"}}>{room.subject}</span>
          {room.active?<span style={{fontSize:11,color:"#22c55e",fontFamily:"sans-serif",fontWeight:"bold"}}>● LIVE</span>:<span style={{fontSize:11,color:"#475569",fontFamily:"sans-serif"}}>○ Scheduled</span>}
        </div>
        <div style={{fontSize:14,fontWeight:"bold",color:"#f1f5f9",marginBottom:2,lineHeight:1.3}}>{room.title}</div>
        <div style={{fontSize:12,color:"#64748b",fontFamily:"sans-serif",marginBottom:7}}>by {room.host}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:9}}>{room.tags.map(t=><span key={t} style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:"#162035",color:"#64748b",fontFamily:"sans-serif"}}>{t}</span>)}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"#475569",fontFamily:"sans-serif"}}>👤 {room.members}/{room.max}</span>
          <button onClick={onJoin} disabled={full} style={Btn(full?"#1a2740":"#6366f1","none","5px 13px","12px")}>{full?"Full":"Join →"}</button>
        </div>
      </div>
    </div>
  );
}

function PersonCard({user,isFriend,onToggle,onView,showConnect}){
  return (
    <div style={{background:"#0f1e35",borderRadius:12,padding:"12px 10px",border:"1px solid #1a2740",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
      <div style={{position:"relative",marginBottom:7}}>
        <div style={{...avSt(user.id),width:40,height:40,fontSize:13,cursor:"pointer"}} onClick={onView}>{user.avatar}</div>
        <span style={{position:"absolute",bottom:-1,right:-2,fontSize:12}}>{user.online?"🟢":"⚫"}</span>
      </div>
      <div style={{fontSize:13,fontWeight:"bold",color:"#f1f5f9",cursor:"pointer",marginBottom:2}} onClick={onView}>{user.name}</div>
      <div style={{fontSize:11,color:"#64748b",fontFamily:"sans-serif",marginBottom:4}}>{user.flag} {user.country}</div>
      <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:5}}><span style={{fontSize:11}}>🔥</span><span style={{fontSize:11,color:"#fed7aa",fontFamily:"sans-serif"}}>{user.streak}d</span></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginBottom:showConnect?6:0}}>
        {user.interests.map(i=><span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:20,color:SC[i]||"#818cf8",background:(SC[i]||"#6366f1")+"22",fontFamily:"sans-serif"}}>{i}</span>)}
      </div>
      {showConnect&&onToggle&&<button onClick={onToggle} style={{...Btn("none",isFriend?"#ef4444":"#334155","4px 12px","11px"),color:isFriend?"#ef4444":"#818cf8",marginTop:4,width:"100%"}}>{isFriend?"Connected ✓":"Connect"}</button>}
    </div>
  );
}

function SessCard({s,full}){
  const c=SC[s.subject]||"#6366f1";
  return (
    <div style={{background:"#0f1e35",borderRadius:12,border:"1px solid #1a2740",display:"flex",overflow:"hidden"}}>
      <div style={{width:4,background:c,flexShrink:0}}/>
      <div style={{padding:"11px 13px",flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
          <div><div style={{fontSize:14,fontWeight:"bold",color:"#f1f5f9",marginBottom:3}}>{s.title}</div><div style={{fontSize:12,color:"#64748b",fontFamily:"sans-serif"}}>{fmtDate(s.date)} at {s.time} · {s.duration}min · {s.host}</div></div>
          <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,color:c,background:c+"22",fontFamily:"sans-serif",fontWeight:"bold",flexShrink:0}}>{s.subject}</span>
        </div>
        {full&&s.notes&&<div style={{fontSize:12,color:"#94a3b8",fontFamily:"sans-serif",fontStyle:"italic",marginTop:5}}>{s.notes}</div>}
        {full&&<div style={{fontSize:12,color:"#475569",fontFamily:"sans-serif",marginTop:4}}>{s.attendees.length}/{s.maxAttendees} attendees</div>}
      </div>
    </div>
  );
}

function Sec({title,action,aLabel,children}){
  return (
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:14,fontWeight:"bold",color:"#f1f5f9"}}>{title}</span>
        {action&&<button onClick={action} style={{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>{aLabel} →</button>}
      </div>
      {children}
    </div>
  );
}

function Empty({text}){return <div style={{color:"#475569",textAlign:"center",padding:"26px 0",fontFamily:"sans-serif",fontSize:13,gridColumn:"1/-1"}}>{text}</div>;}
