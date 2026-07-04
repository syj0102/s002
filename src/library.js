const fs = require('fs');
const path = require('path');
const { ensureDir, copyDir, safeName } = require('./file-utils');
const { ENTRY_FILES } = require('./scanner');

function libraryRoot(projectRoot) {
  return path.join(projectRoot, 'library', 'skills');
}

function findEntryFile(skillDir) {
  for (const file of ENTRY_FILES) {
    const fullPath = path.join(skillDir, file);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) return fullPath;
  }
  return null;
}

function importSkillToLibrary(projectRoot, sourcePath, preferredName) {
  const source = path.resolve(sourcePath);
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    throw new Error('sourcePath is not a directory');
  }

  const name = safeName(preferredName || path.basename(source));
  const target = path.join(libraryRoot(projectRoot), name);
  ensureDir(libraryRoot(projectRoot));

  if (fs.existsSync(target)) {
    throw new Error(`Skill already exists in library: ${name}`);
  }

  copyDir(source, target);

  const metadata = {
    name,
    importedFrom: source,
    importedAt: new Date().toISOString(),
    entryFile: findEntryFile(target)
  };

  fs.writeFileSync(path.join(target, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');

  return { ok: true, name, target, metadata };
}

function listLibrarySkills(projectRoot) {
  const root = libraryRoot(projectRoot);
  if (!fs.existsSync(root)) return [];

  return fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const dir = path.join(root, entry.name);
      const metadataPath = path.join(dir, 'metadata.json');
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        } catch (_) {
          metadata = {};
        }
      }
      return {
        name: entry.name,
        path: dir,
        entryFile: findEntryFile(dir),
        metadata
      };
    });
}

function getLibrarySkillPath(projectRoot, skillName) {
  const target = path.join(libraryRoot(projectRoot), safeName(skillName));
  if (!fs.existsSync(target)) throw new Error(`Skill not found in library: ${skillName}`);
  return target;
}

module.exports = {
  libraryRoot,
  importSkillToLibrary,
  listLibrarySkills,
  getLibrarySkillPath
};
