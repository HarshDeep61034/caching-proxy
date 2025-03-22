var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Fastify from "fastify";
let PORT = 3000;
let origin = "";
process.argv.forEach((arg, index) => {
    if (arg == "--port") {
        PORT = parseInt(process.argv[index + 1]);
    }
    else if (arg == "--origin") {
        origin = process.argv[index + 1];
    }
});
const fastify = Fastify({
    logger: true,
});
const cacheMap = new Map();
fastify.get("/", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const url = origin;
    console.log("bro ------- \n", cacheMap.has(url));
    console.log(cacheMap);
    if (cacheMap.has(url)) {
        const parsedWebPage = cacheMap.get(url);
        reply
            .headers(parsedWebPage.headers)
            .header("X-Cache", "HIT")
            .send(parsedWebPage.value);
    }
    else {
        const webpage = yield fetch(url);
        const Headers = webpage.headers;
        const parsedWebPage = yield webpage.text();
        const headersObj = Object.fromEntries(Headers);
        cacheMap.set(url, { value: parsedWebPage, headers: headersObj });
        reply
            .header("X-Cache", "MISS")
            .send(parsedWebPage);
    }
}));
fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
