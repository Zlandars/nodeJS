import express from 'express';
import * as path from "path";
import fs from "fs";
import _yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const yargs = _yargs(hideBin(process.argv));

const options = yargs.usage('Usage -p ')
    .options({
	'p': {
	    alias: 'path',
	    describe: 'Path to folder',
	    type: 'string',
	    demandOption: false,
	}
    }).argv;

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
let currentDir = options.path ? options.path : process.cwd();

const checkDir = (filePath) => {
	return fs.lstatSync(filePath).isDirectory();
}


app.get('/', function (req, res) {
	(async () => {
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
	}).join('/'));
	(async () => {
		if(!checkDir(newPath)) {
			const readStream = await fs.createReadStream(newPath, 'utf8');
			await readStream.on('data',(chunk)=>{
				let arrPath = req.url.split('/').filter(function (el) {
								return (el != null && el != "" || el === 0);
							});
				return res.send(`
					<body>
						<div style="display: flex; flex-direction:column;">
							<a href='${arrPath.length > 1 ? '/' : ''}${arrPath.slice(0,arrPath.length - 1).join('/')}/'><button>Back</button></a>
						</div>
						<p>${chunk}</p>
					</body>
			`);
			});
			readStream.on('end',()=>console.log('Read stream end'));
		} else {
			const list = fs.readdirSync(newPath);
			let arrPath = req.url.split('/').filter(function (el) {
				return (el != null && el != "" || el === 0);
			});
			res.send(`<body>
				<div style="display: flex; flex-direction:column;">
				<a href='${arrPath.length > 1 ? '/' : ''}${arrPath.slice(0,arrPath.length - 1).join('/')}/'><button>Back</button></a>
					${list.map((item,index)=>{
						console.log(item)
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