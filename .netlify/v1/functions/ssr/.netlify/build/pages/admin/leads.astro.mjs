import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
import { i as isSupabaseConfigured, s as supabase } from '../../chunks/supabase_oEJHkwy9.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState, useEffect, useCallback } from 'react';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

function SearchFilter({
  filters,
  onFilterChange,
  onSearch,
  searchPlaceholder = "Search...",
  showSearch = true,
  showClearAll = true,
  className = "",
  layout = "horizontal",
  debounceDelay = 300
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [debounceTimer, setDebounceTimer] = useState(null);
  useEffect(() => {
    const initialValues = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== void 0) {
        initialValues[filter.id] = filter.defaultValue;
      }
    });
    setFilterValues(initialValues);
  }, [filters]);
  const debouncedCallback = useCallback(
    (callback) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const timer = setTimeout(callback, debounceDelay);
      setDebounceTimer(timer);
    },
    [debounceTimer, debounceDelay]
  );
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      debouncedCallback(() => onSearch(value));
    }
  };
  const handleFilterChange = (filterId, value) => {
    const newFilterValues = { ...filterValues, [filterId]: value };
    setFilterValues(newFilterValues);
    debouncedCallback(() => onFilterChange(newFilterValues));
  };
  const handleClearAll = () => {
    setSearchTerm("");
    setFilterValues({});
    onFilterChange({});
    if (onSearch) {
      onSearch("");
    }
  };
  const hasActiveFilters = () => {
    return searchTerm !== "" || Object.keys(filterValues).some((key) => {
      const value = filterValues[key];
      return value !== void 0 && value !== "" && value !== null;
    });
  };
  const renderFilter = (filter) => {
    const value = filterValues[filter.id];
    switch (filter.type) {
      case "text":
        return /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            value: value || "",
            onChange: (e) => handleFilterChange(filter.id, e.target.value),
            placeholder: filter.placeholder,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 114,
            columnNumber: 11
          },
          this
        );
      case "select":
        return /* @__PURE__ */ jsxDEV(
          "select",
          {
            value: value || "",
            onChange: (e) => handleFilterChange(filter.id, e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "", children: filter.placeholder || "Select..." }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
                lineNumber: 130,
                columnNumber: 13
              }, this),
              filter.options?.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: [
                option.label,
                option.count !== void 0 && ` (${option.count})`
              ] }, option.value, true, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
                lineNumber: 132,
                columnNumber: 15
              }, this))
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 125,
            columnNumber: 11
          },
          this
        );
      case "multiselect":
        return /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: filter.options?.map((option) => /* @__PURE__ */ jsxDEV("label", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "checkbox",
              checked: (value || []).includes(option.value),
              onChange: (e) => {
                const currentValues = value || [];
                const newValues = e.target.checked ? [...currentValues, option.value] : currentValues.filter((v) => v !== option.value);
                handleFilterChange(filter.id, newValues);
              },
              className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
              lineNumber: 145,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-sm", children: [
            option.label,
            option.count !== void 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-gray-500 ml-1", children: [
              "(",
              option.count,
              ")"
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
              lineNumber: 160,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 157,
            columnNumber: 17
          }, this)
        ] }, option.value, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
          lineNumber: 144,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
          lineNumber: 142,
          columnNumber: 11
        }, this);
      case "date":
        return /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "date",
            value: value || "",
            onChange: (e) => handleFilterChange(filter.id, e.target.value),
            min: filter.min,
            max: filter.max,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 170,
            columnNumber: 11
          },
          this
        );
      case "daterange":
        return /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "date",
              value: value?.start || "",
              onChange: (e) => handleFilterChange(filter.id, { ...value, start: e.target.value }),
              min: filter.min,
              max: filter.max,
              placeholder: "Start",
              className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
              lineNumber: 183,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "date",
              value: value?.end || "",
              onChange: (e) => handleFilterChange(filter.id, { ...value, end: e.target.value }),
              min: filter.min,
              max: filter.max,
              placeholder: "End",
              className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
              lineNumber: 194,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this);
      case "number":
        return /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "number",
            value: value || "",
            onChange: (e) => handleFilterChange(filter.id, e.target.value),
            min: filter.min,
            max: filter.max,
            placeholder: filter.placeholder,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 210,
            columnNumber: 11
          },
          this
        );
      case "boolean":
        return /* @__PURE__ */ jsxDEV("label", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "checkbox",
              checked: value || false,
              onChange: (e) => handleFilterChange(filter.id, e.target.checked),
              className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
              lineNumber: 224,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-sm", children: filter.placeholder || filter.label }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 230,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
          lineNumber: 223,
          columnNumber: 11
        }, this);
      default:
        return null;
    }
  };
  const containerClasses = {
    horizontal: "flex flex-wrap items-end gap-4",
    vertical: "space-y-4",
    compact: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  };
  return /* @__PURE__ */ jsxDEV("div", { className: `${className}`, children: /* @__PURE__ */ jsxDEV("div", { className: containerClasses[layout], children: [
    showSearch && /* @__PURE__ */ jsxDEV("div", { className: layout === "horizontal" ? "flex-1 min-w-[200px]" : "w-full", children: [
      /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Search" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
        lineNumber: 250,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            value: searchTerm,
            onChange: handleSearchChange,
            placeholder: searchPlaceholder,
            className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 254,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "svg",
          {
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsxDEV(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
                lineNumber: 267,
                columnNumber: 17
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 261,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
        lineNumber: 253,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
      lineNumber: 249,
      columnNumber: 11
    }, this),
    filters.map((filter) => /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: layout === "horizontal" ? filter.type === "multiselect" ? "min-w-[200px]" : "min-w-[150px]" : "w-full",
        children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: filter.label }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
            lineNumber: 289,
            columnNumber: 13
          }, this),
          renderFilter(filter)
        ]
      },
      filter.id,
      true,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
        lineNumber: 279,
        columnNumber: 11
      },
      this
    )),
    showClearAll && hasActiveFilters() && /* @__PURE__ */ jsxDEV("div", { className: layout === "horizontal" ? "flex items-end" : "w-full", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: handleClearAll,
        className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
        children: "Clear All"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
        lineNumber: 298,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
      lineNumber: 297,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
    lineNumber: 247,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter.tsx",
    lineNumber: 246,
    columnNumber: 5
  }, this);
}

