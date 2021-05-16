import * as fs from 'fs-extra';
import { join } from 'path';
import { generateAllRules } from './LocationGenerator';
import yargs = require('yargs/yargs');

const checkFilePermission = (fileName: string, mode: number) => {
  try {
    fs.accessSync(fileName, mode);
    return true;
  } catch (err) {
    return false;
  }
}

const hostValidator = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
const validateHost = (host: string) => {
  return hostValidator.test(host);
}

var argv = yargs(process.argv.slice(2)).usage('Generates nginx rules from csv source')
  .option('i', {
    alias: 'input-file',
    description: 'Rules CSV File',
    requiresArg: true,
    demandOption: true,
  })
  .option('o', {
    alias: 'output-dir',
    description: 'Output directory',
    requiresArg: true,
    demandOption: true,
  })
  .option('host', {    
    description: 'Original host name, will be used to filter the file',
    requiresArg: true,    
    demandOption: "The orignal host",      
  }).check((incomingArgs) => {
    const { 'input-file': inputFile , 'output-dir': outputDir, 'original-host': originalHost } = incomingArgs;

    if (!checkFilePermission(inputFile as string, fs.constants.R_OK)) {
      throw new Error('Input file does not exists or cannot be read');
    }

    if (!checkFilePermission(outputDir as string, fs.constants.W_OK)) {
      throw new Error('Output dir does not exists or is not writable');
    }
    
    if (!validateHost(originalHost as string)) {
      throw new Error('Original host is not valid')
    }

    return true;
  }).argv;


const doGenerateRules = (inputFile: string, outputDir: string, sourceHostName: string) => {  
  const rulesDir = join(outputDir,`rules-${new Date().getTime()}`);  
  fs.ensureDirSync(rulesDir);      
  console.debug(`Using '${rulesDir}':`);
  return generateAllRules(inputFile, sourceHostName, rulesDir);
} 

const { 'input-file': inputFile , 'output-dir': outputDir, host } = argv;

doGenerateRules(inputFile as string, outputDir as string , host as string);
