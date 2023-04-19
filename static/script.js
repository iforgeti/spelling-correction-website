function expandOption(optionId) {
    var optionContent = document.getElementById("option-" + optionId);
    var allOptionContents = document.getElementsByClassName("option-content");
    for (var i = 0; i < allOptionContents.length; i++) {
        if (allOptionContents[i].id !== "option-" + optionId) {
            allOptionContents[i].style.maxHeight = "0px";
        }
    }
    optionContent.style.maxHeight = optionContent.style.maxHeight === "0px" ? optionContent.scrollHeight + "px" : "0px";
}

function handleButtonClick(optionId, buttonId) {
    alert("Option " + optionId + ", Button " + buttonId + " clicked!");
}

function Replace(option,subOption){
    const itxt_Editor = document.getElementById('inputText');
    const currentText = itxt_Editor.value;
    const newText = currentText.replace(option, subOption);
    itxt_Editor.value = newText;

    var suggestionsList = document.getElementById('suggestions');
    const listItemToRemove = Array.from(suggestionsList.children).find(item => {
        return item.querySelector("span").textContent === option;
    });
    if (listItemToRemove) {
        listItemToRemove.remove();
    }
}

var itxt_Editor = document.getElementById('inputText');

// document.getElementById('submitButton').addEventListener('click', function(event) {
//   event.preventDefault(); // Prevent form submission
//   document.getElementById('inputText').value = 'test submit'; // Set textarea value
// });



itxt_Editor.addEventListener('keydown', function(event) {

    if (event.code === "Space" || event.code === 'Enter') {
    //   console.log('Space bar pressed!');
      var input_text = itxt_Editor.value;
      var words = input_text.trim().split(/\s+/);
      var wordCount = words.length;
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
                
                const itxt_Editor = document.getElementById('inputText');
                const currentText = itxt_Editor.value;
                // Create a regular expression pattern with the word or phrase as a variable
                const regexPattern = new RegExp(`\\b(${option})\\b`, "g");

                // Replace all occurrences of the word or phrase with the word or phrase wrapped in a span with red-underline class
                const newText = currentText.replace(regexPattern, '<span class="red-underline">$1</span>');
                itxt_Editor.innerHTML = newText;



            }

          
        });
      }
    }
});


// onmouseenter

// var incorrectWord = null; // Variable to store the current incorrect word

// // Add event listener to submit button
// document.getElementById('submitButton').addEventListener('click', function(event) {
//     event.preventDefault(); // Prevent form submission
//     var inputText = document.getElementById('inputText').value;
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
//         var text = inputText.value;
//         text = text.replace(incorrectWord, suggestion);
//         inputText.value = text;
//         incorrectWord = null;
//     }
// }
