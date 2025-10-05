import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Quiz.css';

// Adaptive batch state lives client-side; questions are fetched from /api/generate-quiz

export default function Quiz() {
  const [batch, setBatch] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBatch = async (level) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/generate-quiz?difficulty=${encodeURIComponent(level)}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions returned');
      }
      setBatch(data.questions);
      setBatchIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (e) {
      setError(e.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = batch[batchIndex];

  const handleAnswerSelect = (optionIndex) => {
    if (showExplanation || !currentQuestion) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;
    const wasCorrect = selectedAnswer === currentQuestion.correctIndex;

    // Move within batch, or fetch a new batch with adjusted difficulty
    if (batchIndex < batch.length - 1) {
      setBatchIndex(batchIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Adjust difficulty incrementally
      const nextDifficulty = wasCorrect
        ? (difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'hard')
        : (difficulty === 'hard' ? 'medium' : difficulty === 'medium' ? 'easy' : 'easy');
      setDifficulty(nextDifficulty);
      fetchBatch(nextDifficulty);
    }
  };

  const handleRestartQuiz = () => {
    setDifficulty('easy');
    fetchBatch('easy');
  };

  const progressPercent = useMemo(() =>
    batch.length > 0 ? ((batchIndex + 1) / batch.length) * 100 : 0
  , [batch.length, batchIndex]);

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">
            <span className="title-icon">🧠</span>
            Adaptive Quiz
          </h1>
          <p className="quiz-subtitle">{error}</p>
          <button onClick={() => fetchBatch(difficulty)} className="next-button">Retry</button>
        </div>
      </div>
    );
  }

  const question = currentQuestion;
  const isCorrect = question && selectedAnswer === question.correctIndex;

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
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="progress-text">
          Question {Math.min(batchIndex + 1, batch.length)} of {batch.length || 5}
          {loading ? ' (loading...)' : ''}
        </p>
      </div>

      {/* Loading animation card */}
      {loading && (
        <motion.div
          key={`loading-${batchIndex}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="question-card"
        >
          <h2 className="question-text">Generating questions…</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[0,1,2,3,4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.4, width: '40%' }}
                animate={{ opacity: [0.4, 0.9, 0.4], width: ['40%', '90%', '40%'] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
                style={{ height: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)' }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {!loading && (
        <motion.div
          key={batchIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="question-card"
        >
          <h2 className="question-text">{question?.question || 'No question'}</h2>

        <div className="options-container">
          {(question?.options || []).map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = question && index === question.correctIndex;
            const showCorrect = showExplanation && isCorrectOption;
            const showIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                disabled={showExplanation || !question}
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
              <p className="explanation-text">{question?.explanation || ''}</p>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      )}

      {!loading && question && showExplanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="next-button-container"
        >
          <button onClick={handleNextQuestion} className="next-button">
            {batchIndex < (batch.length - 1) ? 'Next Question →' : 'Next Batch »'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
