# Quality Model

---

## Most Important Quality Attributes

### **Functional Suitability**:

- *Abstract*: To which degree the software provides functions that meet stated and implied needs when used under
  specified conditions.
- *Specific*: The software needs to have a UI, it should be possible to create tasks, review tasks, manage tasks,
  organize tasks based on complexity, create users with whole authentication logic, create teams and assign users to
  teams, assign or share tasks within small teams, assign deadlines to tasks, and give tasks status (due soon, in
  progress, completed).
- *Measurable*: Number of functional requirements met.

### **Usability**:

- *Abstract*: To which degree the software can be used by specified users to achieve specified goals with effectiveness,
  efficiency, and satisfaction in a specified context of use.
- *Specific*: The software needs to have a clean and logical UI, have intuitive visual feedback, and the user should not
  be overwhelmed with notifications.
- *Measurable*: Number of clicks to create and complete a task, time to create and complete a task. Average number of
  notifications after login.

### **Security**:

- *Abstract*: To which degree the software protects information and data so that persons or other products or systems
  are granted access rights to their information and data.
- *Specific*: The software should have a secure authentication system, and the software should not allow unauthorized
  access to tasks. The authentication system should have standard security measures like password hashing and 2FA.
- *Measurable*: Number of unauthorized access attempts, number of successful unauthorized access attempts.

### **Maintainability**:

- *Abstract*: To which degree of effectiveness and efficiency with which a product or system can be modified to improve
  it, correct it, or adapt it to changes in environment, and in requirements.
- *Specific*: The software should be easy to maintain and update. Thus, the software should have a modular architecture
  and a clear separation of concerns. The code should be well-documented and separated into logical components. To
  ensure safe modifications, the software should have a comprehensive test suite.
- *Measurable*: Average number of lines of code per module, number of modules, average number of comments per module.
  Code coverage of the test suite.
