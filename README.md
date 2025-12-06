
# CipherStream: Auto-Locking Secure Chat

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-SocketIO-green?style=for-the-badge&logo=flask)
![Security](https://img.shields.io/badge/Feature-Auto--Lock-red?style=for-the-badge)

📌 Project Overview

**CipherStream** is a secure, real-time messaging application designed with a "Zero-Knowledge" approach. It features a unique **Auto-Lock System** that ensures sensitive message history is never left exposed on the screen.

Unlike standard chat apps, this system prioritizes privacy by enforcing **Hidden Passwords** (the sender never sees the key on screen) and **Ephemeral Visibility** (messages automatically re-encrypt themselves).
## Screenshot 
<img width="611" height="816" alt="Screenshot (49)" src="https://github.com/user-attachments/assets/b782a365-4947-4de4-9a5b-6c829333d520" />
<img width="626" height="826" alt="Screenshot (50)" src="https://github.com/user-attachments/assets/4b65cb92-da62-43ee-bce5-41d2e0115d99" />
<img width="620" height="878" alt="Screenshot (51)" src="https://github.com/user-attachments/assets/2afbc8b0-0311-4c18-9791-21a53abf0dd8" />
<img width="628" height="810" alt="Screenshot (52)" src="https://github.com/user-attachments/assets/2f4bdd36-083e-48d4-b0b8-cde6891f9f3f" />
<img width="645" height="831" alt="Screenshot (53)" src="https://github.com/user-attachments/assets/dd65493b-98e5-424f-a44b-fd0a0b977a6b" />


## 🚀 Key Features

### 🔒 1. Hidden Password Input
When you send a secure message, you are prompted to set a password.
* **Privacy:** The password is converted into an encryption key immediately.
* **Security:** The password is **never displayed** in the chat bubble—not even to the sender. This prevents "shoulder surfing" (people looking at your screen).

### ⏱️ 2. The "Auto-Lock" Mechanism
The standout feature of this project is the dynamic security state of the chat window:
* **The Trigger:** Whenever a *new* message arrives (or is sent).
* **The Action:** All currently decrypted (readable) messages on the screen instantly **revert to ciphertext**.
* **The Benefit:** This ensures that if you walk away from your computer or receive a new notification, your previous sensitive conversation is automatically hidden.

### 🛡️ 3. Client-Side Encryption
* All encryption happens in the browser (JavaScript) before data reaches the network.
* The server only relays encrypted strings (e.g., `Khoor`) and never has access to the plain text or the passwords.

---

## 🛠️ Tech Stack

* **Backend:** Python 3, Flask, Flask-SocketIO
* **Frontend:** HTML5, CSS3, JavaScript (ES6)
* **Communication:** WebSockets (Real-time, bi-directional)
* **Algorithm:** Custom Caesar Cipher Implementation (Proof of Concept)

---

## ⚙️ Installation & Run

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/cipherstream.git](https://github.com/your-username/cipherstream.git)
    cd cipherstream
    ```

2.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Start the Server**
    ```bash
    python server_web.py
    ```

4.  **Open the App**
    Go to `http://127.0.0.1:5556` in your browser.

---

## 📖 How to Use

### 1. Joining
* Open the app and type your **Username** to join the session.

### 2. Sending a Secure Message
* Type your message and hit Enter.
* A browser prompt will ask: *"Set a password for this message"*.
* Enter a secret code (e.g., `123`).
* **Result:** The message is sent. On your screen, you see the text, but the password `123` is hidden.

### 3. Receiving & Decrypting
* Incoming messages appear as gray **Ciphertext** blocks (scrambled text).
* Click the **Decrypt** button.
* Enter the sender's password.
* If correct, the text turns **Green** and becomes readable.

### 4. Testing "Auto-Lock"
* Leave a message decrypted (Green) on your screen.
* Ask a friend (or use a second tab) to send a *new* message.
* **Observe:** The moment the new message hits your chat, the Green message instantly locks back into gray Ciphertext.

---

## 📂 Project File Structure

```text
/Project
├── server_web.py       # Flask Server (Relays encrypted data)
├── requirements.txt    # Dependencies
├── templates/
│   └── index.html      # Chat UI
└── static/
    ├── style.css       # Styling for Locked/Unlocked states
    └── script.js       # Auto-Lock & Encryption Logic
````

## 🔮 Future Improvements

  * Implement AES-256 for military-grade encryption.
  * Add a visual timer for self-destructing messages.
  * Add secure image transfer.

## 📄 License

This project is open-source and available under the MIT License.

```
```
