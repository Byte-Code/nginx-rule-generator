import { generateRule, Location } from "./Location";
import { readAll } from "./RedirectFileReader"
import * as fs from 'fs';
import { join } from "path";
import { guessFileName } from "./file-name-generator";

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
