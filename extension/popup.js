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
    // DOM Elements
    const elements = {
        output: {
            textarea: document.getElementById('output'),
            generate: document.getElementById('generate'),
            copy: document.getElementById('copy')
        },
        referral: {
            textarea: document.getElementById('referral-output'),
            generate: document.getElementById('generate-referral'),
            copy: document.getElementById('copy-referral')
        },
        recruiter: {
            textarea: document.getElementById('recruiter-output'),
            generate: document.getElementById('generate-recruiter'),
            copy: document.getElementById('copy-recruiter')
        }
    };

    // Helper Functions
    const copyToClipboard = (textarea, button) => {
        textarea.select();
        document.execCommand('copy');
        
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 1500);
    };

    const setLoading = (button, isLoading) => {
        button.textContent = isLoading ? 'Generating' : button.textContent.replace('Generating', 'Generate Message');
        button.classList.toggle('loading', isLoading);
        button.disabled = isLoading;
    };

    const generateMessage = async (endpoint, textarea, button) => {
        try {
            setLoading(button, true);
            textarea.value = 'Analyzing profile...';

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab.url.includes('linkedin.com/in/')) {
                throw new Error('Please navigate to a LinkedIn profile page first.');
            }

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

            textarea.value = 'Generating message...';

            const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
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

            textarea.value = data.message;
        } catch (error) {
            textarea.value = `Error: ${error.message}\n\nDebug steps:\n1. Open Chrome DevTools (⌘ + Option + I)\n2. Check Console for detailed logs\n3. Make sure you are on a LinkedIn profile page\n4. Refresh the page and try again`;
        } finally {
            setLoading(button, false);
        }
    };

    // Event Listeners
    elements.output.copy.addEventListener('click', () => copyToClipboard(elements.output.textarea, elements.output.copy));
    elements.referral.copy.addEventListener('click', () => copyToClipboard(elements.referral.textarea, elements.referral.copy));
    elements.recruiter.copy.addEventListener('click', () => copyToClipboard(elements.recruiter.textarea, elements.recruiter.copy));

    elements.output.generate.addEventListener('click', () => generateMessage('generate', elements.output.textarea, elements.output.generate));
    elements.referral.generate.addEventListener('click', () => generateMessage('generate-referral', elements.referral.textarea, elements.referral.generate));
    elements.recruiter.generate.addEventListener('click', () => generateMessage('generate-recruiter-message', elements.recruiter.textarea, elements.recruiter.generate));
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
