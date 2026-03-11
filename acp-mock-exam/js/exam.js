/**
 * 阿里云大模型ACP - 模拟考试逻辑
 * 总题数 75：单选题 50 题每题 1 分，多选题 25 题每题 2 分，总分 100，时长 120 分钟
 */
(function() {
  const questions = getExamQuestions();
  const TOTAL_MINUTES = 120;
  let answers = {}; // questionId -> "A" 或 ["A","C"]
  let currentIndex = 0;
  let timerInterval = null;
  let secondsRemaining = TOTAL_MINUTES * 60;

  const el = {
    timer: document.getElementById('timer'),
    progress: document.getElementById('progress'),
    category: document.getElementById('category'),
    questionText: document.getElementById('questionText'),
    questionTypeTag: document.getElementById('questionTypeTag'),
    options: document.getElementById('options'),
    navDots: document.getElementById('navDots'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnSubmit: document.getElementById('btnSubmit')
  };

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(function() {
      secondsRemaining--;
      el.timer.textContent = formatTime(secondsRemaining);
      if (secondsRemaining <= 300) el.timer.classList.add('warning');
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        submitExam();
      }
    }, 1000);
  }

  function isMultiple(q) {
    return Array.isArray(q.answer);
  }

  function renderQuestion(index) {
    currentIndex = index;
    const q = questions[index];
    const multi = isMultiple(q);
    el.category.textContent = q.category;
    el.questionText.textContent = q.question;
    if (el.questionTypeTag) {
      el.questionTypeTag.textContent = multi ? '多选题' : '单选题';
      el.questionTypeTag.className = 'question-type-tag' + (multi ? ' multi' : '');
    }
    el.progress.textContent = '第 ' + (index + 1) + ' / ' + questions.length + ' 题';

    el.options.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    const currentAnswer = answers[q.id];
    const selectedSet = multi && Array.isArray(currentAnswer) ? currentAnswer : (currentAnswer ? [currentAnswer] : []);

    q.options.forEach(function(opt, i) {
      const letter = letters[i];
      const div = document.createElement('div');
      const inputType = multi ? 'checkbox' : 'radio';
      const name = multi ? 'answer_' + q.id : 'answer';
      const checked = multi ? selectedSet.indexOf(letter) !== -1 : currentAnswer === letter;
      div.className = 'option' + (checked ? ' selected' : '');
      div.innerHTML =
        '<input type="' + inputType + '" name="' + name + '" id="opt' + q.id + '_' + letter + '" value="' + letter + '">' +
        '<label for="opt' + q.id + '_' + letter + '">' + opt + '</label>';
      div.addEventListener('click', function(e) {
        if (e.target.tagName === 'INPUT') return;
        const input = div.querySelector('input');
        if (multi) {
          if (!answers[q.id]) answers[q.id] = [];
          const idx = answers[q.id].indexOf(letter);
          if (idx === -1) answers[q.id].push(letter);
          else answers[q.id].splice(idx, 1);
          answers[q.id].sort();
          document.querySelectorAll('.option').forEach(function(o) {
            const inp = o.querySelector('input');
            o.classList.toggle('selected', answers[q.id].indexOf(inp.value) !== -1);
          });
        } else {
          answers[q.id] = letter;
          document.querySelectorAll('.option').forEach(function(o) { o.classList.remove('selected'); });
          div.classList.add('selected');
          input.checked = true;
        }
        renderNavDots();
      });
      const input = div.querySelector('input');
      input.checked = checked;
      input.addEventListener('change', function() {
        if (multi) {
          if (!answers[q.id]) answers[q.id] = [];
          const idx = answers[q.id].indexOf(letter);
          if (this.checked) { if (idx === -1) answers[q.id].push(letter); }
          else if (idx !== -1) answers[q.id].splice(idx, 1);
          answers[q.id].sort();
        } else {
          answers[q.id] = letter;
        }
        renderNavDots();
      });
      el.options.appendChild(div);
    });

    el.btnPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
    el.btnNext.style.visibility = index === questions.length - 1 ? 'hidden' : 'visible';
    renderNavDots();
  }

  function isAnswered(q) {
    const a = answers[q.id];
    if (Array.isArray(q.answer)) return a && Array.isArray(a) && a.length > 0;
    return !!a;
  }

  function renderNavDots() {
    el.navDots.innerHTML = '';
    questions.forEach(function(q, i) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-dot' + (i === currentIndex ? ' current' : '') + (isAnswered(q) ? ' answered' : '');
      btn.textContent = i + 1;
      btn.addEventListener('click', function() {
        renderQuestion(i);
      });
      el.navDots.appendChild(btn);
    });
  }

  function scoreAnswer(q, userAnswer) {
    const multi = isMultiple(q);
    const correct = q.answer;
    if (multi) {
      if (!userAnswer || !Array.isArray(userAnswer)) return 0;
      const u = userAnswer.slice().sort().join('');
      const c = correct.slice().sort().join('');
      return u === c ? 2 : 0;
    }
    return userAnswer === correct ? 1 : 0;
  }

  function submitExam() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    let totalScore = 0;
    let correctCount = 0;
    const results = questions.map(function(q) {
      const userAnswer = answers[q.id] || (isMultiple(q) ? [] : null);
      const points = scoreAnswer(q, userAnswer);
      totalScore += points;
      const isCorrect = points > 0;
      if (isCorrect) correctCount++;
      const displayAnswer = Array.isArray(q.answer) ? q.answer.join('、') : q.answer;
      const displayUser = Array.isArray(userAnswer) ? (userAnswer.length ? userAnswer.join('、') : '未选') : (userAnswer || '未选');
      return {
        question: q.question,
        category: q.category,
        options: q.options,
        answer: q.answer,
        displayAnswer: displayAnswer,
        userAnswer: userAnswer,
        displayUser: displayUser,
        correct: isCorrect,
        points: points,
        maxPoints: isMultiple(q) ? 2 : 1,
        explanation: q.explanation
      };
    });
    sessionStorage.setItem('acpExamResults', JSON.stringify({
      results: results,
      score: totalScore,
      total: questions.length,
      correct: correctCount,
      timeUsed: TOTAL_MINUTES * 60 - secondsRemaining
    }));
    window.location.href = 'result.html';
  }

  el.btnPrev.addEventListener('click', function() {
    if (currentIndex > 0) renderQuestion(currentIndex - 1);
  });
  el.btnNext.addEventListener('click', function() {
    if (currentIndex < questions.length - 1) renderQuestion(currentIndex + 1);
  });
  el.btnSubmit.addEventListener('click', function() {
    if (confirm('确定要交卷吗？')) submitExam();
  });

  renderQuestion(0);
  renderNavDots();
  startTimer();
})();
