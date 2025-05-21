const responseField = document.querySelector('.response-box');
const inputBox = document.querySelector('.input-box');
const submitBtn = document.querySelector('.send-btn');
const micElement = document.querySelector('.mic-btn');
const headingElement = document.querySelector('.heading')
const apiUrl = 'https://ai-model-debesh.onrender.com/question=';
const pingURL = 'https://ai-model-debesh.onrender.com';
const listeningTextElement = document.querySelector('.listening-text');
function createQuestion(question) {
    return `${apiUrl+question}`;
}
connectToServer();
async function connectToServer() {

    try {
    const response = await fetch(pingURL);
    document.getElementById('overlay').style.display = 'none';   
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    
    }
    return 1;

    } catch (error) {
      return 0;
    }
}

inputBox.addEventListener("keydown",(event)=>{
  if(event.key === "Enter" && !event.shiftkey) {
    event.preventDefault();
    submitRequest(inputBox.value);
  }
})

async function getResponse(question) {
    const url = createQuestion(question);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      const result = await response.json();
      
      return (result.candidates[0].content.parts[0].text);
      
      
    } catch (error) {
        console.error(error.message);
        return error.message === 'Failed to fetch'? 'failed to connect..check your internet connection.':'Sorry!<br> No answer available regarding your question';
        
    }
}

function addLoader(value) {
  if(value ===1) {
    const loader = 
    `<div class="loader"></div>`;
    responseField.innerHTML += loader;
  }
  
}
async function removeLoader() {
  document.querySelector('.loader').remove();
}

function scrollToBottom() {
  
  responseField.scrollTop = responseField.scrollHeight;
  
}

// function printWordByWord(text, delay, elementId) {
//     const words = text.split(' ');
//     let index = 0;   
    
//     function printNextWord() {
//       if (index < words.length) {
//         elementId.innerHTML += words[index] + ' '; // Add the word to the HTML element
//         index++;
//         setTimeout(printNextWord, delay);
//       }
//     }
//     printNextWord();


// }
async function delay(timeInMiliseconds) {
  setTimeout(()=>{

  },timeInMiliseconds)
}
function removeAsterisks(text) {
  return text.replace(/\*/g, '');
}

function formatText(text) {
  // Convert **bold** to <strong>bold</strong>
  let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Replace single asterisks (not part of double) with <br>
  formatted = formatted.replace(/(^|[^*])\*(?!\*)([^*]|$)/g, (_, before, after) => {
    return `${before}<br>${after}`;
  });

  return formatted;
}

async function submitRequest(input,type) {

  if(input !== '') {

    
    const userMsgElement = 
    `<div class="msg user-msg">
      <p class="who-user">You</p>
      ${input}
    </div>`;
    if(type !== 'a') {
      responseField.innerHTML += userMsgElement;

    }
    
    const question = input;
    inputBox.value = '';
    type !== 'a'?addLoader(1):addLoader(0);
    let res = '';
    let botScript = '';
    let formattedResponse = '';
    if(type !== 'e') {
      res = await getResponse(question);
      botScript = removeAsterisks(res);
      formattedResponse = formatText(res);
    }
    //console.log(res);
    delay(2000);
    removeLoader();
    
    if(type === 'e') {
      res = input;
    }
    const botMsgElement = 
    `<div class="msg bot-msg">
      <p class="who-bot">Curious</p>
      ${formattedResponse}
    </div>`;
    if(type === 'v') {
      const botVoice = speechSynthesis.getVoices()[4];    
      const utterance = new SpeechSynthesisUtterance(botScript);  
      utterance.voice = botVoice;
      speechSynthesis.speak(utterance);
    }
    if(type !== 'a') {
      responseField.innerHTML += botMsgElement;
    }
    
    scrollToBottom();
        
  }
}

//   const text = "Hello, this is an example of printing word by word!";
//   const delay = 500;
//   const elementId = 'output';  

let onGoing = false;

submitBtn.addEventListener('click', async()=>{

    submitRequest(inputBox.value,'t');
    
    //console.log(res)
})
/////// Voice Recognition Code::::::::::::::::


async function startRecognition() {

  listeningTextElement.innerHTML = 'listening...';
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Speech Recognition not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = async (event) => {
    listeningTextElement.innerHTML = '';
    const transcript = event.results[0][0].transcript;
    // const speechRes = await getResponse(transcript)
    // console.log(speechRes);
    submitRequest(transcript,'v');    
    // Speak it back    
  };

  recognition.onerror = (event) => {
    const errorText = 'Error: ' + event.error;
    submitRequest(errorText,'e');
  };
}
window.speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};
micElement.addEventListener('click', ()=>{
    startRecognition();
})
