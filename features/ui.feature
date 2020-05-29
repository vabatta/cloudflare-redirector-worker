@REDIRECTOR
Feature: Storyblok UI for managing the redirections

	The redirection tool UI is available in our current CMS Storyblok. It allows to create redirections
	with the following information as input:
	- Skip: an optional flag that state if the following redirection should be taken into account
	- Source: a pattern which can be found anywhere in the resource URL with the leading slash
	- Destination: a pattern which replace or completely changes the source
	The pattern can be either a literal string or a simple regular expression which allows to replace
	the initial source.

	@MANUAL @TODO
	Scenario: See the current list of redirections

	@MANUAL @TODO
	Scenario: Change the order of redirections

	@MANUAL @TODO
	Scenario: Input a new redirection

	@MANUAL @TODO
	Scenario: Change an existing redirection

