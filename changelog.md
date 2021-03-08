## Changes from 0.0.10 to 0.0.11
I noticed some packages not exporting properly/ in a standardized way

npm package|0.0.10|0.0.11|what
--- | --- | --- | ---
|core-js|❌|✅|repo contains `.git`
|quasar|❌|✅|repo contains `.git` + `git+https://`
|vue-property-decorator|❌|✅|repo contains `.git` + `git+https://`
|vue-geolocation-api|❌|✅|repo contains `github:` + description=`undefined`
|@types/node|❌|✅|author=`undefined`
|@typescript-eslint/eslint-plugin|❌|✅|author=`undefined`
|@typescript-eslint/parser|❌|✅|author=`undefined`
|eslint-config-standard|❌|✅|repo contains `.git` + `git://github.com`
|workbox-webpack-plugin|❌|✅|repo without url