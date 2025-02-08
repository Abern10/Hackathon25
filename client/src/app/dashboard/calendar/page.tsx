"use client"
import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  category: string;
}

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    description: "",
    category: "default"
  });

  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("calendarEvents");
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("calendarEvents", JSON.stringify(events));
    } catch (error) {
      console.error("Error saving events:", error);
    }
  }, [events]);

  const navigateMonth = (direction: 'next' | 'prev'): void => {
    setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const getDaysInMonth = (): Date[] => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  };

  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) {
      alert("Please enter an event title");
      return;
    }

    if (!newEvent.date) {
      alert("Please select a date");
      return;
    }

    try {
      parseISO(newEvent.date);
    } catch (error) {
      alert("Invalid date format");
      return;
    }

    const eventToAdd: Event = {
      ...newEvent,
      id: Date.now(),
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
    };

    setEvents(prevEvents => [...prevEvents, eventToAdd]);
    
    setNewEvent({
      id: 0,
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      description: "",
      category: "default"
    });
    setShowEventForm(false);
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLDivElement).classList.contains("modal-overlay")) {
      setShowEventForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 flex justify-between items-center border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Your Calendar</h1>
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
                        className="mt-1 p-1 text-xs bg-blue-100 rounded truncate"
                        title={event.title}
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
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Add New Event</h3>
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
      </main>
    </div>
  );
};

export default App;