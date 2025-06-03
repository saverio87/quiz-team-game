

import { playAnimation, playAnimationsConcurrently } from "./helper.js"
import { triggerReusableAnimation, prepareQuestionObject } from "./helper.js"

export class GameObserver {
    constructor(gameController) {
        // Inherit gameController
        this.gameController = gameController
        // Fetch HTML elements
        this.progressBar = document.getElementById("progress-bar-container")
        this.panels = document.querySelector(".panels")
        this.result = document.getElementById("result")
        this.stopButton = document.getElementById("stop")
        this.playAgainButton = document.getElementById("start")
        this.makeNewGameButton = document.getElementById("newgame")
        this.teamsContainer = document.getElementById("teams")
        this.cardElements = document.querySelectorAll(".panel-container")
        this.gameContainer = document.querySelector(".game-container")
        // Initialize empty elements
    }

    async renderTeamsContainer() {
        // disappear
        await playAnimation(this.teamsContainer, ['animate__bounceOutLeft'], ['animate__bounceOutLeft']);
        //
        this.teamsContainer.innerHTML = ""; // Clear previous team elements
        const teamNameSpan = document.createElement("span");
        teamNameSpan.innerText = this.gameController.getCurrentTeam().name;
        const pointsSpan = document.createElement("span");
        pointsSpan.innerText = "Points: " + this.gameController.getCurrentTeam().points;
        pointsSpan.className = "answered-by-team";
        this.teamsContainer.append(teamNameSpan);
        this.teamsContainer.append(pointsSpan);
        this.teamsContainer.style.backgroundColor = this.gameController.colorMapping[this.gameController.getCurrentTeam().id]
        // appear
        await playAnimation(this.teamsContainer, ['animate__bounceInLeft'], ['animate__bounceInLeft']);
    }


    async resetCountdownBar(status) {

        switch (status) {
            case 'correct':
                this.progressBar.classList.add("green");
                this.progressBar.innerText = "Correct!";
                break;
            case 'wrong':
                this.progressBar.classList.add("red");
                this.progressBar.innerText = "Wrong!";
                break;
            case 'timeout':
                this.progressBar.classList.add("orange");
                this.progressBar.innerText = "Time Out!";
                break;
            default:
                break;
        }

        await playAnimation(this.progressBar, ['animate__flash'], ['animate__flash']);
        // Reset the bar visually
        this.progressBar.innerHTML = `<span class="material-symbols-outlined">timer</span>`;
        this.progressBar.classList.remove("red", "green", "orange");
    }

    updateBackdropColor() {
        const teamColor = this.gameController.colorMapping[this.gameController.state.currentTeamIndex]
        console.log(Array.from(this.panels.children));
        Array.from(this.panels.children).forEach(panel => {

            if (!panel.classList.contains('answered')) {
                panel.style.backgroundColor = teamColor;
            }
        })
        // this.panels.style.backgroundColor = teamColor;
        // this.teamsContainer.style.backgroundColor = teamColor;
        this.progressBar.style.backgroundColor = teamColor;
        document.body.style.backgroundColor = teamColor;
    }

    enablePanels(panels) {
        let panelsToEnable;
        switch (panels) {
            case 'boardPanels':
                panelsToEnable = this.panels.children;
                break;
            case 'answerPanels':
                panelsToEnable = document.querySelector('.right-column').children
                break;
        }
        Array.from(panelsToEnable).forEach(panel => {
            panel.style.pointerEvents = 'auto';
        })
    }

    disablePanels(panels) {
        let panelsToDisable;
        switch (panels) {
            case 'boardPanels':
                panelsToDisable = this.panels.children;
                break;
            case 'answerPanels':
                panelsToDisable = document.querySelector('.right-column').children
                console.log(panelsToDisable);
                break;
            default:
                break;
        }

        Array.from(panelsToDisable).forEach(panel => {
            panel.style.pointerEvents = 'none'
        });
    }

