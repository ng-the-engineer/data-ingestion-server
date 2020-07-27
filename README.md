# Backend take-home exercise for Converge

The purpose of this exercise is to test your ability to build a basic data
ingestion server in node.js.

The Converge Platform ingests sensor data from our customers' sites (these
could be construction sites, factories, oil wells, etc.), does some processing
(including alerting users for anomalous values) on them, and stores them,
allowing them to be served from an HTTP API. This exercise will see you building
a basic version of the infrastructure required to do this.

## Part one: Data ingestion

The most basic requirement of the application is that it can ingest the data
from sensors, storing them in some form of persistent storage such that these
data can later be queried and retrieved. You will be expected to justify your
choice of persistent storage.

Sensors will send data over HTTP, by making a request to `PUT /data`, with the
following request body:

    {
        sensorId: string,
        time:     int,
        value:    float,
    }

This endpoint should exhibit the following behaviour:

* Return error 400 if the packet does not contain `sensorId`;
* Return error 400 if the packet does not contain `time`;
* Return error 409 if the packet is a duplicate  - `(sensorId, time)` pairings should
  be unique;
* Return 204 if the packet structure is valid, and the packet was successfully
  stored in the persistent storage.

## Part two: retrieving data

For these data to be useful, a client (e.g. a web app) must be able to query and
retrieve them. You should create an endpoint which allows a client to retrieve
data from a sensor. The endpoint should return suitable status codes, and the
body of the request should be returned as JSON. An example of a suitable
endpoint would be:

    GET /data

With parameters:

* `sensorId`: the sensor id for which to query data;
* `since`: a lower bound on the time of the data;
* `until`: an upper bound on the time of the data.

## Part three: threshold alerts

Often, customers want to know if something is wrong, and therefore your
application should have the ability to configure thresholds for individual
sensors which can send a message (e.g. via email or SMS) when that threshold is
tripped. For example, if the pressure on a fuel tank is too high it could
explode, or if a pipe is too cold it could burst.

## Requirements

The solution should be made available to us as a git repository (whether hosted
or merely in an archive is up to you). It should be installable and runnable
using the basic `npm` commands `npm install` and `npm start`.

## Included files

1. README.md (this file)
3. package.json

## Questions etc.

I am always happy to answer any questions you may have. Please email me at
<gideon@converge.io> if you need anything clarified.

---

## Plan

1. Define Node version, ES script version
2. Scaffold the route, controller, service
3. Implement integration test
4. Setup local database
5. Implement unit test
6. Implement save and get logic
7. Implement alert event listener
8. Discuss the solution 


### Project Structure


```
.
├── src                              (Root folder all source files)
│   ├── api-test
│   │   ├── get.spec.js              (API test for GET /data)
│   │   └── put.spec.js              (API test for PUT /data)
│   ├── events
│   │   ├── thresholdAlert.js        (Events registration)
│   │   └── thresholdAlert.spec.js   
│   ├── persistence
│   │   ├── model
│   │   │   └── sensorRecord.js      (Table registration)   
│   │   ├── schema
│   │   │   └── sensorRecord.js      (Schema)   
│   │   ├── scripts
│   │   │   └── sensorRecord.js      (Create table script)   
│   │   └── throughput
│   │   │   └── sensorRecord.js      (DynamoDB throughput setting)   
│   ├── routes
│   │   └── root.js                  (Route controller)
│   ├── services
│   │   ├── getSensorRecord.js       (Get sensor data service)
│   │   ├── getSensorRecord.spec.js
│   │   ├── monitor.js               (Monitor sensor data service)
│   │   ├── monitor.spec.js
│   │   ├── saveSensorRecord.js      (Save sensor data service)
│   │   └── saveSensorRecord.spec.js
│   ├── utils
│   │   ├── datetime.js              (UTC timestamp util)
│   │   ├── datetime.spec.js
│   │   ├── numeric.js               (Number range util)
│   │   └── numeric.spec.js
│   ├── app.js                       (App entry point)
│   └── config.js                    (App-wise config)
├── lib                              (Files compiled by Babel)
├── .babelrc                         (ES2015 config)
├── .eslintrc.json 
├── .gitignore                  
├── node_modules
├── package-lock.js
├── package.js                       (Node.js library management)
└── README.md
```


