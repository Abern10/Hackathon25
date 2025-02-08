'use client'

import { useState } from 'react';
import { IconEdit, IconPlus, IconTrash, IconCheck } from '@tabler/icons-react';

interface Tab {
  id: string;
  label: string;
  content: string;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('Introduction to Data Science');
  const [courseCode, setCourseCode] = useState('CS 418');

  const addTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      label: 'New Section',
      content: ''
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (tabId: string) => {
    setTabs(tabs.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab(tabs[0]?.id || null);
    }
  };

  const updateTab = (tabId: string, field: 'label' | 'content', value: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, [field]: value } : tab
    ));
  };

  const renderContent = () => {
    if (tabs.length === 0) {
      return (
        <div className="text-center text-gray-500 pt-8">
          No sections added yet. Click edit to add course content.
        </div>
      );
    }

    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    if (isEditing) {
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

    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">{currentTab.label}</h2>
        <div className="prose text-black">
          {currentTab.content || 'No content available'}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Course Header */}
      <header className="bg-white p-6 border-b relative">
        <div className="max-w-7xl mx-auto">
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
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isEditing ? (
            <IconCheck className="w-6 h-6 text-green-600" />
          ) : (
            <IconEdit className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r flex flex-col">
          <div className="p-4 flex-1">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center group">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center px-4 py-3 rounded-lg text-left
                    transition-colors duration-150 ease-in-out
                    ${activeTab === tab.id 
                      ? 'bg-gray-100 text-black font-semibold' 
                      : 'text-black hover:bg-gray-50'}
                  `}
                >
                  {tab.label}
                </button>
                {isEditing && (
                  <button
                    onClick={() => removeTab(tab.id)}
                    className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="p-4 border-t">
              <button
                onClick={addTab}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <IconPlus className="w-5 h-5" />
                Add Section
              </button>
            </div>
          )}
        </nav>

        {/* Content Area */}
        <main className="flex-1 bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}