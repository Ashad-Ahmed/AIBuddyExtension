// Content script for web scraping functionality

// Market research data extraction functions
const MarketResearcher = {
    // Extract supplier data from various platforms
    extractSupplierData(platform) {
        switch (platform) {
            case 'thomasnet':
                return this.extractThomasNetData();
            case 'indiamart':
                return this.extractIndiaMartData();
            case 'alibaba':
                return this.extractAlibabaData();
            default:
                return null;
        }
    },

    // Extract data from ThomasNet
    extractThomasNetData() {
        const suppliers = [];
        const supplierElements = document.querySelectorAll('.supplier-card, .company-card');
        
        supplierElements.forEach(element => {
            const name = element.querySelector('.company-name, .supplier-name')?.textContent?.trim();
            const location = element.querySelector('.location, .address')?.textContent?.trim();
            const description = element.querySelector('.description, .summary')?.textContent?.trim();
            
            if (name) {
                suppliers.push({
                    name,
                    location: location || 'Location not specified',
                    description: description || 'No description available',
                    source: 'ThomasNet'
                });
            }
        });
        
        return suppliers;
    },

    // Extract data from IndiaMART
    extractIndiaMartData() {
        const suppliers = [];
        const supplierElements = document.querySelectorAll('.company-details, .seller-info');
        
        supplierElements.forEach(element => {
            const name = element.querySelector('.company-name, .seller-name')?.textContent?.trim();
            const location = element.querySelector('.location, .city')?.textContent?.trim();
            const products = element.querySelector('.products, .categories')?.textContent?.trim();
            
            if (name) {
                suppliers.push({
                    name,
                    location: location || 'India',
                    specialization: products || 'Various products',
                    source: 'IndiaMART'
                });
            }
        });
        
        return suppliers;
    },

    // Extract data from Alibaba
    extractAlibabaData() {
        const suppliers = [];
        const supplierElements = document.querySelectorAll('.supplier-card, .company-info');
        
        supplierElements.forEach(element => {
            const name = element.querySelector('.company-name, .supplier-name')?.textContent?.trim();
            const location = element.querySelector('.country, .location')?.textContent?.trim();
            const yearsInBusiness = element.querySelector('.years, .experience')?.textContent?.trim();
            
            if (name) {
                suppliers.push({
                    name,
                    location: location || 'China',
                    experience: yearsInBusiness || 'Not specified',
                    source: 'Alibaba'
                });
            }
        });
        
        return suppliers;
    },

    // Extract trade data from UN Comtrade
    extractTradeData() {
        const tradeData = [];
        const dataRows = document.querySelectorAll('table tr, .data-row');
        
        dataRows.forEach(row => {
            const commodity = row.querySelector('.commodity, .product')?.textContent?.trim();
            const value = row.querySelector('.value, .amount')?.textContent?.trim();
            const country = row.querySelector('.country, .partner')?.textContent?.trim();
            
            if (commodity && value) {
                tradeData.push({
                    commodity,
                    value,
                    country: country || 'Not specified',
                    source: 'UN Comtrade'
                });
            }
        });
        
        return tradeData;
    },

    // Extract economic data from Trading Economics
    extractEconomicData() {
        const economicData = [];
        const indicators = document.querySelectorAll('.indicator, .economic-data');
        
        indicators.forEach(indicator => {
            const name = indicator.querySelector('.indicator-name, .title')?.textContent?.trim();
            const value = indicator.querySelector('.value, .current')?.textContent?.trim();
            const change = indicator.querySelector('.change, .variation')?.textContent?.trim();
            
            if (name && value) {
                economicData.push({
                    indicator: name,
                    value,
                    change: change || 'No change data',
                    source: 'Trading Economics'
                });
            }
        });
        
        return economicData;
    },

    // Extract news headlines from Google News
    extractNewsData() {
        const newsItems = [];
        const articles = document.querySelectorAll('article, .news-item, .story');
        
        articles.forEach(article => {
            const headline = article.querySelector('h3, .headline, .title')?.textContent?.trim();
            const summary = article.querySelector('.summary, .description')?.textContent?.trim();
            const source = article.querySelector('.source, .publisher')?.textContent?.trim();
            const date = article.querySelector('.date, .timestamp')?.textContent?.trim();
            
            if (headline) {
                newsItems.push({
                    headline,
                    summary: summary || 'No summary available',
                    source: source || 'Unknown source',
                    date: date || 'Date not specified'
                });
            }
        });
        
        return newsItems;
    }
};

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
        const { type, platform } = request;
        let extractedData = null;
        
        try {
            switch (type) {
                case 'suppliers':
                    extractedData = MarketResearcher.extractSupplierData(platform);
                    break;
                case 'trade':
                    extractedData = MarketResearcher.extractTradeData();
                    break;
                case 'economic':
                    extractedData = MarketResearcher.extractEconomicData();
                    break;
                case 'news':
                    extractedData = MarketResearcher.extractNewsData();
                    break;
                default:
                    throw new Error('Unsupported data extraction type');
            }
            
            sendResponse({ success: true, data: extractedData });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    
    return true; // Keep message channel open
});

// Auto-detect page type and extract relevant data
function autoDetectAndExtract() {
    const hostname = window.location.hostname.toLowerCase();
    let detectedType = null;
    let platform = null;
    
    if (hostname.includes('thomasnet')) {
        detectedType = 'suppliers';
        platform = 'thomasnet';
    } else if (hostname.includes('indiamart')) {
        detectedType = 'suppliers';
        platform = 'indiamart';
    } else if (hostname.includes('alibaba')) {
        detectedType = 'suppliers';
        platform = 'alibaba';
    } else if (hostname.includes('comtrade.un.org')) {
        detectedType = 'trade';
    } else if (hostname.includes('tradingeconomics')) {
        detectedType = 'economic';
    } else if (hostname.includes('news.google')) {
        detectedType = 'news';
    }
    
    if (detectedType) {
        // Notify the extension that relevant data is available
        chrome.runtime.sendMessage({
            action: 'dataAvailable',
            type: detectedType,
            platform: platform,
            url: window.location.href
        });
    }
}

// Run auto-detection when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoDetectAndExtract);
} else {
    autoDetectAndExtract();
}