import { accountApi } from '../api';
import { showToast } from '../utils/toast';

export function Auth(type = 'signup') {
    const isSignup = type === 'signup';
    
    if (!isSignup) {
        return renderLogin();
    }

    return renderSignupWizard();
}

function renderLogin() {
    return `
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
    `;
}

function renderSignupWizard() {
    return `
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
    `;
}

export function initAuth() {
    const form = document.getElementById('auth-form');
    const canvas = document.getElementById('auth-canvas');
    if (!form || !canvas) return;

    // --- THREE.JS BACKGROUND ---
    let renderer, scene, camera, earth, clouds;
    const init3D = () => {
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.z = 2.5;

            const ambient = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambient);
            const sun = new THREE.DirectionalLight(0xffffff, 1.0);
            sun.position.set(5, 3, 5);
            scene.add(sun);

            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');

            // Earth
            const earthGeo = new THREE.SphereGeometry(1, 64, 64);
            const earthMat = new THREE.MeshPhongMaterial({
                color: 0x2233ff, // Fallback color
                shininess: 5
            });
            earth = new THREE.Mesh(earthGeo, earthMat);
            scene.add(earth);

            // Load texture with fallback
            loader.load(
                'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
                (tex) => { earthMat.map = tex; earthMat.needsUpdate = true; earthMat.color.set(0xffffff); },
                undefined,
                (err) => console.warn('Earth texture failed, using fallback color')
            );

            // Clouds
            const cloudGeo = new THREE.SphereGeometry(1.02, 64, 64);
            const cloudMat = new THREE.MeshPhongMaterial({
                transparent: true, opacity: 0.3
            });
            clouds = new THREE.Mesh(cloudGeo, cloudMat);
            scene.add(clouds);

            loader.load(
                'https://unpkg.com/three-globe/example/img/earth-clouds.png',
                (tex) => { cloudMat.map = tex; cloudMat.needsUpdate = true; },
                undefined,
                (err) => { clouds.visible = false; }
            );

            // Stars
            const starGeo = new THREE.SphereGeometry(10, 64, 64);
            const starMat = new THREE.MeshBasicMaterial({
                side: THREE.BackSide, transparent: true, opacity: 0.2, color: 0x111122
            });
            const starField = new THREE.Mesh(starGeo, starMat);
            scene.add(starField);

            loader.load(
                'https://unpkg.com/three-globe/example/img/night-sky.png',
                (tex) => { starMat.map = tex; starMat.needsUpdate = true; starMat.color.set(0xffffff); },
                undefined,
                (err) => { }
            );

            const animate = () => {
                if (!document.getElementById('auth-canvas')) return;
                requestAnimationFrame(animate);
                if(earth) earth.rotation.y += 0.001;
                if(clouds) clouds.rotation.y += 0.0015;
                renderer.render(scene, camera);
            };
            animate();
        } catch (e) {
            console.error('Three.js Init Error:', e);
        }
    };

    init3D();

    window.addEventListener('resize', () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    let currentStep = 1;

    // Navigation logic
    const showStep = (step) => {
        document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
        document.getElementById(`step-${step}`).style.display = 'block';
        
        // Update dots
        document.querySelectorAll('.step-dot').forEach(dot => {
            const isActive = dot.dataset.step == step;
            dot.style.background = isActive ? '#00ff88' : 'rgba(255,255,255,0.1)';
            dot.style.boxShadow = isActive ? '0 0 10px #00ff88' : 'none';
        });

        // Update title
        const title = document.getElementById('wizard-title');
        if (title) {
            if (step === 1) title.textContent = 'Create Account';
            if (step === 2) title.textContent = 'Business Details';
            if (step === 3) title.textContent = 'Network Config';
        }
    };

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('next-btn')) {
            // Basic validation for step 1
            if (currentStep === 1) {
                const name = form.querySelector('[name="name"]').value;
                const email = form.querySelector('[name="email"]').value;
                const pass = form.querySelector('[name="password"]').value;
                if (!name || !email || !pass) {
                    showToast('Please fill in all account details.', 'error');
                    return;
                }
            }
            currentStep++;
            showStep(currentStep);
        }
        if (e.target.classList.contains('prev-btn')) {
            currentStep--;
            showStep(currentStep);
        }
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const isSignup = form.dataset.type === 'signup';

        try {
            let userData;
            if (isSignup) {
                const signupRes = await accountApi.signup({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    company_name: data.company_name,
                    domain: data.domain
                });

                if (data.smtp_host) {
                    await accountApi.saveSMTP({
                        account_id: signupRes.id,
                        host: data.smtp_host,
                        port: parseInt(data.smtp_port),
                        username: data.smtp_user,
                        password: data.smtp_pass,
                        security_type: 'tls'
                    });
                }

                userData = {
                    id: signupRes.id,
                    name: data.name,
                    email: data.email
                };
            } else {
                const loginRes = await accountApi.login({
                    email: data.email,
                    password: data.password
                });
                userData = loginRes;
            }

            localStorage.setItem('camp_user', JSON.stringify(userData));
            window.sessionStorage.setItem('isLoggedIn', 'true');
            showToast(isSignup ? 'Setup complete! Welcome to the premium inbox experience.' : 'Welcome back!', 'success');
            window.location.href = '/';
        } catch (err) {
            showToast((isSignup ? 'Setup failed: ' : 'Login failed: ') + err.message, 'error');
        }
    };
}
