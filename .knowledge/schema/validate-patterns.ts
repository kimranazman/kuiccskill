import { PatternSchema } from './pattern.schema';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { glob } from 'glob';

async function validatePatterns() {
  const patterns = await glob('.knowledge/patterns/**/*.yaml');
  let valid = 0;
  let invalid = 0;

  for (const file of patterns) {
    const content = readFileSync(file, 'utf-8');
    const data = parse(content);
    const result = PatternSchema.safeParse(data);
    if (result.success) {
      valid++;
    } else {
      console.error(`Invalid: ${file}`, result.error.issues);
      invalid++;
    }
  }

  console.log(`Validated ${valid} patterns, ${invalid} invalid`);
  process.exit(invalid > 0 ? 1 : 0);
}

validatePatterns();
