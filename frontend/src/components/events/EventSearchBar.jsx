import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const EventSearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    location: '',
    upcomingOnly: false
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    // Appeler onSearch immédiatement quand un filtre change
    if (onSearch) {
      onSearch(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      category: '',
      location: '',
      upcomingOnly: false
    };
    setFilters(resetFilters);
    if (onSearch) {
      onSearch(resetFilters);
    }
  };

  const hasFilters = filters.keyword || filters.category || filters.location || filters.upcomingOnly;

  return (
    <div className="glass-effect rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            name="keyword"
            placeholder="Rechercher un événement..."
            value={filters.keyword}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-600 transition-all"
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl hover:border-primary-600 transition-all"
        >
          <Filter className="w-5 h-5 text-primary-600" />
          <span>Filtres</span>
        </button>
        
        {hasFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl hover:border-red-500 transition-all"
          >
            <X className="w-5 h-5" />
            <span>Reset</span>
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
          <input
            type="text"
            name="location"
            placeholder="Lieu"
            value={filters.location}
            onChange={handleChange}
            className="px-4 py-2 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-600"
          />
          
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="px-4 py-2 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
          >
            <option value="">Toutes catégories</option>
            <option value="Conference">Conférence</option>
            <option value="Workshop">Atelier</option>
            <option value="Social">Social</option>
            <option value="Sport">Sport</option>
            <option value="Culture">Culture</option>
            <option value="Musique">Musique</option>
          </select>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="upcomingOnly"
              checked={filters.upcomingOnly}
              onChange={handleChange}
              className="w-4 h-4 accent-primary-600"
            />
            <span className="text-slate-300">Événements à venir</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default EventSearchBar;