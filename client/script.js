import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://kodechat.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " ";

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

const closeButton = document.getElementById('LetsChatButton');

closeButton.addEventListener('click', closePopUp );

function closePopUp(){

    // e.preventDefault();
    
    const tl = gsap.timeline()

    document.body.style = 'overflow: auto;'

    tl.to('.pop-section', {
        y: '1100',
        duration: 0.50,
        opacity: 0,

    })

    tl.to('#form', {y:0});

    tl.to('.footer-text', {y:0})

    tl.to('.scroll-down', {opacity: 1})

}



async function renderData() {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();
    document.querySelector('#randomQuote').innerHTML = `<p>Did you know?</p> <p>${data.text}</p>`;
  }

  renderData();

//   Typing effect

  function typingEffect(str, element) {
    let i = 0;
    let text = "";
    let speed = 50;
  
    function type() {
      if (i < str.length) {
        text += str.charAt(i);
        element.innerHTML = text;
        i++;
        setTimeout(type, speed);
      }
    }
  
    type();
  }
  

const welcomeMessage = document.querySelector(".welcomeMessage");
const name = document.querySelector(".name");
const bottomSection = document.querySelector("#bottom-section");
gsap.set(bottomSection, {y: 20, opacity: 0});
gsap.set(welcomeMessage, { opacity: 0})


     
const tl = gsap.timeline()

const typing = (name, element)=>{
    typingEffect(name.innerText, element)
}

typing(name, name);

setTimeout(()=>{

    typingEffect(welcomeMessage.innerText, welcomeMessage); 
    tl.to(welcomeMessage, {opacity: 1})
   tl.to(bottomSection, {delay:1, opacity: 1})



  

}, 1200)



document.querySelector('#form').addEventListener('click', ()=>{

    document.querySelector('.scroll-down').style.display = "none";

})


