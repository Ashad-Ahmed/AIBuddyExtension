class StrategicSourcingSettings {
    constructor() {
        this.apiKeyInput = document.getElementById('apiKey');
        this.systemPromptInput = document.getElementById('systemPrompt');
        this.saveBtn = document.getElementById('saveBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.toggleApiKeyBtn = document.getElementById('toggleApiKey');
        this.toast = document.getElementById('toast');
        
        this.defaultSystemPrompt = 'You are a helpful AI assistant for Strategic Sourcing professionals. Provide clear, accurate, and helpful responses to procurement and sourcing questions. Be concise but comprehensive in your answers. You have access to specialized modes for task analysis, market research, and category strategy development.';
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.bindEvents();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['groqApiKey', 'systemPrompt']);
            this.apiKeyInput.value = result.groqApiKey || '';
            this.systemPromptInput.value = result.systemPrompt || this.defaultSystemPrompt;
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showToast('Error loading settings', 'error');
        }
    }

    bindEvents() {
        this.saveBtn.addEventListener('click', () => this.saveSettings());
        this.resetBtn.addEventListener('click', () => this.resetSettings());
        this.toggleApiKeyBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        
        // Auto-save on input change with debounce
        let timeoutId;
        const autoSave = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => this.saveSettings(true), 1000);
        };
        
        this.apiKeyInput.addEventListener('input', autoSave);
        this.systemPromptInput.addEventListener('input', autoSave);
        
        // Handle Enter key in API key input
        this.apiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveSettings();
            }
        });
    }

    async saveSettings(silent = false) {
        const apiKey = this.apiKeyInput.value.trim();
        const systemPrompt = this.systemPromptInput.value.trim() || this.defaultSystemPrompt;

        try {
            await chrome.storage.sync.set({
                groqApiKey: apiKey,
                systemPrompt: systemPrompt
            });

            if (!silent) {
                this.showToast('Settings saved successfully!', 'success');
            }
            
            // Update button states
            this.updateButtonStates();
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast('Error saving settings', 'error');
        }
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
            this.apiKeyInput.value = '';
            this.systemPromptInput.value = this.defaultSystemPrompt;
            this.saveSettings();
        }
    }

    toggleApiKeyVisibility() {
        const isPassword = this.apiKeyInput.type === 'password';
        this.apiKeyInput.type = isPassword ? 'text' : 'password';
        
        const eyeIcon = this.toggleApiKeyBtn.querySelector('.eye-icon');
        if (isPassword) {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    }

    updateButtonStates() {
        const hasApiKey = this.apiKeyInput.value.trim().length > 0;
        // Add visual feedback for API key status if needed
    }

    showToast(message, type = 'success') {
        const toastContent = this.toast.querySelector('.toast-content');
        const toastIcon = this.toast.querySelector('.toast-icon');
        const toastMessage = this.toast.querySelector('.toast-message');
        
        // Update toast content
        toastMessage.textContent = message;
        
        if (type === 'success') {
            toastIcon.textContent = '✅';
            this.toast.style.background = 'rgba(16, 185, 129, 0.95)';
        } else if (type === 'error') {
            toastIcon.textContent = '❌';
            this.toast.style.background = 'rgba(239, 68, 68, 0.95)';
        }
        
        // Show toast
        this.toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StrategicSourcingSettings();
});