#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { collectContext } from './collectContext';
import { AddToGitignoreParams } from './types';

/**
 * Configuration file name.
 */
const CONFIG_FILE_NAME = 'context.config.json';

/**
 * Output file name.
 */
const OUTPUT_FILE_NAME = 'context.txt';

const rootDir = process.cwd();
const configFilePath = path.join(rootDir, CONFIG_FILE_NAME);
const outputFilePath = path.join(rootDir, OUTPUT_FILE_NAME);
const gitignorePath = path.join(rootDir, '.gitignore');

/**
 * Creates a default configuration file if it doesn't exist.
 * The configuration file allows the user to specify which files and directories
 * to include and exclude in the context collection process.
 *
 * @param configPath - The path to the configuration file.
 */
const createDefaultConfig = (configPath: string): void => {
    const defaultConfig = {
        /**
         * Configuration file for app-context. Specify the files and directories to include and exclude.
         *
         * include: An array of files and directories to include in the context.
         * Each item should be a string representing the relative path from the project root.
         *
         * exclude: An array of files and directories to exclude from the context.
         * Each item should be a string representing the relative path from the project root.
         * Items listed here will be excluded even if they are within directories listed in the 'include' array.
         */
        include: [
            'package.json',
            'tsconfig.json',
            'tailwind.config.json',
            'src',
            'lib',
            'api',
            'README.md',
        ],
        exclude: []
    };

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
};

/**
 * Adds entries to the .gitignore file if they are not already present.
 *
 * @param params - The parameters for adding entries to the .gitignore file.
 */
const addToGitignore = ({gitignorePath, entries}: AddToGitignoreParams): void => {
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    }
    const newEntries = entries.filter(entry => !gitignoreContent.includes(entry));
    if (newEntries.length > 0) {
        gitignoreContent += `\n${newEntries.join('\n')}\n`;
        fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
    }
};

/**
 * Generates the context file based on the current configuration.
 */
const generateContextFile = (): void => {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    if (fs.existsSync(outputFilePath)) {
        fs.unlinkSync(outputFilePath);
    }

    const context = collectContext(config.include.map((item: string) => ({path: item})), rootDir, config.exclude || []);

    fs.writeFileSync(outputFilePath, context, 'utf-8');
};

/**
 * Main function to run the script. This function checks if the configuration file exists,
 * creates it if it doesn't, reads the configuration, and then collects the context based
 * on the include and exclude paths specified in the configuration. The collected context
 * is written to the output file, and the configuration and output files are added to .gitignore.
 * It also sets up a watcher on the configuration file to regenerate the context file when the configuration changes.
 */
const run = (): void => {
    if (!fs.existsSync(configFilePath)) {
        createDefaultConfig(configFilePath);
    }

    generateContextFile();

    addToGitignore({gitignorePath, entries: [CONFIG_FILE_NAME, OUTPUT_FILE_NAME]});

    fs.watch(configFilePath, (eventType) => {
        if (eventType === 'change') {
            generateContextFile();
        }
    });
};

run();
