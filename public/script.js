const socket = io('https://your-backend-url'); // Replace with your backend URL

let userId;
let chatId;

// Generate user ID based on IP address
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        userId = data.ip.replace(/\./g, '');
        document.getElementById('userId').innerText = userId;
    });

// Join chat
function joinChat() {
    chatId = document.getElementById('chatIdInput').value;
    if (chatId) {
        window.location.href = `chat.html?chatId=${chatId}&userId=${userId}`;
    }
}

// Create new chat
function createNewChat() {
    chatId = userId + Date.now();
    window.location.href = `chat.html?chatId=${chatId}&userId=${userId}`;
}

// End chat
function endChat() {
    window.location.href = 'index.html';
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        const encryptedMessage = CryptoJS.AES.encrypt(message, chatId).toString();
        socket.emit('sendMessage', { chatId, userId, message: encryptedMessage });
        messageInput.value = '';
    }
}

// Listen for messages
function listenForMessages() {
    socket.on('receiveMessage', data => {
        if (data.chatId === chatId) {
            const decryptedMessage = CryptoJS.AES.decrypt(data.message, chatId).toString(CryptoJS.enc.Utf8);
            const messageElement = document.createElement('div');
            messageElement.innerText = `${data.userId}: ${decryptedMessage}`;
            document.getElementById('chatMessages').appendChild(messageElement);
        }
    });
}

// Get chat ID and user ID from URL
const urlParams = new URLSearchParams(window.location.search);
chatId = urlParams.get('chatId');
userId = urlParams.get('userId');

if (chatId && userId) {
    document.getElementById('userId').innerText = userId;
    document.getElementById('chatId').innerText = chatId;
    listenForMessages();
}
