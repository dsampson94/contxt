import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_FILE_NAME, OUTPUT_FILE_NAME, defaultConfig } from './config';

const rootDir = process.cwd();
const configFilePath = path.join(rootDir, CONFIG_FILE_NAME);
const outputFilePath = path.join(rootDir, OUTPUT_FILE_NAME);
const gitignorePath = path.join(rootDir, '.gitignore');

/**
 * Creates a default configuration file if it doesn't exist.
 */
const createDefaultConfig = (): void => {
    if (!fs.existsSync(configFilePath)) {
        fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }
};

/**
 * Creates an empty output file if it doesn't exist.
 */
const createOutputFile = (): void => {
    if (!fs.existsSync(outputFilePath)) {
        fs.writeFileSync(outputFilePath, '', 'utf-8');
    }
};

/**
 * Adds entries to the .gitignore file if they are not already present.
 */
const addToGitignore = (): void => {
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    }
    const entries = [CONFIG_FILE_NAME, OUTPUT_FILE_NAME];
    const newEntries = entries.filter(entry => !gitignoreContent.includes(entry));
    if (newEntries.length > 0) {
        gitignoreContent += `\n${newEntries.join('\n')}\n`;
        fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
    }
};

/**
 * Main function to run the script. This function checks if the configuration file and output file exist,
 * creates them if they don't, and then adds these files to .gitignore.
 */
const run = (): void => {
    createDefaultConfig();
    createOutputFile();
    addToGitignore();
};

run();
