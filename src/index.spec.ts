import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';
import makeServiceWorkerEnv from 'service-worker-mock';

beforeAll(() => {
	enableFetchMocks();
	// mock out the redirections file
	jest.mock('../data/redirections.json', () => [], { virtual: true });
});
beforeEach(() => {
	Object.assign(global, makeServiceWorkerEnv());
	(fetch as FetchMock).resetMocks();
	jest.resetModules();
	jest.clearAllMocks();
});

test('register fetch listener', () => {
	require('./index');

	expect(listeners.has('fetch')).toBe(true);
});

test('trigger fetch event', async () => {
	// mock handler
	const handlerMock = jest.fn(async () => Promise.resolve(new Response()));
	jest.mock('./handler', () => handlerMock);
	// require the file
	require('./index');

	// trigger event
	await self.trigger('fetch', new Request(''));
	expect(handlerMock).toHaveBeenCalled();
});
