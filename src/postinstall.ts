#!/usr/bin/env ts-node

import { exec } from 'child_process';

// Execute the 'npx contxt' command
exec('npx contxt', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error: ${stderr}`);
        process.exit(1);
    }
    console.log(stdout);
});
