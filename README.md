<!-- TITLE/ -->

# @bevry/pluginloader

<!-- /TITLE -->

<!-- BADGES/ -->

<span class="badge-githubworkflow"><a href="https://github.com/bevry/pluginloader/actions?query=workflow%3Abevry" title="View the status of this project's GitHub Workflow: bevry"><img src="https://github.com/bevry/pluginloader/workflows/bevry/badge.svg" alt="Status of the GitHub Workflow: bevry" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@bevry/pluginloader" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@bevry/pluginloader.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@bevry/pluginloader" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@bevry/pluginloader.svg" alt="NPM downloads" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<br class="badge-separator" />
<span class="badge-discord"><a href="https://discord.gg/nQuXddV7VP" title="Join this project's community on Discord"><img src="https://img.shields.io/discord/1147436445783560193?logo=discord&amp;label=discord" alt="Discord server badge" /></a></span>
<span class="badge-twitch"><a href="https://www.twitch.tv/balupton" title="Join this project's community on Twitch"><img src="https://img.shields.io/twitch/status/balupton?logo=twitch" alt="Twitch community badge" /></a></span>

<!-- /BADGES -->

<!-- DESCRIPTION/ -->

A class for loading, verifying, and creating plugins. Used by DocPad for years.

<!-- /DESCRIPTION -->


## Usage

[Complete API Documentation.](http://master.pluginloader.bevry.surge.sh/docs/)

### Basics

Create your project:

1. `mkdir my-project`
1. `cd my-project`

Create your plugin:

1. `mkdir myplugin`
1. `cd myplugin`
1. `npm init`
1. `index.js` to:

    ```javascript
    module.exports = function (BasePlugin) {
        return class MyPlugin extends BasePlugin {
            constructor(...args) {
                super(...args)
                console.log('hello from my plugin')
            }
        }
    }
    ```

1. `cd ..`

Create your plugin loader:

1. `mkdir myapp`
1. `cd myapp`
1. `npm init`
1. `index.js` to:

    ```javascript
    import PluginLoader from '@bevry/pluginloader'

    class BasePlugin {
        constructor() {
            console.log('hello from base plugin')
        }
    }

    const pluginLoader = new PluginLoader({
        BasePlugin,
        pluginPath: require('path').resolve(__dirname, '..', 'myplugin'),
    })
    ```

1. `cd ..`

Run the project:

1. `node myapp/index.js`

### Ecosystem

-   [pluginclerk](https://github.com/bevry/pluginclerk) a project for fetching compatible plugins from the npm registry
-   [docpad-baseplugin](https://github.com/docpad/docpad-baseplugin) the BasePlugin class that DocPad uses
-   [docpad-plugintester](https://github.com/docpad/docpad-plugintester) testing helpers for DocPad plugins

<!-- INSTALL/ -->

## Install

### [npm](https://npmjs.com "npm is a package manager for javascript")

-   Install: `npm install --save @bevry/pluginloader`
-   Import: `import * as pkg from ('@bevry/pluginloader')`
-   Require: `const pkg = require('@bevry/pluginloader')`

### [Deno](https://deno.land "Deno is a secure runtime for JavaScript and TypeScript, it is an alternative for Node.js")

``` typescript
import * as pkg from 'https://unpkg.com/@bevry/pluginloader@^5.2.0/edition-deno/index.ts'
```
### [Editions](https://editions.bevry.me "Editions are the best way to produce and consume packages you care about.")

This package is published with the following editions:
-   `@bevry/pluginloader` aliases `@bevry/pluginloader/index.cjs` which uses the [Editions Autoloader](https://github.com/bevry/editions "You can use the Editions Autoloader to autoload the appropriate edition for your consumers environment") to automatically select the correct edition for the consumer's environment
-   `@bevry/pluginloader/source/index.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") source code with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `@bevry/pluginloader/edition-es2022/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2022](https://en.wikipedia.org/wiki/ES2022 "ECMAScript 2022") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 12 || 14 || 16 || 18 || 20 || 21 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `@bevry/pluginloader/edition-es2016/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2016](https://en.wikipedia.org/wiki/ES2016 "ECMAScript 2016") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 6 || 8 || 10 || 12 || 14 || 16 || 18 || 20 || 21 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `@bevry/pluginloader/edition-types/index.d.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled Types with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules

<!-- /INSTALL -->

<!-- HISTORY/ -->

## History

[Discover the release history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/pluginloader/blob/HEAD/HISTORY.md#files)

<!-- /HISTORY -->

<!-- BACKERS/ -->

## Backers

### Code

[Discover how to contribute via the `CONTRIBUTING.md` file.](https://github.com/bevry/pluginloader/blob/HEAD/CONTRIBUTING.md#files)

#### Authors

-   [Benjamin Lupton](https://balupton.com) — Accelerating collaborative wisdom.

#### Maintainers

-   [Benjamin Lupton](https://github.com/balupton) — Accelerating collaborative wisdom.

#### Contributors

-   [Benjamin Lupton](https://github.com/balupton) — [view contributions](https://github.com/bevry/pluginloader/commits?author=balupton "View the GitHub contributions of Benjamin Lupton on repository bevry/pluginloader")

### Finances

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

#### Sponsors

-   [Andrew Nesbitt](https://nesbitt.io) — Software engineer and researcher
-   [Balsa](https://balsa.com) — We're Balsa, and we're building tools for builders.
-   [Codecov](https://codecov.io/) — Empower developers with tools to improve code quality and testing.
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Sentry](https://sentry.io) — Real-time crash reporting for your web apps, mobile apps, and games.
-   [Syntax](https://syntax.fm) — Syntax Podcast

#### Donors

-   [Andrew Nesbitt](https://nesbitt.io)
-   [Balsa](https://balsa.com)
-   [Chad](https://opencollective.com/chad8)
-   [Codecov](https://codecov.io/)
-   [entroniq](https://gitlab.com/entroniq)
-   [Jean-Luc Geering](https://github.com/jlgeering)
-   [Michael Duane Mooring](https://mdm.cc)
-   [Mohammed Shah](https://github.com/smashah)
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Sentry](https://sentry.io)
-   [ServieJS](https://github.com/serviejs)
-   [Skunk Team](https://skunk.team)
-   [Syntax](https://syntax.fm)

<!-- /BACKERS -->

<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

-   Copyright &copy; [Benjamin Lupton](https://balupton.com)

and licensed under:

-   [Artistic License 2.0](http://spdx.org/licenses/Artistic-2.0.html)

<!-- /LICENSE -->
