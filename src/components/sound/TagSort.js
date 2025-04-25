// src/components/TagSort.jsx
import React from 'react';
import icons from 'assets/images/imageBarrel';

const TagSort = ({
  data,
  sectionVisibility,
  activeTags,
  onToggleSection,
  onTagClick
}) => {
  const labels = { instrument: "악기", mood: "분위기", genre: "장르" };

  const renderTagItem = (tag, type) => {
    const isActive = activeTags[type].has(tag);
    return (
      <span
        key={tag}
        className={`tag-item${isActive ? " active" : ""}`}
        data-type={type}
        data-value={tag}
        style={{ order: isActive ? -1 : "initial" }}
        onClick={() => onTagClick(type, tag)}
      >
        {tag}
      </span>
    );
  };

  return (
    <div className="music-tag-sort">
      <div className="music-tag-sort-list">
        {["instrument","mood","genre"].map(type => (
          <React.Fragment key={type}>
            <img src={icons.labelIcon} alt="태그" />
            <span
              className="music-tag-sort-toggle"
              onClick={() => onToggleSection(type)}
            >
              {sectionVisibility[type] === "open"
                ? `${labels[type]} 접기`
                : `${labels[type]} 펼치기`}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="music-tag-display">
        {["instrument","mood","genre"].map(type => {
          const state = sectionVisibility[type];
          const classes = ["tag-section"];
          if (state === "closing") classes.push("fade-out");
          if (state === "closed")  classes.push("hidden");
          
          if (!data?.dto) return null;

          return (
            <div
              key={type}
              className={classes.join(" ")}
              onAnimationEnd={() => {
                if (state === "closing") {
                  onToggleSection(type, true);
                }
              }}
            >
              {data?.dto[type]?.map(tag => renderTagItem(tag, type))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagSort;
