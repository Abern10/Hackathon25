'use client';

import { useState, useEffect, use } from 'react'; // Add use from React
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconCheck,
  IconFolder,
  IconChevronRight,
  IconChevronDown,
  IconClipboard,
  IconCalendar,
  IconUserPlus,
} from '@tabler/icons-react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Assignment {
  dueDate: string;
  points: number;
  description: string;
  instructions: string;
}

interface Tab {
  id: string;
  label: string;
  type: 'folder' | 'content' | 'assignment';
  content?: string; // Only for type 'content'
  children?: Tab[]; // For nested folders or content
  parentId?: string | null; // To track parent folder
  assignment?: Assignment; // Only for type 'assignment'
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const { id: courseId } = use(params);

  const [isEditing, setIsEditing] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('Introduction to Data Science');
  const [courseCode, setCourseCode] = useState('CS 418');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [instructorName, setInstructorName] = useState('Daniel Luangnikone');
  const [professorId, setProfessorId] = useState('user.2shellDXABhwzbRC89U7vBP5gap');

  // State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Function to fetch users from Clerk
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/getUsers'); // Call API route instead
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Open the modal and fetch users
  const openModal = () => {
    fetchUsers();
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUsers(new Set()); // Reset selection
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
  };

  // Save course content to Firestore
  const saveCourseContent = async (
    instructor: string,
    professorId: string,
    status: string = 'Draft',
    started: boolean = false
  ) => {
    const db = getFirestore();
    const courseRef = doc(db, 'courses', courseId);

    const dataToSave = {
      title: courseName,
      courseCode: courseCode,
      content: {
        tabs: tabs.map(serializeTab), // Serialize the nested tabs structure
        lastUpdated: new Date().toISOString(),
        courseName: courseName,
        courseCode: courseCode,
        createdAt: new Date().toISOString(),
        status: status,
        started: started,
        instructor: instructor,
        professorId: professorId,
      },
    };

    console.log('Data being saved to Firebase:', JSON.stringify(dataToSave, null, 2)); // Log the data

    try {
      await setDoc(courseRef, dataToSave, { merge: true });
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving course content:', error);
    }
  };

  // Load course content from Firestore
  const loadCourseContent = async () => {
    const db = getFirestore();
    const courseRef = doc(db, 'courses', courseId);

    try {
      const courseDoc = await getDoc(courseRef);
      if (courseDoc.exists()) {
        const data = courseDoc.data();
        console.log('Data loaded from Firebase:', JSON.stringify(data, null, 2)); // Log the data

        setCourseName(data.title);
        setCourseCode(data.courseCode);
        if (data.content?.tabs) {
          setTabs(data.content.tabs.map(deserializeTab));
        }
      } else {
        console.log('No document found for courseId:', courseId);
      }
    } catch (error) {
      console.error('Error loading course content:', error);
    }
  };

  // Serialize a tab (recursively serialize children)
  const serializeTab = (tab: Tab): any => {
    const serialized = {
      id: tab.id,
      label: tab.label,
      type: tab.type,
      parentId: tab.parentId || null,
    };

    if (tab.type === 'content') {
      return {
        ...serialized,
        content: tab.content || '', // Only for type 'content'
      };
    }

    if (tab.type === 'assignment') {
      return {
        ...serialized,
        assignment: {
          dueDate: tab.assignment?.dueDate,
          points: tab.assignment?.points,
          description: tab.assignment?.description,
          instructions: tab.assignment?.instructions,
        },
      };
    }

    if (tab.type === 'folder') {
      return {
        ...serialized,
        children: tab.children?.map(serializeTab) || [], // Recursively serialize children
      };
    }

    return serialized;
  };

  // Deserialize a tab (recursively deserialize children)
  const deserializeTab = (data: any): Tab => {
    const base = {
      id: data.id,
      label: data.label,
      type: data.type as 'folder' | 'content' | 'assignment',
      parentId: data.parentId,
    };

    if (data.type === 'content') {
      return {
        ...base,
        content: data.content || '', // Only for type 'content'
      };
    }

    if (data.type === 'assignment') {
      return {
        ...base,
        assignment: {
          dueDate: data.assignment.dueDate,
          points: data.assignment.points,
          description: data.assignment.description,
          instructions: data.assignment.instructions,
        },
      };
    }

    if (data.type === 'folder') {
      return {
        ...base,
        children: data.children?.map(deserializeTab) || [], // Recursively deserialize children
      };
    }

    return base;
  };

