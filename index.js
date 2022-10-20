import fs from 'fs';

const path = './storage/access.log';
function randomizer(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}
const stringGenerator = () => {
	const ip = `${randomizer(1,254)}.${randomizer(1,254)}.${randomizer(1,254)}.${randomizer(1,254)}`;
	const date = new Date(randomizer(1,Date.now()));
	const query = ['POST','GET'];
	const serverAnswer = ['200','404','500'];
	return `${ip} - - [${date} -0300] "${query[randomizer(0,query.length)]} /boo HTTP/1.1" ${serverAnswer[randomizer(0,serverAnswer.length)]} 0 "-" "curl/7.47.0"\n`;
};
while (fs.statSync(path).size < 104857600) {
	console.clear()
	console.log(Math.round(fs.statSync(path).size/(1024*1024)))
	fs.writeFileSync(path,stringGenerator(),{flag: 'a', encoding:'utf-8'})
	// fs.writeFile(path,stringGenerator(),{flag: 'a', encoding:'utf-8'}, (err)=>console.log(err))
}

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


