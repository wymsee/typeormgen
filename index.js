#!/usr/bin/env node

const dotenv = require('dotenv');
const Knex = require('knex');
const nconf = require('nconf');
const path = require('path');
const yargs = require('yargs');
const writeModel = require('./write-model');

nconf.argv(yargs.options({
    base: {
        alias: 'b',
        describe: 'Path to a file containing a class for the model to exend.  The class should be the default export'
    },
    host: {
        alias: 'h',
        describe: 'Database host url'
    },
    port: {
        alias: 'p',
        describe: 'Port the database is exposed on'
    },
    user: {
        alias: 'u',
        describe: 'Database username'
    },
    password: {
        describe: 'Database password'
    },
    configFile: {
        describe: 'Path to json config file'
    },
    envFile: {
        describe: 'Path to env file to be parsed by dotenv'
    },
    database: {
        alias: 'd',
        describe: 'Database name'
    },
    table: {
        alias: 't',
        describe: 'Table name to generate a model for',
        demand: true
    },
    model: {
        alias: 'm',
        describe: 'Model class name.  Will default to converting snake case table name to PascalCase'
    },
    moment: {
        describe: 'Use Date | Moment for the type for dates instead of just Date',
        boolean: true
    },
    rules: {
        alias: 'r',
        describe: 'Output a static rules function that returns basic joi validation rules',
        boolean: true
    },
    out: {
        alias: 'o',
        describe: 'Path to where model file will be written',
        demand: true
    },
    tabs: {
        describe: 'Use tabs instead of spaces',
        boolean: true
    },
    tabSize: {
        describe: 'Number of spaces to indent lines'
    }
}).help('help'));


if (nconf.get('envFile')) {
    console.log(nconf.get('envFile'));
    dotenv.config({ path: nconf.get('envFile') });
} else {
    dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
}

nconf.env({
    transform: function(obj) {
        if (obj.key === 'MYSQL_HOST') {
            obj.key = 'host';
        } else if (obj.key === 'MYSQL_PORT') {
            obj.key = 'port';
        } else if (obj.key === 'MYSQL_DATABASE') {
            obj.key = 'database';
        } else if (obj.key === 'MYSQL_USER') {
            obj.key = 'user';
        } else if (obj.key === 'MYSQL_PASSWORD') {
            obj.key = 'password';
        } else if (obj.key.indexOf('TYPEORMGEN_') !== 0) {
            return false;
        } else {
            obj.key = obj.key.slice(11).toLowerCase()
                .replace(/\_\w/g, sub => sub[1].toUpperCase());
        }

        return obj;
    }
});

const configFile = nconf.get('configFile');
if (configFile) {
    nconf.file(configFile);
} else {
    nconf.file({
        file: 'typeormgen.json',
        dir: __dirname,
        search: true
    });
}

nconf.defaults({
    tabSize: 4
});

if (!nconf.get('model')) {
    const table = nconf.get('table');
    let model = table.toLowerCase()
        .replace(/\_\w/g, sub => sub[1].toUpperCase());
    model = model[0].toUpperCase() + model.slice(1);
    nconf.set('model', model);
}

const knex = Knex({
    client: 'mysql',
    connection: {
        host: nconf.get('host'),
        port: nconf.get('port'),
        user: nconf.get('user'),
        password: nconf.get('password'),
        database: nconf.get('database')
    }
});

knex.raw(`DESCRIBE ${nconf.get('table')}`).then(([rows]) => {
    const info = {};
    rows.forEach(row => {
        const openIndex = row.Type.indexOf('(');
        info[row.Field] = {
            type: openIndex > -1 ? row.Type.slice(0, openIndex - row.Type.length): row.Type,
            length: parseInt(row.Type.slice(openIndex + 1, -1), 10),
            nullable: row.Null === 'YES'
        };
        if (info[row.Field].type === 'decimal') {
            info[row.Field].length += 1;
        }
    });
    try {
        writeModel(info, nconf);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    process.exit();
});
