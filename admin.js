// Admin credentials
const ADMIN_USERNAME = "sameeramlk";
const ADMIN_PASSWORD = "19931996";

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            adminLogin();
        });
    }
    
    // ප්‍රතිඵල පූරණය කරන්න
    loadResults();
});

// Admin login function
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const messageElement = document.getElementById('admin-message');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        messageElement.textContent = '✅ ඇතුල් වීම සාර්ථකයි!';
        messageElement.style.color = 'green';
        
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        
        // ප්‍රතිඵල පූරණය කරන්න
        loadResults();
    } else {
        messageElement.textContent = '❌ වලංගු නොවන පරිශීලක නාමය හෝ රහස් පදය!';
        messageElement.style.color = 'red';
    }
}

// ප්‍රතිඵල පූරණය කිරීම
function loadResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const resultsBody = document.getElementById('results-body');
    
    resultsBody.innerHTML = '';
    
    if (results.length === 0) {
        resultsBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">ප්‍රතිඵල නොමැත</td></tr>';
        return;
    }
    
    // ප්‍රතිඵල ලැයිස්තුව පෙන්වන්න
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

// සියලු ප්‍රතිඵල මකාදැමීම
function clearAllResults() {
    if (confirm('ඔබට සියලු ප්‍රතිඵල මැකීමට අවශ්‍යද? මෙය ආපසු හැරවිය නොහැක!')) {
        localStorage.removeItem('quizResults');
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

// ප්‍රතිඵල නැරඹීමේ function
function viewResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    if (results.length === 0) {
        alert('ප්‍රතිඵල නොමැත!');
        return;
    }
    
    // ප්‍රතිඵල පිටුව සෑදීම
    createResultsPage(results);
}

// ප්‍රතිඵල පිටුව සෑදීම
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
            
            <div id="filter-section" class="filter-section hidden">
                <div class="filter-group">
                    <label for="filterSchool">පාසල:</label>
                    <select id="filterSchool">
                        <option value="">සියලුම පාසල්</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="filterGrade">ශ්‍රේණිය:</label>
                    <select id="filterGrade">
                        <option value="">සියලුම ශ්‍රේණි</option>
                        <option value="10">10 ශ්‍රේණිය</option>
                        <option value="11">11 ශ්‍රේණිය</option>
                    </select>
                </div>
                <button onclick="applyFilters()" class="btn-apply">පෙරහන් යොදන්න</button>
            </div>
            
            <div class="results-summary">
                <div class="summary-card">
                    <h3>මුළු සිසුන්</h3>
                    <span id="totalStudents">0</span>
                </div>
                <div class="summary-card">
                    <h3>සාමාන්‍ය ලකුණු</h3>
                    <span id="averageScore">0%</span>
                </div>
                <div class="summary-card">
                    <h3>වැඩිම ලකුණු</h3>
                    <span id="highestScore">0</span>
                </div>
                <div class="summary-card">
                    <h3>අඩුම ලකුණු</h3>
                    <span id="lowestScore">0</span>
                </div>
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
                            <th>ක්‍රියා</th>
                        </tr>
                    </thead>
                    <tbody id="results-table-body">
                        <!-- ප්‍රතිඵල ලැයිස්තුව මෙහි පෙන්වනු ඇත -->
                    </tbody>
                </table>
            </div>
            
            <div class="school-wise-results">
                <h3>පාසල් අනුව ප්‍රතිඵල</h3>
                <div id="school-results" class="school-cards">
                    <!-- පාසල් අනුව ප්‍රතිඵල මෙහි පෙන්වනු ඇත -->
                </div>
            </div>
            
            <div class="grade-wise-results">
                <h3>ශ්‍රේණි අනුව ප්‍රතිඵල</h3>
                <div id="grade-results" class="grade-cards">
                    <!-- ශ්‍රේණි අනුව ප්‍රතිඵල මෙහි පෙන්වනු ඇත -->
                </div>
            </div>
        </div>
    `;
    
    // ප්‍රතිඵල පිටුව එකතු කරන්න
    document.body.insertAdjacentHTML('beforeend', resultsHTML);
    
    // ප්‍රතිඵල පෙන්වන්න
    displayResults(results);
    updateSummary(results);
    updateSchoolFilters(results);
    displaySchoolWiseResults(results);
    displayGradeWiseResults(results);
}

// ප්‍රතිඵල පෙන්වීම
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
                <td>
                    <span class="percentage ${percentage >= 75 ? 'excellent' : percentage >= 50 ? 'good' : 'poor'}">
                        ${percentage}%
                    </span>
                </td>
                <td>${result.timeTaken || '00:00'}</td>
                <td>${result.date || 'නොමැත'}</td>
                <td>
                    <button onclick="deleteResult(${index})" class="btn-delete">මකන්න</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// සාරාංශය යාවත්කාලීන කිරීම
function updateSummary(results) {
    document.getElementById('totalStudents').textContent = results.length;
    
    if (results.length > 0) {
        const totalQuestions = results[0].totalQuestions || 20;
        const totalScore = results.reduce((sum, result) => sum + result.score, 0);
        const averageScore = Math.round((totalScore / (results.length * totalQuestions)) * 100);
        const highestScore = Math.max(...results.map(result => result.score));
        const lowestScore = Math.min(...results.map(result => result.score));
        
        document.getElementById('averageScore').textContent = averageScore + '%';
        document.getElementById('highestScore').textContent = highestScore + '/' + totalQuestions;
        document.getElementById('lowestScore').textContent = lowestScore + '/' + totalQuestions;
    }
}

// පාසල් පෙරහන් යාවත්කාලීන කිරීම
function updateSchoolFilters(results) {
    const schoolSelect = document.getElementById('filterSchool');
    const schools = [...new Set(results.map(result => result.schoolName).filter(school => school))];
    
    schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school;
        option.textContent = school;
        schoolSelect.appendChild(option);
    });
}

// පාසල් අනුව ප්‍රතිඵල පෙන්වීම
function displaySchoolWiseResults(results) {
    const schoolResults = document.getElementById('school-results');
    schoolResults.innerHTML = '';
    
    const schoolGroups = results.reduce((groups, result) => {
        const school = result.schoolName || 'නොමැත';
        if (!groups[school]) {
            groups[school] = [];
        }
        groups[school].push(result);
        return groups;
    }, {});
    
    Object.entries(schoolGroups).forEach(([school, schoolResultsArray]) => {
        const totalStudents = schoolResultsArray.length;
        const totalQuestions = schoolResultsArray[0].totalQuestions || 20;
        const totalScore = schoolResultsArray.reduce((sum, result) => sum + result.score, 0);
        const averageScore = Math.round((totalScore / (totalStudents * totalQuestions)) * 100);
        
        const schoolCard = `
            <div class="school-card">
                <h4>${school}</h4>
                <p>සිසුන්: ${totalStudents}</p>
                <p>සාමාන්‍ය ලකුණු: ${averageScore}%</p>
                <p>මුළු ලකුණු: ${totalScore}</p>
            </div>
        `;
        schoolResults.innerHTML += schoolCard;
    });
}

// ශ්‍රේණි අනුව ප්‍රතිඵල පෙන්වීම
function displayGradeWiseResults(results) {
    const gradeResults = document.getElementById('grade-results');
    gradeResults.innerHTML = '';
    
    const gradeGroups = results.reduce((groups, result) => {
        const grade = result.studentGrade || 'නොමැත';
        if (!groups[grade]) {
            groups[grade] = [];
        }
        groups[grade].push(result);
        return groups;
    }, {});
    
    Object.entries(gradeGroups).forEach(([grade, gradeResultsArray]) => {
        const totalStudents = gradeResultsArray.length;
        const totalQuestions = gradeResultsArray[0].totalQuestions || 20;
        const totalScore = gradeResultsArray.reduce((sum, result) => sum + result.score, 0);
        const averageScore = Math.round((totalScore / (totalStudents * totalQuestions)) * 100);
        
        const gradeCard = `
            <div class="grade-card">
                <h4>${grade} ශ්‍රේණිය</h4>
                <p>සිසුන්: ${totalStudents}</p>
                <p>සාමාන්‍ය ලකුණු: ${averageScore}%</p>
                <p>මුළු ලකුණු: ${totalScore}</p>
            </div>
        `;
        gradeResults.innerHTML += gradeCard;
    });
}

// පෙරහන් යෙදීම
function filterResults() {
    const filterSection = document.getElementById('filter-section');
    filterSection.classList.toggle('hidden');
}

function applyFilters() {
    const filterSchool = document.getElementById('filterSchool').value;
    const filterGrade = document.getElementById('filterGrade').value;
    
    const allResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    let filteredResults = allResults;
    
    if (filterSchool) {
        filteredResults = filteredResults.filter(result => result.schoolName === filterSchool);
    }
    
    if (filterGrade) {
        filteredResults = filteredResults.filter(result => result.studentGrade === filterGrade);
    }
    
    displayResults(filteredResults);
    updateSummary(filteredResults);
    displaySchoolWiseResults(filteredResults);
    displayGradeWiseResults(filteredResults);
}

// ප්‍රතිඵලය මකන්න
function deleteResult(index) {
    if (confirm('ඔබට මෙම ප්‍රතිඵලය මැකීමට අවශ්‍යද?')) {
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        results.splice(index, 1);
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        // ප්‍රතිඵල පිටුව යාවත්කාලීන කරන්න
        displayResults(results);
        updateSummary(results);
        displaySchoolWiseResults(results);
        displayGradeWiseResults(results);
    }
}

// PDF බාගැනීම
function downloadResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // CSV header
    csvContent += "සිසුවාගේ නම,පාසල,ශ්‍රේණිය,ලකුණු,ප්‍රතිශතය,කාලය,දිනය\n";
    
    // CSV data
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
    
    // Download CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "math_quiz_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ආපසු යාම
function goBackToAdmin() {
    document.querySelector('.results-container').remove();
    document.querySelector('.admin-container').style.display = 'block';
    loadResults();
}