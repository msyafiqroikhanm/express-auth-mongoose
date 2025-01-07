const http = require('http');
const app = require('./app');

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
require('dotenv').config();

const server = http.createServer(app);

server.listen(port, async () => {
    // eslint-disable-next-line no-console
    console.log(
        `${process.env.APP_NAME} running on  url: ${
            process.env.BASE_URL
        }, environment: ${process.env.NODE_ENV.toUpperCase()}`
    );

    if (process.env.NODE_ENV === 'production') {
        await metaBroadcastSynchronize();
    }
});
