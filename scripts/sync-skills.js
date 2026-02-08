import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = 'https://github.com/hallucinaut/skills-pi.git';
const TEMP_DIR = path.join(__dirname, '../.skills-temp');
const TARGET_DIR = path.join(__dirname, '../src/content/skills');

function syncSkills() {
    console.log('🔄 Starting skills synchronization...');

    // 1. Clean and recreate target directory
    if (fs.existsSync(TARGET_DIR)) {
        fs.rmSync(TARGET_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TARGET_DIR, { recursive: true });

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
    const skillsSourceDir = path.join(TEMP_DIR, 'skills');
    if (!fs.existsSync(skillsSourceDir)) {
        console.error('❌ Skills directory not found in repository!');
        return;
    }

    const items = fs.readdirSync(skillsSourceDir);
    let count = 0;

    items.forEach(item => {
        const itemPath = path.join(skillsSourceDir, item);
        const skillFile = path.join(itemPath, 'SKILL.md');

        if (fs.statSync(itemPath).isDirectory() && fs.existsSync(skillFile)) {
            const content = fs.readFileSync(skillFile, 'utf-8');
            
            // Parse Frontmatter manually
            // Regex to capture content between --- and ---
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
description: "${newFrontmatter.description.replace(/"/g, '\\"')}"
category: "${newFrontmatter.category}"
language: "${newFrontmatter.language}"
---

${body}
`;

            fs.writeFileSync(path.join(TARGET_DIR, `${item}.md`), newContent);
            count++;
        }
    });

    console.log(`✅ Successfully synced ${count} skills to ${TARGET_DIR}`);
}

syncSkills();