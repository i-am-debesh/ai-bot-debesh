const responseField = document.querySelector('.response-box');
const inputBox = document.querySelector('.input-box');
const submitBtn = document.querySelector('.send-btn');
const micElement = document.querySelector('.mic-btn');

const apiUrl = 'https://ai-model-debesh.onrender.com/question=';

function createQuestion(question) {
    return `${apiUrl+question}`;
}

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

async function loadAnimation() {
    responseField.classList.add('loader');
}

function printWordByWord(text, delay, elementId) {
    const words = text.split(' ');
    let index = 0;   
    
    function printNextWord() {
      if (index < words.length) {
        elementId.innerHTML += words[index] + ' '; // Add the word to the HTML element
        index++;
        setTimeout(printNextWord, delay);
      }
    }
    printNextWord();


}
  
//   const text = "Hello, this is an example of printing word by word!";
//   const delay = 500;
//   const elementId = 'output';  

let onGoing = false;

submitBtn.addEventListener('click', async()=>{
  if(responseField.classList.contains('response-box-style')) {
    responseField.classList.remove('response-box-style') 
  }
  if(onGoing === false) {
      onGoing = true;
      loadAnimation();
      submitBtn.classList.add('disable-btn');
      responseField.innerHTML = '';
      const question = inputBox.value;
      inputBox.value = '';
      const res = await getResponse(question); 
      const totalDelay = res.length;

      responseField.classList.remove('loader')
      responseField.classList.add('response-box-style')  
      printWordByWord(res,100,responseField)
      setTimeout(()=>{
        submitBtn.classList.remove('disable-btn');
        onGoing = false;
      },totalDelay*20)
      
  }
    
    //console.log(res)
})
/////// Voice Recognition Code::::::::::::::::


async function startRecognition() {
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
    const transcript = event.results[0][0].transcript;
    const speechRes = await getResponse(transcript)
    console.log(speechRes);
    
    // Speak it back
    const botVoice = speechSynthesis.getVoices()[4];
    
    const utterance = new SpeechSynthesisUtterance(speechRes);  
    utterance.voice = botVoice;
    speechSynthesis.speak(utterance);
    responseField.innerHTML = '';
    printWordByWord(speechRes,100,responseField);
  };

  recognition.onerror = (event) => {
    responseField.innerHTML = 'Error: ' + event.error;
  };
}
window.speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};
micElement.addEventListener('click', ()=>{
    startRecognition();
})
