import { Search, Book, Users, FileText } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

const SearchDropdown = ({ userRole, placeholder = "Search..." }) => {
  const {
    searchTerm,
    searchResults,
    showResults,
    handleSearchChange,
    handleResultClick,
    handleBlur,
    handleFocus
  } = useSearch(userRole);

  const getIcon = (type) => {
    switch (type) {
      case 'course':
        return <Book className="w-4 h-4 text-purple-500" />;
      case 'user':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'resource':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'course':
        return 'Course';
      case 'user':
        return 'User';
      case 'resource':
        return 'Resource';
      default:
        return 'Item';
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Search Results</p>
              </div>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id || index}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {getIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.displayName || result.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {result.description || result.email}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {getTypeLabel(result.type)}
                  </span>
                </button>
              ))}
            </>
          ) : searchTerm ? (
            <div className="p-4 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
