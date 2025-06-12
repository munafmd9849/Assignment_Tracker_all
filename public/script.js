let userEmail = '';

async function login(type) {
  const email = document.getElementById('emailInput').value.trim();
  if (!email) return alert("Please enter an email.");

  userEmail = email;

  if (type === 'new') {
    // Register new user
    await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  // Load assignments
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('assignmentSection').classList.remove('hidden');
  loadAssignments();
}

async function loadAssignments() {
  const res = await fetch('/api/questions');
  const questions = await res.json();

  const progressRes = await fetch(`/api/progress/${userEmail}`);
  const progress = await progressRes.json();
  const progressMap = {};
  progress.forEach(p => {
    progressMap[p.question_id] = p.status;
  });

  const list = document.getElementById('assignmentsList');
  list.innerHTML = '';

  questions.forEach(q => {
    const div = document.createElement('div');
    div.className = 'bg-gray-800 p-4 rounded shadow space-y-2';

    const title = document.createElement('h3');
    title.className = 'text-lg text-yellow-400 font-semibold';
    title.textContent = q.title;
    div.appendChild(title);

    const link = document.createElement('a');
    link.href = q.link;
    link.target = '_blank';
    link.className = 'text-blue-400 underline';
    link.textContent = 'Go to Problem';
    div.appendChild(link);

    ['solved', 'doubt', 'reattempt'].forEach(status => {
      const label = document.createElement('label');
      label.className = 'block mt-2';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `status-${q.id}`;
      input.value = status;
      input.checked = progressMap[q.id] === status;
      input.onchange = () => updateProgress(q.id, status);
      label.appendChild(input);
      label.append(` ${status}`);
      div.appendChild(label);
    });

    list.appendChild(div);
  });
}

async function updateProgress(questionId, status) {
  await fetch('/api/progress/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, question_id: questionId, status })
  });
}
