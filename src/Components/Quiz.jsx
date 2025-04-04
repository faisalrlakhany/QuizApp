import { useEffect, useState } from "react";

export default function QuizCard() {
    const [questionData, setQuestionData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(""); // Track selected answer
    const [shuffledAnswers, setShuffledAnswers] = useState([]); // Store shuffled answers
    const [isAnswerSelected, setIsAnswerSelected] = useState(false); // Flag to track if an answer is selected
    const [isAnswered, setIsAnswered] = useState(false); // To track if the question has been answered
    const [score, setScore] = useState(0); // Track the score
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Correct answers counter
    const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0); // Incorrect answers counter
    const [quizFinished, setQuizFinished] = useState(false); // Flag to track if the quiz is finished

    const currentQuestion = questionData[currentQuestionIndex];

    // Function to shuffle the options (correct + incorrect)
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('https://the-trivia-api.com/v2/questions');
                const questions = await response.json();
                setQuestionData(questions);
            } catch (error) {
                console.log(error);
                setError('Error loading Quiz data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, []); // Fetch quiz data once on mount, no dependency array here

    // Shuffle answers whenever the current question index changes
    useEffect(() => {
        if (currentQuestion) {
            const allAnswers = [
                ...currentQuestion.incorrectAnswers,
                currentQuestion.correctAnswer,
            ];
            shuffleArray(allAnswers);
            setShuffledAnswers(allAnswers); // Store shuffled answers in state
            setSelectedAnswer(""); // Reset the selected answer for the next question
            setIsAnswered(false); // Reset answered flag for the next question
        }
    }, [currentQuestionIndex, currentQuestion]);

    // If quiz is finished, display the result card
    if (quizFinished) {
        const totalQuestions = questionData.length;
        const remarks =
            score === totalQuestions
                ? "Excellent!"
                : score >= totalQuestions / 2
                    ? "Good job!"
                    : "Try again!";

        return (
            <div className="result-card p-8 mt-8 bg-[#2D3A4A] rounded-lg shadow-xl text-center text-[#FACC15]">
                <h2 className="text-3xl font-semibold mb-6">Quiz Results</h2>
                <p className="text-lg mb-4">
                    You answered {correctAnswersCount} out of {totalQuestions} questions correctly.
                </p>
                <p className="text-lg mb-4">
                    You got {incorrectAnswersCount} incorrect answers.
                </p>
                <p className="text-2xl font-bold mb-4">{remarks}</p>
            </div>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!currentQuestion) {
        return <div>No question available</div>;
    }

    // Handle answer selection
    const handleAnswerSelect = (answer) => {
        if (!isAnswered) {
            setSelectedAnswer(answer);  // Update selected answer
            setIsAnswerSelected(true);  // Set the flag that answer is selected
        }
    };

    // Handle Next button click
    const handleNextClick = () => {
        if (!isAnswerSelected) return; // Don't allow moving to the next question unless an answer is selected

        // Check if the selected answer is correct and update the score
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore((prevScore) => prevScore + 1); // Increment score if the answer is correct
            setCorrectAnswersCount((prevCount) => prevCount + 1); // Increment correct answers count
        } else {
            setIncorrectAnswersCount((prevCount) => prevCount + 1); // Increment incorrect answers count
        }

        // Mark the question as answered
        setIsAnswered(true);

        // Move to the next question or finish the quiz if it's the last question
        if (currentQuestionIndex === questionData.length - 1) {
            setQuizFinished(true); // Finish the quiz
        } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setIsAnswerSelected(false); // Reset answer selected flag
            setIsAnswered(false); // Reset isAnswered for next question
        }
    };

    // Disable answer selection if the question has been answered
    const disableSelection = isAnswered;

    // Display feedback after question is answered
    const answerFeedback = isAnswered ? (
        <div className={`mt-4 text-center ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
            {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect!"}
        </div>
    ) : null;

    // Display score after the question
    const scoreDisplay = (
        <div className="text-center mt-4 text-lg text-[#FACC15]">
            <strong>Score: {score}</strong>
        </div>
    );

    return (
        <div className="max-w-lg mx-auto bg-[#2D3A4A] rounded-lg shadow-xl p-8 mt-8">
            <h2 className="text-3xl font-semibold text-[#FACC15] mb-6">Q{currentQuestionIndex + 1}. {currentQuestion.question.text}</h2>

            <form className="space-y-6">
                {shuffledAnswers.map((option, index) => (
                    <div key={index} className="flex items-center gap-4 bg-[#334155] p-3 rounded-md">
                        <input
                            type="radio"
                            id={`option${index}`}
                            name="answer"
                            value={option}
                            checked={selectedAnswer === option} // Check if this option is selected
                            onChange={() => handleAnswerSelect(option)} // Update selected answer when clicked
                            disabled={disableSelection} // Disable selection after the answer is submitted
                            className="radio checked:bg-[#FACC15] text-[#FACC15]"
                        />
                        <label htmlFor={`option${index}`} className="text-[#F8FAFC] text-lg">
                            {option}
                        </label>
                    </div>
                ))}

                {/* Display feedback on correctness after clicking Next */}
                {answerFeedback}

                {/* Next Button */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={handleNextClick}
                        disabled={!isAnswerSelected} // Disable Next button until an answer is selected
                        className="btn bg-[#FACC15] text-[#2D3A4A] rounded-lg px-6 py-3 w-full md:w-auto transition duration-300 hover:bg-[#EAB308]"
                    >
                        Next
                    </button>
                </div>
            </form>

            {/* Show Score */}
            {scoreDisplay}
        </div>
    );
}
