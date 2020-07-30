'use strict';

let {workerData, parentPort} = require('worker_threads');

console.log(workerData);

parentPort.postMessage('done');