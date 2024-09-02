const responseField = document.querySelector('.response-box');
const inputBox = document.querySelector('.input-box');
const submitBtn = document.querySelector('.submit-btn');


const apiUrl = 'https://ai-model-debesh.onrender.com/question=';



function createQuestion(question) {
    return `${apiUrl}/${question}`;
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
    const element = document.getElementById(elementId);
  
    function printNextWord() {
      if (index < words.length) {
        element.innerHTML += words[index] + ' '; // Add the word to the HTML element
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
      const res = await getResponse(question); 
      const totalDelay = res.length;

      responseField.classList.remove('loader')
      responseField.classList.add('response-box-style')   
      printWordByWord(res,100,'response-box')
      setTimeout(()=>{
        submitBtn.classList.remove('disable-btn');
        onGoing = false;
      },totalDelay*20)
      
  }
    
    //console.log(res)
})