export function Landing() {
    return `
    <div id="landing-spa-root">
        <style>
            #globe-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
            .landing-wrapper { position: relative; background: #020b14; color: #fff; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
            
            nav.landing-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1.2rem 2rem; display: flex; align-items: center; justify-content: space-between; background: transparent; transition: background .4s; }
            nav.landing-nav.scrolled { background: rgba(2,11,20,.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,.05); }
            .nav-logo { font-size: 1.2rem; font-weight: 800; background: linear-gradient(90deg, #00ff88, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .nav-links { display: flex; gap: 2rem; align-items: center; }
            .nav-links a { color: rgba(255,255,255,.55); text-decoration: none; font-size: .9rem; transition: color .2s; }
            .nav-links a:hover { color: #fff; }
            .nav-cta { padding: .6rem 1.6rem; border-radius: 100px; background: linear-gradient(135deg, #00ff88, #00e5ff); color: #000; font-weight: 800; font-size: .85rem; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 15px rgba(0,255,136,0.3); white-space: nowrap; }
            .nav-cta:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 25px rgba(0,255,136,0.5); }

            #hero { position: relative; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; text-align: center; padding: 0 1.5rem; }
            #hero-title { font-size: clamp(2.2rem, 8vw, 5.5rem); font-weight: 900; letter-spacing: -.03em; line-height: 1; background: linear-gradient(135deg, #fff 40%, #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent; max-width: 1000px; }
            #hero-sub { margin-top: 1.5rem; font-size: clamp(1rem, 2.2vw, 1.2rem); color: rgba(255,255,255,.6); font-weight: 300; max-width: 600px; line-height: 1.5; }
            .hero-ctas { margin-top: 2.5rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
            
            .stat-bar { display: flex; justify-content: center; gap: 2rem; margin-top: 4rem; flex-wrap: wrap; }
            .stat-item { text-align: center; }
            .stat-num { display: block; font-size: 1.5rem; font-weight: 800; color: #00ff88; }
            .stat-label { font-size: .7rem; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .1em; }

            #cloud-section { position: relative; height: 300vh; z-index: 5; }
            #cloud-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; }
            .cloud-layer { position: absolute; width: 200%; height: 100%; background-size: cover; background-repeat: repeat-x; will-change: transform; }
            #cl1 { background: radial-gradient(ellipse 600px 200px at 20% 50%, rgba(255,255,255,.2) 0%, transparent 70%), radial-gradient(ellipse 400px 150px at 70% 60%, rgba(255,255,255,.15) 0%, transparent 70%); top: 0; left: -50%; }
            #cl2 { background: radial-gradient(ellipse 700px 250px at 30% 55%, rgba(0,255,136,.1) 0%, transparent 70%), radial-gradient(ellipse 450px 160px at 80% 45%, rgba(0,229,255,.08) 0%, transparent 70%); top: 0; left: -30%; }
            #cl3 { background: radial-gradient(ellipse 800px 300px at 50% 50%, rgba(124,58,237,.07) 0%, transparent 70%); top: 0; left: -20%; }
            #cloud-text { position: relative; z-index: 2; text-align: center; opacity: 0; }
            #cloud-text h2 { font-size: clamp(2rem, 6vw, 4.5rem); font-weight: 900; line-height: 1; background: linear-gradient(135deg, #fff, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

            .reveal-section { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 8rem 2rem; position: relative; z-index: 10; background: #020b14; }
            .section-inner { max-width: 1100px; width: 100%; margin: 0 auto; }
            .section-badge { display: inline-block; padding: .4rem 1.2rem; border-radius: 100px; border: 1px solid rgba(0,255,136,.3); background: rgba(0,255,136,.06); color: #00ff88; font-size: .8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1.5rem; }
            .section-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; line-height: 1.05; margin-bottom: 1.5rem; }
            .section-title span { background: linear-gradient(90deg, #00ff88, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            
            .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
            .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 2.5rem; transition: 0.3s; }
            .feat-card:hover { border-color: rgba(0,255,136,0.3); transform: translateY(-10px); background: rgba(255,255,255,0.04); }
            .feat-icon { font-size: 2.5rem; margin-bottom: 1.5rem; }

            .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
            .price-card { border-radius: 30px; padding: 2.5rem; position: relative; transition: 0.4s; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); }
            .price-amount { font-size: 3.5rem; font-weight: 900; margin: 1rem 0; }
            .price-cta { display: block; width: 100%; margin-top: 2rem; padding: 1rem; border-radius: 100px; text-align: center; font-weight: 800; cursor: pointer; border: none; transition: 0.3s; text-decoration: none; }
            
            footer { padding: 6rem 2rem 3rem; background: #000; position: relative; z-index: 10; border-top: 1px solid rgba(255,255,255,0.05); }
            .footer-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; text-align: left; }
            .footer-logo { font-size: 1.5rem; font-weight: 900; margin-bottom: 1.5rem; background: linear-gradient(90deg, #00ff88, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            
            @media (max-width: 768px) {
                .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
                .footer-grid div:first-child { grid-column: 1/-1; }
                .nav-links { display: none; }
            }
        </style>

        <canvas id="globe-canvas"></canvas>

        <div class="landing-wrapper">
            <nav id="navbar" class="landing-nav">
                <div class="nav-logo">MailerPRO</div>
                <div class="nav-links">
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="/docs" data-link>Docs</a>
                    <a href="/login" class="nav-cta" data-link>Launch App</a>
                </div>
            </nav>

            <section id="hero">
                <h1 id="hero-title">Reach 10,000 Inboxes.<br><span>Pay $0 to Start.</span></h1>
                <p id="hero-sub">Send beautiful campaigns, automate your follow-ups, and grow your list — all from one platform. Free to start, no credit card needed.</p>
                <div class="hero-ctas gsap-reveal">
                    <a href="/signup" class="nav-cta" data-link style="padding: 1rem 2.5rem; font-size: 1.1rem;">Start Free Now</a>
                    <a href="#features" class="btn-secondary" style="padding: 1rem 2.5rem; font-size: 1.1rem; text-decoration: none;">See How It Works</a>
                </div>
                <div class="stat-bar gsap-reveal">
                    <div class="stat-item"><span class="stat-num">99.9%</span><span class="stat-label">Deliverability</span></div>
                    <div class="stat-item"><span class="stat-num">1.2B+</span><span class="stat-label">Emails Sent</span></div>
                    <div class="stat-item"><span class="stat-num">50k+</span><span class="stat-label">Global Users</span></div>
                </div>
            </section>

            <section id="cloud-section">
                <div id="cloud-sticky">
                    <div class="cloud-layer" id="cl1"></div>
                    <div class="cloud-layer" id="cl2"></div>
                    <div class="cloud-layer" id="cl3"></div>
                    <div id="cloud-text">
                        <h2>Your Message,<br>Delivered Everywhere.</h2>
                    </div>
                </div>
            </section>

            <section class="reveal-section" id="features">
                <div class="section-inner">
                    <div class="section-badge">Intelligence</div>
                    <h2 class="section-title">Everything you need to<br><span>own your audience</span></h2>
                    <div class="features-grid">
                        <div class="feat-card gsap-reveal">
                            <div class="feat-icon">🎯</div>
                            <h3>Smart Campaigns</h3>
                            <p>AI-driven personalization that adapts to every user's behavior across the globe.</p>
                        </div>
                        <div class="feat-card gsap-reveal">
                            <div class="feat-icon">🌍</div>
                            <h3>Global Network</h3>
                            <p>High-speed delivery nodes ensure your emails arrive instantly, no matter where.</p>
                        </div>
                        <div class="feat-card gsap-reveal">
                            <div class="feat-icon">🔥</div>
                            <h3>Auto-Warming</h3>
                            <p>Built-in IP warming system keeps your deliverability at 99.9% automatically.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="reveal-section" id="pricing">
                <div class="section-inner">
                    <div class="section-badge">Pricing</div>
                    <h2 class="section-title" style="text-align: center;">Simple plans for<br><span>global scale</span></h2>
                    <div class="pricing-grid">
                        <div class="price-card gsap-reveal">
                            <h3>Orbit</h3>
                            <div class="price-amount"><sup>$</sup>0</div>
                            <ul class="price-features" style="list-style:none; padding:0; color:rgba(255,255,255,0.6); font-size:0.9rem;">
                                <li style="margin-bottom:0.5rem;">✅ 1,000 Contacts</li>
                                <li style="margin-bottom:0.5rem;">✅ Basic Automation</li>
                                <li style="margin-bottom:0.5rem;">✅ Standard Support</li>
                            </ul>
                            <a href="/signup" class="price-cta" data-link style="background: rgba(255,255,255,0.1); color: #fff;">Start Free</a>
                        </div>
                        <div class="price-card gsap-reveal" style="border-color: #00ff88; transform: scale(1.05); background: rgba(0,255,136,0.05);">
                            <h3 style="color: #00ff88;">Stellar</h3>
                            <div class="price-amount"><sup>$</sup>19</div>
                            <ul class="price-features" style="list-style:none; padding:0; color:rgba(255,255,255,0.6); font-size:0.9rem;">
                                <li style="margin-bottom:0.5rem;">✅ Unlimited Contacts</li>
                                <li style="margin-bottom:0.5rem;">✅ Full AI Suite</li>
                                <li style="margin-bottom:0.5rem;">✅ Dedicated Warmup</li>
                            </ul>
                            <a href="/signup" class="price-cta" data-link style="background: linear-gradient(135deg, #00ff88, #00e5ff); color: #000;">Go Stellar</a>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div class="footer-grid">
                    <div class="footer-col">
                        <div class="footer-logo">MailerPRO</div>
                        <p style="color:rgba(255,255,255,0.4); font-size:0.9rem; line-height:1.6;">Empowering creators with the most intelligent email engine ever built.</p>
                    </div>
                    <div class="footer-col">
                        <h4 style="margin-bottom:1rem;">Resources</h4>
                        <ul style="list-style:none; padding:0; font-size:0.85rem;">
                            <li><a href="/docs" data-link style="color:rgba(255,255,255,0.4); text-decoration:none;">Documentation</a></li>
                            <li><a href="#" style="color:rgba(255,255,255,0.4); text-decoration:none;">Help Center</a></li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top:4rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.05); text-align:center; color:rgba(255,255,255,0.2); font-size:0.75rem;">
                    © 2026 MailerPRO. All rights reserved.
                </div>
            </footer>
        </div>
    </div>
    `;
}

