const readlineSync = require('readline-sync');
const chalk = require('chalk');
const emoji = require('node-emoji');
const colors = require('colors');


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

//QUESTIONS FOR QUIZ

const quizData = [

    {
        question: "How many hours of sleep do i need each night to feel good?",
        options: ["5", "6", "8", "10"],
        answerIndex: 2,

    },

    {
        question: "Do i prefer dogs or cats?",
        options: ["Both", "I dont like animals", "Cats", "Dogs"],
        answerIndex: 0,
    },

    {
        question: "I prefer peace and quiet or noise?",
        options: ["peace", "noise", "both"],
        answerIndex: 0,
    },

    {
        question: "What do i want to do in life?",
        options: ["I don't know", "Change the world", "Find happiness", "Make a lot of money"],
        answerIndex: 3,
    },

    {
        question: "What do i do for fun?",
        options: ["Read", "Talk to people", "Watch movies", "Play video games"],
        answerIndex: 2,
    },

    {
        question: "What's my favorite snack?",
        options: ["Chips", "Samosa", "Chocolate", "Popcorn"],
        answerIndex: 1,
    },

    {
        question: "What's my favorite season?",
        options: ["Summer", "Winter", "Spring", "Autumn"],
        answerIndex: 2,
    },

    {
        question: "What app do i use most often?",
        options: ["Instagram", "Whatsapp", "Twitter", "Discord"],
        answerIndex: 1,
    },

    {
        question: "What wouldn't i leave home without?",
        options: ["Wallet", "Mobile phone", "Keys", "Bag"],
        answerIndex: 1,
    },

    {
        question: "What kind of superpower would i like to poses?",
        options: ["Invisibility", "Teleportation", "Flying", "Super speed"],
        answerIndex: 3,
    },

    {
        question: "Where do i live?",
        options: ["Delhi", "Chandigarh", "Rajasthan", "Haryana"],
        answerIndex: 0,
    },

    {
        question: "What is my eye color?",
        options: ["Black", "Blue", "Brown", "Green"],
        answerIndex: 2,
    },

    {
        question: "What is my favorite ice-cream flavor?",
        options: ["Vanilla", "Butterscotch", "Chocolate", "Strawberry"],
        answerIndex: 1,
    },

    {
        question: "What was my favorite subject in School?",
        options: ["Math", "English", "Science", "History"],
        answerIndex: 2,
    },

    {
        question: "I am a morning person or a night owl?",
        options: ["Morning Person", "Night Owl", "Both", "None"],
        answerIndex: 1,
    },
];

// CHECK IF LOCAL STORAGE HAS PLAYERS ARRAY

if (localStorage.getItem("players") === null) {

    // IF NO PLAYERS ARRAY IS FOUND, STRINGIFY AND STORE PLAYERS ARRAY IN LOCAL STORAGE

    const players = [];
    localStorage.setItem("players", JSON.stringify(players));

}

// ARRAY OF ALL PLAYERS ALREADY STORED IN LOCAL STORAGE

const previousPlayers = JSON.parse(localStorage.getItem("players"));

// MADE THIS ARRAY TO STORE NAMES OF ALL EXISTING PLAYERS TO EASILY CHECK IF PLAYER ALREADY EXISTS

const allPlayers = [];

previousPlayers.forEach(player => {
    allPlayers.push(player.name.toLowerCase())
});

// GET PLAYERS NAME

const playerName = readlineSync.question("May i have your name? ");

// ACTIONS PLAYERS CAN PERFORM

const userActions = ["Start Quiz", "Leaderboard", "Your Highest Score", "Your Longest Streak"];

const userMsg = "Press respective number key's to choose an option.";


if (allPlayers.includes(playerName.toLowerCase())) {

    // DO THIS IF PLAYER ALREADY EXISTS

    console.log(colors.bgBrightBlue(`||=====Welcome back ${playerName} ${emoji.get('wave')}=====||`));
    console.log("What would you like to do: ");

    playQuiz();


} else {

    // DO THIS IF PLAYER DOES NOT EXIST
    // ADDING NEW PLAYER DETAILS TO LOCAL STORAGE

    const players = [...previousPlayers, { name: playerName, score: 0, level: 0, streak: 0 }];
    localStorage.setItem("players", JSON.stringify(players));

    console.log(colors.bgBrightBlue(`||=====Welcome to the Quiz ${playerName} ${emoji.get('wave')}=====||`));

    playQuiz();
}

// QUIZ FUNCTION TO ITERATE OVER QUIZ DATA

