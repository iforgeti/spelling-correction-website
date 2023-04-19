

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

// for (var i = 0; i < allOptionContents.length; i++)

// function handleButtonClick(optionId, buttonId) {
//     alert("Option " + optionId + ", Button " + buttonId + " clicked!");
// }


function Replace(option,subOption){
    const itxt_Editor = document.getElementById('inputText');
    const currentText = itxt_Editor.innerText;
    const newText = currentText.replace(option, subOption);
    itxt_Editor.innerText = newText;

    var suggestionsList = document.getElementById('suggestions');
    const listItemToRemove = Array.from(suggestionsList.children).find(item => {
        return item.querySelector("span").textContent === option;
    });
    if (listItemToRemove) {
        listItemToRemove.remove();
    }
}

var itxt_Editor = document.getElementById('inputText');


itxt_Editor.addEventListener('keydown', function(event) {

    if (event.code === "Space" || event.code === 'Enter') {
    //   console.log('Space bar pressed!');
      var input_text = itxt_Editor.innerText;
      var words = input_text.trim().split(/\s+/);
      var wordCount = words.length;
      console.log(input_text)
      if (wordCount >= 2){
        fetch('/suggestions?inputText=' + encodeURIComponent(input_text))
            .then(response => response.json())
            .then(data => {
            var misspell_dict = data['suggestions'];
            var suggestionsList = document.getElementById('suggestions');
            suggestionsList.innerHTML = '';
            for (const option in misspell_dict) {
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
                listItem.appendChild(optionContent);
                suggestionsList.appendChild(listItem);

                // const itxt_Editor = document.getElementById('inputText');
                // const currentText = itxt_Editor.innerHTML;
                // var startPos = itxt_Editor.selectionStart;
                // var endPos = itxt_Editor.selectionEnd;

                // // Create a regular expression pattern with the word or phrase as a variable
                // const regexPattern = new RegExp(`\\b(${option})\\b`, "g");

                // // Replace all occurrences of the word or phrase with the word or phrase wrapped in a span with red-underline class
                // const newText = currentText.replace(regexPattern, '<span class="red-underline">'+option+'</span>');
                // itxt_Editor.innerHTML = newText;

                



            }
            // var itxt_Editor = document.getElementById('inputText');
            // PosEnd(itxt_Editor);


          
        });
      }
    }
});

// function PosEnd(end) {
//     var len = end.innerText.length;
      
//     // Mostly for Web Browsers
//     if (end.setSelectionRange) {
//         end.focus();
//         end.setSelectionRange(len, len);
//     } else if (end.createTextRange) {
//         var t = end.createTextRange();
//         t.collapse(true);
//         t.moveEnd('character', len);
//         t.moveStart('character', len);
//         t.select();
//     }
// }


// onmouseenter

// var incorrectWord = null; // Variable to store the current incorrect word

// // Add event listener to submit button
// document.getElementById('submitButton').addEventListener('click', function(event) {
//     event.preventDefault(); // Prevent form submission
//     var inputText = document.getElementById('inputText').innertext;
//     // Use your spelling correction logic to identify incorrect words and get suggestions
//     var suggestions = ["Saab", "Volvo", "BMW"];//getWordSuggestions(inputText); // Replace this with your own logic
//     if (suggestions.length > 0) {
//         showWordSuggestions(suggestions); // Show word suggestions in the popup
//     }
// });

// // Function to show word suggestions in the popup
// function showWordSuggestions(suggestions) {
//     var popupContainer = document.getElementById('wordSuggestionPopup');
//     popupContainer.innerHTML = ''; // Clear previous suggestions
//     for (var i = 0; i < suggestions.length; i++) {
//         var suggestion = document.createElement('div');
//         suggestion.textContent = suggestions[i];
//         suggestion.classList.add('suggestion');
//         // Add event listener to each suggestion
//         suggestion.addEventListener('mouseover', function() {
//             this.style.textDecoration = 'underline'; // Add underline when hovering over suggestion
//         });
//         suggestion.addEventListener('mouseout', function() {
//             this.style.textDecoration = 'none'; // Remove underline when not hovering over suggestion
//         });
//         suggestion.addEventListener('click', function() {
//             replaceIncorrectWord(this.textContent); // Replace incorrect word with selected suggestion
//             popupContainer.style.display = 'none'; // Hide popup
//         });
//         popupContainer.appendChild(suggestion);
//     }
//     // Position the popup below the cursor
//     popupContainer.style.display = 'block';
//     popupContainer.style.top = (event.clientY + 10) + 'px';
//     popupContainer.style.left = event.clientX + 'px';
// }

// // Function to replace incorrect word with selected suggestion
// function replaceIncorrectWord(suggestion) {
//     if (incorrectWord !== null) {
//         var inputText = document.getElementById('inputText');
//         var text = inputText.innertext;
//         text = text.replace(incorrectWord, suggestion);
//         inputText.innertext = text;
//         incorrectWord = null;
//     }
// }

// document.getElementById('submitButton').addEventListener('click', function(event) {
//   event.preventDefault(); // Prevent form submission
//   document.getElementById('inputText').innerText = 'test submit'; // Set textarea value
// });
