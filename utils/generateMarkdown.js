let markDwnVal;
let badgeUrl;

module.exports = {
  generateMarkdown: async data => {
    if (data.projectTitle) {
      markDwnVal =  `# ${data.projectTitle}`;  
    }
    if (data.sectionName) {
      markDwnVal =  `## ${data.sectionName}`;  
    }
    if (data.listItem) {
      markDwnVal =  `* [${data.listItem}](#${data.listItem})`;  
    }
    if (data.gitImage) {
      markDwnVal =  `![${data.gitImage} Profile Pic](https://github.com/${data.gitImage}.png?size=60)`;
    }
    return markDwnVal;
  },
  generateBadge: async data => {
    if (data.badgeName === "issues") {
      badgeUrl = `[![GitHub ${data.badgeName}](https://img.shields.io/github/issues/${data.gitUser}/${data.gitRepo})](https://github.com/${data.gitUser}/${data.gitRepo}/issues) `;
    }
    if (data.badgeName === "pull requests") {
      badgeUrl = `[![GitHub ${data.badgeName}](https://img.shields.io/github/issues-pr/${data.gitUser}/${data.gitRepo})](https://github.com/${data.gitUser}/${data.gitRepo}/pulls) `;
    }
    if (data.badgeName === "contributors") {
      badgeUrl = `[![GitHub ${data.badgeName}](https://img.shields.io/github/contributors/${data.gitUser}/${data.gitRepo})](https://github.com/${data.gitUser}/${data.gitRepo}/graphs/contributors) `;
    }
    return badgeUrl;
  }
};
