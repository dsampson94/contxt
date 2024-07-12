# Contxt

[![npm version](https://img.shields.io/npm/v/contxt.svg)](https://www.npmjs.com/package/contxt)
[![License](https://img.shields.io/npm/l/contxt.svg)](https://github.com/dsampson94/contxt/blob/main/LICENSE)

Contxt is a tool that collects code from specific files and directories within the project and automatically adds them to a file called context.txt. This makes context sharing with GPTs much easier, allows users to receives more comprehensive completions, build their projects faster and save hundreds of clicks!

## Features

- Collects code from specified files and directories and adds to context.txt
- Excludes non-code files and directories based on user configuration.
- Allows excluding specific files and directories
- Automatically updates context when watched files change.
- Supports various file types: `.js`, `.ts`, `.tsx`, `.jsx`, `.json`, `.md`, `.html`, `.css`.
- Adds configuration and output files to `.gitignore` automatically

## Installation

You can install Contxt via npm:

    npm install contxt

## Usage

Create a context.config.json file in the root of your project to specify the files and directories to include or exclude:

    {
      "include": [
          "package.json",
          "tsconfig.json",
          "tailwind.config.json",
          "src",
          "lib",
          "api",
          "README.md"
      ],
      "exclude": [],
      "allowedExtensions": [".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".html", ".css"]
  }

Run Contxt:

    npx contxt

Configuration

    include: An array of files and directories to include in the context.
    exclude: An array of files and directories to exclude from the context.
    allowedExtensions: An array of file extensions that are allowed to be included in the context.

## Building the Project

    npm run build

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or features.

    Fork the repository.
    Create a new branch (git checkout -b feature-branch).
    Make your changes.
    Commit your changes (git commit -am 'Add new feature').
    Push to the branch (git push origin feature-branch).
    Open a pull request.