    async renderCountdownBar() {
        await playAnimation(this.progressBar, ['animate__bounceOutRight'], ['animate__bounceOutRight']);

        this.progressBar.innerHTML = "";

        const bar = document.createElement("div");
        bar.id = 'progress-bar';
        Object.assign(bar.style, {
            position: "absolute",
            borderRadius: '0.75rem',
            left: "5px",
            top: "5px",
            bottom: "5px",
            width: "100%",
            backgroundColor: "darkseagreen",
            transition: "width 0.1s linear"
        });

        const timeLabel = document.createElement("div");
        timeLabel.id = 'time-label';
        Object.assign(timeLabel.style, {
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#333",
            zIndex: "1"
        });

        this.progressBar.appendChild(bar);
        this.progressBar.appendChild(timeLabel);

        await playAnimation(this.progressBar, ['animate__bounceInRight'], ['animate__bounceInRight']);
    }



    renderQuestionView = (question, handleAnswerClick) => { // <-- Add handleAnswerClick as a parameter

        const teamColor = this.gameController.colorMapping[this.gameController.state.currentTeamIndex]
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
        leftPanel.style.backgroundColor = teamColor;
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
            // handleAnswerClick is inherited from gameController
            answerPanel.addEventListener("click", () => {
                this.disablePanels('answerPanels');
                this.gameController.handleAnswerClick(answerPanel, option, questionObject)
            });
            rightColumn.appendChild(answerPanel);
        });

        // 6. Append columns to the main grid container
        gridContainer.appendChild(leftColumn);
        gridContainer.appendChild(rightColumn);

        return gridContainer;
    };

    async update(eventType, payload) {
        let params

        switch (eventType) {
            case "startGame":
                // Re-render UI
                // this.result.innerHTML = '';
                break

            case "stopGame":
                // this.gameContainer.classList.add("hide");
                // this.controls.classList.remove("hide");
                // this.stopButton.classList.add("hide");
                break

            case "renderTime":
                const { secondsLeft } = payload
                // Update the DOM
                this.timeValue.innerHTML = `<span>Time:&nbsp;${secondsLeft}</span>`;
                break

            // Render board
            case "renderBoard":
                // Check if questionDisplayContainer exists, if so remove element
                const questionDisplayContainer = document.querySelector(".question-display-container");
                if (questionDisplayContainer) { this.gameContainer.removeChild(questionDisplayContainer) }
                // render or re-render panels
                const { questions } = payload
                this.panels.innerHTML = ""
                questions.forEach((question) => {
                    const cardElement = document.createElement("div")
                    // at first make it not clickable
                    cardElement.style.pointerEvents = 'none';
                    cardElement.classList.add("panel-before")
                    cardElement.innerHTML += `${question.points} points`
                    if (question.answered) {
                        cardElement.classList.add('answered');
                        cardElement.style.backgroundColor = this.gameController.colorMapping[question.answeredByTeam]
                        const answeredBySpan = document.createElement("span");
                        answeredBySpan.className = "answered-by-team";
                        console.log(this.gameController.state.teams[question.answeredByTeam].name);
                        answeredBySpan.innerText = this.gameController.state.teams[question.answeredByTeam].name;
                        cardElement.appendChild(answeredBySpan);
                    }
                    cardElement.addEventListener("click", () => this.gameController.handlePanelClick(cardElement, question))
                    this.panels.appendChild(cardElement)
                })

                this.updateBackdropColor();
                await this.resetCountdownBar(payload.answerStatus);
                await this.renderTeamsContainer();
                this.enablePanels('boardPanels')
                break

            // case "enablePanels":
            //     let panelsToEnable;

            //     switch (payload.panelsToEnable) {
            //         case 'boardPanels':
            //             panelsToEnable = this.panels;
            //             break;
            //         case 'answerPanels':
            //             console.log(document.querySelector('.right-column').children);
            //             panelsToEnable = document.querySelector('.question-display-container')
            //             break;
            //     }
            //     panelsToEnable.style.pointerEvents = 'auto';
            //     // Array.from(panelsToEnable).forEach(panel => {
            //     //     panel.style.pointerEvents = 'auto';
            //     // })
            //     break;

            // case "disablePanels":
            //     let panelsToDisable;
            //     switch (payload.panelsToDisable) {
            //         case 'boardPanels':
            //             panelsToDisable = this.panels;
            //             break;
            //         case 'answerPanels':
            //             panelsToEnable = document.querySelector('.question-display-container')
            //             // panelsToDisable = document.querySelector('.right-column').children
            //             break;
            //     }

            //     panelsToEnable.style.pointerEvents = 'auto';


            //     // Array.from(panelsToDisable).forEach(panel => {
            //     //     panel.style.pointerEvents = 'none'
            //     // });
            //     break;

            case "panelsDisappear": // is passed panelElement
                // 
                const otherPanels = Array.from(this.panels.children).filter(panel => panel !== payload.panelElement)
                await playAnimationsConcurrently(otherPanels, ['animate__zoomOut'], ['animate__zoomOut']);
                otherPanels.forEach(panel => {
                    panel.classList.add('hide-from-view');
                    // disable pointer events as well
                    panel.style.pointerEvents = 'none'
                });
                break

            case "panelFlash": // is passed panelElement
                await playAnimation(payload.panelElement, ['animate__flash'], ['animate__flash']);
                break;

            case "renderQuestionView": // is passed {question}
                this.panels.innerHTML = "";
                //
                const previousQuestionView = document.querySelector('.question-display-container');
                if (previousQuestionView) {
                    console.log('removing previous question view...');
                    document.remove(previousQuestionView);
                }

                //
                const questionView = this.renderQuestionView(payload.question)
                this.gameContainer.prepend(questionView)
                this.disablePanels('answerPanels')
                await this.renderCountdownBar();
                this.enablePanels('answerPanels')
                break;

            case "correctAnswerClicked": // is passed {answerPanel}
                // change color
                payload.answerPanel.classList.add("green")
                // animate
                await triggerReusableAnimation({ targetElement: payload.answerPanel, imageType: "tick" });
                break;

            case "wrongAnswerClicked": // is passed {answerPanel}
                payload.answerPanel.classList.add("red")
                await triggerReusableAnimation({ targetElement: payload.answerPanel, imageType: "cross" });
                break;

            // case "renderCountdownBar":
            //     await playAnimation(this.progressBar, ['animate__bounceOutRight'], ['animate__bounceOutRight']);
            //     // Clear any existing bar content
            //     this.progressBar.innerHTML = "";
            //     // Create the bar element
            //     const bar = document.createElement("div");
            //     bar.id = 'progress-bar'
            //     bar.style.position = "absolute"; // anchor it to the left
            //     bar.style.borderRadius = '0.75rem';
            //     bar.style.left = "5px";
            //     bar.style.top = "5px";
            //     bar.style.bottom = "5px";
            //     bar.style.width = "100%";
            //     bar.style.backgroundColor = "darkseagreen";
            //     bar.style.transition = "width 0.1s linear";
            //     // Create text element
            //     const timeLabel = document.createElement("div");
            //     timeLabel.id = 'time-label'
            //     timeLabel.style.position = "absolute";
            //     timeLabel.style.width = "100%";
            //     timeLabel.style.height = "100%";
            //     timeLabel.style.display = "flex";
            //     timeLabel.style.alignItems = "center";
            //     timeLabel.style.justifyContent = "center";
            //     timeLabel.style.fontWeight = "bold";
            //     timeLabel.style.color = "#333";
            //     timeLabel.style.zIndex = "1";
            //     // append
            //     this.progressBar.appendChild(bar);
            //     this.progressBar.appendChild(timeLabel);
            //     await playAnimation(this.progressBar, ['animate__bounceInRight'], ['animate__bounceInRight']);
            //     break;

            case "updateCountdownBar":
                const { percent, timeLeft } = payload;
                document.getElementById('progress-bar').style.width = percent + "%";
                document.getElementById('time-label').innerText = timeLeft.toFixed(1) + " s";
                break;

            case "stopCountdownBar":
                // Signal the countdown loop to stop
                this.gameController.state.stopCountDown = true;
                // Clear visual bar
                this.progressBar.innerHTML = "";
                break;


            case "timeUp":
                console.log("Time's up!");

                break;

            // case "gameWon":
            //     const { totalMoves, totalMatches } = payload

            //     // Create game over container
            //     this.result.innerHTML = ""
            //     const gameOverContainer = document.createElement("div")
            //     gameOverContainer.className = "game-over-container"

            //     // Create header
            //     const headerSection = document.createElement("div")
            //     headerSection.className = "game-over-header"

            //     const gameTitle = document.createElement("h1")
            //     gameTitle.className = "game-over-title"
            //     gameTitle.textContent = "Congratulations!"

            //     const gameSubtitle = document.createElement("h2")
            //     gameSubtitle.className = "game-over-subtitle"
            //     gameSubtitle.textContent = "You've matched all the pairs!"

            //     headerSection.appendChild(gameTitle)
            //     headerSection.appendChild(gameSubtitle)

            //     // Create stats section
            //     const statsSection = document.createElement("div")
            //     statsSection.className = "game-over-stats"

            //     // Time stats
            //     const timeStats = document.createElement("div")
            //     timeStats.className = "stats-card time-stats"

            //     const timeTitle = document.createElement("h3")
            //     timeTitle.textContent = "Time"

            //     const timeValue = document.createElement("p")
            //     const formattedMinutes = String(this.gameController.state.minutes).padStart(2, "0")
            //     const formattedSeconds = String(this.gameController.state.seconds).padStart(2, "0")
            //     timeValue.textContent = `${formattedMinutes}:${formattedSeconds}`

            //     timeStats.appendChild(timeTitle)
            //     timeStats.appendChild(timeValue)

            //     // Moves stats
            //     const movesStats = document.createElement("div")
            //     movesStats.className = "stats-card moves-stats"

            //     const movesTitle = document.createElement("h3")
            //     movesTitle.textContent = "Moves"

            //     const movesValue = document.createElement("p")
            //     movesValue.textContent = totalMoves

            //     movesStats.appendChild(movesTitle)
            //     movesStats.appendChild(movesValue)

            //     // Matched pairs stats
            //     const pairsStats = document.createElement("div")
            //     pairsStats.className = "stats-card matched-pairs-stats"

            //     const pairsTitle = document.createElement("h3")
            //     pairsTitle.textContent = "Pairs Matched"

            //     const pairsValue = document.createElement("p")
            //     pairsValue.textContent = totalMatches.length

            //     pairsStats.appendChild(pairsTitle)
            //     pairsStats.appendChild(pairsValue)

            //     // Add all stats to container
            //     statsSection.appendChild(timeStats)
            //     statsSection.appendChild(movesStats)
            //     statsSection.appendChild(pairsStats)

            //     // Create pairs section
            //     const pairsSection = document.createElement("div")
            //     pairsSection.className = "game-over-pairs"

            //     const pairsHeader = document.createElement("h2")
            //     pairsHeader.textContent = "Matched Pairs"
            //     pairsSection.appendChild(pairsHeader)

            //     // Add each matched pair
            //     totalMatches.forEach((match, index) => {
            //         const color = this.gameController.colorMapping[index]

            //         const baseCard = document.createElement("div")
            //         baseCard.className = "pair-card"
            //         baseCard.style.backgroundColor = color
            //         baseCard.textContent = match.base

            //         const matchCard = document.createElement("div")
            //         matchCard.className = "pair-card"
            //         matchCard.style.backgroundColor = color
            //         matchCard.textContent = match.match

            //         pairsSection.appendChild(baseCard)
            //         pairsSection.appendChild(matchCard)
            //     })

            //     // Create buttons section
            //     const buttonsSection = document.createElement("div")
            //     buttonsSection.className = "game-over-buttons"

            //     const playAgainButton = document.createElement("button")
            //     playAgainButton.id = "start"
            //     playAgainButton.className = "game-button"
            //     playAgainButton.textContent = "Play Again"
            //     playAgainButton.addEventListener("click", () => {
            //         window.location.reload()
            //     })

            //     const newGameButton = document.createElement("button")
            //     newGameButton.id = "newgame"
            //     newGameButton.className = "game-button"
            //     newGameButton.textContent = "New Game"
            //     newGameButton.addEventListener("click", () => {
            //         window.location.href = "index.html"
            //     })

            //     buttonsSection.appendChild(playAgainButton)
            //     buttonsSection.appendChild(newGameButton)

            //     // Add all sections to the game over container
            //     gameOverContainer.appendChild(headerSection)
            //     gameOverContainer.appendChild(statsSection)
            //     gameOverContainer.appendChild(pairsSection)
            //     gameOverContainer.appendChild(buttonsSection)

            //     // Add the game over container to the result div
            //     this.result.appendChild(gameOverContainer)
            //     this.result.classList.remove("hide")
            //     break

            case "enterFullScreen":
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                    document.documentElement.msRequestFullscreen();
                }
                break;
        }
    }

    checkFullscreen() {
        const overlay = document.getElementById('overlay');
        if (document.fullscreenElement) {
            overlay.classList.add('hidden');
        } else {
            overlay.classList.remove('hidden');
        }
    }
}
