import express from 'express';
import * as path from "path";
import fs from "fs";
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import { Worker } from 'worker_threads';

const app = express();

//Middleware
// app.use('/storage', express.static('storage'))
// app.use((req, res, next) =>{
// 	const stringGenerator = () => {
// 		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
// 		const date = new Date().toISOString();
// 		const query = req.method;
// 		const serverAnswer = res.statusCode;
// 		return `${ip} - - [${date} -0300] "${query} /boo HTTP/1.1" ${serverAnswer} 0 "-" "curl/7.47.0"\n`;
// 	};
// 	fs.exists(path, () => {
// 		fs.writeFile('./storage/access.log', stringGenerator(), {flag: 'a', encoding: 'utf-8'}, (err) => err)
// 	})
// 	next()
// })
// EndMiddleware


import _yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const yargs = _yargs(hideBin(process.argv));


const options = yargs.usage('Usage -p ')
	.options({
		'p': {
			alias: 'path',
			describe: 'Filter to file',
			type: 'string',
			demandOption: false,
		}
	}).argv;

const __dirname = dirname(fileURLToPath(import.meta.url));

let currentDir = options.p ? path.join(__dirname, options.p) : __dirname;


function start(workerData) {
    return new Promise((resolve,reject) =>{
	const worker = new Worker(path.join(__dirname,'./worker.js'), {workerData});
	worker.on('message', resolve);
	worker.on('error', reject);
    })
}

// .replace('%20',' ') КОСТЫЛЬ ДЛЯ ВИНДЫ. На маке не должно быть такого
// Пробел в адресной строке ломал программу.

const checkDir = (filePath) => {
	return fs.lstatSync(filePath.replace('%20',' ')).isDirectory();
}


app.get('/', function (req, res) {
	(() => {
		const list = fs.readdirSync(currentDir);
		res.send(`<body>
			<div style="display: flex; flex-direction:column;">
			${list.map((item,index)=>{
				return `<a href='/${item}'><button id="${index}">${item}</button></a>`
			}).join('')}
			</div>
		</body>`);
	})();

})

app.get('*', function (req, res) {
	if(req.url === '/favicon.ico') return;
	const newPath = path.join(currentDir, req.url.split('/').filter(function (el) {
		return (el != null && el != "" || el === 0);
	}).join('/')).replace('%20',' ');
	( () => {
		if(!checkDir(newPath)) {
		    start([newPath,req.url])
			.then(result => res.send(result.data))
		} else {
			const list = fs.readdirSync(newPath);
			let arrPath = req.url.split('/').filter(function (el) {
				return (el != null && el != "" || el === 0);
			});
			res.send(`<body>
				<div style="display: flex; flex-direction:column;">
				<a href='${arrPath.length > 1 ? '/' : ''}${arrPath.slice(0,arrPath.length - 1).join('/')}/'><button>Back</button></a>
					${list.map((item,index)=>{
						return `<a href='/${req.url.split('/').filter(function (el) {
							return (el != null && el != "" || el === 0);
						}).join('/')}/${item}'><button id="${index}">${item}</button></a>`
					}).join('')}
				</div>
			</body>`);
		}
	})();
})

app.listen(3000, () => {
	console.log('Hello from 3000')
});