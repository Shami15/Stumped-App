export interface dataModel {
    "users": [{
        "id": number;
        "firstName": string;
        "lastName": string;
        "password": string;
        "email": string;
        "userName": string;
        "classes": [{ "id": number; }]

    }],

    "Class": [{
        "name": string;
        "teacher": string;
        "id": number;
        "students": [{ "id": number; }],
        "subject": string;
        "thumbnail": string;
        "questions": [{
            "id": string;
            "thumbnail": string;
            "topic": string;
            "user": number;
            "description": string;
            // "attachments": [];
            "comment": [{
                "user": string;
                "id": string;
                "text": string;
                // "attachments": [];
            }]
        }]
    }]
}
