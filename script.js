// Function triggered by the HTML button
function solveIntegral() {
    // 1. Grab values from the HTML inputs
    const funcStr = document.getElementById('functionInput').value;
    const xStart = parseFloat(document.getElementById('xStart').value);
    const xEnd = parseFloat(document.getElementById('xEnd').value);
    const yStart = parseFloat(document.getElementById('yStart').value);
    const yEnd = parseFloat(document.getElementById('yEnd').value);

    // 2. Validate inputs (make sure they aren't empty)
    if (!funcStr || isNaN(xStart) || isNaN(xEnd) || isNaN(yStart) || isNaN(yEnd)) {
        document.getElementById('resultOutput').innerText = "Error: Please fill all fields.";
        return;
    }

    // 3. Calculate the integral
    try {
        const result = calculateDoubleIntegral(funcStr, xStart, xEnd, yStart, yEnd);
        // Round to 4 decimal places for clean display
        document.getElementById('resultOutput').innerText = result.toFixed(4);
    } catch (error) {
        document.getElementById('resultOutput').innerText = "Error: Invalid function syntax.";
    }
}

// The Riemann Sum logic from earlier
function calculateDoubleIntegral(funcString, xStart, xEnd, yStart, yEnd, steps = 100) {
    const node = math.parse(funcString);
    const code = node.compile();
    
    let dx = (xEnd - xStart) / steps;
    let dy = (yEnd - yStart) / steps;
    let volume = 0;

    for (let i = 0; i < steps; i++) {
        for (let j = 0; j < steps; j++) {
            let midX = xStart + (i + 0.5) * dx;
            let midY = yStart + (j + 0.5) * dy;
            
            let height = code.evaluate({ x: midX, y: midY });
            volume += height * dx * dy;
        }
    }
    return volume;
}
