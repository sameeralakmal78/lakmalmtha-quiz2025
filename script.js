// Admin කෝඩ් එක
const ADMIN_CODE = "math2024";

let currentStudentName = '';
let currentSchoolName = '';
let currentStudentGrade = '';

function startQuiz() {
    const studentName = document.getElementById('studentName').value.trim();
    const schoolName = document.getElementById('schoolName').value.trim();
    const studentGrade = document.getElementById('studentGrade').value;
    const accessCode = document.getElementById('accessCode').value.trim();
    
    if (!studentName) {
        showCodeMessage('කරුණාකර ඔබගේ නම ඇතුලත් කරන්න', 'error');
        return;
    }
    
    if (!schoolName) {
        showCodeMessage('කරුණාකර ඔබගේ පාසලේ නම ඇතුලත් කරන්න', 'error');
        return;
    }
    
    if (!studentGrade) {
        showCodeMessage('කරුණාකර ඔබගේ ශ්‍රේණිය තෝරන්න', 'error');
        return;
    }
    
    if (!accessCode) {
        showCodeMessage('කරුණාකර Admin කෝඩ් එක ඇතුලත් කරන්න', 'error');
        return;
    }
    
    if (accessCode !== ADMIN_CODE) {
        showCodeMessage('❌ වලංගු නොවන Admin කෝඩ් එකක්!', 'error');
        return;
    }
    
    // කෝඩ් සාවර්ය නම්
    currentStudentName = studentName;
    currentSchoolName = schoolName;
    currentStudentGrade = studentGrade;
    
    document.getElementById('name-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    
    // Update student info display with all details
    document.getElementById('student-info').innerHTML = `
        <p>සිසුවා: ${studentName}</p>
        <p>පාසල: ${schoolName}</p>
        <p>ශ්‍රේණිය: ${studentGrade}</p>
    `;
    
    showCodeMessage('', 'success');
    
    // ප්‍රශ්නෝත්තරය ආරම්භ කිරීම
    startQuizLogic();
}

function showCodeMessage(message, type) {
    const messageElement = document.getElementById('code-message');
    messageElement.textContent = message;
    messageElement.style.color = type === 'error' ? '#e53e3e' : '#38a169';
}

// ප්‍රශ්නෝත්තරයේ මුල් තර්කය
function startQuizLogic() {
    console.log('ප්‍රශ්නෝත්තරය ආරම්භ වේ...');
    
    // විචල්යයන් ආරම්භක කිරීම
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    score = 0;
    quizStartTime = Date.now();
    questionStartTime = Date.now();
    
    console.log('ප්‍රශ්න ගණන:', questions.length);
    console.log('වත්මන් ප්‍රශ්නය:', currentQuestion);
    
    // ප්‍රශ්නය පෙන්වන්න
    showQuestion();
    
    // කාලය ආරම්භ කරන්න
    startTotalTimer();
    startQuestionTimer();
}

// ප්‍රශ්න ලැයිස්තුව (රුප සහිතව)
const questions = [
    {
        question: "√7  අගය සොයන්න",
        image: null,
        answers: ["2.5", "2.3", "2.6", "2.7"],
        correct: 2
    },
    {
        question: "x² – 5x + 6  හී සාදක සොයන්න",
        image: null,
        answers: ["(x−2)(x−3)", "(x+2)(x+3)", "(x−1)(x−6)", "(x+1)(x−6)"],
        correct: 0
    },
    {
        question: "x හි අගය සොයන්න: 2x + 3 = 7",
        image: null,
        answers: ["1", "2", "3", "4"],
        correct: 1
    },
    {
        question: "සරල කරන්න: (x² + 2x + 1)",
        image: null,
        answers: ["(x+1)²", "(x-1)²", "x(x+2)", "x²+1"],
        correct: 0
    },
    {
        question: "පහත රුපයේ දැක්වෙන ත්‍රිකෝණයේ ABC කෝණය සොයන්න",
        image: "images/Capture.PNG",
        answers: ["45°", "60°", "90°", "120°"],
        correct: 1
    },
    {
        question: "පහත රූපයේ චාප දිග සොයන්න",
        image: "images/Capture1.PNG",
        answers: ["14 cm", "11 cm", "22 cm", "7 cm"],
        correct: 1
    },
    {
        question: "3a² සහ 2ab හී කුඩාපොදු ගුණාකාරය සොයන්න",
        image: null,
        answers: ["6a²b", "3ab", "6ab²", "2ab"],
        correct: 0
    },
    {
        question: "1/x + 2/2x සුලු කරන්න",
        image: null,
        answers: ["3/2x", "2/2x", "2/x", "2x"],
        correct: 2
    },
    {
        question: "කමල් රු. 40000 ක මුදලක් 3% ක මාසික සුළු පොලියට ණයට ලබාදෙයි. මසකට පසු කමල්ට ලැබෙන පොලී මුදල කීය ද?",
        image: null,
        answers: ["රු. 1,200", "රු. 200", "රු. 2,200", "රු. 1,000"],
        correct: 0
    },
    {
        question: "රූපයේ දැක්වෙන ත්‍රිකෝණ දෙක  අංගසම වන  අවස්ථාව කුමක්ද?.",
        image: "images/Capture2.PNG",
        answers: ["කෝ.කෝ.පා", "කර්ණ.පා", "පා.පා.පා", "පා.කෝ.පා"],
        correct: 0
    },
    {
        question: "x − 1 < 2 අසමානතාව තෘප්ත කරන ධන නිඛිලමය අගය 2ක් ලියා දක්වන්න.",
        image: null,
        answers: ["3,2", "2,1", "-1,-2", "4,5"],
        correct: 1
    },
    {
        question: "කෙසෙල් ඇවරි 7ක ඇති ගෙඩි ගණන පහත පරිදි වේ.  12, 08, 15, 09, 11, 13, 10. මෙහි මධ්‍යස්ථය සොයන්න.",
        image: null,
        answers: ["12", "15", "11.14", "11"],
        correct: 3
    },
    {
        question: "x අගය  සොයන්න",
        image: "images/Capture3.PNG",
        answers: ["70°", "20°", "40°", "140°"],
        correct: 1
    },
    {
        question: "අදුරු කල කොටසේ වර්ගපලය 40 cm² නම්  ප්‍රිස්මයේ පරිමාව සොයන්න.",
        image: "images/Capture4.PNG",
        answers: ["200 cm²", "400 cm²", " 400 cm³", "4000 cm³ "],
        correct: 2
    },
    {
        question: "මිනිසුන් 9 දෙනෙකු දින 4 ක දී කරන වැඩ ප්‍රමාණයක් දින 6 ක දී නිම කිරීමට මිනිසුන් කී දෙනෙක් අවශ්‍ය ද?",
        image: null,
        answers: ["12", "6", "36", "24"],
        correct: 1
    },
    {
        question: "පහත රුපයේ  BAC කෝණයේ අගය සොයන්න. ",
        image: "images/Capture5.PNG",
        answers: ["70°", "30°", "80°", "110°"],
        correct: 2
    },
    {
        question: "4m උස බිත්තියක මුදුනේ එක් කෙළවරක් ද, අනෙක් කෙළවර බිත්තියේ පාමුල සිට 3m දුරින් ද පිහිටන ලෙස ඉනිමඟක් රූපයේ පරිදි හේත්තු කර ඇත. ඉනිමගේ දිග (a)සොයන්න.",
        image: "images/Capture6.PNG",
        answers: ["7m", "3m", "10m", "5m"],
        correct: 3
    },
    {
        question: "රූපයේ දී ඇති දත්ත අනුව AB සරල රේඛාවේ අනුක්‍රමණය සොයන්න.",
        image: "images/Capture7.PNG",
        answers: ["4", "2", "1", "(0,2)"],
        correct: 2
    },
    {
        question: "දී ඇති වට ප්‍රස්තාරයේ නිරුපණය කරන ක්‍රිකට් ක්‍රීඩකයින් ගණන 18ක් නම්, පාපන්දු ක්‍රීඩාවේ යෙදෙන ක්‍රීඩකයින් ගණන සොයන්න.",
        image: "images/Capture8.PNG",
        answers: ["20", "30", "10", "18"],
        correct: 0
    },
    {
        question: "රූපයේ දැක්වෙන තොරතුරු අනුව ABC හි අගය සොයන්න.",
        image: "images/Capture9.PNG",
        answers: ["60°", "30°", "90°", "45°"],
        correct: 2
    }
];

// විචල්යයන්
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let quizStartTime;
let totalTime = 60 * 60; // 60 minutes in seconds
let questionTime = 3 * 60; // 3 minutes per question in seconds
let questionStartTime;
let totalTimerInterval;
let questionTimerInterval;

// DOM අංග
const nameScreen = document.getElementById('name-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const questionNumber = document.getElementById('question-number');
const questionImage = document.getElementById('question-image');
const answerSection = document.getElementById('answer-section');
const nextBtn = document.getElementById('next-btn');
const totalTimerDisplay = document.getElementById('total-timer');
const questionTimerDisplay = document.getElementById('question-timer');
const progressDisplay = document.getElementById('progress');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const studentResult = document.getElementById('student-result');

// ප්‍රශ්නය පෙන්වීම
function showQuestion() {
    console.log('ප්‍රශ්නය පෙන්වමින්:', currentQuestion);
    
    if (currentQuestion >= questions.length) {
        console.log('සියලු ප්‍රශ්න අවසන්!');
        finishQuiz();
        return;
    }
    
    const question = questions[currentQuestion];
    
    questionNumber.textContent = `ප්‍රශ්නය ${currentQuestion + 1}/${questions.length}`;
    questionText.textContent = question.question;
    
    // රුපය පෙන්වීම හෝ සැකසීම
    displayQuestionImage(question.image);
    
    // ප්‍රගතිය යාවත්කාලීන කිරීම
    const progress = Math.round(((currentQuestion) / questions.length) * 100);
    progressDisplay.textContent = `ප්‍රගතිය: ${progress}%`;
    
    // පිළිතුරු විකල්ප සකස් කිරීම
    answerSection.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerOption = document.createElement('div');
        answerOption.className = 'answer-option';
        if (userAnswers[currentQuestion] === index) {
            answerOption.classList.add('selected');
        }
        answerOption.textContent = answer;
        answerOption.addEventListener('click', () => selectAnswer(index));
        answerSection.appendChild(answerOption);
    });
    
    // ඊළඟ බොත්තම සකස් කිරීම
    nextBtn.disabled = userAnswers[currentQuestion] === null;
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'අවසන් කරන්න';
    } else {
        nextBtn.textContent = 'මීළඟ ප්‍රශ්නය';
    }
    
    // ප්‍රශ්නයේ කාලය යළි ආරම්භ කිරීම
    resetQuestionTimer();
}

