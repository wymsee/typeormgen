# typeormgen
Generate typeorm models from your database tables

### Command Line Usage

```
Options:
--base, -b      Path to a file containing a class for the model to exend.  The
                class should be the default export
--host, -h      Database host url
--port, -p      Port the database is exposed on
--user, -u      Database username
--password      Database password
--configFile    Path to json config file
--envFile       Path to env file to be parsed by dotenv
--database, -d  Database name
--table, -t     Table name to generate a model for                  [required]
--model, -m     Model class name.  Will default to converting snake case table
                name to PascalCase
--moment        Use Date | Moment for the type for dates instead of just Date
                                                                     [boolean]
--rules, -r     Output a static rules function that returns basic joi
                validation rules                                     [boolean]
--out, -o       Path to where model file will be written            [required]
--tabs          Use tabs instead of spaces                           [boolean]
--tabSize       Number of spaces to indent lines
--help          Show help                                            [boolean]
```

### Config File Example

```
{
    "host": "localhost",
    "port": 3306,
    "user": "user",
    "password": "password",
    "database": "database",
    "rules": true,
    "moment": true,
    "tabSize": 2
}
```

### Environment Variable Configuration

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=database
MYSQL_USER=user
MYSQL_PASSWORD=password

TYPEORMGEN_HOST=localhost
TYPEORMGEN_CONFIG_FILE=/home/user/config.json
TYPEORMGEN_ANY_OPTION
```
