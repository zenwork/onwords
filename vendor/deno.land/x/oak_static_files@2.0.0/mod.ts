import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

/**
 * Contains information on how to handle static routes
 */
interface Path {
    absolute: string;
    relative?: string;
}

/**
 * Contains information about an answer file
 */
interface File {
    route: string;
    content: string;
}

/**
 * Allows you to handle one or more static file paths
 */
class StaticRouter {
    /**
     * Router provided by oak
     */
    public readonly router = new Router();

    /**
     * @param paths Path List
     */
    constructor(private paths: Path[] = []) {}

    /**
     * Define a static route
     * @param path Contains information on how to handle static routes
     */
    public async statics(path: Path) {
        const files = await this.files(path);

        for (const { route, content } of files) {
            this.router.get(route, ({ response }) => {
                response.body = content;
            });
        }
    }

    /**
     * Return middleware that will do all the route processing that the router has been configured to handle.
     */
    public get routes() {
        return (async () => {
            for (const path of this.paths) {
                await this.statics(path);
            }

            return this.router.routes();
        })();
    }

    private async files(path: Path) {
        const files: File[] = [];

        for await (const entry of Deno.readDir(path.absolute)) {
            const absolute = this.join(path.absolute, entry.name);
            const relative = this.join(path.relative, entry.name);

            entry.isFile
                ? files.push({
                      route: relative,
                      content:  await Deno.readTextFile(absolute),
                  })
                : files.push(
                      ...(await this.files({
                          absolute,
                          relative,
                      }))
                  );
        }

        return files;
    }

    private join(path = "/", ...folders: string[]) {
        const url = folders.join("/");

        return path === "/" ? url : `/${url}`;
    }
}

export { StaticRouter };
