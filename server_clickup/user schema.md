user schema 
id,user,password
project 
id,projectname,description,team[{role,id}],owner,task,timestamp,status:active or not,duedate
task
userid,kanid,projectID,taskname,description,duedate,timestamp,status,assignees,priority,
comment 
 ,_id,commentarrayobj[{obj,userid,timestamp}],ticket_id,

old 

+-------------------+              +-------------------+              +--------------------+
|      User         |              |      Project      |              |       Task         |
+-------------------+              +-------------------+              +--------------------+
| - userId: String  |---+        +-| - projectId: String|---+        +-| - taskId: String   |
| - username: String|   |        | | - projectName: String|   |        | - kanId: String    |
| - password: String|   |        | | - description: String|   |        | - taskName: String |
|                   |   |        | | - team: [userId,role]  | |        | - description: String|
|                   |   |        | | - owner: userId      |   |        | - dueDate: Date     |
|                   |   |        | | - tasks: [taskId]    |   |        | - status: String    |
|                   |   |        | | - timestamps        |   |        | - assignees: [userId]|
|                   |   |        | +-------------------+   |        | - timestamps        |
+-------------------+   |        +-------------------+   |        +--------------------+
                        |                                |
                        |                                |
                        +--------------------------------+
                               |
                               |
                            +--------------------+
                            |      Team          |
                            +--------------------+
                            | - teamId: String   |
                            | - members: [userId]|
                            +--------------------+


NEW ER Daigram
+-------------------+              +-------------------+              +--------------------+
|      User         |              |      Project      |              |       Task         |
+-------------------+              +-------------------+              +--------------------+
| - userId: String  |---+        +-| - projectId: String|---+        +-| - taskId: String   |
| - username: String|   |        | | - projectName: String|   |        | - kanId: String    |
| - password: String|   |        | | - description: String|   |        | - taskName: String |
|                   |   |        | | - team: [userId,role]  | |        | - description: String|
|                   |   |        | | - owner: userId      |   |        | - dueDate: Date     |
|                   |   |        | | - tasks: [taskId]    |   |        | - status: String    |
|                   |   |        | | - timestamps        |   |        | - assignees: [userId]|
+-------------------+   |        +-------------------+   |        | - priority: String  |
                        |                                |        | - timestamps        |
                        |                                |        | - commentSection: [ |
                        +--------------------------------+        |   {commentId,         |
                               |                                |    userId, text,       |
                               |                                |    timestamp} ]        |
                            +--------------------+              +--------------------+
                            |      Team          |
                            +--------------------+
                            | - teamId: String   |
                            | - members: [userId]|
                            +--------------------+

