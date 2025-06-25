const Utils = require("./utils.js");

console.log("Starting generation...");
Utils.cleanListFolder();

console.log("> Reading markdowns data fields..");
const contentInfos = Utils.getMarkdownDatas();
console.log("> All markdowns readed succesfully");

console.log("> Organize content IDs");
Utils.organizeIDs(contentInfos);
console.log("> All content IDs organized");

console.log("> Updating last_edit fields");
Utils.updateLastEditFields(contentInfos);
console.log("> last_edit fields updated");

console.log("> Generating output...");
Utils.createListFiles(contentInfos);
console.log("Outputs successfully generated.");
console.log("Please don't edit anything created in /list folder.");
