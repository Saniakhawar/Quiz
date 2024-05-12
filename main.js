import inquirer from "inquirer";
import chalk from "chalk";
const apiLink = "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple";
const fetchData = async (data) => {
    const fetchQuiz = await fetch(data);
    const res = await fetchQuiz.json();
    return res.results;
};
const startQuiz = async () => {
    let data = await fetchData(apiLink);
    let score = 0;
    let name = await inquirer.prompt({
        name: "fname",
        type: "input",
        message: chalk.yellow.bold("What is your name?"),
    });
    for (let i = 0; i < 5; i++) {
        let answers = [...data[i].incorrect_answers, data[i].correct_answer];
        let ans = await inquirer.prompt({
            name: "quiz",
            type: "list",
            message: data[i].question,
            choices: answers.map((val) => val),
        });
        if (ans.quiz === data[i].correct_answer) {
            ++score;
        }
    }
    console.log(chalk.green.bold(`\n\n\tDear ${chalk.green.bold(name.fname)}, your score is ${chalk.red.bold(score)} out of ${chalk.red.bold(10)}\n\n`));
    let feedback = "";
    if (score === 5) {
        feedback = chalk.blue.bold("Congratulations! You got a perfect score!");
    }
    else if (score >= 3) {
        feedback = chalk.green.bold("Well done! You did a great job!");
    }
    else {
        feedback = chalk.yellow.bold("Keep practicing! You'll improve with more quizzes.");
    }
    console.log(feedback);
    const retry = await inquirer.prompt({
        name: "retry",
        type: "confirm",
        message: chalk.yellow.bold("Do you want to retry the quiz?"),
    });
    if (retry.retry) {
        // Restart the quiz
        startQuiz();
    }
    else {
        console.log(chalk.yellow.bold("\nThank you for playing!"));
    }
};
startQuiz();
