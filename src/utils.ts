import * as fs from 'fs';
import * as path from 'path';
import { collectContext } from './collectContext';
import { CONFIG_FILE_NAME, OUTPUT_FILE_NAME, defaultConfig } from './config';
import { Config, AddToGitignoreParams } from './types';

const rootDir = process.cwd();
const configFilePath = path.join(rootDir, CONFIG_FILE_NAME);
const outputFilePath = path.join(rootDir, OUTPUT_FILE_NAME);

/**
 * Type guard to check if an error is a Node.js error with a code.
 *
 * @param error - The error to check.
 * @returns Whether the error is a Node.js error with a code.
 */
export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return typeof error === 'object' && error !== null && 'code' in error;
}

/**
 * Creates a default configuration file if it doesn't exist.
 *
 * @param configPath - The path to the configuration file.
 */
export const createDefaultConfig = (configPath: string): void => {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }
};

/**
 * Adds entries to the .gitignore file if they are not already present.
 *
 * @param params - The parameters for adding entries to the .gitignore file.
 */
export const addToGitignore = ({ gitignorePath, entries }: AddToGitignoreParams): void => {
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
 * Groups paths by their folders.
 *
 * @param paths - Array of paths to group.
 * @returns A string with grouped paths.
 */
const groupPathsByFolder = (paths: string[]): string => {
    const grouped: { [key: string]: string[] } = {};

    paths.forEach((p) => {
        const dir = path.dirname(p);
        if (!grouped[dir]) {
            grouped[dir] = [];
        }
        grouped[dir].push(p);
    });

    return Object.entries(grouped)
        .map(([folder, files]) => `${folder}/\n${files.map(file => `- ${file}`).join('\n')}`)
        .join('\n\n');
};

/**
 * Generates the context file based on the current configuration.
 */
export const generateContextFile = (): void => {
    let config: Config;

    try {
        config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    } catch (error) {
        if (isNodeError(error) && error.code === 'ENOENT') {
            console.warn(`Warning: ${CONFIG_FILE_NAME} not found. Creating default configuration.`);
            createDefaultConfig(configFilePath);
            config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
        } else {
            throw error;
        }
    }

    try {
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
    } catch (error) {
        if (isNodeError(error) && error.code === 'EBUSY') {
            console.error(`Error: The file ${outputFilePath} is currently in use and cannot be deleted.`);
            return;
        }
        throw error;
    }

    const { content, paths } = collectContext(
        config.include.map((item: string) => ({ path: item })),
        rootDir,
        config.exclude || [],
        config.allowedExtensions || []
    );

    const header = `# Included files:\n${groupPathsByFolder(paths)}\n\n`;
    fs.writeFileSync(outputFilePath, header + content, 'utf-8');
};
