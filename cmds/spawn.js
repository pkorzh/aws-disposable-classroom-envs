var fs         = require('fs');
var path       = require('path');
var Handlebars = require('handlebars');

exports.command = 'spawn';

exports.desc = 'Spawns N EC2 instances via CFN template. Registers each instance under Route53 hosted zone.';

exports.builder = {
	'hosted-zone': {
		describe: 'DNS name',
		default: 'domain.tld',
		required: true
	},
	'key-name': {
		describe: 'EC2 key pair',
		required: true,
		default: 'ec2'
	},
	'ami': {
		describe: 'Amazon Machine Image (AMI) id',
		required: true
	},
	'instance-type': {
		describe: 'Amazon EC2 Instance Type',
		required: true,
		default: 't2.micro',
		choices: [
			't2.nano',
			't2.micro',
			't2.small',
			't2.medium',
			't2.large',
			't2.xlarge',
			't2.2xlarge'
		]
	},
	'count': {
		describe: 'Number of EC2 instances to run',
		required: true,
		default: 1
	}
};

exports.handler = function (argv) {
	var template = Handlebars.compile(getTemplate(argv.add_to_slot));

	var result = template({
		hostedZone: argv['hosted-zone'],
		keyName: argv['key-name'],
		ami: argv['ami'],
		instanceType: argv['instance-type'],
		ec2s: Array.apply(null, {length: argv.count}).map(Number.call, Number)
	});

	console.log(result);
}

function getTemplate(add_to_slot) {
	return fs.readFileSync(path.join(__dirname, 'cfn-spawn.yaml'), 'utf8');
}