function StatusBadge({
  variant = "default",
  size = "md",
  children,
  icon,
  dot = false,
  pulse = false,
  rounded = false,
  className = "",
  onClick
}) {
  const variantStyles = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-indigo-100 text-indigo-800 border-indigo-200",
    secondary: "bg-purple-100 text-purple-800 border-purple-200"
  };
  const dotColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    default: "bg-gray-500",
    primary: "bg-indigo-500",
    secondary: "bg-purple-500"
  };
  const sizeStyles = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-sm",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };
  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  const dotSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3"
  };
  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium border
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${rounded ? "rounded-full" : "rounded-md"}
    ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
    ${className}
  `;
  return /* @__PURE__ */ jsxDEV("span", { className: baseClasses, onClick, children: [
    dot && /* @__PURE__ */ jsxDEV("span", { className: "relative flex", children: [
      /* @__PURE__ */ jsxDEV(
        "span",
        {
          className: `${dotSizes[size]} ${dotColors[variant]} rounded-full ${pulse ? "animate-ping absolute" : ""}`
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/StatusBadge.tsx",
          lineNumber: 121,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("span", { className: `${dotSizes[size]} ${dotColors[variant]} rounded-full` }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/StatusBadge.tsx",
        lineNumber: 126,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/StatusBadge.tsx",
      lineNumber: 120,
      columnNumber: 9
    }, this),
    icon && /* @__PURE__ */ jsxDEV("span", { className: iconSizes[size], children: icon }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/StatusBadge.tsx",
      lineNumber: 129,
      columnNumber: 16
    }, this),
    children
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/StatusBadge.tsx",
    lineNumber: 118,
    columnNumber: 5
  }, this);
}

function getScoreGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}
function daysSinceLastActivity(lastActivityDate) {
  const last = new Date(lastActivityDate);
  const now = /* @__PURE__ */ new Date();
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
  return diffDays;
}
function getEngagementLevel(lastActivityDate) {
  const days = daysSinceLastActivity(lastActivityDate);
  if (days <= 3) return "high";
  if (days <= 7) return "medium";
  if (days <= 30) return "low";
  return "inactive";
}
function getScoreColor(score) {
  if (score >= 80) return "text-green-600";
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-yellow-600";
  if (score >= 30) return "text-orange-600";
  return "text-red-600";
}
function getScoreBackgroundColor(score) {
  if (score >= 80) return "bg-green-100";
  if (score >= 70) return "bg-emerald-100";
  if (score >= 50) return "bg-yellow-100";
  if (score >= 30) return "bg-orange-100";
  return "bg-red-100";
}

const LeadScoreDisplay = ({
  score,
  lastActivityDate,
  showGrade = true,
  showEngagement = true,
  size = "medium",
  className = ""
}) => {
  const grade = getScoreGrade(score);
  const scoreColor = getScoreColor(score);
  const bgColor = getScoreBackgroundColor(score);
  const engagement = lastActivityDate ? getEngagementLevel(lastActivityDate) : null;
  const sizeClasses = {
    small: {
      container: "px-2 py-1",
      score: "text-lg font-semibold",
      grade: "text-xs",
      engagement: "text-xs"
    },
    medium: {
      container: "px-3 py-2",
      score: "text-2xl font-bold",
      grade: "text-sm",
      engagement: "text-sm"
    },
    large: {
      container: "px-4 py-3",
      score: "text-3xl font-bold",
      grade: "text-base",
      engagement: "text-base"
    }
  };
  const engagementColors = {
    high: "text-green-600",
    medium: "text-yellow-600",
    low: "text-orange-600",
    inactive: "text-red-600"
  };
  const engagementIcons = {
    high: "🔥",
    medium: "✨",
    low: "💤",
    inactive: "❄️"
  };
  return /* @__PURE__ */ jsxDEV("div", { className: `inline-flex items-center gap-2 ${className}`, children: [
    /* @__PURE__ */ jsxDEV("div", { className: `${bgColor} ${sizeClasses[size].container} rounded-lg flex items-center gap-2`, children: [
      /* @__PURE__ */ jsxDEV("span", { className: `${scoreColor} ${sizeClasses[size].score}`, children: score }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
        lineNumber: 70,
        columnNumber: 9
      }, undefined),
      showGrade && /* @__PURE__ */ jsxDEV("span", { className: `${scoreColor} ${sizeClasses[size].grade} font-medium`, children: [
        "(",
        grade,
        ")"
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
        lineNumber: 74,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, undefined),
    showEngagement && engagement && /* @__PURE__ */ jsxDEV("div", { className: `flex items-center gap-1 ${sizeClasses[size].engagement}`, children: [
      /* @__PURE__ */ jsxDEV("span", { children: engagementIcons[engagement] }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
        lineNumber: 83,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("span", { className: `${engagementColors[engagement]} capitalize`, children: engagement }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
        lineNumber: 84,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
      lineNumber: 82,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay.tsx",
    lineNumber: 67,
    columnNumber: 5
  }, undefined);
};

const LeadScoreBreakdown = ({
  breakdown,
  showRecommendation = true,
  compact = false,
  className = ""
}) => {
  const scoreColor = getScoreColor(breakdown.totalScore);
  const bgColor = getScoreBackgroundColor(breakdown.totalScore);
  const groupedComponents = breakdown.components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxDEV("div", { className: `bg-white rounded-lg shadow-sm ${compact ? "p-4" : "p-6"} ${className}`, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: `${compact ? "text-lg" : "text-xl"} font-semibold text-gray-900`, children: "Lead Score Breakdown" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 39,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: `${bgColor} px-3 py-1.5 rounded-lg`, children: [
          /* @__PURE__ */ jsxDEV("span", { className: `${scoreColor} text-2xl font-bold`, children: breakdown.totalScore }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
            lineNumber: 43,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { className: `${scoreColor} text-sm font-medium ml-1`, children: "/ 100" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
            lineNumber: 46,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 42,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 38,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-gray-200 rounded-full h-3", children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: `${scoreColor.replace("text-", "bg-")} h-3 rounded-full transition-all duration-500`,
          style: { width: `${breakdown.scorePercentage}%` }
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 54,
          columnNumber: 11
        },
        undefined
      ) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 53,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 37,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: `space-y-${compact ? "3" : "4"}`, children: Object.entries(groupedComponents).map(([category, components]) => /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: category }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 65,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: components.map((component, index) => /* @__PURE__ */ jsxDEV(
        ScoreComponentRow,
        {
          component,
          compact
        },
        `${category}-${index}`,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 68,
          columnNumber: 17
        },
        undefined
      )) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 66,
        columnNumber: 13
      }, undefined)
    ] }, category, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 64,
      columnNumber: 11
    }, undefined)) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, undefined),
    showRecommendation && /* @__PURE__ */ jsxDEV("div", { className: `${compact ? "mt-4 pt-4" : "mt-6 pt-6"} border-t`, children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-lg", children: "💡" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 83,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-gray-700 mb-1", children: "Recommendation" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 85,
          columnNumber: 15
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: breakdown.recommendation }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 86,
          columnNumber: 15
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 84,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 82,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 81,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
    lineNumber: 35,
    columnNumber: 5
  }, undefined);
};
const ScoreComponentRow = ({ component, compact }) => {
  const percentage = component.maxPoints ? Math.round(component.points / component.maxPoints * 100) : 0;
  return /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxDEV("p", { className: `${compact ? "text-xs" : "text-sm"} text-gray-600`, children: component.description }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, undefined),
      component.maxPoints && !compact && /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-gray-100 rounded-full h-1.5 mt-1", children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "bg-blue-600 h-1.5 rounded-full",
          style: { width: `${percentage}%` }
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
          lineNumber: 115,
          columnNumber: 13
        },
        undefined
      ) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 114,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "ml-4 text-right", children: [
      /* @__PURE__ */ jsxDEV("span", { className: `${compact ? "text-sm" : "text-base"} font-semibold text-gray-900`, children: [
        "+",
        component.points
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 123,
        columnNumber: 9
      }, undefined),
      component.maxPoints && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 ml-1", children: [
        "/ ",
        component.maxPoints
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
        lineNumber: 127,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown.tsx",
    lineNumber: 108,
    columnNumber: 5
  }, undefined);
};

const $$Astro = createAstro("https://the1031center.com");
const $$Leads = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Leads;
  let leads = null;
  let error = null;
  if (isSupabaseConfigured() && supabase) {
    const result = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100);
    leads = result.data;
    error = result.error;
    if (error) {
      console.error("Error fetching leads:", error);
    }
  }
  const formattedLeads = (leads || []).map((lead) => ({
    ...lead,
    displayScore: lead.score || 0,
    displayStatus: lead.status || "new",
    displayDate: new Date(lead.created_at).toLocaleDateString(),
    displayTime: new Date(lead.created_at).toLocaleTimeString()
  })) || [];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Leads Management", "data-astro-cid-2mpdhbgy": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8" data-astro-cid-2mpdhbgy> <div class="max-w-7xl mx-auto" data-astro-cid-2mpdhbgy> <!-- Header --> <div class="flex justify-between items-center mb-8" data-astro-cid-2mpdhbgy> <div data-astro-cid-2mpdhbgy> <h1 class="text-3xl font-bold" data-astro-cid-2mpdhbgy>Leads Management</h1> <p class="text-gray-600 mt-2" data-astro-cid-2mpdhbgy>View and manage all captured leads with automated scoring</p> </div> <div class="flex gap-4" data-astro-cid-2mpdhbgy> <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-astro-cid-2mpdhbgy>
Export Leads
</button> </div> </div> <!-- Stats Cards --> <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-astro-cid-2mpdhbgy> <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200" data-astro-cid-2mpdhbgy> <div class="flex items-center justify-between" data-astro-cid-2mpdhbgy> <div data-astro-cid-2mpdhbgy> <p class="text-sm text-gray-600" data-astro-cid-2mpdhbgy>Total Leads</p> <p class="text-2xl font-bold" data-astro-cid-2mpdhbgy>${leads?.length || 0}</p> </div> <div class="text-3xl" data-astro-cid-2mpdhbgy>👥</div> </div> </div> <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200" data-astro-cid-2mpdhbgy> <div class="flex items-center justify-between" data-astro-cid-2mpdhbgy> <div data-astro-cid-2mpdhbgy> <p class="text-sm text-gray-600" data-astro-cid-2mpdhbgy>Hot Leads (80+)</p> <p class="text-2xl font-bold" data-astro-cid-2mpdhbgy>${leads?.filter((l) => l.score >= 80).length || 0}</p> </div> <div class="text-3xl" data-astro-cid-2mpdhbgy>🔥</div> </div> </div> <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200" data-astro-cid-2mpdhbgy> <div class="flex items-center justify-between" data-astro-cid-2mpdhbgy> <div data-astro-cid-2mpdhbgy> <p class="text-sm text-gray-600" data-astro-cid-2mpdhbgy>Avg Score</p> <p class="text-2xl font-bold" data-astro-cid-2mpdhbgy> ${leads?.length > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length) : 0} </p> </div> <div class="text-3xl" data-astro-cid-2mpdhbgy>📊</div> </div> </div> <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200" data-astro-cid-2mpdhbgy> <div class="flex items-center justify-between" data-astro-cid-2mpdhbgy> <div data-astro-cid-2mpdhbgy> <p class="text-sm text-gray-600" data-astro-cid-2mpdhbgy>Today's Leads</p> <p class="text-2xl font-bold" data-astro-cid-2mpdhbgy> ${leads?.filter((l) => {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    return new Date(l.created_at).toDateString() === today;
  }).length || 0} </p> </div> <div class="text-3xl" data-astro-cid-2mpdhbgy>📅</div> </div> </div> </div> <!-- Search and Filters --> <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6" data-astro-cid-2mpdhbgy> ${renderComponent($$result2, "SearchFilter", SearchFilter, { "placeholder": "Search by name, email, or phone...", "filters": [
    {
      label: "Score Range",
      options: [
        { value: "all", label: "All Scores" },
        { value: "hot", label: "Hot (80+)" },
        { value: "warm", label: "Warm (50-79)" },
        { value: "cold", label: "Cold (<50)" }
      ]
    },
    {
      label: "Status",
      options: [
        { value: "all", label: "All Status" },
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "qualified", label: "Qualified" },
        { value: "converted", label: "Converted" }
      ]
    }
  ], "onSearch": (query) => console.log("Search:", query), "onFilterChange": (filters) => console.log("Filters:", filters), "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/SearchFilter", "client:component-export": "SearchFilter", "data-astro-cid-2mpdhbgy": true })} </div> <!-- Leads Table --> <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-astro-cid-2mpdhbgy> ${isSupabaseConfigured() && renderTemplate`<table class="min-w-full divide-y divide-gray-200" data-astro-cid-2mpdhbgy> <thead class="bg-gray-50" data-astro-cid-2mpdhbgy> <tr data-astro-cid-2mpdhbgy> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Email</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Phone</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Score</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Date</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-astro-cid-2mpdhbgy>Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200" data-astro-cid-2mpdhbgy> ${formattedLeads.map((lead) => renderTemplate`<tr data-astro-cid-2mpdhbgy> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" data-astro-cid-2mpdhbgy> ${lead.name || "N/A"} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-astro-cid-2mpdhbgy> ${lead.email || "N/A"} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-astro-cid-2mpdhbgy> ${lead.phone || "N/A"} </td> <td class="px-6 py-4 whitespace-nowrap" data-astro-cid-2mpdhbgy> ${renderComponent($$result2, "LeadScoreDisplay", LeadScoreDisplay, { "score": lead.displayScore, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreDisplay", "client:component-export": "LeadScoreDisplay", "data-astro-cid-2mpdhbgy": true })} </td> <td class="px-6 py-4 whitespace-nowrap" data-astro-cid-2mpdhbgy> ${renderComponent($$result2, "StatusBadge", StatusBadge, { "status": lead.displayStatus, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/common/StatusBadge", "client:component-export": "StatusBadge", "data-astro-cid-2mpdhbgy": true })} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-astro-cid-2mpdhbgy> ${lead.displayDate} </td> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" data-astro-cid-2mpdhbgy> <div class="flex gap-2" data-astro-cid-2mpdhbgy> <a${addAttribute(`/admin/leads/${lead.id}`, "href")} class="text-blue-600 hover:text-blue-800" data-astro-cid-2mpdhbgy>
