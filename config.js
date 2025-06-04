/**
 * PromptSphere Configuration
 *
 * This file contains configuration settings for the PromptSphere frontend.
 */

const CONFIG = {
    // API URL Configuration
    API_URL: "https://prompt-engineering-production-0d85.up.railway.app/",

    // Application Version
    VERSION: "1.0.0",

    // Default models (used as fallback if API fails)
    MODELS: [
        { id: "gemma2-9b-it", name: "Gemma 2 9B", owned_by: "Google" },
        { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", owned_by: "Meta" },
        { id: "llama3-8b-8192", name: "Llama 3 8B", owned_by: "Meta" },
        { id: "llama3-70b-8192", name: "Llama 3 70B", owned_by: "Meta" },
        { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", owned_by: "Meta" },
        { id: "allam-2-7b", name: "Allam 2 7B", owned_by: "SDAIA" },
        { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout 17B", owned_by: "Meta" },
        { id: "compound-beta-mini", name: "Compound Beta Mini", owned_by: "Groq" }
    ],

    // Default settings
    DEFAULTS: {
        temperature: 0.7,
        maxTokens: 1000
    }
};
