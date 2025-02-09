"use client"
import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from "@clerk/nextjs";

interface Assignment {
  id: string;
  label: string;
  dueDate: string;
  description: string;
  points: number;
  type: string;
}

interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category?: string;
  createdBy: string;
  creatorRole: 'student' | 'professor' | 'system';
  isPublic: boolean;
  courseName?: string;
  points?: number;
}

const StudentCalendar: React.FC = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    description: "",
    createdBy: userId || "",
    creatorRole: 'student',
    isPublic: false
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getEventStyle = (event: Event) => {
    if (event.creatorRole === 'student') {
      return 'bg-green-100 text-green-800 border border-green-300';
    }

    if (event.creatorRole === 'system') {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    }

    const colors = {
      default: 'bg-purple-100 text-purple-800 border border-purple-300',
      assignment: 'bg-red-100 text-red-800 border border-red-300',
      lecture: 'bg-blue-100 text-blue-800 border border-blue-300',
      exam: 'bg-orange-100 text-orange-800 border border-orange-300',
      office_hours: 'bg-green-100 text-green-800 border border-green-300'
    };

    return event.category && event.category in colors 
      ? colors[event.category as keyof typeof colors]
      : colors.default;
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) return;

      try {
        const studentDoc = await getDoc(doc(db, 'students', userId));
        if (studentDoc.exists()) {
          setUserRole('student');
          setNewEvent(prev => ({
            ...prev,
            createdBy: userId,
            creatorRole: 'student',
            isPublic: false
          }));
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [userId]);

  useEffect(() => {
    const fetchEventsAndAssignments = async () => {
      if (!userId || !userRole) return;

      try {
        let fetchedEvents: Event[] = [];

        // Fetch professor events
        const eventsRef = collection(db, 'calendar_events');
        const publicEventsQuery = query(
          eventsRef,
          where('creatorRole', '==', 'professor')
        );
        const publicSnapshot = await getDocs(publicEventsQuery);
        publicSnapshot.forEach((doc) => {
          fetchedEvents.push({ ...doc.data() as Event, id: doc.id });
        });

        // Fetch student's private events
        const privateEventsQuery = query(
          eventsRef,
          where('createdBy', '==', userId)
        );
        const privateSnapshot = await getDocs(privateEventsQuery);
        privateSnapshot.forEach((doc) => {
          fetchedEvents.push({ ...doc.data() as Event, id: doc.id });
        });

        // Fetch course assignments
        const coursesRef = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesRef);

        coursesSnapshot.forEach((courseDoc) => {
          const courseData = courseDoc.data();
          
          if (courseData.assignment) {
            const assignmentEvent: Event = {
              id: `assignment-${courseData.assignment.id || Date.now()}`,
              title: courseData.assignment.label || 'Assignment',
              date: courseData.assignment.dueDate,
              time: "",
              description: courseData.assignment.description || '',
              category: 'assignment',
              createdBy: 'system',
              creatorRole: 'system',
              isPublic: true,
              courseName: courseData.courseName || courseData.courseCode,
              points: courseData.assignment.points
            };
            fetchedEvents.push(assignmentEvent);
          }
        });

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events and assignments:", error);
      }
    };

    fetchEventsAndAssignments();
  }, [userId, userRole]);

  const navigateMonth = (direction: 'next' | 'prev'): void => {
    setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const getDaysInMonth = (): Date[] => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLDivElement).classList.contains("modal-overlay")) {
      setShowEventForm(false);
      setShowEventDetails(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!userId || !userRole) {
      alert("Please sign in to add events");
      return;
    }

    if (!newEvent.title.trim()) {
      alert("Please enter an event title");
      return;
    }

    try {
      const eventToAdd: Omit<Event, 'id'> = {
        ...newEvent,
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        createdBy: userId,
        creatorRole: 'student',
        isPublic: false
      };

      const docRef = await addDoc(collection(db, 'calendar_events'), eventToAdd);
      setEvents(prevEvents => [...prevEvents, { ...eventToAdd, id: docRef.id }]);
      
      setNewEvent({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "",
        description: "",
        createdBy: userId,
        creatorRole: 'student',
        isPublic: false
      });
      setShowEventForm(false);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Please try again.");
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center">Please sign in to view the calendar</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 flex justify-between items-center border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Student Calendar</h1>
        <div className="text-sm text-gray-600">
          View professor events, course assignments, and manage personal events
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{format(currentDate, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <FiChevronRight size={20} />
              </button>
              <button
                onClick={() => setShowEventForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus size={20} />
                Add Personal Event
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-4">
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300 mr-2"></span>
              General Event
            </div>
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2"></span>
              Professor Assignment
            </div>
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-2"></span>
              Course Assignment
            </div>
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></span>
              Lecture
            </div>
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300 mr-2"></span>
              Exam
            </div>
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-2"></span>
              Personal Event
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day: string) => (
              <div key={day} className="text-center font-semibold py-2 text-gray-600">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day: Date) => {
              const dayEvents = events.filter((event) =>
                isSameDay(parseISO(event.date), day)
              );
              return (
                <div
                  key={day.toString()}
                  className={`p-2 border rounded-lg min-h-[100px] transition-colors bg-white
                    ${isSameMonth(day, currentDate) ? "" : "bg-gray-50 text-gray-400"}
                    ${isSameDay(day, new Date()) ? "border-blue-500" : "border-gray-200"}
                  `}
                >
                  <div className="font-medium text-gray-900">{format(day, "d")}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`mt-1 p-1 text-xs rounded truncate ${getEventStyle(event)} cursor-pointer hover:opacity-80`}
                        title={`${event.title}${event.courseName ? ` - ${event.courseName}` : ''}${event.description ? ` - ${event.description}` : ''}${event.points ? ` (${event.points} points)` : ''}`}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.time && <span className="mr-1">{event.time}</span>}
                        {event.title}
                        {event.courseName && (
                          <div className="text-xs opacity-75">
                            {event.courseName} {event.points && `(${event.points}pts)`}
                          </div>
                        )}
                        {!event.courseName && (
                          <div className="text-xs opacity-75">
                            {event.creatorRole === 'professor' ? '(Professor)' : event.creatorRole === 'system' ? '(Assignment)' : '(Personal)'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
            onClick={handleClickOutside}
          >
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Add Personal Event</h3>
              <form onSubmit={handleEventSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-2 text-gray-700">Title *</label>
                  <input
                    id="title"
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block mb-2 text-gray-700">Date *</label>
                  <input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="time" className="block mb-2 text-gray-700">Time</label>
                  <input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block mb-2 text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
            onClick={handleClickOutside}
          >
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className={`p-3 rounded-lg mb-4 ${getEventStyle(selectedEvent)}`}>
                <h4 className="font-semibold mb-1">{selectedEvent.title}</h4>
                {selectedEvent.courseName && (
                  <p className="text-sm mb-1">
                    Course: {selectedEvent.courseName}
                  </p>
                )}
                <p className="text-sm mb-1">
                  Date: {format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}
                </p>
                {selectedEvent.time && (
                  <p className="text-sm mb-1">
                    Time: {selectedEvent.time}
                  </p>
                )}
                {selectedEvent.points && (
                  <p className="text-sm mb-1">
                    Points: {selectedEvent.points}
                  </p>
                )}
                {selectedEvent.description && (
                  <p className="text-sm mt-2">
                    Description: {selectedEvent.description}
                  </p>
                )}
                <p className="text-sm mt-2 opacity-75">
                  Type: {
                    selectedEvent.creatorRole === 'professor' ? 'Professor Event' :
                    selectedEvent.creatorRole === 'system' ? 'Course Assignment' :
                    'Personal Event'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCalendar;