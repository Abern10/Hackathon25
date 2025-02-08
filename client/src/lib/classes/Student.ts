import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export class Student {
  constructor(
    public uin: number,
    public name: string,
    public email: string,
    public access: object
  ) {}

  // Convert object to Firestore format
  toFirestore() {
    return {
      uin: this.uin,
      name: this.name,
      email: this.email,
      access: this.access
    };
  }

  // Save to Firestore
  async saveToFirestore(): Promise<void> {
    const studentRef = doc(db, "students", this.uin.toString());
    await setDoc(studentRef, this.toFirestore());
  }

  // Fetch Student from Firestore
  static async fetchFromFirestore(uin: number): Promise<Student | null> {
    const studentRef = doc(db, "students", uin.toString());
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const data = studentSnap.data();
      return new Student(data.uin, data.name, data.email, data.access);
    } else {
      return null;
    }
  }
}