const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageFrom = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-messeage', data=>{
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name=>{
    appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name=>{
    appendMessage(`${name} disconnected`)
})

messeageFrom.addEventListener('submit',e => {
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(mesage) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}