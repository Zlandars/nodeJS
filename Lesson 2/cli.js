#! C:\\Program Files\\nvm\\v18.10.0

import fs from 'fs';
import * as readline from "readline";
import * as path from "path";
import inquirer from "inquirer";
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import * as color from 'colors';

const __dirname = dirname(fileURLToPath(import.meta.url));

import _yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import colors from "colors";

const yargs = _yargs(hideBin(process.argv));


const options = yargs.usage('Usage -p ')
	.options({
		'p': {
			alias: 'path',
			describe: 'Filter to file',
			type: 'string',
			demandOption: false,
		},
		'f': {
			alias: 'filter',
			describe: 'Filter to file',
			type: 'string',
			demandOption: false,
		}
	}).argv;

let currentDir = options.p ? path.join(__dirname, options.p) : __dirname;

const checkDir = (filePath) => {
	return fs.lstatSync(path.join(currentDir, filePath)).isDirectory();
}
let counter = 0;

const inq = async () => {
	// Асинхронный ридер не запускался вообще никак, не понимаю почему
	const list = fs.readdirSync(currentDir);
	list.unshift('./')
	const iteration = await inquirer.prompt([
		{
			name: 'file',
			type: 'list',
			message: 'Choose: ',
			choices: list

		}
	]).then(answer => answer)
	if (iteration.file === './') {
		currentDir = currentDir.split('\\').slice(0, -1).join('\\');
		return await inq()
	}
	if (checkDir(iteration.file)) {
		const arr = currentDir.split('\\');
		arr.push(iteration.file);
		currentDir = arr.join('\\');
		return await inq();
	} else {
		const readStream = fs.createReadStream(path.join(currentDir, iteration.file), 'utf8');
		const rl = readline.createInterface({
			input: readStream,
		})
		rl.on('line', (data)=> {
			counter++;
			const regExp = new RegExp(options.f, 'g');
			console.log(colors.grey(data))
			if (regExp.test(data.toString())) {
				const string = data.replace(options.f, (findString) => {
					return colors.red(findString);
				})
				console.log(`Строка номер ${colors.green(counter)}. Найдено совпадение: ${string}`)
				rl.close();
				readStream.close();
			}
		})
	}
}
inq();