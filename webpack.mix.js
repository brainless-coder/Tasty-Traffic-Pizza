let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'js').sass('resources/scss/app.scss', 'css').setPublicPath('public');
