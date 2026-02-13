// আপনার সচল API Key
const API_KEY = "AIzaSyBaM7GCJF3SvfqlyoGTq_U4ufitrgqQ4eo"; 
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('status');

// মেসেজ পাঠানোর ফাংশন
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // ১. ইউজারের মেসেজ স্ক্রিনে দেখানো
    addMessage('আপনি', text, 'user-msg');
    userInput.value = "";
    
    // ২. লোডিং স্ট্যাটাস
    setLoading(true);

    try {
        // ৩. গুগল এপিআই-তে রিকোয়েস্ট পাঠানো
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        // ৪. এআই-এর উত্তর বের করা
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // ৫. উত্তরটি স্ক্রিনে দেখানো
        addMessage('জেমিনি', aiResponse, 'ai-msg', true);

    } catch (err) {
        console.error(err);
        addMessage('সিস্টেম', "দুঃখিত, কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।", 'bg-red-900/30 text-red-400 border border-red-500/40 text-xs');
    } finally {
        setLoading(false);
    }
}

// মেসেজ যোগ করার হেল্পার ফাংশন
function addMessage(sender, text, className, isMarkdown = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className} shadow-lg`;
    
    const content = isMarkdown ? marked.parse(text) : `<p>${text}</p>`;
    msgDiv.innerHTML = `<b>${sender}:</b><div class="mt-1">${content}</div>`;
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// লোডিং স্ট্যাটাস পরিবর্তন
function setLoading(isLoading) {
    if (isLoading) {
        sendBtn.disabled = true;
        statusText.innerText = "জেমিনি ভাবছে...";
        statusText.className = "text-yellow-500 font-bold italic";
    } else {
        sendBtn.disabled = false;
        statusText.innerText = "Online";
        statusText.className = "text-green-500 font-bold";
    }
}

// বাটন ক্লিক এবং এন্টার কী হ্যান্ডলার
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
