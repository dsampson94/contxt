# Contxt

Contxt is a tool that collects code from specified files and directories in a project and adds them to a file called context.txt. This makes context sharing with GPTs much easier and saves the user many clicks!

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

## License

This project is licensed under the MIT License.
