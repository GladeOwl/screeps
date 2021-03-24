var gulp = require('gulp');

//Define your paths to deploy
const SCREEPSPATH1 = "/home/glade/.config/Screeps/scripts/screeps_demannu_com___21025/default";

//Copies all js Files from scripts to SCREEPSPATH1
gulp.task('deploy_1', function () {
    gulp.src('scripts/*.js')
        .pipe(gulp.dest(SCREEPSPATH1));
    console.log(`Trasnfer finished.`);
    return;
});
