const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const ENTRY_FILES = [
  'SKILL.md',
  'Skill.md',
  'skill.md',
  'README.md',
  'manifest.json',
  'skill.json',
  'agent.json'
];

function getDefaultScanRoots(projectRoot = process.cwd()) {
  const home = os.homedir();
  return [
    path.join(home, '.claude', 'skills'),
    path.join(home, '.cursor', 'skills'),
    path.join(home, '.agents', 'skills'),
    path.join(home, '.copilot', 'skills'),
    path.join(home, '.codeium', 'windsurf', 'skills'),
    path.join(home, '.kiro', 'skills'),
    path.join(projectRoot, '.claude', 'skills'),
    path.join(projectRoot, '.cursor', 'skills'),
    path.join(projectRoot, '.agents', 'skills'),
    path.join(projectRoot, '.github', 'copilot', 'skills'),
    path.join(projectRoot, '.windsurf', 'skills'),
    path.join(projectRoot, '.kiro', 'skills')
  ];
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function safeStat(targetPath) {
  try {
    return fs.statSync(targetPath);
  } catch (_) {
    return null;
  }
}

function detectAgent(rootPath) {
  const normalized = rootPath.replace(/\\/g, '/').toLowerCase();
  if (normalized.includes('/.claude/')) return 'Claude Code';
  if (normalized.includes('/.cursor/')) return 'Cursor';
  if (normalized.includes('/.agents/')) return 'Generic .agents / Codex';
  if (normalized.includes('/.copilot/') || normalized.includes('/.github/copilot/')) return 'GitHub Copilot';
  if (normalized.includes('/.codeium/windsurf/') || normalized.includes('/.windsurf/')) return 'Windsurf';
  if (normalized.includes('/.kiro/')) return 'Kiro';
  return 'Custom';
}

function findEntryFile(skillDir) {
  for (const file of ENTRY_FILES) {
    const fullPath = path.join(skillDir, file);
    if (safeStat(fullPath)?.isFile()) return fullPath;
  }
  return null;
}

function readSummary(entryFile) {
  try {
    const raw = fs.readFileSync(entryFile, 'utf8');
    const lines = raw.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const heading = lines.find(line => line.startsWith('#'));
    const normal = lines.find(line => !line.startsWith('#') && !line.startsWith('```'));
    return (heading || normal || '').replace(/^#+\s*/, '').slice(0, 160);
  } catch (_) {
    return '';
  }
}

function scanRoot(rootPath) {
  const results = [];
  const rootStat = safeStat(rootPath);
  if (!rootStat || !rootStat.isDirectory()) return results;

  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillDir = path.join(rootPath, entry.name);
    const entryFile = findEntryFile(skillDir);
    if (!entryFile) continue;

    const fileStat = safeStat(entryFile);
    if (!fileStat) continue;

    results.push({
      name: entry.name,
      sourceAgent: detectAgent(rootPath),
      sourceRoot: rootPath,
      sourcePath: skillDir,
      entryFile,
      summary: readSummary(entryFile),
      lastModified: fileStat.mtime.toISOString(),
      size: fileStat.size,
      hash: hashFile(entryFile),
      duplicateKey: entry.name.toLowerCase()
    });
  }

  return results;
}

function markDuplicates(skills) {
  const byName = new Map();
  const byHash = new Map();

  for (const skill of skills) {
    if (!byName.has(skill.duplicateKey)) byName.set(skill.duplicateKey, []);
    byName.get(skill.duplicateKey).push(skill);

    if (!byHash.has(skill.hash)) byHash.set(skill.hash, []);
    byHash.get(skill.hash).push(skill);
  }

  return skills.map(skill => {
    const sameName = byName.get(skill.duplicateKey) || [];
    const sameHash = byHash.get(skill.hash) || [];
    return {
      ...skill,
      duplicateByName: sameName.length > 1,
      duplicateByHash: sameHash.length > 1,
      duplicateCount: sameName.length,
      exactDuplicateCount: sameHash.length
    };
  });
}

function scanSkills(roots) {
  const uniqueRoots = [...new Set(roots.filter(Boolean).map(root => path.resolve(root)))];
  const all = uniqueRoots.flatMap(scanRoot);
  return markDuplicates(all).sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  scanSkills,
  getDefaultScanRoots,
  ENTRY_FILES
};
