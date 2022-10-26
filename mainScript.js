import { fiveLetterWords } from "./5LetterWords.js";
import { wordsToGuess } from "./wordsToGuess.js";
var entryRowElements = document.getElementsByClassName('entry-letter-rows'); 
const keyboard_buttons = document.getElementsByClassName("keyboard-button");
const chancesToGuess = entryRowElements.length
var activeSquareElements;
const wordsLength = entryRowElements[0].children.length; //length of words to guess

//Modal elements
var modal = document.getElementById('myModal'); //modal box that pops up at the end of the game
var close = document.getElementById('close');
var resultText = document.getElementById('resultText')
var correctWordContainer = document.getElementById('correctWordContainer');

//New game setup:
var wordGuessed =false;
var wordToGuessParagraph;
var deletingActive = true;
var submitActive = true;
var activeRowNumber = 0; 
var wordToGuess;


const drawWordToGuess = function (){
//Function draws wordToGuess from wordsToGuess list
    if (wordsToGuess != ''){
    wordToGuess = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)]
    }else{
        console.log("Odgadnięto już wszystkie możliwe hasła")
    }
    
};
drawWordToGuess();

function typeLetter(event){    
//Function allows user to type letter on square elements

//idLetter define depending on whether it was typed by button or keyboard
    var idLetter;
    try{
    idLetter = event.target.id;
    }catch{
    idLetter = event;
    };
    
//It selects a square and allow user to write on entry-letter-square elements
    activeSquareElements = entryRowElements[activeRowNumber].children;
    for (var i = 0; i < activeSquareElements.length; i++){
        if (activeSquareElements[i].innerText == ""){
            activeSquareElements[i].innerText = idLetter;
            break;
            
        };
        
    };
};

const activeRowNumberIncrease = function(){
//If activeRowNumber is equal to 5 (Value of 'activeRowNumber' is 6 then), don't increase the value of variable
    if(activeRowNumber!=entryRowElements.length-1){
        activeRowNumber +=1;
    };
};

const coloringElements = function (wordEntered, wordToGuess){
//Function check if the letters in the given word appear in the wordToGuess and colors them
    let lettersToColorArray = wordEntered.split("");
    var coloredLettersArray = []; 
    var indexRestLetters = []; 

    for (var i = 0; i < wordEntered.length; i++){
        if (lettersToColorArray[i]==wordToGuess[i]){ //If the letter appear in the right place in the wordToGuess
            
            entryRowElements[activeRowNumber].children[i].classList.add("fullCorrectLetter");
            coloredLettersArray.push(lettersToColorArray[i]);
            
            document.getElementById(`${lettersToColorArray[i]}`).classList.add('fullCorrectLetter');

            //Delete yellow color, if any
            document.getElementById(`${lettersToColorArray[i]}`).classList.remove('halfCorrectLetter');
            
        //If there is no such letter in the wordToGuess
        }else if (wordToGuess.includes(lettersToColorArray[i]) == false){
            document.getElementById(`${lettersToColorArray[i]}`).classList.add('notCorrectLetter');
            entryRowElements[activeRowNumber].children[i].classList.add('notCorrectLetter');
            coloredLettersArray.push(lettersToColorArray[i])
        }else{
            indexRestLetters.push(i)
        };
    };
    
    
    for (var i = 0; i<indexRestLetters.length; i++){
//If wordToGuess contain given letter, but it has already been marked with green or yellow
        if(wordToGuess.split(lettersToColorArray[indexRestLetters[i]]).length-1<=coloredLettersArray.toString().split(lettersToColorArray[indexRestLetters[i]]).length-1){
            entryRowElements[activeRowNumber].children[indexRestLetters[i]].classList.add('notCorrectLetter');
//If wordToGuess contain given letter but it was place in wrong position and hasn't been marked more times than it should. 
        }else{
            coloredLettersArray.push(lettersToColorArray[indexRestLetters[i]])
            entryRowElements[activeRowNumber].children[indexRestLetters[i]].classList.add('halfCorrectLetter');
//If the keyboard button wasn't marked green, color it yellow. If it was, don't change the color
            if (document.getElementById(`${lettersToColorArray[indexRestLetters[i]]}`).className != 'keyboard-button fullCorrectLetter'){
                console.log("true")
                document.getElementById(`${lettersToColorArray[indexRestLetters[i]]}`).classList.add('halfCorrectLetter');
            }
        }
    }
    
};

