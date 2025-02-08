"use client";

import { useState, useEffect } from "react";
import { IconList, IconBlocks, IconSearch, IconSettings, IconCirclePlus } from "@tabler/icons-react";
import { useRouter } from 'next/navigation';
import { CourseCard } from "@/components/courseCard";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useProfessorCheck } from "@/app/hooks/useProfessorCheck";

interface Course {
  id: string;
  code: string;
  title: string;
  status: string;
  instructor: string;
  starred: boolean;
  professorId: string;
}

export default function ProfessorHomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isProfessor, isLoading: professorLoading, professorData } = useProfessorCheck();

  // Fetch courses on component mount
  useEffect(() => {
    if (!professorLoading && isProfessor && professorData) {
      fetchCourses();
    }
  }, [professorLoading, isProfessor, professorData]);

  const fetchCourses = async () => {
    if (!professorData) return;
    
    try {
      const coursesRef = collection(db, "courses");
      const q = query(coursesRef, where("professorId", "==", professorData.userId));
      const querySnapshot = await getDocs(q);
      
      const fetchedCourses: Course[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCourses.push({ id: doc.id, ...doc.data() } as Course);
      });
      
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewCourse = async () => {
    if (!professorData) return;

    const newCourse = {
      code: `2025.spring.course.${Date.now()}`,
      title: "New Course",
      status: "Draft",
      instructor: professorData.name,
      starred: false,
      professorId: professorData.userId, // This should match auth.uid
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "courses"), newCourse);
      setCourses([...courses, { ...newCourse, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const toggleStar = async (courseId: string) => {
    const courseToUpdate = courses.find(course => course.id === courseId);
    if (!courseToUpdate) return;

    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, {
        starred: !courseToUpdate.starred
      });

      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, starred: !course.starred }
          : course
      ));
    } catch (error) {
      console.error("Error updating course star:", error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const courseRef = doc(db, "courses", courseId);
      await deleteDoc(courseRef);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  if (professorLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isProfessor) {
    return <div>Access denied. Only professors can view this page.</div>;
  }

  return (
    <main>
      <section>
        <div>
          <h1 className="text-black text-5xl mb-20">Welcome, {professorData?.name}</h1>
          <div className="bg-white h-full w-full">
            <div className="p-8">
              {/* Controls Bar */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center">
                  <p className="text-black text-3xl">Your Classes</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <button
                    className={`p-2 text-black transition ${viewMode === "list" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <IconList />
                  </button>
                  <button
                    className={`p-2 text-black transition ${viewMode === "grid" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <IconBlocks />
                  </button>

                  {/* Search */}
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      placeholder="Search your courses"
                      className="w-full px-4 py-2 border rounded text-black placeholder-black"
                    />
                    <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>

                  {/* Dropdown Filters */}
                  <select className="border rounded px-4 py-2 text-black">
                    <option>Current Courses</option>
                  </select>

                  <button>
                    <IconSettings />
                  </button>
                  <button 
                    onClick={addNewCourse}
                    className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                  >
                    <IconCirclePlus />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <span className="text-black">{courses.length} results</span>
                <button className="ml-4 px-4 py-1 rounded-full bg-gray-800 text-white text-sm">
                  Current Courses
                </button>
              </div>

              {/* Course Display - Grid or List */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                }`}
              >
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    viewMode={viewMode}
                    onToggleStar={toggleStar}
                    onSave={async (courseId: string, updatedCourse: Partial<Course>) => {
                      try {
                        const courseRef = doc(db, "courses", courseId);
                        await updateDoc(courseRef, updatedCourse);
                        
                        setCourses(courses.map(course => 
                          course.id === courseId 
                            ? { ...course, ...updatedCourse }
                            : course
                        ));
                      } catch (error) {
                        console.error("Error updating course:", error);
                      }
                    }}
                    onDelete={async (courseId: string) => {
                      try {
                        const courseRef = doc(db, "courses", courseId);
                        await deleteDoc(courseRef);
                        setCourses(courses.filter(course => course.id !== courseId));
                      } catch (error) {
                        console.error("Error deleting course:", error);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-48">
        <div className="border-b-2 mb-4 border-black"></div>
        <div className="flex gap-6">
          <div className="p-4 bg-white rounded-lg shadow w-1/2">
            <p className="text-2xl font-semibold text-black">Notifications</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow w-1/2">
            <p className="text-2xl font-semibold text-black">Schedule</p>
          </div>
        </div>
      </section>
    </main>
  );
}