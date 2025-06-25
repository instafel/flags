const path = require("path")
const fs = require("fs");
const matter = require("gray-matter");
const { execSync } = require('child_process');

const requiredFields = ['fid', 'category', 'last_edit', 'title', 'desc', 'author', 'added_in', 'removed_in', 'uncompitable_flags'];
const categories = [
    'direct', 'reels', 'stories', 
    'feed', 'interface', 'notes',
    'quality', 'camera', 'call', 
    'fixes', 'comments', 'profile',
    'professional', 'livestreams', 'meta-ai'
]
const pathList = path.join(__dirname, 'list');
const pathContent = path.join(__dirname, 'content');

function groupByCategory(dataArray) {
  const grouped = {};

  for (const item of dataArray) {
    const category = item.frontmatter?.category || 'uncategorized';

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  }

  return grouped;
}

function createListFiles(dataArray) {
    const groupedArray = groupByCategory(dataArray);
    for (const category of categories) {
      if (groupedArray[category] != undefined) {
        console.log(`📂 ${category} (${groupedArray[category].length} flag)`);
        const listContent = []
        const sortedItems = groupedArray[category].sort((a, b) => {
          const dateA = Date.parse(a.frontmatter.last_edit);
          const dateB = Date.parse(b.frontmatter.last_edit);
          return dateB - dateA;
        });
        for (const item of sortedItems) {
            listContent.push([
                item.frontmatter.fid,
                item.frontmatter.title,
                item.frontmatter.author,
                item.frontmatter.last_edit
            ])
            fs.copyFileSync(
                path.join(pathContent, item.filename),
                path.join(pathList, category, item.frontmatter.fid + ".md"))
        }
        fs.writeFileSync(path.join(pathList, "_list_contents", category + ".json"), JSON.stringify(listContent), "utf-8")
      } else {
        console.log(`📂 ${category} (0 flag)`);
        fs.writeFileSync(path.join(pathList, "_list_contents", category + ".json"), JSON.stringify([]), "utf-8")
      }
    }
}

function createListFolders() {
    for (const category of categories) {
        fs.mkdirSync(path.join(pathList, category))
    }
}

function findDuplicateFids(dataArray) {
  const seen = new Set();
  const duplicates = [];

  for (const item of dataArray) {
    const fid = item.frontmatter?.fid;

    if (fid == null) continue;

    if (seen.has(fid)) {
      duplicates.push({
        filename: item.filename,
        fid,
      });
    } else {
      seen.add(fid);
    }
  }

  return duplicates;
}

function updateLastEditFields(arrayContent) {
    const changed = getChangedMarkdownFiles();

    if (changed.length === 0) {
        console.log('✅ No any markdown file updated');
    } else {
        changed.forEach((file) => {
            if (fs.existsSync(file)) {
                const fullPath = path.join(__dirname, file);
                const raw = fs.readFileSync(fullPath, 'utf-8');
                const parsed = matter(raw);

                const updatedData = {
                    ...parsed.data,
                    last_edit: getReadableTimestamp(),
                };

                const updatedContent = matter.stringify(parsed.content, updatedData);

                fs.writeFileSync(fullPath, updatedContent, 'utf-8');
                console.log(`✅ ${file}'s last_edit updated to ${updatedData.last_edit}`);
            }
        });
    }
}


function getReadableTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
         `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function getChangedMarkdownFiles() {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf-8' });
    const lines = output.split('\n').filter(Boolean);
    const changedFiles = lines
      .map(line => line.trim().slice(2))
      .map(line => line.replaceAll('"', ''))
      .map(line => line.trim())
      .filter(file => file.includes('content/') && file.includes('.md'));

    return changedFiles;
  } catch (err) {
    console.error('❌ An error occured while tracking commit files:', err.message);
    return [];
  }
}

function getMarkdownDatas() {
    const markdownFiles = fs.readdirSync(pathContent).filter((file) => file.endsWith(".md"));
    const results = [];

    for (const file of markdownFiles) {
        const fileContent = fs.readFileSync(path.join(pathContent, file));
        const { data: frontmatter, content } = matter(fileContent);

        const missingFields = requiredFields.filter((key) => !(key in frontmatter));

        if (missingFields.length == 0) {

            if (categories.includes(frontmatter.category)) {
                results.push({
                    filename: file,
                    frontmatter,
                });

                var lastEditDate = Date.parse(frontmatter.last_edit);
                console.log(`✅ Flag ${frontmatter.fid})/direct pass`)
            } else {
                console.log(`❌ File ${file} has unknown category, please check it and re-generate before publish`)
            }
        } else {
            console.log(`File ${file} has missing data fields, please check it and re-generate before publish`)
        }
    }

    return results;
}

function cleanListFolder() {
    if (fs.existsSync(pathList)) {
        fs.rmSync(pathList, { recursive: true, force: true });
        fs.mkdirSync(pathList);
        fs.mkdirSync(path.join(pathList, "_list_contents"));
    } else {
        fs.mkdirSync(pathList);
        fs.mkdirSync(path.join(pathList, "_list_contents"));
    }
}

module.exports = {
    cleanListFolder,
    pathList,
    pathContent,
    getMarkdownDatas,
    findDuplicateFids,
    createListFolders,
    createListFiles,
    updateLastEditFields
}