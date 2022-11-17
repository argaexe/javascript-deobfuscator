#!/usr/bin/env node

import { deobfuscate } from './index';
import fs from 'fs';
import { Command } from 'commander';

const program = new Command();
program
    .description('Deobfuscate a javascript file')
    .option('-i, --input [input_file]', 'The input file to deobfuscate', 'input/source.js')
    .option('-o, --output [output_file]', 'The deobfuscated output file', 'output/output.js')
    .option('-v, --verbose [verbose]', 'Verbose mode', '1')
    .option('-aunpack, --unpack-arrays [unpack_arrays]', 'Unpack arrays', '1')
    .option('-arem, --remove-arrays [remove_arrays]', 'Remove arrays', '1')
    .option('-prepl, --replace-proxy-functions [replace_proxy_functions]', 'Replace proxy functions', '1')
    .option('-prem, --remove-proxy-functions [remove_proxy_functions]', 'Remove proxy functions', '1')
    .option('-simpl, --simplify-expressions [simplify_expressions]', 'Simplify expressions', '1')
    .option('-remdead, --remove-dead-branches [remove_dead_branches]', 'Remove dead branches', '1')
    .option('-renhex, --rename-hex-identifiers [rename_hex_identifiers]', 'Rename hex identifiers', '1')
    .option('-beauty, --beautify [beautify]', 'Beautify the code', '1')
    .option('-psimpl, --simplify-properties [simplify_properties]', 'Simplify properties', '1');

program.parse(process.argv);
const options = program.opts();

// check if the input file exists
if (!fs.existsSync(options.input)) {
    console.error(`The input file ${options.input} does not exist`);
    process.exit(1);
}

const source = fs.readFileSync(options.input).toString();

const parseBoolOpt = function(v: any) {
    return v === "1" || v === "yes" || v === "y" || v === true || v === 1;
};

var config = {
    verbose: parseBoolOpt(options.verbose),
    arrays: {
        unpackArrays: parseBoolOpt(options.unpackArrays),
        removeArrays: parseBoolOpt(options.removeArrays)
    },
    proxyFunctions: {
        replaceProxyFunctions: parseBoolOpt(options.replaceProxyFunctions),
        removeProxyFunctions: parseBoolOpt(options.removeProxyFunctions)
    },
    expressions: {
        simplifyExpressions: parseBoolOpt(options.simplifyExpressions),
        removeDeadBranches: parseBoolOpt(options.removeDeadBranches)
    },
    miscellaneous: {
        beautify: parseBoolOpt(options.beautify),
        simplifyProperties: parseBoolOpt(options.simplifyProperties),
        renameHexIdentifiers: parseBoolOpt(options.renameHexIdentifiers)
    }
};

const output = deobfuscate(source, config);
fs.writeFileSync(options.output, output);
console.info(`The output file ${options.output} has been created`);
