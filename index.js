process.on('uncaughtException', (err) => {
    console.error('uncaughtException Err ', err);
});

process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection Err ', err);
});

const container = require('./di/index');
const server = require('./server');

server(container).then((app) => {
    const {port} = container.resolve('config');
    if(!port){
        console.log(`port is missing`)
        return;
    }

    const finalApp = app.listen(port, () => {
        console.log(`server is up and running at ${port}`);
    })
});