// රුපය පෙන්වීම
function displayQuestionImage(imagePath) {
    questionImage.innerHTML = '';
    
    if (imagePath) {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'ප්‍රශ්න රුපය';
        img.onload = function() {
            console.log('රුපය loaded:', imagePath);
        };
        img.onerror = function() {
            showImagePlaceholder();
        };
        questionImage.appendChild(img);
    } else {
        questionImage.innerHTML = '';
    }
}

// රුපය load නොවුනොත් පෙන්වන placeholder
function showImagePlaceholder() {
    questionImage.innerHTML = '<div class="image-placeholder">රුපය පෙන්විය නොහැක<br><small>රුපය බාගත කිරීමට අසමත් විය</small></div>';
}

// පිළිතුර තේරීම
function selectAnswer(index) {
    userAnswers[currentQuestion] = index;
    
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach((option, i) => {
        if (i === index) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    nextBtn.disabled = false;
}

// මුළු කාලය ගණනය කිරීම
function startTotalTimer() {
    clearInterval(totalTimerInterval);
    totalTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        const remaining = totalTime - elapsed;
        
        if (remaining <= 0) {
            clearInterval(totalTimerInterval);
            totalTimerDisplay.textContent = 'මුළු කාලය අවසන්!';
            finishQuiz();
        } else {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            totalTimerDisplay.textContent = `මුළු කාලය: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// ප්‍රශ්නයේ කාලය ගණනය කිරීම
function startQuestionTimer() {
    clearInterval(questionTimerInterval);
    questionTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
        const remaining = questionTime - elapsed;
        
        if (remaining <= 0) {
            autoNextQuestion();
        } else {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            questionTimerDisplay.textContent = `ප්‍රශ්නය: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            updateQuestionTimerStyle(remaining);
        }
    }, 1000);
}

