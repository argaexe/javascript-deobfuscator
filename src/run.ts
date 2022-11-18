#!/usr/bin/env node

import { deobfuscate } from './index';
import fs from 'fs';
import { Command } from 'commander';

const program = new Command();
program
    .description('Deobfuscate a javascript file')
    .requiredOption('-i, --input <input_file>', 'The input file to deobfuscate')
    .option('-o, --output [output_file]', 'The deobfuscated output file')
    .option('-v, --verbose [1|0]', 'Verbose mode', '1')
    .option('-off, --off', 'Turn off all functions (by default all functions are turned on)')
    .option('-aunpack, --unpack-arrays [1|0]', 'Unpack arrays')
    .option('-arem, --remove-arrays [1|0]', 'Remove arrays')
    .option('-prepl, --replace-proxy-functions [1|0]', 'Replace proxy functions')
    .option('-prem, --remove-proxy-functions [1|0]', 'Remove proxy functions')
    .option('-simpl, --simplify-expressions [1|0]', 'Simplify expressions')
    .option('-remdead, --remove-dead-branches [1|0]', 'Remove dead branches')
    .option('-renhex, --rename-hex-identifiers [1|0]', 'Rename hex identifiers')
    .option('-beauty, --beautify [1|0]', 'Beautify the code')
    .option('-psimpl, --simplify-properties [1|0]', 'Simplify properties');

program.showSuggestionAfterError(false);
program.showHelpAfterError('(add --help for additional information)');

program.parse(process.argv);
const options = program.opts();

var outputFile = options.output
if(outputFile === undefined) {
  outputFile = options.input;
  if(outputFile.endsWith(".js")) {
    outputFile = outputFile.substr(0, outputFile.length - 3);
  }
  if(outputFile.endsWith(".obfuscated")) {
    outputFile = outputFile.substr(0, outputFile.length - 11);
  }
  outputFile = outputFile + ".deobfuscated.js";
}

console.info(`Source file:\t${options.input}`);
console.info(`Target file:\t${outputFile}`);

// check if the input file exists
if (!fs.existsSync(options.input)) {
    console.error(`The input file ${options.input} does not exist`);
    process.exit(1);
}

const source = fs.readFileSync(options.input).toString();
	
const parseBoolOpt = function(v: any, v_default?: any) {
    if(v === undefined) {
        v = v_default;
    }
    return v === "1" || v === "yes" || v === "y" || v === true || v === 1;
};

const onByDefault = !parseBoolOpt(options.off);

var config = {
    verbose: parseBoolOpt(options.verbose, true),
    arrays: {
        unpackArrays: parseBoolOpt(options.unpackArrays, onByDefault),
        removeArrays: parseBoolOpt(options.removeArrays, onByDefault)
    },
    proxyFunctions: {
        replaceProxyFunctions: parseBoolOpt(options.replaceProxyFunctions, onByDefault),
        removeProxyFunctions: parseBoolOpt(options.removeProxyFunctions, onByDefault)
    },
    expressions: {
        simplifyExpressions: parseBoolOpt(options.simplifyExpressions, onByDefault),
        removeDeadBranches: parseBoolOpt(options.removeDeadBranches, onByDefault)
    },
    miscellaneous: {
        beautify: parseBoolOpt(options.beautify, onByDefault),
        simplifyProperties: parseBoolOpt(options.simplifyProperties, onByDefault),
        renameHexIdentifiers: parseBoolOpt(options.renameHexIdentifiers, onByDefault)
    }
};

console.log(config);

const output = deobfuscate(source, config);
fs.writeFileSync(outputFile, output);
console.info(`The output file ${outputFile} has been created`);
