
# MultiSelectDropdown.js

[![CPOL v1.02 License](https://img.shields.io/badge/license-CPOL--1.02-blue.svg?style=flat-square)](https://github.com/bsara/multi-select-dropdown.js/blob/master/LICENSE.md)

[![NPM Package](https://img.shields.io/npm/v/multi-select-dropdown.svg?style=flat-square)](https://www.npmjs.com/package/multi-select-dropdown)&nbsp;
[![Bower Package](https://img.shields.io/bower/v/multi-select-dropdown.svg?style=flat-square)](http://bower.io/search/?q=multi-select-dropdown)

[![Gitter Chat](https://badges.gitter.im/JOIN%20CHAT.svg)](https://gitter.im/bsara/multi-select-dropdown.js)


Support for a multiple selection dropdown using fully native JavaScript, CSS, and HTML (no extra libraries needed).

Includes support for AMD, CommonJS, and global inclusion via an HTML script tag.

See [**Live Demo**][demo]


## Install

- **NPM:** `$ npm install --save multi-select-dropdown`
- **Bower:** `$ bower install --save multi-select-dropdown`
- [**Download**](https://github.com/bsara/multi-select-dropdown.js/releases)



## Features

- Built with fully native, pure JavaScript! No extra libraries needed.
- Uses native HTML5 `select` and `option` elements. (I.E. It won't mess up your existing styles and won't create a million new elements that you don't expect to be present on a page).
- Uses overridable CSS for all needed style manipulations. (I.E. No manipulation of `style` attribute on HTML tags!)
- Nearly everything is done for you! Just set the correct data attributes, and you're done!
- "Select All Options" feature built in, no extra work needed.
- SCSS library provided for easier style overrides.
- Simple manager provided in case you just want to initialize for all desired elements on a page, rather than initializing support one by one.
- Super lightweight.
- Very easy to use.
- Support for...
    - AMD
    - CommonJS
    - Global HTML script tag



## Screenshots

#### Native Select Box Used

![screenshot 0](https://github.com/bsara/multi-select-dropdown.js/raw/master/screenshots/msd_0.png "Native Select Box Used")

---

#### Checkbox For Each Option

![screenshot 1](https://github.com/bsara/multi-select-dropdown.js/raw/master/screenshots/msd_1.png "Checkbox For Each Option")

---

#### Select Label Updates Automatically

![screenshot 3](https://github.com/bsara/multi-select-dropdown.js/raw/master/screenshots/msd_3.png "Select Label Updates Automatically")

---

![screenshot 2](https://github.com/bsara/multi-select-dropdown.js/raw/master/screenshots/msd_2.png "Select Label Updates Automatically")

---

#### Built-in Select All Option

> **NOTE:** This feature can be turned off if not needed

![screenshot 4](https://github.com/bsara/multi-select-dropdown.js/raw/master/screenshots/msd_4.png "Built-in Select All Option")


<br/>
<br/>


# Documentation

- [**Live Demo**][demo]
- [**Changelog**](https://github.com/bsara/multi-select-dropdown.js/blob/master/CHANGELOG.md)


---


## Code Samples

- ___TODO___


---


## Including the Library in your Project

#### Include as AMD Module

```javascript
define([ 'multi-select-dropdown' ], function(MultiSelectDropdown) {
  MultiSelectDropdown.init();
  ...
});
```


#### Include as CommonJS Module

```javascript
var MultiSelectDropdown = require('multi-select-dropdown');

MultiSelectDropdown.init();
...
```


#### Include via HTML Script Tag

```html
<script type="text/javascript" src="multi-select-dropdown.min.js" />
<script type="text/javascript">
  MultiSelectDropdown.init();
  ...
</script>
```



[demo]: # "Demo"
