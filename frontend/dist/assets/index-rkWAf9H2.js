(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();class W{constructor(t,a){this.routes=t,this.onRouteMatch=a,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",t=>{const a=t.target.closest("a[data-link]");a&&(t.preventDefault(),this.navigate(a.getAttribute("href")))}),this.handleRoute()}navigate(t){window.history.pushState({},"",t),this.handleRoute()}handleRoute(){const t=window.location.pathname,a=this.routes[t]||this.routes["/"];this.onRouteMatch(t,a)}}function J(e){const t=[{path:"/",title:"Overview",icon:"▦"},{path:"/campaigns",title:"Campaign",icon:"✉"},{path:"/contacts",title:"Contacts",icon:"👥"},{path:"/automation",title:"Automation",icon:"⚙"},{path:"/analytics",title:"Analytics",icon:"📊"},{path:"/schedule",title:"Schedule",icon:"🕒",hasChevron:!0},{path:"/templates",title:"Templates",icon:"📄",hasChevron:!0},{path:"/integration",title:"Integration",icon:"📦"}],a=[{path:"/help",title:"Help Center",icon:"?"},{path:"/settings",title:"Setting",icon:"⚙"}],s=JSON.parse(localStorage.getItem("camp_user")||'{"name": "User", "email": "user@sendable.com"}');return`
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
                ${t.map(i=>`
                    <li>
                        <a href="${i.path}" class="nav-link ${e===i.path?"active":""} ${i.hasChevron?"nav-link-with-chevron":""}" data-link>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${i.icon}</span>
                                <span>${i.title}</span>
                            </div>
                            ${i.hasChevron?'<span style="font-size: 0.7rem; opacity: 0.6;">⌵</span>':""}
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
                    ${a.map(i=>`
                        <li>
                            <a href="${i.path}" class="nav-link ${e===i.path?"active":""}" data-link>
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${i.icon}</span>
                                <span>${i.title}</span>
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
    `}const I="/api",v={async get(e){const t=await fetch(`${I}${e}`);if(!t.ok)throw new Error(`API Error: ${t.statusText}`);return t.json()},async post(e,t){const a=await fetch(`${I}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok)throw new Error(`API Error: ${a.statusText}`);return a.json()},async patch(e,t){const a=await fetch(`${I}${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok)throw new Error(`API Error: ${a.statusText}`);return a.json()},async put(e,t){const a=await fetch(`${I}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok)throw new Error(`API Error: ${a.statusText}`);const s=await a.text();return s?JSON.parse(s):null},async delete(e){const t=await fetch(`${I}${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`API Error: ${t.statusText}`);const a=await t.text();return a?JSON.parse(a):null}},L={list:async()=>{const e=JSON.parse(localStorage.getItem("camp_user")||"{}"),t=e.id?`?account_id=${e.id}`:"";return await v.get(`/contacts${t}`)||[]},create:e=>{const t=JSON.parse(localStorage.getItem("camp_user")||"{}");return t.id&&(e.account_id=parseInt(t.id)),v.post("/contacts",e)},update:(e,t)=>v.put(`/contacts/${e}`,t),delete:e=>v.delete(`/contacts/${e}`),addTag:e=>v.post("/contacts/tag",e),removeTag:(e,t)=>v.patch(`/contacts/${e}/tag`,t)},k={list:async()=>await v.get("/campaigns")||[],get:e=>v.get(`/campaigns/${e}`),create:e=>v.post("/campaigns",e),update:(e,t)=>v.put(`/campaigns/${e}`,t),generateAI:e=>v.post("/campaigns/generate-ai",e)},G={listSent:async()=>{const e=JSON.parse(localStorage.getItem("camp_user")||"{}"),t=e.id?`?account_id=${e.id}`:"";return await v.get(`/emails/sent${t}`)||[]}},M={getOverview:()=>v.get("/stats/overview")},A={signup:e=>v.post("/signup",e),login:e=>v.post("/login",e),saveSMTP:e=>v.post("/settings/smtp",e),getWarming:e=>v.get(`/stats/warming?account_id=${e}`)},V={getHealth:e=>v.get(`/domain/health?domain=${e}`)};async function F(){let e={total_contacts:0,total_sent:0,open_rate:0,ctr:0,revenue:0,audience_growth:[]},t=[],a=null,s=null;try{const r=JSON.parse(localStorage.getItem("camp_user")||"{}"),o=[M.getOverview(),k.list()];r.id&&o.push(A.getWarming(r.id)),r.domain&&o.push(V.getHealth(r.domain));const l=await Promise.all(o);e=l[0],t=l[1],r.id&&(a=l[2]),r.domain&&(s=l[3]),t=(t||[]).slice(0,4)}catch(r){console.error("Failed to fetch dashboard data",r)}const i=JSON.parse(localStorage.getItem("camp_user")||'{ "name": "Test User" }'),n=i.name;return`
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
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=8a9a5b&color=fff" style="width: 40px; height: 40px; border-radius: 50%;" />
                        <div style="line-height: 1.2;">
                            <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Welcome,</p>
                            <p style="font-size: 0.875rem; font-weight: 800;">${n}</p>
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
                                ${t.filter(r=>r.status==="scheduled").length>0?t.filter(r=>r.status==="scheduled").map(r=>`
                                        <div class="card" style="padding: 1rem; border: 1px solid var(--border); box-shadow: none;">
                                            <div class="flex justify-between items-center">
                                                <div class="flex items-center gap-3">
                                                    <div style="font-size: 1.25rem;">✉</div>
                                                    <div>
                                                        <p style="font-size: 0.875rem; font-weight: 700;">${r.name}</p>
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
                                ${t.map(r=>`
                                    <tr>
                                        <td style="font-weight: 700;">${r.name}</td>
                                        <td>
                                            <span class="status-badge status-${r.status}">${r.status}</span>
                                        </td>
                                        <td style="font-weight: 700;">${r.open_rate}%</td>
                                        <td style="font-weight: 700;">${r.ctr}%</td>
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
                            <input type="text" id="domain-check-input" class="input" placeholder="yourdomain.com" value="${i.domain||""}" style="flex: 1; padding: 0.6rem 0.875rem; font-size: 0.875rem;">
                            <button class="btn btn-primary" id="check-health-btn" style="padding: 0.6rem 1rem; font-size: 0.8125rem; white-space: nowrap;">
                                🔍 Check
                            </button>
                        </div>

                        <!-- Result Panel -->
                        <div id="health-result-panel">
                            ${s?`
                            <div style="display: flex; flex-direction: column; gap: 0.625rem;">
                                ${E("SPF",s.spf,s.spf_record)}
                                ${E("DKIM",s.dkim,s.dkim_selector?`Selector: ${s.dkim_selector}`:null)}
                                ${E("DMARC",s.dmarc,s.dmarc_record)}
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
    `}function E(e,t,a){const s=t?"#059669":"#ea580c",i=t?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.06)",n=t?"✅":"❌",r=a?`<span style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;font-family:monospace;word-break:break-all;">${a}</span>`:"";return`
        <div style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.6rem 0.75rem;background:${i};border-radius:8px;">
            <span style="font-size:0.9rem;flex-shrink:0;margin-top:1px;">${n}</span>
            <div style="display:flex;flex-direction:column;">
                <span style="font-size:0.8125rem;font-weight:700;color:${s};">${e}</span>
                ${r}
            </div>
        </div>`}function Y(){const e=document.getElementById("dash-create-camp");e&&(e.onclick=()=>{window.history.pushState({},"","/campaigns"),window.dispatchEvent(new PopStateEvent("popstate"))});const t=document.getElementById("check-health-btn"),a=document.getElementById("domain-check-input"),s=document.getElementById("health-badge"),i=document.getElementById("health-result-panel");!t||!a||(t.onclick=async()=>{const n=a.value.trim().replace(/^https?:\/\//,"").replace(/\/.*$/,"");if(!n){a.focus();return}t.disabled=!0,t.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite;">⟳</span> Checking…',i.innerHTML=`<div style="font-size:0.8125rem;color:var(--text-muted);text-align:center;padding:1rem 0;">Looking up DNS records for <strong>${n}</strong>…</div>`;try{const r=await fetch(`/api/domain/health?domain=${encodeURIComponent(n)}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);const o=await r.json(),l=o.spf&&o.dkim&&o.dmarc;s.textContent=l?"Excellent":"Action Needed",s.style.cssText=l?"font-size:0.65rem;background:#ecfdf5;color:#059669;":"font-size:0.65rem;background:#fff7ed;color:#ea580c;";const d=o.dkim_selector?`Selector found: ${o.dkim_selector}`:null;i.innerHTML=`
                <div style="display:flex;flex-direction:column;gap:0.625rem;">
                    ${E("SPF",o.spf,o.spf_record||null)}
                    ${E("DKIM",o.dkim,d)}
                    ${E("DMARC",o.dmarc,o.dmarc_record||null)}
                </div>
                <div style="font-size:0.75rem;color:var(--text-muted);background:var(--bg-main);padding:0.75rem;border-radius:8px;margin-top:0.875rem;line-height:1.5;">
                    ${l?"✅ All records verified. Your domain is properly authenticated for inbox delivery.":"⚠️ Some records are missing or not yet propagated. DNS changes can take 24–48 hours to be visible globally. If you just added a record, wait and try again."}
                </div>`;const c=JSON.parse(localStorage.getItem("camp_user")||"{}");localStorage.setItem("camp_user",JSON.stringify({...c,domain:n}))}catch(r){i.innerHTML=`<div style="font-size:0.8125rem;color:var(--danger);padding:0.75rem;background:rgba(239,68,68,0.06);border-radius:8px;">⚠️ Error: ${r.message}. Make sure the backend is running and the domain is valid.</div>`}finally{t.disabled=!1,t.innerHTML="🔍 Check"}})}function y(e,t="info"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${t}`;const i={success:"✅",error:"❌",info:"ℹ️"};s.innerHTML=`
        <span class="toast-icon">${i[t]||i.info}</span>
        <span class="toast-message">${e}</span>
    `,a.appendChild(s),setTimeout(()=>{s.classList.add("hide"),setTimeout(()=>{s.remove()},300)},4e3)}let B=[],D=null;async function X(){try{B=await L.list()}catch(e){console.error("Failed to fetch contacts",e)}return setTimeout(()=>{const e=document.getElementById("contact-search");e&&(e.oninput=t=>{const a=t.target.value.toLowerCase(),s=B.filter(i=>i.first_name&&i.first_name.toLowerCase().includes(a)||i.last_name&&i.last_name.toLowerCase().includes(a)||i.email.toLowerCase().includes(a)||i.tags&&i.tags.some(n=>n.text.toLowerCase().includes(a)));D(s)})},100),`
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Contacts</h1>
                    <p class="text-muted">Manage your subscribers and their segments.</p>
                </div>
                <div class="flex gap-4 items-center">
                    <div style="position: relative;">
                        <input type="text" id="contact-search" placeholder="Search contacts..." class="input" style="padding-left: 2rem; width: 250px; border-radius: var(--radius-sm);">
                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.8rem;">🔍</span>
                    </div>
                    <input type="file" id="import-file" accept=".xlsx, .xls, .csv, .json" style="display: none;">
                    <button class="btn btn-outline" id="import-btn">📥 Import</button>
                    <button class="btn btn-primary" id="add-contact-btn">
                        <span>+</span> Add Contact
                    </button>
                </div>
            </header>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table class="campaign-table">
                    <thead>
                        <tr>
                            <th>Name ⌵</th>
                            <th>Email ⌵</th>
                            <th>Folders ⌵</th>
                            <th>Joined ⌵</th>
                            <th>Actions ⌵</th>
                        </tr>
                    </thead>
                    <tbody id="contacts-list-body">
                        <!-- Rendered dynamically -->
                    </tbody>
                </table>
            </div>

            <div id="modal-container"></div>
            
            <style>
                #import-btn.loading { position: relative; color: transparent; pointer-events: none; }
                #import-btn.loading::after { content: "⏳"; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: var(--text-main); font-size: 1rem; animation: spin 1s linear infinite; }
            </style>
        </div>
    `}function K(){const e=document.getElementById("contacts-list-body"),t=document.getElementById("modal-container"),a=document.getElementById("import-btn"),s=document.getElementById("import-file"),i=l=>{try{const d=l.split("@")[1];if(!d)return"Unknown Company";const c=d.split(".")[0];return c.charAt(0).toUpperCase()+c.slice(1)}catch{return"Unknown Company"}};D=l=>{e&&(e.innerHTML=l.map(d=>`
            <tr>
                <td style="font-weight: 700;">
                    ${d.first_name||d.last_name?`${d.first_name||""} ${d.last_name||""}`:`<span class="text-muted" style="font-weight: 400; font-style: italic;">${i(d.email)}</span>`}
                </td>
                <td class="text-muted">${d.email}</td>
                <td>
                    <div class="flex gap-1 flex-wrap">
                        ${d.tags&&d.tags.length>0?d.tags.map(c=>`<span class="status-badge" style="background: rgba(138, 154, 91, 0.1); color: var(--primary); font-size: 0.65rem;">${c.text}</span>`).join(""):'<span class="text-muted" style="font-size: 0.75rem;">None</span>'}
                    </div>
                </td>
                <td class="text-muted">${new Date(d.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-outline edit-contact-btn" data-id="${d.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem; margin-right: 0.5rem;">Edit</button>
                    <button class="btn btn-outline delete-contact-btn" data-id="${d.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem; color: #dc3545; border-color: #dc3545;">Delete</button>
                </td>
            </tr>
        `).join("")+(l.length===0?'<tr><td colspan="5" style="text-align: center; padding: 3rem;" class="text-muted">No contacts found.</td></tr>':""),document.querySelectorAll(".edit-contact-btn").forEach(d=>{d.onclick=c=>{const g=c.target.dataset.id,m=B.find(b=>b.id==g);m&&r(m)}}),document.querySelectorAll(".delete-contact-btn").forEach(d=>{d.onclick=async c=>{if(!confirm("Are you sure you want to delete this contact?"))return;const g=c.target.dataset.id;try{await L.delete(g),y("Contact deleted successfully","success"),window.location.reload()}catch(m){y("Failed to delete: "+m.message,"error")}}}))},D(B),a&&s&&(a.onclick=()=>s.click(),s.onchange=async l=>{const d=l.target.files[0];if(!d)return;const c=new FileReader;c.onload=async g=>{try{let m=[],b=[];if(d.name.endsWith(".json")){const p=new TextDecoder().decode(g.target.result);m=JSON.parse(p),Array.isArray(m)||(m=[m])}else{const p=new Uint8Array(g.target.result),u=window.XLSX.read(p,{type:"array"}),$=u.SheetNames[0],S=u.Sheets[$];m=window.XLSX.utils.sheet_to_json(S)}if(m.length===0){y("The file is empty or invalid.","error");return}b=Object.keys(m[0]),n(b,m)}catch(m){y("Failed to read file: "+m.message,"error")}},c.readAsArrayBuffer(d)});const n=(l,d)=>{const c=(m,b)=>{const p=m.toLowerCase().replace(/[^a-z]/g,"");return b.some(u=>p.includes(u.toLowerCase())||u.toLowerCase().includes(p))},g={email:l.find(m=>c(m,["email","mail","addr"]))||"",first_name:l.find(m=>c(m,["first","fname","given","name","full"]))||"",last_name:l.find(m=>c(m,["last","lname","sur"]))||"",phone:l.find(m=>c(m,["phone","mobile","tel"]))||"",tags:l.find(m=>c(m,["tag","folder","segment","list","label"]))||""};t.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;" id="mapping-overlay">
                <div class="card" style="width: 100%; max-width: 600px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-2">Map Columns</h2>
                    <p class="text-muted mb-6">Tell us which columns match our contact fields.</p>
                    
                    <div class="mb-6" style="background: rgba(0,0,0,0.03); padding: 1.25rem; border-radius: var(--radius-sm); font-size: 0.85rem; border: 1px solid var(--border);">
                        <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-main);">Preview (Row 1):</strong>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; color: var(--text-muted);">
                            ${l.map(m=>`<div style="background: white; padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid var(--border); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><strong style="color: var(--text-main); font-size: 0.75rem;">${m}:</strong> ${d[0][m]||"-"}</div>`).join("")}
                        </div>
                    </div>

                    <form id="mapping-form">
                        ${["Email (Required)","First Name","Last Name","Phone","Folders"].map((m,b)=>{const p=["email","first_name","last_name","phone","tags"][b];return`
                                <div class="mb-4 flex items-center justify-between">
                                    <label style="font-weight: 700; flex: 1;">${m}</label>
                                    <select name="${p}" class="input" style="flex: 1.5; padding: 0.5rem;">
                                        <option value="">-- Skip --</option>
                                        ${l.map(u=>`<option value="${u}" ${g[p]===u?"selected":""}>${u}</option>`).join("")}
                                    </select>
                                </div>
                            `}).join("")}
                        
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-mapping" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="confirm-import" style="flex: 1;">Start Import (${d.length} rows)</button>
                        </div>
                    </form>
                </div>
            </div>
        `,document.getElementById("close-mapping").onclick=()=>{t.innerHTML="",s.value=""},document.getElementById("mapping-form").onsubmit=async m=>{m.preventDefault();const b=new FormData(m.target),p=Object.fromEntries(b.entries());if(!p.email){y("Email mapping is required!","error");return}const u=document.getElementById("confirm-import");u.disabled=!0,u.innerText="Importing...";let $=0,S=0;for(const C of d)try{const z=C[p.email];if(!z)continue;const _=p.tags?C[p.tags]:"",f=_?String(_).split(",").map(h=>({text:h.trim()})).filter(h=>h.text):[];await L.create({first_name:String(p.first_name&&C[p.first_name]||""),last_name:String(p.last_name&&C[p.last_name]||""),email:String(z).trim().toLowerCase(),phone:String(p.phone&&C[p.phone]||""),tags:f}),$++,u.innerText=`Importing (${$}/${d.length})...`}catch(z){console.error("Row import failed:",z),S++}t.innerHTML="",y(`Import finished: ${$} successful, ${S} failed.`,S>0?"error":"success"),window.location.reload()}},r=(l=null)=>{const d=!!l;t.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 500px; padding: 2rem;">
                    <h2 class="mb-6">${d?"Edit Contact":"Add New Contact"}</h2>
                    <form id="contact-form">
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">First Name</label>
                            <input type="text" name="first_name" class="input" placeholder="John" value="${l?.first_name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Last Name</label>
                            <input type="text" name="last_name" class="input" placeholder="Doe" value="${l?.last_name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Address</label>
                            <input type="email" name="email" class="input" required placeholder="john@example.com" value="${l?.email||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Phone Number</label>
                            <input type="text" name="phone" class="input" placeholder="+1 (555) 000-0000" value="${l?.phone||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${d?"Update Contact":"Save Contact"}</button>
                        </div>
                    </form>
                </div>
            </div>
        `,document.getElementById("close-modal").onclick=()=>t.innerHTML="",document.getElementById("modal-overlay").onclick=c=>{c.target.id==="modal-overlay"&&(t.innerHTML="")},document.getElementById("contact-form").onsubmit=async c=>{c.preventDefault();const g=new FormData(c.target),m=Object.fromEntries(g.entries());m.tags=[];try{d?(await L.update(l.id,m),y("Contact updated!","success")):(await L.create(m),y("Contact saved!","success")),window.location.reload()}catch(b){y("Action failed: "+b.message,"error")}}},o=document.getElementById("add-contact-btn");o&&o.addEventListener("click",()=>r())}let w=[],j=[],T=null,N=null;async function Z(){try{const[e,t]=await Promise.all([k.list(),G.listSent()]);w=e,j=t}catch(e){console.error("Failed to fetch campaigns or sent emails",e)}return`
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
                        <span class="stat-value">${w.filter(e=>e.status==="draft").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Scheduled</span>
                        <span class="stat-value">${w.filter(e=>e.status==="scheduled").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Sent</span>
                        <span class="stat-value">${w.filter(e=>e.status==="sent").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Paused</span>
                        <span class="stat-value">${w.filter(e=>e.status==="paused").length}</span>
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
    `}function Q(){const e=document.getElementById("campaigns-list-body"),t=document.getElementById("create-campaign-btn"),a=document.getElementById("campaign-modal-container"),s=document.querySelectorAll(".tab-btn");T=r=>{e&&(e.innerHTML=r.map(o=>`
            <tr>
                <td style="font-weight: 700;">${o.name}</td>
                <td>
                    <span class="status-badge ${o.status==="sent"?"status-sent":o.status==="paused"?"status-paused":"status-draft"}">
                        ${o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                    </span>
                </td>
                <td style="font-weight: 700;">${o.open_rate}%</td>
                <td style="font-weight: 700;">${o.ctr}%</td>
                <td style="font-weight: 700;">${o.conversions}%</td>
                <td>
                    <button class="btn btn-outline edit-campaign-btn" data-id="${o.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem; margin-right: 0.5rem;">Edit</button>
                    ${o.status!=="scheduled"&&o.status!=="sent"?`<button class="btn btn-primary schedule-campaign-btn" data-id="${o.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Schedule</button>`:""}
                </td>
            </tr>
        `).join("")+(r.length===0?'<tr><td colspan="6" style="text-align: center; padding: 3rem;" class="text-muted">No campaigns found for this view.</td></tr>':""),document.querySelectorAll(".edit-campaign-btn").forEach(o=>{o.onclick=l=>{const d=l.target.dataset.id,c=w.find(g=>g.id==d);c&&n(c)}}),document.querySelectorAll(".schedule-campaign-btn").forEach(o=>{o.onclick=l=>{const d=l.target.dataset.id,c=w.find(g=>g.id==d);c&&n(c,!0)}}))},N=()=>{if(!e)return;const r=document.getElementById("table-head");r.innerHTML=`
            <tr>
                <th>Recipient (Email) ⌵</th>
                <th>Subject ⌵</th>
                <th>Type ⌵</th>
                <th>Sent At ⌵</th>
            </tr>
        `,e.innerHTML=j.map(o=>`
            <tr>
                <td style="font-weight: 700;">${o.recipient}</td>
                <td>${o.subject}</td>
                <td>
                    <span class="status-badge ${o.type==="warming"?"status-draft":"status-sent"}">
                        ${o.type==="warming"?"🔥 Warming":"✉️ Campaign"}
                    </span>
                </td>
                <td class="text-muted">${new Date(o.sent_at).toLocaleString()}</td>
            </tr>
        `).join("")+(j.length===0?'<tr><td colspan="4" style="text-align: center; padding: 3rem;" class="text-muted">No sent emails recorded.</td></tr>':"")};const i=()=>{const r=document.getElementById("table-head");r.innerHTML=`
            <tr>
                <th>Campaign Name ⌵</th>
                <th>Status ⌵</th>
                <th>Open Rate ⌵</th>
                <th>CTR ⌵</th>
                <th>Conversions ⌵</th>
                <th>Actions ⌵</th>
            </tr>
        `};i(),T(w),s.forEach(r=>{r.onclick=o=>{s.forEach(c=>{c.classList.remove("btn-primary"),c.classList.add("btn-outline")});const l=o.currentTarget;l.classList.remove("btn-outline"),l.classList.add("btn-primary");const d=l.dataset.filter;d==="sent"?N():d==="all"?(i(),T(w)):(i(),T(w.filter(c=>c.status===d)))}});const n=(r=null,o=!1)=>{const l=!!r,d=o?"scheduled":r?.status||"draft";a.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 800px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-6">${l?"Edit Campaign":"Create New Campaign"}</h2>
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
                            <input type="text" name="name" class="input" required placeholder="Summer Sale 2026" value="${r?.name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="grid-2 mb-4" style="grid-template-columns: 2fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Subject</label>
                                <input type="text" name="subject" class="input" required placeholder="Our biggest sale ever!" value="${r?.subject||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Target Folder (Optional)</label>
                                <input type="text" name="target_folder" class="input" placeholder="e.g. Leads" value="${r?.target_folder||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
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
                                    <option value="draft" ${d==="draft"?"selected":""}>Draft</option>
                                    <option value="sent" ${d==="sent"?"selected":""}>Sent</option>
                                    <option value="paused" ${d==="paused"?"selected":""}>Paused</option>
                                    <option value="scheduled" ${d==="scheduled"?"selected":""}>Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Open Rate (%)</label>
                                <input type="number" step="0.1" name="open_rate" class="input" value="${r?.open_rate||0}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                        </div>
                        <div class="mb-8" id="schedule-field" style="display: ${d==="scheduled"?"block":"none"};">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Send At (Date & Time)</label>
                            <input type="datetime-local" name="scheduled_at" id="scheduled_at_input" class="input" value="${r?.scheduled_at?new Date(r.scheduled_at).toISOString().slice(0,16):""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8 flex items-center gap-2">
                            <input type="checkbox" name="is_personalized" id="is_personalized" ${r?.is_personalized?"checked":""} style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="is_personalized" style="font-weight: 700; cursor: pointer;">✨ Hyper-Personalization (AI Research each company)</label>
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${l?"Update Campaign":"Create Draft"}</button>
                        </div>
                    </form>
                </div>
            </div>
        `,document.getElementById("close-modal").onclick=()=>a.innerHTML="";const c=document.getElementById("rte-content"),g=document.getElementById("hidden-content");r?.content&&(c.innerHTML=r.content),document.getElementById("rte-toolbar").addEventListener("mousedown",f=>{const h=f.target.closest("[data-cmd]");if(h){if(f.preventDefault(),h.dataset.cmd==="foreColor")return;document.execCommand(h.dataset.cmd,!1,null),c.focus()}});const m=document.querySelector('#rte-toolbar [data-cmd="foreColor"]');m&&m.addEventListener("input",()=>{document.execCommand("foreColor",!1,m.value)});const b=document.querySelector('#rte-toolbar [data-format="formatBlock"]');b&&b.addEventListener("change",()=>{document.execCommand("formatBlock",!1,b.value),c.focus()}),document.getElementById("rte-link-btn")?.addEventListener("click",()=>{const f=prompt("Enter URL:");f&&document.execCommand("createLink",!1,f),c.focus()});const p=document.getElementById("campaign-form"),u=document.getElementById("ai-magic-btn"),$=document.getElementById("ai-goal"),S=document.getElementById("ai-pain-point"),C=p.querySelector('[name="subject"]');u.onclick=async()=>{const f=$.value.trim(),h=S.value.trim();if(!f){y("Please describe your campaign goal first!","info");return}u.disabled=!0,u.textContent="Generating...";try{const x=await k.generateAI({goal:f,pain_point:h});C.value=x.subject,c.innerHTML=x.content||"",y("Campaign draft generated! ✨","success")}catch(x){y("AI Generation failed: "+x.message,"error")}finally{u.disabled=!1,u.textContent="Magic Draft ✨"}};const z=p.querySelector('[name="status"]'),_=()=>{const f=document.getElementById("schedule-field"),h=document.getElementById("scheduled_at_input"),x=z.value==="scheduled";f.style.display=x?"block":"none",x?h.setAttribute("required","true"):h.removeAttribute("required")};z.onchange=_,_(),document.getElementById("modal-overlay").onclick=f=>{f.target.id==="modal-overlay"&&(a.innerHTML="")},document.getElementById("campaign-form").onsubmit=async f=>{f.preventDefault(),g.value=c.innerHTML;const h=new FormData(f.target),x=Object.fromEntries(h.entries()),P={...x,account_id:JSON.parse(localStorage.getItem("camp_user")||"{}").id||1,open_rate:parseFloat(x.open_rate)||0,ctr:parseFloat(r?.ctr||0),conversions:parseFloat(r?.conversions||0),scheduled_at:x.scheduled_at?new Date(x.scheduled_at).toISOString():null,is_personalized:p.querySelector('[name="is_personalized"]').checked,target_folder:x.target_folder||""};try{l?await k.update(r.id,P):await k.create(P),window.location.reload()}catch(U){y("Action failed: "+U.message,"error")}}};t&&(t.onclick=()=>n())}async function ee(){let e={total_contacts:0},t=[];try{[e,t]=await Promise.all([M.getOverview(),k.list()])}catch(s){console.error(s)}return`
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
    `}async function te(){let e={open_rate:0,ctr:0,audience_growth:[]},t=[];try{const[a,s]=await Promise.all([M.getOverview(),k.list()]);e=a,t=(s||[]).filter(i=>i.status==="sent").sort((i,n)=>(n.open_rate||0)-(i.open_rate||0)).slice(0,3)}catch(a){console.error("Failed to fetch analytics data",a)}return`
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
    `}async function ae(){let e=[];try{e=(await k.list()||[]).filter(r=>r.status==="scheduled").sort((r,o)=>new Date(r.scheduled_at||r.created_at)-new Date(o.scheduled_at||o.created_at)).slice(0,10)}catch(n){console.error("Failed to fetch schedule",n)}const t=new Date,a=new Date(t.getFullYear(),t.getMonth()+1,0).getDate(),s=new Date(t.getFullYear(),t.getMonth(),1).getDay();let i="";for(let n=0;n<s;n++)i+='<div style="padding: 1rem; border: 1px solid var(--border); background: var(--bg-main); opacity: 0.5;"></div>';for(let n=1;n<=a;n++){const r=e.some(o=>{const l=new Date(o.scheduled_at||o.created_at);return l.getDate()===n&&l.getMonth()===t.getMonth()&&l.getFullYear()===t.getFullYear()});i+=`
            <div style="padding: 1rem; border: 1px solid var(--border); min-height: 80px; position: relative; background: var(--bg-card);">
                <span style="font-weight: ${n===t.getDate()?"800":"500"}; color: ${n===t.getDate()?"var(--primary)":"inherit"};">${n}</span>
                ${r?'<div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: var(--primary);"></div>':""}
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
                    ${e.map(n=>`
                        <div class="flex items-center gap-6 p-4 border-bottom" style="border-bottom: 1px solid var(--border);">
                            <div style="text-align: center; min-width: 100px;">
                                <p style="font-weight: 800; color: var(--primary);">${new Date(n.scheduled_at||n.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">${new Date(n.scheduled_at||n.created_at).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</p>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="font-size: 1rem; font-weight: 700;">${n.name}</h4>
                                <span class="status-badge status-${n.status}" style="font-size: 0.65rem; margin-top: 0.25rem;">${n.status}</span>
                            </div>
                            <button class="btn btn-outline edit-schedule-btn" data-id="${n.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
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
                        ${i}
                    </div>
                </div>
            </div>
        </div>
    `}function se(){const e=document.getElementById("schedule-create-btn");e&&(e.onclick=()=>window.location.hash="#campaign");const t=document.getElementById("view-list-btn"),a=document.getElementById("view-calendar-btn"),s=document.getElementById("schedule-list-view"),i=document.getElementById("schedule-calendar-view");t&&a&&(t.onclick=()=>{s.style.display="flex",i.style.display="none",t.className="btn btn-primary",a.className="btn btn-outline",t.style.padding="0.5rem 1rem",t.style.borderRadius="var(--radius-sm)",a.style.padding="0.5rem 1rem",a.style.borderRadius="var(--radius-sm)"},a.onclick=()=>{s.style.display="none",i.style.display="block",a.className="btn btn-primary",t.className="btn btn-outline",t.style.padding="0.5rem 1rem",t.style.borderRadius="var(--radius-sm)",a.style.padding="0.5rem 1rem",a.style.borderRadius="var(--radius-sm)"})}async function ne(){return`
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
    `}async function ie(){const e=localStorage.getItem("camp_sheets_connected")==="true";return setTimeout(()=>{const t=document.getElementById("connect-sheets-btn");t&&(t.onclick=()=>{e?(localStorage.setItem("camp_sheets_connected","false"),window.location.reload()):(t.innerHTML='<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Connecting...',t.style.opacity="0.7",setTimeout(()=>{localStorage.setItem("camp_sheets_connected","true"),window.location.reload()},1500))})},100),`
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
    `}function H(){return`
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
    `}function R(e="signup"){return e==="signup"?oe():re()}function re(){return`
        <div style="width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-main); padding: 2rem;">
            <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span style="font-size: 3rem;">🏕️</span>
                    <h1 style="margin-top: 1rem;">Log in</h1>
                    <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                        Don't have an account? 
                        <a href="/signup" style="color: var(--primary); font-weight: 600; text-decoration: none;" data-link>Sign up</a>
                    </p>
                </div>
                <form id="auth-form" data-type="login">
                    <div class="mb-4">
                        <label class="label">Email address</label>
                        <input type="email" name="email" class="input" required placeholder="name@company.com">
                    </div>
                    <div class="mb-8">
                        <label class="label">Password</label>
                        <input type="password" name="password" class="input" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">Log In</button>
                </form>
            </div>
        </div>
    `}function oe(){return`
        <div style="width: 100%; min-height: 100vh; background: var(--bg-main); display: flex; align-items: center; justify-content: center; padding: 2rem;">
            <div class="card" style="width: 100%; max-width: 550px; padding: 3rem;">
                <!-- Wizard Header -->
                <div style="margin-bottom: 3rem; text-align: center;">
                    <span style="font-size: 2.5rem;">🚀</span>
                    <h1 id="wizard-title" style="margin-top: 1rem; font-size: 1.75rem;">Create your account</h1>
                    <div class="flex justify-center mt-6" style="gap: 0.5rem;" id="wizard-steps-indicator">
                        <div class="step-dot active" data-step="1"></div>
                        <div class="step-dot" data-step="2"></div>
                        <div class="step-dot" data-step="3"></div>
                    </div>
                </div>

                <form id="auth-form" data-type="signup">
                    <!-- Step 1: Personal Info -->
                    <div id="step-1" class="wizard-step">
                        <div class="mb-4">
                            <label class="label">Full Name</label>
                            <input type="text" name="name" class="input" required placeholder="John Doe">
                        </div>
                        <div class="mb-4">
                            <label class="label">Work Email</label>
                            <input type="email" name="email" class="input" required placeholder="john@company.com">
                        </div>
                        <div class="mb-8">
                            <label class="label">Secure Password</label>
                            <input type="password" name="password" class="input" required placeholder="••••••••">
                        </div>
                        <button type="button" class="btn btn-primary next-btn" style="width: 100%;">Next: Business Details</button>
                    </div>

                    <!-- Step 2: Business Info -->
                    <div id="step-2" class="wizard-step" style="display: none;">
                        <div class="mb-4">
                            <label class="label">Company Name</label>
                            <input type="text" name="company_name" class="input" placeholder="Acme Corp">
                        </div>
                        <div class="mb-8">
                            <label class="label">Sending Domain</label>
                            <input type="text" name="domain" class="input" placeholder="acme.com">
                        </div>
                        <div class="flex gap-4">
                            <button type="button" class="btn btn-outline prev-btn" style="flex: 1;">Back</button>
                            <button type="button" class="btn btn-primary next-btn" style="flex: 2;">Next: SMTP Config</button>
                        </div>
                    </div>

                    <!-- Step 3: SMTP Settings -->
                    <div id="step-3" class="wizard-step" style="display: none;">
                        <p class="text-muted mb-6" style="font-size: 0.85rem; border-left: 3px solid var(--primary); padding-left: 1rem;">
                            Configure your company SMTP server for guaranteed inbox delivery.
                        </p>
                        <div class="grid-2 mb-4">
                            <div>
                                <label class="label">SMTP Host</label>
                                <input type="text" name="smtp_host" class="input" placeholder="smtp.gmail.com">
                            </div>
                            <div>
                                <label class="label">Port</label>
                                <input type="number" name="smtp_port" class="input" placeholder="587">
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="label">SMTP Username</label>
                            <input type="text" name="smtp_user" class="input" placeholder="user@domain.com">
                        </div>
                        <div class="mb-8">
                            <label class="label">SMTP Password</label>
                            <input type="password" name="smtp_pass" class="input" placeholder="••••••••">
                        </div>
                        <div class="flex gap-4">
                            <button type="button" class="btn btn-outline prev-btn" style="flex: 1;">Back</button>
                            <button type="submit" class="btn btn-primary" style="flex: 2;">Complete Setup & Start Warming</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `}function le(){const e=document.getElementById("auth-form");if(!e)return;let t=1;const a=s=>{document.querySelectorAll(".wizard-step").forEach(n=>n.style.display="none"),document.getElementById(`step-${s}`).style.display="block",document.querySelectorAll(".step-dot").forEach(n=>{n.classList.toggle("active",n.dataset.step==s)});const i=document.getElementById("wizard-title");i&&(s===1&&(i.textContent="Create your account"),s===2&&(i.textContent="Tell us about your business"),s===3&&(i.textContent="Guaranteed Inbox: SMTP Config"))};e.addEventListener("click",s=>{if(s.target.classList.contains("next-btn")){if(t===1){const i=e.querySelector('[name="name"]').value,n=e.querySelector('[name="email"]').value,r=e.querySelector('[name="password"]').value;if(!i||!n||!r){y("Please fill in all account details.","error");return}}t++,a(t)}s.target.classList.contains("prev-btn")&&(t--,a(t))}),e.onsubmit=async s=>{s.preventDefault();const i=new FormData(e),n=Object.fromEntries(i.entries()),r=e.dataset.type==="signup";try{let o;if(r){const l=await A.signup({name:n.name,email:n.email,password:n.password,company_name:n.company_name,domain:n.domain});n.smtp_host&&await A.saveSMTP({account_id:l.id,host:n.smtp_host,port:parseInt(n.smtp_port),username:n.smtp_user,password:n.smtp_pass,security_type:"tls"}),o={id:l.id,name:n.name,email:n.email}}else o=await A.login({email:n.email,password:n.password});localStorage.setItem("camp_user",JSON.stringify(o)),window.sessionStorage.setItem("isLoggedIn","true"),y(r?"Setup complete! Welcome to the premium inbox experience.":"Welcome back!","success"),window.location.href="/"}catch(o){y((r?"Setup failed: ":"Login failed: ")+o.message,"error")}}}const O=document.getElementById("app"),q={"/":F,"/contacts":X,"/campaigns":Z,"/automation":ee,"/analytics":te,"/schedule":ae,"/templates":ne,"/integration":ie,"/login":()=>R("login"),"/signup":()=>R("signup"),"/landing":H};async function de(e){const t=window.sessionStorage.getItem("isLoggedIn")==="true";if(e==="/logout"){window.sessionStorage.removeItem("isLoggedIn"),window.location.href="/landing";return}!t&&!["/login","/signup","/landing"].includes(e)&&(window.history.replaceState({},"","/landing"),e="/landing"),t&&["/login","/signup","/landing"].includes(e)&&(window.history.replaceState({},"","/"),e="/");const a=q[e]||(t?F:H),i=t&&!["/landing","/login","/signup"].includes(e),n=await a();if(i){const p=J(e);O.innerHTML=`
            ${p}
            <div class="layout-container" style="width: 100%;">
                <div id="content-area" style="flex: 1; min-width: 0;">
                    ${n}
                </div>
            </div>
        `}else O.innerHTML=`<div style="width: 100%;">${n}</div>`;document.querySelectorAll(".card table, .card .campaign-table").forEach(p=>{if(!p.parentElement.classList.contains("table-wrapper")){const u=document.createElement("div");u.className="table-wrapper",p.parentNode.insertBefore(u,p),u.appendChild(p)}}),e==="/contacts"&&K(),e==="/campaigns"&&Q(),e==="/schedule"&&se(),e==="/"&&Y(),["/login","/signup"].includes(e)&&le();const r=document.getElementById("logout-btn");r&&(r.onclick=p=>{p.preventDefault(),window.sessionStorage.removeItem("isLoggedIn"),window.location.href="/landing"});const o=document.getElementById("dark-mode-circle"),l=document.getElementById("dark-mode-toggle");if(o&&l){const p=document.body.classList.contains("dark-theme");o.style.left=p?"21px":"3px",l.style.background=p?"var(--primary)":"var(--border)",l.onclick=()=>{const u=document.body.classList.toggle("dark-theme");localStorage.setItem("camp_dark_mode",u),o.style.left=u?"21px":"3px",l.style.background=u?"var(--primary)":"var(--border)"}}const d=document.getElementById("hamburger-btn"),c=document.getElementById("sidebar"),g=document.getElementById("sidebar-overlay");function m(){c&&c.classList.add("open"),g&&g.classList.add("active"),d&&d.classList.add("open"),document.body.style.overflow="hidden"}function b(){c&&c.classList.remove("open"),g&&g.classList.remove("active"),d&&d.classList.remove("open"),document.body.style.overflow=""}d&&(d.onclick=()=>c&&c.classList.contains("open")?b():m()),g&&(g.onclick=b),document.querySelectorAll(".sidebar .nav-link[data-link]").forEach(p=>{p.addEventListener("click",()=>{window.innerWidth<=768&&b()})})}localStorage.getItem("camp_dark_mode")==="true"&&document.body.classList.add("dark-theme");new W(q,e=>{de(e)});
