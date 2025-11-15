// Pre-Save System for Ocean Dance
// Handles email collection and Cyprus Sun bonus track delivery

class PreSaveSystem {
    constructor() {
        this.apiEndpoint = 'https://tini-presave-api.pascal-workers.workers.dev/api/presave';
        this.init();
    }

    init() {
        // Add event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.setupButtons();
            this.setupModal();
        });
    }

    setupButtons() {
        // Find all pre-save buttons
        const presaveButtons = document.querySelectorAll('.presave-btn.primary');
        presaveButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.openModal();
            };
        });
    }

    openModal() {
        const modal = document.getElementById('presaveModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('presaveModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="presaveModal" class="presave-modal">
                <div class="presave-modal-content">
                    <button class="presave-modal-close" onclick="preSaveSystem.closeModal()">&times;</button>
                    
                    <div class="presave-modal-header">
                        <i class="fas fa-music"></i>
                        <h2>Pre-Save Ocean Dance</h2>
                        <p>Get Cyprus Sun as FREE bonus track!</p>
                    </div>

                    <div id="presaveStep1" class="presave-step">
                        <h3>Step 1: Pre-Save on Spotify</h3>
                        <p>Click the button below to pre-save Ocean Dance on Spotify. It will be automatically added to your library on December 6, 2025!</p>
                        <a href="https://open.spotify.com/artist/YOUR_ARTIST_ID" target="_blank" class="presave-spotify-btn" onclick="preSaveSystem.spotifyPreSaved()">
                            <i class="fab fa-spotify"></i> Pre-Save on Spotify
                        </a>
                        <p class="presave-note">Opens in new tab</p>
                    </div>

                    <div id="presaveStep2" class="presave-step" style="display: none;">
                        <h3>Step 2: Get Your Bonus Track</h3>
                        <p>Enter your email to receive <strong>Cyprus Sun</strong> immediately!</p>
                        
                        <form id="presaveForm" class="presave-form">
                            <input type="email" id="presaveEmail" placeholder="your.email@example.com" required>
                            <div class="presave-checkbox">
                                <input type="checkbox" id="presaveConfirm" required>
                                <label for="presaveConfirm">I confirm I pre-saved Ocean Dance on Spotify</label>
                            </div>
                            <button type="submit" class="presave-submit-btn">
                                <i class="fas fa-gift"></i> Get Cyprus Sun
                            </button>
                        </form>

                        <p class="presave-privacy">
                            <i class="fas fa-lock"></i> Your email is safe. We'll only send you Cyprus Sun and important updates about Ocean Dance.
                        </p>
                    </div>

                    <div id="presaveSuccess" class="presave-step" style="display: none;">
                        <div class="presave-success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>You're All Set! 🎉</h3>
                        <p>Check your email inbox for your Cyprus Sun download link!</p>
                        <p class="presave-success-note">
                            <strong>What happens next:</strong><br>
                            • You'll receive Cyprus Sun in your email within 2 minutes<br>
                            • Ocean Dance will be added to your Spotify library on December 6<br>
                            • You'll get a reminder email on release day
                        </p>
                        <button class="presave-close-btn" onclick="preSaveSystem.closeModal()">Close</button>
                    </div>

                    <div id="presaveError" class="presave-step presave-error" style="display: none;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Oops! Something went wrong</h3>
                        <p id="errorMessage"></p>
                        <button class="presave-retry-btn" onclick="preSaveSystem.resetForm()">Try Again</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup form submission
        const form = document.getElementById('presaveForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('presaveModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    spotifyPreSaved() {
        // Show step 2 after user clicks Spotify button
        setTimeout(() => {
            document.getElementById('presaveStep1').style.display = 'none';
            document.getElementById('presaveStep2').style.display = 'block';
        }, 2000); // Wait 2 seconds for user to pre-save
    }

    async submitForm() {
        const email = document.getElementById('presaveEmail').value;
        const confirmed = document.getElementById('presaveConfirm').checked;

        if (!email || !confirmed) {
            this.showError('Please fill in all fields and confirm your pre-save.');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('.presave-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Send to backend API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'website'
                })
            });

            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Pre-save error:', error);
            this.showError('Failed to send email. Please try again or contact hello@tini.ai');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccess() {
        document.getElementById('presaveStep2').style.display = 'none';
        document.getElementById('presaveSuccess').style.display = 'block';
        
        // Track conversion (optional analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'presave_complete', {
                'event_category': 'music',
                'event_label': 'ocean_dance'
            });
        }
    }

    showError(message) {
        document.getElementById('presaveStep2').style.display = 'none';
        document.getElementById('presaveError').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    resetForm() {
        document.getElementById('presaveError').style.display = 'none';
        document.getElementById('presaveStep2').style.display = 'block';
        document.getElementById('presaveForm').reset();
    }
}

// Initialize pre-save system
const preSaveSystem = new PreSaveSystem();
