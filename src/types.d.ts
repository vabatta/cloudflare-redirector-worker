interface Redirection {
	src: string;
	dest: string;
	skip?: boolean;
}

declare module '*redirections.json' {
	const redirections: Redirection[];

	export default redirections;
}

declare module 'service-worker-mock/fetch' {
	const value: () => (req: Request) => Promise<Response>;

	export default value;
}
