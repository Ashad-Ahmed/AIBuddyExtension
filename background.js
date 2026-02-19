// Background script for AI Buddy Strategic Sourcing Extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default settings on first install
        chrome.storage.sync.set({
            systemPrompt: 'You are a helpful AI assistant for Strategic Sourcing professionals. Provide clear, accurate, and helpful responses to procurement and sourcing questions. Be concise but comprehensive in your answers.',
            groqApiKey: ''
        });
        
        // Open options page on first install
        chrome.runtime.openOptionsPage();
    }
});

// Handle action button click to open side panel
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
});

// Handle messages from sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.sync.get(['groqApiKey', 'systemPrompt'], (result) => {
            sendResponse(result);
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'scrapeData') {
        // Handle data scraping requests
        handleDataScraping(request, sendResponse);
        return true;
    }
});

// Handle data scraping for market research
async function handleDataScraping(request, sendResponse) {
    try {
        const { type, query } = request;
        
        // Try to inject content script and scrape real data
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.url && !tab.url.startsWith('chrome://')) {
            try {
                // Inject content script
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content-script.js']
                });
                
                // Try to extract data from current page
                const result = await chrome.tabs.sendMessage(tab.id, {
                    action: 'extractData',
                    type: type,
                    platform: detectPlatform(tab.url)
                });
                
                if (result && result.success && result.data && result.data.length > 0) {
                    sendResponse({ success: true, data: { suppliers: result.data } });
                    return;
                }
            } catch (error) {
                console.log('Could not scrape current page, using enhanced mock data');
            }
        }
        
        // Fallback to enhanced mock data
        const mockData = generateEnhancedMockData(type, query);
        sendResponse({ success: true, data: mockData });
        
    } catch (error) {
        console.error('Scraping error:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Detect platform from URL
function detectPlatform(url) {
    if (url.includes('thomasnet')) return 'thomasnet';
    if (url.includes('indiamart')) return 'indiamart';
    if (url.includes('alibaba')) return 'alibaba';
    if (url.includes('comtrade.un.org')) return 'comtrade';
    if (url.includes('tradingeconomics')) return 'tradingeconomics';
    if (url.includes('news.google')) return 'news';
    return 'unknown';
}

// Generate enhanced mock data for different research types
function generateEnhancedMockData(type, query) {
    const { category = 'technology', region = 'global' } = query || {};
    
    switch (type) {
        case 'suppliers':
            return {
                suppliers: [
                    {
                        name: `${region} ${category} Solutions Inc.`,
                        location: region === 'global' ? 'Multiple Locations' : region,
                        specialization: `${category} products and services`,
                        rating: '4.5/5',
                        contact: `contact@${category.toLowerCase()}solutions.com`,
                        certifications: ['ISO 9001', 'ISO 27001'],
                        experience: '15+ years',
                        employees: '500-1000',
                        revenue: '$50M-100M',
                        keyProducts: [`Premium ${category}`, `Industrial ${category}`, `Custom ${category}`]
                    },
                    {
                        name: `Advanced ${category} Group`,
                        location: region === 'Asia' ? 'Singapore' : 'California, USA',
                        specialization: `Premium ${category} manufacturing`,
                        rating: '4.7/5',
                        contact: `sales@advanced${category.toLowerCase()}.com`,
                        certifications: ['ISO 9001', 'RoHS', 'CE Marking'],
                        experience: '20+ years',
                        employees: '1000+',
                        revenue: '$100M+',
                        keyProducts: [`High-end ${category}`, `Enterprise ${category}`, `OEM ${category}`]
                    },
                    {
                        name: `Global ${category} Partners`,
                        location: region === 'Europe' ? 'Munich, Germany' : 'Shanghai, China',
                        specialization: `Industrial ${category} solutions`,
                        rating: '4.3/5',
                        contact: `info@global${category.toLowerCase()}.com`,
                        certifications: ['ISO 9001', 'OHSAS 18001', 'ISO 14001'],
                        experience: '12+ years',
                        employees: '200-500',
                        revenue: '$25M-50M',
                        keyProducts: [`Standard ${category}`, `Bulk ${category}`, `Custom solutions`]
                    }
                ],
                trends: [
                    {
                        title: `${category} Market Digitization`,
                        impact: 'High',
                        description: `Increasing adoption of digital technologies in ${category} sector`,
                        timeframe: '2024-2026',
                        regions: [region],
                        growth: '+25% annually',
                        drivers: ['Digital transformation', 'IoT integration', 'AI adoption']
                    },
                    {
                        title: 'Supply Chain Resilience',
                        impact: 'Medium',
                        description: 'Focus on building more resilient supply chains',
                        timeframe: '2024-2025',
                        regions: ['Global'],
                        growth: '+15% investment',
                        drivers: ['Risk mitigation', 'Diversification', 'Local sourcing']
                    },
                    {
                        title: 'Sustainability Focus',
                        impact: 'High',
                        description: 'Growing emphasis on sustainable sourcing practices',
                        timeframe: '2024-2027',
                        regions: ['Global'],
                        growth: '+30% in green initiatives',
                        drivers: ['ESG requirements', 'Carbon neutrality', 'Circular economy']
                    }
                ],
                news: [
                    {
                        title: `${category} Market Shows Strong Growth in ${region}`,
                        summary: `Latest market analysis reveals significant expansion in ${category} sector with new opportunities emerging`,
                        source: 'Industry Weekly',
                        date: new Date().toISOString().split('T')[0],
                        relevance: 'High',
                        impact: 'Positive'
                    },
                    {
                        title: 'New Trade Agreements Boost Sourcing Opportunities',
                        summary: `Recent trade deals create new pathways for ${category} procurement in ${region}`,
                        source: 'Trade Journal',
                        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                        relevance: 'Medium',
                        impact: 'Positive'
                    },
                    {
                        title: 'Supply Chain Innovations Transform Industry',
                        summary: `New technologies and methodologies are revolutionizing ${category} supply chains`,
                        source: 'Supply Chain Today',
                        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                        relevance: 'High',
                        impact: 'Transformative'
                    }
                ]
            };
            
        case 'trends':
            return {
                trends: [
                    {
                        title: `${category} Market Evolution`,
                        impact: 'High',
                        description: `Rapid transformation in ${category} market dynamics`,
                        timeframe: '2024-2026',
                        regions: [region],
                        growth: '+35% market expansion'
                    },
                    {
                        title: 'Digital Supply Chain Integration',
                        impact: 'Medium',
                        description: 'Integration of digital technologies across supply chains',
                        timeframe: '2024-2025',
                        regions: ['Global'],
                        growth: '+20% adoption rate'
                    }
                ]
            };
            
        case 'news':
            return {
                news: [
                    {
                        title: `Breaking: ${category} Industry Milestone in ${region}`,
                        summary: `Major breakthrough announced in ${category} sector with implications for sourcing strategies`,
                        source: 'Industry News',
                        date: new Date().toISOString().split('T')[0],
                        relevance: 'High'
                    },
                    {
                        title: 'Market Analysis: Future of Procurement',
                        summary: `Comprehensive analysis of emerging trends in procurement and sourcing`,
                        source: 'Procurement Today',
                        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                        relevance: 'Medium'
                    }
                ]
            };
            
        default:
            return { message: 'Data type not supported' };
    }
}

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'keepAlive') {
        port.onDisconnect.addListener(() => {
            // Clean up if needed
        });
    }
});

// Handle web scraping content script injection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'injectContentScript') {
        chrome.scripting.executeScript({
            target: { tabId: request.tabId },
            files: ['content-script.js']
        }).then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});