// ප්‍රශ්නයේ කාලයේ වර්ණය යාවත්කාලීන කිරීම
function updateQuestionTimerStyle(remaining) {
    questionTimerDisplay.classList.remove('warning', 'critical');
    
    if (remaining <= 30) {
        questionTimerDisplay.classList.add('critical');
    } else if (remaining <= 60) {
        questionTimerDisplay.classList.add('warning');
    }
}

// ප්‍රශ්නයේ කාලය යළි ආරම්භ කිරීම
function resetQuestionTimer() {
    questionStartTime = Date.now();
    questionTimerDisplay.classList.remove('warning', 'critical');
    questionTimerDisplay.textContent = 'ප්‍රශ්නය: 03:00';
}

// ස්වයංක්‍රීයව ඊළඟ ප්‍රශ්නයට යාම
function autoNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

// ඊළඟ ප්‍රශ්නය
nextBtn.addEventListener('click', function() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishQuiz();
    }
});

// ප්‍රශ්නෝත්තරය අවසන් කිරීම
function finishQuiz() {
    console.log('ප්‍රශ්නෝත්තරය අවසන් කරමින්...');
    
    clearInterval(totalTimerInterval);
    clearInterval(questionTimerInterval);
    
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            score++;
        }
    });
    
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    // Update student result with all details
    studentResult.innerHTML = `
        <p>සිසුවා: ${currentStudentName}</p>
        <p>පාසල: ${currentSchoolName}</p>
        <p>ශ්‍රේණිය: ${currentStudentGrade}</p>
    `;
    
    scoreDisplay.textContent = score;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Contact information පෙන්වන්න
    showContactInfo();
    
    saveResults(currentStudentName, currentSchoolName, currentStudentGrade, score, questions.length, timeDisplay.textContent);
    
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
}

