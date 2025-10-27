// Admin credentials
const ADMIN_USERNAME = "sameeramlk";
const ADMIN_PASSWORD = "19931996";

// Combined results from all devices
let allCombinedResults = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            adminLogin();
        });
    }
});

// Admin login function
function adminLogin() {
    console.log('Login attempted');
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const messageElement = document.getElementById('admin-message');

    console.log('Username:', username, 'Password:', password);

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        console.log('Login successful');
        messageElement.textContent = '✅ ඇතුල් වීම සාර්ථකයි!';
        messageElement.style.color = 'green';
        
        // Hide login screen, show dashboard
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        
        // Load results
        loadResults();
    } else {
        console.log('Login failed');
        messageElement.textContent = '❌ වලංගු නොවන පරිශීලක නාමය හෝ රහස් පදය!';
        messageElement.style.color = 'red';
    }
}

// Load results function
function loadResults() {
    console.log('Loading results...');
    
    const resultsBody = document.getElementById('results-body');
    if (!resultsBody) return;
    
    resultsBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">ප්‍රතිඵල ලබාගනිමින්...</td></tr>';
    
    try {
        // Load from localStorage (මෙම device එකේ ප්‍රතිඵල)
        const localResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        
        // Combine with imported results
        const allResults = [...allCombinedResults, ...localResults];
        
        // Remove duplicates
        const uniqueResults = removeDuplicates(allResults);
        
        displayResultsInTable(uniqueResults, resultsBody);
        
    } catch (error) {
        console.error('Error loading results:', error);
        resultsBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">දත්ත ලබාගැනීමේ දෝෂයකි</td></tr>';
    }
}

function removeDuplicates(results) {
    const unique = [];
    const seen = new Set();
    
    results.forEach(result => {
        const key = `${result.studentName}-${result.schoolName}-${result.date}-${result.score}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(result);
        }
    });
    
    return unique;
}

// Import results from CSV files (සියලු devices වල ප්‍රතිඵල එකතු කිරීමට)
function importResults() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.multiple = true;
    
    input.onchange = function(event) {
        const files = event.target.files;
        let importedCount = 0;
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    const results = parseCSV(content);
                    allCombinedResults = [...allCombinedResults, ...results];
                    importedCount += results.length;
                    
                    if (importedCount > 0) {
                        alert(`✅ ප්‍රතිඵල ${importedCount}ක් ආයාත කෙරිණි!`);
                        loadResults(); // ප්‍රතිඵල යාවත්කාලීන කරන්න
                    }
                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    alert('❌ දත්ත ආයාත කිරීමට අසමත් විය!');
                }
            };
            reader.readAsText(file);
        });
    };
    
    input.click();
}

function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        if (values.length >= 6) {
            const [studentName, schoolName, studentGrade, scoreStr, timeTaken, date] = values;
            
            const score = parseInt(scoreStr.split('/')[0]) || 0;
            
            results.push({
                studentName: studentName || 'නොමැත',
                schoolName: schoolName || 'නොමැත',
                studentGrade: studentGrade || 'නොමැත',
                score: score,
                totalQuestions: 20,
                timeTaken: timeTaken || '00:00',
                date: date || 'නොමැත'
            });
        }
    }
    
    return results;
}

// Export current results (optional)
function exportAllResults() {
    const localResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const allResults = [...allCombinedResults, ...localResults];
    const uniqueResults = removeDuplicates(allResults);
    
    if (uniqueResults.length === 0) {
        alert('බාගත කිරීමට ප්‍රතිඵල නොමැත!');
        return;
    }
    
    let csvContent = "සිසුවාගේ නම,පාසල,ශ්‍රේණිය,ලකුණු,කාලය,දිනය\n";
    
    uniqueResults.forEach((result) => {
        const row = [
            result.studentName || 'නොමැත',
            result.schoolName || 'නොමැත',
            result.studentGrade || 'නොමැත',
            `${result.score}/${result.totalQuestions}`,
            result.timeTaken || '00:00',
            result.date || 'නොමැත'
        ].join(',');
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `math_quiz_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`ප්‍රතිඵල ${uniqueResults.length}ක් බාගත කෙරිණි!`);
}

// සියලු ප්‍රතිඵල මකාදැමීම
function clearAllResults() {
    if (confirm('ඔබට සියලු ප්‍රතිඵල මැකීමට අවශ්‍යද? මෙය ආපසු හැරවිය නොහැක!')) {
        // Clear localStorage
        localStorage.removeItem('quizResults');
        // Clear imported results
        allCombinedResults = [];
        
        loadResults();
        alert('සියලු ප්‍රතිඵල මකා දමන ලදී!');
    }
}

// පිටවීම
function logout() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('adminPassword').value = '';
    document.getElementById('admin-message').textContent = '';
}

