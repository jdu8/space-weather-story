import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Quiz.css';

const quizQuestions = [
  {
    id: 1,
    question: "What is a Coronal Mass Ejection (CME)?",
    options: [
      "A solar eclipse phenomenon",
      "A massive burst of solar wind and magnetic fields from the Sun's corona",
      "A type of aurora on Earth",
      "A meteorite from the Sun"
    ],
    correctAnswer: 1,
    explanation: {
      correct: "Correct! CMEs are huge eruptions of plasma and magnetic fields from the Sun's corona, just like Fiery from our story. They can travel millions of miles through space!",
      incorrect: "Not quite! CMEs are massive bursts of solar wind and magnetic fields from the Sun's corona - like giant bubbles of plasma ejected into space. Fiery from our story represents one of these incredible phenomena!"
    }
  },
  {
    id: 2,
    question: "What causes auroras (Northern and Southern Lights)?",
    options: [
      "Reflected light from ice crystals",
      "Airplane contrails at night",
      "Charged particles from the Sun colliding with Earth's atmosphere",
      "City lights reflecting off clouds"
    ],
    correctAnswer: 2,
    explanation: {
      correct: "Exactly! When charged particles from solar wind interact with gases in Earth's atmosphere, they create those beautiful dancing lights. The different colors come from different gases - oxygen creates green and red, while nitrogen creates blue and purple!",
      incorrect: "Not quite! Auroras happen when charged particles from the Sun collide with gases in Earth's atmosphere. Oxygen creates green and red auroras, while nitrogen creates blue and purple ones!"
    }
  },
  {
    id: 3,
    question: "What was the Carrington Event?",
    options: [
      "A lunar eclipse in 1859",
      "The most powerful solar storm ever recorded (1859)",
      "The first time humans saw an aurora",
      "A meteor impact event"
    ],
    correctAnswer: 1,
    explanation: {
      correct: "Yes! The 1859 Carrington Event was the most powerful geomagnetic storm in recorded history. It caused auroras visible near the equator and set telegraph systems on fire. If it happened today, it could cause trillions in damages!",
      incorrect: "The Carrington Event was the most powerful solar storm ever recorded, happening in 1859. It caused telegraph wires to spark and auroras visible as far south as the Caribbean! If it happened today, our technology-dependent world would face serious challenges."
    }
  },
  {
    id: 4,
    question: "What is the solar wind?",
    options: [
      "Wind on the surface of the Sun",
      "A stream of charged particles released from the Sun",
      "Hot air rising from the Sun",
      "The Sun's rotation creating wind"
    ],
    correctAnswer: 1,
    explanation: {
      correct: "Perfect! The solar wind is a continuous stream of charged particles (mostly electrons and protons) flowing from the Sun's corona out into space at speeds of about 400 km/s. It's what carries CMEs to Earth!",
      incorrect: "Solar wind is actually a continuous stream of charged particles (electrons and protons) flowing from the Sun into space. It travels at about 400 km/s and carries energy that can interact with planetary magnetic fields!"
    }
  },
  {
    id: 5,
    question: "How does Earth's magnetosphere protect us?",
    options: [
      "By reflecting solar radiation back to space",
      "By absorbing all radiation",
      "By deflecting charged particles around Earth",
      "By creating a physical barrier"
    ],
    correctAnswer: 2,
    explanation: {
      correct: "Correct! Earth's magnetosphere acts like an invisible shield, deflecting most charged particles from the solar wind around our planet. However, some particles can slip through near the poles, which is why auroras are most common there!",
      incorrect: "Earth's magnetosphere deflects charged particles around our planet like a shield. It channels some particles toward the poles, where they create auroras. Without it, solar radiation would strip away our atmosphere!"
    }
  },
  {
    id: 6,
    question: "What is a solar flare?",
    options: [
      "A sudden flash of increased brightness on the Sun",
      "A piece of the Sun breaking off",
      "The same thing as a CME",
      "A solar eclipse"
    ],
    correctAnswer: 0,
    explanation: {
      correct: "Yes! Solar flares are intense bursts of radiation from the release of magnetic energy. They're classified by strength: C-class (weak), M-class (medium), and X-class (strongest). X-class flares can disrupt radio communications on Earth!",
      incorrect: "Solar flares are sudden, intense bursts of radiation caused by magnetic energy release on the Sun. They're different from CMEs - flares are radiation bursts while CMEs are plasma eruptions. Both can affect Earth though!"
    }
  },
  {
    id: 7,
    question: "What is the Kp index?",
    options: [
      "A measure of solar temperature",
      "A scale measuring geomagnetic storm intensity (0-9)",
      "The number of sunspots",
      "Solar wind speed measurement"
    ],
    correctAnswer: 1,
    explanation: {
      correct: "Exactly! The Kp index ranges from 0 (quiet) to 9 (extreme storm). Kp 5 or higher means auroras might be visible at lower latitudes. It helps predict where auroras will be visible!",
      incorrect: "The Kp index measures geomagnetic activity on a scale of 0-9. Higher numbers mean stronger storms and auroras visible at lower latitudes. Kp 5+ means you might see auroras further from the poles!"
    }
  },
  {
    id: 8,
    question: "How long does it take a CME to reach Earth?",
    options: [
      "8 minutes (same as sunlight)",
      "1-3 days",
      "1 week",
      "Instantly"
    ],
    correctAnswer: 1,
    explanation: {
      correct: "Correct! While sunlight takes 8 minutes to reach Earth, CMEs travel slower - typically arriving in 1-3 days. This gives us time to prepare satellites and power grids for potential impacts!",
      incorrect: "CMEs typically take 1-3 days to travel from the Sun to Earth, much slower than light (8 minutes). The fastest CMEs can arrive in as little as 15-18 hours, while slower ones might take 4+ days."
    }
  },
  {
    id: 9,
    question: "What color aurora does oxygen create at high altitudes (above 200km)?",
    options: [
      "Green",
      "Red",
      "Blue",
      "Purple"
    ],
    correctAnswer: 1,
    explanation: {
      correct: "Yes! Oxygen creates red auroras at high altitudes (above 200km) and green auroras at lower altitudes (100-200km). Nitrogen creates blue and purple colors. The altitude and gas type determine the aurora's color!",
      incorrect: "At high altitudes (above 200km), oxygen creates red auroras. At lower altitudes (100-200km), it creates the more common green auroras. Nitrogen is responsible for blue and purple colors!"
    }
  },
  {
    id: 10,
    question: "What could happen if a Carrington-level event hit Earth today?",
    options: [
      "Nothing, modern technology is protected",
      "Beautiful auroras only",
      "Widespread power grid failures, satellite damage, and communication disruptions",
      "The Earth would heat up significantly"
    ],
    correctAnswer: 2,
    explanation: {
      correct: "Absolutely right! A Carrington-level event today could cause catastrophic damage to our technology-dependent society: power grids could fail for months, satellites could be destroyed, GPS and communications disrupted, and damages could exceed $2 trillion. That's why scientists monitor space weather!",
      incorrect: "A Carrington-level event today would be devastating! It could cause widespread power blackouts lasting months, destroy satellites, disrupt GPS and communications, and cause over $2 trillion in damages. Our modern infrastructure is much more vulnerable than the simple telegraph systems of 1859."
    }
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    if (showExplanation) return; // Prevent changing answer after selection

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    if (optionIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "Perfect! You're a space weather expert! 🌟";
    if (percentage >= 80) return "Excellent! You really know your space weather! ☀️";
    if (percentage >= 60) return "Great job! You've learned a lot from Fiery's journey! 🔥";
    if (percentage >= 40) return "Good effort! Review the story and try again! 🌍";
    return "Keep learning! Space weather is fascinating - give it another try! 💫";
  };

  if (quizComplete) {
    return (
      <div className="quiz-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="quiz-complete"
        >
          <div className="completion-icon">🎉</div>
          <h2 className="quiz-title">Quiz Complete!</h2>
          <div className="final-score">
            <div className="score-number">{score}/{quizQuestions.length}</div>
            <p className="score-message">{getScoreMessage()}</p>
          </div>
          <div className="completion-stats">
            <div className="stat">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{Math.round((score / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Correct</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Incorrect</span>
              <span className="stat-value">{quizQuestions.length - score}</span>
            </div>
          </div>
          <button onClick={handleRestartQuiz} className="restart-button">
            Try Again 🔄
          </button>
        </motion.div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">
          <span className="title-icon">🧠</span>
          Test What You Know!
        </h1>
        <p className="quiz-subtitle">
          Let's see what you learned from Fiery's journey through space
        </p>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </p>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="question-card"
      >
        <h2 className="question-text">{question.question}</h2>

        <div className="options-container">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            const showCorrect = showExplanation && isCorrectOption;
            const showIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                disabled={showExplanation}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showCorrect && <span className="result-icon">✓</span>}
                {showIncorrect && <span className="result-icon">✗</span>}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`explanation-box ${isCorrect ? 'correct-explanation' : 'incorrect-explanation'}`}
            >
              <div className="explanation-header">
                <span className="explanation-icon">{isCorrect ? '🎉' : '💡'}</span>
                <span className="explanation-title">
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </span>
              </div>
              <p className="explanation-text">
                {isCorrect ? question.explanation.correct : question.explanation.incorrect}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="next-button-container"
        >
          <button onClick={handleNextQuestion} className="next-button">
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎯'}
          </button>
        </motion.div>
      )}

      <div className="score-indicator">
        Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
      </div>
    </div>
  );
}
