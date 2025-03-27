import { Config } from './types';

// Configuration file names
export const CONFIG_FILE_NAME = 'context.config.json';
export const OUTPUT_FILE_NAME = 'con.txt';

// Default configuration settings
// NOTE: We now include the entire project root ("."), and the user can exclude paths as needed.
export const defaultConfig: Config = {
    include: ['.'],
    exclude: ['node_modules', 'dist', 'package-lock.json', 'context.config.json', 'con.txt', '.idea', '.next', '.env'],
    allowedExtensions: ['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.html', '.css', '.txt', '.mjs']
};
