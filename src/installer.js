const fs = require('fs');
const path = require('path');
const { copyDir, ensureDir, safeName } = require('./file-utils');
const { getLibrarySkillPath } = require('./library');

function installSkill(projectRoot, skillName, targetPath) {
  const source = getLibrarySkillPath(projectRoot, skillName);
  const targetRoot = path.resolve(targetPath);
  const target = path.join(targetRoot, safeName(skillName));

  ensureDir(targetRoot);

  if (fs.existsSync(target)) {
    throw new Error(`Target already exists: ${target}`);
  }

  try {
    fs.symlinkSync(source, target, 'junction');
    return { ok: true, mode: 'symlink', source, target };
  } catch (error) {
    copyDir(source, target);
    return {
      ok: true,
      mode: 'copy',
      source,
      target,
      note: `Symlink failed, copied instead: ${error.message}`
    };
  }
}

module.exports = {
  installSkill
};
