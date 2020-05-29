/* eslint-disable @typescript-eslint/quotes */
import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';
import { defineFeature, loadFeature } from 'jest-cucumber';
import handleRequest from './handler';

const feature = loadFeature('./features/handler.feature');

defineFeature(feature, test => {
	// we expect all redirection to have HTTP/1.1 FOUND 302
	const REDIRECT_STATUS_CODE = 302;
	// we expect all response from the server to have HTTP/1.0 OK 200
	const CONTINUE_STATUS_CODE = 200;
	// Background of the feature
	const DOMAIN_NAME = 'http://www.efacademy.com';
	// simple helper to make urls
	const url = (path: string): string => `${DOMAIN_NAME}${path}`;

	// general tests setup
	beforeAll(() => enableFetchMocks());
	beforeEach(() => {
		(fetch as FetchMock).resetMocks();
		(fetch as FetchMock).mockResponse(async req =>
			Promise.resolve({
				status: CONTINUE_STATUS_CODE,
				url: req.url
			})
		);
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('Continue to the requested page when the redirections list is empty', ({
		given,
		and,
		when,
		then
	}) => {
		let redirections: Redirection[];
		given('an empty list of redirections', () => {
			redirections = [];
		});

		let request: Request;
		and('a request to /resource', () => {
			request = new Request(url('/resource'));
		});

		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should not be redirected', () => {
			expect(fetch as FetchMock).toHaveBeenCalledWith(request);
		});

		and('it should continue to /resource', () => {
			expect(response).toHaveProperty('status', CONTINUE_STATUS_CODE);
			expect(response.url).toBe(url('/resource'));
		});
	});

	test("Continue to the requested page when there aren't redirections that match", ({
		given,
		and,
		when,
		then
	}) => {
		const redirection: Partial<Redirection> = {};
		given('a redirection that matches /redirect', () => {
			redirection.src = '/redirect';
		});

		and('redirect to http://www.ef.com/academy/', () => {
			redirection.dest = 'http://www.ef.com/academy/';
		});

		const redirections: Redirection[] = [redirection as Redirection];
		let request: Request;
		and('a request to /resource', () => {
			request = new Request(url('/resource'));
		});

		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should not be redirected', () => {
			expect(fetch as FetchMock).toHaveBeenCalledWith(request);
		});

		and('it should continue to /resource', () => {
			expect(response).toHaveProperty('status', CONTINUE_STATUS_CODE);
			expect(response.url).toBe(url('/resource'));
		});
	});

	test('Redirect to an external page when a redirection is matched', ({
		given,
		and,
		when,
		then
	}) => {
		const redirection: Partial<Redirection> = {};
		given('a redirection that matches /redirect', () => {
			redirection.src = '/redirect';
		});

		and('redirect to http://www.ef.com/academy/', () => {
			redirection.dest = 'http://www.ef.com/academy/';
		});

		let request: Request;
		and('a request to /redirect', () => {
			request = new Request(url('/redirect'));
		});

		const redirections: Redirection[] = [redirection as Redirection];
		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should be redirected', () => {
			expect(fetch as FetchMock).not.toHaveBeenCalled();
		});

		and('it should go to http://www.ef.com/academy/', () => {
			expect(response).toHaveProperty('status', REDIRECT_STATUS_CODE);
			expect(response.headers.get('Location')).toBe(
				'http://www.ef.com/academy/'
			);
		});
	});

	test('Redirect to an internal page when a redirection is matched', ({
		given,
		and,
		when,
		then
	}) => {
		const redirection: Partial<Redirection> = {};
		given('a redirection that matches /old/redirect', () => {
			redirection.src = '/old/redirect';
		});

		and('redirect to /new/redirect', () => {
			redirection.dest = '/new/redirect';
		});

		let request: Request;
		and('a request to /old/redirect', () => {
			request = new Request(url('/old/redirect'));
		});

		const redirections: Redirection[] = [redirection as Redirection];
		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should be redirected', () => {
			expect(fetch as FetchMock).not.toHaveBeenCalled();
		});

		and('it should go to /new/redirect', () => {
			expect(response).toHaveProperty('status', REDIRECT_STATUS_CODE);
			expect(response.headers.get('Location')).toBe(url('/new/redirect'));
		});
	});

	test('Continue to the requested page when a redirection is matched but has skip set', ({
		given,
		and,
		when,
		then
	}) => {
		const redirection: Partial<Redirection> = {};
		given('a redirection that matches /redirect', () => {
			redirection.src = '/redirect';
		});

		and('redirect to http://www.ef.com/academy/', () => {
			redirection.dest = 'http://www.ef.com/academy/';
		});

		and('is set to be skipped', () => {
			redirection.skip = true;
		});

		let request: Request;
		and('a request to /redirect', () => {
			request = new Request('http://www.efacademy.com/redirect');
		});

		const redirections: Redirection[] = [redirection as Redirection];
		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should not be redirected', () => {
			expect(fetch as FetchMock).toHaveBeenCalled();
		});

		and('it should continue to /redirect', () => {
			expect(response).toHaveProperty('status', CONTINUE_STATUS_CODE);
			expect(response.url).toBe(url('/redirect'));
		});
	});

	test('Redirect to the page when a redirection has no source specified', ({
		given,
		and,
		when,
		then
	}) => {
		const redirection: Partial<Redirection> = {};
		given("a redirection that doesn't specify a pattern to match", () => {
			redirection.src = '';
		});

		and('redirect to http://www.ef.com/academy/', () => {
			redirection.dest = 'http://www.ef.com/academy/';
		});

		let request: Request;
		and('a request to /redirect', () => {
			request = new Request(url('/redirect'));
		});

		const redirections: Redirection[] = [redirection as Redirection];
		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should be redirected', () => {
			expect(fetch as FetchMock).not.toHaveBeenCalled();
		});

		and('it should go to http://www.ef.com/academy/', () => {
			expect(response).toHaveProperty('status', REDIRECT_STATUS_CODE);
			expect(response.headers.get('Location')).toBe(
				'http://www.ef.com/academy/'
			);
		});
	});

	test('Redirect to a page by rewriting part of it when a redirection is matched', ({
		given,
		and,
		when,
		then
	}) => {
		const redirection: Partial<Redirection> = {};
		given(
			/^a redirection that matches \/blog\/(.+)-(.+)-(.+)$/,
			(category: string, post: string, author: string) => {
				redirection.src = `/blog/${category}-${post}-${author}`;
			}
		);

		and(
			/^redirect to \/blog\/(.+)\/(.+)\/(.+)$/,
			(author: string, category: string, post: string) => {
				redirection.dest = url(`/blog/${author}/${category}/${post}`);
			}
		);

		let request: Request;
		and(
			/^a request to \/blog\/(.+)-(.+)-(.+)$/,
			(category: string, post: string, author: string) => {
				request = new Request(url(`/blog/${category}-${post}-${author}`));
			}
		);

		const redirections: Redirection[] = [redirection as Redirection];
		let response: Response;
		when('the request hits the handler', async () => {
			const handler: typeof handleRequest = require('./handler').default;
			response = await handler(request, redirections);
		});

		then('it should be redirected', () => {
			expect(fetch as FetchMock).not.toHaveBeenCalled();
		});

		and(
			/^it should go to \/blog\/(.+)\/(.+)\/(.+)$/,
			(author: string, category: string, post: string) => {
				expect(response).toHaveProperty('status', REDIRECT_STATUS_CODE);
				expect(response.headers.get('Location')).toBe(
					url(`/blog/${author}/${category}/${post}`)
				);
			}
		);
	});
});
