import time
from fabric.api import cd, env, lcd, local, put, run, sudo

def staging():
    env.hosts = ["ubuntu@54.154.57.97"]

def build():
    release = time.strftime("WadoWedo-%Y%m%d-%H%M%S")
    with lcd("/tmp/"):
        local("git clone --depth=1 git@github.com:jpetitcolas/wadowedo.git ./%s/" % (release))
    with lcd("/tmp/%s/" % release):
        local("touch `git rev-parse --short HEAD`")
        local("bower install --production")
        local("gulp build")
        local("tar -cf /tmp/%s.tgz --exclude=.git --gzip ." % (release))

    return release

def deploy():
    release = build()

    with cd("/home/ubuntu/wadowedo/"):
        put("/tmp/%s.tgz" % release, "/tmp/%s.tgz" % release)
        run("mkdir %s" % release)
        run("tar -xf /tmp/%s.tgz --gzip --directory %s" % (release, release))

    with cd("/home/ubuntu/wadowedo/%s/" % release):
        run("source /home/ubuntu/.profile")
        run("nvm use 0.11")
        run("/home/ubuntu/.nvm/current/bin/npm install --production")
        run("ln --force --no-dereference --symbolic `pwd` ../wadowedo")
        run("ls -s `pwd`/etc/supervisord.conf /etc/supervisor/conf.d/wadowedo.conf")

    sudo("supervisorctl restart wadowedo", shell = False)
