import { Config } from './types';

// Configuration file names
export const CONFIG_FILE_NAME = 'context.config.json';
export const OUTPUT_FILE_NAME = 'context.txt';

// Default configuration settings
export const defaultConfig: Config = {
    include: [
        'package.json',
        'tsconfig.json',
        'tailwind.config.json',
        'src',
        'lib',
        'api',
        'README.md',
    ],
    exclude: [],
    allowedExtensions: ['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.html', '.css', '.txt', '.mjs']
};