View
</a> <button class="text-gray-600 hover:text-gray-800" data-astro-cid-2mpdhbgy>
Contact
</button> </div> </td> </tr>`)} </tbody> </table>`} ${!isSupabaseConfigured() && renderTemplate`<div class="text-center py-8" data-astro-cid-2mpdhbgy> <p class="text-gray-500" data-astro-cid-2mpdhbgy>Database connection not configured. Please set up Supabase environment variables.</p> </div>`} ${isSupabaseConfigured() && formattedLeads.length === 0 && renderTemplate`<div class="text-center py-8" data-astro-cid-2mpdhbgy> <p class="text-gray-500" data-astro-cid-2mpdhbgy>No leads found</p> </div>`} </div>  <div class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg" data-astro-cid-2mpdhbgy> <h2 class="text-lg font-semibold text-blue-900 mb-2" data-astro-cid-2mpdhbgy>Lead Scoring System Active</h2> <p class="text-blue-800 mb-4" data-astro-cid-2mpdhbgy>
Leads are automatically scored based on their interactions:
</p> ${renderComponent($$result2, "LeadScoreBreakdown", LeadScoreBreakdown, { "breakdown": {
    totalScore: 78,
    components: [
      { category: "Calculator Completion", description: "Completed tax savings calculator", points: 20 },
      { category: "Appointment Booking", description: "Scheduled consultation", points: 30 },
      { category: "Document Upload", description: "Uploaded property documents", points: 10 },
      { category: "Form Submission", description: "Submitted contact form", points: 15 },
      { category: "Email Engagement", description: "Opened marketing emails", points: 2 },
      { category: "Website Activity", description: "Visited multiple pages", points: 1 }
    ],
    scorePercentage: 78,
    scoreGrade: "B",
    recommendation: "High-quality lead ready for immediate follow-up"
  }, "showRecommendation": true, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/LeadScoreBreakdown", "client:component-export": "LeadScoreBreakdown", "data-astro-cid-2mpdhbgy": true })} </div> </div> </main> ` })} `;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/leads.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/leads.astro";
const $$url = "/admin/leads";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Leads,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