  // Add a new tab (folder, content, or assignment)
  const addTab = (parentId: string | null = null, type: 'folder' | 'content' | 'assignment' = 'content') => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      label: type === 'folder' ? 'New Folder' : type === 'assignment' ? 'New Assignment' : 'New Section',
      type,
      parentId,
      children: type === 'folder' ? [] : undefined,
      assignment: type === 'assignment' ? {
        dueDate: new Date().toISOString().split('T')[0],
        points: 100,
        description: '',
        instructions: '',
      } : undefined,
      content: type === 'content' ? '' : undefined, // Only add content for 'content' tabs
    };

    if (!parentId) {
      setTabs([...tabs, newTab]);
    } else {
      const updateChildren = (tabList: Tab[]): Tab[] => {
        return tabList.map(tab => {
          if (tab.id === parentId) {
            return {
              ...tab,
              children: [...(tab.children || []), newTab],
            };
          }
          if (tab.children) {
            return {
              ...tab,
              children: updateChildren(tab.children),
            };
          }
          return tab;
        });
      };

      setTabs(updateChildren(tabs));
      if (type === 'folder') {
        setExpandedFolders(new Set([...expandedFolders, parentId]));
      }
    }

    console.log('New Tab Added:', JSON.stringify(newTab, null, 2)); // Log the new tab
    if (type !== 'folder') {
      setActiveTab(newTab.id);
    }
  };

  // Remove a tab (recursively remove children)
  const removeTab = (tabId: string) => {
    const removeFromArray = (tabList: Tab[]): Tab[] => {
      return tabList.filter(tab => {
        if (tab.id === tabId) return false;
        if (tab.children) {
          tab.children = removeFromArray(tab.children);
        }
        return true;
      });
    };

    const newTabs = removeFromArray(tabs);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(null);
    }
  };

  // Update a tab's label or content
  const updateTab = (tabId: string, field: 'label' | 'content', value: string) => {
    const updateInArray = (tabList: Tab[]): Tab[] => {
      return tabList.map(tab => {
        if (tab.id === tabId) {
          return { ...tab, [field]: value };
        }
        if (tab.children) {
          return { ...tab, children: updateInArray(tab.children) };
        }
        return tab;
      });
    };

    const updatedTabs = updateInArray(tabs);
    setTabs(updatedTabs);
    console.log('Updated Tabs:', JSON.stringify(updatedTabs, null, 2)); // Log the updated tabs
  };

  // Update an assignment's properties
  const updateAssignment = (tabId: string, field: keyof Assignment, value: string | number) => {
    const updateInArray = (tabList: Tab[]): Tab[] => {
      return tabList.map(tab => {
        if (tab.id === tabId && tab.assignment) {
          return {
            ...tab,
            assignment: {
              ...tab.assignment,
              [field]: value,
            },
          };
        }
        if (tab.children) {
          return {
            ...tab,
            children: updateInArray(tab.children),
          };
        }
        return tab;
      });
    };

    const updatedTabs = updateInArray(tabs);
    setTabs(updatedTabs);
    console.log('Updated Tabs:', JSON.stringify(updatedTabs, null, 2)); // Log the updated tabs
  };

  // Render a tab item (recursively render children)
  const renderTabItem = (tab: Tab, level: number = 0) => {
    const isFolder = tab.type === 'folder';
    const isExpanded = expandedFolders.has(tab.id);

    return (
      <div key={tab.id} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center group">
          <button
            onClick={() => isFolder ? toggleFolder(tab.id) : setActiveTab(tab.id)}
            className={
              `flex-1 flex items-center px-4 py-3 rounded-lg text-left
              transition-colors duration-150 ease-in-out
              ${activeTab === tab.id ? 'bg-gray-100 text-black font-semibold' : 'text-black hover:bg-gray-50'}`
            }
          >
            {isFolder && (
              <span className="mr-2">
                {isExpanded ? <IconChevronDown className="w-4 h-4" /> : <IconChevronRight className="w-4 h-4" />}
              </span>
            )}
            {isFolder && <IconFolder className="w-4 h-4 mr-2" />}
            {tab.type === 'assignment' && <IconClipboard className="w-4 h-4 mr-2" />}
            {tab.label}
          </button>
          {isEditing && (
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              {isFolder && (
                <>
                  <button
                    onClick={() => addTab(tab.id, 'folder')}
                    className="p-2 text-blue-500"
                  >
                    <IconFolder className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addTab(tab.id, 'content')}
                    className="p-2 text-green-500"
                  >
                    <IconPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addTab(tab.id, 'assignment')}
                    className="p-2 text-orange-500"
                  >
                    <IconClipboard className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => removeTab(tab.id)}
                className="p-2 text-red-500"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {isFolder && isExpanded && tab.children && (
          <div className="mt-1">
            {tab.children.map(child => renderTabItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Find a tab by ID
  const findTabById = (tabId: string, tabList: Tab[]): Tab | null => {
    for (const tab of tabList) {
      if (tab.id === tabId) return tab;
      if (tab.children) {
        const found = findTabById(tabId, tab.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Render the active tab's content
  const renderContent = () => {
    if (tabs.length === 0) {
      return (
        <div className="text-center text-gray-500 pt-8">
          No sections added yet. Click edit to add course content.
        </div>
      );
    }

    const currentTab = activeTab ? findTabById(activeTab, tabs) : null;
    if (!currentTab) return null;

    if (isEditing) {
      if (currentTab.type === 'assignment' && currentTab.assignment) {
        return (
          <div className="p-6 space-y-4">
            <input
              type="text"
              value={currentTab.label}
              onChange={(e) => updateTab(currentTab.id, 'label', e.target.value)}
              className="text-2xl font-semibold text-black bg-transparent border-b w-full"
              placeholder="Assignment Title"
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={currentTab.assignment.dueDate}
                  onChange={(e) => updateAssignment(currentTab.id, 'dueDate', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  type="number"
                  value={currentTab.assignment.points}
                  onChange={(e) => updateAssignment(currentTab.id, 'points', parseInt(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={currentTab.assignment.description}
                onChange={(e) => updateAssignment(currentTab.id, 'description', e.target.value)}
                className="w-full h-32 p-4 border rounded-lg"
                placeholder="Enter assignment description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                value={currentTab.assignment.instructions}
                onChange={(e) => updateAssignment(currentTab.id, 'instructions', e.target.value)}
                className="w-full h-64 p-4 border rounded-lg"
                placeholder="Enter detailed instructions..."
              />
            </div>
          </div>
        );
      } else if (currentTab.type === 'content') {
        return (
          <div className="p-6 space-y-4">
            <input
              type="text"
              value={currentTab.label}
              onChange={(e) => updateTab(currentTab.id, 'label', e.target.value)}
              className="text-2xl font-semibold text-black bg-transparent border-b w-full"
              placeholder="Section Title"
            />
            <textarea
              value={currentTab.content}
              onChange={(e) => updateTab(currentTab.id, 'content', e.target.value)}
              className="w-full h-96 p-4 border rounded-lg mt-4"
              placeholder="Enter section content..."
            />
          </div>
        );
      }
      return null;
    }

    if (currentTab.type === 'assignment' && currentTab.assignment) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black">{currentTab.label}</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 flex gap-6">
            <div className="flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-gray-500" />
              <span>Due: {new Date(currentTab.assignment.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClipboard className="w-5 h-5 text-gray-500" />
              <span>Points: {currentTab.assignment.points}</span>
            </div>
          </div>
          <div className="prose text-black">
            <h3 className="text-xl font-medium mb-2">Description</h3>
            <p className="mb-6">{currentTab.assignment.description || 'No description available'}</p>
            <h3 className="text-xl font-medium mb-2">Instructions</h3>
            <p>{currentTab.assignment.instructions || 'No instructions available'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">{currentTab.label}</h2>
        <div className="prose text-black">
          {currentTab.content || 'No content available'}
        </div>
      </div>
    );
  };

  // Load course content on component mount
  useEffect(() => {
    if (courseId) {
      loadCourseContent();
    }
  }, [courseId]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Course Header */}
      <header className="bg-white p-6 border-b relative flex justify-between items-center">
        <div className="max-w-7xl mx-auto text-center flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full text-5xl font-bold text-black text-center bg-transparent border-b"
              />
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full text-lg text-black text-center bg-transparent border-b"
              />
            </div>
          ) : (
            <>
              <h1 className="text-center text-5xl font-bold text-black">{courseName}</h1>
              <p className="text-center text-lg mt-2 text-black">{courseCode}</p>
            </>
          )}
        </div>
        <div className="flex gap-4">
          {/* Add Students Button */}
          <button
            onClick={openModal}
            className="p-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <IconUserPlus className="w-6 h-6" />
            Add Students
          </button>

          {/* Edit Button */}
          <button
            onClick={() => {
              setIsEditing(!isEditing); // Toggle editing mode
              saveCourseContent(instructorName, professorId); // Call saveCourseContent with dynamic values
            }}
            className="p-2 rounded-lg bg-gray-200 text-black flex items-center gap-2 hover:bg-gray-300 transition"
          >
            {isEditing ? <IconCheck className="w-6 h-6 text-green-600" /> : <IconEdit className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r flex flex-col">
          <div className="p-4 flex-1">
            {tabs.map(tab => renderTabItem(tab))}
          </div>
          {isEditing && (
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => addTab(null, 'folder')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <IconFolder className="w-5 h-5" />
                Add Folder
              </button>
              <button
                onClick={() => addTab(null, 'content')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <IconPlus className="w-5 h-5" />
                Add Section
              </button>
              <button
                onClick={() => addTab(null, 'assignment')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <IconClipboard className="w-5 h-5" />
                Add Assignment
              </button>
            </div>
          )}
        </nav>

        {/* Content Area */}
        <main className="flex-1 bg-white">
          {renderContent()}
        </main>
      </div>

      {/* Modal for Adding Students */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-4">Select Students</h2>

            {/* Scrollable User List */}
            <div className="border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex justify-between items-center p-3 border-b ${
                      selectedUsers.has(user.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                    } cursor-pointer`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <span className="text-black">{user.firstName} {user.lastName}</span>
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}