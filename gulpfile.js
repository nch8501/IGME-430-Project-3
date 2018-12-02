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

//Chat Bundle
gulp.task('chat', ()=>{
  gulp.src(['./client/chat.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('chatBundle.js'))
    .pipe(gulp.dest('./hosted'));
});

//ChatScreen Bundle
gulp.task('chatScreen', ()=>{
  gulp.src(['./client/chatScreen.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('chatScreenBundle.js'))
    .pipe(gulp.dest('./hosted'));
});

//Account Bundle
gulp.task('account', ()=>{
  gulp.src(['./client/account.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('accountBundle.js'))
    .pipe(gulp.dest('./hosted'));
});

//AccountPage Bundle
gulp.task('accountPage', ()=>{
  gulp.src(['./client/accountPage.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('accountPageBundle.js'))
    .pipe(gulp.dest('./hosted'));
});

//Login Bundle
gulp.task('login', ()=>{
  gulp.src(['./client/login.js', './client/helper.js'])
    .pipe(babel({
      presets: ['env', 'react']
  }))
    .pipe(concat('loginBundle.js'))
    .pipe(gulp.dest('./hosted'));
});

//Bundles to be hosted
gulp.task('js', ()=>{
  //Chat Bundle
  gulp.start('chat');

  //ChatScreen Bundle
  gulp.start('chatScreen');
  
  //Account Bundle
  gulp.start('account');
  
  //Account Page Bundle
  gulp.start('accountPage');
  
  //Login Bundle
  gulp.start('login');
});


gulp.task('lint', ()=>{
  return gulp.src(['./server/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('watch', ()=>{
	gulp.watch('./scss/style.scss',['sass']);
  
  //client bundles
  gulp.watch('./client/chat.js', ['chat']);
  gulp.watch('./client/chatScreen.js', ['chatScreen']);
  gulp.watch('./client/account.js', ['account']);
  gulp.watch('./client/accountPage.js', ['accountPage']);
  gulp.watch('./client/login.js', ['login']);
  gulp.watch('./client/helper.js',['js']);
  
  nodemon({ script: './server/app.js'
          , ext: 'js'
          , tasks: ['lint'] }) 
});



gulp.task('build', ()=>{ 
	gulp.start('sass');
  gulp.start('js');
  gulp.start('lint');
  
});