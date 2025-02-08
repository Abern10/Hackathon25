"use client"
import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from "@clerk/nextjs";

interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category: string;
  createdBy: string;
  creatorRole: 'professor';
  isPublic: boolean;
}

const ProfessorCalendar: React.FC = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    description: "",
    category: "default",
    createdBy: userId || "",
    creatorRole: 'professor',
    isPublic: true
  });

  // Get different colors based on event category
  const getEventStyle = (event: Event) => {
    const colors = {
      default: 'bg-purple-100 text-purple-800 border border-purple-300',
      assignment: 'bg-red-100 text-red-800 border border-red-300',
      lecture: 'bg-blue-100 text-blue-800 border border-blue-300',
      exam: 'bg-orange-100 text-orange-800 border border-orange-300',
      office_hours: 'bg-green-100 text-green-800 border border-green-300'
    };

    return event.category in colors 
      ? colors[event.category as keyof typeof colors]
      : colors.default;
  };

  // Fetch professor's events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userId) return;

      try {
        const eventsRef = collection(db, 'calendar_events');
        const professorEventsQuery = query(
          eventsRef,
          where('createdBy', '==', userId),
          where('creatorRole', '==', 'professor')
        );

        const professorSnapshot = await getDocs(professorEventsQuery);
        const fetchedEvents: Event[] = [];
        
        professorSnapshot.forEach((doc) => {
          fetchedEvents.push({ 
            ...doc.data() as Event, 
            id: doc.id 
          });
        });

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!userId) {
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
        creatorRole: 'professor',
        isPublic: true
      };

      // Add event to Firestore
      const docRef = await addDoc(collection(db, 'calendar_events'), eventToAdd);

      // Update local state
      setEvents(prevEvents => [...prevEvents, { ...eventToAdd, id: docRef.id }]);
      
      // Reset form
      setNewEvent({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "",
        description: "",
        category: "default",
        createdBy: userId,
        creatorRole: 'professor',
        isPublic: true
      });
      setShowEventForm(false);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Please try again.");
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Professor Calendar</h1>
        <div className="text-sm text-gray-600">
          Your events will be visible to all students
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
                Add Event
              </button>
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300 mr-2"></span>
              General
            </div>
            <div className="text-sm flex items-center text-gray-900">
              <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2"></span>
              Assignment
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
              Office Hours
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold py-2 text-gray-600">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day) => {
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
                        className={`mt-1 p-1 text-xs rounded truncate ${getEventStyle(event)}`}
                        title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
                      >
                        {event.time && <span className="mr-1">{event.time}</span>}
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showEventForm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
            onClick={handleClickOutside}
          >
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Add Public Event</h3>
              <form onSubmit={handleEventSubmit}>
                <div className="mb-4">
                  <label htmlFor="category" className="block mb-2 text-gray-700">Event Type</label>
                  <select
                    id="category"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">General Event</option>
                    <option value="assignment">Assignment</option>
                    <option value="lecture">Lecture</option>
                    <option value="exam">Exam</option>
                    <option value="office_hours">Office Hours</option>
                  </select>
                </div>

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
      </main>
    </div>
  );
};

export default ProfessorCalendar;