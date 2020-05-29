// import redirector handler
import handleRequest from './handler';

// import the redirections from the static file
import file from '../data/redirections.json';

// force typecast to a known type
const redirections: Redirection[] = file;

// register redirector tool to incoming requests
self.addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request, redirections));
});
