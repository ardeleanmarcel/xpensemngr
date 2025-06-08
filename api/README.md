# mye-APIs

## Local Development

<span style="color: orange;">**WARNING!**</span>
This _Local Development_ reference is **ONLY** if you want to work on the the API by itself!<br>
If you want to work on the entire project, refer to the [PROJECT LEVEL README](../README.md).

- Create `.env` file based on `.env.example` file
- Start development server with `npm run dev`

<br/>
<br/>

## Versioning & publishing

# Code style guide

## Error handling

- All errors should be thrown using an `HttpError` class instance. The arguments to be passed to the constructor
  should be taken from the `HTTP_ERR` constant.
- `HTTP_ERR` is a constant that documents all the various errors that the application throws. If the need
  arises for a new error type or message, it should be added to this constant.
- If adding a new error, make sure the `errorCode` key has a unique 6 digit value, beginning with the http error value.
  I.e. for an Http 404 error the value could be `404008`, if the error is the 8th 404 error added to `HTTP_ERR`.

# Production deployment

- Use `sudo bash` to skip permission issues.
- Use the `nohup npm run start &` command to launch a server process and keep it running.
- run `netstat -ntlp` to identify to process id (PID).
- run `kill <PID>` to kill the process if needed.

### TODO:

- [ ] Fix eslint script
- [ ] check for unused types in the model files
- [ ] remove all '*' from SELECT and RETURNING statements
