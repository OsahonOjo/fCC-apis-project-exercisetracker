# Exercise Tracker Full-Stack Web App

### Project Description: 
This web app is a certification project for freeCodeCamp's Backend Development and APIs course. This app allows you to create a new user and add exercise data for that user in a MongoDB database hosted on MongoDB Atlas. The app also allows you to display all exercise data logs for a given user.

### Project Requirements:
1. You can POST to "/api/users" with form data "username" to create a new user.
2. The returned response from "POST /api/users" with form data "username" will be an object with "username" and "_id" properties.
3. You can make a GET request to "/api/users" to get a list of all users.
4. The GET request to "/api/users" returns an array.
5. Each element in the array returned from "GET /api/users" is an object literal containing a user's "username" and "_id".
6. You can POST to "/api/users/:_id/exercises" with form data "description", "duration", and optionally "date". If no "date" is supplied, the current date will be used.
7. The response returned from "POST /api/users/:_id/exercises" will be the user object with the exercise fields added.
8. You can make a GET request to "/api/users/:_id/logs" to retrieve a full exercise log of any user.
9. A request to a user's log "GET /api/users/:_id/logs" returns a user object with a "count" property representing the number of exercises that belong to that user.
10. A GET request to "/api/users/:_id/logs" will return the user object with a "log" array of all the exercises added.
11. Each item in the "log" array that is returned from "GET /api/users/:_id/logs" is an object that should have "description", "duration", and "date" properties.
12. The "description" property of any object in the "log" array that is returned from "GET /api/users/:_id/logs" should be a string.
13. The "duration" property of any object in the "log" array that is returned from "GET /api/users/:_id/logs" should be a number.
14. The "date" property of any object in the "log" array that is returned from "GET /api/users/:_id/logs" should be a string. Use the "dateString" format of the Date API.
15. You can add "from", "to" and "limit" parameters to a "GET /api/users/:_id/logs" request to retrieve part of the log of any user. "from" and "to" are dates in "yyyy-mm-dd" format. "limit" is an integer of how many logs to send back.

Your responses should have the following structures:<br>
Exercise:<br>
{<br>
&nbsp;&nbsp; username: "fcc_test",<br>
&nbsp;&nbsp; description: "test",<br>
&nbsp;&nbsp; duration: 60,<br>
&nbsp;&nbsp; date: "Mon Jan 01 1990",<br>
&nbsp;&nbsp; _id: "5fb5853f734231456ccb3b05"<br>
}

User:<br>
{<br>
&nbsp;&nbsp; username: "fcc_test",<br>
&nbsp;&nbsp; _id: "5fb5853f734231456ccb3b05"<br>
}

Log:<br>
{<br>
&nbsp;&nbsp; username: "fcc_test",<br>
&nbsp;&nbsp; count: 1,<br>
&nbsp;&nbsp; _id: "5fb5853f734231456ccb3b05",<br>
&nbsp;&nbsp; log: [{<br>
&nbsp;&nbsp;&nbsp;&nbsp; description: "test",<br>
&nbsp;&nbsp;&nbsp;&nbsp; duration: 60,<br>
&nbsp;&nbsp;&nbsp;&nbsp; date: "Mon Jan 01 1990",<br>
&nbsp;&nbsp; }]<br>
}

These details can also be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker