import { validateIIN } from './app.deno.js';

// Function to generate a random IIN
function generateRandomIIN() {
    const year = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const century = Math.floor(Math.random() * 6);
    const gender = Math.floor(Math.random() * 6) + 1;
    const serial = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const checkDigit = Math.floor(Math.random() * 10);
    
    return `${year}${month}${day}${century}${gender}${serial}${checkDigit}`;
}

// Function to run performance test
function runPerformanceTest() {
    const iterations = 20_000_000;
    console.log(`Starting validation of ${iterations.toLocaleString()} IINs...`);
    
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        const iin = generateRandomIIN();
        validateIIN(iin);
    }
    
    const endTime = performance.now();
    const totalTime = (endTime - startTime) / 1000;
    
    console.log(`\nTotal time for ${iterations.toLocaleString()} validations: ${totalTime.toFixed(3)} seconds`);
}

// Run the test
runPerformanceTest();
