from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, url_for
import json
import os
import questions

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

# Handle form submission
@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    gdpr_data = data.get('gdpr', {})
    dpdpa_data = data.get('dpdpa', {})

    # Process the data (e.g., save to a file or database)
    # For demonstration, we'll just print it
    print('GDPR Data:', gdpr_data)
    print('DPDPA Data:', dpdpa_data)

    return jsonify({"message": "Data received successfully!"})

@app.route('/dashboard')
def dashboard():
    return render_template('chart.html')

if __name__ == '__main__':
    app.run(debug=True)