import fs from 'fs';
import * as path from "path";

const pathRoot = path.join(process.cwd(),'./storage/access.log');
// Генератор жирного лога Задание 1
//
function randomizer(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// Генератор строки лога
const stringGenerator = () => {
    console.log('Генерируется файл лога, сходите за чаем. Это надолго... ' + Math.round((fs.statSync(pathRoot).size / 1024)/1024) + ' MB')
    const ip = `${randomizer(1, 254)}.${randomizer(1, 254)}.${randomizer(1, 254)}.${randomizer(1, 254)}`;
    const date = new Date(randomizer(1, Date.now()));
    const query = ['POST', 'GET'];
    const serverAnswer = ['200', '404', '500'];
    return `${ip} - - [${date} -0300] "${query[randomizer(0, query.length)]} /boo HTTP/1.1" ${serverAnswer[randomizer(0, serverAnswer.length)]} 0 "-" "curl/7.47.0"\n`;
};
// let arrMass = [];

//Геренатор массива строк (искусственное разбиение на части (Не уверен что такое вообще нужно использовать, думал
// сократит операции использования жесткого диска))
// function pushArray() {
// 	arrMass = [];
// 	while (arrMass.length <= 1000) {
// 		arrMass.push(stringGenerator());
// 	}
// 	return arrMass;
// }

// Проверка на существование файла лога
fs.exists(pathRoot, () => {
    do {
	console.clear();
	fs.writeFileSync(pathRoot, stringGenerator(), {
		flag: 'a',
		encoding: 'utf-8'
	    }
	)
    } while (fs.statSync(pathRoot).size < 104857600)
})

// Задание 2
// 	!!!!!!!!					Здесь массив для поиска ИП в логе. Без него 2 задание не запустится.						!!!!!!	//
// const arrIp = ['240.85.195.60', '160.13.46.6'];
// arrIp.map(ip => {
//     const readStream = fs.createReadStream(pathRoot, 'utf8');
//     const writeStream = fs.createWriteStream(`./storage/filtered_${ip}.log`, {flags: 'a+', encoding: 'utf8'});
//     const tStream = new Transform({
// 	transform(chunk, encoding, callback) {
// 	    const regExp = new RegExp(ip, 'g');
// 	    if (regExp.test(chunk.toString())) {
// 		const arr = `${chunk.toString().split('\n').filter((el) => {
// 		    return regExp.test(el);
// 		}).join('')} \n`
// 		this.push(arr)
// 	    }
// 	    callback();
// 	}
//     })
//     readStream.pipe(tStream).pipe(writeStream)
//     readStream.on('end', () => console.log('File reading finished!'));
// })


// readStream.on('data',(chunk)=>{
// 	console.log('Chunk');
// 	console.log(chunk)
// });
// readStream.on('error', (err)=>console.log(err))
//
// Lesson 1
// import * as readline from 'node:readline/promises';
// import { stdin as input, stdout as output } from 'node:process';
// import colors from "colors";
// import 'moment-duration-format';
// import 'moment-precise-range-plugin'
// import { EventEmitter } from 'node:events';
// Домашнее задание 1 урока на событиях
// const rl = readline.createInterface({ input, output });
// rl.on('line',(input)=>{
//     const formatTime = 'YY,MM,DD,HH,mm,ss';
//     const emitter = new EventEmitter();
//
//     const timerRemaining = (input) => {
//         const inputTime = moment(input, formatTime);
//         const timeNow = new Date();
//         if ((inputTime - moment.now()) < 0) {
//             emitter.emit('timerEnd')
//         }
//         console.clear()
//         console.log(moment(timeNow, formatTime).preciseDiff(inputTime));
//     }
//     const timerEnd = (idInterval) => {
//         clearInterval(idInterval);
//         console.log('timer is done')
//     };
//     const timerId = setInterval(()=>{
//         emitter.emit('timerTick',input)
//     }, 1000)
//     emitter.on('timerTick', timerRemaining)
//     emitter.on('timerEnd',()=>{
//         timerEnd(timerId);
//     })
// })
// let arrIntervals = [];
// let arr = [];
// const rl = readline.createInterface({ input, output });
// let state = 'green';
// console.log('Введите диапазон проверяемых значений через запятую');
// console.log('Или введите дату в формате ss-mm-HH-DD-MM-YY');
// rl.on('line',(input)=>{
//     if(input === 'exit') {
//         rl.close();
//     }
// if(input.split(',').length === 2) {
//     const [int1,int2] = input.split(',').sort().map(i=> +i);
//     nextPrime:
//             for (let i = int1; i <= int2; i++) { // Для всех i...
//                 for (let j = 2; j < i; j++) { // проверить, делится ли число..
//                     if (i % j === 0) continue nextPrime; // не подходит, берём следующее
//                 }
//                 arr.push(i)
//             }
//     if (arr.length === 0) {
//         console.log('В указанном диапазоне нет чисел! Попробуйте ввести диапазон снова')
//     }
//     arr.forEach((item) => {
//         if (state === 'green') {
//             console.log(colors.green(item));
//             state = 'yellow'
//         } else if (state === 'yellow') {
//             console.log(colors.yellow(item));
//             state = 'red'
//         } else {
//             console.log(colors.red(item));
//             state = 'green'
//         }
//     });
// }
// Таймер без событий
// if(input.split(',').length > 2) {
//     const formatTime = 'YY,MM,DD,HH,mm,ss';
//     const bindTime = moment(input, formatTime);
//     console.log(moment().format(formatTime) + ' now | after ' + bindTime);
//     function timer(bindTime){
//         let diffTime = bindTime - moment();
//         let duration = moment.duration(diffTime, 'milliseconds').asMilliseconds();
//         const interval = setInterval(()=>{
//             duration = moment.duration(duration - 1000, 'milliseconds');
//             console.clear();
//             console.log(duration.format(formatTime))
//             if (duration.seconds() < 0) {
//                 clearInterval(interval);
//             }
//         }, 1000);
//         arrIntervals.push(interval);
//     }
//     timer(bindTime);
// }
// if(input === 'clearIntervals') {
//     arrIntervals.map(i=>{
//         clearInterval(i)
//     })
// }
// });


// оставил нерабочий вариант генератора
// fs.exists(pathRoot, () => {
//     // const writeStream = fs.createWriteStream(pathRoot, {flags: 'a', encoding: 'utf8'});
//
//     do {
// 	console.clear(); // console.log(Math.round(fs.statSync(pathRoot).size)); // pushArray(); //
// 	// writeStream.write(stringGenerator() + '');
// 	// Без стрима //
// 	fs.writeFileSync(pathRoot, stringGenerator(), {
// 		flag: 'a',
// 		encoding: 'utf-8'
// 	    }
// 	)
// // Решил сделать синхронно, чтобы виден был процесс
// 	// fs.writeFile(pathRoot, str, {flag: 'a', encoding: 'utf-8'}, (err) => console.log(err))
//     } while (fs.statSync(pathRoot).size < 104857600)
//     // writeStream.end(() => console.log('File writing finished'));
// })