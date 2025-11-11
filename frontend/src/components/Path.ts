//const app_name = 'poosdboard.com'

export function buildPath(route: string): string {
	// @ts-ignore - Vite env variable
	const isDevelopment = import.meta.env?.DEV ?? false;
	
	if (!isDevelopment) {
		return `/${route}`;  //'http://' + app_name + ':5000/' + route;
	} else {
		return 'http://poosdboard.com:5000/' + route;
	}
}
