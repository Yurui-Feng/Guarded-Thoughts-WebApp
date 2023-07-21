# Guarded Thoughts

Guarded Thoughts is a web application where users can share their thoughts securely and anonymously. The application uses Google OAuth for authentication and allows users to post their secrets only when they are logged in.

## Prerequisites
You need to have installed Node.js, NPM and MongoDB in your System.

## Setting Up
* To download the project, clone the repository in your local system.
* Install the dependencies using
```shell
npm install
```
* Set up environment variables:
  
Create a new file in the root directory of the project named ".env" and insert your own values:
```
SECRET=YOUR_SECRET
CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
```
* To run the application:
```shell
node app.js
```

## Features
* Google OAuth Sign-In
* Local Authentication (Login/Registration)
* Session Handling
* Route Protection
* Anonymous Secret Submission

## Packages Used
* [express](https://www.npmjs.com/package/express)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [ejs](https://www.npmjs.com/package/ejs)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [express-session](https://www.npmjs.com/package/express-session)
* [passport](https://www.npmjs.com/package/passport)
* [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose)
* [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20)
* [mongoose-findorcreate](https://www.npmjs.com/package/mongoose-findorcreate)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

**Happy Coding!**