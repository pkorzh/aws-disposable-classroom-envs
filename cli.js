#!/usr/bin/env node

require('yargs')
	.commandDir('cmds')
	.demandCommand()
	.help()
	.epilog('Automate creation and destruction of a AWS instances for a training class')
	.argv;
