export enum Priority {
    "Low",
    "Mid",
    "High"
}

class Task {
    id!: number;
    title!: string;
    teaser!: string;
    description: string;
    dueDate!: Date;
    priority!: Priority;
    assignee!: Assignee;

    Task() {
        
    }

}