# Patient Management System

## Overview
This project is a Patient Management System designed to facilitate the registration of patients and management of psychiatrists in hospitals.

## Libraries/Frameworks Used
- **Express.js**: Used for building the server-side application.
- **Mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment. Used for defining schemas and interacting with MongoDB.
- **Body-Parser**: Middleware for parsing incoming request bodies.

## API Endpoints

### Register Patient
- **URL**: `/register-patient`
- **Method**: POST
- **Description**: Endpoint for registering a new patient.
- **Request Body**:
  ```json
  {
      "name": "John Doe",
      "address": "123 Main St, Anytown, USA",
      "email": "johndoe@example.com",
      "phoneNumber": "1234567890",
      "password": "Password123",
      "patientPhoto": "https://example.com/john.jpg",
      "psychiatristId": 1
  }

### Get Psychiatrists by Hospital ID
- **URL**: `/hospital-psychiatrists`
- **Method**: GET
- **Description**: Endpoint to get psychiatrists by hospital ID.
- **Query Parameter**:
  - `hospitalId`: ID of the hospital
- **Response**:
  ```json
  {
      "hospitalName": "Hospital Name",
      "totalPsychiatristCount": 2,
      "totalPatientsCount": 10,
      "psychiatristDetails": [
          {
              "id": 1,
              "name": "Psychiatrist Name",
              "patientsCount": 5
          },
          {
              "id": 2,
              "name": "Another Psychiatrist",
              "patientsCount": 5
          }
      ]
  }
## Testing
- Postman collection: [Link to Postman Collection]( https://drive.google.com/file/d/18HTauvPVWTIYdrd-fuM7ipQKeL4Kyn0Y/view?usp=drive_link)

 