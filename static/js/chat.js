var messageCount = 0;

function sendMessage() {
    var inputBox = document.getElementById('userInput');
    var userText = inputBox.value.trim();

    if (!userText) {
        return;
    }

    inputBox.value = '';
    inputBox.style.height = 'auto';

    addUserMessage(userText);

    showTyping();

    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        hideTyping();

        if (data.response) {
            addBotMessage(data.response);
        } else if (data.error) {
            addBotMessage("I'm sorry, something went wrong. Please try again. 🙏");
        }
    })
    .catch(function(error) {

        hideTyping();
        addBotMessage("I'm having trouble connecting. Please check if the server is running. 🙏");
        console.error("Error:", error);
    });
}

function addUserMessage(text) {
    var messagesDiv = document.getElementById('chatMessages');

    var messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';

    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
            <span class="message-time">${getCurrentTime()}</span>
        </div>
    `;

    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
    messageCount++;
}

function addBotMessage(text) {
    var messagesDiv = document.getElementById('chatMessages');

    var messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';

    var formattedText = formatBotResponse(text);

    messageDiv.innerHTML = `
        <div class="message-avatar">🕉️</div>
        <div class="message-content">
            ${formattedText}
            <span class="message-time">${getCurrentTime()}</span>
        </div>
    `;

    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function formatBotResponse(text) {
    
    var paragraphs = text.split('\n\n');
    var html = '';

    paragraphs.forEach(function(para) {
        if (para.trim() === '') return;

        para = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        para = para.replace(/_(.+?)_/g, '<em>$1</em>');

        para = para.replace(/\n/g, '<br>');

        html += '<p>' + para + '</p>';
    });

    return html;
}

function showTyping() {
    document.getElementById('typingIndicator').style.display = 'flex';
    scrollToBottom();
}

function hideTyping() {
    document.getElementById('typingIndicator').style.display = 'none';
}

function scrollToBottom() {
    var messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function fillMessage(text) {
    var inputBox = document.getElementById('userInput');
    inputBox.value = text;
    inputBox.focus();
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.getElementById('userInput');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
});
