(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(n){if(n.ep)return;n.ep=!0;const l=a(n);fetch(n.href,l)}})();class X{constructor(t,a){this.routes=t,this.onRouteMatch=a,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",t=>{const a=t.target.closest("a[data-link]");a&&(t.preventDefault(),this.navigate(a.getAttribute("href")))}),this.handleRoute()}navigate(t){window.history.pushState({},"",t),this.handleRoute()}handleRoute(){const t=window.location.pathname,a=this.routes[t]||this.routes["/"];this.onRouteMatch(t,a)}}function K(e){const t=[{path:"/",title:"Overview",icon:"▦"},{path:"/campaigns",title:"Campaign",icon:"✉"},{path:"/contacts",title:"Contacts",icon:"👥"},{path:"/automation",title:"Automation",icon:"⚙"},{path:"/analytics",title:"Analytics",icon:"📊"},{path:"/schedule",title:"Schedule",icon:"🕒",hasChevron:!0},{path:"/templates",title:"Templates",icon:"📄",hasChevron:!0},{path:"/integration",title:"Integration",icon:"📦"}],a=[{path:"/help",title:"Help Center",icon:"?"},{path:"/settings",title:"Setting",icon:"⚙"}],s=JSON.parse(localStorage.getItem("camp_user")||'{"name": "User", "email": "user@sendable.com"}');return`
        <!-- Mobile Topbar -->
        <div class="mobile-topbar">
            <div class="logo">
                <div style="width: 28px; height: 28px; background: var(--primary); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem;">✦</div>
                <span>MailerPRO</span>
            </div>
            <button class="hamburger" id="hamburger-btn" aria-label="Open menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Sidebar Overlay (mobile) -->
        <div class="sidebar-overlay" id="sidebar-overlay"></div>

        <!-- Sidebar Drawer -->
        <div class="sidebar" id="sidebar">
            <div class="logo">
                <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; flex-shrink: 0;">✦</div>
                <div style="display: flex; flex-direction: column; line-height: 1.2; overflow: hidden;">
                    <span style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">MailerPRO</span>
                    <span style="font-size: 0.6rem; font-weight: 500; color: var(--text-muted);">Your Deliverability Engine</span>
                </div>
            </div>
            
            <div class="nav-label">Menu</div>
            <ul class="nav-links">
                ${t.map(n=>`
                    <li>
                        <a href="${n.path}" class="nav-link ${e===n.path?"active":""} ${n.hasChevron?"nav-link-with-chevron":""}" data-link>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${n.icon}</span>
                                <span>${n.title}</span>
                            </div>
                            ${n.hasChevron?'<span style="font-size: 0.7rem; opacity: 0.6;">⌵</span>':""}
                        </a>
                    </li>
                `).join("")}
            </ul>

            <div style="margin-top: auto;">
                <div class="flex justify-between items-center mb-6" style="padding: 0 0.25rem;">
                    <div class="flex items-center gap-2" style="font-size: 0.875rem; font-weight: 500; color: var(--text-muted);">
                        <span>☾</span>
                        <span>Dark Mode</span>
                    </div>
                    <div id="dark-mode-toggle" style="width: 40px; height: 22px; background: var(--border); border-radius: 22px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0;">
                        <div id="dark-mode-circle" style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                    </div>
                </div>

                <div class="nav-label" style="margin-top: 0;">Support</div>
                <ul class="nav-links mb-6">
                    ${a.map(n=>`
                        <li>
                            <a href="${n.path}" class="nav-link ${e===n.path?"active":""}" data-link>
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${n.icon}</span>
                                <span>${n.title}</span>
                            </a>
                        </li>
                    `).join("")}
                </ul>

                <div style="padding-top: 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; flex-shrink: 0;">
                        ${s.name.charAt(0).toUpperCase()}
                    </div>
                    <div style="overflow: hidden; flex: 1; min-width: 0;">
                        <p class="truncate" style="font-size: 0.875rem; font-weight: 600;">${s.name}</p>
                        <p class="truncate" style="font-size: 0.75rem; color: var(--text-muted);">${s.email}</p>
                    </div>
                    <a href="/logout" id="logout-btn" style="text-decoration: none; font-size: 1rem; flex-shrink: 0; opacity: 0.7; transition: opacity 0.2s;" title="Logout" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">🚪</a>
                </div>
            </div>
        </div>
    `}const D="/api",S={async get(e){const t=await fetch(`${D}${e}`);if(!t.ok)throw new Error(`API Error: ${t.statusText}`);return t.json()},async post(e,t){const a=await fetch(`${D}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok)throw new Error(`API Error: ${a.statusText}`);return a.json()},async patch(e,t){const a=await fetch(`${D}${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok)throw new Error(`API Error: ${a.statusText}`);return a.json()},async put(e,t){const a=await fetch(`${D}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok)throw new Error(`API Error: ${a.statusText}`);const s=await a.text();return s?JSON.parse(s):null},async delete(e){const t=await fetch(`${D}${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`API Error: ${t.statusText}`);const a=await t.text();return a?JSON.parse(a):null}},L={list:async()=>{const e=JSON.parse(localStorage.getItem("camp_user")||"{}"),t=e.id?`?account_id=${e.id}`:"";return await S.get(`/contacts${t}`)||[]},create:e=>{const t=JSON.parse(localStorage.getItem("camp_user")||"{}");return t.id&&(e.account_id=parseInt(t.id)),S.post("/contacts",e)},update:(e,t)=>S.put(`/contacts/${e}`,t),delete:e=>S.delete(`/contacts/${e}`),addTag:e=>S.post("/contacts/tag",e),removeTag:(e,t)=>S.patch(`/contacts/${e}/tag`,t)},A={list:async()=>await S.get("/campaigns")||[],get:e=>S.get(`/campaigns/${e}`),create:e=>S.post("/campaigns",e),update:(e,t)=>S.put(`/campaigns/${e}`,t),generateAI:e=>S.post("/campaigns/generate-ai",e)},Q={listSent:async()=>{const e=JSON.parse(localStorage.getItem("camp_user")||"{}"),t=e.id?`?account_id=${e.id}`:"";return await S.get(`/emails/sent${t}`)||[]}},N={getOverview:()=>S.get("/stats/overview")},M={signup:e=>S.post("/signup",e),login:e=>S.post("/login",e),getSMTP:e=>S.get(`/settings/smtp?account_id=${e}`),saveSMTP:e=>S.post("/settings/smtp",e),getWarming:e=>S.get(`/stats/warming?account_id=${e}`)},Z={getHealth:e=>S.get(`/domain/health?domain=${e}`)};async function U(){let e={total_contacts:0,total_sent:0,open_rate:0,ctr:0,revenue:0,audience_growth:[]},t=[],a=null,s=null;try{const i=JSON.parse(localStorage.getItem("camp_user")||"{}"),p=[N.getOverview(),A.list()];i.id&&p.push(M.getWarming(i.id)),i.domain&&p.push(Z.getHealth(i.domain));const f=await Promise.all(p);e=f[0],t=f[1],i.id&&(a=f[2]),i.domain&&(s=f[3]),t=(t||[]).slice(0,4)}catch(i){console.error("Failed to fetch dashboard data",i)}const n=JSON.parse(localStorage.getItem("camp_user")||'{ "name": "Test User" }'),l=n.name;return`
        <div class="main-content">
            <!-- Header -->
            <header class="flex justify-between items-center mb-8">
                <h1 style="font-size: 2rem;">Overview</h1>
                <div class="flex items-center gap-4">
                    <button class="btn btn-outline" style="padding: 0.5rem; width: 40px; border-radius: 50%;">🔍</button>
                    <button class="btn btn-outline" style="padding: 0.5rem; width: 40px; border-radius: 50%; position: relative;">
                        🔔
                        <span style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; background: var(--danger); border-radius: 50%; border: 2px solid white;"></span>
                    </button>
                    <div class="flex items-center gap-2 ml-4">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(l)}&background=8a9a5b&color=fff" style="width: 40px; height: 40px; border-radius: 50%;" />
                        <div style="line-height: 1.2;">
                            <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Welcome,</p>
                            <p style="font-size: 0.875rem; font-weight: 800;">${l}</p>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Filters & Actions -->
            <div class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 card" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: var(--radius-sm);">
                        <span style="font-size: 0.875rem; font-weight: 600;">Last 7 Days</span>
                        <span style="font-size: 0.75rem;">⌵</span>
                    </div>
                    <div class="flex items-center gap-2 card" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">
                        <span>📅</span>
                        <span style="font-size: 0.875rem; font-weight: 600;">${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}-Today</span>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button class="btn btn-outline" style="font-weight: 700;">
                        <span>📥</span> Export
                    </button>
                    <button class="btn btn-primary" id="dash-create-camp" style="font-weight: 700; border-radius: var(--radius);">
                        <span>+</span> Create campaign
                    </button>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(138, 154, 91, 0.1); color: var(--primary);">🗂</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Sent</span>
                        <span class="stat-value">${e.total_sent.toLocaleString()}</span>
                        <div class="stat-trend trend-up"><span>↑</span> Live</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #059669;">✉</div>
                    <div class="stat-info">
                        <span class="stat-label">Open Rate</span>
                        <span class="stat-value">${e.open_rate.toFixed(1)}%</span>
                        <div class="stat-trend trend-up"><span>↑</span> Average</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">📈</div>
                    <div class="stat-info">
                        <span class="stat-label">CTR</span>
                        <span class="stat-value">${e.ctr.toFixed(1)}%</span>
                        <div class="stat-trend trend-up"><span>↑</span> Average</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(138, 154, 91, 0.1); color: var(--primary);">💰</div>
                    <div class="stat-info">
                        <span class="stat-label">Revenue</span>
                        <span class="stat-value">$${e.revenue.toLocaleString()}</span>
                        <div class="stat-trend trend-up"><span>↑</span> Est.</div>
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid-2">
                <!-- Left Column -->
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <!-- Audience Growth -->
                        <div class="card">
                            <h3 class="mb-6">Audience Growth</h3>
                            <div class="flex items-center">
                                <div class="donut-container">
                                    <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e4e4e7" stroke-width="3"></circle>
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8a9a5b" stroke-width="3" stroke-dasharray="100 0" stroke-dashoffset="0"></circle>
                                    </svg>
                                    <div class="donut-label">
                                        <span class="donut-value" style="font-size: 0.9rem;">${e.total_contacts}</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 ml-8" style="font-size: 0.75rem; font-weight: 600;">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; background: #8a9a5b; border-radius: 2px;"></div>
                                        <span>Total Contacts</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; background: #d9e3c1; border-radius: 2px;"></div>
                                        <span>Active Growth</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Scheduled Campaigns -->
                        <div class="card">
                            <div class="flex justify-between items-center mb-6">
                                <h3>Upcoming Campaigns</h3>
                                <span style="cursor: pointer;">⚙</span>
                            </div>
                            <div class="flex flex-col gap-4">
                                ${t.filter(i=>i.status==="scheduled").length>0?t.filter(i=>i.status==="scheduled").map(i=>`
                                        <div class="card" style="padding: 1rem; border: 1px solid var(--border); box-shadow: none;">
                                            <div class="flex justify-between items-center">
                                                <div class="flex items-center gap-3">
                                                    <div style="font-size: 1.25rem;">✉</div>
                                                    <div>
                                                        <p style="font-size: 0.875rem; font-weight: 700;">${i.name}</p>
                                                        <p style="font-size: 0.75rem; color: var(--text-muted);">Scheduled</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join(""):'<div class="text-muted" style="font-size: 0.875rem; text-align: center; padding: 2rem;">No campaigns scheduled.</div>'}
                            </div>
                        </div>
                    </div>

                    <!-- Recent Campaigns -->
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <h3>Recent Campaigns</h3>
                            <div class="flex gap-2">
                                <button class="btn btn-outline" style="padding: 0.4rem; font-size: 0.75rem;">📥</button>
                            </div>
                        </div>
                        <table class="campaign-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Open Rate</th>
                                    <th>CTR</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${t.map(i=>`
                                    <tr>
                                        <td style="font-weight: 700;">${i.name}</td>
                                        <td>
                                            <span class="status-badge status-${i.status}">${i.status}</span>
                                        </td>
                                        <td style="font-weight: 700;">${i.open_rate}%</td>
                                        <td style="font-weight: 700;">${i.ctr}%</td>
                                        <td><a href="/campaign" style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">View</a></td>
                                    </tr>
                                `).join("")}
                                ${t.length===0?'<tr><td colspan="5" style="text-align: center; padding: 2rem;" class="text-muted">No recent campaigns.</td></tr>':""}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="flex flex-col gap-4">
                    <!-- Top Automations -->
                    <div class="card" style="flex: 1;">
                        <h3 class="mb-6">Performance Insights</h3>
                        <div class="flex flex-col gap-6">
                            <div class="insight-row">
                                <p style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Engagement Goal</p>
                                <div class="progress-container" style="height: 12px;">
                                    <div class="progress-bar" style="width: ${Math.min(100,e.open_rate*2)}%;"></div>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Target: 50% Open Rate</p>
                            </div>
                            <div class="insight-row">
                                <p style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Conversion Score</p>
                                <div class="progress-container" style="height: 12px;">
                                    <div class="progress-bar" style="width: ${Math.min(100,e.ctr*5)}%; background: #c2c9af;"></div>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Target: 20% CTR</p>
                            </div>
                        </div>
                    </div>

                    <!-- Deliverability Health -->
                    <div class="card" id="deliverability-card" style="border: 1px solid var(--border);">
                        <div class="flex justify-between items-center mb-4">
                            <h3 style="font-size: 1rem;">🛡 Deliverability Health</h3>
                            <span class="status-badge" id="health-badge" style="font-size: 0.65rem; ${s?s.spf&&s.dkim&&s.dmarc?"background:#ecfdf5;color:#059669;":"background:#fff7ed;color:#ea580c;":"background:#f4f4f5;color:#71717a;"}">${s?s.spf&&s.dkim&&s.dmarc?"Excellent":"Action Needed":"Not Checked"}</span>
                        </div>

                        <!-- Domain Input Row -->
                        <div class="flex gap-2 mb-4" style="align-items: stretch;">
                            <input type="text" id="domain-check-input" class="input" placeholder="yourdomain.com" value="${n.domain||""}" style="flex: 1; padding: 0.6rem 0.875rem; font-size: 0.875rem;">
                            <button class="btn btn-primary" id="check-health-btn" style="padding: 0.6rem 1rem; font-size: 0.8125rem; white-space: nowrap;">
                                🔍 Check
                            </button>
                        </div>

                        <!-- Result Panel -->
                        <div id="health-result-panel">
                            ${s?`
                            <div style="display: flex; flex-direction: column; gap: 0.625rem;">
                                ${B("SPF",s.spf,s.spf_record)}
                                ${B("DKIM",s.dkim,s.dkim_selector?`Selector: ${s.dkim_selector}`:null)}
                                ${B("DMARC",s.dmarc,s.dmarc_record)}
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-main); padding: 0.75rem; border-radius: 8px; margin-top: 0.875rem; line-height: 1.5;">
                                ${s.spf&&s.dkim&&s.dmarc?"✅ All records verified. Your domain is properly authenticated for inbox delivery.":"⚠️ Some records are missing or not yet propagated. DNS changes can take up to 24–48 hours to propagate globally."}
                            </div>`:`
                            <div style="font-size: 0.8125rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">
                                Enter your sending domain above and click Check to see your DNS health.
                            </div>`}
                        </div>
                    </div>

                    <!-- Email Warming Progress -->
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <h3>Email Warming</h3>
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">${a?a.status.toUpperCase():"PENDING"}</span>
                        </div>
                        <div class="insight-row">
                            <div class="insight-label">
                                <span>Daily Progress</span>
                                <span>${a?a.current_count:0} / ${a?a.daily_limit:10}</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${a?a.current_count/a.daily_limit*100:0}%;"></div>
                            </div>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                            Gradually increasing volume to build trust with Gmail and Outlook.
                        </p>
                    </div>

                    <!-- Audience Metrics -->
                    <div class="card">
                </div>
            </div>
        </div>
    `}function B(e,t,a){const s=t?"#059669":"#ea580c",n=t?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.06)",l=t?"✅":"❌",i=a?`<span style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;font-family:monospace;word-break:break-all;">${a}</span>`:"";return`
        <div style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.6rem 0.75rem;background:${n};border-radius:8px;">
            <span style="font-size:0.9rem;flex-shrink:0;margin-top:1px;">${l}</span>
            <div style="display:flex;flex-direction:column;">
                <span style="font-size:0.8125rem;font-weight:700;color:${s};">${e}</span>
                ${i}
            </div>
        </div>`}function ee(){const e=document.getElementById("dash-create-camp");e&&(e.onclick=()=>{window.history.pushState({},"","/campaigns"),window.dispatchEvent(new PopStateEvent("popstate"))});const t=document.getElementById("check-health-btn"),a=document.getElementById("domain-check-input"),s=document.getElementById("health-badge"),n=document.getElementById("health-result-panel");!t||!a||(t.onclick=async()=>{const l=a.value.trim().replace(/^https?:\/\//,"").replace(/\/.*$/,"");if(!l){a.focus();return}t.disabled=!0,t.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite;">⟳</span> Checking…',n.innerHTML=`<div style="font-size:0.8125rem;color:var(--text-muted);text-align:center;padding:1rem 0;">Looking up DNS records for <strong>${l}</strong>…</div>`;try{const i=await fetch(`/api/domain/health?domain=${encodeURIComponent(l)}`);if(!i.ok)throw new Error(`HTTP ${i.status}`);const p=await i.json(),f=p.spf&&p.dkim&&p.dmarc;s.textContent=f?"Excellent":"Action Needed",s.style.cssText=f?"font-size:0.65rem;background:#ecfdf5;color:#059669;":"font-size:0.65rem;background:#fff7ed;color:#ea580c;";const c=p.dkim_selector?`Selector found: ${p.dkim_selector}`:null;n.innerHTML=`
                <div style="display:flex;flex-direction:column;gap:0.625rem;">
                    ${B("SPF",p.spf,p.spf_record||null)}
                    ${B("DKIM",p.dkim,c)}
                    ${B("DMARC",p.dmarc,p.dmarc_record||null)}
                </div>
                <div style="font-size:0.75rem;color:var(--text-muted);background:var(--bg-main);padding:0.75rem;border-radius:8px;margin-top:0.875rem;line-height:1.5;">
                    ${f?"✅ All records verified. Your domain is properly authenticated for inbox delivery.":"⚠️ Some records are missing or not yet propagated. DNS changes can take 24–48 hours to be visible globally. If you just added a record, wait and try again."}
                </div>`;const o=JSON.parse(localStorage.getItem("camp_user")||"{}");localStorage.setItem("camp_user",JSON.stringify({...o,domain:l}))}catch(i){n.innerHTML=`<div style="font-size:0.8125rem;color:var(--danger);padding:0.75rem;background:rgba(239,68,68,0.06);border-radius:8px;">⚠️ Error: ${i.message}. Make sure the backend is running and the domain is valid.</div>`}finally{t.disabled=!1,t.innerHTML="🔍 Check"}})}function w(e,t="info"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${t}`;const n={success:"✅",error:"❌",info:"ℹ️"};s.innerHTML=`
        <span class="toast-icon">${n[t]||n.info}</span>
        <span class="toast-message">${e}</span>
    `,a.appendChild(s),setTimeout(()=>{s.classList.add("hide"),setTimeout(()=>{s.remove()},300)},4e3)}let x=[],T=null,k=null;async function te(){try{x=await L.list()}catch(e){console.error("Failed to fetch contacts",e)}return setTimeout(()=>{const e=document.getElementById("contact-search");e&&(e.oninput=t=>{const a=t.target.value.toLowerCase(),s=k?x.filter(n=>n.tags&&n.tags.some(l=>l.text===k)):x;T(s.filter(n=>n.first_name&&n.first_name.toLowerCase().includes(a)||n.last_name&&n.last_name.toLowerCase().includes(a)||n.email.toLowerCase().includes(a)||n.tags&&n.tags.some(l=>l.text.toLowerCase().includes(a))))}),W()},50),`
        <div class="main-content" style="display: flex; gap: 0; padding: 0; height: calc(100vh - 60px); overflow: hidden;">
            <!-- Folder Sidebar -->
            <aside id="folder-sidebar" style="width: 220px; min-width: 220px; background: var(--bg-card); border-right: 1px solid var(--border); overflow-y: auto; padding: 1.5rem 0;">
                <div style="padding: 0 1rem 1rem; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase;">Folders</div>
                <div id="folder-list"></div>
                <div style="padding: 1rem; border-top: 1px solid var(--border); margin-top: 1rem;">
                    <button class="btn btn-outline" id="new-folder-btn" style="width: 100%; font-size: 0.8rem; padding: 0.5rem;">+ New Folder</button>
                </div>
            </aside>

            <!-- Main Table Area -->
            <div style="flex: 1; overflow-y: auto; padding: 2rem;">
                <header class="flex justify-between items-center mb-6">
                    <div>
                        <h1 id="folder-title" style="font-size: 1.75rem;">All Contacts</h1>
                        <p class="text-muted" id="folder-subtitle">Manage all your subscribers.</p>
                    </div>
                    <div class="flex gap-3 items-center">
                        <div style="position: relative;">
                            <input type="text" id="contact-search" placeholder="Search..." class="input" style="padding-left: 2rem; width: 200px; border-radius: var(--radius-sm);">
                            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
                        </div>
                        <input type="file" id="import-file" accept=".xlsx,.xls,.csv,.json" style="display: none;">
                        <button class="btn btn-outline" id="import-btn">📥 Import</button>
                        <button class="btn btn-primary" id="add-contact-btn">+ Add Contact</button>
                    </div>
                </header>

                <div class="card" style="padding: 0; overflow: hidden;">
                    <table class="campaign-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Folders</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="contacts-list-body"></tbody>
                    </table>
                </div>
            </div>

            <div id="modal-container"></div>
        </div>
    `}function W(){const e=document.getElementById("contacts-list-body"),t=document.getElementById("modal-container"),a=document.getElementById("import-btn"),s=document.getElementById("import-file"),n=c=>{try{const o=c.split("@")[1];if(!o)return"Unknown";const u=o.split(".")[0];return u.charAt(0).toUpperCase()+u.slice(1)}catch{return"Unknown"}},l=()=>{const c={};return x.forEach(o=>{(o.tags||[]).forEach(u=>{c[u.text]||(c[u.text]=0),c[u.text]++})}),c},i=()=>{const c=document.getElementById("folder-list");if(!c)return;const o=l(),u=x.length,m=r=>`
            display: flex; justify-content: space-between; align-items: center;
            padding: 0.55rem 1rem; cursor: pointer; border-radius: 0; font-size: 0.875rem;
            transition: background 0.15s;
            background: ${k===r?"rgba(138,154,91,0.15)":"transparent"};
            color: ${k===r?"var(--primary)":"var(--text-main)"};
            font-weight: ${k===r?"700":"400"};
            border-left: 3px solid ${k===r?"var(--primary)":"transparent"};
        `;c.innerHTML=`
            <div class="folder-item" data-folder="" style="${m(null)}">
                <span>📋 All Contacts</span>
                <span style="background: var(--bg-main); padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 700;">${u}</span>
            </div>
            ${Object.entries(o).map(([r,d])=>`
                <div class="folder-item" data-folder="${r}" style="${m(r)}" title="${r}">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">📁 ${r}</span>
                    <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                        <span style="background: var(--bg-main); padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 700;">${d}</span>
                        <button class="rename-folder-btn" data-folder="${r}" style="background: none; border: none; cursor: pointer; font-size: 0.75rem; padding: 2px 4px; color: var(--text-muted); opacity: 0.6;" title="Rename folder">✏️</button>
                    </div>
                </div>
            `).join("")}
        `,c.querySelectorAll(".folder-item").forEach(r=>{r.onclick=d=>{if(d.target.closest(".rename-folder-btn"))return;const g=r.dataset.folder||null;k=g;const b=document.getElementById("folder-title"),E=document.getElementById("folder-subtitle");b&&(b.textContent=g||"All Contacts"),E&&(E.textContent=g?`Contacts in folder "${g}"`:"Manage all your subscribers."),i();const y=g?x.filter(v=>v.tags&&v.tags.some(z=>z.text===g)):x;T(y)}}),c.querySelectorAll(".rename-folder-btn").forEach(r=>{r.onclick=async d=>{d.stopPropagation();const g=r.dataset.folder,b=prompt(`Rename folder "${g}" to:`,g);if(!b||b===g)return;const E=x.filter(v=>v.tags&&v.tags.some(z=>z.text===g));let y=0;for(const v of E){const z=v.tags.map($=>$.text===g?{text:b}:$);try{await L.update(v.id,{...v,tags:z}),v.tags=z,y++}catch($){console.error("Rename failed for contact",v.id,$)}}k===g&&(k=b),i(),T(k?x.filter(v=>v.tags&&v.tags.some(z=>z.text===k)):x),w(`Renamed "${g}" → "${b}" for ${y} contacts`,"success")}})};T=c=>{e&&(e.innerHTML=c.map(o=>`
            <tr>
                <td style="font-weight: 700;">
                    ${o.first_name||o.last_name?`${o.first_name||""} ${o.last_name||""}`.trim():`<span class="text-muted" style="font-weight: 400; font-style: italic;">${n(o.email)}</span>`}
                </td>
                <td class="text-muted">${o.email}</td>
                <td>
                    <div class="flex gap-1 flex-wrap">
                        ${o.tags&&o.tags.length>0?o.tags.map(u=>`<span class="status-badge" style="background: rgba(138,154,91,0.12); color: var(--primary); font-size: 0.65rem; cursor: pointer;" data-folder-jump="${u.text}">${u.text}</span>`).join(""):'<span class="text-muted" style="font-size: 0.75rem;">—</span>'}
                    </div>
                </td>
                <td class="text-muted">${new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-outline edit-contact-btn" data-id="${o.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-right: 0.4rem;">Edit</button>
                    <button class="btn btn-outline delete-contact-btn" data-id="${o.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #dc3545; border-color: #dc3545;">Delete</button>
                </td>
            </tr>
        `).join("")+(c.length===0?'<tr><td colspan="5" style="text-align: center; padding: 3rem;" class="text-muted">No contacts in this folder.</td></tr>':""),e.querySelectorAll("[data-folder-jump]").forEach(o=>{o.onclick=()=>{k=o.dataset.folderJump,i();const u=document.getElementById("folder-title"),m=document.getElementById("folder-subtitle");u&&(u.textContent=k),m&&(m.textContent=`Contacts in folder "${k}"`),T(x.filter(r=>r.tags&&r.tags.some(d=>d.text===k)))}}),document.querySelectorAll(".edit-contact-btn").forEach(o=>{o.onclick=u=>{const m=u.target.dataset.id,r=x.find(d=>d.id==m);r&&f(r)}}),document.querySelectorAll(".delete-contact-btn").forEach(o=>{o.onclick=async u=>{if(!confirm("Delete this contact?"))return;const m=u.target.dataset.id;try{await L.delete(m),x=x.filter(r=>r.id!=m),i(),T(k?x.filter(r=>r.tags&&r.tags.some(d=>d.text===k)):x),w("Contact deleted","success")}catch(r){w("Failed to delete: "+r.message,"error")}}}))},i(),T(x),document.getElementById("new-folder-btn")?.addEventListener("click",()=>{const c=prompt("New folder name:");c&&w(`Folder "${c}" created! Add contacts to it via Edit Contact.`,"info")}),document.getElementById("add-contact-btn")?.addEventListener("click",()=>f(null)),a&&s&&(a.onclick=()=>s.click(),s.onchange=async c=>{const o=c.target.files[0];if(!o)return;const u=new FileReader;u.onload=async m=>{try{let r=[];if(o.name.endsWith(".json")){const d=new TextDecoder().decode(m.target.result);r=JSON.parse(d),Array.isArray(r)||(r=[r])}else{const d=new Uint8Array(m.target.result),g=window.XLSX.read(d,{type:"array"}),b=g.Sheets[g.SheetNames[0]];r=window.XLSX.utils.sheet_to_json(b)}if(r.length===0){w("File is empty.","error");return}p(Object.keys(r[0]),r)}catch(r){w("Failed to read file: "+r.message,"error")}},u.readAsArrayBuffer(o)});const p=(c,o)=>{const u=(r,d)=>{const g=r.toLowerCase().replace(/[^a-z]/g,"");return d.some(b=>g.includes(b)||b.includes(g))},m={email:c.find(r=>u(r,["email","mail","addr"]))||"",first_name:c.find(r=>u(r,["first","fname","given","name","full"]))||"",last_name:c.find(r=>u(r,["last","lname","sur"]))||"",phone:c.find(r=>u(r,["phone","mobile","tel"]))||"",tags:c.find(r=>u(r,["tag","folder","segment","list","label"]))||""};t.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                <div class="card" style="width: 100%; max-width: 560px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-2">Map Columns</h2>
                    <p class="text-muted mb-6">Match your file's columns to contact fields.</p>
                    <form id="mapping-form">
                        ${["Email (Required)","First Name","Last Name","Phone","Folders"].map((r,d)=>{const g=["email","first_name","last_name","phone","tags"][d];return`<div class="mb-4 flex items-center justify-between">
                                <label style="font-weight: 700; flex: 1;">${r}</label>
                                <select name="${g}" class="input" style="flex: 1.5; padding: 0.5rem;">
                                    <option value="">-- Skip --</option>
                                    ${c.map(b=>`<option value="${b}" ${m[g]===b?"selected":""}>${b}</option>`).join("")}
                                </select>
                            </div>`}).join("")}
                        <div class="flex justify-between mt-6" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-mapping" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="confirm-import" style="flex: 1;">Import ${o.length} rows</button>
                        </div>
                    </form>
                </div>
            </div>`,document.getElementById("close-mapping").onclick=()=>{t.innerHTML="",s.value=""},document.getElementById("mapping-form").onsubmit=async r=>{r.preventDefault();const d=Object.fromEntries(new FormData(r.target).entries());if(!d.email){w("Email mapping required!","error");return}const g=document.getElementById("confirm-import");g.disabled=!0;let b=0,E=0;for(const y of o)try{const v=y[d.email];if(!v)continue;const z=d.tags?y[d.tags]:"",$=z?String(z).split(",").map(h=>({text:h.trim()})).filter(h=>h.text):[];await L.create({first_name:String(d.first_name&&y[d.first_name]||""),last_name:String(d.last_name&&y[d.last_name]||""),email:String(v).trim().toLowerCase(),phone:String(d.phone&&y[d.phone]||""),tags:$}),b++,g.textContent=`Importing (${b}/${o.length})...`}catch{E++}t.innerHTML="",w(`Import done: ${b} added, ${E} failed.`,E>0?"error":"success"),x=await L.list(),i(),T(x)}},f=(c=null)=>{const o=!!c,u=(c?.tags||[]).map(m=>m.text).join(", ");t.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 500px; padding: 2rem;">
                    <h2 class="mb-6">${o?"Edit Contact":"Add Contact"}</h2>
                    <form id="contact-form">
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">First Name</label>
                            <input type="text" name="first_name" class="input" placeholder="John" value="${c?.first_name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Last Name</label>
                            <input type="text" name="last_name" class="input" placeholder="Doe" value="${c?.last_name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email</label>
                            <input type="email" name="email" class="input" required placeholder="john@example.com" value="${c?.email||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Phone</label>
                            <input type="text" name="phone" class="input" placeholder="+1 (555) 000-0000" value="${c?.phone||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">📁 Folders <span style="font-weight: 400; color: var(--text-muted);">(comma-separated)</span></label>
                            <input type="text" name="folders_raw" class="input" placeholder="Leads, Warm, Q2 Prospects" value="${u}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="flex justify-between mt-6" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${o?"Update":"Save"}</button>
                        </div>
                    </form>
                </div>
            </div>`,document.getElementById("close-modal").onclick=()=>t.innerHTML="",document.getElementById("modal-overlay").onclick=m=>{m.target.id==="modal-overlay"&&(t.innerHTML="")},document.getElementById("contact-form").onsubmit=async m=>{m.preventDefault();const r=new FormData(m.target),d=Object.fromEntries(r.entries()),b=(d.folders_raw||"").split(",").map(y=>y.trim()).filter(Boolean).map(y=>({text:y})),E={first_name:d.first_name,last_name:d.last_name,email:d.email,phone:d.phone,tags:b};try{if(o){await L.update(c.id,E);const y=x.findIndex(v=>v.id===c.id);y!==-1&&(x[y]={...x[y],...E}),w("Contact updated!","success")}else{const y=await L.create(E);x.push({...E,id:y?.id,created_at:new Date().toISOString()}),w("Contact added!","success")}t.innerHTML="",i(),T(k?x.filter(y=>y.tags&&y.tags.some(v=>v.text===k)):x)}catch(y){w("Action failed: "+y.message,"error")}}}}let _=[],R=[],G=[],j=null,F=null;async function ae(){try{const[e,t,a]=await Promise.all([A.list(),Q.listSent(),L.list()]);_=e,R=t,G=a}catch(e){console.error("Failed to fetch campaigns, sent emails, or contacts",e)}return`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Campaigns</h1>
                    <p class="text-muted">Create and manage your email marketing efforts.</p>
                </div>
                <button class="btn btn-primary" id="create-campaign-btn">
                    <span>+</span> Create Campaign
                </button>
            </header>

            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Drafts</span>
                        <span class="stat-value">${_.filter(e=>e.status==="draft").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Scheduled</span>
                        <span class="stat-value">${_.filter(e=>e.status==="scheduled").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Sent</span>
                        <span class="stat-value">${_.filter(e=>e.status==="sent").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Paused</span>
                        <span class="stat-value">${_.filter(e=>e.status==="paused").length}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-4 mb-6" id="campaign-tabs">
                <button class="btn btn-primary tab-btn" data-filter="all" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">All</button>
                <button class="btn btn-outline tab-btn" data-filter="draft" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Drafts</button>
                <button class="btn btn-outline tab-btn" data-filter="scheduled" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Scheduled</button>
                <button class="btn btn-outline tab-btn" data-filter="sent" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Sent (Inbox)</button>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;" id="table-card">
                <table class="campaign-table" id="main-table">
                    <thead id="table-head">
                        <tr>
                            <th>Campaign Name ⌵</th>
                            <th>Status ⌵</th>
                            <th>Open Rate ⌵</th>
                            <th>CTR ⌵</th>
                            <th>Conversions ⌵</th>
                            <th>Actions ⌵</th>
                        </tr>
                    </thead>
                    <tbody id="campaigns-list-body">
                        <!-- Rendered dynamically -->
                    </tbody>
                </table>
            </div>

            <div id="campaign-modal-container"></div>
        </div>
    `}function se(){const e=document.getElementById("campaigns-list-body"),t=document.getElementById("create-campaign-btn"),a=document.getElementById("campaign-modal-container"),s=document.querySelectorAll(".tab-btn");j=i=>{e&&(e.innerHTML=i.map(p=>`
            <tr>
                <td style="font-weight: 700;">${p.name}</td>
                <td>
                    <span class="status-badge ${p.status==="sent"?"status-sent":p.status==="paused"?"status-paused":"status-draft"}">
                        ${p.status.charAt(0).toUpperCase()+p.status.slice(1)}
                    </span>
                </td>
                <td style="font-weight: 700;">${p.open_rate}%</td>
                <td style="font-weight: 700;">${p.ctr}%</td>
                <td style="font-weight: 700;">${p.conversions}%</td>
                <td>
                    <button class="btn btn-outline edit-campaign-btn" data-id="${p.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem; margin-right: 0.5rem;">Edit</button>
                    ${p.status!=="scheduled"&&p.status!=="sent"?`<button class="btn btn-primary schedule-campaign-btn" data-id="${p.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Schedule</button>`:""}
                </td>
            </tr>
        `).join("")+(i.length===0?'<tr><td colspan="6" style="text-align: center; padding: 3rem;" class="text-muted">No campaigns found for this view.</td></tr>':""),document.querySelectorAll(".edit-campaign-btn").forEach(p=>{p.onclick=f=>{const c=f.target.dataset.id,o=_.find(u=>u.id==c);o&&l(o)}}),document.querySelectorAll(".schedule-campaign-btn").forEach(p=>{p.onclick=f=>{const c=f.target.dataset.id,o=_.find(u=>u.id==c);o&&l(o,!0)}}))},F=()=>{if(!e)return;const i=document.getElementById("table-head");i.innerHTML=`
            <tr>
                <th>Recipient (Email) ⌵</th>
                <th>Subject ⌵</th>
                <th>Type ⌵</th>
                <th>Sent At ⌵</th>
            </tr>
        `,e.innerHTML=R.map(p=>`
            <tr>
                <td style="font-weight: 700;">${p.recipient}</td>
                <td>${p.subject}</td>
                <td>
                    <span class="status-badge ${p.type==="warming"?"status-draft":"status-sent"}">
                        ${p.type==="warming"?"🔥 Warming":"✉️ Campaign"}
                    </span>
                </td>
                <td class="text-muted">${new Date(p.sent_at).toLocaleString()}</td>
            </tr>
        `).join("")+(R.length===0?'<tr><td colspan="4" style="text-align: center; padding: 3rem;" class="text-muted">No sent emails recorded.</td></tr>':"")};const n=()=>{const i=document.getElementById("table-head");i.innerHTML=`
            <tr>
                <th>Campaign Name ⌵</th>
                <th>Status ⌵</th>
                <th>Open Rate ⌵</th>
                <th>CTR ⌵</th>
                <th>Conversions ⌵</th>
                <th>Actions ⌵</th>
            </tr>
        `};n(),j(_),s.forEach(i=>{i.onclick=p=>{s.forEach(o=>{o.classList.remove("btn-primary"),o.classList.add("btn-outline")});const f=p.currentTarget;f.classList.remove("btn-outline"),f.classList.add("btn-primary");const c=f.dataset.filter;c==="sent"?F():c==="all"?(n(),j(_)):(n(),j(_.filter(o=>o.status===c)))}});const l=(i=null,p=!1)=>{const f=!!i,c=p?"scheduled":i?.status||"draft",o=new Set;G.forEach(h=>{(h.tags||[]).forEach(C=>o.add(C.text))});const u=Array.from(o).sort();a.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 800px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-6">${f?"Edit Campaign":"Create New Campaign"}</h2>
                    <form id="campaign-form">
                        <div class="mb-6 p-4" style="background: var(--bg-main); border: 1px dashed var(--primary); border-radius: var(--radius); text-align: center;">
                            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">Let AI draft your campaign for you!</p>
                            <div class="flex gap-2 flex-col">
                                <input type="text" id="ai-goal" class="input mb-2" placeholder="Goal (e.g. Welcome email for new subscribers)" style="width: 100%; padding: 0.5rem;">
                                <textarea id="ai-pain-point" class="input mb-2" placeholder="Target pain point to pitch (e.g. Teams struggle with slow manual email generation)" style="width: 100%; padding: 0.5rem;"></textarea>
                                <button type="button" class="btn btn-primary" id="ai-magic-btn" style="padding: 0.75rem 1rem; width: 100%;">Magic Draft ✨</button>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Campaign Name</label>
                            <input type="text" name="name" class="input" required placeholder="Summer Sale 2026" value="${i?.name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="grid-2 mb-4" style="grid-template-columns: 2fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Subject</label>
                                <input type="text" name="subject" class="input" required placeholder="Our biggest sale ever!" value="${i?.subject||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Target Folder</label>
                                <select name="target_folder" class="input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                                    <option value="">Everyone (Full List)</option>
                                    ${u.map(h=>`<option value="${h}" ${i?.target_folder===h?"selected":""}>${h}</option>`).join("")}
                                </select>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Content (Rich Text)</label>
                            <div id="rte-toolbar" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px; background: #2a2a2a; border: 1px solid var(--border); border-bottom: none; border-radius: var(--radius) var(--radius) 0 0;">
                                <button type="button" data-cmd="bold" title="Bold" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;font-weight:700;">B</button>
                                <button type="button" data-cmd="italic" title="Italic" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;font-style:italic;">I</button>
                                <button type="button" data-cmd="underline" title="Underline" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;text-decoration:underline;">U</button>
                                <button type="button" data-cmd="strikeThrough" title="Strikethrough" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;text-decoration:line-through;">S</button>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <button type="button" data-cmd="insertOrderedList" title="Ordered List" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">1.</button>
                                <button type="button" data-cmd="insertUnorderedList" title="Bullet List" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">•</button>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <select data-format="formatBlock" title="Heading" style="padding:4px 6px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">
                                    <option value="p">Normal</option>
                                    <option value="h1">H1</option>
                                    <option value="h2">H2</option>
                                    <option value="h3">H3</option>
                                </select>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <label title="Text Color" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:4px;">A<input type="color" data-cmd="foreColor" style="width:20px;height:16px;border:none;background:none;cursor:pointer;padding:0;"></label>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <button type="button" id="rte-link-btn" title="Insert Link" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">🔗</button>
                                <button type="button" data-cmd="removeFormat" title="Clear Formatting" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">✕</button>
                            </div>
                            <div id="rte-content" contenteditable="true" style="min-height: 250px; padding: 12px; background: white; color: #111; border: 1px solid var(--border); border-radius: 0 0 var(--radius) var(--radius); font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; outline: none; overflow-y: auto;"></div>
                            <input type="hidden" name="content" id="hidden-content">
                        </div>
                        <div class="grid-2 mb-8" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Status</label>
                                <select name="status" class="input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                                    <option value="draft" ${c==="draft"?"selected":""}>Draft</option>
                                    <option value="sent" ${c==="sent"?"selected":""}>Sent</option>
                                    <option value="paused" ${c==="paused"?"selected":""}>Paused</option>
                                    <option value="scheduled" ${c==="scheduled"?"selected":""}>Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Open Rate (%)</label>
                                <input type="number" step="0.1" name="open_rate" class="input" value="${i?.open_rate||0}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                        </div>
                        <div class="mb-8" id="schedule-field" style="display: ${c==="scheduled"?"block":"none"};">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Send At (Date & Time)</label>
                            <input type="datetime-local" name="scheduled_at" id="scheduled_at_input" class="input" value="${i?.scheduled_at?new Date(i.scheduled_at).toISOString().slice(0,16):""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8 flex items-center gap-2">
                            <input type="checkbox" name="is_personalized" id="is_personalized" ${i?.is_personalized?"checked":""} style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="is_personalized" style="font-weight: 700; cursor: pointer;">✨ Hyper-Personalization (AI Research each company)</label>
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${f?"Update Campaign":"Create Draft"}</button>
                        </div>
                    </form>
                </div>
            </div>
        `,document.getElementById("close-modal").onclick=()=>a.innerHTML="";const m=document.getElementById("rte-content");document.getElementById("hidden-content"),i?.content&&(m.innerHTML=i.content),document.getElementById("rte-toolbar").addEventListener("mousedown",h=>{const C=h.target.closest("[data-cmd]");if(C){if(h.preventDefault(),C.dataset.cmd==="foreColor")return;document.execCommand(C.dataset.cmd,!1,null),m.focus()}});const r=document.querySelector('#rte-toolbar [data-cmd="foreColor"]');r&&r.addEventListener("input",()=>{document.execCommand("foreColor",!1,r.value)});const d=document.querySelector('#rte-toolbar [data-format="formatBlock"]');d&&d.addEventListener("change",()=>{document.execCommand("formatBlock",!1,d.value),m.focus()}),document.getElementById("rte-link-btn")?.addEventListener("click",()=>{const h=prompt("Enter URL:");h&&document.execCommand("createLink",!1,h),m.focus()});const g=document.getElementById("campaign-form"),b=document.getElementById("ai-magic-btn"),E=document.getElementById("ai-goal"),y=document.getElementById("ai-pain-point"),v=g.querySelector('[name="subject"]');b.onclick=async()=>{const h=E.value.trim(),C=y.value.trim();if(!h){w("Please describe your campaign goal first!","info");return}b.disabled=!0,b.textContent="Generating...";try{const I=await A.generateAI({goal:h,pain_point:C});v.value=I.subject,m.innerHTML=I.content||"",w("Campaign draft generated! ✨","success")}catch(I){w("AI Generation failed: "+I.message,"error")}finally{b.disabled=!1,b.textContent="Magic Draft ✨"}};const z=g.querySelector('[name="status"]'),$=()=>{const h=document.getElementById("schedule-field"),C=document.getElementById("scheduled_at_input"),I=z.value==="scheduled";h.style.display=I?"block":"none",I?C.setAttribute("required","true"):C.removeAttribute("required")};z.onchange=$,$(),document.getElementById("modal-overlay").onclick=h=>{h.target.id==="modal-overlay"&&(a.innerHTML="")},document.getElementById("campaign-form").onsubmit=async h=>{h.preventDefault();const C=document.getElementById("hidden-content");C.value=m.innerHTML;const I=new FormData(h.target),P=Object.fromEntries(I.entries()),H={...P,account_id:JSON.parse(localStorage.getItem("camp_user")||"{}").id||1,open_rate:parseFloat(P.open_rate)||0,ctr:parseFloat(i?.ctr||0),conversions:parseFloat(i?.conversions||0),scheduled_at:P.scheduled_at?new Date(P.scheduled_at).toISOString():null,is_personalized:g.querySelector('[name="is_personalized"]').checked,target_folder:P.target_folder||""};try{f?await A.update(i.id,H):await A.create(H),window.location.reload()}catch(V){w("Action failed: "+V.message,"error")}}};t&&(t.onclick=()=>l())}async function ie(){let e={total_contacts:0},t=[];try{[e,t]=await Promise.all([N.getOverview(),A.list()])}catch(s){console.error(s)}return`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Automations</h1>
                    <p class="text-muted">Streamline your marketing with automated workflows.</p>
                </div>
                <button class="btn btn-primary">
                    <span>+</span> Create Automation
                </button>
            </header>

            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-icon">🔄</div>
                    <div class="stat-info">
                        <span class="stat-label">Active Automations</span>
                        <span class="stat-value">${t.filter(s=>s.status==="sent").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Contacts</span>
                        <span class="stat-value">${e.total_contacts}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">✉️</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Sent</span>
                        <span class="stat-value">${e.total_sent||0}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <span class="stat-label">Est. Revenue</span>
                        <span class="stat-value">$${(e.revenue||0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <h3 class="mb-4">Live Workflows</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                ${t.slice(0,4).map(s=>`
                    <div class="card">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h4 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${s.name}</h4>
                                <span class="status-badge status-${s.status}" style="font-size: 0.65rem;">${s.status}</span>
                            </div>
                            <span style="font-size: 1.25rem;">⚙️</span>
                        </div>
                        <div class="flex gap-4 mb-6">
                            <div style="flex: 1;">
                                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Open Rate</p>
                                <p style="font-size: 1rem; font-weight: 700;">${s.open_rate}%</p>
                            </div>
                            <div style="flex: 1;">
                                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">CTR</p>
                                <p style="font-size: 1rem; font-weight: 700;">${s.ctr}%</p>
                            </div>
                        </div>
                        <button class="btn btn-outline" style="width: 100%; font-size: 0.8125rem;">Manage Workflow</button>
                    </div>
                `).join("")}
                ${t.length===0?'<div class="text-muted">No workflows found.</div>':""}
            </div>
        </div>
    `}async function ne(){let e={open_rate:0,ctr:0,audience_growth:[]},t=[];try{const[a,s]=await Promise.all([N.getOverview(),A.list()]);e=a,t=(s||[]).filter(n=>n.status==="sent").sort((n,l)=>(l.open_rate||0)-(n.open_rate||0)).slice(0,3)}catch(a){console.error("Failed to fetch analytics data",a)}return`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Analytics</h1>
                    <p class="text-muted">Deep dive into your campaign performance.</p>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-outline" style="border-radius: var(--radius-sm);">Last 30 Days</button>
                    <button class="btn btn-outline" style="border-radius: var(--radius-sm);">📥 Download Report</button>
                </div>
            </header>

            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Avg. Open Rate</span>
                        <span class="stat-value">${(e.open_rate||0).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Avg. CTR</span>
                        <span class="stat-value">${(e.ctr||0).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Unsubscribe Rate</span>
                        <span class="stat-value">0.4%</span>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">Aggregated</p>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Bounce Rate</span>
                        <span class="stat-value">1.2%</span>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">Aggregated</p>
                    </div>
                </div>
            </div>

            <div class="card mb-8">
                <h3 class="mb-6">Engagement Overview</h3>
                <div style="height: 300px; width: 100%; background: #fafafa; border: 1px dashed var(--border); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; position: relative;">
                    <div style="width: 100%; height: 100%; padding: 2rem; display: flex; align-items: flex-end; gap: 1rem;">
                        ${[60,45,80,55,90,70,85,40,65,95].map(a=>`
                            <div style="flex: 1; background: var(--primary); height: ${a}%; border-radius: 4px 4px 0 0; opacity: 0.8;"></div>
                        `).join("")}
                    </div>
                    <p style="position: absolute; color: var(--text-muted); font-size: 0.875rem; background: rgba(255,255,255,0.8); padding: 0.5rem 1rem; border-radius: 20px;">Live Engagement Index</p>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 class="mb-6">Top Performing Campaigns</h3>
                    <div class="flex flex-col gap-4">
                        ${t.length>0?t.map(a=>`
                            <div class="flex justify-between items-center py-3 border-bottom" style="border-bottom: 1px solid var(--border);">
                                <span style="font-weight: 600;">${a.name}</span>
                                <span style="color: var(--success); font-weight: 700;">${a.open_rate}% Open</span>
                            </div>
                        `).join(""):'<p class="text-muted">No sent campaigns yet.</p>'}
                    </div>
                </div>
                <div class="card">
                    <h3 class="mb-6">Audience Metrics</h3>
                    <div class="flex flex-col gap-4">
                        <div class="insight-row">
                            <div class="insight-label"><span>Total Contacts</span><span>${e.total_contacts||0}</span></div>
                            <div class="progress-container"><div class="progress-bar" style="width: 100%;"></div></div>
                        </div>
                        <div class="insight-row">
                            <div class="insight-label"><span>Active Growth</span><span>100%</span></div>
                            <div class="progress-container"><div class="progress-bar" style="width: 100%; background: #c2c9af;"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}async function re(){let e=[];try{e=(await A.list()||[]).filter(i=>i.status==="scheduled").sort((i,p)=>new Date(i.scheduled_at||i.created_at)-new Date(p.scheduled_at||p.created_at)).slice(0,10)}catch(l){console.error("Failed to fetch schedule",l)}const t=new Date,a=new Date(t.getFullYear(),t.getMonth()+1,0).getDate(),s=new Date(t.getFullYear(),t.getMonth(),1).getDay();let n="";for(let l=0;l<s;l++)n+='<div style="padding: 1rem; border: 1px solid var(--border); background: var(--bg-main); opacity: 0.5;"></div>';for(let l=1;l<=a;l++){const i=e.some(p=>{const f=new Date(p.scheduled_at||p.created_at);return f.getDate()===l&&f.getMonth()===t.getMonth()&&f.getFullYear()===t.getFullYear()});n+=`
            <div style="padding: 1rem; border: 1px solid var(--border); min-height: 80px; position: relative; background: var(--bg-card);">
                <span style="font-weight: ${l===t.getDate()?"800":"500"}; color: ${l===t.getDate()?"var(--primary)":"inherit"};">${l}</span>
                ${i?'<div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: var(--primary);"></div>':""}
            </div>
        `}return`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Schedule</h1>
                    <p class="text-muted">Plan and manage your upcoming email sends.</p>
                </div>
                <button class="btn btn-primary" id="schedule-create-btn">
                    <span>+</span> Schedule Campaign
                </button>
            </header>

            <div class="card mb-8">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex gap-4">
                        <button class="btn btn-primary" id="view-list-btn" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">List View</button>
                        <button class="btn btn-outline" id="view-calendar-btn" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Calendar View</button>
                    </div>
                </div>

                <!-- List View -->
                <div id="schedule-list-view" class="flex flex-col gap-2">
                    ${e.map(l=>`
                        <div class="flex items-center gap-6 p-4 border-bottom" style="border-bottom: 1px solid var(--border);">
                            <div style="text-align: center; min-width: 100px;">
                                <p style="font-weight: 800; color: var(--primary);">${new Date(l.scheduled_at||l.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">${new Date(l.scheduled_at||l.created_at).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</p>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="font-size: 1rem; font-weight: 700;">${l.name}</h4>
                                <span class="status-badge status-${l.status}" style="font-size: 0.65rem; margin-top: 0.25rem;">${l.status}</span>
                            </div>
                            <button class="btn btn-outline edit-schedule-btn" data-id="${l.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                        </div>
                    `).join("")}
                    ${e.length===0?'<div class="text-muted" style="text-align: center; padding: 3rem;">No upcoming campaigns found.</div>':""}
                </div>

                <!-- Calendar View -->
                <div id="schedule-calendar-view" style="display: none;">
                    <h3 style="text-align: center; margin-bottom: 1rem;">${t.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</h3>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; margin-bottom: 0.5rem;">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; background: var(--border);">
                        ${n}
                    </div>
                </div>
            </div>
        </div>
    `}function oe(){const e=document.getElementById("schedule-create-btn");e&&(e.onclick=()=>window.location.hash="#campaign");const t=document.getElementById("view-list-btn"),a=document.getElementById("view-calendar-btn"),s=document.getElementById("schedule-list-view"),n=document.getElementById("schedule-calendar-view");t&&a&&(t.onclick=()=>{s.style.display="flex",n.style.display="none",t.className="btn btn-primary",a.className="btn btn-outline",t.style.padding="0.5rem 1rem",t.style.borderRadius="var(--radius-sm)",a.style.padding="0.5rem 1rem",a.style.borderRadius="var(--radius-sm)"},a.onclick=()=>{s.style.display="none",n.style.display="block",a.className="btn btn-primary",t.className="btn btn-outline",t.style.padding="0.5rem 1rem",t.style.borderRadius="var(--radius-sm)",a.style.padding="0.5rem 1rem",a.style.borderRadius="var(--radius-sm)"})}async function le(){return`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Templates</h1>
                    <p class="text-muted">Choose a professional starting point for your next campaign.</p>
                </div>
                <button class="btn btn-primary" style="border-radius: var(--radius-sm);"><span>+</span> Custom Template</button>
            </header>

            <div class="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button class="btn btn-primary" style="padding: 0.5rem 1.25rem;">All</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Newsletter</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">E-commerce</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Events</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Automation</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                ${[{name:"Minimalist Blog",desc:"Perfect for text-heavy updates.",color:"#f8fafc"},{name:"Modern E-commerce",desc:"Showcase your seasonal products.",color:"#f1f5f9"},{name:"Event Invitation",desc:"Elegant layout for webinars.",color:"#fdfcfe"},{name:"Monthly Digest",desc:"Curated content summary.",color:"#fff"},{name:"Welcome Series",desc:"First impression for new users.",color:"#faf9f6"},{name:"Flash Sale",desc:"High-conversion retail layout.",color:"#f8fafc"}].map((e,t)=>`
                    <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--border); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="height: 220px; background: ${e.color}; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border);">
                            <div style="width: 70%; height: 60%; background: white; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 1rem; border: 1px solid #eee;">
                                <div style="width: 100%; height: 8px; background: #eee; margin-bottom: 0.5rem;"></div>
                                <div style="width: 60%; height: 8px; background: #f5f5f5; margin-bottom: 1rem;"></div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                    <div style="aspect-ratio: 1; background: #fdfdfd; border: 1px solid #f0f0f0;"></div>
                                    <div style="aspect-ratio: 1; background: #fdfdfd; border: 1px solid #f0f0f0;"></div>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 1.5rem;">
                            <h4 style="margin-bottom: 0.5rem; font-weight: 700;">${e.name}</h4>
                            <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.5rem;">${e.desc}</p>
                            <button class="btn btn-outline" style="width: 100%; font-size: 0.875rem;">Use Template</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `}async function de(){const e=localStorage.getItem("camp_sheets_connected")==="true";return setTimeout(()=>{const t=document.getElementById("connect-sheets-btn");t&&(t.onclick=()=>{e?(localStorage.setItem("camp_sheets_connected","false"),window.location.reload()):(t.innerHTML='<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Connecting...',t.style.opacity="0.7",setTimeout(()=>{localStorage.setItem("camp_sheets_connected","true"),window.location.reload()},1500))})},100),`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Integrations</h1>
                    <p class="text-muted">Connect Sendable with your favorite tools to automate your workflow.</p>
                </div>
                <div style="position: relative;">
                    <input type="text" placeholder="Search integrations..." class="input" style="padding-left: 2.5rem; width: 320px; border-radius: 20px;">
                    <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
                </div>
            </header>

            <div class="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button class="btn btn-primary" style="padding: 0.5rem 1.25rem;">Featured</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">E-commerce</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">CRM & Sales</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Analytics</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Developer Tools</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                ${[{name:"Shopify",desc:"Import products and sync customer purchase history automatically.",icon:"🛍️",status:"Connected"},{name:"WordPress",desc:"Integrate signup forms and publish newsletters as blog posts.",icon:"📝",status:"Available"},{name:"Zapier",desc:"Connect with 5000+ apps to trigger emails from any event.",icon:"⚡",status:"Available"},{name:"Stripe",desc:"Track customer lifetime value and payment-triggered automations.",icon:"💳",status:"Available"},{name:"Salesforce",desc:"Sync leads and contacts directly with your Salesforce CRM.",icon:"☁️",status:"Available"},{name:"Google Sheets",desc:"Live sync your audience segments with shared spreadsheets.",icon:"📄",status:e?"Connected":"Available",id:"connect-sheets-btn"}].map(t=>`
                    <div class="card" style="display: flex; flex-direction: column; align-items: flex-start; padding: 2rem; position: relative;">
                        ${t.status==="Connected"?'<span class="status-badge status-sent" style="position: absolute; top: 1.5rem; right: 1.5rem;">Connected</span>':""}
                        <div style="width: 56px; height: 56px; background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem;">
                            ${t.icon}
                        </div>
                        <h4 style="margin-bottom: 0.75rem; font-weight: 700;">${t.name}</h4>
                        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 2rem; flex-grow: 1; line-height: 1.5;">${t.desc}</p>
                        <button ${t.id?`id="${t.id}"`:""} class="btn ${t.status==="Connected"?"btn-outline":"btn-primary"}" style="width: 100%; border-radius: var(--radius-sm);">${t.status==="Connected"?"Disconnect":"Connect"}</button>
                    </div>
                `).join("")}
            </div>
            
            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
            </style>
        </div>
    `}function J(){return`
        <div class="landing-page" style="width: 100%; display: flex; flex-direction: column; align-items: center; background: white; color: var(--text-main);">
            <header style="width: 100%; padding: 1.5rem 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: white; z-index: 100;">
                <div class="logo" style="margin-bottom: 0;">
                    <span style="font-size: 2rem;">🏕️</span>
                    <span style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading);">Camp</span>
                </div>
                <nav style="display: flex; gap: 2rem; align-items: center;">
                    <a href="#plans" style="text-decoration: none; color: var(--text-main); font-weight: 600;">Pricing</a>
                    <a href="/login" class="btn btn-secondary" data-link>Log In</a>
                    <a href="/signup" class="btn btn-primary" data-link>Sign Up Free</a>
                </nav>
            </header>

            <main style="width: 100%; max-width: 1200px; padding: 4rem 2rem; text-align: center;">
                <section class="hero mb-8">
                    <h1 style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem;">Grow your business with <span style="color: var(--primary);">Camp</span></h1>
                    <p class="text-muted" style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2.5rem;">The #1 email marketing and automation platform. Spend less to grow more with our smart tools.</p>
                    <div class="flex gap-2 justify-center" style="justify-content: center;">
                        <a href="/signup" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.125rem;" data-link>Start Free Trial</a>
                        <a href="#plans" class="btn btn-secondary" style="padding: 1rem 2rem; font-size: 1.125rem;">Compare Plans</a>
                    </div>
                </section>

                <section id="plans" style="padding-top: 4rem;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">Ready to find your plan?</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; text-align: left;">
                        <!-- Free Plan -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Free</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Use core features to manage early growth.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$0</span>
                                <span class="text-muted">/mo</span>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ Up to 500 contacts</li>
                                <li style="margin-bottom: 0.75rem;">✅ 1,000 monthly sends</li>
                                <li style="margin-bottom: 0.75rem;">✅ Basic email templates</li>
                                <li style="margin-bottom: 0.75rem;">✅ Forms & Landing pages</li>
                            </ul>
                            <a href="/signup" class="btn btn-secondary" style="width: 100%;" data-link>Sign Up Free</a>
                        </div>

                        <!-- Essentials Plan -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem; border-color: var(--border);">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Essentials</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Send the right content at the right time.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$6.50</span>
                                <span class="text-muted">/mo</span>
                                <p style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Save 50% for 12 months</p>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ All Free features</li>
                                <li style="margin-bottom: 0.75rem;">✅ 24/7 Support</li>
                                <li style="margin-bottom: 0.75rem;">✅ Email Scheduling</li>
                                <li style="margin-bottom: 0.75rem;">✅ A/B Testing</li>
                            </ul>
                            <a href="/signup" class="btn btn-secondary" style="width: 100%;" data-link>Buy Now</a>
                        </div>

                        <!-- Standard Plan (Featured) -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem; border: 2px solid var(--primary); position: relative; transform: scale(1.05); z-index: 10; background: #fafafa;">
                            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary); color: white; padding: 0.25rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Best Value</div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Standard</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Sell even more with personalization tools.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$10</span>
                                <span class="text-muted">/mo</span>
                                <p style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Save 50% for 12 months</p>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ All Essentials features</li>
                                <li style="margin-bottom: 0.75rem;">✅ Predictive Segmentation</li>
                                <li style="margin-bottom: 0.75rem;">✅ Enhanced Automations</li>
                                <li style="margin-bottom: 0.75rem;">✅ Custom Email Templates</li>
                            </ul>
                            <a href="/signup" class="btn btn-primary" style="width: 100%;" data-link>Buy Now</a>
                        </div>

                        <!-- Premium Plan -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Premium</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Scale fast with dedicated onboarding.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$175</span>
                                <span class="text-muted">/mo</span>
                                <p style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Save 50% for 12 months</p>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ All Standard features</li>
                                <li style="margin-bottom: 0.75rem;">✅ Unlimited Contacts</li>
                                <li style="margin-bottom: 0.75rem;">✅ Priority Support</li>
                                <li style="margin-bottom: 0.75rem;">✅ Personal Onboarding</li>
                            </ul>
                            <a href="/signup" class="btn btn-secondary" style="width: 100%;" data-link>Buy Now</a>
                        </div>
                    </div>
                </section>
            </main>

            <footer style="width: 100%; padding: 4rem 5%; background: var(--bg-main); border-top: 1px solid var(--border); margin-top: 4rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem;">
                    <div>
                        <div class="logo">
                            <span style="font-size: 1.5rem;">🏕️</span>
                            <span>Camp</span>
                        </div>
                        <p class="text-muted" style="font-size: 0.875rem; margin-top: 1rem;">The world's leading email marketing platform for creators and small businesses.</p>
                    </div>
                    <div>
                        <h4 class="mb-4">Product</h4>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;" class="text-muted">
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>Integrations</li>
                            <li>Status</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="mb-4">Resources</h4>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;" class="text-muted">
                            <li>Blog</li>
                            <li>Help Center</li>
                            <li>Developers</li>
                            <li>Community</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="mb-4">Company</h4>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;" class="text-muted">
                            <li>About</li>
                            <li>Careers</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); text-align: center;" class="text-muted">
                    <p style="font-size: 0.75rem;">© 2001-2026 Camp Email Marketing Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    `}async function ce(){const e=JSON.parse(localStorage.getItem("camp_user")||"{}");let t={};try{e.id&&(t=await M.getSMTP(e.id))}catch(a){console.error("Failed to fetch SMTP settings",a)}return`
        <div class="main-content">
            <header class="mb-8">
                <h1 style="font-size: 2.25rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 0.5rem;">Settings</h1>
                <p class="text-muted">Configure your sender identity and delivery engine.</p>
            </header>

            <div class="grid-2" style="grid-template-columns: 1fr 1.5fr; gap: 2rem; align-items: start;">
                <!-- Profile Section -->
                <div class="card" style="padding: 2rem;">
                    <h3 class="mb-6" style="font-weight: 700;">Profile Info</h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Account Name</label>
                            <p style="font-weight: 600; font-size: 1.1rem;">${e.name||"Not set"}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Email Address</label>
                            <p style="color: var(--text-muted);">${e.email||"Not set"}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Company</label>
                            <p style="font-weight: 600;">${e.company_name||"Individual"}</p>
                        </div>
                    </div>
                </div>

                <!-- SMTP Section -->
                <div class="card" style="padding: 2rem;">
                    <div class="flex justify-between items-center mb-6">
                        <h3 style="font-weight: 700;">Delivery Engine (SMTP)</h3>
                        <div class="flex gap-2">
                             <button class="btn btn-outline preset-btn" data-preset="hostinger" style="padding: 4px 10px; font-size: 0.75rem;">Hostinger</button>
                             <button class="btn btn-outline preset-btn" data-preset="gmail" style="padding: 4px 10px; font-size: 0.75rem;">Gmail</button>
                        </div>
                    </div>
                    
                    <form id="smtp-form">
                        <div class="grid-2 mb-4" style="gap: 1.5rem; grid-template-columns: 2fr 1fr;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">SMTP Host</label>
                                <input type="text" name="host" class="input" style="width: 100%; padding: 0.75rem;" placeholder="smtp.hostinger.com" value="${t.host||""}" required>
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Port</label>
                                <input type="number" name="port" class="input" style="width: 100%; padding: 0.75rem;" placeholder="465" value="${t.port||465}" required>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Username / Email</label>
                            <input type="email" name="username" class="input" style="width: 100%; padding: 0.75rem;" placeholder="sender@yourdomain.com" value="${t.username||""}" required>
                        </div>
                        
                        <div class="mb-4">
                            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Password</label>
                            <input type="password" name="password" class="input" style="width: 100%; padding: 0.75rem;" placeholder="••••••••" value="${t.password||""}" required>
                        </div>

                        <div class="mb-8">
                            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Security Type</label>
                            <select name="security_type" class="input" style="width: 100%; padding: 0.75rem;">
                                <option value="ssl" ${t.security_type?.toLowerCase()==="ssl"?"selected":""}>SSL (Port 465)</option>
                                <option value="tls" ${t.security_type?.toLowerCase()==="tls"||!t.security_type?"selected":""}>TLS (Port 587)</option>
                                <option value="none" ${t.security_type?.toLowerCase()==="none"?"selected":""}>None (Port 25)</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 700; border-radius: var(--radius);">Save Settings</button>
                    </form>
                </div>
            </div>
        </div>
    `}function me(){const e=document.getElementById("smtp-form"),t=document.querySelectorAll(".preset-btn"),a=JSON.parse(localStorage.getItem("camp_user")||"{}");t.forEach(s=>{s.onclick=()=>{const n=s.dataset.preset;n==="hostinger"?(e.host.value="smtp.hostinger.com",e.port.value="465",e.security_type.value="ssl"):n==="gmail"&&(e.host.value="smtp.gmail.com",e.port.value="587",e.security_type.value="tls"),w(`Applied ${n} presets`,"info")}}),e&&(e.onsubmit=async s=>{s.preventDefault();const n=new FormData(e),l=Object.fromEntries(n.entries());l.port=parseInt(l.port),l.account_id=a.id;try{await M.saveSMTP(l),w("SMTP settings updated successfully!","success")}catch(i){w("Failed to save settings: "+i.message,"error")}})}function O(e="signup"){return e==="signup"?ue():pe()}function pe(){return`
        <div id="auth-container" style="width: 100%; min-height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 2rem; font-family: 'Outfit', sans-serif; background: #020b14;">
            <canvas id="auth-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;"></canvas>
            
            <div class="card glass" style="width: 100%; max-width: 420px; padding: 3rem; border-radius: 30px; position: relative; z-index: 10; background: rgba(255, 255, 255, 0.03); -webkit-backdrop-filter: blur(30px); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <div style="text-align: center; margin-bottom: 2.5rem;">
                    <div style="font-size: 1.2rem; font-weight: 800; background: linear-gradient(90deg, #00ff88, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">MailerPRO</div>
                    <h1 style="font-size: 2.2rem; font-weight: 900; letter-spacing: -0.02em; color: #fff;">Welcome Back</h1>
                    <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.5); margin-top: 0.75rem;">
                        Enter your credentials to access the world.
                    </p>
                </div>
                <form id="auth-form" data-type="login">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Work Email</label>
                        <input type="email" name="email" required placeholder="name@company.com" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit; transition: 0.3s;" onfocus="this.style.borderColor='#00ff88'; this.style.background='rgba(255,255,255,0.08)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.05)'">
                    </div>
                    <div style="margin-bottom: 2.5rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Secure Password</label>
                        <input type="password" name="password" required placeholder="••••••••" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit; transition: 0.3s;" onfocus="this.style.borderColor='#00ff88'; this.style.background='rgba(255,255,255,0.08)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.05)'">
                    </div>
                    <button type="submit" style="width: 100%; padding: 1rem; border-radius: 12px; background: linear-gradient(135deg, #00ff88, #00e5ff); color: #000; font-weight: 800; font-size: 1rem; border: none; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 30px rgba(0, 255, 136, 0.25);" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 40px rgba(0, 255, 136, 0.35)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0, 255, 136, 0.25)'">Log In to Dashboard</button>
                    <p style="text-align: center; font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); margin-top: 2rem;">
                        New to MailerPRO? 
                        <a href="/signup" style="color: #00ff88; font-weight: 700; text-decoration: none;" data-link>Create Account</a>
                    </p>
                </form>
            </div>
        </div>
    `}function ue(){return`
        <div id="auth-container" style="width: 100%; min-height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 2rem; font-family: 'Outfit', sans-serif; background: #020b14;">
            <canvas id="auth-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;"></canvas>

            <div class="card glass" style="width: 100%; max-width: 600px; padding: 3.5rem; border-radius: 35px; position: relative; z-index: 10; background: rgba(255, 255, 255, 0.03); -webkit-backdrop-filter: blur(30px); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <!-- Wizard Header -->
                <div style="margin-bottom: 3rem; text-align: center;">
                    <div style="font-size: 1rem; font-weight: 800; background: linear-gradient(90deg, #00ff88, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Join MailerPRO</div>
                    <h1 id="wizard-title" style="font-size: 2.2rem; font-weight: 900; letter-spacing: -0.02em; color: #fff;">Create Account</h1>
                    <div class="flex justify-center mt-6" style="gap: 0.8rem; display: flex; justify-content: center; margin-top: 1.5rem;" id="wizard-steps-indicator">
                        <div class="step-dot active" data-step="1" style="width: 12px; height: 12px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 10px #00ff88;"></div>
                        <div class="step-dot" data-step="2" style="width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.1);"></div>
                        <div class="step-dot" data-step="3" style="width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.1);"></div>
                    </div>
                </div>

                <form id="auth-form" data-type="signup">
                    <!-- Step 1: Personal Info -->
                    <div id="step-1" class="wizard-step">
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Full Name</label>
                            <input type="text" name="name" required placeholder="John Doe" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Work Email</label>
                            <input type="email" name="email" required placeholder="john@company.com" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <div style="margin-bottom: 2.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Secure Password</label>
                            <input type="password" name="password" required placeholder="••••••••" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <button type="button" class="next-btn" style="width: 100%; padding: 1rem; border-radius: 12px; background: linear-gradient(135deg, #00ff88, #00e5ff); color: #000; font-weight: 800; font-size: 1rem; border: none; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 30px rgba(0, 255, 136, 0.25);">Next: Business Details</button>
                    </div>

                    <!-- Step 2: Business Info -->
                    <div id="step-2" class="wizard-step" style="display: none;">
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Company Name</label>
                            <input type="text" name="company_name" placeholder="Acme Corp" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <div style="margin-bottom: 2.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">Sending Domain</label>
                            <input type="text" name="domain" placeholder="acme.com" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="button" class="prev-btn" style="flex: 1; padding: 1rem; border-radius: 12px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer;">Back</button>
                            <button type="button" class="next-btn" style="flex: 2; padding: 1rem; border-radius: 12px; background: linear-gradient(135deg, #00ff88, #00e5ff); color: #000; font-weight: 800; cursor: pointer; border: none;">Next: SMTP Config</button>
                        </div>
                    </div>

                    <!-- Step 3: SMTP Settings -->
                    <div id="step-3" class="wizard-step" style="display: none;">
                        <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; border-left: 3px solid #00ff88; padding-left: 1rem; margin-bottom: 1.5rem;">
                            Configure your company SMTP server for guaranteed inbox delivery.
                        </p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div>
                                <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem;">SMTP Host</label>
                                <input type="text" name="smtp_host" placeholder="smtp.gmail.com" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem;">Port</label>
                                <input type="number" name="smtp_port" placeholder="587" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                            </div>
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">SMTP Username</label>
                            <input type="text" name="smtp_user" placeholder="user@domain.com" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <div style="margin-bottom: 2.5rem;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; margin-left: 0.5rem;">SMTP Password</label>
                            <input type="password" name="smtp_pass" placeholder="••••••••" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1.2rem; border-radius: 12px; color: #fff; outline: none; font-family: inherit;">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="button" class="prev-btn" style="flex: 1; padding: 1rem; border-radius: 12px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer;">Back</button>
                            <button type="submit" style="flex: 2; padding: 1rem; border-radius: 12px; background: linear-gradient(135deg, #00ff88, #00e5ff); color: #000; font-weight: 800; cursor: pointer; border: none;">Start Global Reach</button>
                        </div>
                    </div>
                    <p style="text-align: center; font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); margin-top: 2rem;">
                        Already have an account? 
                        <a href="/login" style="color: #00ff88; font-weight: 700; text-decoration: none;" data-link>Log In</a>
                    </p>
                </form>
            </div>
        </div>
    `}function ge(){const e=document.getElementById("auth-form"),t=document.getElementById("auth-canvas");if(!e||!t)return;let a,s,n,l,i;(()=>{try{a=new THREE.WebGLRenderer({canvas:t,antialias:!0,alpha:!0}),a.setPixelRatio(window.devicePixelRatio),a.setSize(t.clientWidth,t.clientHeight),s=new THREE.Scene,n=new THREE.PerspectiveCamera(60,t.clientWidth/t.clientHeight,.1,1e3),n.position.z=2.5;const o=new THREE.AmbientLight(16777215,.4);s.add(o);const u=new THREE.DirectionalLight(16777215,1);u.position.set(5,3,5),s.add(u);const m=new THREE.TextureLoader;m.setCrossOrigin("anonymous");const r=new THREE.SphereGeometry(1,64,64),d=new THREE.MeshPhongMaterial({color:2241535,shininess:5});l=new THREE.Mesh(r,d),s.add(l),m.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",$=>{d.map=$,d.needsUpdate=!0,d.color.set(16777215)},void 0,$=>console.warn("Earth texture failed, using fallback color"));const g=new THREE.SphereGeometry(1.02,64,64),b=new THREE.MeshPhongMaterial({transparent:!0,opacity:.3});i=new THREE.Mesh(g,b),s.add(i),m.load("https://unpkg.com/three-globe/example/img/earth-clouds.png",$=>{b.map=$,b.needsUpdate=!0},void 0,$=>{i.visible=!1});const E=new THREE.SphereGeometry(10,64,64),y=new THREE.MeshBasicMaterial({side:THREE.BackSide,transparent:!0,opacity:.2,color:1118498}),v=new THREE.Mesh(E,y);s.add(v),m.load("https://unpkg.com/three-globe/example/img/night-sky.png",$=>{y.map=$,y.needsUpdate=!0,y.color.set(16777215)},void 0,$=>{});const z=()=>{document.getElementById("auth-canvas")&&(requestAnimationFrame(z),l&&(l.rotation.y+=.001),i&&(i.rotation.y+=.0015),a.render(s,n))};z()}catch(o){console.error("Three.js Init Error:",o)}})(),window.addEventListener("resize",()=>{t&&(n.aspect=t.clientWidth/t.clientHeight,n.updateProjectionMatrix(),a.setSize(t.clientWidth,t.clientHeight))});let f=1;const c=o=>{document.querySelectorAll(".wizard-step").forEach(m=>m.style.display="none"),document.getElementById(`step-${o}`).style.display="block",document.querySelectorAll(".step-dot").forEach(m=>{const r=m.dataset.step==o;m.style.background=r?"#00ff88":"rgba(255,255,255,0.1)",m.style.boxShadow=r?"0 0 10px #00ff88":"none"});const u=document.getElementById("wizard-title");u&&(o===1&&(u.textContent="Create Account"),o===2&&(u.textContent="Business Details"),o===3&&(u.textContent="Network Config"))};e.addEventListener("click",o=>{if(o.target.classList.contains("next-btn")){if(f===1){const u=e.querySelector('[name="name"]').value,m=e.querySelector('[name="email"]').value,r=e.querySelector('[name="password"]').value;if(!u||!m||!r){w("Please fill in all account details.","error");return}}f++,c(f)}o.target.classList.contains("prev-btn")&&(f--,c(f))}),e.onsubmit=async o=>{o.preventDefault();const u=new FormData(e),m=Object.fromEntries(u.entries()),r=e.dataset.type==="signup";try{let d;if(r){const g=await M.signup({name:m.name,email:m.email,password:m.password,company_name:m.company_name,domain:m.domain});m.smtp_host&&await M.saveSMTP({account_id:g.id,host:m.smtp_host,port:parseInt(m.smtp_port),username:m.smtp_user,password:m.smtp_pass,security_type:"tls"}),d={id:g.id,name:m.name,email:m.email}}else d=await M.login({email:m.email,password:m.password});localStorage.setItem("camp_user",JSON.stringify(d)),window.sessionStorage.setItem("isLoggedIn","true"),w(r?"Setup complete! Welcome to the premium inbox experience.":"Welcome back!","success"),window.location.href="/"}catch(d){w((r?"Setup failed: ":"Login failed: ")+d.message,"error")}}}const q=document.getElementById("app"),Y={"/":U,"/contacts":te,"/campaigns":ae,"/automation":ie,"/analytics":ne,"/schedule":re,"/templates":le,"/integration":de,"/settings":ce,"/login":()=>O("login"),"/signup":()=>O("signup"),"/landing":J};async function fe(e){const t=window.sessionStorage.getItem("isLoggedIn")==="true";if(e==="/logout"){window.sessionStorage.removeItem("isLoggedIn"),window.location.href="/landing";return}!t&&!["/login","/signup","/landing"].includes(e)&&(window.history.replaceState({},"","/landing"),e="/landing"),t&&["/login","/signup","/landing"].includes(e)&&(window.history.replaceState({},"","/"),e="/");const a=Y[e]||(t?U:J),n=t&&!["/landing","/login","/signup"].includes(e),l=await a();if(n){const d=K(e);q.innerHTML=`
            ${d}
            <div class="layout-container" style="width: 100%;">
                <div id="content-area" style="flex: 1; min-width: 0;">
                    ${l}
                </div>
            </div>
        `}else q.innerHTML=`<div style="width: 100%;">${l}</div>`;document.querySelectorAll(".card table, .card .campaign-table").forEach(d=>{if(!d.parentElement.classList.contains("table-wrapper")){const g=document.createElement("div");g.className="table-wrapper",d.parentNode.insertBefore(g,d),g.appendChild(d)}}),e==="/contacts"&&W(),e==="/campaigns"&&se(),e==="/schedule"&&oe(),e==="/settings"&&me(),e==="/"&&ee(),["/login","/signup"].includes(e)&&ge();const i=document.getElementById("logout-btn");i&&(i.onclick=d=>{d.preventDefault(),window.sessionStorage.removeItem("isLoggedIn"),window.location.href="/landing"});const p=document.getElementById("dark-mode-circle"),f=document.getElementById("dark-mode-toggle");if(p&&f){const d=document.body.classList.contains("dark-theme");p.style.left=d?"21px":"3px",f.style.background=d?"var(--primary)":"var(--border)",f.onclick=()=>{const g=document.body.classList.toggle("dark-theme");localStorage.setItem("camp_dark_mode",g),p.style.left=g?"21px":"3px",f.style.background=g?"var(--primary)":"var(--border)"}}const c=document.getElementById("hamburger-btn"),o=document.getElementById("sidebar"),u=document.getElementById("sidebar-overlay");function m(){o&&o.classList.add("open"),u&&u.classList.add("active"),c&&c.classList.add("open"),document.body.style.overflow="hidden"}function r(){o&&o.classList.remove("open"),u&&u.classList.remove("active"),c&&c.classList.remove("open"),document.body.style.overflow=""}c&&(c.onclick=()=>o&&o.classList.contains("open")?r():m()),u&&(u.onclick=r),document.querySelectorAll(".sidebar .nav-link[data-link]").forEach(d=>{d.addEventListener("click",()=>{window.innerWidth<=768&&r()})})}localStorage.getItem("camp_dark_mode")==="true"&&document.body.classList.add("dark-theme");new X(Y,e=>{fe(e)});
