# LinkedIn Message Generator Chrome Extension

A Chrome extension that helps you generate personalized LinkedIn messages for different networking scenarios. The extension uses AI to create contextually relevant messages based on the target profile and your background.

## Features

### 1. Connection Request Generator
- Generates personalized connection request messages
- Analyzes the target profile to create relevant content
- Ensures messages are within LinkedIn's character limit
- Maintains a professional yet personal tone

### 2. Referral Request Generator
- Creates tailored referral request messages
- Incorporates job description details
- Highlights relevant experience and skills
- Makes a compelling case for referral consideration

### 3. Recruiter Message Generator
- Generates messages for reaching out to recruiters
- Emphasizes relevant experience and skills
- Expresses interest in opportunities
- Maintains a professional and engaging tone

## Setup

### Prerequisites
- Python 3.7+
- Chrome browser
- NVIDIA API key (for AI message generation)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd linkedin-outreach-extension
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:
   ```
   NVIDIA_API_KEY=your_api_key_here
   ```

4. Create the following files in the root directory:
   - `resume`: Your resume text
   - `my_profile`: Your LinkedIn profile text
   - `job_description`: The job description for referral requests

5. Start the Flask server:
   ```bash
   python backend/app.py
   ```

### Extension Setup
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` directory
4. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to any LinkedIn profile page
2. Click the extension icon in your Chrome toolbar
3. Choose the type of message you want to generate:
   - Connection Request: For new connections
   - Referral Request: For job referrals
   - Recruiter Message: For reaching out to recruiters
4. Click the "Generate" button for your chosen message type
5. Review the generated message
6. Click "Copy" to copy the message to your clipboard
7. Paste the message into LinkedIn

## Message Types

### Connection Request
- Personalized greeting
- Reference to specific profile details
- Connection between backgrounds
- Professional interest
- Request to connect

### Referral Request
- Personalized introduction
- Reference to job opportunity
- Relevant experience highlights
- Clear request for referral
- Professional closing

### Recruiter Message
- Professional introduction
- Interest in opportunities
- Relevant experience summary
- Call to action
- Professional closing

## Development

### Project Structure
```
linkedin-outreach-extension/
├── backend/
│   ├── app.py
│   ├── outreach_generator.py
│   ├── generate_referral_prompt.py
│   └── generate_recruiter_prompt.py
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js
│   └── vendor/
│       ├── bootstrap.min.css
│       ├── bootstrap.bundle.min.js
│       └── inter.css
├── .env
├── resume
├── my_profile
├── job_description
└── README.md
```

### Adding New Features
1. Add new endpoint in `backend/app.py`
2. Create corresponding prompt generator in backend
3. Update frontend UI in `popup.html`
4. Add functionality in `popup.js`

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support
For support, please [create an issue](repository-issues-url) in the repository.