// Contact information පෙන්වීම
function showContactInfo() {
    const contactHTML = `
        <div class="contact-info-result">
            <h3>තවත් ප්‍රශ්නෝත්තර සඳහා</h3>
            <p><strong>දුරකථන අංකය:</strong> <a href="tel:0778482237" class="contact-link">077 848 2237</a></p>
            <p><strong>WhatsApp Group:</strong> 
                <a href="https://chat.whatsapp.com/FqsVqqwb00b627Xj4adrW2" target="_blank" class="whatsapp-link">
                    📱 අපගේ WhatsApp Group එකට සම්බන්ධ වන්න
                </a>
            </p>
        </div>
    `;
    
    // Contact information result container එකට එකතු කරන්න
    const resultContainer = document.querySelector('.result-container');
    const existingContact = resultContainer.querySelector('.contact-info-result');
    
    if (existingContact) {
        existingContact.remove();
    }
    
    resultContainer.insertAdjacentHTML('beforeend', contactHTML);
}

// ලකුණු save කිරීම (localStorage භාවිතා කරයි)
function saveResults(studentName, schoolName, studentGrade, score, totalQuestions, timeTaken) {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const newResult = {
        studentName: studentName,
        schoolName: schoolName,
        studentGrade: studentGrade,
        score: score,
        totalQuestions: totalQuestions,
        timeTaken: timeTaken,
        date: new Date().toLocaleString('si-LK')
    };
    results.push(newResult);
    localStorage.setItem('quizResults', JSON.stringify(results));
    console.log('Results saved for:', studentName, schoolName, studentGrade);
}

