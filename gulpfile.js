var gulp   = require('gulp');
var concat = require('gulp-concat');

function buildScripts() {
    gulp.src([
        './public/js/spin.min.js',
        './public/js/ladda.min.js',
        './public/js/routing.js',
        './public/js/game.js',
        './public/js/player.js',
        './public/js/player.js',
        './public/js/buttons.js',
        './public/js/buttons.js',
        './public/js/chat.js',
        './public/js/tribe.js',
        './public/js/events.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/dist/js/'))
}


gulp.task('default', function () {
    'use strict';

    buildScripts();

    gulp.watch('public/js/**', buildScripts);
});

gulp.task('build', function () {
    'use strict';

    buildScripts();
});
