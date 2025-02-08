import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export class Professor {
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
    const professorRef = doc(db, "professors", this.uin.toString());
    await setDoc(professorRef, this.toFirestore());
  }

  // Fetch Professor from Firestore
  static async fetchFromFirestore(uin: number): Promise<Professor | null> {
    const professorRef = doc(db, "professors", uin.toString());
    const professorSnap = await getDoc(professorRef);

    if (professorSnap.exists()) {
      const data = professorSnap.data();
      return new Professor(data.uin, data.name, data.email, data.access);
    } else {
      return null;
    }
  }
}