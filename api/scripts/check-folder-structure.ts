import * as fs from 'fs';
import * as path from 'path';

interface Folder {
  name: string;
  subfolders?: Array<Folder>;
}

const config: Array<Folder> = [
  {
    name: 'src',
    subfolders: [
      {
        name: 'domains',
        subfolders: [{ name: 'users' }, { name: 'expenses' }],
      },
    ],
  },
  { name: 'build' },
  { name: 'node_modules' },
  { name: 'scripts' },
  { name: 'test' },
];

const errors: Array<string> = [];

function checkFolderStructure(basePath: string, allowedFolders: Array<Folder>) {
  checkForExtraFolders(basePath, allowedFolders);

  for (const folder of allowedFolders) {
    const folderPath = path.join(basePath, folder.name);
    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
      errors.push(`Missing or not a directory: ${folderPath}`);
      continue;
    }

    if (folder.subfolders) {
      checkFolderStructure(folderPath, folder.subfolders);
    }
  }
}

function checkForExtraFolders(basePath: string, allowedFolders: Array<Folder>) {
  const existingFolders = fs.readdirSync(basePath);
  for (const existingFolder of existingFolders) {
    if (!fs.lstatSync(path.join(basePath, existingFolder)).isDirectory()) {
      continue;
    }

    const isAllowed = allowedFolders.some((folder) => folder.name === existingFolder);
    if (!isAllowed) {
      errors.push(`Extra folder found: ${path.join(basePath, existingFolder)}`);
    }
  }
}

function main() {
  const basePath = path.join(import.meta.dirname, '..');
  checkFolderStructure(basePath, config);

  if (errors.length > 0) {
    console.error('Folder structure check failed with the following errors:');
    for (const error of errors) {
      console.error(error);
    }
    process.exit(1);
  } else {
    console.log('Folder structure is valid.');
  }
}

main();
