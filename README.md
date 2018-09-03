<!-- TITLE/ -->

<h1>@bevry/pluginloader</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/bevry/pluginloader" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/bevry/pluginloader/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@bevry/pluginloader" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@bevry/pluginloader.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@bevry/pluginloader" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@bevry/pluginloader.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/pluginloader" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/pluginloader.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/pluginloader#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/pluginloader.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

A class for loading, verifying, and creating plugins. Used by DocPad for years.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --save @bevry/pluginloader</code></li>
<li>Module: <code>require('@bevry/pluginloader')</code></li></ul>

<h3><a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>@bevry/pluginloader</code> aliases <code>@bevry/pluginloader/index.js</code> which uses <a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a> to automatically select the correct edition for the consumers environment</li>
<li><code>@bevry/pluginloader/source/index.js</code> is esnext source code with require for modules</li>
<li><code>@bevry/pluginloader/edition-node-0.10/index.js</code> is esnext compiled for node.js >=0.10 with require for modules</li></ul>

<!-- /INSTALL -->


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

    ``` javascript
    module.exports = functionn (BasePlugin) {
        return class MyPlugin extends BasePlugin {
            constructor (...args) {
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

    ``` javascript
    class BasePlugin {
        constructor () {
            console.log('hello from base plugin')
        }
    }
    const PluginLoader = require('@bevry/pluginloader')
    const pluginLoader = new PluginLoader({
        BasePlugin,
        pluginPath: require('path').resolve(__dirname, '..', 'myplugin')
    })
    ```

1. `cd ..`

Run the project:

1. `node myapp/index.js`


### Ecosystem

- [pluginclerk](https://github.com/bevry/pluginclerk) a project for fetching compatible plugins from the npm registry
- [docpad-baseplugin](https://github.com/docpad/docpad-baseplugin) the BasePlugin class that DocPad uses
- [docpad-plugintester](https://github.com/docpad/docpad-plugintester) testing helpers for DocPad plugins


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/pluginloader/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/pluginloader/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li>Benjamin Lupton</li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

No contributors yet! Will you be the first?

<a href="https://github.com/bevry/pluginloader/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2018+ Benjamin Lupton</li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
