
console.log("Starting...")

openaikey = ""

msgs = []

elems = {
    loginScreen: document.getElementById("login-screen"),
    chatScreen: document.getElementById("chat-screen"),
    openaikey: document.getElementById("openai-key"),
    chatInput: document.getElementById("chat-input"),
    sendButton: document.getElementById("send-button"),
    chatWindow: document.getElementById("chat-window"),
}

elems.openaikey.focus()

login = (key) => {
    openaikey = key
    console.log(openaikey)
    elems.loginScreen.style.display = "none"
    elems.chatInput.focus()
}

elems.openaikey.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        login(elems.openaikey.value)
    }
}

paintMessages = () => {
    elems.chatWindow.innerHTML = ""
    msgs.forEach((msg) => {
        user = msg.isGPT ? "gpt" : "you"
        elems.chatWindow.innerHTML += `<p class="${user}">${msg.text}</p>`
    })
    elems.chatWindow.scrollTop = elems.chatWindow.scrollHeight
}

sendUserMessage = (message) => {
    if (message === "") return
    console.log(message)
    msgs.push({ isGPT: false, text: message })
    paintMessages()
    elems.chatInput.focus()
    prompt = msgs.slice(-50).reduce(function (prompt, msg) {
        return prompt + (msg.isGPT ? "GPT: " : "You: ") + msg.text + "\n "
    }, "")
    fetch(`https://api.openai.com/v1/engines/davinci/complete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaikey}`,
        },
        body: JSON.stringify({
            "prompt": prompt,
            "max_tokens": 5,
        }),
    })
        .then(r => r.json())
        .then(json => {
            console.log(json)
            msgs.push({ isGPT: true, text: json.choices[0].text })
            paintMessages()
        })
        .catch(e => console.log(e))
}

elems.chatInput.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        sendUserMessage(elems.chatInput.value)
        elems.chatInput.value = ""
    }
}

elems.sendButton.onclick = (e) => {
    e.preventDefault()
    sendUserMessage(elems.chatInput.value)
    elems.chatInput.value = ""
}
