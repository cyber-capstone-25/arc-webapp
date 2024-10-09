import React, { useState } from 'react';
import questionsData from './data/final_checklist.json'; // Your checklist JSON
import logo from '../src/data/arc.png'; // Your logo path
import './App.css'; // Make sure to import the CSS file

const Survey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]); // Store loaded questions
  const [answers, setAnswers] = useState([]); // Collect all answers
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if the user has started the survey
  const [companyName, setCompanyName] = useState(''); // Store company name input
  const [email, setEmail] = useState(''); // Store email input
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if submit is in progress
  const [canSubmitAgain, setCanSubmitAgain] = useState(true); // Track the 10-second wait period
  const [selectedRegulations, setSelectedRegulations] = useState([]); // Track GDPR/DPDPA selection

  // Handle regulation checkbox changes
  const handleRegulationChange = (e) => {
    const value = e.target.value;
    setSelectedRegulations((prevState) =>
      prevState.includes(value) ? prevState.filter((reg) => reg !== value) : [...prevState, value]
    );
  };

  // Handle option selection for the current question
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Function to send responses to the backend
  const sendAllResponsesToBackend = (allResponses) => {
    if (!companyName || !email) {
      alert('Please provide Company Name and Email.');
      return;
    }

    setIsSubmitting(true);

    fetch('http://43.205.96.121:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName,
        email,
        responses: allResponses,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to submit data');
        }
        return res.json();
      })
      .then((data) => {
        alert('Responses submitted successfully');
        setIsSubmitting(false);
        setCanSubmitAgain(false);

        // Re-enable the submit button after 10 seconds
        setTimeout(() => {
          setCanSubmitAgain(true);
        }, 10000);
      })
      .catch((err) => {
        console.error('Error sending data to backend:', err);
        alert('There was an error submitting your responses. Please try again.');
        setIsSubmitting(false);
      });
  };

  // Move to the next question
  const goToNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption || 'Not Sure';
    setAnswers(newAnswers);
    setSelectedOption(null); // Reset selected option for the next question
    setShowHint(false); // Reset hint visibility
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  // Move to the previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSelectedOption(answers[currentQuestionIndex - 1]); // Restore previous selection
      setShowHint(false);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit the final answers
  const handleSubmit = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption || 'Not Sure';
    setAnswers(newAnswers);
    sendAllResponsesToBackend(newAnswers);
  };

  // Show or hide the hint
  const openHint = () => setShowHint(true);
  const closeHint = () => setShowHint(false);

  // Start the survey after collecting Company Name, Email, and Regulations
  const startSurvey = () => {
    if (companyName && email) {
      if (selectedRegulations.length === 0) {
        alert('Please select at least one regulation.');
        return;
      }

      // Verify the structure of questionsData
      console.log('questionsData:', questionsData);

      // Filter questions based on selectedRegulations
      const filteredQuestions = questionsData
        .filter((item, index) => {
          if (!item || !item.Item) {
            console.warn(`Skipping invalid item at index ${index}:`, item);
            return false;
          }

          // Normalize and compare regulations
          const regulation = item.Item.Regulation ? item.Item.Regulation.trim().toUpperCase() : '';
          const selectedRegs = selectedRegulations.map((reg) => reg.trim().toUpperCase());

          if (!regulation) {
            console.warn(`Item at index ${index} has no Regulation specified:`, item);
            return false;
          }

          return selectedRegs.includes(regulation);
        })
        .map((item) => ({
          question: item.Item?.Question || 'Question not available',
          hint: item.Item?.Explanation || 'No explanation available',
          simplified: item.Item?.Simplified || 'No simplified explanation available',
          regulation: item.Item?.Regulation || 'Unknown regulation',
        }));

      if (filteredQuestions.length > 0) {
        setQuestions(filteredQuestions);
        setAnswers(new Array(filteredQuestions.length).fill(null));
        setHasStarted(true);
      } else {
        alert('No questions found for the selected regulations.');
      }
    } else {
      alert('Please enter both Company Name and Email ID.');
    }
  };

  const introText =
    'This combined checklist ensures that your organization complies with both the GDPR and DPDPA regulations, focusing on safeguarding personal data, ensuring transparency, and maintaining accountability in data handling.';

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

            <div className="input-section">
              <label>Select Regulation:</label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  value="GDPR"
                  checked={selectedRegulations.includes('GDPR')}
                  onChange={handleRegulationChange}
                />
                <span className="checkmark"></span>
                <span className="label-text">GDPR</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  value="DPDPA"
                  checked={selectedRegulations.includes('DPDPA')}
                  onChange={handleRegulationChange}
                />
                <span className="checkmark"></span>
                <span className="label-text">DPDPA</span>
              </label>
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
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={isSubmitting || !canSubmitAgain}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Responses'}
            </button>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="survey-card">
          <h2>No questions available for the selected regulation.</h2>
        </div>
      ) : (
        <div className="survey-card">
          {/* Adjusted styles and structure */}
          <div className="survey-content">
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
          </div>

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
                currentQuestionIndex < questions.length - 1 ? goToNextQuestion : handleSubmit
              }
              className="next-button"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Number of questions left */}
          <div className="questions-left">
            <p>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {showHint && (
            <div className="hint-popup">
              <div className="hint-content">
                <span className="close-button" onClick={closeHint}>
                  &times;
                </span>
                <p>{questions[currentQuestionIndex]?.simplified}</p>
                <p>{questions[currentQuestionIndex]?.hint}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Survey;
