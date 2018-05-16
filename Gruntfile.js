module.exports = function(grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    open: {
      dev: {
        path: 'http://localhost:1919'
      }
    },

    connect: {
      server: {
        options: {
          port: 1919,
          base: 'demo_docs/build',
          livereload: true
        }
      }
    },

    stylelint: {
      dev: {
        options: {
          failOnError: false
        },
        src: ['sass/**/*.scss']
      },
      
      build: ['sass/**/*.scss']
    },
    
    sass: {
      all: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'docs_italia_theme/static/css',
          ext: '.css'
        }]
      }
    },
    
    postcss: {
      dev: {
        options: {
          map: {
              inline: false,
              annotation: 'docs_italia_theme/static/css'
          },
          processors: [
            require('pixrem')(),
            require('autoprefixer')({browsers: 'last 2 versions'})
          ]
        },
        files: [{
          expand: true,
          cwd: 'docs_italia_theme/static/css',
          src: ['**/*.css'],
          dest: 'docs_italia_theme/static/css',
          ext: '.css'
        }]
      },
      
      build: {
        options: {
          map: {
              inline: false,
              annotation: 'docs_italia_theme/static/css'
          },
          processors: [
            require('pixrem')(),
            require('autoprefixer')({browsers: 'last 2 versions'}),
            require('cssnano')()
          ]
        },
        files: [{
          expand: true,
          cwd: 'docs_italia_theme/static/css',
          src: ['**/*.css'],
          dest: 'docs_italia_theme/static/css',
          ext: '.css'
        }]
      }
    },

    browserify: {
      dev: {
        options: {
          external: ['jquery'],
          alias: {
            'docs_italia_theme': './js/theme.js'
          }
        },
        src: ['js/*.js'],
        dest: 'docs_italia_theme/static/js/theme.js'
      },
      build: {
        options: {
          external: ['jquery'],
          alias: {
            'docs_italia_theme': './js/theme.js'
          }
        },
        src: ['js/*.js'],
        dest: 'docs_italia_theme/static/js/theme.js'
      }
    },

    exec: {
      build_sphinx: {
        cmd: 'sphinx-build demo_docs/source demo_docs/build'
      }
    },

    clean: {
      build: ["demo_docs/build"]
    },

    watch: {
      /* Compile sass changes into theme directory */
      sass: {
        files: [
          'sass/**/*.scss'
        ],
        tasks: ['sass']
      },
      /* Process css into theme directory */
      postcss: {
        files: [
          'docs_italia_theme/static/css/**/*.css'
        ],
        tasks: ['postcss:dev']
      },
      /* Changes in theme dir rebuild sphinx */
      sphinx: {
        files: ['docs_italia_theme/**/*', 'demo_docs/**/*.rst', 'demo_docs/**/*.py'],
        tasks: ['clean:build', 'exec:build_sphinx']
      },
      /* JavaScript */
      browserify: {
        files: ['js/*.js'],
        tasks: ['browserify:dev']
      },
      /* live-reload the demo_docs if sphinx re-builds */
      livereload: {
        files: ['demo_docs/build/**/*'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'stylelint:dev',
    'sass',
    'postcss:dev',
    'browserify:dev',
    'exec:build_sphinx',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'stylelint:build',
    'sass',
    'postcss:build',
    'browserify:build',
    'exec:build_sphinx'
  ]);
}
