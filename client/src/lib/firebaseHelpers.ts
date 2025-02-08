import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

// 🔹 User types for both Professors & Students
interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "professor";
  access: {
    courses: string[];
  };
}

// 🔹 Course type
interface Course {
  id: string;
  name: string;
  professor: string;
  students: string[];
}

// 🔹 Assignment type
interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  students: Record<string, { status: string; grade?: number }>;
}

// 🔹 Notification type
interface Notification {
  id: string;
  courseId: string;
  message: string;
  recipients: string[];
}

/** 🔹 Fetch user data from Firestore */
export async function getUserDataFromFirebase(
  userId: string,
  role: "student" | "professor"
): Promise<User | null> {
  const userRef = doc(db, `${role}s`, userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    return { id: userId, ...userData } as User;
  }
  return null;
}

/** 🔹 Create a new user in Firestore if they don't exist */
export async function createUserInFirebase(
  userId: string,
  role: "student" | "professor",
  data: { name: string; email: string }
): Promise<void> {
  const userRef = doc(db, `${role}s`, userId);
  await setDoc(userRef, {
    name: data.name,
    email: data.email,
    access: { courses: [] },
  });
}

/** 🔹 Fetch all courses for a given student */
export async function getCoursesForStudent(userId: string): Promise<Course[]> {
  const coursesRef = collection(db, "courses");
  const courseDocs = await getDocs(coursesRef);
  const courses: Course[] = [];

  courseDocs.forEach((doc) => {
    const courseData = doc.data() as Course;
    if (courseData.students.includes(userId)) {
      courses.push({ ...courseData, id: doc.id }); // ✅ Corrected to avoid duplicate `id`
    }
  });

  return courses;
}

/** 🔹 Fetch assignments for a specific course */
export async function getAssignmentsForCourse(
  courseId: string
): Promise<Assignment[]> {
  const assignmentsRef = collection(db, "assignments");
  const assignmentDocs = await getDocs(assignmentsRef);
  const assignments: Assignment[] = [];

  assignmentDocs.forEach((doc) => {
    const assignmentData = doc.data() as Assignment;
    if (assignmentData.courseId === courseId) {
      assignments.push({ ...assignmentData, id: doc.id }); // ✅ Fixed duplicate `id`
    }
  });

  return assignments;
}

/** 🔹 Fetch notifications for a specific student */
export async function getNotificationsForStudent(
  userId: string
): Promise<Notification[]> {
  const notificationsRef = collection(db, "notifications");
  const notificationDocs = await getDocs(notificationsRef);
  const notifications: Notification[] = [];

  notificationDocs.forEach((doc) => {
    const notificationData = doc.data() as Notification;
    if (notificationData.recipients.includes(userId)) {
      notifications.push({ ...notificationData, id: doc.id }); // ✅ Fixed duplicate `id`
    }
  });

  return notifications;
}

/** 🔹 Update a student's assigned courses */
export async function updateStudentCourses(
  studentId: string,
  courses: string[]
): Promise<void> {
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, { access: { courses } });
}

/** 🔹 Update a student's grade for an assignment */
export async function updateStudentGrade(
  assignmentId: string,
  studentId: string,
  grade: number
): Promise<void> {
  const assignmentRef = doc(db, "assignments", assignmentId);
  const assignmentSnap = await getDoc(assignmentRef);

  if (assignmentSnap.exists()) {
    const assignmentData = assignmentSnap.data() as Assignment;
    assignmentData.students[studentId] = {
      ...(assignmentData.students[studentId] || {}),
      grade,
    };
    await updateDoc(assignmentRef, { students: assignmentData.students });
  }
}