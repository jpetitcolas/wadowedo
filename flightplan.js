var plan = require('flightplan');

plan.target('staging', {
    host: '54.154.57.97',
    username: 'ubuntu',
    agent: process.env.SSH_AUTH_SOCK
});

plan.remote(function(remote) {
    remote.log('Cloning project...');
    remote.exec('git pull origin master');

    remote.log('Install dependencies');
    remote.sudo('npm --production install');
    remote.sudo('bower install');

    remote.log('Restarting server');
    remote.sudo('ln -s `pwd`/etc/supervisord.conf /etc/supervisord/conf.d');
    remote.sudo('supervisorctl wadowedo restart');
});