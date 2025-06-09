// Debug logging
const debug = (msg, data) => {
    const log = `LinkedIn Content Script: ${msg}`;
    if (data) {
        console.log(log, data);
    } else {
        console.log(log);
    }
};

// Log when script loads
debug('Content script loaded');
debug('Current URL:', window.location.href);

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    debug('Received message:', request);
    
    if (request.type === 'EXTRACT_PROFILE') {
        try {
            debug('Starting profile extraction');
            const data = extractLinkedInProfile();
            debug('Extraction result:', data);
            sendResponse({ result: data });
        } catch (error) {
            debug('Extraction error:', error);
            sendResponse({ error: error.message });
        }
    }
    return true; // Keep message channel open
});

function extractLinkedInProfile() {
    try {
        debug('Checking page elements');
        
        // Get profile sections
        const name = document.querySelector('h1')?.innerText?.trim() || '';
        debug('Name found:', name);
        
        const headline = document.querySelector('div.text-body-medium')?.innerText?.trim() || '';
        debug('Headline found:', headline);
        
        const about = document.querySelector('.display-flex .pv-shared-text-with-see-more')?.innerText?.trim() || '';
        debug('About found:', about ? 'Yes' : 'No');
        
        const experience = Array.from(document.querySelectorAll('.experience-section .pvs-list__outer-container .pvs-entity'))
            .map(exp => exp.innerText.trim())
            .join('\n');
        debug('Experience found:', experience ? 'Yes' : 'No');

        // If we found any data
        if (name || headline || about || experience) {
            const profileData = {
                name,
                headline,
                about,
                experience,
                url: window.location.href
            };
            debug('Successfully extracted data');
            return JSON.stringify(profileData);
        }
        
        // Fallback: get raw profile content
        debug('No specific data found, getting raw content');
        const rawContent = document.querySelector('.pv-top-card')?.innerText;
        return rawContent ? JSON.stringify({
            rawContent,
            url: window.location.href
        }) : null;
        
    } catch (error) {
        debug('Error in extraction:', error);
        return null;
    }
}