import * as fs from 'fs';
import * as path from 'path';
import { IncludeItem, ReadDirectoryParams, ReadFileParams, IsExcludedParams } from './types';

/**
 * Collects context from the specified files and directories.
 *
 * @param includeItems - An array of items to include in the context.
 * @param rootDir - The root directory of the project.
 * @param excludeItems - An array of items to exclude from the context.
 * @returns A string containing the collected context.
 */
export const collectContext = (includeItems: IncludeItem[], rootDir: string, excludeItems: string[]): string => {
    const projectName = path.basename(rootDir);
    let context = '';

    includeItems.forEach((item) => {
        const fullPath = path.join(rootDir, item.path);
        if (fs.existsSync(fullPath) && !isExcluded({ fullPath, excludeItems })) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                context += readDirectory({ dir: fullPath, rootDir, basePath: path.join(projectName, item.path), excludePaths: excludeItems });
            } else {
                context += readFile({ file: fullPath, relativePath: path.join(projectName, item.path) });
            }
        }
    });

    return context;
};

/**
 * Checks if a path is excluded.
 *
 * @param params - The parameters for checking if a path is excluded.
 * @returns A boolean indicating whether the path is excluded.
 */
const isExcluded = ({ fullPath, excludeItems }: IsExcludedParams): boolean => {
    return excludeItems.some(excludePath => {
        const excludeFullPath = path.resolve(excludePath);
        return fullPath.startsWith(excludeFullPath);
    });
};

/**
 * Reads the contents of a directory and its subdirectories.
 *
 * @param params - The parameters for reading the directory.
 * @returns A string containing the contents of the directory.
 */
const readDirectory = ({ dir, rootDir, basePath, excludePaths }: ReadDirectoryParams): string => {
    let content = '';
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const displayPath = path.join(basePath, file);

        if (!isExcluded({ fullPath: filePath, excludeItems: excludePaths })) {
            if (fs.lstatSync(filePath).isDirectory()) {
                content += readDirectory({ dir: filePath, rootDir, basePath: displayPath, excludePaths });
            } else {
                content += readFile({ file: filePath, relativePath: displayPath });
            }
        }
    });

    return content;
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
    } catch (error: any) {
        return '';
    }
};
