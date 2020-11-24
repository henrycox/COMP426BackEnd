# COMP426BackEnd

API Documentation:

  Create User:
    Purpose: to create a new user
    Endpoint: POST /createUser
 
  
  Login:
  Purpose: to login a user
  Endpoint: POST /login
  
  Logout:
    Purpose: to logout a user
    Endpoint: GET /logout
  
  Delete User:
    Purpose: delete a user from the users database and delete their information from the UserData database
    Endpoint: DELETE /user
  
  Get User Personal Info:
    Purpose: retrieve the information stored in the user's login
    Frontend function: allows use of Civic Information API to retrieve user-specific representatives
    Endpoint: GET /userPersonalInfo
 
 Update Affiliation:
    Purpose: update the political affiliation of the user
    Function: after the alignment quiz is taken, the user's political affiliation is set to the result of their quiz
    Endpoint: PUT /updateAffiliation
  
  Update Password:
    Purpose: update the password of the user
    Endpoint: PUT /updatePassword
  
  Post Poll Results:
    Purpose: update the stored poll data
    Function: after the poll is taken, the frontend will use this endpoint to register that user's votes with the poll data
    Endpoint: POST /pollEntry
    
  Get Poll Results:
    Purpose: to retrieve stored poll data
    Function: return the stored poll results so they can be rendered on the front end
    Endpoint: GET /pollResults
    
  Store User Data:
    Purpose: to store a user's frontend specific data
    Function: stores a user's likelihood to vote and notes for each candidate
    Endpoint: POST /userData
    
  Update User Data:
    Purpose: to update a user's frontend specific data
    Function: allows the frontend to save changes that the user makes to notes and likelihoods
   
  Get User Data:
    Purpose: to retrieve a user's frontend specific data
    Function: allows the frontend to display the user's specific notes and likelihoods for each candidate
  
  
  
    
  
