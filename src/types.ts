/**
 * Interface representing an item to include in the context.
 */
export interface IncludeItem {
    path: string;
}

/**
 * Interface representing the parameters for reading a directory.
 */
export interface ReadDirectoryParams {
    dir: string;
    rootDir: string;
    basePath: string;
    excludePaths: string[];
    allowedExtensions: string[];
}

/**
 * Interface representing the parameters for reading a file.
 */
export interface ReadFileParams {
    file: string;
    relativePath: string;
}

/**
 * Interface representing the parameters for checking if a path is excluded.
 */
export interface IsExcludedParams {
    fullPath: string;
    excludeItems: string[];
}

/**
 * Interface representing the parameters for adding entries to the .gitignore file.
 */
export interface AddToGitignoreParams {
    gitignorePath: string;
    entries: string[];
}

/**
 * Interface representing the configuration for the context collection.
 */
export interface Config {
    include: string[];
    exclude: string[];
    allowedExtensions: string[];
}

/**
 * Interface representing the result of reading a directory.
 */
export interface DirectoryReadResult {
    content: string;
    paths: string[];
}
