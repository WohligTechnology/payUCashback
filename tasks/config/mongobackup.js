module.exports = function (grunt) {
    grunt.config.set('mongobackup', {
        dump: {
            options: {
                host: 'localhost',
                db: 'overdrive',
                out: './dump'
            }
        },
        restore: {
            options: {
                db: 'overdrive',
                host: 'localhost',
                drop: true,
                path: './dump/overdrive'
            }
        },
    });
    grunt.loadNpmTasks('mongobackup');
};