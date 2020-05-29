# Welcome to cloudflare-redirector-worker 👋

![Version](https://img.shields.io/github/package-json/v/vabatta/cloudflare-redirector-worker)
![Node.js CI](https://github.com/vabatta/cloudflare-redirector-worker/workflows/Node.js%20CI/badge.svg)
![Prerequisite](https://img.shields.io/badge/node-10.x-blue.svg)
![Prerequisite](https://img.shields.io/badge/npm-6.x-blue.svg)
![Cloudflare worker](https://img.shields.io/badge/cloudflare-worker-F38020?logo=cloudflare)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![License: CC--BY--ND--4.0](https://img.shields.io/badge/license-CC--BY--ND--4.0-informational)](https://github.com/vabatta/cloudflare-redirector-worker/blob/master/LICENSE)

> Simple redirector tool. Integrated with Storyblok.

### 🏠 [Homepage](https://github.com/vabatta/cloudflare-redirector-worker#readme)

## Prerequisites

- node 10.x
- npm 6.x
- @cloudflare/wrangler ^1.8

## Install

You must have configured [@cloudflare/wrangler](https://github.com/cloudflare/wrangler#-config) before proceeding.

Install local dependencies.

```sh
npm install
```

Copy `.env.example` to a file for each environment you want to target (as described below) and fill it with the correct values.

## Cloudflare environments

- `development`
  - `DOTENV_CONFIG_PATH=.env ENVIRONMENT=development NODE_ENV=development`
- `staging`
  - `DOTENV_CONFIG_PATH=.env.staging ENVIRONMENT=staging NODE_ENV=production`
- `production`
  - `DOTENV_CONFIG_PATH=.env.production ENVIRONMENT=production NODE_ENV=production`

## Usage

Start local development server

```sh
npm run start
```

Synchronize `redirections.json` with Storyblok space

```sh
npm run sync
```

Build the library
NOTE: you may want to run `sync` before to sync the latest redirections

```sh
npm run build
```

Lint the code

```sh
npm run lint
```

Format the code

```sh
npm run format
```

## Publishing

Publish the worker to Cloudflare to a target environment. Without target env, default is `development`.

```sh
npm run publish[:env]
```

## Run tests

```sh
npm run test
```

## Author

👤 **vabatta**

- Github: [@vabatta](https://github.com/vabatta)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/vabatta/cloudflare-redirector-worker/issues). You can also take a look at the [contributing guide](https://github.com/vabatta/cloudflare-redirector-worker/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [vabatta](https://github.com/vabatta).

This project is [Creative Commons Attribution No Derivatives 4.0 International](https://github.com/vabatta/cloudflare-redirector-worker/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
