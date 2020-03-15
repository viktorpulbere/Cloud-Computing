# Cloud Computing, homework 2

# Video presentation: https://youtu.be/Cp0ztXg7fuA

-------------------------------------------------------------------------------
Create an application that provides a RESTFul API.
Observation: Is mandatory to use at least: GET, POST, PUT, DELETE. It is very
important to respect all additional requirements specified in the laboratory.

-------------------------------------------------------------------------------

Your API should communicate using either JSON or XML.
- You should provide two routes for each HTTP verb ( ex. GET can be applied
either on a resource or on a collection of resources - please refer to the table in
section Using HTTP Methods for RESTful Services).
- Its uniform interface should be “Resource-based” ( refer to What is REST?
section).
- Make sure you design your API to be intuitive and easy to use by naming your
resources in a logical manner ( refer to Resource Naming section)
- Make sure to respect the idempotence and safeness properties for the HTTP
verbs that have one or both ( refer to Idempotence of REST APIs)
- Make sure your API responds with the corresponding status codes for each
situation it reaches in the processing of a request ( ex. 200 - Ok, 404 - Not
Found, 500 - Internal Server Error etc.)
- For storing the resources, you must use a persistent storage (XML file or any
database of your choice)
- You have to create a POSTMAN ( https://www.getpostman.com/ ) collection
of requests for each call that can be made in your API, export it and commit it
on your repository alongside with your code. Students that have an API
without a prepared collection of requests will NOT be evaluated!
