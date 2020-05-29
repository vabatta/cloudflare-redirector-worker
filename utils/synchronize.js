// import libs
const fs = require('fs');
const util = require('util');
const superagent = require('superagent');
const dotenv = require('dotenv');
const Listr = require('listr');

// promisify the fs utility
const writeFile = util.promisify(fs.writeFile);

const tasks = new Listr([
	{
		title: 'Loading .env file',
		task: () =>
			new Promise((resolve, reject) => {
				const { error } = dotenv.config({
					path: process.env.DOTENV_CONFIG_PATH
				});

				if (error) {
					reject(error);
				} else {
					resolve();
				}
			})
	},
	{
		title: 'Download redirections',
		task: ctx =>
			superagent
				.get(
					[
						process.env.SB_CONTENT_API,
						'stories',
						process.env.SB_REDIRECTOR_PATH
					].join('/')
				)
				.accept('json')
				.type('json')
				.query({
					// token to use
					token:
						process.env.ENVIRONMENT === 'production'
							? process.env.SB_PUBLIC_TOKEN
							: process.env.SB_PREVIEW_TOKEN,
					// version to get
					version:
						process.env.ENVIRONMENT === 'production' ? 'published' : 'draft',
					// invalidate cache
					cv: new Date().getTime()
				})
				.then(res => {
					ctx.story = res.body.story;
				})
	},
	{
		title: 'Write to disk',
		task: ctx => {
			// get redirections and clean them up
			const redirections = ctx.story.content.redirections.map(r => {
				// delete unnecessary fields
				// delete r._uid;
				delete r._editable;
				delete r.desc;
				delete r.component;

				// return mapped object
				return r;
			});
			// write the redirections out to `redirections.env.json` and to currently used
			return Promise.all([
				writeFile(
					`./data/redirections.${process.env.ENVIRONMENT ||
						'development'}.json`,
					JSON.stringify(redirections, null, '\t')
				),
				writeFile(
					'./data/redirections.json',
					JSON.stringify(ctx.story.content.redirections, null, '\t')
				)
			]);
		}
	}
]);

// run the tasks
tasks.run().catch(err => {
	// log error
	console.error(err);
	// and exit
	process.exit(1);
});
