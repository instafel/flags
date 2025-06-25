const Utils = require("./utils.js")

console.log("Starting generation...")
Utils.cleanListFolder();
Utils.createListFolders();

console.log("> Reading markdowns data fields..")
const contentInfos = Utils.getMarkdownDatas()
console.log("> All markdowns readed succesfully")

console.log("> Checking flag duplications...")
const duplicateDatas = Utils.findDuplicateFids(contentInfos);
if (duplicateDatas.length > 0) {
    console.log("> Duplicate flags found:");
    for (const dup of duplicateDatas) {
        console.log(`  ${dup.filename} -> fid: ${dup.fid}`);
    }
    console.log("Please fix flag duplication before generate")
    process.exit(-1)
} else {
    console.log("> No any duplicated flag found.")
}

console.log("> Updating last_edit fields")
Utils.updateLastEditFields(contentInfos);
console.log("> last_edit fields updated")

console.log("> Generating output...")
Utils.createListFiles(contentInfos);
console.log("Outputs successfully generated.")
console.log("Please don't edit anything created in /list folder.")
