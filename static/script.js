let dataList = [];

// Set focus on the inputText div
document.getElementById('inputText').focus();

let save_text = "";
// Get the text cursor position
var sel = window.getSelection();
let countId = 0;

let mode = "manual";

var itxt_Editor = document.getElementById('inputText');
var suggestions = document.getElementById('suggestions');
var auto_button = document.getElementById('autoButton');
var Form = document.getElementById('Form-container');


auto_button.addEventListener('click', function() {

    // Toggle the display property of suggestions list
    if (itxt_Editor.style.width === '100%') {
        itxt_Editor.style.width = '70%';
        suggestions.style.width = '300px';

        auto_button.style.backgroundColor = "#ffffff";
        auto_button.style.color = 'black';
        Form.style.backgroundColor = '#262626';
    } else {
        itxt_Editor.style.width = '100%';
        suggestions.style.width = '0px';

        auto_button.style.backgroundColor ='black';
        auto_button.style.color = '#FFFF00';
        Form.style.backgroundColor = '#8B0000'
    }

    if (mode === "manual") {
        mode = "auto";
        fetch_auto(true);
        console.log("auto")
        
    } else {
        mode = "manual";
        console.log("manual")
    }
  });



function expandOption(optionId) {
    var optionContent = document.getElementById("option-" + optionId);
    var allOptionContents = document.getElementsByClassName("option-content");
    for (var i = 0; i < allOptionContents.length; i++) {
        if (allOptionContents[i].id !== "option-" + optionId) {
            allOptionContents[i].style.maxHeight = "0px";
        }
    }
    optionContent.style.maxHeight = optionContent.style.maxHeight === "0px" ? optionContent.scrollHeight + "px" : "0px";


    var inputText = document.getElementById('inputText');
    var text = inputText.innerHTML;
    const wordpattern = new RegExp(`\\b(${optionId})\\b`, "g");
    var highlightedText = text.replace(/<span class="highlighted">/g, '').replace(/<\/span>/g, '');
    if (optionContent.style.maxHeight === "0px") {
        highlightedText = highlightedText.replace(wordpattern, optionId);
    } else {
        highlightedText = highlightedText.replace(wordpattern, '<span class="highlighted">$&</span>');
    }
    inputText.innerHTML = highlightedText;

}



function Replace(option, subOption) {
    const itxt_Editor = document.getElementById('inputText');
    const currentText = itxt_Editor.innerText;

    // Use regular expression to match whole words only
    const regex = new RegExp("\\b" + option , "g");
    const newText = currentText.replace(regex, subOption);
    itxt_Editor.innerText = newText;

    var suggestionsList = document.getElementById('suggestions');
    const listItemToRemove = Array.from(suggestionsList.children).find(item => {
        return item.querySelector("span").textContent === option;
    });
    if (listItemToRemove) {
        listItemToRemove.remove();
    }
}

function Ignore(option){

    dataList.push(option);

    expandOption(option)

    var suggestionsList = document.getElementById('suggestions');
    const listItemToRemove = Array.from(suggestionsList.children).find(item => {
        return item.querySelector("span").textContent === option;
    });
    if (listItemToRemove) {
        listItemToRemove.remove();
    }
}


function add_misspell(misspell_dict) {
    var suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';
    for (const option in misspell_dict) {
        if (dataList.indexOf(option) === -1){
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.addEventListener("click", function() {
                // Call the expandOption() function with the corresponding option index
                expandOption(option);
            });
            const optionTitle = document.createElement("span");
            optionTitle.textContent = option;
            listItem.appendChild(optionTitle);
            const optionContent = document.createElement("div");
            optionContent.className = "option-content";
            optionContent.id = "option-" + option;
            
            misspell_dict[option].forEach(subOption => {

                const subOptionButton = document.createElement("button");
                subOptionButton.className = "sub-option-button";
                subOptionButton.textContent = subOption;
                subOptionButton.addEventListener("click", function() {
                    // Call the expandOption() function with the corresponding option index
                    Replace(option,subOption);
                });
                optionContent.appendChild(subOptionButton);

            });
            
            const add_option = document.createElement("div");
            add_option.className = "add-content";
            const ignoreButton = document.createElement("button");
            ignoreButton.className = "ignore-button"
            ignoreButton.textContent = "Ignore"
            ignoreButton.addEventListener("click", function() {
                // Call the expandOption() function with the corresponding option index
                Ignore(option);
            });
            add_option.appendChild(ignoreButton);
            optionContent.appendChild(add_option);
            listItem.appendChild(optionContent);

            suggestionsList.appendChild(listItem);
        }
    }
}

function fetch_manual() {

    //   console.log('Space bar pressed!');
    var input_text = itxt_Editor.innerText;
    var words = input_text.trim().split(/\s+/);
    var wordCount = words.length;
    console.log(input_text);
    var cursorPosition = sel.anchorOffset;
    console.log('Text cursor position: ' + cursorPosition);
    if (wordCount >= 2){

        fetch('/suggestions?inputText=' + encodeURIComponent(input_text)+'&cursorPosition=' + cursorPosition)
            .then(response => response.json())
            .then(data => {
                add_misspell(data['suggestions']);
        
        });
    }
    
}

function auto_fix(misspell_text,correct_text) {

    const currentText = itxt_Editor.innerText;

    // Replace text using desired logic
    var replacedText = currentText.replace(misspell_text, correct_text);

    // Set the replaced text back to the div element
    itxt_Editor.innerText = replacedText;

    const length = itxt_Editor.textContent.length;
    window.getSelection().collapse(itxt_Editor.firstChild, length);
}

function fetch_auto(isend) {

    //   console.log('Space bar pressed!');
    if (isend){
        var input_text = itxt_Editor.innerText;
    }else{
        var full_text = itxt_Editor.innerText;
        var words = full_text.split(" ");
        // Extract the text before the last word
        var input_text = words.slice(0, -1).join(" ");
    }
    
    var words = input_text.trim().split(/\s+/);
    var wordCount = words.length;
    console.log(input_text);
    var cursorPosition = sel.anchorOffset;
    console.log('Text cursor position: ' + cursorPosition);
    if (wordCount >= 3){

        fetch('/suggestions_auto?inputText=' + encodeURIComponent(input_text)+'&cursorPosition=' + cursorPosition)
            .then(response => response.json())
            .then(data => {
                auto_fix(input_text,data['suggestions']);
        
        });
    }
    
}


var debounceTimer;
let timeoutId;

itxt_Editor.addEventListener('keydown', function(event) {

    if (mode === "manual"){
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(function() {
        
            fetch_manual();
            
        },1200);

    }else{
        // check if it enter or space
        if (event.code === "Space" || event.code === "Enter") {
            
            const range = sel.getRangeAt(0);
            const node = range.startContainer;
            const text = node.textContent;
            const textBeforeCursor = text.substring(0, range.startOffset);
            const lastCharBeforeCursor = textBeforeCursor.slice(-1);
            
            // check if it space or enter before 
            if (!/\s/.test(lastCharBeforeCursor) && lastCharBeforeCursor !== '') {
                console.log('Space bar or Enter pressed, and text before cursor is not a space or enter.');
                // Clear the previous timer, if any
                fetch_auto(true);
                
                // clearTimeout(timeoutId);
                // timeoutId = setTimeout(function() {
                //     fetch_auto(true);
                // }, 3000);


             }  

            // clearTimeout(timeoutId);

        }


    }

});