// Display results in table
function displayResultsInTable(results, resultsBody) {
    resultsBody.innerHTML = '';
    
    if (results.length === 0) {
        resultsBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">ප්‍රතිඵල නොමැත</td></tr>';
        return;
    }
    
    // Display results
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.studentName || 'නොමැත'}</td>
            <td>${result.schoolName || 'නොමැත'}</td>
            <td>${result.studentGrade || 'නොමැත'}</td>
            <td>${result.score}/${result.totalQuestions || 20}</td>
            <td>${result.timeTaken || '00:00'}</td>
            <td>${result.date || 'නොමැත'}</td>
        `;
        resultsBody.appendChild(row);
    });
}

// Results page functions (existing)
function viewResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    if (results.length === 0) {
        alert('ප්‍රතිඵල නොමැත!');
        return;
    }
    
    createResultsPage(results);
}

function createResultsPage(results) {
    // පැවති admin page එක hide කරන්න
    document.querySelector('.admin-container').style.display = 'none';
    
    // ප්‍රතිඵල පිටුව සෑදන්න
    const resultsHTML = `
        <div class="results-container">
            <div class="results-header">
                <h2>ගණිත ප්‍රශ්නෝත්තරය - ප්‍රතිඵල වාර්තාව</h2>
                <button onclick="goBackToAdmin()" class="btn-back">ආපසු</button>
                <button onclick="downloadResults()" class="btn-download">PDF බාගන්න</button>
                <button onclick="filterResults()" class="btn-filter">පෙරහන්</button>
            </div>
            
            <div class="results-table-container">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>අනුක්‍රමණය</th>
                            <th>සිසුවාගේ නම</th>
                            <th>පාසල</th>
                            <th>ශ්‍රේණිය</th>
                            <th>ලකුණු</th>
                            <th>ප්‍රතිශතය</th>
                            <th>කාලය</th>
                            <th>දිනය</th>
                        </tr>
                    </thead>
                    <tbody id="results-table-body">
                        <!-- ප්‍රතිඵල ලැයිස්තුව මෙහි පෙන්වනු ඇත -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // ප්‍රතිඵල පිටුව එකතු කරන්න
    document.body.insertAdjacentHTML('beforeend', resultsHTML);
    
    // ප්‍රතිඵල පෙන්වන්න
    displayResults(results);
}

function displayResults(results) {
    const tbody = document.getElementById('results-table-body');
    tbody.innerHTML = '';
    
    results.forEach((result, index) => {
        const totalQuestions = result.totalQuestions || 20;
        const percentage = Math.round((result.score / totalQuestions) * 100);
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${result.studentName || 'නොමැත'}</td>
                <td>${result.schoolName || 'නොමැත'}</td>
                <td>${result.studentGrade || 'නොමැත'}</td>
                <td>${result.score}/${totalQuestions}</td>
                <td>${percentage}%</td>
                <td>${result.timeTaken || '00:00'}</td>
                <td>${result.date || 'නොමැත'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function goBackToAdmin() {
    document.querySelector('.results-container').remove();
    document.querySelector('.admin-container').style.display = 'block';
}

function downloadResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "සිසුවාගේ නම,පාසල,ශ්‍රේණිය,ලකුණු,ප්‍රතිශතය,කාලය,දිනය\n";
    
    results.forEach(result => {
        const totalQuestions = result.totalQuestions || 20;
        const percentage = Math.round((result.score / totalQuestions) * 100);
        const row = [
            result.studentName || 'නොමැත',
            result.schoolName || 'නොමැත',
            result.studentGrade || 'නොමැත',
            `${result.score}/${totalQuestions}`,
            `${percentage}%`,
            result.timeTaken || '00:00',
            result.date || 'නොමැත'
        ].join(',');
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "math_quiz_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function filterResults() {
    // Simple filter implementation
    alert('පෙරහන් කාර්යය ඉදිරියේදී...');
}
