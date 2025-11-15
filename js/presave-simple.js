// SIMPLIFIED Pre-Save System (No Backend Required)
// Uses mailto: links for email collection temporarily

class SimplePreSaveSystem {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupButtons();
            this.setupModal();
        });
    }

    setupButtons() {
        const presaveButtons = document.querySelectorAll('.presave-btn.primary');
        presaveButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.openModal();
            };
        });
    }

    openModal() {
        const modal = document.getElementById('presaveModalSimple');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('presaveModalSimple');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupModal() {
        const modalHTML = `
            <div id="presaveModalSimple" class="presave-modal">
                <div class="presave-modal-content">
                    <button class="presave-modal-close" onclick="simplePreSave.closeModal()">&times;</button>
                    
                    <div class="presave-modal-header">
                        <i class="fas fa-music"></i>
                        <h2>Pre-Save Ocean Dance</h2>
                        <p>Get Cyprus Sun as FREE bonus track!</p>
                    </div>

                    <div class="presave-step">
                        <h3>🎵 Step 1: Pre-Save on Spotify</h3>
                        <p>Ocean Dance will be available on Spotify starting <strong>December 6, 2025</strong>!</p>
                        <p>For now, you can listen to our demo tracks on the <a href="tini-records.html" style="color: #667eea; font-weight: 600;">TINI Records page</a>.</p>
                        
                        <h3 style="margin-top: 2rem;">🎁 Step 2: Get Cyprus Sun Now</h3>
                        <p>Cyprus Sun is already available for you to enjoy! You can:</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0;">
                            <a href="tini-records.html#cyprus-sun" class="presave-spotify-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                <i class="fas fa-play"></i> Stream Cyprus Sun Now
                            </a>
                            
                            <a href="audio/cyprus-sun-bonus.mp3" download class="presave-spotify-btn" style="background: #1DB954;">
                                <i class="fas fa-download"></i> Download Cyprus Sun (192kbps)
                            </a>
                        </div>

                        <div style="background: #f0f9f4; padding: 1.5rem; border-radius: 15px; border-left: 4px solid #1DB954; margin-top: 2rem;">
                            <h4 style="margin-top: 0; color: #333;">📧 Want updates about Ocean Dance release?</h4>
                            <p style="font-size: 0.95rem; color: #666; margin-bottom: 1rem;">Send us an email to get notified when Ocean Dance drops!</p>
                            <a href="mailto:hello@tini.ai?subject=Pre-Save%20Ocean%20Dance&body=Hi%20TINI!%0A%0AI%20want%20to%20be%20notified%20when%20Ocean%20Dance%20releases%20on%20December%206%2C%202025!%0A%0AMy%20email%3A%20[YOUR_EMAIL_HERE]%0A%0AThanks!" 
                               class="presave-submit-btn" 
                               style="text-decoration: none; width: auto; display: inline-flex;">
                                <i class="fas fa-envelope"></i> Get Release Notification
                            </a>
                        </div>

                        <div class="presave-success-note" style="margin-top: 2rem;">
                            <strong>Coming December 6, 2025:</strong><br>
                            • Ocean Dance on all major streaming platforms<br>
                            • Official music video<br>
                            • Behind-the-scenes content<br>
                            • More exclusive tracks on TINI Records
                        </div>

                        <button class="presave-close-btn" onclick="simplePreSave.closeModal()" style="margin-top: 1.5rem;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('presaveModalSimple');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
}

// Initialize simple pre-save system
const simplePreSave = new SimplePreSaveSystem();
