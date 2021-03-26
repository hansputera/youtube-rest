const fastify = require("fastify").default();
const youtube = require('scrape-youtube').default;

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (_, body, done) {
    try {
      var json = JSON.parse(body);
      done(null, json);
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
});


// "/" route.
fastify.route({
    method: "GET",
    url: "/",
    handler: (_, reply) => {
        reply.send('Hello world!');
    }
});

// "/search" route.
fastify.route({
    method: "GET",
    url: "/search",
    schema: {
        querystring:{
            q: { type: 'string' }
        }
    },
    preHandler: (req, reply, done) => {
        if (!req.query['q'] || !req.query['q'].length) return reply.send({
            error: 'Missing \'q\''
        });
        else done();
    },
    handler: async (request, reply) => {
        const results = await youtube.search(request.query['q']);
        return reply.send({
            error: null,
            data: results
        });
    }
});

fastify.listen(8000, (err, address) => {
    if (err) throw Error(err);
    else console.log('Address:', address);
});