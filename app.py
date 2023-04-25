# from transformers import pipeline

# hub_model_id = "Earth1221/Spelling_test"
# spelling = pipeline("text2text-generation", model=hub_model_id)

from flask import Flask, render_template, request
from transformers import AutoModelForSeq2SeqLM
from transformers import AutoTokenizer
from transformers import pipeline


def check_word(sentence) :

    input_ids = tokenizer.encode(sentence, return_tensors='pt')
    output = model.generate(input_ids, max_length=512)
    result = tokenizer.decode(output[0], skip_special_tokens=True)
    list_word = [word for word in result.split()]
    dict_candidate = {}
    list_worng_word = []
    
    for idx,i in enumerate (sentence.split()) :

        try:

            if i not in list_word :
                pred_sent = result.split()
                pred_sent[idx] = '<mask>'
                mask_out = mlm(" ".join(pred_sent), top_k=500)
                for ii in mask_out :
                    if ((ii['token_str']).strip()).startswith(result.split()[idx][:1]) :
                        list_worng_word.append(ii['token_str'].strip())
                dict_candidate[i] = list_worng_word[:3]
                list_worng_word = []
        
        except:
            pass
        
    return dict_candidate 

def auto_process(prompt):

    input_ids = tokenizer.encode(prompt, return_tensors='pt')
    output = model.generate(input_ids, max_length=512)
    result = tokenizer.decode(output[0], skip_special_tokens=True)
    if prompt[-1]=="." and (prompt.split()[-1] != result.split[-1]):
        result = result + "."
    return result+" "


app = Flask(__name__)

hub_model_id = "Earth1221/Bart_spell_full"
mlm = pipeline("fill-mask", model=hub_model_id)

model = AutoModelForSeq2SeqLM.from_pretrained(hub_model_id)
tokenizer = AutoTokenizer.from_pretrained(hub_model_id)

@app.route('/')
def index():
    return render_template('webpage.html')


@app.route('/suggestions')
def generate_suggestions():
    prompt = request.args.get('inputText', '')
    position = request.args.get('cursorPosition', '')
    
    misspell_dict = check_word(prompt)
    # misspell_dict = {"teo":["the","there","this"],"heo":["how","hello","here"],"sdf":["free","span","go"]}

    return {'suggestions': misspell_dict}

@app.route('/suggestions_auto')
def generate_suggestions_auto():
    prompt = request.args.get('inputText', '')
    position = request.args.get('cursorPosition', '')

    result = auto_process(prompt)
    return {'suggestions': result}




if __name__ == '__main__':
    app.run(debug=True)
