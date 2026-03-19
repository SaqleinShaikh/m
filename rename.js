const fs = require("fs");
const path = require("path");

const dirs = ["app", "components", "lib", "hooks", "data", "supabase"];
const root = "c:\\Users\\Windows 10\\Documents\\saqlein-portfolio";

function walk(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const list = fs.readdirSync(dir);
    for (const item of list) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(walk(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

let allFiles = [];
for (const d of dirs) {
    allFiles = allFiles.concat(walk(path.join(root, d)));
}

let movedFiles = [];
for (const file of allFiles) {
    if (file.endsWith('.js') && file.includes('rename.js')) continue;

    let content = fs.readFileSync(file, "utf8");
    let changed = false;
    let newContent = content.replace(/Testimonials/g, "Endorsements")
                           .replace(/testimonials/g, "endorsements")
                           .replace(/TESTIMONIALS/g, "ENDORSEMENTS")
                           .replace(/Testimonial/g, "Endorsement")
                           .replace(/testimonial/g, "endorsement")
                           .replace(/TESTIMONIAL/g, "ENDORSEMENT");
                           
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, "utf8");
        console.log(`Updated content: ${file}`);
    }
    
    // rename file itself
    const basename = path.basename(file);
    let newBasename = basename.replace(/Testimonials/g, "Endorsements")
                              .replace(/testimonials/g, "endorsements")
                              .replace(/TESTIMONIALS/g, "ENDORSEMENTS")
                              .replace(/Testimonial/g, "Endorsement")
                              .replace(/testimonial/g, "endorsement")
                              .replace(/TESTIMONIAL/g, "ENDORSEMENT");
    if (newBasename !== basename) {
        const newFile = path.join(path.dirname(file), newBasename);
        fs.renameSync(file, newFile);
        console.log(`Renamed file ${file} to ${newFile}`);
        movedFiles.push({ old: file, new: newFile });
    }
}

// Rename directories
function walkDirs(dir) {
    let directories = [];
    if (!fs.existsSync(dir)) return directories;
    const list = fs.readdirSync(dir);
    for (const item of list) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            directories = directories.concat(walkDirs(fullPath));
            directories.push(fullPath);
        }
    }
    return directories;
}

let allDirs = [];
for (const d of dirs) {
    allDirs = allDirs.concat(walkDirs(path.join(root, d)));
}

// Sort dirs descending length so we rename deepest first
allDirs.sort((a,b) => b.length - a.length);

for (const dir of allDirs) {
    const basename = path.basename(dir);
    let newBasename = basename.replace(/Testimonials/g, "Endorsements")
                              .replace(/testimonials/g, "endorsements")
                              .replace(/TESTIMONIALS/g, "ENDORSEMENTS")
                              .replace(/Testimonial/g, "Endorsement")
                              .replace(/testimonial/g, "endorsement")
                              .replace(/TESTIMONIAL/g, "ENDORSEMENT");
                              
    if (newBasename !== basename) {
        const newDir = path.join(path.dirname(dir), newBasename);
        try {
            fs.renameSync(dir, newDir);
            console.log(`Renamed dir ${dir} to ${newDir}`);
        } catch(e) {
            console.log("Failed to rename dir", dir);
        }
    }
}
