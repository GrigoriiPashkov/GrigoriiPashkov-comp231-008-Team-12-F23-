import React from "react";
import "../styles/tagInput.css";

export const TagInput = ({ selectedTags, setSelectedTags }) => {
  const availableTags = ["party", "bar", "sport", "walking"];

  const toggleTag = (tag, e) => {
    e.preventDefault();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="tag-input-container">
      <div className="tags-container">
        {availableTags.map((tag, index) => (
          <button
            key={index}
            className={`tag-item ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={(e) => toggleTag(tag, e)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
