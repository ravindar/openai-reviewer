import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
let useRemote = false;

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = '';
    }

  }, 300);
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueID() {
  const timestamp = Date.now();
  const random = Math.random();
  const hexadeciamlString = random.toString(16);
  return `id-${timestamp}-${hexadeciamlString}`;
}

function chatStripe(isAi, value, uniqueId){
  return (
    `
      <div class="wrapper ${isAi && 'ai'}" >
        <div class="chat">
            <div class="profile">
                <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
            </div>
            <div class = "message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
  )
}

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const askedQuestion = formData.get('prompt');
  const criteria = formData.get('criteria');

  const submitType = e.submitter.value;
  let serverlocation = 'https://localhost:5001/';
  if (useRemote) {
      serverlocation = 'https://zengine-reviewer.onrender.com/';
  }

  let call_url = serverlocation+'summary/';
  if (submitType === 'review') {
    call_url = serverlocation+'smart_review/';
  }
  console.log(call_url);

  chatContainer.innerHTML += chatStripe(false, askedQuestion);
  form.reset();

  const uniqueId = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);
  console.log(askedQuestion);

  const response = await fetch(call_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({prompt: askedQuestion, model_criteria: criteria})
  });
  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const error = await response.text();

    messageDiv.innerHTML = "Something went wrong"
    alert(error)
  }
}

form.addEventListener('submit', handleFormSubmit);
form.addEventListener("keyup", (e)  => {
  if (e.key === "Enter") {
    handleFormSubmit(e);
  }
});

document.getElementById('toggle').addEventListener('change', function() {
  if(this.checked) {
    console.log('Toggle is ON');
    useRemote = true;
  } else {
    console.log('Toggle is OFF');
    useRemote = false;
  }
});