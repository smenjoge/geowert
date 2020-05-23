const inquirer = require('inquirer');
const fs = require('fs');
const util = require("util");
const appendFile = util.promisify(fs.appendFile);
const generatemarkdown = require("./utils/generateMarkdown");

const fileName = "readme1.md";

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
    await appendFile(fileName, data + '\n\n', function(err) {
        if (err) {
        return console.log(err);
        }
        return "Success";
    });
};

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
            case "projectTitle": 
                promptObj = await inquirer.prompt(promptList[i]);
                markDnTxt = await generatemarkdown(promptObj);
                await writeToFile(markDnTxt);
                break;
            case "projectDesc": 
                promptObj = await inquirer.prompt(promptList[i]);    
                markDnTxt = await generatemarkdown({sectionName: "Descripton"});
                await writeToFile(markDnTxt);
                await writeToFile("```" + '\n' + promptObj.projectDesc + '\n' + "```");
                break;
            case "tableOfContents": 
                promptObj = await inquirer.prompt(promptList[i]);    
                markDnTxt = await generatemarkdown({sectionName: "Table of Contents"});
                await writeToFile(markDnTxt);   
                choicesArr = promptObj.tableOfContents;
                if (choicesArr) {
                    for (let j=0; j < choicesArr.length; j++) {
                        markDnTxt = await generatemarkdown({listItem: choicesArr[j]});
                        await writeToFile(markDnTxt);
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
            markDnTxt = await generatemarkdown({sectionName: choicesArr[k]});
            await writeToFile(markDnTxt);
            switch (choicesArr[k]) { 
                case "Installation": 
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Installation Information: " + k, name: "installInfo"});
                    await writeToFile("```" + '\n' + promptObj.installInfo + '\n' + "```");                    break;
                case "Usage": 
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Usage Information: ", name: "usageInfo"});
                    await writeToFile("```" + '\n' + promptObj.usageInfo + '\n' + "```");    
                    break;
                case "Contributing": 
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Contributing Information: ", name: "contrInfo"});
                    await writeToFile("```" + '\n' + promptObj.contrInfo + '\n' + "```");    
                    break;
                case "Tests":
                    promptObj = await inquirer.prompt({type: "input", message: "Enter Test cases: ", name: "testInfo"});
                    await writeToFile("```" + '\n' + promptObj.testInfo + '\n' + "```");    
                    break;
                // case "Questions":
                //     break;
                default: 
                    break;
            }
        }
    }
};

init();

