let dataList = [];

// Set focus on the inputText div
document.getElementById('inputText').focus();

// Get the text cursor position
var sel = window.getSelection();
let countId = 0;

var itxt_Editor = document.getElementById('inputText');
var debounceTimer;


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
    const regex = new RegExp("\\b" + option + "\\b", "g");
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



itxt_Editor.addEventListener('keydown', function(event) {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(function() {
       
        //   console.log('Space bar pressed!');
        var input_text = itxt_Editor.innerText;
        var words = input_text.trim().split(/\s+/);
        var wordCount = words.length;
        console.log(input_text);
        var cursorPosition = sel.anchorOffset;
        console.log('Text cursor position: ' + cursorPosition);
        if (wordCount >= 2){
            // var input_html = itxt_Editor.innerHTML;
            // const result = createSpans(input_html, countId);
            // itxt_Editor.innerHTML = result.updatedText;
            // countId = result.countId;
            fetch('/suggestions?inputText=' + encodeURIComponent(input_text)+'&cursorPosition=' + cursorPosition)
                .then(response => response.json())
                .then(data => {
                    add_misspell(data['suggestions']);
            
            });
        }
        
    },1200);
});

