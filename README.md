
I am onboard the tRpc hype.

What I like very much about tRpc is that it allows building a project where frontend and backend
code are in a single codebase. While this is not ideal for large-scale projects, it's the best
solution for small projects like company websites or personal sites with minimal backend needs. Only
one server process is needed to run both the frontend and backend which means less deployment costs.

With tRpc, API endpoints are called procedures and they're either a query or a mutation. A query
requires a client to send a GET HTTP request while a mutation requires a POST HTTP request. Unlike
in GraphQL where all requests go to a single enpoint like '/graphql', tRpc requests go to 
`/trpcBaseUrl/nameOfProcedure`. To ensure that client knows what to expect from the API, tRpc uses
the power of typescript to pass the types of API inputs and outputs from the server code to frontend code 
seamlessly without code-gen which makes it a bit more powerful than REST.

As a big fan of GraphQL myself, one feature that I would miss that tRPc does not have is allowing the client
to request for just the data it needs. Because there is no out-of-the box way to know the fields in a client
request, procedures have to do all the computations and database queries to respond the same way for each API call which
can be expensive sometimes.

