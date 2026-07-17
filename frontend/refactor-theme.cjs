const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
  { regex: /text-slate-900\s+dark:text-white/g, replace: 'text-foreground' },
  { regex: /text-slate-800\s+dark:text-white/g, replace: 'text-foreground' },
  { regex: /text-slate-700\s+dark:text-white/g, replace: 'text-foreground' },
  { regex: /text-slate-800\s+dark:text-slate-300/g, replace: 'text-foreground' },
  { regex: /text-slate-700\s+dark:text-slate-300/g, replace: 'text-foreground' },
  
  { regex: /text-slate-500\s+dark:text-slate-400/g, replace: 'text-muted-foreground' },
  { regex: /text-slate-600\s+dark:text-slate-300/g, replace: 'text-muted-foreground' },
  { regex: /text-slate-500\s+dark:text-slate-300/g, replace: 'text-muted-foreground' },
  { regex: /text-slate-600\s+dark:text-slate-400/g, replace: 'text-muted-foreground' },
  { regex: /text-slate-500/g, replace: 'text-muted-foreground' }, // standalone fallback
  
  { regex: /bg-slate-50\s+dark:bg-slate-900\/50/g, replace: 'bg-card' },
  { regex: /bg-slate-50\s+dark:bg-slate-900/g, replace: 'bg-card' },
  { regex: /bg-white\/50\s+dark:bg-slate-800\/50/g, replace: 'bg-card' },
  { regex: /bg-white\s+dark:bg-slate-800/g, replace: 'bg-card' },
  { regex: /bg-white\s+dark:bg-slate-900/g, replace: 'bg-card' },
  
  { regex: /border-slate-200\s+dark:border-white\/10/g, replace: 'border-border' },
  { regex: /border-slate-200\s+dark:border-slate-700/g, replace: 'border-border' },
  { regex: /border-slate-200\s+dark:border-slate-800/g, replace: 'border-border' },
  { regex: /border-slate-100\s+dark:border-white\/5/g, replace: 'border-border' },
  { regex: /border-slate-100\s+dark:border-slate-800\/50/g, replace: 'border-border' },
  { regex: /border-slate-200/g, replace: 'border-border' }, // standalone
  
  { regex: /bg-slate-100\s+dark:bg-slate-800/g, replace: 'bg-muted' },
  { regex: /bg-slate-200\s+dark:bg-slate-700/g, replace: 'bg-muted' },
  
  { regex: /hover:bg-slate-100\s+dark:hover:bg-slate-800/g, replace: 'hover:bg-muted' },
  { regex: /hover:bg-slate-50\s+dark:hover:bg-slate-800\/50/g, replace: 'hover:bg-muted' },
  { regex: /hover:bg-white\/50\s+dark:hover:bg-slate-800\/50/g, replace: 'hover:bg-muted' },
  { regex: /hover:bg-white\s+dark:hover:bg-slate-800/g, replace: 'hover:bg-muted' },
  { regex: /hover:bg-slate-50\s+dark:hover:bg-slate-800\/30/g, replace: 'hover:bg-muted' },
  { regex: /hover:bg-slate-100\s+dark:hover:bg-slate-700\/50/g, replace: 'hover:bg-muted' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replacements.forEach(({ regex, replace }) => {
        content = content.replace(regex, replace);
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
