import React, { useContext, useEffect, useState} from 'react';
import "../../styles/BrowseProject.css";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTag } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { AppContext } from '../../context/Appcontext';

export default function BrowseProjects() {

    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [projects, setProjects] = useState([]);

    // ----------------------------------------------------------------
    // 1) UNIVERSAL FUNCTION → applies CATEGORY FILTERS to any list
    // ----------------------------------------------------------------
    const applyFilters = (list) => {
        let result = [...list];

        if (selectedCategories.length > 0) {
            result = result.filter((p) => selectedCategories.includes(p.category));
        }

        setFilteredProjects(result);
    };

    // ----------------------------------------------------------------
    // 2) FETCH PROJECTS on page load + when categories change
    // ----------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {};

                if (selectedCategories.length > 0) {
                    params.category = selectedCategories;
                }

                const response = await axios.get(
                    `${backendUrl}/api/project/getProjects`,
                    { params }
                );

                const data = response.data;

                const projectsArray = Array.isArray(data)
                    ? data
                    : data.projects || data.projectsData || data.result || [];

                setProjects(projectsArray);
                applyFilters(projectsArray);

            } catch (err) {
                console.error("Error fetching projects:", err);
                setProjects([]);
                setFilteredProjects([]);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backendUrl, selectedCategories]);

    // ----------------------------------------------------------------
    // 3) SEARCH BUTTON → Fetch + apply category filters
    // ----------------------------------------------------------------
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            // Empty search → apply filters on full project list
            applyFilters(projects);
            return;
        }

        try {
            const encoded = encodeURIComponent(searchQuery);

            const res = await axios.get(
                `${backendUrl}/api/project/searchProjects?q=${encoded}`
            );

            applyFilters(res.data);  // search + filter both

        } catch (err) {
            console.error("Search error:", err);
        }
    };

    // ----------------------------------------------------------------
    // 4) CATEGORY CHECKBOX CHANGE
    // ----------------------------------------------------------------
    const handleCategoryChange = (e) => {
        const value = e.target.value;

        setSelectedCategories((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    // ----------------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------------
    return (
        <>
            <Navbar />
            <br /><br />

            <div className="main-container-browse-projects">

                {/* FILTER SIDEBAR */}
                <div className="filters">
                    <h2 className="filters-title">
                        <FontAwesomeIcon icon={faTag} /> Filters
                    </h2>

                    <div className="filter-section">
                        <h3>Categories</h3>
                        <ul className="category-list">

                            {[
                                "Web Development",
                                "Mobile Apps",
                                "Full Stack Development",
                                "Graphic Design",
                                "UI/UX Design",
                                "Logo Design",
                                "Video Editing",
                                "Content Writing",
                                "SEO",
                                "Social Media Marketing",
                                "AI / Machine Learning",
                                "Data Science",
                                "Data Entry",
                            ].map((cat, i) => (
                                <li key={i}>
                                    <input
                                        value={cat}
                                        type="checkbox"
                                        id={`cat-${i}`}
                                        onChange={handleCategoryChange}
                                        checked={selectedCategories.includes(cat)}
                                    />
                                    <label htmlFor={`cat-${i}`}>{cat}</label>
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>

                {/* PROJECT AREA */}
                <div className="applyFor-projects">
                    <h1>Find the Projects that match your skills</h1>

                    {/* SEARCH BAR */}
                    <div className="search-projects">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />

                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="search-input"
                            type="text"
                            placeholder="Search Projects (e.g., React, Logo Design)"
                        />

                        <button onClick={handleSearch} className="search-btn">
                            Search
                        </button>
                    </div>

                    {/* PROJECT LIST */}
                    <div className="projects-list">

                        {filteredProjects.length === 0 ? (
                            <div className="no-projects">
                                <h2>No projects available</h2>
                                <p>Try searching or adjusting filters.</p>
                            </div>
                        ) : (
                            filteredProjects.map((p) => (
                                <div className="project-card" key={p._id}>
                                    <div className="card-header">
                                        <h3 className="project-title">{p.title}</h3>
                                        <span className="project-category">{p.category}</span>
                                    </div>

                                    <p className="project-description">
                                        {p.description}
                                    </p>

                                    <div className="project-meta">
                                        <span className="meta-item price-tag">
                                            ₹{p.budget}
                                        </span>
                                    </div>

                                    <button
                                        className="apply-btn"
                                        onClick={() => navigate(`/apply/${p._id}`)}
                                    >
                                        Apply Now
                                    </button>

                                </div>
                            ))
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}