function restartQuiz() {
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('name-screen').classList.remove('hidden');
    currentStudentName = '';
    currentSchoolName = '';
    currentStudentGrade = '';
    document.getElementById('studentName').value = '';
    document.getElementById('schoolName').value = '';
    document.getElementById('studentGrade').value = '';
    document.getElementById('accessCode').value = '';
    document.getElementById('code-message').textContent = '';
}

// පිටුව load වන විට name screen එක පෙන්වන්න
document.addEventListener('DOMContentLoaded', function() {
    console.log('පිටුව loaded');
    document.getElementById('studentName').focus();
});

// Browser refresh වලින් ආරක්ෂා වීම
window.addEventListener('beforeunload', function (e) {
    if (quizScreen && !quizScreen.classList.contains('hidden')) {
        e.preventDefault();
        e.returnValue = 'ඔබ ප්‍රශ්නෝත්තරයෙන් පිටවෙමින් පවතී. ඔබගේ ප්‍රගතිය අහිමි වනු ඇත!';
    }

});
// ==================== ENHANCED STORAGE SOLUTION ====================

// localStorage support check
function isLocalStorageSupported() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error('localStorage not supported:', e);
        return false;
    }
}

// Temporary in-memory storage (page refresh වලදී අහිමි වේ)
let temporaryResults = [];

// Enhanced saveResults function - REPLACE the existing saveResults function
function saveResults(studentName, schoolName, studentGrade, score, totalQuestions, timeTaken) {
    const newResult = {
        studentName: studentName,
        schoolName: schoolName,
        studentGrade: studentGrade,
        score: score,
        totalQuestions: totalQuestions,
        timeTaken: timeTaken,
        date: new Date().toLocaleString('si-LK')
    };
    
    console.log('Saving results for:', studentName, schoolName, studentGrade);
    
    // Try localStorage first
    if (isLocalStorageSupported()) {
        try {
            const results = JSON.parse(localStorage.getItem('quizResults')) || [];
            results.push(newResult);
            localStorage.setItem('quizResults', JSON.stringify(results));
            console.log('Results saved to localStorage');
        } catch (error) {
            console.warn('localStorage failed, using temporary storage');
            temporaryResults.push(newResult);
        }
    } else {
        console.warn('localStorage not supported, using temporary storage');
        temporaryResults.push(newResult);
    }
    
    // Debug: Check what's stored
    console.log('Current temporaryResults:', temporaryResults);
}

// Enhanced loadResults function for admin page - ADD this to admin.js as well
function loadResults() {
    let results = [];
    
    console.log('Loading results...');
    
    // Try localStorage first
    if (isLocalStorageSupported()) {
        try {
            results = JSON.parse(localStorage.getItem('quizResults')) || [];
            console.log('Results loaded from localStorage:', results.length);
        } catch (error) {
            console.warn('localStorage load failed, using temporary storage');
            results = temporaryResults;
        }
    } else {
        console.warn('localStorage not supported, using temporary storage');
        results = temporaryResults;
    }
    
    const resultsBody = document.getElementById('results-body');
    if (!resultsBody) {
        console.error('results-body element not found');
        return;
    }
    
    resultsBody.innerHTML = '';
    
    if (results.length === 0) {
        resultsBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">ප්‍රතිඵල නොමැත</td></tr>';
        console.log('No results found');
        return;
    }
    
    console.log('Displaying results:', results);
    
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

// Debug function to check storage status
function checkStorageStatus() {
    console.log('=== STORAGE STATUS ===');
    console.log('localStorage supported:', isLocalStorageSupported());
    console.log('Temporary results count:', temporaryResults.length);
    
    if (isLocalStorageSupported()) {
        try {
            const stored = JSON.parse(localStorage.getItem('quizResults')) || [];
            console.log('localStorage results count:', stored.length);
            console.log('localStorage results:', stored);
        } catch (error) {
            console.error('Error reading localStorage:', error);
        }
    }
}

// Call this on page load to check status
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - checking storage...');
    checkStorageStatus();
});
