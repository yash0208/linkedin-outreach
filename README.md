# LinkedIn Outreach Message Generator

A Chrome extension that helps you craft personalized LinkedIn outreach messages using AI. The extension analyzes LinkedIn profiles and generates tailored messages that emphasize learning opportunities and professional growth.

![Extension Preview](extension/icon.png)

## Features

- 🔍 Automatic LinkedIn profile analysis
- ✍️ AI-powered message generation
- 🎯 Personalized outreach messages
- 🎨 Modern dark-themed UI
- 📋 One-click message copying
- ⚡ Quick and efficient workflow

## Prerequisites

- Python 3.9 or higher
- Chrome browser
- NVIDIA API key (for AI message generation)

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/linkedin-outreach-extension.git
cd linkedin-outreach-extension
```

2. Install Python dependencies:
```bash
pip install flask flask-cors python-dotenv openai
```

3. Create a `.env` file in the `backend` directory:
```
NVIDIA_API_KEY=your_nvidia_api_key_here
```

4. Start the Flask server:
```bash
cd backend
python app.py
```

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` directory from the project
4. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to any LinkedIn profile page
2. Click the extension icon in your Chrome toolbar
3. Click "Generate Message" to analyze the profile and create a personalized message
4. Review the generated message
5. Click "Copy" to copy the message to your clipboard
6. Paste the message into LinkedIn's messaging interface

## Project Structure

```
linkedin-outreach-extension/
├── backend/
│   ├── app.py              # Flask server
│   ├── outreach_generator.py # Message generation logic
│   ├── resume             # Your resume text
│   └── my_profile         # Your LinkedIn profile text
├── extension/
│   ├── manifest.json      # Extension configuration
│   ├── popup.html         # Extension UI
│   ├── popup.js           # UI logic
│   ├── content.js         # Profile extraction logic
│   └── background.js      # Background processes
└── README.md
```

## Customization

### Message Style

You can customize the message generation style by modifying the prompt in `backend/outreach_generator.py`. The current prompt is configured to:
- Generate concise messages (around 100 words)
- Focus on learning opportunities
- Maintain a professional yet friendly tone
- Reference specific details from the target's profile

### UI Customization

The extension's UI can be customized by modifying:
- `extension/popup.html` for structure and styling
- `extension/popup.js` for interaction logic

## Troubleshooting

1. **Extension not working:**
   - Ensure the Flask server is running
   - Check if you're on a LinkedIn profile page
   - Verify the extension is enabled in Chrome

2. **Message generation fails:**
   - Check your NVIDIA API key in the `.env` file
   - Ensure your resume and profile files exist in the backend directory
   - Check the browser console for error messages

3. **CORS errors:**
   - Verify the Flask server is running
   - Check if flask-cors is properly installed
   - Restart the Flask server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull 

## Acknowledgments

- LinkedIn for their platform
- NVIDIA for their AI capabilities
- Flask for the backend framework
- Chrome Extension API for the browser integration
