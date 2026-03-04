export async function Templates() {
    return `
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
                ${[
                    { name: 'Minimalist Blog', desc: 'Perfect for text-heavy updates.', color: '#f8fafc' },
                    { name: 'Modern E-commerce', desc: 'Showcase your seasonal products.', color: '#f1f5f9' },
                    { name: 'Event Invitation', desc: 'Elegant layout for webinars.', color: '#fdfcfe' },
                    { name: 'Monthly Digest', desc: 'Curated content summary.', color: '#fff' },
                    { name: 'Welcome Series', desc: 'First impression for new users.', color: '#faf9f6' },
                    { name: 'Flash Sale', desc: 'High-conversion retail layout.', color: '#f8fafc' }
                ].map((item, i) => `
                    <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--border); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="height: 220px; background: ${item.color}; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border);">
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
                            <h4 style="margin-bottom: 0.5rem; font-weight: 700;">${item.name}</h4>
                            <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.5rem;">${item.desc}</p>
                            <button class="btn btn-outline" style="width: 100%; font-size: 0.875rem;">Use Template</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
