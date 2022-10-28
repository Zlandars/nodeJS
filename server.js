import express from 'express';
import * as path from "path";
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from "fs";
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

//Middleware
app.use('/storage', express.static('storage'))
app.use((req, res, next) =>{
	const stringGenerator = () => {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const date = new Date().toISOString();
		const query = req.method;
		const serverAnswer = res.statusCode;
		return `${ip} - - [${date} -0300] "${query} /boo HTTP/1.1" ${serverAnswer} 0 "-" "curl/7.47.0"\n`;
	};
	fs.exists(path, () => {
		fs.writeFile('./storage/access2.log', stringGenerator(), {flag: 'a+', encoding: 'utf-8'}, (err) => err)
	})
	next()
})
// EndMiddleware
let currentDir = __dirname;
app.get('/', function (req, res) {

	const inq = async () => {
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

	res.send('<h1>HELLO world!</h1>');
})

app.get('*', function (req, res) {
	res.redirect('/')
})
app.listen(3000, () => {
	console.log('Hello from 3000')
});