const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const teamArray = [];

// Code to use inquirer to gather information about the development team members and to create objects for each team member

function createManager() {

    console.log("Building your team summary - Enter manager info first");
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the manager's name?",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter a name.";
            }
        },
        {
            type: "input",
            name: "id",
            message: "What is the manager's id?",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "Answer must be an integer greater than zero.";
            }
        },
        {
            type: "input",
            name: "email",
            message: "What is the manager's email?",
            validate: answer => {
                const pass = answer.match(
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                );
                if (pass) {
                    return true;
                }
                return "Email address must be valid.";
            }
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number (10 digit number - no dashes)?",
            validate: answer => {
                const pass = answer.match(
                    /^\d{10}$/
                );
                if (pass) {
                    return true;
                }
                return "Number must be numeric.";
            }
        }
    ]).then(answers => {
        answers.officeNumber = answers.officeNumber.substr(0, 3) + '-' + answers.officeNumber.substr(3, 3) + '-' + answers.officeNumber.substr(6,4)
        const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        teamMembers.push(manager);
        teamArray.push(answers.id);
        createTeam();
    });
}

function createTeam(){
    inquirer.prompt(
        {
            type: "list",
            message: `What is the employee role of the next entry?`,
            name: "role",
            choices: ["Engineer", "Intern", "Exit"]
        }
    ).then(answers => {
        switch(answers.role){
            case "Engineer":
                createEngineer();
                break;
            case "Intern":
                createIntern();
                break;
            case "Exit":
                buildTeam();
        }
        
    })

    
}

function createEngineer(){
    inquirer.prompt([
        {
            type: "input",
            message: `What is the Engineer's name?`,
            name: "name",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter a name.";
            }
        },
        {
            type: "input",
            message: `What is the Enginner's id?`,
            name: "id",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    if (teamArray.includes(answer)) {
                        return "This ID is already taken. Please enter a different number.";
                    } else {
                        return true;
                    }
                }
                return "Answer must be an integer greater than zero.";
            }
        },
        {
            type: "input",
            message: `What is the Engineer's Email?`,
            name: "email",
            validate: answer => {
                const pass = answer.match(
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                );
                if (pass) {
                    return true;
                }
                return "Email address must be valid.";
            }
        },
        {
            type: "input",
            message: "What is the Engineer's GitHub?",
            name: "github",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "This information is required.";
            }
        }
    ]).then((answers) => {
        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
        teamMembers.push(engineer);
        teamArray.push(answers.id);
        createTeam()
    })
}

function createIntern(){
    inquirer.prompt([
        {
            type: "input",
            message: `What is the Intern's name?`,
            name: "name",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "Please enter a name.";
            }
        },
        {
            type: "input",
            message: `What is the Intern's id?`,
            name: "id",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    if (teamArray.includes(answer)) {
                        return "This ID is already taken. Please enter a different number.";
                    } else {
                        return true;
                    }
                }
                return "Answer must be an integer greater than zero.";
            }
        },
        {
            type: "input",
            message: `What is the Intern's Email?`,
            name: "email",
            validate: answer => {
                const pass = answer.match(
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                );
                if (pass) {
                    return true;
                }
                return "Email address must be valid.";
            }
        },
        {
            type: "input",
            message: "What school is the Intern attending?",
            name: "school",
            validate: answer => {
                if (answer !== "") {
                    return true;
                }
                return "This information is required.";
            }
        }
    ]).then((answers) => {
        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        teamMembers.push(intern);
        teamArray.push(answers.id);
        createTeam()
    })
}

function buildTeam(){
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8")
    console.log(`The ${outputPath} file has been created`)
}

createManager();