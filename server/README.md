# Server Side Spec
## Schema
### Overview

```javascript
{
    Employee: {
        ...EmployeeInfos,
        Signers,
        ActivatedleaveTypes,
        Records: {
            ...LeaveInfos,
            Signers,
            Signings
        }
    }
}
```

### Employee
- Root Document
- The basic information of one single employee, including:

|field|description|
|:-|:-| 
|enabled|show the employee's account whether `enabled`/`disabled`, and admin can only delete the account if it's `disabled`.|
|username|It's `English Name` text field, but also it's the account name for logging, so it can't be changed after account creating.|
|password|The default will be employee's `username`, and it's encrypted in the database for sure.|
|employeeID|just a employee ID of your company, nothing special.|
|name|the full name of employee in formal.|
|dept|department name.|
|email|email for notification on leave taking & signing.|
|arrivedDate|when does this employee work in company, for calculating annual vacation.|
|level|admin, manager and normal.|
|signers|check out `Signer` section.|
|activatedLeaveTypes|check out `ActivatedleaveType` section.|
|records|check out `Record` section.|

```javascript
{
  enabled: { type: Boolean, default: true },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  employeeID: String,
  name: String,
  dept: String,
  email: String,
  arrivedDate: Date,
  level: String,
  signers: [Signer],
  activatedLeaveTypes: [ActivatedleaveTypes],
  records: [Record]
})
```

### ActivatedleaveTypes
- All the types of leaves which the employee can take.
- And the status of these leaves.

|field|description|
|:-|:-|
|halfHoursEnabled|would the type of this leave can be taken in hours.|
|enabled|the type of this leave is enabled/disabled for the employee.|
|name|the leave type.|
|totals|all the days and hours of the leave type which the employee `can` take.|
|consumes|all the days and hours of the leave type which the employee `has already` take.
|deadline|the last date that the employee can take leave.|

```javascript
{
    halfHoursEnabled: Boolean,
    enabled: Boolean,
    name: String,
    totals: {
        days: Number,
        halfHours: Number
    },
    consumes: {
        days: Number,
        halfHours: Number
    },
    deadline: Date
}
```

### Record
- The record of leave taking

|field|description|
|:-|:-|
|appliedDate|when did employee `apply` the leave(s).|
|leaveType|same as `ActivatedDate.name`.|
|dates|when did employee `take` the leave(s).|
|startFrom|the time start from when, if `dates` is just one day.|
|endTo|the time end to when, if `dates` is just one day.|
|agent|the agent for employee's work during leave(s).|
|totals|the total day and hours of leave(s).|
|signings|check out `Signing` section.|
|signers|check out `Signer` section.|

```javascript
{
    appliedDate: Date,
    leaveType: String,
    dates: [Date],
    startFrom: String,
    endTo: String,
    agent: String,
    totals: {
      days: Number,
      halfHours: Number
    },
    signings: [Signing], 
    signers: [Signer]
  }
```

### Signer
- The people who signs employee's leave.
- It's in two places, `Employee` has a `Signer` field, and `Record` has too. The mechanism is when a employee take leave, means it'll create a new `Record`, and the system will copy the employee's `Signer` into `Record` one, so it can be different signer each record in same employee if you need to.

|field|description|
|:-|:-|
|id|same as `Employee.employeeID`|
|dept|same as `Employee.dept`|
|name|same as `Employee.name`|
|username|same as `Employee.username`|
|level|same as `Employee.level`|

```javascript
{
    id: String,
    dept: String,
    name: String,
    username: String,
    level: String,
}
```

### Signing
- Signing Record

|field|description|
|:-|:-|
|id|same as `Employee.employeeID`|
|dept|same as `Employee.dept`|
|name|same as `Employee.name`|
|username|same as `Employee.username`|
|level|same as `Employee.level`|
|signedDate|when did the signer sign.|
|pass|pass/reject the leave.|

```javascript
{
    id: String,

    dept: String,
    name: String,
    username: String,
    level: String,
    signedDate: Date,
    pass: Boolean,
}
```

## API
- If it's same path but different http-method, the http-method might imply something.
  - get: static data fetch
  - post: create a new document
  - put: modify existing document
  - delete: delete document

|http-method|path|body|
|:-|:-|:-|
|get|`/employees/:loginuser/:token`|employeeID, dept, name, email, username, arrivedDate, level, signers, activatedLeaveTypes|
|get(v)|`/employee/:id/:loginuser/:token`|
|post(v)|`/employee/:loginuser/:token`|
|post|`/auth`|username, password|
|put|`/active/:id/:loginuser/:token`|
|put(v)|`/employee/:id/:loginuser/:token`|employeeID, dept, name, email, ~~username~~, arrivedDate, level, signers, activatedLeaveTypes|
|put|`/employee/loa/:id/:loginuser/:token`|activatedLeaveTypes, records|
|put|`/employee/email/:id/:loginuser/:token`|email|
|put|`/employee/pwd/:id/:loginuser/:token`|password|
|put|`/employee/sign/:id/:loginuser/:token`|recordID, pass|
|delete(v)|`/employee/:id/:loginuser/:token`|

## Others
### First-time Set Up
### Email Notification
### Refresh Action
