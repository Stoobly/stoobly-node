# Stoobly Node.js library

The Stoobly Node library provides convenient access to [stoobly-agent](https://github.com/Stoobly/stoobly-agent) API.

## Requirements

Node 14 or higher.

## Installation

Install the package with:

```sh
npm install stoobly-node --save
```

## Usage

```js
const { default: Stoobly } = require('stoobly');
```

Or using ES modules:

```js
import Stoobly from 'stoobly';
```

## Configuration

### Setting a scenario

```js
const stoobly = new Stoobly();

stoobly.config.scenario.set(<SCENARIO-KEY>)
    .then(res => console.log(res.data));
    .catch(error => console.error(error));
```
