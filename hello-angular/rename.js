const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app');

const renames = [
  // Classes
  { from: /NewRealStoreComponent/g, to: 'NewParentRealStoreComponent' },
  { from: /NewMockStoreComponent/g, to: 'NewParentMockStoreComponent' },
  { from: /OldRealStoreComponent/g, to: 'OldParentRealStoreComponent' },
  { from: /OldMockStoreComponent/g, to: 'OldParentMockStoreComponent' },
  { from: /NewSyntaxChildComponent/g, to: 'NewChildComponent' },
  { from: /MockNewSyntaxChildComponent/g, to: 'MockNewChildComponent' },
  { from: /NewSyntaxChildService/g, to: 'NewChildService' },
  
  // Selectors
  { from: /'app-new-real-store'/g, to: "'app-new-parent-real-store'" },
  { from: /'app-new-mock-store'/g, to: "'app-new-parent-mock-store'" },
  { from: /'app-old-real-store'/g, to: "'app-old-parent-real-store'" },
  { from: /'app-old-mock-store'/g, to: "'app-old-parent-mock-store'" },
  { from: /'app-new-syntax-child'/g, to: "'app-new-child'" },
  
  // HTML tags in templates
  { from: /<app-new-syntax-child/g, to: '<app-new-child' },
  { from: /<\/app-new-syntax-child>/g, to: '</app-new-child>' },

  // File paths/imports
  { from: /new-real-store\.component/g, to: 'new-parent-real-store.component' },
  { from: /new-mock-store\.component/g, to: 'new-parent-mock-store.component' },
  { from: /old-real-store\.component/g, to: 'old-parent-real-store.component' },
  { from: /old-mock-store\.component/g, to: 'old-parent-mock-store.component' },
  { from: /new-syntax-child\.component/g, to: 'new-child.component' },
  { from: /new-syntax-child\.service/g, to: 'new-child.service' },
];

function processDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const {from, to} of renames) {
        if (content.match(from)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
      
      // Also rename the file if it matches our pattern
      let newName = file;
      newName = newName.replace('new-real-store.component', 'new-parent-real-store.component');
      newName = newName.replace('new-mock-store.component', 'new-parent-mock-store.component');
      newName = newName.replace('old-real-store.component', 'old-parent-real-store.component');
      newName = newName.replace('old-mock-store.component', 'old-parent-mock-store.component');
      newName = newName.replace('new-syntax-child.component', 'new-child.component');
      newName = newName.replace('new-syntax-child.service', 'new-child.service');
      
      if (newName !== file) {
        fs.renameSync(fullPath, path.join(currentDir, newName));
      }
    }
  }
}

processDir(dir);
console.log('Done renaming components!');
