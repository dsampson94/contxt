import * as path from 'path';
import { generateContextFile, createDefaultConfig, addToGitignore } from './utils';
import { CONFIG_FILE_NAME, OUTPUT_FILE_NAME } from './config';

const rootDir = process.cwd();
const configFilePath = path.join(rootDir, CONFIG_FILE_NAME);
const gitignorePath = path.join(rootDir, '.gitignore');

/**
 * Main function to run the script. This function checks if the configuration file and output file exist,
 * creates them if they don't, and then adds these files to .gitignore. Finally, it generates the context file based on the configuration.
 */
const run = (): void => {
    createDefaultConfig(configFilePath);
    addToGitignore({ gitignorePath, entries: [CONFIG_FILE_NAME, OUTPUT_FILE_NAME] });
    generateContextFile();
};

run();
