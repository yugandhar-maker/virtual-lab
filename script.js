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
