import * as fs from 'fs';
import * as path from 'path';
import { IncludeItem, IsExcludedParams, ReadDirectoryParams, ReadFileParams, DirectoryReadResult } from './types';

/**
 * Default allowed file extensions for code files.
 */
const defaultAllowedExtensions: string[] = ['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.html', '.css', '.mjs'];

/**
 * Validates and filters the allowed extensions to ensure only code-related extensions are included.
 *
 * @param extensions - An array of extensions to validate.
 * @returns A filtered array of valid extensions.
 */
const validateExtensions = (extensions: string[]): string[] => {
    return extensions.filter(ext => defaultAllowedExtensions.includes(ext));
};

/**
 * Checks if a path is excluded.
 *
 * @param params - The parameters for checking if a path is excluded.
 * @returns A boolean indicating whether the path is excluded.
 */
const isExcluded = ({ fullPath, excludeItems }: IsExcludedParams): boolean => {
    const excludedFiles = ['context.config.json', 'context.txt'];
    const isExcludedFile = excludedFiles.some(excluded => fullPath.endsWith(excluded));

    return isExcludedFile || excludeItems.some(excludePath => {
        const excludeFullPath = path.resolve(excludePath);
        return fullPath.startsWith(excludeFullPath);
    });
};

/**
 * Reads the contents of a file.
 *
 * @param params - The parameters for reading the file.
 * @returns A string containing the contents of the file.
 */
const readFile = ({ file, relativePath }: ReadFileParams): string => {
    try {
        return `// Path: ${relativePath}\n${fs.readFileSync(file, 'utf-8')}\n`;
    } catch (error) {
        return '';
    }
};

/**
 * Reads the contents of a directory and its subdirectories.
 *
 * @param params - The parameters for reading the directory.
 * @returns An object containing the content and paths.
 */
const readDirectory = ({ dir, rootDir, basePath, excludePaths, allowedExtensions }: ReadDirectoryParams): DirectoryReadResult => {
    let content = '';
    const paths: string[] = [];
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const displayPath = path.join(basePath, file);

        if (!isExcluded({ fullPath: filePath, excludeItems: excludePaths })) {
            if (fs.lstatSync(filePath).isDirectory()) {
                const result = readDirectory({
                    dir: filePath,
                    rootDir,
                    basePath: displayPath,
                    excludePaths,
                    allowedExtensions
                });
                content += result.content;
                paths.push(...result.paths);
            } else if (allowedExtensions.includes(path.extname(filePath))) {
                content += readFile({ file: filePath, relativePath: displayPath });
                paths.push(displayPath);
            }
        }
    });

    return { content, paths };
};

/**
 * Collects context from the specified files and directories.
 *
 * @param includeItems - An array of items to include in the context.
 * @param rootDir - The root directory of the project.
 * @param excludeItems - An array of items to exclude from the context.
 * @param allowedExtensions - An array of allowed file extensions.
 * @returns An object containing the collected content and paths.
 */
export const collectContext = (
    includeItems: IncludeItem[],
    rootDir: string,
    excludeItems: string[],
    allowedExtensions: string[] = defaultAllowedExtensions
): DirectoryReadResult => {
    const validExtensions = validateExtensions(allowedExtensions);
    const projectName = path.basename(rootDir);
    let content = '';
    const paths: string[] = [];

    includeItems.forEach((item) => {
        const fullPath = path.join(rootDir, item.path);
        if (fs.existsSync(fullPath) && !isExcluded({ fullPath, excludeItems })) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                const result = readDirectory({
                    dir: fullPath,
                    rootDir,
                    basePath: path.join(projectName, item.path),
                    excludePaths: excludeItems,
                    allowedExtensions: validExtensions
                });
                content += result.content;
                paths.push(...result.paths);
            } else if (validExtensions.includes(path.extname(fullPath))) {
                content += readFile({ file: fullPath, relativePath: path.join(projectName, item.path) });
                paths.push(path.join(projectName, item.path));
            }
        }
    });

    return { content, paths };
};
