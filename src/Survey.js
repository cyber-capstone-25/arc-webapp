import React, { useState, useEffect } from 'react';
import questionsData from './data/data.json'; // Import your JSON file
import logo from '../src/data/arc.png';
import group from '../src/data/group-chat.png';

const Survey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]); // To store loaded questions
  const [answers, setAnswers] = useState([]); // Collect all answers
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if the user has started the survey
  const [showUserList, setShowUserList] = useState(false); // Track if the user list popup is open
  const [companyName, setCompanyName] = useState(''); // To store company name input
  const [email, setEmail] = useState(''); // To store email input

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
    setSelectedOption(option);
  };

  const sendAllResponsesToBackend = (allResponses) => {
    if (!companyName || !email) {
      alert('Please provide Company Name and Email.');
      return;
    }

    fetch('http://43.205.96.121:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName, // Include company name
        email, // Include email
        responses: allResponses, // Include all answers
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to submit data');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Response from backend:', data);
        alert('Responses submitted successfully');
      })
      .catch((err) => {
        console.error('Error sending data to backend:', err);
        alert('There was an error submitting your responses. Please try again.');
      });
  };

  const goToNextQuestion = () => {
    const newAnswers = [...answers];
    // If no option is selected, mark the answer as "Not Sure"
    if (!selectedOption) {
      newAnswers[currentQuestionIndex] = 'Not Sure';
    } else {
      newAnswers[currentQuestionIndex] = selectedOption;
    }
    setAnswers(newAnswers);
    setSelectedOption(null); // Reset selected option for the next question
    setShowHint(false); // Reset hint visibility
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSelectedOption(answers[currentQuestionIndex - 1]); // Restore previous selection
      setShowHint(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const newAnswers = [...answers];
    // If no option is selected for the last question, mark the answer as "Not Sure"
    if (!selectedOption) {
      newAnswers[currentQuestionIndex] = 'Not Sure';
    } else {
      newAnswers[currentQuestionIndex] = selectedOption;
    }
    setAnswers(newAnswers);
    sendAllResponsesToBackend(newAnswers); // Send all the answers to backend
  };

  const openHint = () => setShowHint(true);
  const closeHint = () => setShowHint(false);
  const startSurvey = () => {
    if (companyName && email) {
      setHasStarted(true);
    } else {
      alert('Please enter both Company Name and Email ID.');
    }
  };

  const introText =
    'This combined checklist ensures that your organization complies with both the GDPR and DPDPA regulations, focusing on safeguarding personal data, ensuring transparency, and maintaining accountability in data handling.';

  const handleUserClick = (user) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = user; // Set the answer as the selected user's name
    setAnswers(newAnswers);

    setShowUserList(false); // Close the user list
    goToNextQuestion(); // Proceed to the next question
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

            <div className="input-section">
              <label>Company Name:</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                required
              />
            </div>

            <div className="input-section">
              <label>Email ID:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

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
            <button onClick={handleSubmit} className="submit-button">
              Submit Responses
            </button>
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
                currentQuestionIndex < questions.length - 1
                  ? goToNextQuestion
                  : handleSubmit
              }
              className="next-button"
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
