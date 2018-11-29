const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');


gulp.task('sass', ()=>{
	gulp.src('./scss/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./hosted/'));
});



//Bundles to be hosted
gulp.task('client', ()=>{
  //Chat Bundle
  gulp.src(['./client/chat.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('chatBundle.js'))
    .pipe(gulp.dest('./hosted'));

  //ChatScreen Bundle
  gulp.src(['./client/chatScreen.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('chatScreenBundle.js'))
    .pipe(gulp.dest('./hosted'));
  
  //Account Bundle
  gulp.src(['./client/account.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('accountBundle.js'))
    .pipe(gulp.dest('./hosted'));
  
  //Login Bundle
  gulp.src(['./client/login.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('loginBundle.js'))
    .pipe(gulp.dest('./hosted'));
});


gulp.task('lint', ()=>{
  return gulp.src(['./server/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('watch', ()=>{
	
	gulp.watch('./scss/style.scss',['sass']);
	
  gulp.watch('./client/*.js',['client']);
  
  nodemon({ script: './server/app.js'
          , ext: 'js'
          , tasks: ['lint'] }) 
});



gulp.task('build', ()=>{ 
	gulp.start('sass');
  gulp.start('client');
  gulp.start('lint');
  
});