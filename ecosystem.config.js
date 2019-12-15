module.exports = {
  apps : [{
    name: 'iotfwjs-test',
    script: 'server/app.js',
    cwd: '/var/www/iotfwjs-test/source',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : 'localhost',
      ref  : 'origin/master',
      repo : 'git@github.com:desplega/iotfwjs.git',
      path : '/var/www/iotfwjs-test',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
