#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { addToGitignore, createDefaultConfig, generateContextFile } from './utils';
import { CONFIG_FILE_NAME, OUTPUT_FILE_NAME } from './config';
import { Config } from './types';

const rootDir = process.cwd();
const configFilePath = path.join(rootDir, CONFIG_FILE_NAME);
const gitignorePath = path.join(rootDir, '.gitignore');
let timeout: NodeJS.Timeout | null = null;

/**
 * Watches the specified files and directories for changes and updates the context file.
 *
 * @param config - The configuration object (now including everything from the root).
 */
const watchFiles = (config: Config): void => {
    const debounceUpdate = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(generateContextFile, 50);
    };

    config.include.forEach(item => {
        const fullPath = path.join(rootDir, item);
        if (fs.existsSync(fullPath)) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                fs.watch(fullPath, { recursive: true }, debounceUpdate);
            } else {
                fs.watchFile(fullPath, debounceUpdate);
            }
        }
    });
};

/**
 * Main function to run the script. This function:
 *   - Checks if the configuration file exists, and creates it if not.
 *   - Generates the context file from the entire project root.
 *   - Adds the configuration and output files to .gitignore.
 *   - Sets up file watchers so changes update the context file.
 */
const run = (): void => {
    if (!fs.existsSync(configFilePath)) {
        createDefaultConfig(configFilePath);
    }

    generateContextFile();

    addToGitignore({ gitignorePath, entries: [CONFIG_FILE_NAME, OUTPUT_FILE_NAME] });

    const config: Config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    watchFiles(config);

    fs.watchFile(configFilePath, () => {
        const updatedConfig: Config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
        watchFiles(updatedConfig);
        generateContextFile();
    });
};

run();
