chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "generateMessage",
        title: "Generate LinkedIn Outreach Message",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "generateMessage") {
        try {
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractLinkedInProfile
            });
            
            if (result.result) {
                const response = await fetch("http://127.0.0.1:5000/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ profileText: result.result })
                });
                
                const data = await response.json();
                
                // Send message to popup
                chrome.runtime.sendMessage({
                    type: "GENERATED_MESSAGE",
                    message: data.message
                });
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error generating message. Please try again.");
        }
    }
});

function extractLinkedInProfile() {
    // Extract profile name
    const nameElement = document.querySelector('.text-heading-xlarge');
    const name = nameElement ? nameElement.innerText.trim() : '';
    
    // Extract headline
    const headlineElement = document.querySelector('.text-body-medium');
    const headline = headlineElement ? headlineElement.innerText.trim() : '';
    
    // Extract about section
    const aboutElement = document.querySelector('.display-flex .pv-shared-text-with-see-more');
    const about = aboutElement ? aboutElement.innerText.trim() : '';
    
    // Extract experience
    const experienceElements = document.querySelectorAll('.experience-section .pv-entity__summary-info');
    const experience = Array.from(experienceElements).map(exp => exp.innerText.trim()).join('\n');
    
    // Combine all data
    const profileData = {
        name,
        headline,
        about,
        experience
    };
    
    return JSON.stringify(profileData);
}
