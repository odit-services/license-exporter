#!/usr/bin/env node
'use strict';

const fs = require('fs');
const yargs = require('yargs');

const args = yargs
	.option('json', {
		alias: 'j',
		description: 'Exports the license information into ./licenses.json as json.',
		type: 'boolean',
	})
	.option('pretty', {
		alias: 'p',
		description: 'Prettify the json output.',
		type: 'boolean',
	})
	.option('markdown', {
		alias: 'm',
		description: 'Exports the license information into ./licenses.md as markdown.',
		type: 'boolean',
	})
	.option('recursive', {
		alias: 'r',
		description: 'Include all of the dependencies\' subdependencies.',
		type: 'boolean',
	})
	.option('depth', {
		alias: 'd',
		description: 'Resolve the dependencies of dependencies multiple levels down (defaults to 1)',
		default: 1,
		type: 'number',
	})
	.option('output', {
		alias: 'o',
		describe: 'Output folder for the exports (Default: Current folder).',
		type: 'string',
		default: '.'
	})
	.option('input', {
		alias: 'i',
		describe: 'Path to the input folder containing your package.json and node_modules (Default: Current folder).',
		type: 'string',
		default: '.'
	})
	.help()
	.alias('help', 'h')
	.alias('v', 'version')
	.argv;

function parsePackageInfo(path) {
	const packagecontents = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
	packagecontents.dependencies = Object.entries(packagecontents.dependencies || {});
	packagecontents.devDependencies = Object.entries(packagecontents.devDependencies || {});
	return packagecontents;
}

function mergeDependencies(packageInfo) {
	return [].concat(packageInfo.dependencies, packageInfo.devDependencies);
}

function extractPackageInfo(packageinfo, p){
	let licensetext = '';
	if (fs.existsSync(`${args.input}/node_modules/${p[0]}/LICENSE.md`)) {
		licensetext = fs.readFileSync(`${args.input}/node_modules/${p[0]}/LICENSE.md`, { encoding: 'utf-8' });
	}
	if (fs.existsSync(`${args.input}/node_modules/${p[0]}/LICENSE`)) {
		licensetext = fs.readFileSync(`${args.input}/node_modules/${p[0]}/LICENSE`, { encoding: 'utf-8' });
	}
	if (fs.existsSync(`${args.input}/node_modules/${p[0]}/LICENSE.txt`)) {
		licensetext = fs.readFileSync(`${args.input}/node_modules/${p[0]}/LICENSE.txt`, { encoding: 'utf-8' });
	}
	const info = {
		author: "?",
		repo: packageinfo.repository || packageinfo.repository?.url,
		description: packageinfo.description || "",
		name: packageinfo.name,
		license: packageinfo.license,
		version: packageinfo.version,
		licensetext
	};
	if (info.repo) {
		if (typeof info.repo === "object") {
			info.repo.url = info.repo.url.replace(/git\:\/\/github.com\//gi, "https://github.com");
			info.repo.url = info.repo.url.replace(/git\+https:\/\/github.com\//gi, "https://github.com/");
		}
		if (typeof info.repo === "string") {
			info.repo = {
				url: info.repo
			};
		}
		info.repo.url = info.repo.url.replace(/github:/gi, "https://github.com/");
		if (info.repo.url.includes("github.com")) {
			info.repo.url = info.repo.url.replace(/\.git/gi, "");
		}
	}
	if (packageinfo.author) {
		if (typeof packageinfo.author === "string") info.author = packageinfo.author;
		if (packageinfo.author.name) {
			info.author = packageinfo.author.name;
		}
	}
	if (packageinfo.homepage && packageinfo.repository) {
		if (typeof packageinfo.repository === "string") {
			if (packageinfo.homepage.toLowerCase().includes(packageinfo.repository.toLowerCase())) {
				info.repo = packageinfo.homepage;
			}
		}
	}
	return info;
}

function getDependencyLicenseInfo(all_dependencies, recursive, depth, alreadyParsed = []) {
	let all = [];

	all_dependencies.forEach((p) => {
		const packageinfo = parsePackageInfo(`${args.input}/node_modules/${p[0]}/package.json`);
		if(!alreadyParsed.includes(packageinfo.name)){
			const info = extractPackageInfo(packageinfo, p)
			all.push(info);
			alreadyParsed.push(packageinfo.name)
			if (recursive == true && depth > 0) {
				all.push(...getDependencyLicenseInfo(packageinfo.dependencies, recursive, depth - 1, alreadyParsed));
			}
		}
	});
	return all;
}
const packageInfo = parsePackageInfo(`${args.input}/package.json`);
const all = getDependencyLicenseInfo(mergeDependencies(packageInfo), args.recursive, parseInt(args.depth));

if (args.json) {
	if (args.pretty) {
		fs.writeFileSync((args.output + '/licenses.json'), JSON.stringify(all, null, 4));
	} else {
		fs.writeFileSync((args.output + '/licenses.json'), JSON.stringify(all));
	}
}
if (args.markdown) {
	fs.writeFileSync((args.output + '/licenses.md'), '');
	all.forEach((p) => {
		fs.appendFileSync(
			(args.output + '/licenses.md'),
			`# ${p.name}\n**Author**: ${p.author}\n**Repo**: ${p.repo?.url || p.repo}\n**License**: ${p.license}\n**Description**: ${p.description}\n## License Text\n${p.licensetext} \n\n`
		);
	});
} else {
	return all;
}
