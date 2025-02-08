"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconCheck, IconX, IconEdit, IconTrash } from "@tabler/icons-react";

interface Course {
  id: string;
  code: string;
  title: string;
  status: string;
  instructor: string;
  starred: boolean;
  professorId: string;
}

interface CourseCardProps {
  course: Course;
  viewMode: "grid" | "list";
  onToggleStar: (id: string) => void;
  onSave: (id: string, updatedCourse: Partial<Course>) => void;
  onDelete: (id: string) => void;
}

export function CourseCard({ course, viewMode, onToggleStar, onSave, onDelete }: CourseCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState(course);

  const handleClick = () => {
    if (!isEditing) {
      router.push(`/dashboard/professorCourses/class/${course.id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(course.id, editedValues);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedValues(course);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this course?")) {
      onDelete(course.id);
    }
  };

  const handleChange = (field: keyof Course, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div
      onClick={handleClick}
      className={`block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
        viewMode === "list" ? "flex items-center p-4 gap-4" : ""
      }`}
    >
      <div className="block w-full">
        <div className={`${viewMode === "grid" ? "h-48" : "w-24 h-24"} bg-gray-200 relative`}>
          {!isEditing && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleEdit}
                className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <IconEdit size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 text-red-500 hover:text-red-600"
              >
                <IconTrash size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          {isEditing ? (
            <div onClick={e => e.stopPropagation()} className="space-y-2">
              <input
                type="text"
                value={editedValues.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full p-1 border rounded text-sm"
                placeholder="Course Code"
              />
              <input
                type="text"
                value={editedValues.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-1 border rounded font-medium"
                placeholder="Course Title"
              />
              <input
                type="text"
                value={editedValues.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-1 border rounded text-sm"
                placeholder="Status"
              />
              <input
                type="text"
                value={editedValues.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="Instructor Name"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <IconCheck size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <IconX size={20} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-2">{course.code}</div>
              <h3 className="text-lg font-medium mb-2 text-black">{course.title}</h3>
              <div className="text-sm text-gray-600 mb-2">{course.status}</div>
              <div className="flex justify-between items-center">
                <span className="text-black">{course.instructor}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleStar(course.id);
                  }}
                  className="text-xl hover:scale-110 transition-transform"
                >
                  {course.starred ? "★" : "☆"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}