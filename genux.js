/*
 * GenUX.js
 * A library to add AI-powered generative UI features to any website.
 * Version: 2.2.0
 * Author: Your Name
 * License: MIT
 */

(function() {
    // --- Configuration ---
    const GEMINI_API_KEY = "AIzaSyBrNjwlC0j9IJsDt7gevLu6C4Wc-b8WIWE";
    const STORAGE_KEY = 'GenUX-GeneratedFeatures';

    /**
     * Initializes the GenUX functionality on the page.
     */
    function initializeGenUX() {
        console.log("GenUX Initializing...");
        injectGlobalStyles();
        createFloatingButton();
        loadAndApplySavedCode();
    }

    /**
     * Injects all necessary CSS for the UI components into the document head.
     */
    function injectGlobalStyles() {
        if (document.getElementById("genux-global-styles")) return;
        const styleSheet = document.createElement("style");
        styleSheet.id = "genux-global-styles";
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            :root {
                --genux-primary: #4545C4;
                --genux-primary-light: rgba(161, 140, 209, 0.2);
                --genux-dark-bg: #131314;
                --genux-card-bg: #1f1f21;
                --genux-light-text: #e3e3e3;
                --genux-mid-text: #9aa0a6;
                --genux-border: #373739;
                --genux-hover-bg: rgba(255, 255, 255, 0.04);
            }

            /* Keyframe Animations */
            @keyframes genux-glow-pulse {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(161, 140, 209, 0.3),
                                0 0 40px rgba(161, 140, 209, 0.1),
                                0 0 60px rgba(161, 140, 209, 0.05);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(161, 140, 209, 0.5),
                                0 0 60px rgba(161, 140, 209, 0.2),
                                0 0 80px rgba(161, 140, 209, 0.1);
                }
            }
            
            @keyframes genux-border-flow {
                0% { 
                    background-position: 0% 50%;
                    filter: hue-rotate(0deg);
                }
                50% {
                    filter: hue-rotate(45deg);
                }
                100% { 
                    background-position: 200% 50%;
                    filter: hue-rotate(0deg);
                }
            }
            
            @keyframes genux-fade-in {
                from { 
                    opacity: 0; 
                    transform: scale(0.95) translateY(20px);
                    filter: blur(10px);
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0);
                    filter: blur(0px);
                }
            }
            
            @keyframes genux-fade-out {
                from { 
                    opacity: 1; 
                    transform: scale(1) translateY(0);
                    filter: blur(0px);
                }
                to { 
                    opacity: 0; 
                    transform: scale(0.95) translateY(20px);
                    filter: blur(10px);
                }
            }
            
            @keyframes genux-fab-fade-in {
                from { opacity: 0; transform: scale(0.8) rotate(-10deg); }
                to { opacity: 1; transform: scale(1) rotate(0deg); }
            }

            @keyframes genux-typing-dots {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-10px); opacity: 1; }
            }

            /* --- Floating Action Button --- */
            #genux-fab {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 56px;
                height: 56px;
                border: none;
                border-radius: 16px;
                cursor: pointer;
                z-index: 9999;
                padding: 0;
                background: linear-gradient(135deg, var(--genux-primary), #8a73b5);
                animation: genux-fab-fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 8px 25px rgba(161, 140, 209, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
            }
            
            #genux-fab:hover {
                transform: scale(1.05) translateY(-2px);
                box-shadow: 0 12px 35px rgba(161, 140, 209, 0.4);
                animation: genux-glow-pulse 2s ease-in-out infinite;
            }
            
            #genux-fab:active {
                transform: scale(0.95);
                transition: transform 0.1s;
            }

            /* --- Modal --- */
            .genux-modal-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            }
            
            #genux-modal {
                position: relative;
                width: 100%;
                max-width: 900px;
                background: var(--genux-card-bg);
                border-radius: 24px;
                padding: 3px;
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
                animation: genux-fade-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                color: var(--genux-light-text);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Google Sans', sans-serif;
                overflow: hidden;
            }
            
            #genux-modal::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(45deg, 
                    rgba(161, 140, 209, 0.6), 
                    rgba(132, 250, 176, 0.4), 
                    rgba(143, 211, 244, 0.5), 
                    rgba(250, 208, 196, 0.4),
                    rgba(161, 140, 209, 0.6));
                background-size: 300% 300%;
                border-radius: 24px;
                animation: genux-border-flow 4s ease-in-out infinite;
                z-index: -1;
            }
            
            #genux-modal-content-wrapper {
                background: var(--genux-card-bg);
                border-radius: 21px;
                display: flex;
                min-height: 500px;
                position: relative;
                z-index: 1;
            }
            
            #genux-modal-main {
                width: 60%;
                padding: 32px;
                border-right: 1px solid var(--genux-border);
                display: flex;
                flex-direction: column;
            }
            
            #genux-modal-sidebar {
                width: 40%;
                padding: 32px;
                display: flex;
                flex-direction: column;
                background: rgba(255, 255, 255, 0.02);
            }
            
            #genux-modal-header { 
                display: flex; 
                align-items: center; 
                gap: 12px; 
                margin-bottom: 8px; 
            }
            
            #genux-modal-header .genux-logo { 
                font-size: 24px; 
                color: var(--genux-primary);
                filter: drop-shadow(0 0 8px rgba(161, 140, 209, 0.3));
            }
            
            #genux-modal-header h2 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 600; 
                color: white;
                background: linear-gradient(135deg, #ffffff, #e3e3e3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .genux-subtitle {
                margin: 0 0 24px 0; 
                color: var(--genux-mid-text); 
                font-size: 14px;
                line-height: 1.4;
            }
            
            #genux-prompt-container { 
                position: relative; 
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }
            
            #genux-prompt {
                width: 100%; 
                flex-grow: 1;
                min-height: 120px;
                padding: 20px; 
                padding-right: 60px; 
                border-radius: 16px;
                border: 1px solid var(--genux-border); 
                background: rgba(255, 255, 255, 0.02);
                color: var(--genux-light-text);
                font-size: 15px; 
                box-sizing: border-box; 
                resize: none;
                transition: all 0.3s ease;
                font-family: inherit;
                line-height: 1.5;
            }
            
            #genux-prompt:focus { 
                outline: none; 
                border-color: var(--genux-primary); 
                background: rgba(161, 140, 209, 0.05);
                box-shadow: 0 0 0 3px var(--genux-primary-light),
                           0 8px 25px rgba(161, 140, 209, 0.1);
            }
            
            #genux-prompt::placeholder {
                color: var(--genux-mid-text);
            }
            
            #genux-generate-btn {
                position: absolute; 
                bottom: 16px; 
                right: 16px; 
                width: 40px; 
                height: 40px;
                border-radius: 12px; 
                border: none; 
                background: linear-gradient(135deg, var(--genux-primary), #8a73b5);
                color: white;
                cursor: pointer; 
                font-size: 16px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 4px 12px rgba(161, 140, 209, 0.3);
            }
            
            #genux-generate-btn:hover { 
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(161, 140, 209, 0.4);
            }
            
            #genux-generate-btn:active {
                transform: scale(0.95);
            }
            
            #genux-modal-actions { 
                margin-top: 20px; 
                display: flex; 
                justify-content: space-between;
                align-items: center;
            }
            
            .genux-shortcut-hint {
                font-size: 12px;
                color: var(--genux-mid-text);
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .genux-key {
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
            }
            
            #genux-modal-actions .genux-action-buttons {
                display: flex;
                gap: 12px;
            }
            
            #genux-modal-actions button {
                padding: 10px 16px; 
                border-radius: 10px; 
                border: none; 
                font-size: 14px; 
                cursor: pointer;
                background: transparent; 
                color: var(--genux-mid-text); 
                transition: all 0.2s ease;
                font-weight: 500;
            }
            
            #genux-modal-actions button:hover { 
                color: white; 
                background: var(--genux-hover-bg);
                transform: translateY(-1px);
            }
            
            #genux-clear-btn { 
                color: #ff8a80; 
            }
            
            #genux-clear-btn:hover { 
                background: rgba(255, 138, 128, 0.1); 
                color: #ff5252; 
            }
            
            #genux-loader { 
                display: none; 
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center; 
                color: var(--genux-light-text);
                background: rgba(19, 19, 20, 0.95);
                backdrop-filter: blur(10px);
                padding: 32px;
                border-radius: 16px;
                border: 1px solid var(--genux-border);
            }
            
            .genux-typing-indicator {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 4px;
                margin-bottom: 16px;
            }
            
            .genux-typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--genux-primary);
                animation: genux-typing-dots 1.4s ease-in-out infinite;
            }
            
            .genux-typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .genux-typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            /* --- Feature List --- */
            #genux-features-list-container { 
                flex-grow: 1; 
                display: flex; 
                flex-direction: column; 
                min-height: 0; 
            }
            
            #genux-features-list-container h3 { 
                margin: 0 0 16px 0; 
                font-size: 16px; 
                color: white;
                font-weight: 600;
            }
            
            #genux-features-list {
                flex-grow: 1; 
                overflow-y: auto; 
                list-style: none; 
                padding: 0; 
                margin: 0;
            }
            
            #genux-features-list::-webkit-scrollbar { 
                width: 6px; 
            }
            
            #genux-features-list::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #genux-features-list::-webkit-scrollbar-thumb { 
                background: var(--genux-border); 
                border-radius: 6px; 
            }
            
            #genux-features-list::-webkit-scrollbar-thumb:hover {
                background: var(--genux-mid-text);
            }
            
            .genux-feature-item {
                background: rgba(255, 255, 255, 0.03); 
                border: 1px solid var(--genux-border);
                border-radius: 12px; 
                padding: 16px;
                margin-bottom: 12px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            
            .genux-feature-item:hover {
                background: rgba(255, 255, 255, 0.06);
                border-color: var(--genux-primary);
                transform: translateY(-1px);
            }
            
            .genux-feature-item p { 
                margin: 0; 
                font-size: 13px; 
                color: var(--genux-light-text); 
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis;
                line-height: 1.4;
            }
            
            .genux-feature-item button {
                background: transparent; 
                border: none; 
                color: var(--genux-mid-text); 
                cursor: pointer;
                font-size: 14px; 
                padding: 8px; 
                border-radius: 8px; 
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .genux-feature-item button:hover { 
                background: rgba(255, 138, 128, 0.1);
                color: #ff5252;
                transform: scale(1.1);
            }
            
            .genux-empty-state {
                color: var(--genux-mid-text); 
                text-align: center; 
                padding: 40px 20px;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .genux-empty-state i {
                font-size: 32px;
                margin-bottom: 12px;
                opacity: 0.5;
                display: block;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                #genux-modal {
                    max-width: 100%;
                    margin: 0;
                    border-radius: 16px;
                }
                
                #genux-modal-content-wrapper {
                    flex-direction: column;
                    min-height: auto;
                }
                
                #genux-modal-main,
                #genux-modal-sidebar {
                    width: 100%;
                    padding: 24px;
                }
                
                #genux-modal-main {
                    border-right: none;
                    border-bottom: 1px solid var(--genux-border);
                }
                
                #genux-prompt {
                    min-height: 100px;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    /**
     * Creates the floating action button and adds it to the page.
     */
    function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'genux-fab';
        button.title = "Open GenUX";
        button.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i>`;
        button.addEventListener('click', openPromptModal);
        document.body.appendChild(button);
    }

    /**
     * Opens the modal window for user input.
     */
    function openPromptModal() {
        if (document.getElementById('genux-modal-overlay')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'genux-modal-overlay';
        modalOverlay.className = 'genux-modal-overlay';
        
        modalOverlay.innerHTML = `
            <div id="genux-modal">
                <div id="genux-modal-content-wrapper">
                    <div id="genux-modal-main">
                        <div id="genux-modal-header">
                            <span class="genux-logo"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
                            <h2>GenUX</h2>
                        </div>
                        <p class="genux-subtitle">
                            Describe the UI element or functionality you want to create and watch it come to life.
                        </p>
                        <div id="genux-prompt-container">
                            <textarea id="genux-prompt" placeholder="Add a dark mode toggle to the header..."></textarea>
                            <button id="genux-generate-btn" title="Generate (Enter)"><i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                        <div id="genux-modal-actions">
                            <div class="genux-shortcut-hint">
                                <span class="genux-key">Enter</span> to send • <span class="genux-key">Shift+Enter</span> for new line
                            </div>
                            <div class="genux-action-buttons">
                                <button id="genux-clear-btn" title="Clear all features">Clear All</button>
                                <button id="genux-cancel-btn">Cancel</button>
                            </div>
                        </div>
                        <div id="genux-loader">
                            <div class="genux-typing-indicator">
                                <div class="genux-typing-dot"></div>
                                <div class="genux-typing-dot"></div>
                                <div class="genux-typing-dot"></div>
                            </div>
                            <p>Generating your feature...</p>
                        </div>
                    </div>
                    <div id="genux-modal-sidebar">
                        <div id="genux-features-list-container">
                            <h3>Active Features</h3>
                            <ul id="genux-features-list">
                                <!-- Dynamically populated -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        renderFeaturesList();

        // Event listeners
        const promptTextarea = document.getElementById('genux-prompt');
        const generateBtn = document.getElementById('genux-generate-btn');
        
        generateBtn.addEventListener('click', handleGenerateClick);
        document.getElementById('genux-cancel-btn').addEventListener('click', closeModal);
        document.getElementById('genux-clear-btn').addEventListener('click', () => clearSavedCode(true));
        
        // Enhanced keyboard interactions
        promptTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerateClick();
            }
        });
        
        // Auto-focus the textarea
        setTimeout(() => promptTextarea.focus(), 100);
        
        // Close modal on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', handleEscapeKey);
    }

    /**
     * Handles the ESC key to close modal
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && document.getElementById('genux-modal-overlay')) {
            closeModal();
        }
    }

    /**
     * Renders the list of currently saved features in the modal sidebar.
     */
    function renderFeaturesList() {
        const features = getSavedFeatures();
        const listEl = document.getElementById('genux-features-list');
        if (!listEl) return;

        listEl.innerHTML = ''; // Clear the list

        if (features.length === 0) {
            listEl.innerHTML = `
                <div class="genux-empty-state">
                    <i class="fa-solid fa-magic"></i>
                    <div>No features created yet.<br>Start by describing what you'd like to build!</div>
                </div>
            `;
            return;
        }

        features.forEach((feature, index) => {
            const itemEl = document.createElement('li');
            itemEl.className = 'genux-feature-item';
            itemEl.style.animationDelay = `${index * 0.1}s`;
            itemEl.innerHTML = `
                <p title="${feature.prompt}">${feature.prompt}</p>
                <button data-id="${feature.id}" title="Remove feature"><i class="fa-solid fa-trash-can"></i></button>
            `;
            listEl.appendChild(itemEl);
        });

        // Add event listeners to the new remove buttons
        listEl.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const featureId = e.currentTarget.getAttribute('data-id');
                handleRemoveFeature(parseInt(featureId));
            });
        });
    }
    
    /**
     * Closes the main prompt modal window.
     */
    function closeModal() {
        const modalOverlay = document.getElementById('genux-modal-overlay');
        if (modalOverlay) {
            modalOverlay.style.animation = 'genux-fade-out 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards';
            document.removeEventListener('keydown', handleEscapeKey);
            setTimeout(() => modalOverlay.remove(), 300);
        }
    }

    /**
     * Handles the click of the "Generate" button.
     */
    async function handleGenerateClick() {
        const promptText = document.getElementById('genux-prompt').value.trim();
        if (!promptText) {
            showNotification("Please describe what you'd like to create.", 'error');
            return;
        }

        const loader = document.getElementById('genux-loader');
        const promptContainer = document.getElementById('genux-prompt-container');
        
        loader.style.display = 'block';
        promptContainer.style.opacity = '0.5';
        promptContainer.style.pointerEvents = 'none';

        try {
            const domStructure = getPageStructure();
            const fullPrompt = `
                You are an expert JavaScript developer. Your task is to generate JavaScript code to add a new feature to an existing webpage.
                You will be given a summary of the webpage's current DOM structure and a user's request for a new feature.
                The code you generate will be directly executed on the page.

                IMPORTANT RULES:
                1.  ONLY output raw JavaScript code. Do NOT wrap it in markdown like \`\`\`javascript or provide any explanation.
                2.  The code must be self-contained and not require any external libraries unless they are already present on the page.
                3.  The code should be idempotent, meaning it can be run multiple times without causing errors (check if elements already exist before creating them).
                4.  Use modern JavaScript (ES6+).
                5.  If you need to add CSS, do so by creating a <style> tag and appending it to the document head.
                6. Use Regex to find injection points or data if necessary.

                ---
                WEBPAGE DOM STRUCTURE:
                ${domStructure}
                ---
                USER REQUEST: "${promptText}"
                ---

                Now, generate the JavaScript code.

                ---
                Site Code : ${document.body.innerHTML}
            `;
            
            const payload = { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] };
            const apiKey = GEMINI_API_KEY; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Gemini API request failed: ${response.status} ${errorBody}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0) {
                let generatedCode = result.candidates[0].content.parts[0].text;
                generatedCode = generatedCode.trim().replace(/^```(javascript|js)?\s*/, '').replace(/```$/, '');
                
                const newFeature = {
                    id: Date.now(),
                    prompt: promptText,
                    code: generatedCode
                };

                addAndSaveFeature(newFeature);
                executeCode(newFeature.code);
                document.getElementById('genux-prompt').value = '';
                renderFeaturesList();
                showNotification("✨ Feature created successfully!", 'success');
            } else {
                throw new Error("The AI returned an unexpected response.");
            }

        } catch (error) {
            console.error("Error generating UI:", error);
            showNotification(`Generation failed: ${error.message}`, 'error');
        } finally {
            if(loader) {
                loader.style.display = 'none';
                promptContainer.style.opacity = '1';
                promptContainer.style.pointerEvents = 'auto';
            }
        }
    }

    /**
     * Executes a string of JavaScript code.
     * @param {string} code The JavaScript code to execute.
     */
    function executeCode(code) {
        try {
            const script = document.createElement('script');
            // Wrap in an IIFE to avoid polluting the global scope and to handle errors gracefully.
            script.textContent = `try { (function() { ${code} })(); } catch (e) { console.error('GenUX Executed Code Error:', e); }`;
            (document.head || document.documentElement).appendChild(script);
            script.remove(); // Clean up the DOM after execution
        } catch (error) {
            console.error("Error injecting script:", error);
            showNotification("Failed to apply generated feature.", 'error');
        }
    }

    /**
     * Loads and applies all saved features from localStorage.
     */
    function loadAndApplySavedCode() {
        const features = getSavedFeatures();
        console.log(`Applying ${features.length} saved GenUX modifications...`);
        features.forEach(feature => executeCode(feature.code));
    }

    /**
     * Handles the removal of a single feature.
     * @param {number} featureId The ID of the feature to remove.
     */
    function handleRemoveFeature(featureId) {
        showConfirmation("Remove this feature? The page will reload to apply changes.", () => {
            let features = getSavedFeatures();
            features = features.filter(f => f.id !== featureId);
            saveFeatures(features);
            showNotification("Feature removed. Reloading page...", 'info');
            setTimeout(() => window.location.reload(), 1500);
        });
    }

    /**
     * Clears all saved code from localStorage and reloads the page.
     */
    function clearSavedCode() {
        showConfirmation("Clear all features? This will reload the page to reset everything.", () => {
            localStorage.removeItem(STORAGE_KEY);
            showNotification("All features cleared. Reloading page...", 'info');
            setTimeout(() => window.location.reload(), 1500);
        });
    }

    // --- Storage Helper Functions ---

    /**
     * Retrieves the array of features from localStorage.
     * @returns {Array} An array of feature objects.
     */
    function getSavedFeatures() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    /**
     * Saves the array of features to localStorage.
     * @param {Array} features An array of feature objects.
     */
    function saveFeatures(features) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
    }

    /**
     * Adds a new feature to the list and saves it.
     * @param {object} newFeature The new feature object to add.
     */
    function addAndSaveFeature(newFeature) {
        const features = getSavedFeatures();
        features.push(newFeature);
        saveFeatures(features);
    }

    // --- UI Helper Functions ---

    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.genux-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = 'genux-notification';
        
        applyStyles(notification, {
            position: 'fixed', 
            bottom: '24px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            padding: '16px 24px', 
            borderRadius: '12px', 
            color: 'white', 
            zIndex: '10001',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
            background: 'rgba(31, 31, 33, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'genux-fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
            textAlign: 'center'
        });
        
        let borderColor, icon;
        switch (type) {
            case 'success': 
                borderColor = '#4caf50'; 
                icon = '✓';
                break;
            case 'error': 
                borderColor = '#f44336'; 
                icon = '⚠';
                break;
            default: 
                borderColor = '#2196f3';
                icon = 'ℹ';
        }
        
        notification.style.borderLeft = `4px solid ${borderColor}`;
        notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'genux-fade-out 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards';
            setTimeout(() => notification.remove(), 400);
        }, 3500);
    }

    function showConfirmation(message, onConfirm) {
        const existingConfirm = document.getElementById('genux-confirm-overlay');
        if (existingConfirm) existingConfirm.remove();

        const confirmOverlay = document.createElement('div');
        confirmOverlay.id = 'genux-confirm-overlay';
        confirmOverlay.className = 'genux-modal-overlay';
        confirmOverlay.style.animation = 'genux-fade-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        confirmOverlay.innerHTML = `
            <div style="position: relative; width: 90%; max-width: 420px; background: var(--genux-card-bg); border-radius: 20px; padding: 3px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); color: var(--genux-light-text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(161, 140, 209, 0.3), rgba(244, 67, 54, 0.3)); border-radius: 20px; z-index: -1;"></div>
                <div style="background: var(--genux-card-bg); padding: 32px; border-radius: 17px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 16px; color: #f44336;">⚠</div>
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: var(--genux-light-text);">${message}</p>
                    <div style="display: flex; justify-content: center; gap: 16px;">
                        <button id="genux-confirm-yes-btn" style="padding: 12px 24px; border-radius: 10px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; background: linear-gradient(135deg, #f44336, #d32f2f); color: white; transition: all 0.2s ease;">Confirm</button>
                        <button id="genux-confirm-no-btn" style="padding: 12px 24px; border-radius: 10px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; background: var(--genux-hover-bg); color: var(--genux-light-text); transition: all 0.2s ease;">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmOverlay);
        
        const closeConfirm = () => {
            confirmOverlay.style.animation = 'genux-fade-out 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards';
            setTimeout(() => confirmOverlay.remove(), 300);
        };
        
        document.getElementById('genux-confirm-yes-btn').addEventListener('click', () => { 
            onConfirm(); 
            closeConfirm(); 
        });
        document.getElementById('genux-confirm-no-btn').addEventListener('click', closeConfirm);
        
        // ESC to cancel
        const handleConfirmEscape = (e) => {
            if (e.key === 'Escape') {
                closeConfirm();
                document.removeEventListener('keydown', handleConfirmEscape);
            }
        };
        document.addEventListener('keydown', handleConfirmEscape);
    }

    /**
     * Generates a simplified text representation of the page's DOM structure.
     */
    function getPageStructure() {
        let structure = "Body contains the following major elements:\n";
        const topLevelChildren = document.body.children;
        for (let i = 0; i < topLevelChildren.length; i++) {
            const element = topLevelChildren[i];
            if (element.tagName.toLowerCase() === 'script' || element.id.startsWith('genux-')) continue;
            structure += `- A <${element.tagName.toLowerCase()}> element`;
            if (element.id) structure += ` with id "${element.id}"`;
            if (element.className) structure += ` and classes "${element.className}"`;
            structure += ".\n";
        }
        return structure;
    }

    /**
     * Helper function to apply multiple CSS styles to an element.
     */
    function applyStyles(element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }

    // --- Initialization ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGenUX);
    } else {
        initializeGenUX();
    }


})();
