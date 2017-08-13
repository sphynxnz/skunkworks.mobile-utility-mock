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
- [ticket-serial-numbers-updated-dbb.xlsx](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/ticket-serial-numbers-updated-dbb.xlsx)

## Installation and Startup


### 1. Download or clone repository

```bash
git clone https://github.com/sphynxnz/skunkworks.instant-play-mock.git
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

This is a sample test run output [test-checker.out](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/test-checker.out) which contains ANSI escape codes for displaying colours in a terminal.

**2. Stores finder test**

Run test scenarios defined in **~/skunkworks.mobile-utility-mock/test/storesfinde.feature** by invoking the following command:

```bash
npm run test:finder
```

This is a sample test run output [test-stores.out](https://github.com/sphynxnz/skunkworks.mobile-utility-mock/blob/master/test-stores.out) which contains ANSI escape codes for displaying colours in a terminal.


| _EOD_ |
|---|