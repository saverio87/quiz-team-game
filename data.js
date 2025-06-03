const questions = [
    {
        id: 0,
        sentence: 'Which of these is NOT a primary color?',
        type: 'multiple-choice',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 'Green',
        points: 10,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 1,
        sentence: 'The capital of France is Paris.',
        type: 'true-false',
        correctAnswer: true,
        points: 5,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 2,
        sentence: 'Is the Pacific Ocean the largest ocean on Earth?',
        type: 'true-false',
        correctAnswer: true,
        points: 5,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 3,
        sentence: 'What is the chemical symbol for gold?',
        type: 'multiple-choice',
        options: ['Au', 'Ag', 'Fe', 'Cu'],
        correctAnswer: 'Au',
        points: 15,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 4,
        sentence: 'Mount Everest is the tallest mountain in the world.',
        type: 'true-false',
        correctAnswer: true,
        points: 5,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 5,
        sentence: 'Which planet is known as the "Red Planet"?',
        type: 'multiple-choice',
        options: ['Jupiter', 'Mars', 'Venus', 'Saturn'],
        correctAnswer: 'Mars',
        points: 10,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 6,
        sentence: 'The human body has 206 bones.',
        type: 'true-false',
        correctAnswer: true,
        points: 5,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 7,
        sentence: 'Which famous scientist developed the theory of relativity?',
        type: 'multiple-choice',
        options: ['Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Stephen Hawking'],
        correctAnswer: 'Albert Einstein',
        points: 20,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 8,
        sentence: 'Water boils at 100 degrees Celsius.',
        type: 'true-false',
        correctAnswer: true,
        points: 5,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 9,
        sentence: 'What is the largest land animal?',
        type: 'multiple-choice',
        options: ['Giraffe', 'Elephant', 'Rhinoceros', 'Hippopotamus'],
        correctAnswer: 'Elephant',
        points: 15,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 10,
        sentence: 'The Great Wall of China is visible from space with the naked eye.',
        type: 'true-false',
        correctAnswer: false,
        points: 10,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 11,
        sentence: 'Which country is famous for the Eiffel Tower?',
        type: 'multiple-choice',
        options: ['Germany', 'Italy', 'Spain', 'France'],
        correctAnswer: 'France',
        points: 5,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 12,
        sentence: 'The process by which plants make their own food is called photosynthesis.',
        type: 'true-false',
        correctAnswer: true,
        points: 10,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 13,
        sentence: 'What is the most populous city in the world?',
        type: 'multiple-choice',
        options: ['New York', 'Shanghai', 'Tokyo', 'Delhi'],
        correctAnswer: 'Tokyo',
        points: 20,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 14,
        sentence: 'Bats are blind.',
        type: 'true-false',
        correctAnswer: false,
        points: 10,
        answered: null,
        answeredByTeam: null // Added key-value pair
    },
    {
        id: 15,
        sentence: 'Which of these is a programming language?',
        type: 'multiple-choice',
        options: ['HTML', 'CSS', 'JavaScript', 'HTTP'],
        correctAnswer: 'JavaScript',
        points: 15,
        answered: null,
        answeredByTeam: null // Added key-value pair
    }
];

const opposites = [
    "fast",
    "slow",
    "big",
    "small",
    "tall",
    "short",
    "fun",
    "boring",
    "cheap",
    "expensive",
    "sharp",
    "dull",
    "wide",
    "narrow",
    "soft",
    "hard",
]

const adjectives = [
    "fat",
    "fatter",
    "thin",
    "thinner",
    "big",
    "bigger",
    "small",
    "smaller",
    "fast",
    "faster",
    "slow",
    "slower",
    "bright",
    "brighter",
    "dark",
    "darker",
]

const questionsAndAnswers = [
    "What color is the sky?",
    "Blue",
    "What is 2 + 2?",
    "4",
    "What is the opposite of hot?",
    "Cold",
    'What animal says "meow"?',
    "Cat",
    "How many days are in a week?",
    "7",
    "What is the first letter of the alphabet?",
    "A",
    "What fruit is yellow and curved?",
    "Banana",
    "What do bees make?",
    "Honey",
]

export function importQuestions() {
    return questions
}

export function generatePreMadeCards(arr) {
    let wordList

    switch (arr) {
        case "opposites":
            wordList = opposites
            break

        case "adjectives":
            wordList = adjectives
            break

        case "questionsAndAnswers":
            wordList = questionsAndAnswers
            break
    }

    const cards = []

    for (let i = 0; i < wordList.length; i += 2) {
        const base = wordList[i]
        const match = wordList[i + 1]
        cards.push({ base, match, isRightOrder: true })
        cards.push({ base: match, match: base })
    }

    return cards
}