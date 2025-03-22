import Fastify from "fastify";
let PORT = 3000;
let origin = "";

process.argv.forEach((arg, index) => {
  if (arg == "--port") {
    PORT = parseInt(process.argv[index + 1]);
  } else if (arg == "--origin") {
    origin = process.argv[index + 1];
  }
});

const fastify = Fastify({
  logger: true,
});

const cacheMap = new Map<string, any>();

fastify.get("/", async (request, reply) => {
  const url = origin;
  console.log("bro ------- \n", cacheMap.has(url));
  console.log(cacheMap);
  if (cacheMap.has(url)) {
    const parsedWebPage = cacheMap.get(url);
    
    reply
      .headers(parsedWebPage.headers)
      .header("X-Cache", "HIT")
      .send(parsedWebPage.value);
  } else {
    const webpage = await fetch(url);
    const Headers = webpage.headers;
    const parsedWebPage = await webpage.text();
    const headersObj = Object.fromEntries(Headers);
    cacheMap.set(url, {value: parsedWebPage, headers: headersObj});
    reply
      .header("X-Cache", "MISS")
      .send(parsedWebPage);
  }
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
