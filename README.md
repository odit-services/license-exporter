# ODIT.Services - License Exporter

[![Build Status](https://ci.odit.services/api/badges/odit/license-exporter/status.svg?ref=refs/heads/main)](https://ci.odit.services/odit/license-exporter)

A simple license exporter that crawls your package.json and provides you with information about your dependencies' licenses.
You can export this information into json and markdown.

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

## Arguments
Arg | Description
-|-
`--help` | View the help dialog
`--recursive`| Include all dependencies' subdependencies
`--json` | Exports the license information into ./licenses.json as json
`--md` | Exports the license information into ./licenses.md as markdow