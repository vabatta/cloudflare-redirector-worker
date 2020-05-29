/**
 * This is a list of Hypertext Transfer Protocol (HTTP) response status codes.
 */
export const enum HTTP_STATUS {
	/**
	 * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
	 */
	FOUND = 302
}

/**
 * Respond with a HTTP/1.1 FOUND redirection to a different resource if the request matches one of the sources, otherwise forward the request to the origin server.
 */
export default async function handleRequest(
	request: Request,
	redirections: Redirection[]
): Promise<Response> {
	// get the request URL
	const requestURL = new URL(request.url);
	const { pathname } = requestURL;
	// check if the request URL matches one of the given patterns
	const redirection = redirections.find(
		r => !r.skip && new RegExp(r.src).exec(pathname)
	);
	// if a matching redirection is found
	if (redirection) {
		// replace location source with regular expressions groups
		const location =
			redirection.src === ''
				? redirection.dest
				: pathname.replace(new RegExp(redirection.src), redirection.dest);

		// redirect to the new location
		return new Response(null, {
			status: HTTP_STATUS.FOUND,
			headers: { Location: new URL(location, requestURL).href }
		});
	}

	// otherwise return the original request
	return fetch(request);
}
