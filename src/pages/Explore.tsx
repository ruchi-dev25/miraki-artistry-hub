import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, Calendar, DollarSign } from 'lucide-react';
import Layout from '@/components/Layout';
import FilterBar from '@/components/FilterBar';
import ArtworkGrid from '@/components/ArtworkGrid';
import ArtworkModal from '@/components/ArtworkModal';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useArtworks from '@/hooks/useArtworks';
import useExploreFilters from '@/hooks/useExploreFilters';

const Explore: React.FC = () => {
  const {
    artworks,
    filteredArtworks,
    paginatedArtworks,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    selectedArtwork,
    modalOpen,
    viewArtworkDetails,
    closeArtworkModal,
    navigateArtwork,
    filters,
    updateFilters,
    sortBy,
    setSortBy,
    priceRange,
    setActivePriceRange,
    dateRange,
    setActiveDateRange
  } = useArtworks();

  const {
    sortOptions,
    activeSortOption,
    setSortOption,
    toggleAdvancedFilters,
    showAdvancedFilters,
    resetAllFilters,
    mumbaiAreas
  } = useExploreFilters();

  // Update the main hook's state when filter hook state changes
  useEffect(() => {
    setSortBy(activeSortOption);
  }, [activeSortOption, setSortBy]);

  // Animation states
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after page load
    setIsPageLoaded(true);
  }, []);

  return (
    <Layout>
      {/* Page Header */}
      <section id="explore" className={`page-section pt-24 pb-4 bg-gradient-to-r from-mirakiBlue-50 to-mirakiGray-100 dark:from-mirakiBlue-900 dark:to-mirakiBlue-800 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-mirakiBlue-900 dark:text-white">
              Explore Artworks
            </h1>
            <p className="text-mirakiBlue-600 dark:text-mirakiGray-300 text-lg mb-8">
              Discover unique artworks from talented artists across Mumbai. Filter, sort, and find the perfect piece for your collection.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="page-section py-8">
        <div className="container-fluid">
          
          {/* Search and Main Filters */}
          <div className={`mb-8 transition-transform duration-500 ${isPageLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-2xl w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={20} className="text-mirakiBlue-400 dark:text-mirakiGray-500" />
                </div>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                  placeholder="Search artworks by title, artist, or description..."
                  className="w-full pl-10 py-3 bg-white dark:bg-mirakiBlue-800 border border-mirakiGray-200 dark:border-mirakiBlue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-mirakiBlue-500 dark:focus:ring-mirakiGold text-mirakiBlue-900 dark:text-white transition-all duration-300"
                />
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={toggleAdvancedFilters}
                className="flex items-center space-x-2 hover-lift"
              >
                <SlidersHorizontal size={18} />
                <span>Advanced Filters</span>
              </Button>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 hover-lift"
                  >
                    <ArrowUpDown size={18} />
                    <span>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-mirakiBlue-800 border-mirakiGray-200 dark:border-mirakiBlue-700 p-2 w-56 z-50 shadow-lg">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortOption(option.value)}
                      className={`px-3 py-2 text-sm rounded-md hover:bg-mirakiGray-100 dark:hover:bg-mirakiBlue-700 cursor-pointer ${
                        activeSortOption === option.value
                          ? 'bg-mirakiGray-200 dark:bg-mirakiBlue-700 font-medium'
                          : ''
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <Card className={`mb-8 animate-fade-in`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <span className="mr-2">Categories</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <FilterBar 
                        filters={filters} 
                        updateFilters={updateFilters} 
                        totalArtworks={filteredArtworks.length} 
                        compact={true}
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      <span>Price Range</span>
                    </h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 5000]}
                        max={5000}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setActivePriceRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm text-mirakiBlue-600 dark:text-mirakiGray-400">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>Date Added</span>
                    </h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 12]}
                        max={12}
                        step={1}
                        value={dateRange}
                        onValueChange={(value) => setActiveDateRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm text-mirakiBlue-600 dark:text-mirakiGray-400">
                        <span>{dateRange[0]} months ago</span>
                        <span>{dateRange[1]} months ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>Location</span>
                    </h3>
                    <Select 
                      value={filters.location} 
                      onValueChange={(value) => updateFilters({ location: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {mumbaiAreas.map(area => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-end mt-6 pt-4 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
                  <Button
                    variant="outline"
                    onClick={resetAllFilters}
                    className="mr-2"
                  >
                    Reset All
                  </Button>
                  <Button
                    onClick={toggleAdvancedFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-mirakiBlue-800 dark:text-mirakiGray-200">
              <span className="font-medium">{filteredArtworks.length}</span> artworks found
            </div>
          </div>

          {/* Artwork Grid */}
          <div className={`transition-opacity duration-700 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {filteredArtworks.length > 0 ? (
              <ArtworkGrid 
                artworks={paginatedArtworks} 
                loading={loading} 
                onArtworkClick={viewArtworkDetails}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showFavoriteButton={true}
              />
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-3">
                  No artworks found
                </h3>
                <p className="text-mirakiBlue-600 dark:text-mirakiGray-400 max-w-md mx-auto mb-8">
                  Try adjusting your filters or search criteria to find artworks.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Artwork Modal */}
      <ArtworkModal 
        artwork={selectedArtwork} 
        isOpen={modalOpen}
        onClose={closeArtworkModal}
        onNavigate={navigateArtwork}
      />
    </Layout>
  );
};

export default Explore;
