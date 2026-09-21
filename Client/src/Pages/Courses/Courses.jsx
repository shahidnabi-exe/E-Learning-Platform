import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Compass, RotateCcw } from "lucide-react";
import { CourseData } from "../../Context/CourseContext";
import CourseCard from "../../Components/CourseCard/CourseCard";
import EmptyState from "../../Components/UI/EmptyState";
import SkeletonLoader from "../../Components/UI/SkeletonLoader";
import "./courses.css";

function Courses() {
  const { courses, loading } = CourseData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const selectedCategory = searchParams.get("category") || "All";
  const [sortBy, setSortBy] = useState("newest");

  // Extract unique categories from real courses
  const categories = useMemo(() => {
    const list = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  }, [courses]);

  const handleCategorySelect = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesCategory =
          selectedCategory === "All" ||
          (c.category && c.category.toLowerCase() === selectedCategory.toLowerCase());

        const query = searchTerm.toLowerCase();
        const matchesSearch =
          c.title?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query) ||
          c.instructor?.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "duration-asc") {
          return (a.duration || 0) - (b.duration || 0);
        }
        if (sortBy === "duration-desc") {
          return (b.duration || 0) - (a.duration || 0);
        }
        if (sortBy === "price-asc") {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === "price-desc") {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
  }, [courses, selectedCategory, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    handleCategorySelect("All");
    setSortBy("newest");
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <span
          style={{
            color: "var(--gold-primary)",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Explore Knowledge
        </span>
        <h1>Course Catalog</h1>
        <p>Discover industry-grade technical courses crafted to elevate your career.</p>
      </div>

      {/* Filter and Search Controls */}
      <div className="catalog-controls">
        <div className="catalog-search-row">
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by course title, topic, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-select-wrap">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${
                selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="catalog-stats-bar">
        <span>
          Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> courses
        </span>
        {(searchTerm || selectedCategory !== "All") && (
          <button
            onClick={resetFilters}
            className="btn-secondary btn-sm"
            style={{ gap: "6px" }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Course Grid */}
      {loading ? (
        <SkeletonLoader type="card-grid" count={6} />
      ) : filteredCourses.length > 0 ? (
        <div className="catalog-grid animate-fade-in">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No courses match your criteria"
          description="Try modifying your search keywords or switching category filters."
          actionLabel="Clear All Filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}

export default Courses;