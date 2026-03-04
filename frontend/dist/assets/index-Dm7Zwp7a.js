(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();class N{constructor(e,s){this.routes=e,this.onRouteMatch=s,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const s=e.target.closest("a[data-link]");s&&(e.preventDefault(),this.navigate(s.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState({},"",e),this.handleRoute()}handleRoute(){const e=window.location.pathname,s=this.routes[e]||this.routes["/"];this.onRouteMatch(e,s)}}function M(t){const e=[{path:"/",title:"Overview",icon:"▦"},{path:"/campaigns",title:"Campaign",icon:"✉"},{path:"/contacts",title:"Contacts",icon:"👥"},{path:"/automation",title:"Automation",icon:"⚙"},{path:"/analytics",title:"Analytics",icon:"📊"},{path:"/schedule",title:"Schedule",icon:"🕒",hasChevron:!0},{path:"/templates",title:"Templates",icon:"📄",hasChevron:!0},{path:"/integration",title:"Integration",icon:"📦"}],s=[{path:"/help",title:"Help Center",icon:"?"},{path:"/settings",title:"Setting",icon:"⚙"}],n=JSON.parse(localStorage.getItem("camp_user")||'{"name": "User", "email": "user@sendable.com"}');return`
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
                ${e.map(r=>`
                    <li>
                        <a href="${r.path}" class="nav-link ${t===r.path?"active":""} ${r.hasChevron?"nav-link-with-chevron":""}" data-link>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${r.icon}</span>
                                <span>${r.title}</span>
                            </div>
                            ${r.hasChevron?'<span style="font-size: 0.7rem; opacity: 0.6;">⌵</span>':""}
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
                    ${s.map(r=>`
                        <li>
                            <a href="${r.path}" class="nav-link ${t===r.path?"active":""}" data-link>
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${r.icon}</span>
                                <span>${r.title}</span>
                            </a>
                        </li>
                    `).join("")}
                </ul>

                <div style="padding-top: 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; flex-shrink: 0;">
                        ${n.name.charAt(0).toUpperCase()}
                    </div>
                    <div style="overflow: hidden; flex: 1; min-width: 0;">
                        <p class="truncate" style="font-size: 0.875rem; font-weight: 600;">${n.name}</p>
                        <p class="truncate" style="font-size: 0.75rem; color: var(--text-muted);">${n.email}</p>
                    </div>
                    <a href="/logout" id="logout-btn" style="text-decoration: none; font-size: 1rem; flex-shrink: 0; opacity: 0.7; transition: opacity 0.2s;" title="Logout" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">🚪</a>
                </div>
            </div>
        </div>
    `}const x="/api",v={async get(t){const e=await fetch(`${x}${t}`);if(!e.ok)throw new Error(`API Error: ${e.statusText}`);return e.json()},async post(t,e){const s=await fetch(`${x}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`API Error: ${s.statusText}`);return s.json()},async patch(t,e){const s=await fetch(`${x}${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`API Error: ${s.statusText}`);return s.json()},async put(t,e){const s=await fetch(`${x}${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`API Error: ${s.statusText}`);return s.status===204?null:s.json()}},$={list:async()=>await v.get("/contacts")||[],create:t=>v.post("/contacts",t),update:(t,e)=>v.put(`/contacts/${t}`,e),addTag:t=>v.post("/contacts/tag",t),removeTag:(t,e)=>v.patch(`/contacts/${t}/tag`,e)},f={list:async()=>await v.get("/campaigns")||[],get:t=>v.get(`/campaigns/${t}`),create:t=>v.post("/campaigns",t),update:(t,e)=>v.put(`/campaigns/${t}`,e)},L={getOverview:()=>v.get("/stats/overview")},E={signup:t=>v.post("/signup",t),saveSMTP:t=>v.post("/settings/smtp",t),getWarming:t=>v.get(`/stats/warming?account_id=${t}`)},R={getHealth:t=>v.get(`/domain/health?domain=${t}`)};async function j(){let t={total_contacts:0,total_sent:0,open_rate:0,ctr:0,revenue:0,audience_growth:[]},e=[],s=null,n=null;try{const i=JSON.parse(localStorage.getItem("camp_user")||"{}"),l=[L.getOverview(),f.list()];i.id&&l.push(E.getWarming(i.id)),i.domain&&l.push(R.getHealth(i.domain));const o=await Promise.all(l);t=o[0],e=o[1],i.id&&(s=o[2]),i.domain&&(n=o[3]),e=(e||[]).slice(0,4)}catch(i){console.error("Failed to fetch dashboard data",i)}const r=JSON.parse(localStorage.getItem("camp_user")||'{ "name": "Test User" }'),a=r.name;return`
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
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(a)}&background=8a9a5b&color=fff" style="width: 40px; height: 40px; border-radius: 50%;" />
                        <div style="line-height: 1.2;">
                            <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Welcome,</p>
                            <p style="font-size: 0.875rem; font-weight: 800;">${a}</p>
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
                        <span class="stat-value">${t.total_sent.toLocaleString()}</span>
                        <div class="stat-trend trend-up"><span>↑</span> Live</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #059669;">✉</div>
                    <div class="stat-info">
                        <span class="stat-label">Open Rate</span>
                        <span class="stat-value">${t.open_rate.toFixed(1)}%</span>
                        <div class="stat-trend trend-up"><span>↑</span> Average</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">📈</div>
                    <div class="stat-info">
                        <span class="stat-label">CTR</span>
                        <span class="stat-value">${t.ctr.toFixed(1)}%</span>
                        <div class="stat-trend trend-up"><span>↑</span> Average</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(138, 154, 91, 0.1); color: var(--primary);">💰</div>
                    <div class="stat-info">
                        <span class="stat-label">Revenue</span>
                        <span class="stat-value">$${t.revenue.toLocaleString()}</span>
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
                                        <span class="donut-value" style="font-size: 0.9rem;">${t.total_contacts}</span>
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
                                ${e.filter(i=>i.status==="scheduled").length>0?e.filter(i=>i.status==="scheduled").map(i=>`
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
                                ${e.map(i=>`
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
                                ${e.length===0?'<tr><td colspan="5" style="text-align: center; padding: 2rem;" class="text-muted">No recent campaigns.</td></tr>':""}
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
                                    <div class="progress-bar" style="width: ${Math.min(100,t.open_rate*2)}%;"></div>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Target: 50% Open Rate</p>
                            </div>
                            <div class="insight-row">
                                <p style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Conversion Score</p>
                                <div class="progress-container" style="height: 12px;">
                                    <div class="progress-bar" style="width: ${Math.min(100,t.ctr*5)}%; background: #c2c9af;"></div>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Target: 20% CTR</p>
                            </div>
                        </div>
                    </div>

                    <!-- Deliverability Health -->
                    <div class="card" style="border: 1px solid var(--primary); background: rgba(138, 154, 91, 0.02);">
                        <div class="flex justify-between items-center mb-4">
                            <h3 style="font-size: 1rem;">Deliverability Health</h3>
                            <span class="status-badge status-${n&&n.spf&&n.dkim&&n.dmarc?"sent":"draft"}" style="font-size: 0.65rem;">${n&&n.spf&&n.dkim&&n.dmarc?"Excellent":"Action Needed"}</span>
                        </div>
                        <div class="flex items-center gap-4 mb-4">
                            <div style="font-size: 2rem;">${n&&n.spf&&n.dkim&&n.dmarc?"🛡️":"⚠️"}</div>
                            <div>
                                <p style="font-size: 0.875rem; font-weight: 700;">Domain: ${r.domain||"Not configured"}</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">
                                    SPF: ${n&&n.spf?"✅":"❌"}, 
                                    DKIM: ${n&&n.dkim?"✅":"❌"}, 
                                    DMARC: ${n&&n.dmarc?"✅":"❌"}
                                </p>
                            </div>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border);">
                            ${n&&n.spf&&n.dkim&&n.dmarc?'"Your domain reputation is high. Emails are securely authenticated."':'"Some authentication records are missing. Please configure your DNS settings to improve deliverability."'}
                        </div>
                    </div>

                    <!-- Email Warming Progress -->
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <h3>Email Warming</h3>
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">${s?s.status.toUpperCase():"PENDING"}</span>
                        </div>
                        <div class="insight-row">
                            <div class="insight-label">
                                <span>Daily Progress</span>
                                <span>${s?s.current_count:0} / ${s?s.daily_limit:10}</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${s?s.current_count/s.daily_limit*100:0}%;"></div>
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
    `}let S=[],_=null;async function F(){try{S=await $.list()}catch(t){console.error("Failed to fetch contacts",t)}return setTimeout(()=>{const t=document.getElementById("contact-search");t&&(t.oninput=e=>{const s=e.target.value.toLowerCase(),n=S.filter(r=>r.first_name&&r.first_name.toLowerCase().includes(s)||r.last_name&&r.last_name.toLowerCase().includes(s)||r.email.toLowerCase().includes(s)||r.tags&&r.tags.some(a=>a.text.toLowerCase().includes(s)));_(n)})},100),`
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
                    <input type="file" id="import-file" accept=".xlsx, .xls, .csv" style="display: none;">
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
                            <th>Tags ⌵</th>
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
    `}function O(){const t=document.getElementById("contacts-list-body"),e=document.getElementById("modal-container"),s=document.getElementById("import-btn"),n=document.getElementById("import-file");_=i=>{t&&(t.innerHTML=i.map(l=>`
            <tr>
                <td style="font-weight: 700;">
                    ${l.first_name||l.last_name?`${l.first_name||""} ${l.last_name||""}`:`<span class="text-muted" style="font-weight: 400; font-style: italic;">${l.email.split("@")[0]} (No Name)</span>`}
                </td>
                <td class="text-muted">${l.email}</td>
                <td>
                    <div class="flex gap-1 flex-wrap">
                        ${l.tags&&l.tags.length>0?l.tags.map(o=>`<span class="status-badge" style="background: rgba(138, 154, 91, 0.1); color: var(--primary); font-size: 0.65rem;">${o.text}</span>`).join(""):'<span class="text-muted" style="font-size: 0.75rem;">None</span>'}
                    </div>
                </td>
                <td class="text-muted">${new Date(l.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-outline edit-contact-btn" data-id="${l.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                </td>
            </tr>
        `).join("")+(i.length===0?'<tr><td colspan="5" style="text-align: center; padding: 3rem;" class="text-muted">No contacts found.</td></tr>':""),document.querySelectorAll(".edit-contact-btn").forEach(l=>{l.onclick=o=>{const d=o.target.dataset.id,c=S.find(p=>p.id==d);c&&r(c)}}))},_(S),s&&n&&(s.onclick=()=>n.click(),n.onchange=async i=>{const l=i.target.files[0];if(!l)return;s.classList.add("loading");const o=new FileReader;o.onload=async d=>{try{const c=new Uint8Array(d.target.result),p=window.XLSX.read(c,{type:"array"}),k=p.SheetNames[0],y=p.Sheets[k],u=window.XLSX.utils.sheet_to_json(y);let g=0;for(const m of u){const I=m.Email||m.email;if(!I)continue;let z=m["First Name"]||m.first_name||m.fname||"",C=m["Last Name"]||m.last_name||m.lname||"";if(!z&&!C&&(m.Name||m.name)){const h=(m.Name||m.name).split(" ");z=h[0],C=h.slice(1).join(" ")}const A=m.Tags||m.tags||"",tt=A?A.split(",").map(h=>h.trim()).filter(Boolean):[];await $.create({first_name:z,last_name:C,email:I,phone:m.Phone||m.phone||""}),g++}alert(`Successfully imported ${g} contacts.`),window.location.reload()}catch(c){s.classList.remove("loading"),alert("Import failed: "+c.message),console.error("Import error:",c)}},o.readAsArrayBuffer(l)});const r=(i=null)=>{const l=!!i;e.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 500px; padding: 2rem;">
                    <h2 class="mb-6">${l?"Edit Contact":"Add New Contact"}</h2>
                    <form id="contact-form">
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">First Name</label>
                            <input type="text" name="first_name" class="input" required placeholder="John" value="${i?.first_name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Last Name</label>
                            <input type="text" name="last_name" class="input" required placeholder="Doe" value="${i?.last_name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Address</label>
                            <input type="email" name="email" class="input" required placeholder="john@example.com" value="${i?.email||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Phone Number</label>
                            <input type="text" name="phone" class="input" placeholder="+1 (555) 000-0000" value="${i?.phone||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${l?"Update Contact":"Save Contact"}</button>
                        </div>
                    </form>
                </div>
            </div>
        `,document.getElementById("close-modal").onclick=()=>e.innerHTML="",document.getElementById("modal-overlay").onclick=o=>{o.target.id==="modal-overlay"&&(e.innerHTML="")},document.getElementById("contact-form").onsubmit=async o=>{o.preventDefault();const d=new FormData(o.target),c=Object.fromEntries(d.entries());try{l?await $.update(i.id,c):await $.create(c),window.location.reload()}catch(p){alert("Action failed: "+p.message)}}},a=document.getElementById("add-contact-btn");a&&a.addEventListener("click",()=>r())}let b=[],w=null;async function H(){try{b=await f.list()}catch(t){console.error("Failed to fetch campaigns",t)}return`
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
                        <span class="stat-value">${b.filter(t=>t.status==="draft").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Scheduled</span>
                        <span class="stat-value">${b.filter(t=>t.status==="scheduled").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Sent</span>
                        <span class="stat-value">${b.filter(t=>t.status==="sent").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Paused</span>
                        <span class="stat-value">${b.filter(t=>t.status==="paused").length}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-4 mb-6" id="campaign-tabs">
                <button class="btn btn-primary tab-btn" data-filter="all" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">All</button>
                <button class="btn btn-outline tab-btn" data-filter="draft" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Drafts</button>
                <button class="btn btn-outline tab-btn" data-filter="scheduled" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Scheduled</button>
                <button class="btn btn-outline tab-btn" data-filter="sent" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Sent (Inbox)</button>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table class="campaign-table">
                    <thead>
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
    `}function U(){const t=document.getElementById("campaigns-list-body"),e=document.getElementById("create-campaign-btn"),s=document.getElementById("campaign-modal-container"),n=document.querySelectorAll(".tab-btn");w=a=>{t&&(t.innerHTML=a.map(i=>`
            <tr>
                <td style="font-weight: 700;">${i.name}</td>
                <td>
                    <span class="status-badge ${i.status==="sent"?"status-sent":i.status==="paused"?"status-paused":"status-draft"}">
                        ${i.status.charAt(0).toUpperCase()+i.status.slice(1)}
                    </span>
                </td>
                <td style="font-weight: 700;">${i.open_rate}%</td>
                <td style="font-weight: 700;">${i.ctr}%</td>
                <td style="font-weight: 700;">${i.conversions}%</td>
                <td>
                    <button class="btn btn-outline edit-campaign-btn" data-id="${i.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                </td>
            </tr>
        `).join("")+(a.length===0?'<tr><td colspan="6" style="text-align: center; padding: 3rem;" class="text-muted">No campaigns found for this view.</td></tr>':""),document.querySelectorAll(".edit-campaign-btn").forEach(i=>{i.onclick=l=>{const o=l.target.dataset.id,d=b.find(c=>c.id==o);d&&r(d)}}))},w(b),n.forEach(a=>{a.onclick=i=>{n.forEach(d=>{d.classList.remove("btn-primary"),d.classList.add("btn-outline")});const l=i.currentTarget;l.classList.remove("btn-outline"),l.classList.add("btn-primary");const o=l.dataset.filter;w(o==="all"?b:b.filter(d=>d.status===o))}});const r=(a=null)=>{const i=!!a;s.innerHTML=`
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 600px; padding: 2rem;">
                    <h2 class="mb-6">${i?"Edit Campaign":"Create New Campaign"}</h2>
                    <form id="campaign-form">
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Campaign Name</label>
                            <input type="text" name="name" class="input" required placeholder="Summer Sale 2026" value="${a?.name||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Subject</label>
                            <input type="text" name="subject" class="input" required placeholder="Our biggest sale ever!" value="${a?.subject||""}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Content (HTML)</label>
                            <textarea name="content" class="input" required placeholder="<h1>Hello!</h1>" style="width: 100%; min-height: 150px; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">${a?.content||""}</textarea>
                        </div>
                        <div class="grid-2 mb-8" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Status</label>
                                <select name="status" class="input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                                    <option value="draft" ${a?.status==="draft"?"selected":""}>Draft</option>
                                    <option value="sent" ${a?.status==="sent"?"selected":""}>Sent</option>
                                    <option value="paused" ${a?.status==="paused"?"selected":""}>Paused</option>
                                    <option value="scheduled" ${a?.status==="scheduled"?"selected":""}>Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Open Rate (%)</label>
                                <input type="number" step="0.1" name="open_rate" class="input" value="${a?.open_rate||0}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${i?"Update Campaign":"Create Draft"}</button>
                        </div>
                    </form>
                </div>
            </div>
        `,document.getElementById("close-modal").onclick=()=>s.innerHTML="",document.getElementById("modal-overlay").onclick=l=>{l.target.id==="modal-overlay"&&(s.innerHTML="")},document.getElementById("campaign-form").onsubmit=async l=>{l.preventDefault();const o=new FormData(l.target),d=Object.fromEntries(o.entries()),c={...d,open_rate:parseFloat(d.open_rate)||0,ctr:parseFloat(a?.ctr||0),conversions:parseFloat(a?.conversions||0)};try{i?await f.update(a.id,c):await f.create(c),window.location.reload()}catch(p){alert("Action failed: "+p.message)}}};e&&(e.onclick=()=>r())}async function q(){let t={total_contacts:0},e=[];try{[t,e]=await Promise.all([L.getOverview(),f.list()])}catch(n){console.error(n)}return`
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
                        <span class="stat-value">${e.filter(n=>n.status==="sent").length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Contacts</span>
                        <span class="stat-value">${t.total_contacts}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">✉️</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Sent</span>
                        <span class="stat-value">${t.total_sent||0}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <span class="stat-label">Est. Revenue</span>
                        <span class="stat-value">$${(t.revenue||0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <h3 class="mb-4">Live Workflows</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                ${e.slice(0,4).map(n=>`
                    <div class="card">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h4 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${n.name}</h4>
                                <span class="status-badge status-${n.status}" style="font-size: 0.65rem;">${n.status}</span>
                            </div>
                            <span style="font-size: 1.25rem;">⚙️</span>
                        </div>
                        <div class="flex gap-4 mb-6">
                            <div style="flex: 1;">
                                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Open Rate</p>
                                <p style="font-size: 1rem; font-weight: 700;">${n.open_rate}%</p>
                            </div>
                            <div style="flex: 1;">
                                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">CTR</p>
                                <p style="font-size: 1rem; font-weight: 700;">${n.ctr}%</p>
                            </div>
                        </div>
                        <button class="btn btn-outline" style="width: 100%; font-size: 0.8125rem;">Manage Workflow</button>
                    </div>
                `).join("")}
                ${e.length===0?'<div class="text-muted">No workflows found.</div>':""}
            </div>
        </div>
    `}async function W(){let t={open_rate:0,ctr:0,audience_growth:[]},e=[];try{const[s,n]=await Promise.all([L.getOverview(),f.list()]);t=s,e=(n||[]).filter(r=>r.status==="sent").sort((r,a)=>(a.open_rate||0)-(r.open_rate||0)).slice(0,3)}catch(s){console.error("Failed to fetch analytics data",s)}return`
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
                        <span class="stat-value">${(t.open_rate||0).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Avg. CTR</span>
                        <span class="stat-value">${(t.ctr||0).toFixed(1)}%</span>
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
                        ${[60,45,80,55,90,70,85,40,65,95].map(s=>`
                            <div style="flex: 1; background: var(--primary); height: ${s}%; border-radius: 4px 4px 0 0; opacity: 0.8;"></div>
                        `).join("")}
                    </div>
                    <p style="position: absolute; color: var(--text-muted); font-size: 0.875rem; background: rgba(255,255,255,0.8); padding: 0.5rem 1rem; border-radius: 20px;">Live Engagement Index</p>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 class="mb-6">Top Performing Campaigns</h3>
                    <div class="flex flex-col gap-4">
                        ${e.length>0?e.map(s=>`
                            <div class="flex justify-between items-center py-3 border-bottom" style="border-bottom: 1px solid var(--border);">
                                <span style="font-weight: 600;">${s.name}</span>
                                <span style="color: var(--success); font-weight: 700;">${s.open_rate}% Open</span>
                            </div>
                        `).join(""):'<p class="text-muted">No sent campaigns yet.</p>'}
                    </div>
                </div>
                <div class="card">
                    <h3 class="mb-6">Audience Metrics</h3>
                    <div class="flex flex-col gap-4">
                        <div class="insight-row">
                            <div class="insight-label"><span>Total Contacts</span><span>${t.total_contacts||0}</span></div>
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
    `}async function G(){let t=[];try{t=(await f.list()||[]).filter(i=>i.status==="scheduled"||i.status==="draft").sort((i,l)=>new Date(i.created_at)-new Date(l.created_at)).slice(0,5)}catch(a){console.error("Failed to fetch schedule",a)}const e=new Date,s=new Date(e.getFullYear(),e.getMonth()+1,0).getDate(),n=new Date(e.getFullYear(),e.getMonth(),1).getDay();let r="";for(let a=0;a<n;a++)r+='<div style="padding: 1rem; border: 1px solid var(--border); background: var(--bg-main); opacity: 0.5;"></div>';for(let a=1;a<=s;a++){const i=t.some(l=>new Date(l.created_at).getDate()===a&&new Date(l.created_at).getMonth()===e.getMonth());r+=`
            <div style="padding: 1rem; border: 1px solid var(--border); min-height: 80px; position: relative; background: var(--bg-card);">
                <span style="font-weight: ${a===e.getDate()?"800":"500"}; color: ${a===e.getDate()?"var(--primary)":"inherit"};">${a}</span>
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
                    ${t.map(a=>`
                        <div class="flex items-center gap-6 p-4 border-bottom" style="border-bottom: 1px solid var(--border);">
                            <div style="text-align: center; min-width: 80px;">
                                <p style="font-weight: 800; color: var(--primary);">${new Date(a.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">${new Date(a.created_at).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</p>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="font-size: 1rem; font-weight: 700;">${a.name}</h4>
                                <span class="status-badge status-${a.status}" style="font-size: 0.65rem; margin-top: 0.25rem;">${a.status}</span>
                            </div>
                            <button class="btn btn-outline edit-schedule-btn" data-id="${a.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                        </div>
                    `).join("")}
                    ${t.length===0?'<div class="text-muted" style="text-align: center; padding: 3rem;">No upcoming campaigns found.</div>':""}
                </div>

                <!-- Calendar View -->
                <div id="schedule-calendar-view" style="display: none;">
                    <h3 style="text-align: center; margin-bottom: 1rem;">${e.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</h3>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; margin-bottom: 0.5rem;">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; background: var(--border);">
                        ${r}
                    </div>
                </div>
            </div>
        </div>
    `}function J(){const t=document.getElementById("schedule-create-btn");t&&(t.onclick=()=>window.location.hash="#campaign");const e=document.getElementById("view-list-btn"),s=document.getElementById("view-calendar-btn"),n=document.getElementById("schedule-list-view"),r=document.getElementById("schedule-calendar-view");e&&s&&(e.onclick=()=>{n.style.display="flex",r.style.display="none",e.className="btn btn-primary",s.className="btn btn-outline",e.style.padding="0.5rem 1rem",e.style.borderRadius="var(--radius-sm)",s.style.padding="0.5rem 1rem",s.style.borderRadius="var(--radius-sm)"},s.onclick=()=>{n.style.display="none",r.style.display="block",s.className="btn btn-primary",e.className="btn btn-outline",e.style.padding="0.5rem 1rem",e.style.borderRadius="var(--radius-sm)",s.style.padding="0.5rem 1rem",s.style.borderRadius="var(--radius-sm)"})}async function V(){return`
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
                ${[{name:"Minimalist Blog",desc:"Perfect for text-heavy updates.",color:"#f8fafc"},{name:"Modern E-commerce",desc:"Showcase your seasonal products.",color:"#f1f5f9"},{name:"Event Invitation",desc:"Elegant layout for webinars.",color:"#fdfcfe"},{name:"Monthly Digest",desc:"Curated content summary.",color:"#fff"},{name:"Welcome Series",desc:"First impression for new users.",color:"#faf9f6"},{name:"Flash Sale",desc:"High-conversion retail layout.",color:"#f8fafc"}].map((t,e)=>`
                    <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--border); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="height: 220px; background: ${t.color}; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border);">
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
                            <h4 style="margin-bottom: 0.5rem; font-weight: 700;">${t.name}</h4>
                            <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.5rem;">${t.desc}</p>
                            <button class="btn btn-outline" style="width: 100%; font-size: 0.875rem;">Use Template</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `}async function Y(){const t=localStorage.getItem("camp_sheets_connected")==="true";return setTimeout(()=>{const e=document.getElementById("connect-sheets-btn");e&&(e.onclick=()=>{t?(localStorage.setItem("camp_sheets_connected","false"),window.location.reload()):(e.innerHTML='<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Connecting...',e.style.opacity="0.7",setTimeout(()=>{localStorage.setItem("camp_sheets_connected","true"),window.location.reload()},1500))})},100),`
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
                ${[{name:"Shopify",desc:"Import products and sync customer purchase history automatically.",icon:"🛍️",status:"Connected"},{name:"WordPress",desc:"Integrate signup forms and publish newsletters as blog posts.",icon:"📝",status:"Available"},{name:"Zapier",desc:"Connect with 5000+ apps to trigger emails from any event.",icon:"⚡",status:"Available"},{name:"Stripe",desc:"Track customer lifetime value and payment-triggered automations.",icon:"💳",status:"Available"},{name:"Salesforce",desc:"Sync leads and contacts directly with your Salesforce CRM.",icon:"☁️",status:"Available"},{name:"Google Sheets",desc:"Live sync your audience segments with shared spreadsheets.",icon:"📄",status:t?"Connected":"Available",id:"connect-sheets-btn"}].map(e=>`
                    <div class="card" style="display: flex; flex-direction: column; align-items: flex-start; padding: 2rem; position: relative;">
                        ${e.status==="Connected"?'<span class="status-badge status-sent" style="position: absolute; top: 1.5rem; right: 1.5rem;">Connected</span>':""}
                        <div style="width: 56px; height: 56px; background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem;">
                            ${e.icon}
                        </div>
                        <h4 style="margin-bottom: 0.75rem; font-weight: 700;">${e.name}</h4>
                        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 2rem; flex-grow: 1; line-height: 1.5;">${e.desc}</p>
                        <button ${e.id?`id="${e.id}"`:""} class="btn ${e.status==="Connected"?"btn-outline":"btn-primary"}" style="width: 100%; border-radius: var(--radius-sm);">${e.status==="Connected"?"Disconnect":"Connect"}</button>
                    </div>
                `).join("")}
            </div>
            
            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
            </style>
        </div>
    `}function P(){return`
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
    `}function T(t="signup"){return t==="signup"?K():X()}function X(){return`
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
                <form id="auth-form">
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
    `}function K(){return`
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

                <form id="auth-form">
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
    `}function Z(){const t=document.getElementById("auth-form");if(!t)return;let e=1;const s=n=>{document.querySelectorAll(".wizard-step").forEach(a=>a.style.display="none"),document.getElementById(`step-${n}`).style.display="block",document.querySelectorAll(".step-dot").forEach(a=>{a.classList.toggle("active",a.dataset.step==n)});const r=document.getElementById("wizard-title");r&&(n===1&&(r.textContent="Create your account"),n===2&&(r.textContent="Tell us about your business"),n===3&&(r.textContent="Guaranteed Inbox: SMTP Config"))};t.addEventListener("click",n=>{if(n.target.classList.contains("next-btn")){if(e===1){const r=t.querySelector('[name="name"]').value,a=t.querySelector('[name="email"]').value,i=t.querySelector('[name="password"]').value;if(!r||!a||!i){alert("Please fill in all account details.");return}}e++,s(e)}n.target.classList.contains("prev-btn")&&(e--,s(e))}),t.onsubmit=async n=>{n.preventDefault();const r=new FormData(t),a=Object.fromEntries(r.entries());try{const i=await E.signup({name:a.name,email:a.email,password:a.password,company_name:a.company_name,domain:a.domain});a.smtp_host&&await E.saveSMTP({account_id:i.id,host:a.smtp_host,port:parseInt(a.smtp_port),username:a.smtp_user,password:a.smtp_pass,security_type:"tls"}),localStorage.setItem("camp_user",JSON.stringify({id:i.id,name:a.name,email:a.email})),window.sessionStorage.setItem("isLoggedIn","true"),alert("Setup complete! Welcome to the premium inbox experience."),window.location.href="/"}catch(i){alert("Setup failed: "+i.message)}}}const D=document.getElementById("app"),B={"/":j,"/contacts":F,"/campaigns":H,"/automation":q,"/analytics":W,"/schedule":G,"/templates":V,"/integration":Y,"/login":()=>T("login"),"/signup":()=>T("signup"),"/landing":P};async function Q(t){const e=window.sessionStorage.getItem("isLoggedIn")==="true";if(t==="/logout"){window.sessionStorage.removeItem("isLoggedIn"),window.location.href="/landing";return}!e&&!["/login","/signup","/landing"].includes(t)&&(window.history.replaceState({},"","/landing"),t="/landing"),e&&["/login","/signup","/landing"].includes(t)&&(window.history.replaceState({},"","/"),t="/");const s=B[t]||(e?j:P),r=e&&!["/landing","/login","/signup"].includes(t),a=await s();if(r){const u=M(t);D.innerHTML=`
            ${u}
            <div class="layout-container" style="width: 100%;">
                <div id="content-area" style="flex: 1; min-width: 0;">
                    ${a}
                </div>
            </div>
        `}else D.innerHTML=`<div style="width: 100%;">${a}</div>`;document.querySelectorAll(".card table, .card .campaign-table").forEach(u=>{if(!u.parentElement.classList.contains("table-wrapper")){const g=document.createElement("div");g.className="table-wrapper",u.parentNode.insertBefore(g,u),g.appendChild(u)}}),t==="/contacts"&&O(),t==="/campaigns"&&U(),t==="/schedule"&&J(),["/login","/signup"].includes(t)&&Z();const i=document.getElementById("logout-btn");i&&(i.onclick=u=>{u.preventDefault(),window.sessionStorage.removeItem("isLoggedIn"),window.location.href="/landing"});const l=document.getElementById("dark-mode-circle"),o=document.getElementById("dark-mode-toggle");if(l&&o){const u=document.body.classList.contains("dark-theme");l.style.left=u?"21px":"3px",o.style.background=u?"var(--primary)":"var(--border)",o.onclick=()=>{const g=document.body.classList.toggle("dark-theme");localStorage.setItem("camp_dark_mode",g),l.style.left=g?"21px":"3px",o.style.background=g?"var(--primary)":"var(--border)"}}const d=document.getElementById("hamburger-btn"),c=document.getElementById("sidebar"),p=document.getElementById("sidebar-overlay");function k(){c&&c.classList.add("open"),p&&p.classList.add("active"),d&&d.classList.add("open"),document.body.style.overflow="hidden"}function y(){c&&c.classList.remove("open"),p&&p.classList.remove("active"),d&&d.classList.remove("open"),document.body.style.overflow=""}d&&(d.onclick=()=>c&&c.classList.contains("open")?y():k()),p&&(p.onclick=y),document.querySelectorAll(".sidebar .nav-link[data-link]").forEach(u=>{u.addEventListener("click",()=>{window.innerWidth<=768&&y()})})}localStorage.getItem("camp_dark_mode")==="true"&&document.body.classList.add("dark-theme");new N(B,t=>{Q(t)});
