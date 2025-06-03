import { triggerReusableAnimation } from "./helper.js";

export const gridHTML = `
    <div class="left-column">
        <div id=" class="panel-before">${'a'}</div>
    </div>
    <div class="right-column">
        <div class="panel-before">${'b'}</div>
        <div class="panel-before">${'c'}</div>
    </div>
`;

// const handleAnswerClick = async (answerPanel, option, questionObject) => {

//     const correctAnswer = questionObject.type == 'true-false' ?
//         questionObject.correctAnswer.toString() :
//         questionObject.correctAnswer

//     if (option == correctAnswer) {
//         answerPanel.classList.add("green")
//         // animate
//         await triggerReusableAnimation({ targetElement: answerPanel, imageType: "tick" });
//         // change color

//     } else {
//         answerPanel.classList.add("red")
//         await triggerReusableAnimation({ targetElement: answerPanel, imageType: "cross" });


//     }

// }

// export const generateGridHTML = (question) => {

//     // Formatting question object
//     const questionObject = prepareQuestionObject(question)
//     // 1. Create the main grid container div
//     const gridContainer = document.createElement('div');
//     gridContainer.classList.add('question-display-container');

//     // 2. Create the left column div
//     const leftColumn = document.createElement('div');
//     leftColumn.classList.add('left-column');

//     // 3. Create the left panel div
//     const leftPanel = document.createElement('div');
//     leftPanel.classList.add('panel-before');
//     leftPanel.textContent = questionObject.sentence; // Set content using textContent for safety

//     // Append left panel to left column
//     leftColumn.appendChild(leftPanel);

//     // 4. Create the right column div
//     const rightColumn = document.createElement('div');
//     rightColumn.classList.add('right-column');

//     // 5. Create and append right panels dynamically
//     questionObject.options.forEach(option => {
//         const answerPanel = document.createElement('div');
//         answerPanel.classList.add('panel-before');
//         answerPanel.textContent = option; // Set content using textContent for safety
//         answerPanel.addEventListener("click", () => handleAnswerClick(answerPanel, option, questionObject))
//         rightColumn.appendChild(answerPanel);
//     });

//     // 6. Append columns to the main grid container
//     gridContainer.appendChild(leftColumn);
//     gridContainer.appendChild(rightColumn);
//     return gridContainer;
// };

export const generateGridHTML = (question, handleAnswerClick) => { // <-- Add handleAnswerClick as a parameter

    // Formatting question object
    const questionObject = prepareQuestionObject(question);

    // 1. Create the main grid container div
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('question-display-container');

    // 2. Create the left column div
    const leftColumn = document.createElement('div');
    leftColumn.classList.add('left-column');

    // 3. Create the left panel div
    const leftPanel = document.createElement('div');
    leftPanel.classList.add('panel-before');
    leftPanel.textContent = questionObject.sentence; // Set content using textContent for safety

    // Append left panel to left column
    leftColumn.appendChild(leftPanel);

    // 4. Create the right column div
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('right-column');

    // 5. Create and append right panels dynamically
    questionObject.options.forEach(option => {
        const answerPanel = document.createElement('div');
        answerPanel.classList.add('panel-before');
        answerPanel.textContent = option; // Set content using textContent for safety

        // Attach the passed-in handleAnswerClick function
        // Ensure handleAnswerClick is bound to the class instance if it uses 'this'
        answerPanel.addEventListener("click", () => handleAnswerClick(answerPanel, option, questionObject));

        rightColumn.appendChild(answerPanel);
    });

    // 6. Append columns to the main grid container
    gridContainer.appendChild(leftColumn);
    gridContainer.appendChild(rightColumn);

    return gridContainer;
};


