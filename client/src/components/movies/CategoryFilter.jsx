import { useState } from 'react';

const CategoryFilter = ({ onCategoryChange }) => {
  const [selected, setSelected] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science Fiction' },
    { id: '10770', name: 'TV Movie' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'War' },
    { id: '37', name: 'Western' },
  ];

  const handleChange = (categoryId) => {
    setSelected(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${
              selected === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;