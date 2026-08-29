# MindCare NER — REST API Documentation

## Base URL: `http://localhost:3000/api`

### 1. Patients Endpoint
* **GET `/api/patients/:id`**
  * *Description:* Fetches full patient profile, dementia stage, battery status, and accessibility settings.
  * *Response 200:*
    ```json
    {
      "success": true,
      "data": {
        "id": "p_dhiren_01",
        "name": "Dhiren Borah",
        "age": 72,
        "location": "Guwahati, Assam",
        "primaryLanguage": "as",
        "dementiaStage": "Mild Cognitive Impairment",
        "caregiverName": "Priyanka Borah",
        "batteryLevel": 82,
        "isDeviceOnline": true
      }
    }
    ```

### 2. Cognitive Games & Sessions
* **GET `/api/games`**
  * *Description:* Retrieves available culturally rooted cognitive games.
* **POST `/api/games/sessions`**
  * *Description:* Submits a completed game session result with latency, accuracy, and score.

### 3. Reminders & Schedule
* **GET `/api/reminders`**
  * *Description:* Retrieves active reminders (medication, hydration, activities).
* **POST `/api/reminders/:id/complete`**
  * *Description:* Confirms medication or routine step with timestamp and verification state.

### 4. Offline Synchronization
* **POST `/api/sync`**
  * *Description:* Ingests batch delta sync queues accumulated during offline edge operation.
