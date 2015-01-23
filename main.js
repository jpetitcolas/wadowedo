var koa = require('koa');
var koaStatic = require('koa-static'),
    port = 3000;

var app = module.exports = koa();

app.use(koaStatic(__dirname + '/public'));

// error catching
app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);

        if (!err.status) {
            console.error(err);
        }
    }
});

app.listen(port);
console.info('server listening on port ' + port);
console.info('Press CTRL+C to stop server');
