@REDIRECTOR
Feature: Handle incoming requests

	The handler is an entity that checks incoming requests against a given list of redirections and
	creates a temporary redirection to the same or an external host.

	Background: Domain of the website
		Given the domain name http://www.efacademy.com for all requests

	@AUTOMATED
	Scenario: Continue to the requested page when the redirections list is empty
		Given an empty list of redirections
		And a request to /resource
		When the request hits the handler
		Then it should not be redirected
		And it should continue to /resource

	@AUTOMATED
	Scenario: Continue to the requested page when there aren't redirections that match
		Given a redirection that matches /redirect
		And redirect to http://www.ef.com/academy/
		And a request to /resource
		When the request hits the handler
		Then it should not be redirected
		And it should continue to /resource

	@AUTOMATED
	Scenario: Redirect to an external page when a redirection is matched
		Given a redirection that matches /redirect
		And redirect to http://www.ef.com/academy/
		And a request to /redirect
		When the request hits the handler
		Then it should be redirected
		And it should go to http://www.ef.com/academy/

	@AUTOMATED
	Scenario: Redirect to an internal page when a redirection is matched
		Given a redirection that matches /old/redirect
		And redirect to /new/redirect
		And a request to /old/redirect
		When the request hits the handler
		Then it should be redirected
		And it should go to /new/redirect

	@AUTOMATED
	Scenario: Continue to the requested page when a redirection is matched but has skip set
		Given a redirection that matches /redirect
		And redirect to http://www.ef.com/academy/
		And is set to be skipped
		And a request to /redirect
		When the request hits the handler
		Then it should not be redirected
		And it should continue to /redirect

	@AUTOMATED
	Scenario: Redirect to the page when a redirection has no source specified
		Given a redirection that doesn't specify a pattern to match
		And redirect to http://www.ef.com/academy/
		And a request to /redirect
		When the request hits the handler
		Then it should be redirected
		And it should go to http://www.ef.com/academy/

	@AUTOMATED
	Scenario Outline: Redirect to a page by rewriting part of it when a redirection is matched
		Given a redirection that matches /blog/<category>-<post>-<author>
		And redirect to /blog/<author>/<category>/<post>
		And a request to /blog/<category>-<post>-<author>
		When the request hits the handler
		Then it should be redirected
		And it should go to /blog/<author>/<category>/<post>
		Examples:
			| category   | post                                           | author   |
			| news       | new-campus-in-california-2020                  | natheesa |
			| promotions | instagram-influencer-valen-talks-about-academy | elodie   |
			| true-story | why-you-should-not-postpone-your-work          | edward   |
