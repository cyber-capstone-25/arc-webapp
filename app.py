from flask import Flask, render_template, send_from_directory, jsonify
import json
import os

app = Flask(__name__)

# Serve the homepage
@app.route('/')
def home():
    return render_template('index.html')

# Serve static files (CSS, JS)
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# Serve the questions JSON
@app.route('/questions')
def get_questions():
    with open('data/questions.json', 'r') as file:
        questions = json.load(file)
    return jsonify(questions)

if __name__ == '__main__':
    app.run(debug=True)
