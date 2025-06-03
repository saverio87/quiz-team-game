

// Game State and Observer System
export class GameManager {
    constructor() {
        this.state = {
            duration: 10,
            stopCountDown: true,
            questions: [],
            selectedCardId: null,
            teams: [
                { id: 0, name: "Red Dragons", points: 0 },
                { id: 1, name: "Blue Sharks", points: 0 },
                { id: 2, name: "Green Goblins", points: 0 }
            ],
            currentTeamIndex: 0 // Index of team whose turn it is
        };

        this.colorMapping = {
            0: "lightcoral",
            1: "thistle",
            2: "yellow",
            3: "orange",
            4: "pink",
            5: "cadetblue",
            6: "cornsilk",
            7: "tomato",
            8: "yellowgreen",
            9: "royalblue"
        };
        this.interval = null;
        this.observers = [];
        this.listeners = [];

    }

    // Observers and listener

    addObserver(observer) {
        this.observers.push(observer);
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    async notifyObservers(eventType, payload) {
        // Notify all observers about the event and collect their Promises
        const promises = this.observers.map(observer => observer.update(eventType, payload));
        try {
            await Promise.all(promises);
            console.log(`✅ All observers resolved for event: ${eventType}`);
        } catch (error) {
            console.error(`❌ Observer error for event: ${eventType}`, error);
        }
    }

    async notifyListeners(eventType) {
        console.log('notifyListeners activated')
        // Notify all observers about the event and collect their Promises
        const promises = this.listeners.map(listener => listener.update(eventType));
        try {
            await Promise.all(promises);
            console.log(`✅ All listeners resolved for event: ${eventType}`);
        } catch (error) {
            console.error(`❌ Listener error for event: ${eventType}`, error);
        }

    }

    // Rendering


    // Start / Stop Game

    async startGame(questions) {
        // Shuffle question objects
        this.state.questions = this.shuffle(questions);
        // Render board
        this.notifyObservers('renderBoard', { questions: this.state.questions })
        this.notifyObservers('enablePanels', { panelsToEnable: 'boardPanels' })
        // Start game - UI rendering
        this.notifyObservers("startGame", this.state);

    }

    stopGame() {
        this.resetTimer();
        this.notifyObservers("stopGame", null);
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }


    async handlePanelClick(panelElement, question) {
        // If question panel has already been answered cannot be clicked again.
        if (panelElement.classList.contains("answered")) {
            console.log("question has already been answered can't click.");
            return;
        }
        this.state.selectedCardId = question.id;
        await this.notifyObservers('panelsDisappear', { panelElement })
        await this.notifyObservers('panelFlash', { panelElement })
        // as soon as question view is rendered, panels are disabled to allow time for
        // the countdown bar to render / animate
        await this.notifyObservers('renderQuestionView', { question })
        await this.startCountDown()

    }

    async handleAnswerClick(answerPanel, option, questionObject) {
        // soon as answer is clicked, you can't click again
        this.notifyObservers('disablePanels', { panelsToDisable: 'answerPanels' })
        let answerStatus;
        // Pre-format correct answer depending on question type (true/false vs multiple choice)
        const correctAnswer = questionObject.type == 'true-false' ?
            questionObject.correctAnswer.toString() :
            questionObject.correctAnswer
        if (option == correctAnswer) {
            // state update
            answerStatus = 'correct';
            this.updateQuestionObject(questionObject);
            this.getCurrentTeam().points += questionObject.points;
            // observers
            await this.notifyObservers('stopCountdownBar', {})
            await this.notifyObservers('correctAnswerClicked', { answerPanel })
            // Check for game over
            if (this.checkIfAllQuestionsAnswered()) {
                await this.notifyObservers('gameOver', {})
                alert('Game over!')
            }
        } else {
            answerStatus = 'wrong';
            await this.notifyObservers('stopCountdownBar', {})
            await this.notifyObservers('wrongAnswerClicked', { answerPanel })
        }

        // Reset selected card ID
        this.state.selectedCardId = null;
        // Move to the next team
        this.advanceTurn();
        await this.notifyObservers('renderBoard', { questions: this.state.questions, answerStatus: answerStatus })
        this.notifyObservers('enablePanels', { panelsToEnable: 'boardPanels' })

    }

    updateQuestionObject(questionObject) {
        // Find question to be modified in state array state.questions
        const targetQuestion = this.state.questions.find(q => q.id == questionObject.id);
        if (targetQuestion) {
            // store information of which team answered question
            targetQuestion.answered = true
            targetQuestion.answeredByTeam = this.getCurrentTeam().id // to be modified
        }
    }

    // Game over check

    checkIfAllQuestionsAnswered() {
        return this.state.questions.every(question => question.answered === true)
    }

    // Timer

    startCountDown = async () => {
        let timeLeft = this.state.duration || 10;
        this.state.stopCountDown = false; // <- flag to control early stop

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (timeLeft > 0 && !this.state.stopCountDown) {
            timeLeft = Math.max(0, timeLeft - 0.1);
            const percent = (timeLeft / this.state.duration) * 100;
            this.notifyObservers('updateCountdownBar', { percent: percent, timeLeft: timeLeft })
            // bar.style.width = percent + "%";
            // timeLabel.innerText = timeLeft.toFixed(1) + " s";
            await delay(100);
        }

        if (!this.state.stopCountDown) {
            this.advanceTurn();
            await this.notifyObservers('renderBoard', { questions: this.state.questions, answerStatus: 'timeout' })
            this.notifyObservers('enablePanels', { panelsToEnable: 'boardPanels' })

        }
    };



    // Turn taking system
    getCurrentTeam() {
        return this.state.teams[this.state.currentTeamIndex];
    }

    advanceTurn() {
        this.state.currentTeamIndex = (this.state.currentTeamIndex + 1) % this.state.teams.length;
        console.log("Next turn:", this.getCurrentTeam().name);

    }

}


