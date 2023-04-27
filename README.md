# ODIT.Services - License Exporter

![npm](https://img.shields.io/npm/dt/@odit/license-exporter?logo=npm&style=for-the-badge)
![NPM](https://img.shields.io/npm/l/@odit/license-exporter?style=for-the-badge)
![npm](https://img.shields.io/npm/v/@odit/license-exporter?color=blue&label=Version&logo=npm&style=for-the-badge)
[![Build Status](https://ci.odit.services/api/badges/odit/license-exporter/status.svg?ref=refs/heads/main)](https://ci.odit.services/odit/license-exporter)
[![Node.js Package](https://github.com/odit-services/license-exporter/actions/workflows/npm-publish.yml/badge.svg?branch=v0.0.11)](https://github.com/odit-services/license-exporter/actions/workflows/npm-publish.yml)

A simple license exporter that crawls your package.json and provides you with information about your dependencies' licenses.
You can export this information into json(even prettyfied) and markdown.
We use this in our open source projects to credit the awesome work of other open source contributors.

## Install
Via yarn/npm:
```bash
yarn add @odit/license-exporter
# Or
npm i @odit/license-exporter
```

## CLI Usage

Export only your dependencies to json: `licenseexporter --json`
Export all dependencies to json: `licenseexporter --json --recursive`

Export only your dependencies to markdown: `licenseexporter --md`
Export all dependencies to markdown: `licenseexporter --md --recursive`

## Options
Arg | Description | Type | Default
| - | - | - | -
\-j, --json | Exports the license information into ./licenses.json as json. | flag/[boolean] | N/A
\-p, --pretty | Prettify the json output.|flag/[boolean] | N/A
\-m, --markdown | Exports the license information into ./licenses.md as markdown. | flag/[boolean] | N/A
\-r, --recursive | Include all of the dependencies' subdependencies. | flag/[boolean] | N/A
\-d, --depth | The depth for recursive subdependency resolution (1 = dependencies and subsependencies). Has to be used with --recursive | number | 1
\-o, --output | Output folder for the exports. | [string] | Current folder
\-i, --input | Path to the input folder containing your package.json and node_modules | [string] | Current folder
\-h, --help | Show help | flag/[boolean] | N/A
\-v, --version | Show version number | flag/[boolean] | N/A
