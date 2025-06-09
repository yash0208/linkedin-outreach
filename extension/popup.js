// Debug logging function
const debug = (msg, data) => {
    const log = `LinkedIn Extension Popup: ${msg}`;
    if (data) {
        console.log(log, data);
    } else {
        console.log(log);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const outputTextarea = document.getElementById('output');
    const copyButton = document.getElementById('copy');
    const generateButton = document.getElementById('generate');

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'GENERATED_MESSAGE') {
            outputTextarea.value = message.message;
            generateButton.textContent = 'Generate Message';
            generateButton.disabled = false;
            generateButton.classList.remove('loading');
        }
    });

    // Copy button functionality
    copyButton.addEventListener('click', function() {
        outputTextarea.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        copyButton.style.backgroundColor = '#28a745';
        copyButton.style.borderColor = '#28a745';
        
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '';
            copyButton.style.borderColor = '';
        }, 1500);
    });

    // Generate button functionality
    generateButton.addEventListener('click', async function() {
        try {
            generateButton.textContent = 'Generating';
            generateButton.classList.add('loading');
            generateButton.disabled = true;
            outputTextarea.value = 'Analyzing profile...';

            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Check if we're on LinkedIn
            if (!tab.url.includes('linkedin.com/in/')) {
                throw new Error('Please navigate to a LinkedIn profile page first.');
            }

            // Send message to content script
            const result = await new Promise((resolve) => {
                chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_PROFILE' }, (response) => {
                    resolve(response);
                });
            });

            if (!result || !result.result) {
                let debugMsg = '';
                if (result === undefined) {
                    debugMsg = 'No response from content script. Is content.js loaded on this page?';
                } else if (result && result.error) {
                    debugMsg = `Content script error: ${result.error}`;
                } else {
                    debugMsg = 'Profile data is empty or null.';
                }
                throw new Error(`Could not extract profile data. ${debugMsg}`);
            }

            outputTextarea.value = 'Generating message...';

            const response = await fetch("http://127.0.0.1:5000/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ profileText: result.result })
            });

            if (!response.ok) {
                throw new Error('Failed to connect to the message generation service. Please make sure the server is running.');
            }

            const data = await response.json();
            if (!data.message) {
                throw new Error('Invalid response from the server.');
            }

            outputTextarea.value = data.message;
        } catch (error) {
            outputTextarea.value = `Error: ${error.message}\n\nDebug steps:\n1. Open Chrome DevTools (⌘ + Option + I)\n2. Check Console for detailed logs\n3. Make sure you are on a LinkedIn profile page\n4. Refresh the page and try again`;
        } finally {
            generateButton.textContent = 'Generate Message';
            generateButton.disabled = false;
            generateButton.classList.remove('loading');
        }
    });
});

// Function to extract LinkedIn profile data
function extractLinkedInProfile() {
    try {
        console.log('Starting profile extraction...');
        
        // Check if we're on a LinkedIn profile page
        if (!window.location.href.includes('linkedin.com/in/')) {
            console.log('Not on LinkedIn profile page');
            return null;
        }

        // Wait for the profile to load
        const profileCard = document.querySelector('.pv-top-card');
        if (!profileCard) {
            console.log('Profile card not found');
            return null;
        }

        console.log('Profile card found, extracting data...');

        // Extract profile name - try multiple possible selectors
        const nameSelectors = [
            '.text-heading-xlarge',
            '.pv-top-card--list li.inline',
            'h1.text-heading-xlarge',
            '.pv-top-card h1',
            'h1'
        ];
        let name = '';
        for (const selector of nameSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                name = element.innerText.trim();
                console.log('Found name:', name);
                break;
            }
        }

        // Extract headline - try multiple possible selectors
        const headlineSelectors = [
            '.text-body-medium',
            '.pv-top-card--list-bullet',
            '.pv-top-card__headline',
            '.text-body-medium.break-words',
            '.pv-text-details__left-panel .text-body-medium'
        ];
        let headline = '';
        for (const selector of headlineSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                headline = element.innerText.trim();
                console.log('Found headline:', headline);
                break;
            }
        }

        // Extract about section - try multiple possible selectors
        const aboutSelectors = [
            '.display-flex .pv-shared-text-with-see-more',
            '.pv-shared-text-with-see-more',
            '.pv-about__summary-text',
            '.pv-about-section .pv-shared-text-with-see-more',
            '#about + .pv-shared-text-with-see-more'
        ];
        let about = '';
        for (const selector of aboutSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                about = element.innerText.trim();
                console.log('Found about section');
                break;
            }
        }

        // Extract experience - try multiple possible selectors
        const experienceSelectors = [
            '.experience-section .pv-entity__summary-info',
            '.pv-experience-section .pv-entity__summary-info',
            '.experience-section__list-item',
            '.pv-experience-section__list-item',
            '#experience-section .pv-entity__summary-info'
        ];
        let experience = '';
        for (const selector of experienceSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                experience = Array.from(elements).map(exp => exp.innerText.trim()).join('\n');
                console.log('Found experience section');
                break;
            }
        }

        // If we couldn't find any data, try getting the entire profile content
        if (!name && !headline && !about && !experience) {
            console.log('No specific data found, getting raw content');
            const profileContent = document.querySelector('.pv-top-card');
            if (profileContent) {
                return JSON.stringify({
                    rawContent: profileContent.innerText,
                    url: window.location.href
                });
            }
            return null;
        }

        // Combine all data
        const profileData = {
            name,
            headline,
            about,
            experience,
            url: window.location.href
        };

        console.log('Successfully extracted profile data');
        return JSON.stringify(profileData);
    } catch (error) {
        console.error('Error extracting profile:', error);
        return null;
    }
}
