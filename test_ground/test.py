from flask import Flask, request, jsonify,render_template
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('test.html')

@app.route('/process_user_input', methods=['POST'])
def process_user_input():
    user_input = request.form.get('user_input')  # Extract user input from request
    incorrect_words = user_input.upper()  # Call your Python function to check incorrect words
    time.sleep(5)
    return jsonify(incorrect_words=incorrect_words)  # Return results as JSON

def check_incorrect_words(text):
    # Implement your word checking logic here
    # This can involve using libraries like nltk or other custom logic
    # Return a list of incorrect words
    # For example, assuming you have a function called `check_word` that checks if a word is incorrect:
    incorrect_words = []
    words = text.split()
    for word in words:
        if not check_word(word):
            incorrect_words.append(word)
    return incorrect_words

def check_word(word):
    # Implement your word checking logic here
    # This can involve using a spell-checking library or other custom logic
    # Return True if word is incorrect, False otherwise
    pass

if __name__ == '__main__':
    app.run(debug=True)
