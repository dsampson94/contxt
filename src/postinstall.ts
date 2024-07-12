#!/usr/bin/env ts-node

import { exec } from 'child_process';

// Function to execute the 'npx contxt' command after a delay
const runCommandWithDelay = (delay: number) => {
    setTimeout(() => {
        exec('npx contxt', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${stderr}`);
                process.exit(1);
            }
            console.log(stdout);
        });
    }, delay);
};

// Execute the command with a delay of 5 seconds (5000 milliseconds)
runCommandWithDelay(5000);
