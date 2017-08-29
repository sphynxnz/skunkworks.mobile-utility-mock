# Mobile Utility Mock Service

## Overview
This is the mock for **_mobile utility service_** created from the original Soap UI mock built using ESI xml requests and responses that was used in the original ticket checker mobile application. The mock service exposes the following API calls:

|Resource | Description | API |
| --- | --- | --- |
| Validations | Check online or IK ticket serial number | POST /api/mobileutility/v1/validations |
| Stores | Fetch store locations and associated details |GET /api/mobileutility/v1/stores |

The mobile utility service exposes non-authorised service endpoints and do not require access token.

## Mock Implementation
The mock service was implementd using the **_node_**-based version of **_mountebank_**. See http://www.mbtest.org/ for more details on how it works.

The table below shows the complete list of software components used to implement the mock service. The list also includes the **_npm_** packages required to perform BDD tests using **_cucumber_**.

|Software | Description | 
| --- | --- |
| **_mountebank_** | **npm** package primarily used to build the mock service |
| **_cucumber_** | **npm** package for BDD testing |
| **_request-promise_** | **npm** package to provide **promise** support for http processing used in the BDD implementation |
| **_request_** | **npm** package required by **_request-promise_** |
| **_assert_** | **npm** package used in BDD implementation |
| **_moment_** | **npm** package used in BDD implementation |

## Mock Features
The mock service implementation is a simple static mapping of responses to the pre-defined _online_ and _IK_ ticket serial numbers with each serial number representing a specific ticket checking result scenario. The scenarios are exactly the same scenarios used in testing the original ticket checker mobile application. 

This is the spreadsheet containing the ticket checking scenarios used for this mock service. 
- [MobileCheckerSerialNumbers-20170819.xlsx](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/MobileCheckerSerialNumbers-20170819.xlsx)

> There are some scenarios where the **result** may have changed over time since the first mobile app implementation, but the **code** remained constant. This has to be further validated againts the production version of the mobile utility service.

## Installation and Startup


### 1. Download or clone repository

```bash
git clone https://github.com/sphynxnz/skunkworks.mobile-utility-mock.git
```

### 2. Install required npm packages

Change directory to the repository and install the required npm packages. 
```bash
npm install
```
Note that this implementation of the mock service using **_mountebank_** does not rely on _injection_ of external files so there is no need to install globally any dependent npm packages.

### 3. Start the mock service

```bash
npm run start:mobile-utility:mock
```

A successful startup will display something like this:
```bash
sphynxnz@lenovo-e520:~/GITHUB/skunkworks.mobile-utility-mock$ npm run start:mobile-utility:mock

> mobile-utility-mock@1.0.0 start:mobile-utility:mock /home/sphynxnz/GITHUB/skunkworks.mobile-utility-mock
> node ./node_modules/.bin/mb --configfile ./mobile-utility-imposter.json

info: [mb:2525] mountebank v1.12.0 now taking orders - point your browser to http://localhost:2525 for help
info: [mb:2525] PUT /imposters
info: [http:8000 mobile-utility-mock] Open for business...
```

## Dockerised Mock Service

A docker image can be created of the mock service. 

1. Install docker if not installed yet   
2. Change to the repository directory
3. Build docker image
```bash
docker build -t mobile-utility-mock .
```
4. Start docker instance of the mock service
```bash
docker run --name mobile-utility-mock -it -p 2525:2525 -p 8000:8000 mobile-utility-mock
```
> Port 2525 is mountebank's own internal port number and 8000 is the internal port number of the mobile utility mock service. The internal ports can be mapped to different external ports most appropriate for the installation as shown in the example below.
```bash
docker run --name mobile-utility-mock -it -p 5555:2525 -p 8888:8000 mobile-utility-mock
```

## Verifying the mock
To verify the mobile utility mock service, run the following tests:

**1. Ticket validation test**

Run test scenarios defined in **~/skunkworks.mobile-utility-mock/test/ticketchecker.feature** by invoking the following command:

```bash
npm run test:checker
```

or this command

```bash
npm run test:checker2
```
Both tests use the same set of test scenarios, except different representation in the gherkin coding of the BDD test scenarios.

[test-checker.out](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/test-checker.out) and [test-checker2.out](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/test-checker2.out) are sample output files for the ticket checking. The files contain ANSI escape codes for displaying colours in a terminal.