const checkIfWordGuessed = function(wordEntered, wordToGuess){
    coloringElements(wordEntered, wordToGuess)
//Display modal box if given word == wordToGuess
    if (wordEntered == wordToGuess){
        modalDisplay(wordGuessed = true);
    }else{

//If function shows that, the given word is wrong, and active row number is equal to the number of all rows, display modal box with lose        
        if(activeRowNumber==entryRowElements.length-1) {
            modalDisplay(wordGuessed=false);
        };
        activeRowNumberIncrease();
        activeSquareElements = entryRowElements[activeRowNumber].children; 
    };
};
function showErrorMessage(message){
    var toastElement = document.getElementById('toast-container');
    toastElement.className = "visible";
    document.getElementById("toast").innerText = message
    setTimeout(function(){
        toastElement.classList.remove("visible");
        
    }, 1900)

}
const correctnessTester = function (wordEntered, wordToGuess){
//Check the correctness of the word with the rules 
    var index = fiveLetterWords.indexOf(wordEntered.toLowerCase());
    if (wordEntered.length != wordsLength ){
        showErrorMessage("Wyraz musi mieć " + wordsLength + " " + "liter")
        return false 
    }else if(index==-1){
        showErrorMessage("Brak słowa w słowniku");

    }else{
        return checkIfWordGuessed(wordEntered, wordToGuess) //True albo false 
    };
};

function delete_letterClick() {
    if (deletingActive){
        activeSquareElements = entryRowElements[activeRowNumber].children;
        for(var i=activeSquareElements.length-1; i>=0;i--){
            if (activeSquareElements[i].innerText !=""){
            activeSquareElements[i].innerText="";
            break;
            };
            
        };
    };
};
delete_letter.onclick = delete_letterClick
//Modal popup:
const modalDisplay = function(wordGuessed){
//Change modal display "none" to "flex"
    modal.style.display = "flex";
    deletingActive = false;
    submitActive = false;
    
    if (wordGuessed){
        resultText.innerText = "Gratulacje";
    }else {
        resultText.innerText = "Porażka"
    };

//Creates new element in which the wordToGuess will appear

    wordToGuessParagraph = document.createElement('span');
    correctWordContainer.appendChild(wordToGuessParagraph)
    wordToGuessParagraph.innerText = wordToGuess
    wordToGuessParagraph.setAttribute('id', 'correctWord')
    
//After closing, remove element that stores the wordToGuess(string) and set modal display to "none"(invisible)
    close.onclick = function(){
        modal.style.display = "none";
        correctWordContainer.removeChild(wordToGuessParagraph)
        submitActive= true;
    };
    

};

//Reset
newWord.onclick = function(){
    modal.style.display = "none"
    correctWordContainer.removeChild(wordToGuessParagraph);
    activeRowNumber = 0;
    deletingActive = true;
    submitActive = true;
    
    //Delete previous word from wordsToGuess list 
    var index = wordsToGuess.indexOf(wordToGuess);
    if (index !== -1){
        wordsToGuess.splice(index, 1);
    };
    drawWordToGuess();
    console.log(wordToGuess);
    for (var i =0; i < entryRowElements.length; i++){
        for (var j=0; j < entryRowElements[i].children.length; j++){
            entryRowElements[i].children[j].innerText = "";
            entryRowElements[i].children[j].setAttribute('class', 'entry-letter-square');
        };
    };
    for (var i = 0; i <keyboard_buttons.length; i++){
        keyboard_buttons[i].setAttribute('class', 'keyboard-button');
    }

};
//Bind keyboard elements to onclick

const bindOnclickToKeyboard = function (){
    for(var i=0; i<keyboard_buttons.length; i++){
        if (keyboard_buttons[i].id !== 'delete_letter' && keyboard_buttons[i].id !=='enter'){
        keyboard_buttons[i].addEventListener('click', typeLetter, true)
        };
    };
}();


function enterClick () {
    if(submitActive){
        let wordEntered = "";
        for (var i = 0; i < activeSquareElements.length; i++){
            wordEntered += activeSquareElements[i].innerText
        };
        correctnessTester(wordEntered, wordToGuess)
    };
};
enter.onclick = enterClick;

//Bind typeLetter function to physical keyboard 
document.onkeydown = function(e){
    var key = e.key;
    
    if (key=="ą" || key=='ć' || key=='ę' || key=="ł" || key=='ó' || key=='ś' || key=='ń' || key=='ż' || key=="ź" || key=='q' || key=='w'|| key=='e' || key=='r' || key=="t" || key=='y' || key=='u'|| key=='i' || key=='o' || key=="p" || key=='a' || key=='s'|| key=='d' || key=='f' || key=="g" || key=='h' || key=='j'|| key=='k' || key=='l' || key=="z" || key=='x' || key=='c'|| key=='v' || key=='b' || key=="n" || key=='m'){
        typeLetter(key.toUpperCase());
    };
    if(key=="Enter"){
        enterClick();
    };
    if(key=="Backspace"){
        delete_letterClick();
    }
}


