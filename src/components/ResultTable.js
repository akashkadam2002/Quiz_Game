import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AiOutlineDelete } from "react-icons/ai"; 

export default function ResultTable() {
    const userId = localStorage.getItem('userId'); 
    const location = useLocation(); 
    const { questions, correctAnswersCount, totalQuestions } = location.state || {}; 

    const [results, setResults] = useState([]);

    useEffect(() => {
        const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
        setResults(storedResults);

        if (Array.isArray(questions) && questions.length > 0) {
            const total = totalQuestions * 10; 
            const points = correctAnswersCount * 10;
            const resultFlag = points >= total * 0.5;

            const newResult = { name: userId || "Unknown", points, result: resultFlag ? "Passed" : "Failed" };

            const isDuplicate = storedResults.some(result => result.name === newResult.name && result.points === newResult.points);
            if (!isDuplicate) {
                const updatedResults = [...storedResults, newResult];
                localStorage.setItem("quizResults", JSON.stringify(updatedResults));

                setResults(updatedResults);
            }
        }
    }, [questions, correctAnswersCount, totalQuestions, userId]); 

    const handleDelete = (index) => {
        const updatedResults = results.filter((_, i) => i !== index);
        setResults(updatedResults);
        localStorage.setItem("quizResults", JSON.stringify(updatedResults));
    };

    return (
        <div>
            <table>
                <thead className='table-header'>
                    <tr className='table-row'>
                        <td>Name</td>
                        <td>Earned Points</td>
                        <td>Result</td>
                        <td>Delete</td>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 ? (
                        <tr>
                            <td colSpan="4">No Data Found</td>
                        </tr>
                    ) : (
                        results.map((user, index) => (
                            <tr className='table-body' key={index}>
                                <td>{user.name}</td>
                                <td>{user.points}</td>
                                <td>
                                    <span style={{ color: user.result === "Passed" ? "#2aff95" : "#ff2a66" }} className='bold'>
                                        {user.result}
                                    </span>
                                </td>
                                <td>
                                    <AiOutlineDelete
                                        onClick={() => handleDelete(index)}
                                        style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
