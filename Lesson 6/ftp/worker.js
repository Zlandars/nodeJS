import { workerData, parentPort } from 'worker_threads';
import fs from "fs";

const readStream = fs.createReadStream(workerData[0], 'utf8');
let data = '';
readStream.on('data',(chunk)=>{
    let arrPath = workerData[1].split('/').filter(function (el) {
	return (el != null && el != "" || el === 0);
    });
    return data += `
	<body>
		<div style="display: flex; flex-direction:column;">
			<a href='${arrPath.length > 1 ? '/' : ''}${arrPath.slice(0,arrPath.length - 1).join('/')}/'><button>Back</button></a>
		</div>
		<p>${chunk}</p>
	</body>
    `;
});
readStream.on('end', ()=>{
    parentPort.postMessage({
	    data
    })
});

