import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../database/data';

export default function Questions({ userId }) {
    const questions = data.flatMap(item => item.questions);

    const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(undefined));
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(Array(questions.length).fill(false));
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();

    const currentQuestion = questions[currentIndex] || {};
    const { description, options, id } = currentQuestion;

    const correctAnswerIndex = options?.findIndex(option => option.is_correct);

    function onSelect(optionIndex) {
        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions[currentIndex] = optionIndex;
        setSelectedOptions(updatedSelectedOptions);

        const isCorrect = optionIndex === correctAnswerIndex;
        const prevSelectedOption = selectedOptions[currentIndex];

        if (isCorrect && prevSelectedOption !== correctAnswerIndex) {
            setCorrectAnswersCount(prevCount => prevCount + 1);
        } else if (!isCorrect && prevSelectedOption === correctAnswerIndex) {
            setCorrectAnswersCount(prevCount => prevCount - 1);
        }

        setAnsweredQuestions(prevAnswered => {
            const updatedAnswered = [...prevAnswered];
            updatedAnswered[currentIndex] = true;
            return updatedAnswered;
        });
    }

    function nextQuestion() {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
            navigate('/result', {
                state: {
                    selectedOptions,
                    userId,
                    questions,
                    correctAnswersCount,
                    totalQuestions: questions.length,
                },
            });
        }
    }

    function prevQuestion() {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    }

    return (
        <div className='questions'>
            {currentQuestion ? (
                <div key={id} className="question-container">
                    <h2 className='text-light'>{description}</h2>

                    <ul>
                        {options?.map((option, index) => (
                            <li key={option.id}>
                                <input
                                    type="radio"
                                    name={`question-${id}`}
                                    id={`q${id}-option-${index}`}
                                    checked={selectedOptions[currentIndex] === index}
                                    onChange={() => onSelect(index)}
                                />
                                <label className='text-primary' htmlFor={`q${id}-option-${index}`}>
                                    {option.description}
                                </label>
                                {selectedOptions[currentIndex] === index && <div className="check checked"></div>}
                            </li>
                        ))}
                    </ul>

                    <div className="navigation-buttons grid">
                        <button className='btn prev' onClick={prevQuestion} disabled={currentIndex === 0}>
                            Prev
                        </button>

                        {currentIndex === questions.length - 1 ? (
                            <button className='btn next' style={{ background: '#608fd9' }} onClick={nextQuestion}>
                                Submit
                            </button>
                        ) : (
                            <button className='btn next' onClick={nextQuestion} disabled={currentIndex === questions.length - 1}>
                                Next
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p>No questions available</p>
            )}
        </div>
    );
}
