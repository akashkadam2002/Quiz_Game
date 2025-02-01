import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Result.css';
import ResultTable from './ResultTable';

export default function Result() {
    const location = useLocation(); 
    const { questions, selectedOptions: answers, correctAnswersCount, totalQuestions } = location.state || {}; // Access state

    const userId = localStorage.getItem('userId');

    const [earnedPoints, setEarnedPoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        if (Array.isArray(questions) && questions.length > 0) {
            const total = totalQuestions * 10;
            setTotalPoints(total);

            const points = correctAnswersCount * 10;
            setEarnedPoints(points);

            setFlag(points >= total * 0.5); 
        } else {
            console.error("Questions are not properly defined.");
        }
    }, [questions, correctAnswersCount, totalQuestions]);

    return (
        <div className='container'>
            <h1 className='title text-light'>Quiz Application</h1>

            <div className='result flex-center'>
                <div className='flex'>
                    <span>Username:</span>
                    <span className='bold'>{userId || "N/A"}</span>
                </div>
                <div className='flex'>
                    <span>Total Quiz Points:</span>
                    <span className='bold'>{totalPoints || 0}</span>
                </div>
                <div className='flex'>
                    <span>Total Questions:</span>
                    <span className='bold'>{Array.isArray(questions) ? questions.length : 0}</span>
                </div>
                <div className='flex'>
                    <span>Total Earned Points:</span>
                    <span className='bold'>{earnedPoints || 0}</span>
                </div>
                <div className='flex'>
                    <span>Quiz Result:</span>
                    <span style={{ color: flag ? "#2aff95" : "#ff2a66" }} className='bold'>
                        {flag ? "Passed" : "Failed"}
                    </span>
                </div>
            </div>

            <div className="start">
                <Link className='btn' to={'/'} >Restart</Link>
            </div>

            <div className="container">
                <ResultTable questions={questions} answers={answers} />
            </div>
        </div>
    );
}
