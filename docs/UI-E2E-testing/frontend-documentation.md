# Frontend Documentation

When following the setup instructions in the README in the root of this repository,
you will have the development server running at `http://localhost:5173`.

## Login

When entering the application, you will be greeted with a Sign-In page.

In case you freshly migrated the database, you need to create an account first.
You can do this by clicking on the "Create an account" button.
This will guide you through the process of creating a new account.

## Logout

To log out, click on the "Sign Out" button in the top right corner of the page.

## Light/Dark Mode

You can toggle between light and dark mode by clicking on the sun/moon icon in the top right corner of the page.

## Dashboard

After logging in, you will be redirected to the dashboard.
Here you can see your tasks, create new tasks, and set their status.

### Creating a Task

To create a new task, fill out the form with the task information:
- **Task Title**: The title of the task.
- **Task Teaser (optional)** brief description of the task.
- **Task Description (optional)** detailed description of the task.
- **Due Date (default midnight today)**: The date and time when the task is due.
- **Priority (default Low)**: The priority of the task, which can be set to Low, Mid, or High.
- **Tags (optional)**: Tags to categorize the task, which can be selected from existing tags.

Hit the button in the bottom right corner to create the task.

### Task Status

The status of a task can be set to:
- **Open**: The task is not yet started.
- **Pending**: The task is in progress.
- **In Progress**: The task is actively being worked on.
- **Closed**: The task is completed.

For this just click on the status circle left to the task title.

### Task Actions

You can edit or delete a task. For editing, click on the pencil icon on the right side of the task.
This will open a modal where you can change the task information. You need to click on the save button to save the changes.
To delete a task, click on the trash can icon on the right side of the task.

## Settings

In the settings page, you can change your account information like your email address and password.
Two-factor authentication can be updated here as well.
