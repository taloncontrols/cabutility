interface IUrlGeneratorParams {
    [key: string]: string;
}

export interface IRouting {
    path: string;
    children?: {
        [key: string]: IRouting;
    };
}
const routes: IRouting = {
    path: '',
    children: {
        home: {
            path: '/',
        },
        login: {
            path: '/login',
        },
        keypad: {
            path: '/keypad',
        },
        cabinet: {
            path: '/cabinet',
        },
        users: {
            path: '/users',
            children: {
                create: {
                    path: '/create',
                },
                user: {
                    path: '/:user',
                    children: {
                        edit: {
                            path: '/edit',
                        },
                    },
                },
            },
        },
        roles: {
            path: '/roles',
            children: {
                create: {
                    path: '/create',
                },
                role: {
                    path: '/:role',
                    children: {
                        edit: {
                            path: '/edit',
                        },
                    },
                },
            },
        },
    },
};

function getRoute(routeObject: IRouting, path: string[]): string {
    if (!path.length || !routeObject.children) {
        return routeObject.path;
    }
    const step = path[0];
    const rest = path.slice(1);

    if (!routeObject.children[step]) {
        return routeObject.path;
    }

    return routeObject.path + getRoute(routeObject.children[step], rest);
}

// Fill any url with params
export function fillUrlWithParams(url: string, params: IUrlGeneratorParams): string {
    let generatedUrl = url;
    for (const paramsKey in params) {
        generatedUrl = generatedUrl.replace(`:${paramsKey}`, params[paramsKey]);
    }

    return generatedUrl;
}

export function getUrl(path: string, params?: IUrlGeneratorParams): string {
    const parts = path.split('.');

    const url = getRoute(routes, parts);
    if (!params) {
        return url;
    }

    return fillUrlWithParams(url, params);
}
