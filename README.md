# fofx-web

An input/output plugin for HTTP requests for [fofx](https://github.com/functzia/fofx)

- **type:** `"web"`
- **params (these go in your _plugins.json_):**
  - **port [int]** this is the port your server listens on (default: 9999)
- **input params (these go in your _nano.json_ input key)**:
  - **endpoint [string]** this will trigger on a request to http://localhost:\<port\>/api/\<endpoint\>
  - **response [bool]** should the nano's return value be forwarded as the request's response.
- **output params (these go in your _nano.json_ output key):**
  - **url [string]** send an HTTP request to this url when your nano is done.
  - **method [GET|POST]** Specify GET or POST method for the request. If using POST, the nano's return value is used as the request's JSON body.

## Sample _plugins.json_

```json
[
  {
    "name": "fofx-web",
    "params": {
      "port": 5000
    }
  }
]
```

## Sample _nano.json_

```json
{
  "input": {
    "type": "web",
    "endpoint": "foo",
    "response": true
  },
  "output": {
    "type": "web",
    "method": "POST",
    "url": "http://localhost:5000/api/bar"
  }
}
```
