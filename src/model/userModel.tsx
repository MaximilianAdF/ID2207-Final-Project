export interface User {
    id: number;
    username: string;
    password: string;
    name: string;       //E.g. Customer Service Officer
}

export const users: User[] = [
    {
        id: 1,
        username: "CS",
        password: "CSPass",
        name: "Customer Service"
    },
    {
        id: 2,
        username: "SCS",
        password: "SCSPass",
        name: "Senior Customer Service"
    },
    {
        id: 3,
        username: "FM",
        password: "FMPass",
        name: "Financial Manager"
    },
    {
        id: 4,
        username: "AM",
        password: "AMPass",
        name: "Administration Manager"
    },
    {
        id: 5,
        username: "PM",
        password: "PMPass",
        name: "Production Manager"
    },
    {
        id: 6,
        username: "SM",
        password: "SMPass",
        name: "Service Manager"
    },
    {
        id:7,
        username: "HR",
        password: "HRPass",
        name: "Human Resources"
    },
    {
        id:100,
        username: "TestMan",
        password: "Test",
        name: "TestMan"
    }
]

export const authenticateUser = (username: string, password: string): User | null => {
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
}

export const getUserById = (id: number): User | null => {
    return users.find(u => u.id === id) || null;
}