const rootsInput = document.querySelector('#rootsInput');
const scanBtn = document.querySelector('#scanBtn');
const resetRootsBtn = document.querySelector('#resetRootsBtn');
const refreshLibraryBtn = document.querySelector('#refreshLibraryBtn');
const skillsList = document.querySelector('#skillsList');
const libraryList = document.querySelector('#libraryList');
const stats = document.querySelector('#stats');
const filterInput = document.querySelector('#filterInput');

let allSkills = [];
let defaultRoots = [];

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

function setStatus(message) {
  stats.innerHTML = `<div class="stat">${escapeHtml(message)}</div>`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[ch]));
}

function renderStats(skills) {
  const duplicates = skills.filter(skill => skill.duplicateByName).length;
  const exact = skills.filter(skill => skill.duplicateByHash).length;
  const agents = new Set(skills.map(skill => skill.sourceAgent)).size;
  stats.innerHTML = `
    <div class="stat"><strong>${skills.length}</strong><span>技能</span></div>
    <div class="stat"><strong>${duplicates}</strong><span>同名重复</span></div>
    <div class="stat"><strong>${exact}</strong><span>完全重复</span></div>
    <div class="stat"><strong>${agents}</strong><span>来源 Agent</span></div>
  `;
}

function renderSkills() {
  const keyword = filterInput.value.trim().toLowerCase();
  const skills = allSkills.filter(skill => {
    const text = `${skill.name} ${skill.sourceAgent} ${skill.sourcePath} ${skill.summary}`.toLowerCase();
    return !keyword || text.includes(keyword);
  });

  if (!skills.length) {
    skillsList.className = 'list empty';
    skillsList.textContent = allSkills.length ? '没有匹配结果。' : '还没扫描。';
    return;
  }

  skillsList.className = 'list';
  skillsList.innerHTML = skills.map(skill => `
    <article class="card ${skill.duplicateByName ? 'warning' : ''}">
      <div class="card-main">
        <div class="title-row">
          <h3>${escapeHtml(skill.name)}</h3>
          ${skill.duplicateByName ? `<span class="tag warn">同名 ${skill.duplicateCount}</span>` : ''}
          ${skill.duplicateByHash ? `<span class="tag">完全重复 ${skill.exactDuplicateCount}</span>` : ''}
        </div>
        <p>${escapeHtml(skill.summary || '无摘要')}</p>
        <div class="meta">
          <span>${escapeHtml(skill.sourceAgent)}</span>
          <span>${escapeHtml(skill.lastModified)}</span>
        </div>
        <code>${escapeHtml(skill.sourcePath)}</code>
      </div>
      <div class="actions">
        <button data-import="${escapeHtml(skill.sourcePath)}" data-name="${escapeHtml(skill.name)}">导入中央库</button>
      </div>
    </article>
  `).join('');
}

async function loadRoots() {
  const data = await api('/api/roots');
  defaultRoots = data.roots;
  rootsInput.value = defaultRoots.join('\n');
}

async function scan() {
  scanBtn.disabled = true;
  scanBtn.textContent = '扫描中...';
  try {
    const roots = rootsInput.value.split('\n').map(line => line.trim()).filter(Boolean);
    const data = await api('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ roots })
    });
    allSkills = data.skills;
    renderStats(allSkills);
    renderSkills();
  } catch (error) {
    setStatus(error.message);
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = '开始扫描';
  }
}

async function importSkill(sourcePath, name) {
  try {
    await api('/api/import', {
      method: 'POST',
      body: JSON.stringify({ sourcePath, name })
    });
    await loadLibrary();
    alert('已导入中央库');
  } catch (error) {
    alert(error.message);
  }
}

async function loadLibrary() {
  const data = await api('/api/library');
  if (!data.skills.length) {
    libraryList.className = 'list empty';
    libraryList.textContent = '暂无中央库技能。';
    return;
  }

  libraryList.className = 'list';
  libraryList.innerHTML = data.skills.map(skill => `
    <article class="card">
      <div class="card-main">
        <h3>${escapeHtml(skill.name)}</h3>
        <code>${escapeHtml(skill.path)}</code>
      </div>
      <div class="install-box">
        <input placeholder="目标 skills 目录路径" data-target-for="${escapeHtml(skill.name)}">
        <button data-install="${escapeHtml(skill.name)}">安装</button>
      </div>
    </article>
  `).join('');
}

async function install(skillName) {
  const input = document.querySelector(`[data-target-for="${CSS.escape(skillName)}"]`);
  const targetPath = input?.value.trim();
  if (!targetPath) return alert('先填写目标 skills 目录路径');

  try {
    const result = await api('/api/install', {
      method: 'POST',
      body: JSON.stringify({ skillName, targetPath })
    });
    alert(`安装成功：${result.mode}\n${result.target}`);
  } catch (error) {
    alert(error.message);
  }
}

skillsList.addEventListener('click', event => {
  const button = event.target.closest('[data-import]');
  if (!button) return;
  importSkill(button.dataset.import, button.dataset.name);
});

libraryList.addEventListener('click', event => {
  const button = event.target.closest('[data-install]');
  if (!button) return;
  install(button.dataset.install);
});

scanBtn.addEventListener('click', scan);
resetRootsBtn.addEventListener('click', () => {
  rootsInput.value = defaultRoots.join('\n');
});
refreshLibraryBtn.addEventListener('click', loadLibrary);
filterInput.addEventListener('input', renderSkills);

loadRoots().catch(error => setStatus(error.message));
loadLibrary().catch(error => console.warn(error));
