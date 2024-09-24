import React, { useState, useEffect } from 'react';
import questionsData from './data/data.json'; // Import your JSON file
import logo from '/Users/amaydoshi/Downloads/Capstone/survey-app/src/data/arc.png';
import group from '/Users/amaydoshi/Downloads/Capstone/survey-app/src/data/group-chat.png';

const Survey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]); // To store loaded questions
  const [answers, setAnswers] = useState([]); // Collect all answers
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if the user has started the survey
  const [showUserList, setShowUserList] = useState(false); // Track if the user list popup is open

  // Placeholder users, replace with backend data later
  const users = ['Amay Doshi', 'Nidhi Keni', 'Dev Bhalavat'];

  // Load questions from JSON when the component mounts
  useEffect(() => {
    const extractedQuestions = questionsData.map((item) => ({
      question: item.Item.Question,
      hint: item.Item.Explanation,
    }));
    setQuestions(extractedQuestions); // Set questions in state
    setAnswers(new Array(extractedQuestions.length).fill(null)); // Initialize answers array with null values
  }, []);

  const handleOptionChange = (option) => {
    if (selectedOption === option) {
      setSelectedOption(null);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = null;
      setAnswers(newAnswers);
    } else {
      setSelectedOption(option);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = option;
      setAnswers(newAnswers);
    }
  };

  const sendAllResponsesToBackend = (allResponses) => {
    fetch('http://127.0.0.1:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        responses: allResponses,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Response from backend:', data);
      })
      .catch((err) => {
        console.error('Error sending data to backend:', err);
      });
  };

  const goToNextQuestion = () => {
    setSelectedOption(null);
    setShowHint(false); // Reset hint visibility
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSelectedOption(null);
      setShowHint(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    sendAllResponsesToBackend(answers);
    setSelectedOption(null);
    setShowHint(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const openHint = () => setShowHint(true);
  const closeHint = () => setShowHint(false);
  const startSurvey = () => setHasStarted(true);

  const hasAnswered = selectedOption !== null;

  const introText =
    'This combined checklist ensures that your organization complies with both the GDPR and DPDPA regulations, focusing on safeguarding personal data, ensuring transparency, and maintaining accountability in data handling.';

  const handleUserClick = (user) => {
    console.log(`Question sent to ${user}`);
    setShowUserList(false);
    goToNextQuestion();
  };

  return (
    <div className="survey-container">
      <div className="navbar">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {!hasStarted ? (
        <div className="survey-card">
          <div className="get-started-section">
            <h2 className="get-started-text">{introText}</h2>
            <button onClick={startSurvey} className="start-button">
              Get Started
            </button>
          </div>
        </div>
      ) : currentQuestionIndex >= questions.length ? (
        <div className="survey-card">
          <div className="thank-you-section">
            <h2 className="thank-you-text">
              Assessment completed! Your results will be available on the dashboard shortly.
            </h2>
          </div>
        </div>
      ) : (
        <div className="survey-card">
          <div className="question-section">
            <h2 className="question-text">{questions[currentQuestionIndex]?.question}</h2>
          </div>
          <div className="hint-container">
            <button onClick={openHint} className="hint-button">
              Learn More
            </button>
          </div>
          <div className="options-section">
            <div className="options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedOption === 'Yes'}
                  onChange={() => handleOptionChange('Yes')}
                />
                <span className="checkmark"></span>
                <span className="label-text">Yes</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedOption === 'No'}
                  onChange={() => handleOptionChange('No')}
                />
                <span className="checkmark"></span>
                <span className="label-text">No</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedOption === 'Not Sure'}
                  onChange={() => handleOptionChange('Not Sure')}
                />
                <span className="checkmark"></span>
                <span className="label-text">Not Sure</span>
              </label>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="navigation">
            <button
              onClick={goToPreviousQuestion}
              className={`prev-button ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            <button
              onClick={
                hasAnswered
                  ? currentQuestionIndex < questions.length - 1
                    ? goToNextQuestion
                    : handleSubmit
                  : null
              }
              className={`next-button ${!hasAnswered ? 'disabled' : ''}`}
              disabled={!hasAnswered}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {showHint && (
            <div className="hint-popup">
              <div className="hint-content">
                <span className="close-button" onClick={closeHint}>
                  &times;
                </span>
                <p>{questions[currentQuestionIndex]?.hint}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {hasStarted && currentQuestionIndex < questions.length && (
        <div className="floating-icon" onClick={() => setShowUserList(!showUserList)}>
          <img src={group} alt="User Icon" />
        </div>
      )}

      {showUserList && (
        <div className="user-list-popup">
          <h4>Send question to:</h4>
          {users.map((user) => (
            <button key={user} className="user-button" onClick={() => handleUserClick(user)}>
              {user}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Survey;
