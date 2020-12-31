const fs = require('fs');
const packagecontents = JSON.parse(fs.readFileSync('./package.json'));
//
packagecontents.dependencies = Object.entries(packagecontents.dependencies);
packagecontents.devDependencies = Object.entries(packagecontents.devDependencies);
const all_dependencies = [].concat(packagecontents.dependencies, packagecontents.devDependencies);
let all = [];
(() => {
	all_dependencies.forEach((p) => {
		const packageinfo = JSON.parse(fs.readFileSync(`./node_modules/${p[0]}/package.json`, { encoding: 'utf-8' }));
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
	});
	fs.writeFileSync('./licenses.json', JSON.stringify(all));
})();
