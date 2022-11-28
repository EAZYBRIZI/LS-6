import gulp from 'gulp';
import browserSync from 'browser-sync';

import gulpsass from 'gulp-sass';
import sasscomp from 'sass';
const sass = gulpsass(sasscomp);

import concat from 'gulp-concat';
import cleancss from 'gulp-clean-css';

const bsInstance = browserSync.create();
const outputPath = './dist';

function browsersync() {
    bsInstance.init({
        server: { baseDir: outputPath },
        notify: false,
        online: false
    });
}

function pages() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function styles() {
    return gulp.src('app/style.scss')
        .pipe(sass())
        .pipe(gulp.dest(outputPath))
        .pipe(concat('style.min.css'))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function script() {
    return gulp.src('app/scripts/script.js')
    .pipe(gulp.dest(outputPath))
    .pipe(bsInstance.stream());
}

function images() {
    return gulp.src('app/images/*')
    .pipe(gulp.dest(outputPath + '/images'))
    .pipe(bsInstance.stream());
}

function startwatch() {
    gulp.watch('app/index.html').on('change', () => {
        pages();
        bsInstance.reload;
    });
    gulp.watch('app/**/*.scss').on('change', () => {
        styles();
        bsInstance.reload;
    });
    gulp.watch('app/scripts/script.js').on('change', () => {
        script();
        bsInstance.reload;
    });
    gulp.watch('app/images/*.*').on('change', () => {
        images();
        bsInstance.reload;
    });
}

const build = gulp.series(gulp.parallel(pages, styles, script, images));
const serve = gulp.series(build, gulp.parallel(browsersync, startwatch));

export {
    build,
    serve
}

export default build;