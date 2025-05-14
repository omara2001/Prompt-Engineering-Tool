# PromptSphere 🤖✨

> Unleash AI Creativity with Groq

PromptSphere is a modern, user-friendly interface for interacting with powerful AI language models through the Groq API. With a clean design and intuitive controls, it makes AI text generation accessible to everyone.

## ✨ Features

- **🚀 Lightning-Fast Responses**: Powered by Groq's high-performance API
- **🎨 Clean, Modern UI**: Intuitive interface with dark/light mode
- **📱 Responsive Design**: Works on desktop and mobile devices
- **💾 Local History**: Save your prompts and responses for future reference
- **🔄 Multiple Models**: Choose from various state-of-the-art AI models
- **📋 Easy Copying**: One-click copy for generated responses
- **🎭 Markdown Support**: Responses support markdown formatting

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img src="https://github.com/omara2001/Prompt-Engineering-Tool/blob/main/AppUI.png" alt="App UI">
        <p align="center"><b>App UI</b></p>
      </td>
      <td width="50%">
        <img src="https://github.com/omara2001/Prompt-Engineering-Tool/blob/main/Simpleprompt.png" alt="Simple prompt">
        <p align="center"><b>Simple prompt Example</b></p>
      </td>
    </tr>
  </table>
</div>

## 🛠️ Supported Models

PromptSphere currently supports these high-performance models:

- Gemma 2 9B (Google)
- Llama 3.1 8B (Meta)
- Llama 3 8B (Meta)
- Llama 3 70B (Meta)
- Llama 3.3 70B (Meta)
- Allam 2 7B (SDAIA)
- Llama 4 Scout 17B (Meta)
- Compound Beta Mini (Groq)

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- [Optional] A Groq API key if you want to run your own backend

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/omara2001/Prompt-Engineering-Tool.git
   cd Prompt-Engineering-Tool
   ```

2. Open `frontend/index.html` in your browser:
   ```bash
   # On macOS
   open frontend/index.html

   # On Linux
   xdg-open frontend/index.html

   # On Windows
   start frontend/index.html
   ```

3. [Optional] To use your own backend:
   - Set up the backend according to the instructions in the backend directory
   - Update the API URL in `frontend/config.js`

## 🔧 Configuration

You can customize the API endpoint by modifying the `config.js` file:

```javascript
// frontend/config.js
const CONFIG = {
  API_URL: "https://your-backend-url.com/api",
  VERSION: "1.0.0"
};
```

## 🧩 Project Structure

```
frontend/
├── index.html      # Main HTML file
├── style.css       # CSS styles
├── script.js       # JavaScript functionality
├── config.js       # Configuration settings
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Groq](https://groq.com/) for their powerful API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Font Awesome](https://fontawesome.com/) for the icons
- All the amazing open-source AI models from Meta, Google, and others

## 📬 Contact

Omar A  - [@omara2001](https://github.com/omara2001)

Project Link: [https://github.com/omara2001/Prompt-Engineering-Tool](https://github.com/omara2001/Prompt-Engineering-Tool)

---

<p align="center">Made with ❤️ and AI</p>