function playQuiz() {

    // SELECTED ACTIONS COME FROM READLINE-SYNC INDEX

    const selectedAction = readlineSync.keyInSelect(userActions, userMsg);

    const gameData = JSON.parse(localStorage.getItem("players"));

    let score = 0;
    let streak = 0;


    if (selectedAction === 0) {

        // Play quiz

        for (let i = 0; i < quizData.length; i++) {

            console.log(chalk.whiteBright.bold(colors.bgMagenta(`==> Question ${i + 1}: ` + quizData[i].question + `${emoji.get('thinking_face')}`)));

            // SELECTED ANSWER IS THE INDEX OF OPTION SELECTED BY PLAYER

            const selectedAnswer = readlineSync.keyInSelect(quizData[i].options, userMsg);

            if (selectedAnswer === -1) {
                // EXIT QUIZ AND SAVE DATA, THIS IS THE CANCEL OPTION
                break;
            };

            if (selectedAnswer === quizData[i].answerIndex) {
                // +2 POINTS FOR CORRECT ANSWER
                score += 2;
                // +1 STREAK FOR EVERY CONSECUTIVE CORRECT ANSWER
                streak += 1;

                console.log(colors.yellow(`==> score: ${score}`));
                console.log(colors.yellow(`==> streak: ${streak}`));

                // UPDATE STREAK DATA IN LOCAL STORAGE
                for (let i = 0; i < gameData.length; i++) {
                    if (gameData[i].name === playerName && streak > gameData[i].streak) {

                        gameData[i].streak = streak;
                    }

                }
                localStorage.setItem("players", JSON.stringify(gameData));



                console.log(colors.bgBrightBlue(`==> correct Answer! ${emoji.get('tada')} \n`));

                // SHOW LEVEL UP MSG IF CONDITIONS MET

                if (i === 4 && score > 7) {
                    console.log(colors.green("congrats! you have reached level 2 \n"));
                } else if (i === 9 && score > 15) {
                    console.log(colors.green("congrats! you have reached level 3 \n"));
                };

                // SHOW GAME OVER MSG IF CONDITIONS NOT MET FOR NEXT LEVEL OF QUESTIONS

                if (i === 4 && score < 7) {
                    console.log(colors.red("Game Over! Score atleast 8 points for level 2."));
                    break;
                } else if (i === 9 && score < 15) {
                    console.log(colors.red("Game Over! Score atleast 19 points for level 2."));
                    break;
                }

                if (i < quizData.length - 1) {
                    console.log("Here's the next question... \n");
                } else {
                    console.log(colors.bgWhite(`Thanks for playing the Quiz. Have a nice day.`))
                }


            } else {

                // DEDUCT POINTS FOR WRONG ANSWER AND SET STREAK TO 0

                score -= 0.25;
                streak = 0;

                console.log(colors.yellow(`==> score: ${score}`));
                console.log(colors.yellow(`==> streak: ${streak}`));

                if (streak === 0) {
                    console.log(colors.yellow(`==> Oh no!, Streak Lost ${emoji.get('white_frowning_face')}`));
                };

                // UPDATE STREAK DATA IF CURRENT STREAK IS GREATER THAN PREVIOUS AND SAVE TO LOCAL STORAGE

                for (let i = 0; i < gameData.length; i++) {
                    if (gameData[i].name === playerName && streak > gameData[i].streak) {

                        gameData[i].streak = streak;
                    }

                }
                localStorage.setItem("players", JSON.stringify(gameData));


                console.log(chalk.bgRedBright(`==> oops...Wrong answer! ${emoji.get('white_frowning_face')} \n`))

                if (i === 4 && score > 7) {
                    console.log("congrats! you have reached level 2");
                } else if (i === 9 && score > 15) {
                    console.log("congrats! you have reached level 3");
                }

                if (i === 4 && score < 7) {
                    console.log(colors.red("Game Over! Score atleast 8 points for level 2."));
                    break;
                } else if (i === 9 && score < 15) {
                    console.log(colors.red("Game Over! Score atleast 19 points for level 2."));
                    break;
                }

                if (i < quizData.length - 1) {
                    console.log("Here's the next question... \n")
                } else { console.log(colors.bgWhite(`Thanks for playing the Quiz. Have a nice day.`)) }
            }
        }

        // SAVE SCORE AT THE END OF GAME

        for (let i = 0; i < gameData.length; i++) {
            if (gameData[i].name === playerName && score > gameData[i].score) {

                gameData[i].score = score;
            }
        }
        localStorage.setItem("players", JSON.stringify(gameData));

    } else if (selectedAction === 1) {

        // MADE ARRAY FOR LEADERBOARD AND SORTED 

        let leaderboardArray = [...gameData];
        leaderboardArray.sort((a, b) => {
            return b.score - a.score;
        });

        console.log(colors.bgMagenta("===>   PLAYER --- SCORE"));

        leaderboardArray.forEach(player => {
            console.log(colors.bgBrightBlue(`===>   ${player.name} --- ${player.score}`));
        });

    } else if (selectedAction === 2) {

        // SHOW PLAYERS HIGHEST SCORE

        for (let i = 0; i < gameData.length; i++) {
            if (gameData[i].name === playerName) {
                console.log(colors.bgBrightBlue(`===> Your Highest Score Is ${gameData[i].score}`));
            }
        }
    } else if (selectedAction === 3) {

        // SHOW PLAYERS LONGEST STREAK

        for (let i = 0; i < gameData.length; i++) {
            if (gameData[i].name === playerName) {
                console.log(colors.bgBrightBlue(`===> Your longest streak is ${gameData[i].streak}`));
            }
        }
    }
}