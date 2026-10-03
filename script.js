const DEFAULT_DATA = {
  siteName: "Zabit Hayat Tele",
  description: "Save the this website for updates and new links.",
  password: "zabit123",
  posts: Array.from({length:8}, (_,i)=>({
    title: `New Update ${String(i+1).padStart(2,"0")}`,
    description: "Add your latest information, announcement or useful link here.",
    link: "#"
  })),
  socials: {
    Telegram: "@zabithayattele",
    Pinterest: "@zabithayattele",
    VK: "@zabithayattele",
    "Facebook Page": "Zabit Hayat Tele"
  }
};

let data = loadData();

function loadData(){
  try{
    const saved = localStorage.getItem("zabitHayatTeleData");
    if(saved) return {...DEFAULT_DATA, ...JSON.parse(saved)};
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function saveData(){ localStorage.setItem("zabitHayatTeleData", JSON.stringify(data)); }
function esc(s=""){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function render(){
  document.getElementById("siteName").textContent=data.siteName;
  document.getElementById("siteDescription").textContent=data.description;
  document.title=data.siteName;
  document.getElementById("postCount").textContent=String(data.posts.length).padStart(2,"0");
  document.getElementById("year").textContent=new Date().getFullYear();

  const grid=document.getElementById("postsGrid");
  grid.innerHTML=data.posts.map((p,i)=>`
    <article class="post">
      <span class="post-number">POST ${String(i+1).padStart(2,"0")}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <a class="post-link" href="${safeUrl(p.link)}" ${isExternal(p.link)?'target="_blank" rel="noopener"':''}>OPEN LINK ↗</a>
    </article>`).join("");

  const socialGrid=document.getElementById("socialGrid");
  socialGrid.innerHTML=Object.entries(data.socials).map(([name,value])=>`
    <a class="social" href="${socialUrl(name,value)}" target="_blank" rel="noopener">
      <span class="social-icon">${socialIcon(name)}</span>
      <strong>${esc(name)}</strong>
      <small>${esc(value || "Add username")}</small>
    </a>`).join("");
}
function safeUrl(url){
  url=(url||"#").trim();
  if(url==="#" || /^https?:\/\//i.test(url)) return esc(url);
  return "#";
}
function isExternal(url){return /^https?:\/\//i.test((url||"").trim())}
function socialIcon(name){
  const n=name.toLowerCase();
  if(n.includes("telegram")) return "TG";
  if(n.includes("pinterest")) return "P";
  if(n==="vk") return "VK";
  if(n.includes("facebook")) return "f";
  return "↗";
}
function socialUrl(name,value){
  value=(value||"").trim();
  if(/^https?:\/\//i.test(value)) return value;
  const clean=value.replace(/^@/,"").replace(/\s+/g,"");
  const n=name.toLowerCase();
  if(n.includes("telegram")) return clean ? `https://t.me/${clean}` : "#";
  if(n.includes("pinterest")) return clean ? `https://pinterest.com/${clean}` : "#";
  if(n==="vk") return clean ? `https://vk.com/${clean}` : "#";
  if(n.includes("facebook")) return clean ? `https://facebook.com/${clean}` : "#";
  return "#";
}

const overlay=document.getElementById("adminOverlay");
const loginView=document.getElementById("loginView");
const editorView=document.getElementById("editorView");

function openAdmin(){
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden","false");
  showLogin();
}
function closeAdmin(){
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden","true");
}
function showLogin(){
  loginView.classList.remove("hidden");
  editorView.classList.add("hidden");
  document.getElementById("adminPassword").value="";
}
function showEditor(){
  loginView.classList.add("hidden");
  editorView.classList.remove("hidden");
  fillEditors();
}
document.querySelectorAll('a[href="#admin"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();openAdmin()}));
document.getElementById("closeAdmin").onclick=closeAdmin;
overlay.addEventListener("click",e=>{if(e.target===overlay)closeAdmin()});
document.getElementById("loginBtn").onclick=()=>{
  if(document.getElementById("adminPassword").value===data.password) showEditor();
  else alert("Incorrect password.");
};
document.getElementById("adminPassword").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("loginBtn").click()});
document.getElementById("logoutBtn").onclick=showLogin;

function fillEditors(){
  document.getElementById("editSiteName").value=data.siteName;
  document.getElementById("editDescription").value=data.description;
  document.getElementById("editPassword").value=data.password;

  document.getElementById("postEditors").innerHTML=data.posts.map((p,i)=>`
    <div class="post-editor">
      <div class="post-editor-title">POST ${String(i+1).padStart(2,"0")}</div>
      <div class="post-editor-grid">
        <input class="num" value="${i+1}" disabled aria-label="Post number">
        <input data-post="${i}" data-field="title" value="${esc(p.title)}" placeholder="Post title">
        <input data-post="${i}" data-field="link" value="${esc(p.link)}" placeholder="https://example.com">
        <textarea data-post="${i}" data-field="description" rows="2" placeholder="Short description">${esc(p.description)}</textarea>
      </div>
    </div>`).join("");

  document.getElementById("socialEditors").innerHTML=Object.entries(data.socials).map(([name,value])=>`
    <label class="social-editor">${esc(name)}
      <input data-social="${esc(name)}" value="${esc(value)}" placeholder="Username or full URL">
    </label>`).join("");
}

document.getElementById("saveBtn").onclick=()=>{
  data.siteName=document.getElementById("editSiteName").value.trim() || DEFAULT_DATA.siteName;
  data.description=document.getElementById("editDescription").value.trim() || DEFAULT_DATA.description;
  data.password=document.getElementById("editPassword").value || DEFAULT_DATA.password;
  document.querySelectorAll("[data-post]").forEach(el=>{
    const i=Number(el.dataset.post), f=el.dataset.field;
    data.posts[i][f]=el.value.trim();
  });
  document.querySelectorAll("[data-social]").forEach(el=>{
    data.socials[el.dataset.social]=el.value.trim();
  });
  saveData(); render();
  alert("Changes saved on this browser.");
  closeAdmin();
};

document.getElementById("resetBtn").onclick=()=>{
  if(confirm("Reset all demo data?")){
    data=JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData(); render(); fillEditors();
  }
};
render();
