# Stoobly Node.js library

The Stoobly Node library provides convenient access to [stoobly-agent](https://github.com/Stoobly/stoobly-agent) API.

## Requirements

Node 12 or higher.

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

## Examples

### Setting a scenario

Configures outgoing requests to specify a scenario to use. sessionId defaults to current time

```js
const stoobly = new Stoobly();

stoobly.useScenario('<SCENARIO-KEY>');
```

Configures outgoing requests to specify a scenario and sessionId to use

```js
const stoobly = new Stoobly();

stoobly.useScenario('<SCENARIO-KEY>', { sessionId: '<SESSION-ID>' });

```