### Pre-requisite
This project uses node/12.18.3 and ES2015, the latest stable version when the project is being created.

#### Setup node.js app

1. Under root folder, run

```
$ npm install
```

2. To build the source, run command below. The source files will be compliled to the folder `lib`.

```
$ npm run build
```

#### Setup database

This implementation work with a local DynamoDB. To setup, please follow below steps.

1. [Install local DynamoDB](https://gist.github.com/ng-the-engineer/1f3b9bc61ab718ba36b9a6fe0b4f5289)

2. [Configure dummy AWS credential](https://gist.github.com/ng-the-engineer/e89b16e83c216b09d35d762b12878d31)

3. [(Optional) Setup DynamoDB GUI tool](https://gist.github.com/ng-the-engineer/7050636d63e3cdf3db6b0bea6dc5602a)

4. Run a script to create the table. You will see the message `Table is created successfully` when the table is created successfully.

```
# node ./lib/persistence/scripts/createTable.js
```

#### Start the Data Ingestion Server

```
$ npm start
```

#### Try out some scenarios

[A simple rule is defined to simulate the threshold alerts](https://github.com/ng-the-engineer/data-ingestion-server/blob/develop/src/config.js#L10)


| Alert           | Value      |
| --------------- |:----------:|
| LEVEL_ONE_ALERT | > 100      |
| LEVEL_TWO_ALERT | > 200      |


##### 1. Receive sensor data having value of 66.8

```
curl --location --request PUT 'localhost:8080/data' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sensorId": "12345678",
    "time": "2020-07-26T17:04:56.988Z",
    "value": 66.8
}'
```


Response 

```
{
    "status": "RECORD_SAVED",
    "record": {
        "value": 66.8,
        "time": "2020-07-26T17:04:56.988Z",
        "sensorId": "12345678"
    }
}
```

##### 2. Receive sensor data having value of 103.456

```
curl --location --request PUT 'localhost:8080/data' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sensorId": "12345678",
    "time": "2020-07-26T17:08:56.988Z",
    "value": 103.456
}'
```

Response

```
{
    "status": "RECORD_SAVED",
    "record": {
        "value": 103.456,
        "time": "2020-07-26T17:08:56.988Z",
        "sensorId": "12345678"
    }
}
```

In the server log, an `LEVEL_TWO_ALERT` was triggered
```
<-- PUT /data
Level Two Alert 103.456
--> PUT /data 200 17ms 108b
```

##### 3. Receive sensor data having value of 204.98

```
curl --location --request PUT 'localhost:8080/data' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sensorId": "12345678",
    "time": "2020-07-26T17:19:56.988Z",
    "value": 204.98
}'
```

Response

```
{
    "status": "RECORD_SAVED",
    "record": {
        "value": 204.98,
        "time": "2020-07-26T17:19:56.988Z",
        "sensorId": "12345678"
    }
}
```

In the server log, an `LEVEL_ONE_ALERT` was triggered

```
<-- PUT /data
Level One Alert! 204.98
--> PUT /data 200 15ms 107b
```

##### 4. If there is duplicated record (identical sensorId and time)

It results in the followed response

```
{
    "status": "FAIL_TO_SAVE",
    "message": "The conditional request failed"
}
```

### Notes for development

#### BDD

- The PUT /data endpoint is tested in `./lib/api-test/put.spec.js`
- The GET /data endpoint int tested in `./lib/api-test/get.spec.js`

1. Execute `npm run build` first because the tests is against build/ folder
2. Make sure the local DynamoDB is running 
3. Make sure the server is running
4. Run below command,

```
 $ npm run api-test
```

Test result

```
  API Test
    GET /data
      ✓ should return an array of sensor data (165ms)
      ✓ should return 422 if sensorId is missing
      ✓ should return 422 if since is missing
      ✓ should return 422 if until is missing

  API Test
    PUT /data
      ✓ should return status 204 if the input is valid (88ms)
      ✓ should return 400 if it does not contain sensorId
      ✓ should return 400 if it does not contain time
      ✓ should return 409 if data is duplicated (42ms)


  8 passing (316ms)


=============================== Coverage summary ===============================
Statements   : 87% ( 87/100 )
Branches     : 57.69% ( 15/26 )
Functions    : 100% ( 23/23 )
Lines        : 91.58% ( 87/95 )
================================================================================
```


Test results and coverage report is at `./coverage/lcov-report/index.html`

#### TDD

- The unit tests are tested against `src/` folder.
- mocha, chai, chai-as-promised, mocha-each, and chai-events are used

To run the test, run

```
$ npm run unit-test
```



```
➜  data-ingestion-server git:(develop) ✗ npm run unit-test

> converge-backend-exercise@0.2.1 unit-test /Users/anthonyng/Repo/Github-ng/data-ingestion-server
> nyc --reporter=lcov --reporter=text-summary mocha --require babel-register src/utils/*.spec.js --unhandled-rejections=strict



  Utils - datetime unit tests
    validateUTC
      ✓ return true if input is 2020-06-04T14:20:00.888Z
      ✓ return false if input is 2020-06-04
      ✓ return false if input is 2020-06-04T09:00
      ✓ return false if input is 2020-06-04 09:00:00.888Z
      ✓ return false if input is 2020-06-04T09:00:00.888
      ✓ return false if input is 2020-06-04T09:00:00:888Z
      ✓ return false if input is 2020-13-04T09:00:00.888Z
      ✓ return false if input is 2020-06-31T09:00:00.888Z
      ✓ return false if input is 2020-06-04T25:00:00.888Z
      ✓ return false if input is 2020-06-04T09:62:00.888Z
    validateSequence
      ✓ return true if 2020-07-30T14:20:00.888Z is earlier than 2020-07-30T14:30:00.888Z
      ✓ return false if 2020-07-30T14:20:00.888Z is earlier than 2020-07-30T14:10:00.888Z
      ✓ return false if 2020-07-30T14:20:00.888Z is earlier than 2020-07-30T14:20:00.888Z
      ✓ return Not valid UTC format if since is 2020-07-20 and until is 2020-07-30T14:30:00.888Z
      ✓ return Not valid UTC format if since is 2020-07-30T14:30:00.888Z and until is 2020-07-20
      ✓ return Not valid UTC format if since is 2020-07-30 and until is 2020-07-20

  Utils - numeric unit tests
    validateValue
      ✓ return true if value is 100
      ✓ return true if value is -999
      ✓ return true if value is 657
      ✓ return true if value is -362326363
      ✓ return true if value is 9007199254740991
      ✓ return false if value is 9007199254740992
      ✓ return true if value is -9007199254740991
      ✓ return false if value is -9007199254740992
      ✓ return false if value is abc
      ✓ return false if value is 233.9
      ✓ return false if value is -455


  27 passing (21ms)


=============================== Coverage summary ===============================
Statements   : 100% ( 50/50 )
Branches     : 100% ( 8/8 )
Functions    : 100% ( 14/14 )
Lines        : 100% ( 49/49 )
================================================================================
```

#### ESLint

```
$ npx eslint --init
```

```
$ npx eslint 'src/**/*.js'
```


#### Final thoughts

##### Database
I made an assumption for this project.

- The frequency of database WRITE is evenly distributed and the payload of each request/ response is small.
- The frequency of database READ surge in short time but not remain in long duration. The payload is large.

With below reasons, I ruled out relational database.

- Only a very few number of tables need to use in this app. It is unlikely to enforce the integrity between tables.
- The row-lock or table-lock mechanism in relational database is harmful instead of beneficial because it slow down the throughput of the WRITE access.
- The data structure of various sensors is less flexible to change compared to node.js server. Relational database schema does not favor changes, while NoSQL is designed for accepting changes.

There are a few popular NoSql database. I chose DynamoDB because:

- The volume of data for IoT scenario increase at high speed. The database need to scale out very often. Self-hosted solution is challenging to cope with scaling up without downtime.
- AWS is the most popular cloud platform. An AWS NoSql solution has synergy in the same ecosystem.

##### Event-driven design

I used event-driven design for the threshold alert with below reasons:

- By decoupling the save sensor record service with value monitor service, the PUT /data endpoint response quicker because the monitoring work is offloaded.
- No architectural change if the event-based mechanism will be replaced by a more scalable and high availability solution like Kafka or RabbitMQ.

##### Improvement 

Due to limited time, some minor issue should be fixed in future. 

- A nasty node dependency warning message is displayed in logs. It needs to be fixed.
- To built the API spec with Open API 3.0.
- A health endpoint should be added to capture metric information.


