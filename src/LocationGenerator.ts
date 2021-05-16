import { generateRule, Location } from "./Location";
import { readAll } from "./RedirectFileReader"
import * as fs from 'fs';
import { join } from "path";
import * as uuid from 'uuid';

const guessFileName = (location: Location) => {
  const baseUrlWithoutStartingSlash = location.baseUrl.substr(1);
  const clearedPath = baseUrlWithoutStartingSlash.replace(/[\/,\.]/g, '_');
  return `${!clearedPath ? 'home' : clearedPath}_${uuid.v4()}.rule`;
}

export const generateAllRules = async (sourceFile: string, targetServerName: string | undefined, outputDir: string) => {
  const locations = await readAll(sourceFile, targetServerName);
  locations.forEach(item => {
    const generatedFileName = guessFileName(item);
    const generatedRule = generateRule(item);
    const destinationFile = join(outputDir, generatedFileName);
    if (fs.existsSync(destinationFile)) {
      throw new Error(`File '${generatedFileName}' already exists in folder '${outputDir}'`);
    }

    fs.writeFileSync(destinationFile, generatedRule, { encoding: 'utf-8' });
    console.log(`Generated rule file for '${item.baseUrl}`)
  });
}
