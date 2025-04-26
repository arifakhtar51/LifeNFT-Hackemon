const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// Project root directory (current working directory)
const PROJECT_ROOT = process.cwd();

// Main function to reorganize the project
async function reorganizeProject() {
  try {
    console.log('Starting project reorganization...');
    
    // 1. Create the directory structure
    await createDirectories();
    
    // 2. Move files to their appropriate locations
    await moveFiles();
    
    // 3. Create index.js files
    await createIndexFiles();
    
    console.log('Project reorganized successfully!');
  } catch (error) {
    console.error('Error reorganizing project:', error);
  }
}

// Create all directories according to file_structure.md
async function createDirectories() {
  console.log('Creating directory structure...');
  
  const directories = [
    // Frontend directories
    'lifenft/client/public/assets/images',
    'lifenft/client/src/components/common',
    'lifenft/client/src/components/layout',
    'lifenft/client/src/components/auth',
    'lifenft/client/src/context',
    'lifenft/client/src/hooks',
    'lifenft/client/src/pages/auth',
    'lifenft/client/src/pages/dashboard',
    'lifenft/client/src/pages/donations',
    'lifenft/client/src/pages/nft',
    'lifenft/client/src/pages/settings',
    'lifenft/client/src/services/api',
    'lifenft/client/src/services/blockchain',
    'lifenft/client/src/utils/formatters',
    'lifenft/client/src/utils/validators',
    
    // Backend directories
    'lifenft/server/controllers',
    'lifenft/server/middleware',
    'lifenft/server/models',
    'lifenft/server/routes',
    'lifenft/server/services',
    'lifenft/server/utils',
    'lifenft/server/config',
    'lifenft/server/database/migrations',
    'lifenft/server/database/seeders',
    'lifenft/server/templates/emails',
  ];
  
  // Create each directory
  for (const dir of directories) {
    await fs.ensureDir(path.join(PROJECT_ROOT, dir));
    console.log(`Created directory: ${dir}`);
  }
}

// Move files to their appropriate locations based on patterns
async function moveFiles() {
  console.log('Moving files to appropriate locations...');
  
  // Define file patterns and their target directories
  const fileRules = [
    // Frontend components
    { pattern: '**/Button*.js', target: 'lifenft/client/src/components/common' },
    { pattern: '**/Card*.js', target: 'lifenft/client/src/components/common' },
    { pattern: '**/Header*.js', target: 'lifenft/client/src/components/layout' },
    { pattern: '**/Sidebar*.js', target: 'lifenft/client/src/components/layout' },
    { pattern: '**/Login*.js', target: 'lifenft/client/src/components/auth' },
    { pattern: '**/Register*.js', target: 'lifenft/client/src/components/auth' },
    
    // Context files
    { pattern: '**/*Context.js', target: 'lifenft/client/src/context' },
    
    // Hooks
    { pattern: '**/use*.js', target: 'lifenft/client/src/hooks' },
    
    // Pages
    { pattern: '**/Login.js', target: 'lifenft/client/src/pages/auth' },
    { pattern: '**/Register.js', target: 'lifenft/client/src/pages/auth' },
    { pattern: '**/Dashboard.js', target: 'lifenft/client/src/pages/dashboard' },
    { pattern: '**/DonationsList.js', target: 'lifenft/client/src/pages/donations' },
    { pattern: '**/NFTGallery.js', target: 'lifenft/client/src/pages/nft' },
    { pattern: '**/Profile.js', target: 'lifenft/client/src/pages/settings' },
    
    // Services
    { pattern: '**/api/*.js', target: 'lifenft/client/src/services/api' },
    { pattern: '**/blockchain/*.js', target: 'lifenft/client/src/services/blockchain' },
    
    // Utils
    { pattern: '**/*formatter.js', target: 'lifenft/client/src/utils/formatters' },
    { pattern: '**/*validator.js', target: 'lifenft/client/src/utils/validators' },
    
    // Backend files
    { pattern: '**/*Controller.js', target: 'lifenft/server/controllers' },
    { pattern: '**/*Middleware.js', target: 'lifenft/server/middleware' },
    { pattern: '**/*Model.js', target: 'lifenft/server/models' },
    { pattern: '**/*Routes.js', target: 'lifenft/server/routes' },
    { pattern: '**/*Service.js', target: 'lifenft/server/services' },
    { pattern: '**/config/*.js', target: 'lifenft/server/config' },
  ];
  
  // Process each rule
  for (const rule of fileRules) {
    const files = glob.sync(rule.pattern, { cwd: PROJECT_ROOT });
    
    for (const file of files) {
      const sourcePath = path.join(PROJECT_ROOT, file);
      const fileName = path.basename(file);
      const targetPath = path.join(PROJECT_ROOT, rule.target, fileName);
      
      // Copy the file to its new location
      await fs.copy(sourcePath, targetPath, { overwrite: false });
      console.log(`Moved: ${file} → ${rule.target}/${fileName}`);
    }
  }
}

// Create index.js files to export components from directories
async function createIndexFiles() {
  console.log('Creating index.js files...');
  
  // Directories that need index.js files
  const directories = [
    'lifenft/client/src/components/common',
    'lifenft/client/src/components/layout',
    'lifenft/client/src/components/auth',
    'lifenft/client/src/context',
    'lifenft/client/src/hooks',
    'lifenft/client/src/pages/auth',
    'lifenft/client/src/services/api',
    'lifenft/client/src/services/blockchain',
    'lifenft/client/src/utils/formatters',
    'lifenft/client/src/utils/validators',
    'lifenft/server/controllers',
    'lifenft/server/routes',
    'lifenft/server/services',
  ];
  
  // Create index.js for each directory
  for (const dir of directories) {
    const dirPath = path.join(PROJECT_ROOT, dir);
    
    // Skip if directory doesn't exist
    if (!fs.existsSync(dirPath)) continue;
    
    // Get all JavaScript files in the directory
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.js') && file !== 'index.js');
    
    // Generate index.js content with exports
    const indexContent = files.map(file => {
      const componentName = path.basename(file, '.js');
      return `export { default as ${componentName} } from './${file}';`;
    }).join('\n');
    
    // Write the index.js file
    const indexPath = path.join(dirPath, 'index.js');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log(`Created index.js in ${dir}`);
  }
}

// Start the reorganization
reorganizeProject(); 