**2. Stores finder test**

Run test scenarios defined in **~/skunkworks.mobile-utility-mock/test/storesfinde.feature** by invoking the following command:

```bash
npm run test:finder
```

This is a sample test run output [test-finder.out](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/test-finder.out) which contains ANSI escape codes for displaying colours in a terminal.

## Generating Mock Responses File for Ticket Checking

The mock responses file for ticket checking was generated using the following tools:
+ mountebank
+ Soap UI
+ gen-imposter.js 

These are the steps to generate the ticket checking mock responses file using the tools above:

**Prerequisite**
The CAT2 mobile utility service on dnk1/2 must first be configured to point to the Soap UI ESI mock service that is currently hosted on 192.168.200.64 with the service endpoint at http://192.168.200.64:8088/esiwebservice?wsdl and runs this configuration file: [ESI-SW-Ticket-Validation-Only-soapui-project-ALIGN-20170823.xml](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/verification/ESI-SW-Ticket-Validation-Only-soapui-project-ALIGN-20170823.xml)

**1. Set up mountebank proxy**

1.1 Start mountebank by invoking the following command. This assumes that mountebank was not installed globally and is being invoked from where this package is installed.

```bash
node ./node_modules/.bin/mb
```

1.2 Set up mountebank proxy to capture request/responses to and from the mobile utility service in CAT2. The command below will listen for incoming requests at port 8000 and redirect those requests to the CAT2 mobile utility service listening at port 80 at the service endpoint http://192.168.102.196

```bash
curl -X POST \
  http://localhost:2525/imposters \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 0480c1ec-5491-c0ba-94bf-527d39b87d28' \
  -d '{
  "port": 8000,
  "protocol": "http",
  "name": "proxyAlways",
  "stubs": [
    {
      "responses": [
        {
          "proxy": {
            "to": "http://192.168.102.196",
            "mode": "proxyAlways",
            "predicateGenerators": [
              {
                "matches": {
                  "method": true,
                  "path": true
                }
              }, {
              	"matches": {
              	  "body": true
              	},
              	"jsonpath": {
              		"selector": "$..serialNumber"
              	}
              }
            ]
          }
        }
      ]
    }
  ]
}'
```

**2. Run test scenarios to generate requests/responses**

Run the ticket checking test scenarios defined in **~/skunkworks.mobile-utility-mock/test/ticketchecker.feature** by invoking the following command:

```bash
npm run test:checker
```

**3. Fetch the requests/responses saved by the mountebank proxy and save to a file**

The following command will fetch the requests/responses, display them on the terminal and save the output to the file [cat2-checker-capture.json](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/verification/cat2-checker-capture.json)

```bash
curl -X GET http://localhost:2525/imposters/8000 | tee cat2-checker-capture.json
```
**4. Generate the mountebank mock file (imposter)**

The following command will generate the mountebank ticket checker mock (imposter) using the data from the proxy and save the output to the file [cat2-checker-imposter.json](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/verification/cat2-checker-imposter.json)

```bash
node ./gen-imposter.js --in cat2-checker-capture.json --out cat2-checker-imposter.json
```

**5. Run the ticket checker mock using mountebank**

To use the mock service for ticket checking generated from the steps above, invoke the following command:

```bash
node ./node_modules/.bin/mb --configfile ./verification/cat2-checker-imposter.json
```

Once mountebank is up and running, run the ticket checking test scenarios as follows:
```bash
npm run test:checker
```
> **Note 1:** Running this test against the generated ticket checker mock service will result to three (3) failed scenarios as follows:

+ OL TICKET - INVALID_TICKET_NUMBER
+ OL TICKET - PAID_BY_EFT - Using SoapUI mock, simulates timeout
+ IK TICKET - BAD_UNIT_CHECK_DIGIT

> The current mobile utility service in CAT2 (which is exactly the same version as the one in production), has a bug and fails to handle online (OL) and IK invalid ticket scenario as listed above. It also fails to send the proper response message for timeout where the format of the message is slightly different from the standard results scenarios.

> **Note 2:** The mock service in this package supports both the ticket checking and stores finder. The mock file [mobile-utility-imposter.json](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/mobile-utility-imposter.json) contains both the ticket checking and stores finder mock requests and response. The stubs for the stores finder were generated in exactly the same way as the ticket checker using a nodejs implementation of the mobile utility service.

| _EOD_ |
|---|