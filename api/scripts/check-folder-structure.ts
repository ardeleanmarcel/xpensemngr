import * as fs from 'fs';
import * as path from 'path';

// TODO (Valle) -> add check for test folder to mirror the structure of src

interface Folder {
  name: string;
  subfolders?: Array<Folder>;
}

const ignoredFolders: Array<string> = ['node_modules', 'build', 'test'];

// TODO (Valle) -> make sure it checks that no subfolders exist if no subfolders are defined in the config
const config: Array<Folder> = [
  {
    name: 'src',
    subfolders: [
      { name: 'constants' },
      {
        name: 'domains',
        subfolders: [{ name: 'auth' }, { name: 'expenses' }, { name: 'users' }],
      },
      { name: 'models' },
      {
        name: 'services',
        subfolders: [
          { name: 'auth' },
          { name: 'event.bus' },
          { name: 'error' },
          { name: 'database' },
          { name: 'notification' },
        ],
      },
      { name: 'types' },
      { name: 'utils' },
    ],
  },
  { name: 'scripts' },
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
    if (ignoredFolders.includes(existingFolder)) {
      continue;
    }

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
