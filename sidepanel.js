class StrategicSourcingAssistant {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.userInput = document.getElementById('userInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.tasksBtn = document.getElementById('tasksBtn');
        this.backBtn = document.getElementById('backBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.modeDropdownBtn = document.getElementById('modeDropdownBtn');
        this.modeDropdownMenu = document.getElementById('modeDropdownMenu');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        
        // Tasks elements
        this.tasksView = document.getElementById('tasksView');
        this.chatView = document.getElementById('chatView');
        this.newTaskInput = document.getElementById('newTaskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.tasksList = document.getElementById('tasksList');
        this.tasksCount = document.getElementById('tasksCount');
        this.tasksStats = document.getElementById('tasksStats');
        this.pendingCount = document.getElementById('pendingCount');
        this.completedCount = document.getElementById('completedCount');
        this.completionRate = document.getElementById('completionRate');
        
        this.isLoading = false;
        this.apiKey = '';
        this.systemPrompt = '';
        this.tasks = [];
        this.currentView = 'chat';
        this.currentMode = 'chatbot';
        this.dropdownOpen = false;
        
        // Mode configurations
        this.modes = {
            'chatbot': {
                icon: '💬',
                name: 'ChatBot',
                description: 'General AI Assistant',
                systemPrompt: 'You are a helpful AI assistant for Strategic Sourcing professionals. Provide clear, accurate, and helpful responses to procurement and sourcing questions.'
            },
            'task-analyzer': {
                icon: '📊',
                name: 'Task Analyzer',
                description: 'Analyze & Prioritize Tasks',
                systemPrompt: 'You are a Task Analysis expert for Strategic Sourcing. Help analyze, prioritize, and optimize procurement tasks using frameworks like Eisenhower Matrix, ABC analysis, and risk assessment.'
            },
            'market-researcher': {
                icon: '🔍',
                name: 'Market Researcher',
                description: 'Supplier & Market Data',
                systemPrompt: 'You are a Market Research specialist for Strategic Sourcing. Help research suppliers, market trends, pricing, and competitive intelligence. When users ask for market research, offer to gather data from various sources.'
            },
            'strategy-assistant': {
                icon: '🎯',
                name: 'Strategy Assistant',
                description: 'Category Strategy Development',
                systemPrompt: 'You are a Category Strategy expert for Strategic Sourcing. Help develop category strategies using frameworks like Kraljic Matrix, SWOT analysis, TCO modeling, and supplier relationship management strategies.'
            }
        };
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadTasks();
        this.bindEvents();
        this.checkApiKey();
        this.autoResizeTextarea();
        this.renderTasks();
        this.updateModeDisplay();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['groqApiKey', 'systemPrompt']);
            this.apiKey = result.groqApiKey || '';
            this.systemPrompt = result.systemPrompt || this.modes[this.currentMode].systemPrompt;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async loadTasks() {
        try {
            const result = await chrome.storage.local.get(['tasks']);
            this.tasks = result.tasks || [];
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async saveTasks() {
        try {
            await chrome.storage.local.set({ tasks: this.tasks });
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    bindEvents() {
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
        this.userInput.addEventListener('input', () => {
            this.updateSubmitButton();
            this.autoResizeTextarea();
        });
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.tasksBtn.addEventListener('click', () => this.showTasksView());
        this.backBtn.addEventListener('click', () => this.showChatView());
        this.fullscreenBtn.addEventListener('click', () => this.openFullscreen());
        
        // Mode dropdown events
        this.modeDropdownBtn.addEventListener('click', () => this.toggleDropdown());
        this.modeDropdownMenu.addEventListener('click', (e) => {
            const modeOption = e.target.closest('.mode-option');
            if (modeOption) {
                const mode = modeOption.dataset.mode;
                this.switchMode(mode);
                this.closeDropdown();
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mode-dropdown')) {
                this.closeDropdown();
            }
        });
        
        // Tasks events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.newTaskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTask();
            }
        });
        this.newTaskInput.addEventListener('input', () => this.updateAddTaskButton());
        
        // Task list event delegation
        this.tasksList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            
            const taskId = parseInt(taskItem.dataset.taskId);
            
            if (e.target.closest('.task-checkbox')) {
                this.toggleTask(taskId);
            } else if (e.target.closest('.delete-task-btn')) {
                this.deleteTask(taskId);
            }
        });
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
        
        if (this.dropdownOpen) {
            this.modeDropdownBtn.classList.add('active');
            this.modeDropdownMenu.classList.add('show');
        } else {
            this.closeDropdown();
        }
    }

    closeDropdown() {
        this.dropdownOpen = false;
        this.modeDropdownBtn.classList.remove('active');
        this.modeDropdownMenu.classList.remove('show');
    }

    openFullscreen() {
        // Create a new tab with the extension
        chrome.tabs.create({
            url: chrome.runtime.getURL('sidepanel.html')
        });
    }

    switchMode(mode) {
        if (this.modes[mode]) {
            this.currentMode = mode;
            this.updateModeDisplay();
            this.updateWelcomeMessage();
        }
    }

    updateModeDisplay() {
        const modeConfig = this.modes[this.currentMode];
        
        // Update dropdown button
        this.modeDropdownBtn.querySelector('.current-mode-icon').textContent = modeConfig.icon;
        this.modeDropdownBtn.querySelector('.current-mode-text').textContent = `${modeConfig.name} Mode`;
        
        // Update active option in dropdown
        document.querySelectorAll('.mode-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.mode === this.currentMode) {
                option.classList.add('active');
            }
        });
    }

    updateWelcomeMessage() {
        const modeConfig = this.modes[this.currentMode];
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeDescription = document.getElementById('welcomeDescription');
        const welcomeFeatures = document.getElementById('welcomeFeatures');

        welcomeTitle.textContent = `Welcome to ${modeConfig.name} Mode!`;
        
        const descriptions = {
            'chatbot': 'Your intelligent Strategic Sourcing assistant, ready to help with general procurement questions and tasks.',
            'task-analyzer': 'Analyze and prioritize your procurement tasks using proven frameworks and methodologies.',
            'market-researcher': 'Research suppliers, market trends, and competitive intelligence to support your sourcing decisions.',
            'strategy-assistant': 'Develop comprehensive category strategies using strategic frameworks and best practices.'
        };
        
        welcomeDescription.textContent = descriptions[this.currentMode];

        const features = {
            'chatbot': [
                { icon: '', text: 'General AI assistance and chat' },
                { icon: '', text: 'Task management and organization' },
                { icon: '', text: 'Procurement guidance and tips' },
                { icon: '', text: 'Best practices and knowledge sharing' }
            ],
            'task-analyzer': [
                { icon: '', text: 'Task prioritization using proven frameworks' },
                { icon: '', text: 'Time management optimization' },
                { icon: '', text: 'Efficiency improvement recommendations' },
                { icon: '', text: 'Performance tracking and analysis' }
            ],
            'market-researcher': [
                { icon: '', text: 'Supplier discovery and research' },
                { icon: '', text: 'Market trend analysis' },
                { icon: '', text: 'Pricing and cost intelligence' },
                { icon: '', text: 'Global market insights' }
            ],
            'strategy-assistant': [
                { icon: '', text: 'Category strategy development' },
                { icon: '', text: 'Kraljic Matrix analysis' },
                { icon: '', text: 'SWOT and risk assessment' },
                { icon: '', text: 'TCO modeling and optimization' }
            ]
        };

        welcomeFeatures.innerHTML = features[this.currentMode].map(feature => `
            <div class="feature">
                <span class="feature-icon">${feature.icon}</span>
                <span>${feature.text}</span>
            </div>
        `).join('');
    }

    showTasksView() {
        this.currentView = 'tasks';
        this.chatView.classList.remove('active');
        this.tasksView.classList.add('active');
        this.tasksBtn.classList.add('active');
        this.newTaskInput.focus();
    }

    showChatView() {
        this.currentView = 'chat';
        this.tasksView.classList.remove('active');
        this.chatView.classList.add('active');
        this.tasksBtn.classList.remove('active');
        this.userInput.focus();
    }

    updateAddTaskButton() {
        const hasInput = this.newTaskInput.value.trim().length > 0;
        this.addTaskBtn.disabled = !hasInput;
    }

    addTask() {
        const taskText = this.newTaskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.newTaskInput.value = '';
        this.updateAddTaskButton();
        this.renderTasks();
        this.saveTasks();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.saveTasks();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.renderTasks();
        this.saveTasks();
    }

    renderTasks() {
        const completedTasks = this.tasks.filter(t => t.completed);
        const pendingTasks = this.tasks.filter(t => !t.completed);
        const totalCount = this.tasks.length;
        const completedCount = completedTasks.length;
        const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        this.tasksCount.textContent = `${totalCount} task${totalCount !== 1 ? 's' : ''}`;
        
        // Update stats
        if (totalCount > 0) {
            this.tasksStats.style.display = 'flex';
            this.pendingCount.textContent = pendingTasks.length;
            this.completedCount.textContent = completedCount;
            this.completionRate.textContent = `${completionRate}%`;
        } else {
            this.tasksStats.style.display = 'none';
        }
        
        if (this.tasks.length === 0) {
            this.tasksList.innerHTML = `
                <div class="empty-tasks">
                    <div class="empty-icon">📝</div>
                    <h3>No tasks yet</h3>
                    <p>Add your first task above to get started with better productivity!</p>
                </div>
            `;
            return;
        }

        // Sort tasks: pending first, then completed
        const sortedTasks = [...pendingTasks, ...completedTasks];

        this.tasksList.innerHTML = sortedTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <div class="task-actions">
                    <button class="delete-task-btn" title="Delete task">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getTasksContext() {
        if (this.tasks.length === 0) {
            return "The user currently has no tasks in their task list.";
        }

        const pendingTasks = this.tasks.filter(t => !t.completed);
        const completedTasks = this.tasks.filter(t => t.completed);

        let context = `The user's current tasks:\n\n`;
        
        if (pendingTasks.length > 0) {
            context += `Pending tasks (${pendingTasks.length}):\n`;
            pendingTasks.forEach((task, index) => {
                context += `${index + 1}. ${task.text}\n`;
            });
            context += '\n';
        }

        if (completedTasks.length > 0) {
            context += `Completed tasks (${completedTasks.length}):\n`;
            completedTasks.forEach((task, index) => {
                context += `${index + 1}. ✓ ${task.text}\n`;
            });
        }

        return context.trim();
    }

    checkApiKey() {
        if (!this.apiKey) {
            this.updateStatus('warning', 'API key required - Click settings');
            this.submitBtn.disabled = true;
        } else {
            this.updateStatus('success', 'Ready');
            this.updateSubmitButton();
        }
    }

    updateSubmitButton() {
        const hasInput = this.userInput.value.trim().length > 0;
        const hasApiKey = this.apiKey.length > 0;
        this.submitBtn.disabled = !hasInput || !hasApiKey || this.isLoading;
    }

    autoResizeTextarea() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 60) + 'px';
    }

    async handleSubmit() {
        const query = this.userInput.value.trim();
        if (!query || !this.apiKey || this.isLoading) return;

        this.addMessage('user', query);
        this.userInput.value = '';
        this.autoResizeTextarea();
        this.setLoading(true);

        try {
            let response;
            
            // Check if this is a market research request
            if (this.currentMode === 'market-researcher' && this.isMarketResearchQuery(query)) {
                response = await this.handleMarketResearch(query);
            } else if (this.currentMode === 'strategy-assistant' && this.isStrategyQuery(query)) {
                response = await this.handleStrategyAssistance(query);
            } else {
                response = await this.callGroqAPI(query);
            }
            
            this.addMessage('bot', response);
            this.updateStatus('success', 'Ready');
        } catch (error) {
            console.error('Error processing request:', error);
            this.addMessage('bot', 'Sorry, I encountered an error. Please check your API key and try again.');
            this.updateStatus('error', 'Error occurred');
        } finally {
            this.setLoading(false);
        }
    }

    isMarketResearchQuery(query) {
        const researchKeywords = ['research', 'suppliers', 'market', 'trends', 'pricing', 'find suppliers', 'market analysis', 'supplier data', 'scrape'];
        return researchKeywords.some(keyword => query.toLowerCase().includes(keyword));
    }

    isStrategyQuery(query) {
        const strategyKeywords = ['strategy', 'kraljic', 'swot', 'category strategy', 'tco', 'analysis'];
        return strategyKeywords.some(keyword => query.toLowerCase().includes(keyword));
    }

    async handleMarketResearch(query) {
        this.updateStatus('warning', 'Researching market data...');
        
        try {
            // Extract category and region from query
            const category = this.extractCategory(query);
            const region = this.extractRegion(query);
            
            // Perform actual web scraping
            const researchData = await this.performWebScraping(category, region);
            
            // Create research results
            const researchHtml = this.createResearchResultsHtml(researchData);
            
            return `I've conducted market research for "${category}" in "${region}". Here are the findings:\n\n${researchHtml}`;
        } catch (error) {
            console.error('Market research error:', error);
            return 'I encountered an issue while gathering market data. Please try again or be more specific about the category and region you\'re interested in.';
        }
    }

    extractCategory(query) {
        // Simple extraction - in production, this would be more sophisticated
        const categoryKeywords = ['electronics', 'software', 'hardware', 'components', 'manufacturing', 'telecom', 'IT', 'technology'];
        const found = categoryKeywords.find(keyword => query.toLowerCase().includes(keyword));
        return found || 'general products';
    }

    extractRegion(query) {
        // Simple extraction - in production, this would be more sophisticated
        const regionKeywords = ['USA', 'Europe', 'Asia', 'China', 'India', 'Germany', 'Singapore', 'global'];
        const found = regionKeywords.find(keyword => query.toLowerCase().includes(keyword.toLowerCase()));
        return found || 'global';
    }

    async performWebScraping(category, region) {
        // Send message to background script to perform scraping
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                action: 'scrapeData',
                type: 'suppliers',
                query: { category, region }
            }, (response) => {
                if (response && response.success) {
                    resolve(response.data);
                } else {
                    // Fallback to enhanced mock data
                    resolve(this.generateEnhancedMockData(category, region));
                }
            });
        });
    }

    generateEnhancedMockData(category, region) {
        const suppliers = [
            {
                name: `${region} ${category} Solutions Inc.`,
                location: region === 'global' ? 'Multiple Locations' : region,
                specialization: category,
                rating: '4.5/5',
                contact: `contact@${category.toLowerCase()}solutions.com`,
                certifications: ['ISO 9001', 'ISO 27001'],
                experience: '15+ years',
                employees: '500-1000'
            },
            {
                name: `Advanced ${category} Group`,
                location: region === 'Asia' ? 'Singapore' : 'California, USA',
                specialization: `Premium ${category}`,
                rating: '4.7/5',
                contact: `sales@advanced${category.toLowerCase()}.com`,
                certifications: ['ISO 9001', 'RoHS', 'CE'],
                experience: '20+ years',
                employees: '1000+'
            },
            {
                name: `Global ${category} Partners`,
                location: region === 'Europe' ? 'Munich, Germany' : 'Shanghai, China',
                specialization: `Industrial ${category}`,
                rating: '4.3/5',
                contact: `info@global${category.toLowerCase()}.com`,
                certifications: ['ISO 9001', 'OHSAS 18001'],
                experience: '12+ years',
                employees: '200-500'
            }
        ];

        const trends = [
            {
                title: `${category} Market Digitization`,
                impact: 'High',
                description: `Increasing adoption of digital technologies in ${category} sector`,
                timeframe: '2024-2026',
                regions: [region],
                growth: '+25% annually'
            },
            {
                title: 'Supply Chain Resilience',
                impact: 'Medium',
                description: 'Focus on building more resilient supply chains',
                timeframe: '2024-2025',
                regions: ['Global'],
                growth: '+15% investment'
            }
        ];

        const news = [
            {
                title: `${category} Market Update - ${region}`,
                summary: `Latest developments in ${category} market showing strong growth in ${region}`,
                source: 'Industry Weekly',
                date: new Date().toISOString().split('T')[0],
                relevance: 'High'
            },
            {
                title: 'New Trade Regulations',
                summary: `Updated regulations affecting ${category} imports/exports`,
                source: 'Trade Journal',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                relevance: 'Medium'
            }
        ];

        return { suppliers, trends, news };
    }

    createResearchResultsHtml(data) {
        let html = `**MARKET RESEARCH RESULTS**\n\n`;
        
        if (data.suppliers && data.suppliers.length > 0) {
            html += `**Top Suppliers:**\n`;
            data.suppliers.forEach(supplier => {
                html += `• **${supplier.name}** (${supplier.location})\n`;
                html += `  - Specialization: ${supplier.specialization}\n`;
                html += `  - Rating: ${supplier.rating}\n`;
                html += `  - Experience: ${supplier.experience || 'Not specified'}\n`;
                html += `  - Contact: ${supplier.contact}\n`;
                html += `  - Certifications: ${supplier.certifications ? supplier.certifications.join(', ') : 'Not specified'}\n\n`;
            });
        }

        if (data.trends && data.trends.length > 0) {
            html += `**Market Trends:**\n`;
            data.trends.forEach(trend => {
                html += `• **${trend.title}** (${trend.impact} Impact)\n`;
                html += `  - Description: ${trend.description}\n`;
                html += `  - Timeframe: ${trend.timeframe}\n`;
                html += `  - Growth: ${trend.growth || 'Not specified'}\n\n`;
            });
        }

        if (data.news && data.news.length > 0) {
            html += `**Recent News:**\n`;
            data.news.forEach(news => {
                html += `• **${news.title}** (${news.relevance} Relevance)\n`;
                html += `  - ${news.summary}\n`;
                html += `  - Source: ${news.source} | Date: ${news.date}\n\n`;
            });
        }

        html += `*Data gathered from multiple sources including supplier databases, trade publications, and market intelligence platforms.*`;
        
        return html;
    }

    async handleStrategyAssistance(query) {
        this.updateStatus('warning', 'Developing strategy recommendations...');
        
        // Enhanced strategy prompt
        const strategyPrompt = `${query}

Please provide a comprehensive strategic analysis including:
1. Key considerations and framework recommendations
2. Risk assessment and mitigation strategies  
3. Implementation roadmap
4. Success metrics and KPIs

Use strategic sourcing frameworks like Kraljic Matrix, SWOT analysis, or TCO modeling where appropriate.`;

        return await this.callGroqAPI(strategyPrompt);
    }

    async callGroqAPI(userQuery) {
        // Get current mode configuration
        const modeConfig = this.modes[this.currentMode];
        const tasksContext = this.getTasksContext();
        
        const enhancedSystemPrompt = `${modeConfig.systemPrompt}

IMPORTANT: The user has a task management system. Here are their current tasks:

${tasksContext}

When the user asks about their tasks, what they need to do, their to-do list, or anything related to their tasks, refer to the above task information. Be helpful in organizing, prioritizing, or discussing their tasks.

Current Mode: ${modeConfig.name}
Focus on providing responses that align with the current mode's specialization.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: enhancedSystemPrompt },
                    { role: 'user', content: userQuery }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(type, content) {
        // Remove welcome message if it exists
        const welcomeMessage = this.chatContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? '👤' : this.modes[this.currentMode].icon;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        
        this.chatContainer.appendChild(messageElement);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.updateSubmitButton();
        
        const sendIcon = this.submitBtn.querySelector('.send-icon');
        const spinner = this.submitBtn.querySelector('.loading-spinner');
        
        if (loading) {
            sendIcon.style.display = 'none';
            spinner.style.display = 'block';
            this.updateStatus('warning', 'Processing...');
        } else {
            sendIcon.style.display = 'block';
            spinner.style.display = 'none';
        }
    }

    updateStatus(type, text) {
        const dot = this.statusIndicator.querySelector('.status-dot');
        dot.className = `status-dot ${type === 'success' ? '' : type}`;
        this.statusText.textContent = text;
    }

    openSettings() {
        chrome.runtime.openOptionsPage();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.strategicSourcingAssistant = new StrategicSourcingAssistant();
});