#! C:\\Program Files\\nvm\\v18.10.0

import fs from 'fs';
// import * as readline from "readline";
import * as path from "path";
import inquirer from "inquirer";
// в ес6 перестал работать дирнэйм - костыль из интернетов
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// yargs на модулях
import _yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {Transform} from "stream";

const yargs = _yargs(hideBin(process.argv));


const options = yargs.usage('Usage -p ')
	.options({
		'f': {
			alias: 'filter',
			describe: 'Filter to file',
			type: 'string',
			demandOption: true,
		}
	}).argv;
// Чтение файла.
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });
// const question = async (query) =>
// 	new Promise(resolve => rl.question(query,resolve));
// (async ()=>{
// 	const filePath = await question('Введите путь к файлу: ');
// 	const encode = await question('Кодировка: ');
// 	fs.readFile(path.join(__dirname,filePath),encode,(err,data)=>{
// 		if (err) return console.log(err);
// 		console.log(data.toString())
// 	})
// 	rl.close()
// })();

//самовызывающиеся функция
// Собачьи бубенчики (function () {})()
// function () {}()
//	Правильный вид : (function () {}())

let currentDir = __dirname;

const checkDir = (filePath) => {
	return fs.lstatSync(path.join(currentDir, filePath)).isDirectory();
}

const inq = async () => {
	// Асинхронный ридер не запускался вообще никак, не понимаю почему
	const list = await fs.readdirSync(currentDir);
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
		const writeStream = fs.createWriteStream(path.join(__dirname, `./storage/filtered_${options.f}.log`), {
			flags: 'a+',
			encoding: 'utf8'
		});
		const tStream = await new Transform({
			transform(chunk, encoding, callback) {
				console.log(chunk.toString())
				const regExp = new RegExp(options.f, 'g');
				if (regExp.test(chunk.toString())) {
					const arr = `${chunk.toString().split('\n').filter((el) => {
						return regExp.test(el);
					}).join('')} \n`
					this.push(arr)
				}
				callback();
			}
		})
		readStream.pipe(tStream).pipe(writeStream)
		readStream.on('end', () => inq());

	}
}
inq();