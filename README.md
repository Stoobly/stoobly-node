# Stoobly Node.js library

The Stoobly Node library provides convenient access to [stoobly-agent](https://github.com/Stoobly/stoobly-agent) API.

## Requirements

Node 14 or higher.

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

Configures requests to https://docs.stoobly.com to specify a scenario. sessionId defaults to current time.

```js
const stoobly = new Stoobly();

const sessionId = stoobly.applyScenario('<SCENARIO-KEY>', { origins: ['https://docs.stoobly.com'] });
```

Configures requests to https://docs.stoobly.com  specify a scenario and resume a session.

```js
const stoobly = new Stoobly();

stoobly.applyScenario('<SCENARIO-KEY>', { sessionId: '<SESSION-ID>' });
```
