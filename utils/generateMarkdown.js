let markDwnVal;

async function generateMarkdown(data) {
  if (data.projectTitle) {
    markDwnVal =  `# ${data.projectTitle}`;  
  }
  if (data.sectionName) {
    markDwnVal =  `## ${data.sectionName}`;  
  }
  if (data.listItem) {
    markDwnVal =  `* [${data.listItem}](#${data.listItem})`;  
  }
  return markDwnVal;
};


module.exports = generateMarkdown;
