const API_KEY = "AIzaSyBaM7GCJF3SvfqlyoGTq_U4ufitrgqQ4eo";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // ইউজার মেসেজ যোগ করা
    appendMessage('আপনি', text, 'user-msg');
    userInput.value = "";
    
    // লোডিং স্ট্যাটাস
    setLoading(true);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const aiText = data.candidates[0].content.parts[0].text;
        appendMessage('জেমিনি', aiText, 'ai-msg', true);
    } catch (err) {
        appendMessage('সিস্টেম', "Error: " + err.message, 'bg-red-900/20 text-red-400');
    } finally {
        setLoading(false);
    }
}

function appendMessage(sender, text, className, isMarkdown = false) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    const content = isMarkdown ? marked.parse(text) : text;
    div.innerHTML = `<b>${sender}:</b><div class="mt-1">${content}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    status.innerText = isLoading ? "Thinking..." : "Active";
    status.className = isLoading ? "text-yellow-500 font-bold" : "text-green-400";
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
