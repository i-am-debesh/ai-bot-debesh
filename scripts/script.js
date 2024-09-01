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
    }
}

async function loadAnimation(res) {
    responseField.classList.add('loader');
    setTimeout(()=>{
        responseField.classList.remove('loader')
        responseField.classList.add('response-box-style')
        printWordByWord(res,100,'response-box');
    },3000)
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
  

  
  


submitBtn.addEventListener('click', async()=>{
    responseField.innerHTML = '';
    const question = inputBox.value;
    const res = await getResponse(question);
    await loadAnimation(res);
    
    console.log(res)
})