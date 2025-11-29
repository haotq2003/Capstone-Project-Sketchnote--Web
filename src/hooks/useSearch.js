import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearch = (userRole) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration - replace with actual data from your app state
  const mockData = {
    admin: [
      { id: 1, name: 'React Course', description: 'Learn React from scratch', type: 'course', path: '/admin/courses/1' },
      { id: 2, name: 'Vue Course', description: 'Master Vue.js', type: 'course', path: '/admin/courses/2' },
      { id: 3, name: 'John Doe', email: 'john@example.com', type: 'user', displayName: 'John Doe', path: '/admin/users/1' },
      { id: 4, name: 'Jane Smith', email: 'jane@example.com', type: 'user', displayName: 'Jane Smith', path: '/admin/users/2' },
    ],
    staff: [
      { id: 1, name: 'React Course', description: 'Learn React from scratch', type: 'course', path: '/staff/courses/1' },
      { id: 2, name: 'Vue Course', description: 'Master Vue.js', type: 'course', path: '/staff/courses/2' },
      { id: 3, name: 'Angular Course', description: 'Angular fundamentals', type: 'course', path: '/staff/courses/3' },
    ],
    designer: [
      { id: 1, name: 'UI Kit Template', description: 'Modern UI components', type: 'resource', path: '/designer/resources/1' },
      { id: 2, name: 'Dashboard Template', description: 'Admin dashboard design', type: 'resource', path: '/designer/resources/2' },
      { id: 3, name: 'Mobile App Template', description: 'React Native template', type: 'resource', path: '/designer/resources/3' },
    ]
  };

  const performSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const data = mockData[userRole] || [];
    const results = data.filter(item => {
      const searchFields = [
        item.name,
        item.description,
        item.displayName,
        item.email
      ].filter(Boolean);
      
      return searchFields.some(field => 
        field.toLowerCase().includes(term.toLowerCase())
      );
    });

    setSearchResults(results.slice(0, 8));
    setShowResults(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, userRole]);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm('');
    navigate(result.path);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  const handleFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return {
    searchTerm,
    searchResults,
    showResults,
    handleSearchChange,
    handleResultClick,
    handleBlur,
    handleFocus,
    setSearchTerm
  };
};
