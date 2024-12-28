var stompClient = null;
var username = new URLSearchParams(window.location.search).get('username');
document.getElementById('username').textContent = username;

// Assign a random color to each user of the app
var userColors = {};
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function connect() {
    var socket = new SockJS('/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        stompClient.subscribe('/topic/messages', function(messageOutput) {
            showMessage(JSON.parse(messageOutput.body));
        });

        stompClient.send("/app/chat", {}, JSON.stringify({
            'username': username,
            'content': username + ' has joined the chat'
        }));
    });
}

function sendMessage() {
    var messageInput = document.getElementById('messageInput').value;
    stompClient.send("/app/chat", {}, JSON.stringify({'username': username, 'content': messageInput}));
    document.getElementById('messageInput').value = '';
}

function leaveChat() {
    stompClient.send("/app/leave", {}, JSON.stringify({
        'username': username,
        'content': username + ' has left the chat'
    }));
    window.location.href = "/";
}

function showMessage(message) {
    var messagesDiv = document.getElementById('messages');
    var messageElement = document.createElement('p');

    // Assign a color to the user if not already assigned
    if (!userColors[message.username]) {
        userColors[message.username] = getRandomColor();
    }

    messageElement.style.backgroundColor = userColors[message.username];
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.marginBottom = '5px';
    messageElement.style.color = '#fff';
    messageElement.appendChild(document.createTextNode(message.username + ": " + message.content));

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

connect();
