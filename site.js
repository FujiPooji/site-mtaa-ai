async function fetchGeminiResponse(userMessage) {
    const apiKey = "AIzaSyC_Slcv8saSu5zG_O46g8dZezQG4H_933c";
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const body = {
        contents: [
            { parts: [{ text: userMessage }] }
        ]
    };
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    try {
        return data.candidates[0].content.parts[0].text;
    } catch {
        return data.error?.message || "nope";
    }
}

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        appendMessage('user', message);
        chatInput.value = ""; // Clear input after sending
        fetchGeminiResponse(message).then(response => {
            appendMessage('bot', response);
        }).catch(error => {
            appendMessage('bot', "Error: " + error.message);
        });
    }
});
function parseMessageStyles(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code: `text`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    return text;
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + sender;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = parseMessageStyles(text); // Use innerHTML for styled text
    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function onnewChat() {
    chatMessages.innerHTML = '';
}

function addnewchattolist(chatName, chatdata) {
    const chatList = document.querySelector('.actualchats');
    if (!chatList) {
        console.error("Chat list element with class 'actualchats' not found.");
        return;
    }
    const chatItem = document.createElement('li');
    const chatData = chatdata || {};
    chatItem.textContent = chatName;
    chatItem.className = 'chat-item';
    chatItem.onclick = function() {
        chatMessages.innerHTML = '';
        appendMessage('bot', "Welcome to " + chatName);
    };
    chatList.appendChild(chatItem);
}

document.addEventListener('DOMContentLoaded', function() {
    const newChatBtn = document.querySelector('#newchat button');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            onnewChat();
            const chatName = "Chat " + (document.querySelectorAll('.actualchats li').length + 1);
            addnewchattolist(chatName);
            appendMessage('bot', "Started a new chat: " + chatName);
        });
    }
});