const fs = require('fs');

const args = process.argv.slice(2);
if(args.includes("--help")){
	console.log(`Arguments:
	--help: View this help page
	--recursive: Include all dependencies' subdependencies
	--json: Exports the license information into ./licenses.json as json
	--md: Exports the license information into ./licenses.md as markdown`);
}

function parsePackageInfo(path) {
	const packagecontents = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
	packagecontents.dependencies = Object.entries(packagecontents.dependencies || {});
	packagecontents.devDependencies = Object.entries(packagecontents.devDependencies || {});
	return packagecontents;
}

function mergeDependencies(packageInfo) {
	return [].concat(packageInfo.dependencies, packageInfo.devDependencies);
}

function getDependencyLicenseInfo(all_dependencies, recursive) {
	let all = [];

	all_dependencies.forEach((p) => {
		const packageinfo = parsePackageInfo(`./node_modules/${p[0]}/package.json`);
		let licensetext = '';
		if (fs.existsSync(`./node_modules/${p[0]}/LICENSE.md`)) {
			licensetext = fs.readFileSync(`./node_modules/${p[0]}/LICENSE.md`, { encoding: 'utf-8' });
		}
		if (fs.existsSync(`./node_modules/${p[0]}/LICENSE`)) {
			licensetext = fs.readFileSync(`./node_modules/${p[0]}/LICENSE`, { encoding: 'utf-8' });
		}
		if (fs.existsSync(`./node_modules/${p[0]}/LICENSE.txt`)) {
			licensetext = fs.readFileSync(`./node_modules/${p[0]}/LICENSE.txt`, { encoding: 'utf-8' });
		}
		const info = {
			author: packageinfo.author,
			repo: packageinfo.repository || packageinfo.repository.url,
			description: packageinfo.description,
			name: packageinfo.name,
			license: packageinfo.license,
			licensetext
		};
		all.push(info);
		if (recursive == true) {
			all.push(...getDependencyLicenseInfo(packageinfo.dependencies, true));
		}
	});
	return all;
}
const packageInfo = parsePackageInfo(`./package.json`);
const all = getDependencyLicenseInfo(mergeDependencies(packageInfo), args.includes("--recursive"));

if (args.includes("--json")) {
	if (args.includes("--pretty")) {
		fs.writeFileSync('./licenses.json', JSON.stringify(all, null, 4));
	}
	else {
		fs.writeFileSync('./licenses.json', JSON.stringify(all));
	}
}
if (args.includes("--md")) {
	fs.writeFileSync('./licenses.md', "");
	all.forEach((p) => {
		fs.appendFileSync("./licenses.md", `# ${p.name}\n**Author**: ${p.author}\n**Repo**: ${p.repo}\n**License**: ${p.license}\n**Description**: ${p.description}\n## License Text\n${p.licensetext} \n\n`)
	});
}
else {
	return all;
}