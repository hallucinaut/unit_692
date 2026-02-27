import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = 'https://github.com/hallucinaut/skills.git';
const TEMP_DIR = path.join(__dirname, '../.skills-temp');
const TARGET_DIR = path.join(__dirname, '../src/content/skills');

function syncSkills() {
    console.log('🔄 Starting skills synchronization...');

    // 1. Prepare target directory
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // 2. Clone or update repository
    if (fs.existsSync(TEMP_DIR)) {
        console.log('📦 Updating existing repository...');
        try {
            execSync('git pull', { cwd: TEMP_DIR, stdio: 'ignore' });
        } catch (e) {
            console.log('⚠️ Git pull failed, cleaning and re-cloning...');
            fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            execSync(`git clone ${REPO_URL} ${TEMP_DIR}`, { stdio: 'ignore' });
        }
    } else {
        console.log('📦 Cloning repository...');
        execSync(`git clone ${REPO_URL} ${TEMP_DIR}`, { stdio: 'ignore' });
    }

    // 3. Process skills
    // In the new structure, skills are in the root of the repo (e.g. backend-api/SKILL.md)
    // So we iterate through TEMP_DIR directly.
    const skillsSourceDir = TEMP_DIR;

    if (!fs.existsSync(skillsSourceDir)) {
        console.error('❌ Source directory not found!');
        return;
    }

    const items = fs.readdirSync(skillsSourceDir);
    const validFiles = new Set();
    let count = 0;

    items.forEach(item => {
        // Skip hidden files/dirs like .git
        if (item.startsWith('.')) return;

        const itemPath = path.join(skillsSourceDir, item);
        const skillFile = path.join(itemPath, 'SKILL.md');

        if (fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory() && fs.existsSync(skillFile)) {
            const content = fs.readFileSync(skillFile, 'utf-8');

            // Parse Frontmatter manually
            const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            let frontmatter = {};
            let body = content;

            if (match) {
                const fmContent = match[1];
                const fmLines = fmContent.split(/\r?\n/);
                fmLines.forEach(line => {
                    const separatorIndex = line.indexOf(':');
                    if (separatorIndex > -1) {
                        const key = line.slice(0, separatorIndex).trim();
                        const val = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
                        frontmatter[key] = val;
                    }
                });
                body = content.replace(match[0], '').trim();
            }

            // Map fields to our schema
            const newFrontmatter = {
                title: frontmatter.name || item,
                description: frontmatter.description || `Documentation for ${item}`,
                category: 'tool', // Default category
                language: 'markdown',
                ...frontmatter // Allow overrides if they match
            };

            // Construct new file content
            const newContent = `---
title: "${newFrontmatter.title}"
description: "${newFrontmatter.description ? newFrontmatter.description.replace(/"/g, '\\"') : ''}"
category: "${newFrontmatter.category}"
language: "${newFrontmatter.language}"
---

${body}
`;
            const targetFile = path.join(TARGET_DIR, `${item}.md`);
            fs.writeFileSync(targetFile, newContent);
            validFiles.add(`${item}.md`);
            count++;
        }
    });
    // 4. Clean up stale files in target directory
    const existingFiles = fs.readdirSync(TARGET_DIR);
    existingFiles.forEach(file => {
        if (!validFiles.has(file) && file.endsWith('.md')) {
            fs.unlinkSync(path.join(TARGET_DIR, file));
            console.log(`🗑️ Removed stale skill: ${file}`);
        }
    });

    console.log(`✅ Successfully synced ${count} skills to ${TARGET_DIR}`);
}

syncSkills();