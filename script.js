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
        
        // --- NEW LINE: Trigger the 3D Graph ---
        drawGraph(funcStr, xStart, xEnd, yStart, yEnd);
        
    } catch (error) {
        document.getElementById('resultOutput').innerText = "Error: Invalid function syntax.";
        document.getElementById('plot-container').style.display = 'none'; // Hide graph on error
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
// Function to update the math rendering in real-time
function updateEquation() {
    // 1. Grab current values (or use defaults if empty)
    let funcStr = document.getElementById('functionInput').value || 'f(x,y)';
    let xStart = document.getElementById('xStart').value || 'a';
    let xEnd = document.getElementById('xEnd').value || 'b';
    let yStart = document.getElementById('yStart').value || 'c';
    let yEnd = document.getElementById('yEnd').value || 'd';

    // 2. Format it into a LaTeX string
    // Note: We use double slashes (\\) to escape backslashes in JavaScript strings
    let latexString = `\\int_{${yStart}}^{${yEnd}} \\int_{${xStart}}^{${xEnd}} (${funcStr}) \\,dx\\,dy`;

    // 3. Tell KaTeX to render it
    const displayElement = document.getElementById('equation-display');
    try {
        katex.render(latexString, displayElement, {
            throwOnError: false, // Prevents crashing if the user types a partial LaTeX command
            displayMode: true // Makes it big and centered
        });
    } catch (e) {
        console.log("KaTeX rendering error", e);
    }
}

// 4. Run it once when the page loads to show the default f(x,y) setup
window.onload = updateEquation;
// Function to generate the 3D Surface Plot
function drawGraph(funcString, xStart, xEnd, yStart, yEnd) {
    const node = math.parse(funcString);
    const code = node.compile();

    // We create a grid of points to plot
    let xValues = [];
    let yValues = [];
    let zValues = [];

    // Create 30 steps for the graph resolution
    const steps = 30; 
    let dx = (xEnd - xStart) / steps;
    let dy = (yEnd - yStart) / steps;

    // Generate X and Y axes arrays
    for (let i = 0; i <= steps; i++) {
        xValues.push(xStart + i * dx);
        yValues.push(yStart + i * dy);
    }

    // Generate Z values for the 2D grid
    for (let j = 0; j <= steps; j++) {
        let zRow = [];
        for (let i = 0; i <= steps; i++) {
            try {
                let z = code.evaluate({ x: xValues[i], y: yValues[j] });
                // Handle infinity or imaginary results gracefully
                if (!isFinite(z)) z = 0; 
                zRow.push(z);
            } catch (e) {
                zRow.push(0);
            }
        }
        zValues.push(zRow);
    }

    // Plotly configuration
    const data = [{
        z: zValues,
        x: xValues,
        y: yValues,
        type: 'surface',
        colorscale: 'Viridis'
    }];

    const layout = {
        title: 'Surface Plot of f(x,y)',
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 40 }
    };

    // Make the container visible and draw the plot
    const plotContainer = document.getElementById('plot-container');
    plotContainer.style.display = 'block';
    Plotly.newPlot('plot-container', data, layout);
}


