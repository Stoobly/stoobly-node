# Stoobly Node.js library

The Stoobly Node library provides convenient access to [stoobly-agent](https://github.com/Stoobly/stoobly-agent) API.

## Requirements

Node 18 or higher.

## Installation

Install the package with:

```sh
npm install stoobly-node --save-dev
```

## Usage

```js
const { default: Stoobly } = require('stoobly-node');
```

Or using ES modules:

```js
import Stoobly from 'stoobly-node';
```

## Examples

### Setting a scenario

Configures requests to origin https://docs.stoobly.com to specify a scenario. `sessionId` defaults to current time.

```js
const stoobly = new Stoobly();

const sessionId = stoobly.applyScenario('<SCENARIO-KEY>', { urls: [new RegExp('https://docs.stoobly.com/.*')] });
```

Configures requests to origin https://docs.stoobly.com to specify a scenario. Resume a session by specifying a `sessionId`.

```js
const stoobly = new Stoobly();

stoobly.applyScenario('<SCENARIO-KEY>', { urls: [new RegExp('https://docs.stoobly.com/.*')], sessionId: '<SESSION-ID>' });
```

Configures only requests https://docs.stoobly.com/use-cases and https://docs.stoobly.com/getting-started to specify a scenario.

```js
const stoobly = new Stoobly();

stoobly.applyScenario('<SCENARIO-KEY>', { 
    urls: [
        'https://docs.stoobly.com/use-cases',
        'https://docs.stoobly.com/getting-started'
    ]
});
```
