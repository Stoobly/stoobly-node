const fetchMock = require('jest-fetch-mock');
const { TextDecoder } = require('util');
const { TextEncoder } = require('util');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

fetchMock.enableMocks();