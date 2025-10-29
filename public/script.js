const API_URL = '/api';

document.getElementById('submitBtn').addEventListener('click', async () => {
  const text = document.getElementById('inputText').value.trim();
  if (!text) {
    alert('টেক্সট লেখো!');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('result').innerHTML = `
        <strong>রেজাল্ট:</strong>
        <pre>${JSON.stringify(data.result, null, 2)}</pre>
      `;
    } else {
      document.getElementById('result').innerHTML = `<p style="color:red;">${data.error}</p>`;
    }
  } catch (err) {
    document.getElementById('result').innerHTML = `<p style="color:red;">নেটওয়ার্ক সমস্যা!</p>`;
  }

  loadHistory();
});

async function loadHistory() {
  try {
    const res = await fetch(`${API_URL}/history`);
    const history = await res.json();
    const list = document.getElementById('historyList');
    list.innerHTML = history.map(h => `
      <li>
        <strong>${h.input_text}</strong><br>
        <small>${new Date(h.created_at).toLocaleString('bn-BD')}</small>
      </li>
    `).join('');
  } catch (err) {
    console.error('History load failed:', err);
  }
}

loadHistory();