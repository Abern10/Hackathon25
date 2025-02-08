export class Professor {
    // unique fields to identify a student
    private uin: number;
    private name: string;
    private email: string;
    private access: string;
    

    constructor(uin: number, name: string, email: string, access: string) {
        this.uin = uin;
        this.name = name;
        this.email = email;
        this.access = access;
    }

    // setter functions
    public setUin(uin: number): void {
        this.uin = uin;
    }
    
    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    // getter functions
    public getUin(): number {
        return this.uin;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    // can only get access instead of setting it
    public getAccess(): string {
        return this.access;
    }
}