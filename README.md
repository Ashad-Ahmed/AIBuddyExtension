# AI Buddy - Strategic Sourcing Assistant

A powerful Chrome extension designed specifically for Category Managers and Strategic Sourcing professionals in Telecom MNCs. AI Buddy combines AI-powered assistance with real-time market research capabilities to streamline procurement workflows.

![AI Buddy Logo](./demo-images/logo-banner.png)

## Overview

AI Buddy is an intelligent Chrome extension that serves as your personal Strategic Sourcing assistant. It features multiple specialized modes, real-time web scraping for market research, task management, and seamless integration with the Groq API for advanced AI capabilities.

## Key Features

### Multi-Mode AI Assistant
- **ChatBot Mode**: General AI assistance for procurement questions
- **Task Analyzer**: Prioritize and analyze procurement tasks using proven frameworks
- **Market Researcher**: Real-time supplier discovery and market intelligence
- **Strategy Assistant**: Category strategy development with strategic frameworks

### Advanced Market Research
- Real-time web scraping from major supplier databases
- Automated market trend analysis
- News aggregation and relevance scoring
- Comprehensive supplier intelligence reports

### Task Management
- Integrated task management system
- Task completion tracking and statistics
- AI-aware task context for better assistance

### Flexible Interface
- Sidebar mode for multitasking while browsing
- Full-screen webapp mode for focused work sessions
- Responsive design optimized for productivity

## Screenshots

### Main Interface
![Main Interface](./demo-images/main-interface.png)

### Mode Selection Dropdown
![Mode Selection](./demo-images/mode-selection.png)

### Market Research Results
![Market Research](./demo-images/market-research.png)

### Task Management
![Task Management](./demo-images/task-management.png)

### Settings Page
![Settings](./demo-images/settings-page.png)

### Full-Screen Mode
![Full-Screen Mode](./demo-images/fullscreen-mode.png)

## Installation

### Prerequisites
- Google Chrome browser (version 88 or higher)
- Groq API key (free at [console.groq.com](https://console.groq.com/keys))

### Steps
1. **Download the Extension**
   ```bash
   git clone https://github.com/your-username/ai-buddy-extension.git
   cd ai-buddy-extension
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension folder
   - The AI Buddy icon should appear in your Chrome toolbar

3. **Configure API Key**
   - Click the AI Buddy icon in the toolbar
   - Click the Settings button (gear icon)
   - Enter your Groq API key
   - Customize the system prompt if desired
   - Click "Save Settings"

![Installation Guide](./demo-images/installation-steps.png)

## Configuration

### API Setup
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create a free account
3. Generate an API key
4. Add the key to AI Buddy settings

### System Prompt Customization
The default system prompt is optimized for Strategic Sourcing professionals, but you can customize it for your specific needs:

```
You are a helpful AI assistant for Strategic Sourcing professionals. 
Provide clear, accurate, and helpful responses to procurement and sourcing questions. 
Be concise but comprehensive in your answers.
```

## Usage Guide

### Getting Started
1. **Open AI Buddy**: Click the extension icon or use the sidebar
2. **Select Mode**: Choose from the dropdown menu based on your task
3. **Start Chatting**: Ask questions in natural language
4. **Switch Modes**: Change modes as needed for different tasks

### Mode-Specific Usage

#### ChatBot Mode
- General procurement questions
- Best practices and guidance
- Quick answers and explanations

**Example queries:**
- "What is the Kraljic Matrix?"
- "How do I negotiate with suppliers?"
- "Explain TCO analysis"

#### Task Analyzer Mode
- Task prioritization using proven frameworks
- Efficiency improvement recommendations
- Resource allocation guidance

**Example queries:**
- "Help me prioritize my procurement tasks"
- "Analyze my workload for this week"
- "What should I focus on first?"

#### Market Researcher Mode
- Supplier discovery and research
- Market trend analysis
- Competitive intelligence

**Example queries:**
- "Research suppliers for telecom equipment in Asia"
- "Find electronics manufacturers in Germany"
- "What are the latest trends in IT procurement?"

#### Strategy Assistant Mode
- Category strategy development
- Framework-based analysis
- Strategic recommendations

**Example queries:**
- "Help me develop a category strategy for IT services"
- "Perform a SWOT analysis for our telecom suppliers"
- "Create a sourcing strategy for network equipment"

### Task Management
1. **Add Tasks**: Click the Tasks button and add new items
2. **Manage Tasks**: Check off completed items, delete unnecessary ones
3. **AI Integration**: Ask the AI about your tasks for prioritization help

![Usage Examples](./demo-images/usage-examples.png)

## Technical Architecture

### Core Components
- **Manifest V3**: Modern Chrome extension architecture
- **Service Worker**: Background processing and API management
- **Content Scripts**: Web scraping and data extraction
- **Side Panel API**: Integrated sidebar experience
- **Chrome Storage**: Settings and task persistence

### Supported Websites for Scraping
- **ThomasNet.com**: Industrial supplier directory
- **IndiaMART.com**: Indian B2B marketplace
- **Alibaba.com**: Global trade platform
- **UN Comtrade**: International trade statistics
- **Trading Economics**: Economic indicators
- **Google News**: Market news and trends

### AI Integration
- **Groq API**: Llama 3.3 70B Versatile model
- **Context Awareness**: Task-aware conversations
- **Mode-Specific Prompts**: Specialized responses per mode
- **Real-time Processing**: Instant AI responses

## Privacy & Security

### Data Handling
- **Local Storage**: Tasks and settings stored locally
- **No Data Collection**: Extension doesn't collect personal data
- **API Security**: Groq API key encrypted in Chrome storage
- **Minimal Permissions**: Only necessary Chrome permissions requested

### Permissions Used
- `storage`: Save settings and tasks
- `activeTab`: Access current tab for scraping
- `sidePanel`: Sidebar functionality
- `scripting`: Content script injection
- `host_permissions`: Access to research websites

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Clone the repository
2. Make your changes
3. Test thoroughly in Chrome
4. Submit a pull request

### Reporting Issues
- Use the [GitHub Issues](https://github.com/your-username/ai-buddy-extension/issues) page
- Provide detailed reproduction steps
- Include Chrome version and extension version

## Roadmap

### Upcoming Features
- [ ] Export market research reports to PDF
- [ ] Integration with more supplier databases
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Custom framework templates
- [ ] Automated supplier scoring
- [ ] Integration with procurement systems

### Version History
- **v2.0.0**: Strategic Sourcing features, market research, multi-mode interface
- **v1.0.0**: Basic chatbot functionality with task management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Groq**: For providing the powerful Llama 3.3 70B model
- **Chrome Extensions Team**: For the excellent APIs and documentation
- **Strategic Sourcing Community**: For feedback and feature requests

## Support

### Getting Help
- **Documentation**: Check this README and inline help
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/ai-buddy-extension/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/your-username/ai-buddy-extension/discussions)

### Contact
- **Email**: support@ai-buddy-extension.com
- **Website**: [ai-buddy-extension.com](https://ai-buddy-extension.com)
- **LinkedIn**: [AI Buddy Extension](https://linkedin.com/company/ai-buddy-extension)

---

![Footer Banner](./demo-images/footer-banner.png)
