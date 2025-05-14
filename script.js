document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modelSelect = document.getElementById('model-select');
    const promptInput = document.getElementById('prompt-input');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const responseContainer = document.getElementById('response-container');
    const historyContainer = document.getElementById('history-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const responseMetadata = document.getElementById('response-metadata');
    const modelName = document.getElementById('model-name');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const promptCounter = document.getElementById('prompt-counter');
    const timeValue = document.getElementById('time-value');

    // API URL from config
    const API_BASE_URL = window.CONFIG ? CONFIG.API_URL : "https://prompt-engineering-production-d1c7.up.railway.app/api";

    console.log('Using API URL:', API_BASE_URL);

    // List of working models - only these will be shown
    const workingModelIds = [
        "gemma2-9b-it",
        "llama-3.1-8b-instant",
        "llama3-8b-8192",
        "llama3-70b-8192",
        "llama-3.3-70b-versatile",
        "allam-2-7b",
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "compound-beta-mini"
    ];

    // Load models from API
    async function loadModels() {
        try {
            console.log('Loading models from API...');
            const response = await fetch(`${API_BASE_URL}/models`);

            if (!response.ok) {
                console.error('API response not OK:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to load models: ${response.status} ${response.statusText}`);
            }

            const apiResponse = await response.json();
            console.log('API response:', apiResponse);

            // Handle different API response formats
            let allModels = [];
            if (Array.isArray(apiResponse)) {
                // If the API returns an array directly
                allModels = apiResponse;
            } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
                // If the API returns an object with a data property
                allModels = apiResponse.data;
            } else if (apiResponse.models && Array.isArray(apiResponse.models)) {
                // If the API returns an object with a models property
                allModels = apiResponse.models;
            } else {
                console.error('Unexpected API response format:', apiResponse);
                throw new Error('Unexpected API response format');
            }

            console.log('All models extracted:', allModels);

            // Filter to only include working models
            // First, normalize model objects to ensure they have an id property
            const normalizedModels = allModels.map(model => {
                // If the model is a string, convert it to an object with an id property
                if (typeof model === 'string') {
                    return { id: model };
                }
                // If the model has an id property, use it
                if (model.id) {
                    return model;
                }
                // If the model has a name property but no id, use name as id
                if (model.name) {
                    return { ...model, id: model.name };
                }
                // Otherwise, return the model as is
                return model;
            });

            // Now filter the normalized models
            const models = normalizedModels.filter(model => {
                const modelId = model.id || '';
                return workingModelIds.some(id => modelId.includes(id));
            });

            console.log('Filtered working models:', models);

            // If no working models are returned, use hardcoded models
            if (!models || models.length === 0) {
                console.log('No working models found, using hardcoded models');
                useHardcodedModels();
                return;
            }

            // Clear loading option
            modelSelect.innerHTML = '';

            // Add models to select dropdown with friendly names
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;

                // Map model IDs to friendly names
                let displayName = model.id;
                let owner = model.owned_by || 'Unknown';

                // Use our mapping for better display names
                const modelMap = {
                    "gemma2-9b-it": "Gemma 2 9B",
                    "llama-3.1-8b-instant": "Llama 3.1 8B",
                    "llama3-8b-8192": "Llama 3 8B",
                    "llama3-70b-8192": "Llama 3 70B",
                    "llama-3.3-70b-versatile": "Llama 3.3 70B",
                    "allam-2-7b": "Allam 2 7B",
                    "meta-llama/llama-4-scout-17b-16e-instruct": "Llama 4 Scout 17B",
                    "compound-beta-mini": "Compound Beta Mini"
                };

                const ownerMap = {
                    "gemma2-9b-it": "Google",
                    "llama-3.1-8b-instant": "Meta",
                    "llama3-8b-8192": "Meta",
                    "llama3-70b-8192": "Meta",
                    "llama-3.3-70b-versatile": "Meta",
                    "allam-2-7b": "SDAIA",
                    "meta-llama/llama-4-scout-17b-16e-instruct": "Meta",
                    "compound-beta-mini": "Groq"
                };

                if (modelMap[model.id]) {
                    displayName = modelMap[model.id];
                }

                if (ownerMap[model.id]) {
                    owner = ownerMap[model.id];
                }

                option.textContent = `${displayName} (${owner})`;
                modelSelect.appendChild(option);
            });

            // Select first model by default
            if (models.length > 0) {
                modelSelect.value = models[0].id;
            }
        } catch (error) {
            console.error('Error loading models:', error);
            modelSelect.innerHTML = '<option value="" disabled selected>Error loading models</option>';
            // Fall back to hardcoded models
            useHardcodedModels();
        }
    }

    // Use hardcoded models as fallback - only including working models
    function useHardcodedModels() {
        console.log('Using hardcoded models');
        const hardcodedModels = window.CONFIG && CONFIG.MODELS ? CONFIG.MODELS : [
            { id: "gemma2-9b-it", name: "Gemma 2 9B", owned_by: "Google" },
            { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", owned_by: "Meta" },
            { id: "llama3-8b-8192", name: "Llama 3 8B", owned_by: "Meta" },
            { id: "llama3-70b-8192", name: "Llama 3 70B", owned_by: "Meta" },
            { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", owned_by: "Meta" },
            { id: "allam-2-7b", name: "Allam 2 7B", owned_by: "SDAIA" },
            { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout 17B", owned_by: "Meta" },
            { id: "compound-beta-mini", name: "Compound Beta Mini", owned_by: "Groq" }
        ];

        // Clear loading option
        modelSelect.innerHTML = '';

        // Add hardcoded models to dropdown
        hardcodedModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.name} (${model.owned_by})`;
            modelSelect.appendChild(option);
        });

        // Select first model by default
        modelSelect.value = hardcodedModels[0].id;
    }

    // Generate response from API
    async function generateResponse(prompt, model) {
        console.log('Generating response for model:', model);
        console.log('Prompt:', prompt);

        // Show loading state
        submitBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');

        // Clear previous response and show loading animation
        responseContainer.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center animate__animated animate__fadeIn">
                    <div class="text-indigo-500 dark:text-indigo-400 mb-3">
                        <i class="fas fa-robot text-5xl animate__animated animate__pulse animate__infinite"></i>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400">Generating response...</p>
                </div>
            </div>
        `;

        responseMetadata.classList.add('hidden');
        copyBtn.disabled = true;

        const startTime = Date.now();

        try {
            console.log('Sending request to:', `${API_BASE_URL}/generate`);
            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    model
                })
            });

            if (!response.ok) {
                console.error('API response not OK:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to generate response: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            const endTime = Date.now();
            const responseTime = ((endTime - startTime) / 1000).toFixed(2);

            // Format and display response with animation
            responseContainer.innerHTML = `<div class="animate__animated animate__fadeIn">${formatResponse(data.response)}</div>`;

            // Update metadata (without token count)
            modelName.textContent = data.model;
            timeValue.textContent = responseTime;
            responseMetadata.classList.remove('hidden');
            copyBtn.disabled = false;

            // Save to history
            saveToHistory(prompt, model, data.response);

        } catch (error) {
            console.error('Error generating response:', error);

            // Show a more user-friendly error message
            responseContainer.innerHTML = `
                <div class="flex items-center justify-center h-full">
                    <div class="text-center max-w-md mx-auto">
                        <div class="text-red-500 mb-4">
                            <i class="fas fa-robot text-4xl"></i>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Oops! Something went wrong</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">We couldn't generate a response at this time.</p>

                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left border border-gray-200 dark:border-gray-700">
                            <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">Try these solutions:</p>
                            <ul class="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>Select a different AI model from the dropdown</li>
                                <li>Check your internet connection</li>
                                <li>Try a shorter or different prompt</li>
                                <li>Wait a moment and try again</li>
                            </ul>
                        </div>

                        <button class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors duration-200" onclick="window.location.reload()">
                            <i class="fas fa-redo-alt mr-2"></i>Refresh Page
                        </button>
                    </div>
                </div>
            `;
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            loadingSpinner.classList.add('hidden');
        }
    }

    // Format response with enhanced markdown-like parsing
    function formatResponse(text) {
        if (!text) return '<p class="text-gray-500 dark:text-gray-400">No response received</p>';

        // Convert markdown-style formatting to HTML with better styling
        let formatted = text
            // Code blocks with language support
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
                const language = lang ? ` class="language-${lang}"` : '';
                return `<pre><code${language}>${code.trim()}</code></pre>`;
            })
            // Inline code with better styling
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers with proper hierarchy and styling
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Ordered lists - wrap in <ol> tags
            .replace(/(?:^\s*\d+\.\s+.*$\n?)+/gm, match => {
                const items = match.match(/^\s*\d+\.\s+(.*$)/gm).map(item => {
                    return `<li>${item.replace(/^\s*\d+\.\s+/, '')}</li>`;
                }).join('');
                return `<ol>${items}</ol>`;
            })
            // Unordered lists - wrap in <ul> tags
            .replace(/(?:^\s*[\-\*]\s+.*$\n?)+/gm, match => {
                const items = match.match(/^\s*[\-\*]\s+(.*$)/gm).map(item => {
                    return `<li>${item.replace(/^\s*[\-\*]\s+/, '')}</li>`;
                }).join('');
                return `<ul>${items}</ul>`;
            })
            // Paragraphs with better spacing
            .replace(/\n\s*\n/g, '</p><p>')
            // Line breaks
            .replace(/\n/g, '<br>');

        // Wrap in paragraph tags if not already
        if (!formatted.startsWith('<')) {
            formatted = `<p>${formatted}</p>`;
        }

        // Fix any broken list items that aren't in a list
        formatted = formatted.replace(/<li>(.*?)<\/li>/g, (match, content) => {
            if (match.indexOf('<ul>') === -1 && match.indexOf('<ol>') === -1) {
                return `<ul><li>${content}</li></ul>`;
            }
            return match;
        });

        return formatted;
    }

    // Save prompt and response to history in local storage
    function saveToHistory(prompt, model, response) {
        // Get existing history or initialize empty array
        const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');

        // Add new item to history
        history.unshift({
            id: Date.now(),
            prompt,
            model,
            response,
            timestamp: new Date().toISOString()
        });

        // Limit history to 20 items
        const limitedHistory = history.slice(0, 20);

        // Save back to local storage
        localStorage.setItem('promptHistory', JSON.stringify(limitedHistory));

        // Update history display
        displayHistory();
    }

    // Display history from local storage with enhanced styling
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');

        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 italic">No history yet</p>';
            return;
        }

        historyContainer.innerHTML = history.map((item) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            const truncatedPrompt = item.prompt.length > 40
                ? item.prompt.substring(0, 40) + '...'
                : item.prompt;

            // Get model display name
            let modelDisplay = item.model.split('-')[0];
            if (modelDisplay.length > 8) {
                modelDisplay = modelDisplay.substring(0, 8);
            }

            return `
                <div class="history-item p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                     data-id="${item.id}">
                    <div class="text-sm font-medium text-gray-800 dark:text-gray-200">${truncatedPrompt}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center mt-1.5">
                        <span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                            ${modelDisplay}
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-clock mr-1"></i> ${formattedDate}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to history items with enhanced interaction
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const historyItem = history.find(h => h.id === id);

                if (historyItem) {
                    // Add highlight effect to selected item
                    document.querySelectorAll('.history-item').forEach(el => {
                        el.classList.remove('bg-indigo-50', 'dark:bg-indigo-900/30', 'border-l-indigo-500');
                    });
                    item.classList.add('bg-indigo-50', 'dark:bg-indigo-900/30', 'border-l-indigo-500');

                    // Populate form with history item with animation
                    promptInput.value = historyItem.prompt;
                    promptInput.classList.add('animate__animated', 'animate__flash');
                    setTimeout(() => promptInput.classList.remove('animate__animated', 'animate__flash'), 1000);

                    // Update character counter
                    promptCounter.textContent = historyItem.prompt.length;
                    if (historyItem.prompt.length > 0) {
                        promptCounter.parentElement.classList.remove('hidden');
                    }

                    // Set model
                    modelSelect.value = historyItem.model;

                    // Show response with animation
                    responseContainer.innerHTML = `<div class="animate__animated animate__fadeIn">${formatResponse(historyItem.response)}</div>`;
                    responseMetadata.classList.remove('hidden');
                    copyBtn.disabled = false;

                    // Scroll to top of response container
                    responseContainer.scrollTop = 0;
                }
            });
        });
    }

    // Initialize dark mode
    function initTheme() {
        console.log('Initializing theme');
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        console.log('Saved theme:', savedTheme);
        console.log('System prefers dark:', systemPrefersDark);

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            console.log('Setting dark theme');
            document.documentElement.classList.add('dark');
        } else {
            console.log('Setting light theme');
            document.documentElement.classList.remove('dark');
        }

        // Make sure the correct icon is showing
        updateThemeIcon();
    }

    // Update theme icon based on current theme
    function updateThemeIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        const sunIcon = themeToggleBtn.querySelector('.fa-sun');
        const moonIcon = themeToggleBtn.querySelector('.fa-moon');

        if (isDark) {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    }

    // Toggle dark/light mode
    if (themeToggleBtn) {
        console.log('Adding event listener to theme toggle button');
        themeToggleBtn.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            const isDark = document.documentElement.classList.toggle('dark');
            console.log('Dark mode toggled to:', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Update the icon
            updateThemeIcon();

            // Add animation to the toggle button
            themeToggleBtn.classList.add('animate-spin');
            setTimeout(() => {
                themeToggleBtn.classList.remove('animate-spin');
            }, 500);
        });
    } else {
        console.error('Theme toggle button not found in the DOM');
    }

    // Character counter for prompt input
    promptInput.addEventListener('input', () => {
        const charCount = promptInput.value.length;
        promptCounter.textContent = charCount;

        // Show counter only when there's text
        if (charCount > 0) {
            promptCounter.parentElement.classList.remove('hidden');
        } else {
            promptCounter.parentElement.classList.add('hidden');
        }
    });

    // Clear history button
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your prompt history?')) {
            localStorage.removeItem('promptHistory');
            displayHistory();
        }
    });

    // Event Listeners
    submitBtn.addEventListener('click', () => {
        const prompt = promptInput.value.trim();
        const model = modelSelect.value;

        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        if (!model) {
            alert('Please select a model');
            return;
        }

        generateResponse(prompt, model);
    });

    clearBtn.addEventListener('click', () => {
        promptInput.value = '';
        promptCounter.parentElement.classList.add('hidden');
        responseContainer.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center">
                    <div class="text-gray-400 dark:text-gray-500 mb-3">
                        <i class="fas fa-robot text-5xl"></i>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400">Your AI response will appear here...</p>
                </div>
            </div>
        `;
        responseMetadata.classList.add('hidden');
        copyBtn.disabled = true;
    });

    copyBtn.addEventListener('click', () => {
        // Get text content without HTML tags
        const textToCopy = responseContainer.innerText;

        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Visual feedback
            copyBtn.classList.add('copy-success');
            copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';

            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copy-success');
                copyBtn.innerHTML = '<i class="fas fa-copy mr-1.5"></i> Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    // Allow submitting with Enter key
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitBtn.click();
        }
    });

    // Initialize theme and history immediately
    initTheme();
    displayHistory();

    // Load models
    loadModels();

    // Add welcome animation
    setTimeout(() => {
        const mainContent = document.querySelector('.grid');
        if (mainContent) {
            mainContent.classList.add('animate__animated', 'animate__fadeInUp');
        }
    }, 300);

    // Make CONFIG available globally
    window.CONFIG = window.CONFIG || {
        API_URL: API_BASE_URL,
        VERSION: "1.0.0"
    };
});
