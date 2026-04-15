export function detectLanguage(code: string): 'c' | 'python' | 'javascript' {
    const trimmedCode = code.trim();

    const cPatterns = [
        /^#include\s*[<"]/m,
        /\bint\s+main\s*\(/,
        /\bprintf\s*\(/,
        /\bscanf\s*\(/,
        /\bmalloc\s*\(/,
        /\bfree\s*\(/,
        /\bstruct\s+\w+/,
        /\btypedef\s+/,
        /\bchar\s*\*/,
        /\bvoid\s+\w+\s*\(/,
    ];

    const pythonPatterns = [
        /^def\s+\w+\s*\(/m,
        /^class\s+\w+.*:/m,
        /^import\s+\w+/m,
        /^from\s+\w+\s+import/m,
        /\bprint\s*\(/,
        /\bself\./,
        /\belif\b/,
        /\bTrue\b|\bFalse\b|\bNone\b/,
        /^\s+def\s/m,
    ];

    const jsPatterns = [
        /\bconst\s+\w+\s*=/,
        /\blet\s+\w+\s*=/,
        /\bvar\s+\w+\s*=/,
        /\bfunction\s+\w+\s*\(/,
        /=>\s*[{(]/,
        /\bconsole\.(log|error|warn)\s*\(/,
        /\bdocument\./,
        /\bwindow\./,
        /\brequire\s*\(/,
        /\bmodule\.exports/,
    ];

    let cScore = 0;
    let pythonScore = 0;
    let jsScore = 0;

    for (const pattern of cPatterns) {
        if (pattern.test(trimmedCode)) cScore++;
    }

    for (const pattern of pythonPatterns) {
        if (pattern.test(trimmedCode)) pythonScore++;
    }

    for (const pattern of jsPatterns) {
        if (pattern.test(trimmedCode)) jsScore++;
    }

    if (cScore > pythonScore && cScore > jsScore) return 'c';
    if (pythonScore > cScore && pythonScore > jsScore) return 'python';
    return 'javascript';
}