export function initLanding() {
    if (!window.THREE || !window.gsap) return;

    // --- THREE.JS SETUP ---
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3.5;

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const loader = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
        map: loader.load('/img/earth-blue-marble.jpg'),
        bumpMap: loader.load('/img/earth-topology.png'),
        bumpScale: 0.05,
        specularMap: loader.load('/img/earth-waterbodies.png'),
        specular: new THREE.Color('grey'),
        shininess: 10
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(1.8, 0, 0);
    scene.add(earth);

    const cloudGeo = new THREE.SphereGeometry(1.02, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
        map: loader.load('/img/earth_clouds.png'),
        transparent: true, opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    clouds.position.copy(earth.position);
    scene.add(clouds);

    const starGeo = new THREE.SphereGeometry(10, 64, 64);
    const starMat = new THREE.MeshBasicMaterial({
        map: loader.load('/img/galaxy.png'),
        side: THREE.BackSide, transparent: true, opacity: 0.4
    });
    const stars = new THREE.Mesh(starGeo, starMat);
    scene.add(stars);

    function animate() {
        if (!document.getElementById('globe-canvas')) return;
        requestAnimationFrame(animate);
        earth.rotation.y += 0.001;
        clouds.rotation.y += 0.0015;
        renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- GSAP SCROLL LOGIC ---
    gsap.registerPlugin(ScrollTrigger);

    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#landing-spa-root",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
        }
    });

    mainTl.to(earth.position, { x: 0, duration: 1 }, 0);
    mainTl.to(clouds.position, { x: 0, duration: 1 }, 0);
    mainTl.to("#hero", { opacity: 0, y: -50, duration: 0.5 }, 0.2);
    mainTl.to(camera.position, { z: 1.1, duration: 1.5 }, 0.5);
    mainTl.to("#cloud-text", { opacity: 1, duration: 0.5 }, 1);

    gsap.to('#cl1', { x: '40%', scrollTrigger: { trigger: '#cloud-section', scrub: 1, start: 'top top', end: 'bottom top' } });
    gsap.to('#cl2', { x: '20%', scrollTrigger: { trigger: '#cloud-section', scrub: 1.5, start: 'top top', end: 'bottom top' } });
    gsap.to('#cl3', { x: '10%', scrollTrigger: { trigger: '#cloud-section', scrub: 2, start: 'top top', end: 'bottom top' } });

    mainTl.to(earthMat, { opacity: 0, duration: 0.5 }, 2);
    mainTl.to(cloudMat, { opacity: 0, duration: 0.5 }, 2);
    mainTl.to(starMat, { opacity: 0, duration: 0.5 }, 2);

    document.querySelectorAll('.gsap-reveal').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 50 }, {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    const handleScroll = () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup logic for SPA navigation
    const observer = new MutationObserver(() => {
        if (!document.getElementById('landing-spa-root')) {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            ScrollTrigger.getAll().forEach(st => st.kill());
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
