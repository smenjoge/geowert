const inquirer = require('inquirer');
const fs = require('fs');
const util = require("util");
const appendFile = util.promisify(fs.appendFile);
const getMarkdown = require("./utils/generateMarkdown");
const badgeObj = {
    badgeName: "",
    gitUser: "",
    gitRepo: ""
};
let badgeMarkdown;

const fileName = "README.md";

const promptList = [
    {
        type: "input",
        name: "userName",
        message: "Enter your GitHub user name:"
      },
      {
        type: "input",
        name: "repoName",
        message: "Enter your GitHub repo name:"
      },
      {
        type: "input",
        name: "projectTitle",
        message: "Enter your Project title:"
      },
      {
        type: "editor",
        name: "projectDesc",
        message: "Enter your Project Description:"
      },
      {
        type: "checkbox",
        message: "Which sections do you want to include?",
        name: "tableOfContents",
        choices: [
          "Installation", 
          "Usage", 
          "Contributing", 
          "Tests",
          "Questions"
        ]
      }
];

async function writeToFile(data) {
    await appendFile(fileName, data, function(err) {
        if (err) {
        return console.log(err);
        }
        return "File Successfully apended";
    });
};

async function writeBadge() {
    badgeObj.badgeName = "issues"
    badgeMarkdown = await getMarkdown.generateBadge(badgeObj);
    await writeToFile(badgeMarkdown);

    badgeObj.badgeName = "pull requests"
    badgeMarkdown = await getMarkdown.generateBadge(badgeObj);
    await writeToFile(badgeMarkdown);

    badgeObj.badgeName = "contributors"
    badgeMarkdown = await getMarkdown.generateBadge(badgeObj);
    await writeToFile(badgeMarkdown + '\n\n');

    return "Badges created";
}


async function init() {
    fs.writeFile(fileName, "", function(err) {
        if (err) {
        return console.log(err);
        }
    });    
    console.log(fileName + " file initialized!");
    let choicesArr = [];

    for (let i=0; i < promptList.length; i++) {
        let promptObj;
        let markDnTxt;

        switch (promptList[i].name) { 
            case "userName":
                promptObj = await inquirer.prompt(promptList[i]);
                badgeObj.gitUser = promptObj.userName;
                break;
            case "repoName":
                promptObj = await inquirer.prompt(promptList[i]);
                badgeObj.gitRepo = promptObj.repoName;
                break;
            case "projectTitle": 
                promptObj = await inquirer.prompt(promptList[i]);
                markDnTxt = await getMarkdown.generateMarkdown(promptObj);
                await writeToFile(markDnTxt + '\n\n');
                await writeBadge();
                break;
            case "projectDesc": 
                promptObj = await inquirer.prompt(promptList[i]);    
                markDnTxt = await getMarkdown.generateMarkdown({sectionName: "Descripton"});
                await writeToFile(markDnTxt + '\n');
                await writeToFile("```" + '\n' + promptObj.projectDesc + '\n' + "```" + '\n\n');
                break;
            case "tableOfContents": 
                promptObj = await inquirer.prompt(promptList[i]);    
                markDnTxt = await getMarkdown.generateMarkdown({sectionName: "Table of Contents"});
                await writeToFile(markDnTxt + '\n');   
                choicesArr = promptObj.tableOfContents;
                if (choicesArr) {
                    for (let j=0; j < choicesArr.length; j++) {
                        markDnTxt = await getMarkdown.generateMarkdown({listItem: choicesArr[j]});
                        await writeToFile(markDnTxt + '\n');
                    };
                };
                break;
            default: 
                break;
        }
    };

    console.log(choicesArr);
    if (choicesArr) {
        for (let k=0; k < choicesArr.length; k++) {
            let promptObj;
            let markDnTxt = await getMarkdown.generateMarkdown({sectionName: choicesArr[k]});
            await writeToFile(markDnTxt + '\n');
            switch (choicesArr[k]) { 
                case "Installation": 
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Installation Information: ", name: "installInfo"});
                    await writeToFile("```" + '\n' + promptObj.installInfo + '\n' + "```" + '\n\n');                    
                    break;
                case "Usage": 
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Usage Information: ", name: "usageInfo"});
                    await writeToFile("```" + '\n' + promptObj.usageInfo + '\n' + "```" + '\n\n');    
                    break;
                case "Contributing": 
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Contributing Information: ", name: "contrInfo"});
                    await writeToFile("```" + '\n' + promptObj.contrInfo + '\n' + "```" + '\n\n');    
                    break;
                case "Tests":
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Test cases: ", name: "testInfo"});
                    await writeToFile("```" + '\n' + promptObj.testInfo + '\n' + "```" + '\n\n');    
                    break;
                // case "Questions":
                //     break;
                default: 
                    break;
            };
        }
    }
};

init();


