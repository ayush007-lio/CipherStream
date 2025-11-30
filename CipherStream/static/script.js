// static/script.js

const CAESAR_SHIFT = 3; // Default shift (used if no password is set, fallback)

// --- 1. Password Logic ---
function getShiftFromPassword(password) {
    if (!password) return CAESAR_SHIFT; // Default if empty
    let sum = 0;
    for (let i = 0; i < password.length; i++) {
        sum += password.charCodeAt(i);
    }
    return sum % 26; 
}

// --- 2. Encryption/Decryption Logic ---
function encrypt(text, shift) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/)) {
            let code = char.charCodeAt(0);
            let shifted = ((code - 97 + shift) % 26) + 97;
            result += String.fromCharCode(shifted);
        } else if (char.match(/[A-Z]/)) {
            let code = char.charCodeAt(0);
            let shifted = ((code - 65 + shift) % 26) + 65;
            result += String.fromCharCode(shifted);
        } else {
            result += char;
        }
    }
    return result;
}

function decrypt(text, shift) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/)) {
            let code = char.charCodeAt(0);
            let shifted = ((code - 97 - shift) % 26);
            if (shifted < 0) shifted += 26;
            result += String.fromCharCode(shifted + 97);
        } else if (char.match(/[A-Z]/)) {
            let code = char.charCodeAt(0);
            let shifted = ((code - 65 - shift) % 26);
            if (shifted < 0) shifted += 26;
            result += String.fromCharCode(shifted + 65);
        } else {
            result += char;
        }
    }
    return result;
}

document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const messageLog = document.getElementById("message-log");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    let username = "";
    let state = "GET_USERNAME"; 

    // --- 3. Feature: Auto-Lock Previous Messages ---
    function lockAllMessages() {
        // Find all messages that are currently showing decrypted content
        const unlockedMessages = document.querySelectorAll('.decrypted-content');
        
        unlockedMessages.forEach(msgSpan => {
            // 1. Get the original encrypted text we stored in the data attribute
            const originalEncrypted = msgSpan.getAttribute('data-encrypted');
            
            // 2. Revert the text to encrypted
            msgSpan.textContent = originalEncrypted;
            
            // 3. Reset classes
            msgSpan.classList.remove('decrypted-content');
            msgSpan.classList.add('cipher-text');
            
            // 4. Check if a button already exists, if not, add it back
            if (!msgSpan.nextElementSibling || !msgSpan.nextElementSibling.classList.contains('decrypt-btn')) {
                const contentId = msgSpan.id;
                // Create the button again
                const btn = document.createElement('button');
                btn.className = 'decrypt-btn';
                btn.innerHTML = '<i class="fa-solid fa-lock"></i> Decrypt';
                btn.onclick = function() { handleDecrypt(contentId, originalEncrypted); };
                
                // Insert button after the span
                msgSpan.parentNode.insertBefore(btn, msgSpan.nextSibling);
            }
        });
    }

    // --- 4. Add Message to UI ---
    function addMessage(content, sender, type, isEncrypted = false) {
        // Lock old messages before showing the new one
        lockAllMessages();

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        
        let html = "";
        if (sender) {
            html += `<span class="sender-name">${sender}</span>`;
        }

        const contentId = "msg-content-" + Date.now() + Math.random();

        if (isEncrypted) {
            // Store the encrypted text in 'data-encrypted' so we can recover it later
            html += `
                <span id="${contentId}" class="cipher-text" data-encrypted="${content}">${content}</span>
                <button class="decrypt-btn" onclick="handleDecrypt('${contentId}', '${content}')">
                    <i class="fa-solid fa-lock"></i> Decrypt
                </button>
            `;
        } else {
            // For my own messages (sent), we display them normally, 
            // but we won't show the password in the bubble.
            html += `<span class="text-content">${content}</span>`;
        }
        
        messageDiv.innerHTML = html;
        messageLog.appendChild(messageDiv);
        messageLog.scrollTop = messageLog.scrollHeight;
    }

    // --- 5. Decrypt Handler ---
    window.handleDecrypt = function(elementId, encryptedText) {
        const password = prompt("Enter the password to unlock:");
        
        if (password) {
            const shift = getShiftFromPassword(password);
            const plainText = decrypt(encryptedText, shift);
            
            const textElement = document.getElementById(elementId);
            const button = textElement.nextElementSibling;
            
            // Show Plain Text
            textElement.textContent = plainText;
            textElement.classList.remove("cipher-text");
            textElement.classList.add("decrypted-content");
            
            // Remove the Lock Button
            if(button) button.remove();
        }
    };

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text === "") return;

        if (state === "GET_USERNAME") {
            username = text;
            socket.emit('user_joined', username);
            state = "CHAT";
            messageInput.placeholder = "Type a secure message...";
            addMessage(`You joined as ${username}`, null, "system");
        } else {
            // Ask for password
            const password = prompt("Set a password for this message (or leave empty for default):");
            
            // Calculate shift
            const shift = getShiftFromPassword(password || "");
            const encryptedText = encrypt(text, shift);
            
            // Show my message (Plain text, NO PASSWORD SHOWN)
            addMessage(text, "You", "my-message", false);
            
            // Send encrypted to server
            socket.emit('new_message', { 'encrypted_text': encryptedText });
        }
        messageInput.value = "";
    }

    // Listeners
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    socket.on('server_message', (msg) => {
        addMessage(msg, null, "system");
    });

    socket.on('message_broadcast', (data) => {
        addMessage(data.encrypted_text, data.username, "other-user", true);
    });
});