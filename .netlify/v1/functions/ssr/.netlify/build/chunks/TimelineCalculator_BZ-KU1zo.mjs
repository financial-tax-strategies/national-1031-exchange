import { jsxDEV, Fragment } from 'react/jsx-dev-runtime';
import { useState, useEffect } from 'react';

const IDENTIFICATION_RULES = {
  "3-property": {
    type: "3-property",
    description: "3-Property Rule",
    requirements: "Identify up to 3 properties of any value"
  },
  "200-percent": {
    type: "200-percent",
    description: "200% Rule",
    requirements: "Identify unlimited properties if total value doesn't exceed 200% of sale price"
  },
  "95-percent": {
    type: "95-percent",
    description: "95% Rule",
    requirements: "Identify any number of properties but must purchase 95% of identified value"
  }
};
function calculateDeadlines(saleDate) {
  const sale = new Date(saleDate);
  const now = /* @__PURE__ */ new Date();
  const identificationDeadline = new Date(sale);
  identificationDeadline.setDate(identificationDeadline.getDate() + 45);
  const purchaseDeadline = new Date(sale);
  purchaseDeadline.setDate(purchaseDeadline.getDate() + 180);
  const daysElapsed = Math.floor((now.getTime() - sale.getTime()) / (1e3 * 60 * 60 * 24));
  const daysUntilIdentification = Math.floor((identificationDeadline.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
  const daysUntilPurchase = Math.floor((purchaseDeadline.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
  let status = "pending";
  if (now < sale) {
    status = "pending";
  } else if (now > purchaseDeadline) {
    status = "expired";
  } else if (now > identificationDeadline) {
    status = "identified";
  } else {
    status = "active";
  }
  return {
    saleDate: formatDate(sale),
    identificationDeadline: formatDate(identificationDeadline),
    purchaseDeadline: formatDate(purchaseDeadline),
    daysElapsed: Math.max(0, daysElapsed),
    daysUntilIdentification,
    daysUntilPurchase,
    status
  };
}
function getDaysRemaining(deadline, currentDate = /* @__PURE__ */ new Date()) {
  const deadlineDate = new Date(deadline);
  const days = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1e3 * 60 * 60 * 24));
  const isOverdue = days < 0;
  let displayText;
  if (isOverdue) {
    displayText = `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    displayText = "Today!";
  } else if (days === 1) {
    displayText = "1 day remaining";
  } else {
    displayText = `${days} days remaining`;
  }
  return { days, isOverdue, displayText };
}
function formatDate(date) {
  return date.toISOString().split("T")[0];
}
function formatDateLong(date) {
  const d = new Date(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return d.toLocaleDateString("en-US", options);
}
function calculateProgress(saleDate, currentDate = /* @__PURE__ */ new Date()) {
  const timeline = calculateDeadlines(saleDate);
  const sale = new Date(saleDate);
  new Date(timeline.identificationDeadline);
  new Date(timeline.purchaseDeadline);
  const totalDays = 180;
  const daysElapsed = Math.floor((currentDate.getTime() - sale.getTime()) / (1e3 * 60 * 60 * 24));
  const overall = Math.min(100, Math.max(0, daysElapsed / totalDays * 100));
  const idDays = 45;
  const idProgress = Math.min(100, Math.max(0, daysElapsed / idDays * 100));
  let purchaseProgress = 0;
  if (daysElapsed > 45) {
    const purchaseDays = 135;
    const purchaseElapsed = daysElapsed - 45;
    purchaseProgress = Math.min(100, Math.max(0, purchaseElapsed / purchaseDays * 100));
  }
  return {
    overall,
    identification: idProgress,
    purchase: purchaseProgress
  };
}
function validateIdentification(properties, rule, salePrice) {
  const identifiedProperties = properties.filter((p) => p.status === "identified");
  switch (rule.type) {
    case "3-property":
      if (identifiedProperties.length > 3) {
        return {
          isValid: false,
          message: "You can only identify up to 3 properties with the 3-Property Rule"
        };
      }
      return {
        isValid: true,
        message: `${identifiedProperties.length} of 3 properties identified`
      };
    case "200-percent":
      if (!salePrice) {
        return {
          isValid: true,
          message: "Enter sale price to validate 200% rule"
        };
      }
      const totalValue = identifiedProperties.reduce((sum, p) => sum + (p.value || 0), 0);
      const maxValue = salePrice * 2;
      if (totalValue > maxValue) {
        return {
          isValid: false,
          message: `Total value ($${totalValue.toLocaleString()}) exceeds 200% of sale price ($${maxValue.toLocaleString()})`
        };
      }
      return {
        isValid: true,
        message: `Total value: $${totalValue.toLocaleString()} of $${maxValue.toLocaleString()} maximum`
      };
    case "95-percent":
      const identifiedValue = identifiedProperties.reduce((sum, p) => sum + (p.value || 0), 0);
      const purchasedValue = properties.filter((p) => p.status === "purchased").reduce((sum, p) => sum + (p.value || 0), 0);
      const requiredValue = identifiedValue * 0.95;
      return {
        isValid: purchasedValue >= requiredValue,
        message: `Must purchase $${requiredValue.toLocaleString()} (95% of identified value)`
      };
    default:
      return {
        isValid: true,
        message: "Unknown identification rule"
      };
  }
}
function generateReminderSchedule(timeline) {
  const reminders = [];
  const idDeadline = new Date(timeline.identificationDeadline);
  const id30Days = new Date(idDeadline);
  id30Days.setDate(id30Days.getDate() - 30);
  if (id30Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(id30Days),
      type: "identification",
      daysBeforeDeadline: 30,
      message: "30 days to identify replacement properties"
    });
  }
  const id14Days = new Date(idDeadline);
  id14Days.setDate(id14Days.getDate() - 14);
  if (id14Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(id14Days),
      type: "identification",
      daysBeforeDeadline: 14,
      message: "2 weeks to identify replacement properties"
    });
  }
  const id7Days = new Date(idDeadline);
  id7Days.setDate(id7Days.getDate() - 7);
  if (id7Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(id7Days),
      type: "identification",
      daysBeforeDeadline: 7,
      message: "1 week to identify replacement properties"
    });
  }
  const id1Day = new Date(idDeadline);
  id1Day.setDate(id1Day.getDate() - 1);
  if (id1Day > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(id1Day),
      type: "identification",
      daysBeforeDeadline: 1,
      message: "URGENT: Identification deadline tomorrow!"
    });
  }
  const purchaseDeadline = new Date(timeline.purchaseDeadline);
  const purchase60Days = new Date(purchaseDeadline);
  purchase60Days.setDate(purchase60Days.getDate() - 60);
  if (purchase60Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(purchase60Days),
      type: "purchase",
      daysBeforeDeadline: 60,
      message: "60 days to complete purchase"
    });
  }
  const purchase30Days = new Date(purchaseDeadline);
  purchase30Days.setDate(purchase30Days.getDate() - 30);
  if (purchase30Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(purchase30Days),
      type: "purchase",
      daysBeforeDeadline: 30,
      message: "30 days to complete purchase"
    });
  }
  const purchase14Days = new Date(purchaseDeadline);
  purchase14Days.setDate(purchase14Days.getDate() - 14);
  if (purchase14Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(purchase14Days),
      type: "purchase",
      daysBeforeDeadline: 14,
      message: "2 weeks to complete purchase"
    });
  }
  const purchase7Days = new Date(purchaseDeadline);
  purchase7Days.setDate(purchase7Days.getDate() - 7);
  if (purchase7Days > /* @__PURE__ */ new Date()) {
    reminders.push({
      date: formatDate(purchase7Days),
      type: "purchase",
      daysBeforeDeadline: 7,
      message: "1 week to complete purchase"
    });
  }
  return reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const TimelineVisualizer = ({ timeline, currentDate }) => {
  const progress = calculateProgress(timeline.saleDate, currentDate);
  const getProgressColor = (days) => {
    if (days < 0) return "bg-red-500";
    if (days <= 7) return "bg-yellow-500";
    if (days <= 30) return "bg-blue-500";
    return "bg-green-500";
  };
  const getMilestoneStatus = (date) => {
    const milestoneDate = new Date(date);
    if (currentDate > milestoneDate) return "completed";
    if (currentDate.toDateString() === milestoneDate.toDateString()) return "today";
    return "upcoming";
  };
  const saleStatus = getMilestoneStatus(timeline.saleDate);
  const idStatus = getMilestoneStatus(timeline.identificationDeadline);
  const purchaseStatus = getMilestoneStatus(timeline.purchaseDeadline);
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          "Day ",
          timeline.daysElapsed
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 35,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("span", { children: "180 Days Total" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 36,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 34,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "h-4 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: `h-full transition-all duration-500 ${timeline.status === "expired" ? "bg-red-500" : timeline.status === "identified" ? "bg-yellow-500" : timeline.status === "active" ? "bg-blue-500" : "bg-gray-400"}`,
          style: { width: `${Math.min(100, progress.overall)}%` }
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 42,
          columnNumber: 11
        },
        undefined
      ) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "relative -mt-2", children: [
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "absolute w-0.5 h-8 bg-gray-400 -top-4",
            style: { left: "25%" }
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 56,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "absolute text-xs text-gray-600 -bottom-6 transform -translate-x-1/2",
            style: { left: "25%" },
            children: "45 days"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 60,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 54,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
      lineNumber: 33,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "relative mt-12", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-5 left-0 right-0 h-0.5 bg-gray-300" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 72,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "relative flex justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: `
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${saleStatus === "completed" ? "bg-green-500" : saleStatus === "today" ? "bg-blue-500 animate-pulse" : "bg-gray-400"}
            `, children: "0" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 78,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm font-semibold text-gray-900", children: "Sale Closes" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 86,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-600", children: formatDateLong(timeline.saleDate) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 87,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 77,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: `
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${idStatus === "completed" ? "bg-green-500" : idStatus === "today" ? "bg-red-500 animate-pulse" : getProgressColor(timeline.daysUntilIdentification)}
            `, children: "45" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 92,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm font-semibold text-gray-900", children: "ID Deadline" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 100,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-600", children: formatDateLong(timeline.identificationDeadline) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 101,
            columnNumber: 13
          }, undefined),
          idStatus === "upcoming" && /* @__PURE__ */ jsxDEV("p", { className: `text-xs font-semibold mt-1 ${timeline.daysUntilIdentification <= 7 ? "text-red-600" : timeline.daysUntilIdentification <= 30 ? "text-yellow-600" : "text-green-600"}`, children: [
            timeline.daysUntilIdentification,
            " days left"
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 103,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 91,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: `
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${purchaseStatus === "completed" ? "bg-green-500" : purchaseStatus === "today" ? "bg-red-500 animate-pulse" : getProgressColor(timeline.daysUntilPurchase)}
            `, children: "180" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 115,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm font-semibold text-gray-900", children: "Purchase Deadline" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 123,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-600", children: formatDateLong(timeline.purchaseDeadline) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 124,
            columnNumber: 13
          }, undefined),
          purchaseStatus === "upcoming" && /* @__PURE__ */ jsxDEV("p", { className: `text-xs font-semibold mt-1 ${timeline.daysUntilPurchase <= 7 ? "text-red-600" : timeline.daysUntilPurchase <= 30 ? "text-yellow-600" : "text-green-600"}`, children: [
            timeline.daysUntilPurchase,
            " days left"
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 126,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 75,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
      lineNumber: 70,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4 mt-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: `p-4 rounded-lg border-2 ${timeline.status === "active" ? "border-blue-500 bg-blue-50" : timeline.status === "pending" ? "border-gray-300 bg-gray-50" : "border-gray-300 bg-gray-50"}`, children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900 mb-2", children: "Identification Phase" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 146,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Days 0-45" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 148,
            columnNumber: 13
          }, undefined),
          timeline.status === "active" && /* @__PURE__ */ jsxDEV("p", { className: "text-blue-700 font-semibold", children: [
            "Currently Active - ",
            timeline.daysUntilIdentification,
            " days remaining"
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 150,
            columnNumber: 15
          }, undefined),
          (timeline.status === "identified" || timeline.status === "expired") && /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: "Phase completed" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 155,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 147,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: `p-4 rounded-lg border-2 ${timeline.status === "identified" ? "border-blue-500 bg-blue-50" : timeline.status === "pending" || timeline.status === "active" ? "border-gray-300 bg-gray-50" : "border-gray-300 bg-gray-50"}`, children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900 mb-2", children: "Purchase Phase" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Days 45-180" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 168,
            columnNumber: 13
          }, undefined),
          timeline.status === "identified" && /* @__PURE__ */ jsxDEV("p", { className: "text-blue-700 font-semibold", children: [
            "Currently Active - ",
            timeline.daysUntilPurchase,
            " days remaining"
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 170,
            columnNumber: 15
          }, undefined),
          timeline.status === "expired" && /* @__PURE__ */ jsxDEV("p", { className: "text-red-600 font-semibold", children: "Exchange period expired" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
            lineNumber: 175,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
        lineNumber: 161,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
      lineNumber: 139,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/TimelineVisualizer.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, undefined);
};

const DeadlineCard = ({
  title,
  deadline,
  currentDate,
  description,
  type
}) => {
  const { days, isOverdue, displayText } = getDaysRemaining(deadline, currentDate);
  const getCardStyle = () => {
    if (isOverdue) {
      return "border-red-500 bg-red-50";
    }
    if (days === 0) {
      return "border-red-500 bg-red-50 animate-pulse";
    }
    if (days <= 7) {
      return "border-yellow-500 bg-yellow-50";
    }
    if (days <= 30) {
      return "border-blue-500 bg-blue-50";
    }
    return "border-green-500 bg-green-50";
  };
  const getTextColor = () => {
    if (isOverdue || days === 0) return "text-red-700";
    if (days <= 7) return "text-yellow-700";
    if (days <= 30) return "text-blue-700";
    return "text-green-700";
  };
  const getIcon = () => {
    if (type === "identification") {
      return /* @__PURE__ */ jsxDEV("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 48,
        columnNumber: 11
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, undefined);
    }
    return /* @__PURE__ */ jsxDEV("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, undefined);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: `rounded-lg border-2 p-6 transition-all duration-300 ${getCardStyle()}`, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-start space-x-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: `flex-shrink-0 ${getTextColor()}`, children: getIcon() }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-grow", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 67,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: description }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 70,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-gray-700", children: [
              "Deadline: ",
              formatDateLong(deadline)
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
              lineNumber: 73,
              columnNumber: 15
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: `text-2xl font-bold mt-2 ${getTextColor()}`, children: displayText }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
              lineNumber: 77,
              columnNumber: 15
            }, undefined),
            !isOverdue && days > 0 && /* @__PURE__ */ jsxDEV("div", { className: "mt-3", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: `h-2 rounded-full transition-all duration-500 ${days === 0 ? "bg-red-500" : days <= 7 ? "bg-yellow-500" : days <= 30 ? "bg-blue-500" : "bg-green-500"}`,
                style: {
                  width: `${Math.max(0, Math.min(
                    100,
                    type === "identification" ? (45 - days) / 45 * 100 : (180 - days) / 180 * 100
                  ))}%`
                }
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
                lineNumber: 84,
                columnNumber: 21
              },
              undefined
            ) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
              lineNumber: 83,
              columnNumber: 19
            }, undefined) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
              lineNumber: 82,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 72,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, undefined),
        days === 0 && !isOverdue && /* @__PURE__ */ jsxDEV("div", { className: "mt-3 p-2 bg-red-100 rounded-md", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-red-800", children: "⚠️ TODAY IS YOUR DEADLINE! Act immediately!" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 108,
          columnNumber: 15
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 107,
          columnNumber: 13
        }, undefined),
        days > 0 && days <= 7 && /* @__PURE__ */ jsxDEV("div", { className: "mt-3 p-2 bg-yellow-100 rounded-md", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-yellow-800", children: "⚠️ Less than one week remaining!" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 116,
          columnNumber: 15
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 115,
          columnNumber: 13
        }, undefined),
        isOverdue && /* @__PURE__ */ jsxDEV("div", { className: "mt-3 p-2 bg-red-100 rounded-md", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-red-800", children: "❌ This deadline has passed. Your exchange may be disqualified." }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 124,
          columnNumber: 15
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 123,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-sm font-semibold text-gray-700 mb-2", children: type === "identification" ? "Identification Checklist:" : "Purchase Checklist:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 134,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("ul", { className: "space-y-1 text-sm text-gray-600", children: type === "identification" ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 142,
            columnNumber: 19
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 141,
            columnNumber: 17
          }, undefined),
          "Find potential replacement properties"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 140,
          columnNumber: 15
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 148,
            columnNumber: 19
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 147,
            columnNumber: 17
          }, undefined),
          "Choose identification rule (3-property, 200%, or 95%)"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 146,
          columnNumber: 15
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 154,
            columnNumber: 19
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 153,
            columnNumber: 17
          }, undefined),
          "Submit written identification to QI"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 152,
          columnNumber: 15
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 139,
        columnNumber: 13
      }, undefined) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 163,
            columnNumber: 19
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 162,
            columnNumber: 17
          }, undefined),
          "Complete due diligence on property"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 161,
          columnNumber: 15
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 169,
            columnNumber: 19
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 168,
            columnNumber: 17
          }, undefined),
          "Arrange financing if needed"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 167,
          columnNumber: 15
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 175,
            columnNumber: 19
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
            lineNumber: 174,
            columnNumber: 17
          }, undefined),
          "Schedule closing with QI involvement"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
          lineNumber: 173,
          columnNumber: 15
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 160,
        columnNumber: 13
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/DeadlineCard.tsx",
    lineNumber: 60,
    columnNumber: 5
  }, undefined);
};

const PropertyTracker = ({
  identificationDeadline,
  currentDate,
  salePrice = 0
}) => {
  const [properties, setProperties] = useState([]);
  const [selectedRule, setSelectedRule] = useState(IDENTIFICATION_RULES["3-property"]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [salePriceInput, setSalePriceInput] = useState(salePrice);
  const [newProperty, setNewProperty] = useState({
    address: "",
    value: 0,
    notes: ""
  });
  useEffect(() => {
    const savedProperties = localStorage.getItem("1031_properties");
    const savedRule = localStorage.getItem("1031_rule");
    const savedSalePrice = localStorage.getItem("1031_sale_price");
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    }
    if (savedRule && IDENTIFICATION_RULES[savedRule]) {
      setSelectedRule(IDENTIFICATION_RULES[savedRule]);
    }
    if (savedSalePrice) {
      setSalePriceInput(parseFloat(savedSalePrice));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("1031_properties", JSON.stringify(properties));
    localStorage.setItem("1031_rule", selectedRule.type);
    localStorage.setItem("1031_sale_price", salePriceInput.toString());
  }, [properties, selectedRule, salePriceInput]);
  const validation = validateIdentification(properties, selectedRule, salePriceInput);
  properties.filter((p) => p.status === "identified").length;
  const isDeadlinePassed = new Date(identificationDeadline) < currentDate;
  const handleAddProperty = () => {
    if (!newProperty.address) return;
    const property = {
      id: Date.now().toString(),
      address: newProperty.address,
      identifiedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      value: newProperty.value || 0,
      status: "identified",
      notes: newProperty.notes
    };
    setProperties([...properties, property]);
    setNewProperty({ address: "", value: 0, notes: "" });
    setShowAddForm(false);
  };
  const handleRemoveProperty = (id) => {
    setProperties(properties.filter((p) => p.id !== id));
  };
  const handleUpdateStatus = (id, status) => {
    setProperties(properties.map(
      (p) => p.id === id ? { ...p, status } : p
    ));
  };
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all properties?")) {
      setProperties([]);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900", children: "Property Identification Tracker" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 97,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-1", children: "Track your identified replacement properties and ensure compliance with IRS rules" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 98,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, undefined),
      properties.length > 0 && /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleClearAll,
          className: "text-sm text-red-600 hover:text-red-700 underline",
          children: "Clear All"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 103,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 95,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "salePrice", className: "block text-sm font-medium text-gray-700 mb-2", children: "Sale Price (for rule validation)" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 114,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-gray-500", children: "$" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 118,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "number",
            id: "salePrice",
            value: salePriceInput,
            onChange: (e) => setSalePriceInput(parseFloat(e.target.value) || 0),
            className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "Enter sale price"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 119,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 117,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 113,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Identification Rule" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 132,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-4", children: Object.values(IDENTIFICATION_RULES).map((rule) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedRule(rule),
          className: `p-4 rounded-lg border-2 transition-all ${selectedRule.type === rule.type ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`,
          children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: rule.description }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 146,
              columnNumber: 15
            }, undefined),
            /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-1", children: rule.requirements }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 147,
              columnNumber: 15
            }, undefined)
          ]
        },
        rule.type,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 137,
          columnNumber: 13
        },
        undefined
      )) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 135,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 131,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: `mb-6 p-4 rounded-lg ${validation.isValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`, children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center", children: [
      validation.isValid ? /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 text-green-600 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 160,
        columnNumber: 15
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 159,
        columnNumber: 13
      }, undefined) : /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 text-red-600 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 164,
        columnNumber: 15
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 163,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("span", { className: `font-semibold ${validation.isValid ? "text-green-800" : "text-red-800"}`, children: validation.message }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 167,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 157,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 154,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 mb-6", children: properties.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8 text-gray-500", children: 'No properties identified yet. Click "Add Property" to get started.' }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 176,
      columnNumber: 11
    }, undefined) : properties.map((property) => /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `p-4 rounded-lg border ${property.status === "identified" ? "border-blue-200 bg-blue-50" : property.status === "purchased" ? "border-green-200 bg-green-50" : property.status === "rejected" ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`,
        children: /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex-grow", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: property.address }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 192,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-4 text-sm text-gray-600 mt-1", children: [
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Value: $",
                property.value?.toLocaleString() || "Not specified"
              ] }, void 0, true, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                lineNumber: 194,
                columnNumber: 21
              }, undefined),
              /* @__PURE__ */ jsxDEV("span", { children: "•" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                lineNumber: 195,
                columnNumber: 21
              }, undefined),
              /* @__PURE__ */ jsxDEV("span", { children: [
                "Identified: ",
                new Date(property.identifiedDate).toLocaleDateString()
              ] }, void 0, true, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                lineNumber: 196,
                columnNumber: 21
              }, undefined)
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 193,
              columnNumber: 19
            }, undefined),
            property.notes && /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-2", children: property.notes }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 199,
              columnNumber: 21
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 191,
            columnNumber: 17
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 ml-4", children: [
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: property.status,
                onChange: (e) => handleUpdateStatus(property.id, e.target.value),
                className: "text-sm px-2 py-1 border border-gray-300 rounded",
                disabled: isDeadlinePassed,
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "potential", children: "Potential" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                    lineNumber: 210,
                    columnNumber: 21
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("option", { value: "identified", children: "Identified" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                    lineNumber: 211,
                    columnNumber: 21
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("option", { value: "purchased", children: "Purchased" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                    lineNumber: 212,
                    columnNumber: 21
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("option", { value: "rejected", children: "Rejected" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                    lineNumber: 213,
                    columnNumber: 21
                  }, undefined)
                ]
              },
              void 0,
              true,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                lineNumber: 204,
                columnNumber: 19
              },
              undefined
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => handleRemoveProperty(property.id),
                className: "text-red-600 hover:text-red-700",
                disabled: isDeadlinePassed,
                children: /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }, void 0, false, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                  lineNumber: 222,
                  columnNumber: 23
                }, undefined) }, void 0, false, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                  lineNumber: 221,
                  columnNumber: 21
                }, undefined)
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                lineNumber: 216,
                columnNumber: 19
              },
              undefined
            )
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 203,
            columnNumber: 17
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 190,
          columnNumber: 15
        }, undefined)
      },
      property.id,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 181,
        columnNumber: 13
      },
      undefined
    )) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 174,
      columnNumber: 7
    }, undefined),
    !isDeadlinePassed && /* @__PURE__ */ jsxDEV(Fragment, { children: !showAddForm ? /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => setShowAddForm(true),
        className: "w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center",
        children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 241,
            columnNumber: 17
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 240,
            columnNumber: 15
          }, undefined),
          "Add Property"
        ]
      },
      void 0,
      true,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 236,
        columnNumber: 13
      },
      undefined
    ) : /* @__PURE__ */ jsxDEV("div", { className: "border-2 border-blue-200 rounded-lg p-4 bg-blue-50", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900 mb-4", children: "Add New Property" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 247,
        columnNumber: 15
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Property Address *" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 251,
            columnNumber: 19
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: newProperty.address,
              onChange: (e) => setNewProperty({ ...newProperty, address: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "123 Main St, City, State ZIP"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 254,
              columnNumber: 19
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 250,
          columnNumber: 17
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Estimated Value" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 264,
            columnNumber: 19
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-500", children: "$" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 268,
              columnNumber: 21
            }, undefined),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "number",
                value: newProperty.value,
                onChange: (e) => setNewProperty({ ...newProperty, value: parseFloat(e.target.value) || 0 }),
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                placeholder: "0"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
                lineNumber: 269,
                columnNumber: 21
              },
              undefined
            )
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 267,
            columnNumber: 19
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 263,
          columnNumber: 17
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
            lineNumber: 280,
            columnNumber: 19
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "textarea",
            {
              value: newProperty.notes,
              onChange: (e) => setNewProperty({ ...newProperty, notes: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              rows: 2,
              placeholder: "Additional details about this property"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 283,
              columnNumber: 19
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 279,
          columnNumber: 17
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleAddProperty,
              disabled: !newProperty.address,
              className: "flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400",
              children: "Add Property"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 293,
              columnNumber: 19
            },
            undefined
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setShowAddForm(false);
                setNewProperty({ address: "", value: 0, notes: "" });
              },
              className: "flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors",
              children: "Cancel"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
              lineNumber: 300,
              columnNumber: 19
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
          lineNumber: 292,
          columnNumber: 17
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 249,
        columnNumber: 15
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 246,
      columnNumber: 13
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 234,
      columnNumber: 9
    }, undefined),
    isDeadlinePassed && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-red-800", children: [
      /* @__PURE__ */ jsxDEV("strong", { children: "Identification deadline has passed." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 320,
        columnNumber: 13
      }, undefined),
      " You can no longer add or modify properties."
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 319,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 318,
      columnNumber: 9
    }, undefined),
    properties.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "mt-6 pt-6 border-t border-gray-200", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => {
          const data = {
            rule: selectedRule.description,
            salePrice: salePriceInput,
            properties: properties.filter((p) => p.status === "identified"),
            exportDate: (/* @__PURE__ */ new Date()).toISOString()
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `1031-identification-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        className: "text-blue-600 hover:text-blue-700 underline text-sm",
        children: "Export Identification List"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
        lineNumber: 328,
        columnNumber: 11
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
      lineNumber: 327,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/PropertyTracker.tsx",
    lineNumber: 94,
    columnNumber: 5
  }, undefined);
};

const ReminderSetup = ({ timeline, onClose }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reminderTypes, setReminderTypes] = useState({
    email: true,
    sms: false,
    calendar: true
  });
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const reminderSchedule = generateReminderSchedule(timeline);
  const handleToggleReminder = (reminderId) => {
    setSelectedReminders(
      (prev) => prev.includes(reminderId) ? prev.filter((id) => id !== reminderId) : [...prev, reminderId]
    );
  };
  const handleSelectAll = () => {
    setSelectedReminders(reminderSchedule.map((_, index) => index.toString()));
  };
  const handleClearAll = () => {
    setSelectedReminders([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !phone) {
      alert("Please provide at least an email or phone number");
      return;
    }
    if (selectedReminders.length === 0) {
      alert("Please select at least one reminder");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Reminder setup:", {
        email,
        phone,
        reminderTypes,
        selectedReminders: selectedReminders.map((idx) => reminderSchedule[parseInt(idx)]),
        timeline
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2e3);
    } catch (error) {
      alert("Failed to set up reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-lg p-8 text-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: /* @__PURE__ */ jsxDEV("svg", { className: "w-16 h-16 text-green-500 mx-auto", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 88,
        columnNumber: 13
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Reminders Set Successfully!" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 91,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "You'll receive reminders at the selected times." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 92,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
      lineNumber: 85,
      columnNumber: 7
    }, undefined);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900", children: "Set Up Deadline Reminders" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 101,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-1", children: "Never miss a critical deadline with automated reminders" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 102,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 100,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onClose,
          className: "text-gray-400 hover:text-gray-600",
          children: /* @__PURE__ */ jsxDEV("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 111,
            columnNumber: 13
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 110,
            columnNumber: 11
          }, undefined)
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 106,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
      lineNumber: 99,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: "Contact Information" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 122,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "email",
              id: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "your@email.com"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 125,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number (for SMS)" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "tel",
              id: "phone",
              value: phone,
              onChange: (e) => setPhone(e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "(555) 123-4567"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 139,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 118,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: "Reminder Methods" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 152,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                checked: reminderTypes.email,
                onChange: (e) => setReminderTypes({ ...reminderTypes, email: e.target.checked }),
                className: "mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                lineNumber: 156,
                columnNumber: 15
              },
              undefined
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-700", children: "Email reminders" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 162,
              columnNumber: 15
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 155,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("label", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                checked: reminderTypes.sms,
                onChange: (e) => setReminderTypes({ ...reminderTypes, sms: e.target.checked }),
                className: "mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                lineNumber: 166,
                columnNumber: 15
              },
              undefined
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-700", children: "SMS text reminders" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 172,
              columnNumber: 15
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 165,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("label", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                checked: reminderTypes.calendar,
                onChange: (e) => setReminderTypes({ ...reminderTypes, calendar: e.target.checked }),
                className: "mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                lineNumber: 176,
                columnNumber: 15
              },
              undefined
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-700", children: "Calendar invites (ICS)" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 182,
              columnNumber: 15
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 175,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 154,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 151,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: "Select Reminders" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 190,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "space-x-2", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: handleSelectAll,
                className: "text-sm text-blue-600 hover:text-blue-700 underline",
                children: "Select All"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                lineNumber: 192,
                columnNumber: 15
              },
              undefined
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-400", children: "|" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 199,
              columnNumber: 15
            }, undefined),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: handleClearAll,
                className: "text-sm text-blue-600 hover:text-blue-700 underline",
                children: "Clear All"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                lineNumber: 200,
                columnNumber: 15
              },
              undefined
            )
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 191,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 189,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: reminderSchedule.map((reminder, index) => {
          const isSelected = selectedReminders.includes(index.toString());
          const isPast = new Date(reminder.date) < /* @__PURE__ */ new Date();
          return /* @__PURE__ */ jsxDEV(
            "label",
            {
              className: `flex items-start p-3 rounded-lg border cursor-pointer transition-all ${isPast ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed" : isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:border-gray-300"}`,
              children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: () => !isPast && handleToggleReminder(index.toString()),
                    disabled: isPast,
                    className: "mr-3 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                    lineNumber: 226,
                    columnNumber: 19
                  },
                  undefined
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "flex-grow", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: `text-sm font-medium ${reminder.type === "identification" ? "text-blue-700" : "text-green-700"}`, children: [
                      reminder.type === "identification" ? "ID" : "Purchase",
                      " Reminder"
                    ] }, void 0, true, {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                      lineNumber: 235,
                      columnNumber: 23
                    }, undefined),
                    /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-sm text-gray-600", children: [
                      "- ",
                      reminder.daysBeforeDeadline,
                      " days before"
                    ] }, void 0, true, {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                      lineNumber: 240,
                      columnNumber: 23
                    }, undefined)
                  ] }, void 0, true, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                    lineNumber: 234,
                    columnNumber: 21
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-1", children: reminder.message }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                    lineNumber: 244,
                    columnNumber: 21
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: [
                    "Send on: ",
                    new Date(reminder.date).toLocaleDateString()
                  ] }, void 0, true, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                    lineNumber: 245,
                    columnNumber: 21
                  }, undefined)
                ] }, void 0, true, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                  lineNumber: 233,
                  columnNumber: 19
                }, undefined)
              ]
            },
            index,
            true,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 216,
              columnNumber: 17
            },
            undefined
          );
        }) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 188,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 rounded-lg p-4", children: /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-600", children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "Privacy Notice:" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
          lineNumber: 258,
          columnNumber: 13
        }, undefined),
        " Your contact information will only be used to send the requested reminders and will not be shared with third parties. You can unsubscribe at any time."
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 257,
        columnNumber: 11
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 256,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-3", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "submit",
            disabled: loading || !email && !phone || selectedReminders.length === 0,
            className: "flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center",
            children: loading ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                  lineNumber: 273,
                  columnNumber: 19
                }, undefined),
                /* @__PURE__ */ jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                  lineNumber: 274,
                  columnNumber: 19
                }, undefined)
              ] }, void 0, true, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
                lineNumber: 272,
                columnNumber: 17
              }, undefined),
              "Setting Up..."
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
              lineNumber: 271,
              columnNumber: 15
            }, undefined) : "Set Up Reminders"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 265,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors",
            children: "Cancel"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
            lineNumber: 282,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
        lineNumber: 264,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
      lineNumber: 116,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/timeline/ReminderSetup.tsx",
    lineNumber: 98,
    columnNumber: 5
  }, undefined);
};

const TimelineCalculator = ({
  initialSaleDate,
  onTimelineChange
}) => {
  const [saleDate, setSaleDate] = useState(initialSaleDate || "");
  const [timeline, setTimeline] = useState(null);
  const [showPropertyTracker, setShowPropertyTracker] = useState(false);
  const [showReminderSetup, setShowReminderSetup] = useState(false);
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(/* @__PURE__ */ new Date());
    }, 6e4);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (saleDate) {
      const newTimeline = calculateDeadlines(saleDate);
      setTimeline(newTimeline);
      onTimelineChange?.(newTimeline);
    }
  }, [saleDate, onTimelineChange]);
  const handleSaleDateChange = (e) => {
    setSaleDate(e.target.value);
  };
  const handleExportCalendar = () => {
    if (!timeline) return;
    const events = [
      {
        title: "1031 Exchange - 45 Day ID Deadline",
        start: timeline.identificationDeadline,
        description: "Last day to identify replacement properties for your 1031 exchange."
      },
      {
        title: "1031 Exchange - 180 Day Purchase Deadline",
        start: timeline.purchaseDeadline,
        description: "Last day to close on replacement property for your 1031 exchange."
      }
    ];
    const icsContent = generateICSContent(events);
    downloadICSFile(icsContent, "1031-exchange-deadlines.ics");
  };
  const generateICSContent = (events) => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//National 1031 Center//Timeline Calculator//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];
    events.forEach((event, index) => {
      const eventDate = new Date(event.start);
      const dateString = eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      lines.push(
        "BEGIN:VEVENT",
        `UID:${Date.now()}-${index}@the1031center.com`,
        `DTSTART:${dateString}`,
        `DTEND:${dateString}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        "BEGIN:VALARM",
        "TRIGGER:-P7D",
        "ACTION:DISPLAY",
        "DESCRIPTION:Reminder: 1031 Exchange deadline in 7 days",
        "END:VALARM",
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        "DESCRIPTION:URGENT: 1031 Exchange deadline tomorrow!",
        "END:VALARM",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  };
  const downloadICSFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const getTimelineStatus = () => {
    if (!timeline) return null;
    const now = /* @__PURE__ */ new Date();
    const saleDateTime = new Date(timeline.saleDate);
    const idDateTime = new Date(timeline.identificationDeadline);
    const purchaseDateTime = new Date(timeline.purchaseDeadline);
    if (now < saleDateTime) {
      return { status: "pending", message: "Exchange not yet started" };
    } else if (now > purchaseDateTime) {
      return { status: "expired", message: "Exchange period has ended" };
    } else if (now > idDateTime) {
      return { status: "identified", message: "Identification period has passed" };
    } else {
      return { status: "active", message: "Exchange in progress" };
    }
  };
  const timelineStatus = getTimelineStatus();
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Enter Your Sale Details" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 140,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "saleDate", className: "block text-sm font-medium text-gray-700 mb-2", children: "Property Sale Date" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 144,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "date",
            id: "saleDate",
            value: saleDate,
            onChange: handleSaleDateChange,
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            max: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 147,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm text-gray-600", children: "Enter the closing date of your relinquished property sale" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 155,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 143,
        columnNumber: 11
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
      lineNumber: 139,
      columnNumber: 7
    }, undefined),
    timeline && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      timelineStatus && /* @__PURE__ */ jsxDEV("div", { className: `mb-8 p-4 rounded-lg ${timelineStatus.status === "active" ? "bg-green-50 border-l-4 border-green-500" : timelineStatus.status === "identified" ? "bg-yellow-50 border-l-4 border-yellow-500" : timelineStatus.status === "expired" ? "bg-red-50 border-l-4 border-red-500" : "bg-gray-50 border-l-4 border-gray-500"}`, children: /* @__PURE__ */ jsxDEV("p", { className: `font-semibold ${timelineStatus.status === "active" ? "text-green-800" : timelineStatus.status === "identified" ? "text-yellow-800" : timelineStatus.status === "expired" ? "text-red-800" : "text-gray-800"}`, children: timelineStatus.message }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 173,
        columnNumber: 15
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 167,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-8", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Your Exchange Timeline" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 186,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV(TimelineVisualizer, { timeline, currentDate }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 187,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 185,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxDEV(
          DeadlineCard,
          {
            title: "45-Day Identification Deadline",
            deadline: timeline.identificationDeadline,
            currentDate,
            description: "Last day to identify replacement properties",
            type: "identification"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 192,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          DeadlineCard,
          {
            title: "180-Day Purchase Deadline",
            deadline: timeline.purchaseDeadline,
            currentDate,
            description: "Last day to close on replacement property",
            type: "purchase"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 199,
            columnNumber: 13
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 191,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-8", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Timeline Tools" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 210,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setShowPropertyTracker(!showPropertyTracker),
              className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
              children: [
                showPropertyTracker ? "Hide" : "Show",
                " Property Tracker"
              ]
            },
            void 0,
            true,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
              lineNumber: 212,
              columnNumber: 15
            },
            undefined
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setShowReminderSetup(!showReminderSetup),
              className: "bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors",
              children: "Set Up Reminders"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
              lineNumber: 218,
              columnNumber: 15
            },
            undefined
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleExportCalendar,
              className: "bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors",
              children: "Export to Calendar"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
              lineNumber: 224,
              columnNumber: 15
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 211,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 209,
        columnNumber: 11
      }, undefined),
      showPropertyTracker && /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: /* @__PURE__ */ jsxDEV(
        PropertyTracker,
        {
          identificationDeadline: timeline.identificationDeadline,
          currentDate
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 236,
          columnNumber: 15
        },
        undefined
      ) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 235,
        columnNumber: 13
      }, undefined),
      showReminderSetup && /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: /* @__PURE__ */ jsxDEV(
        ReminderSetup,
        {
          timeline,
          onClose: () => setShowReminderSetup(false)
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 246,
          columnNumber: 15
        },
        undefined
      ) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 245,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
      lineNumber: 164,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 rounded-lg p-6 mt-8", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-blue-900 mb-4", children: "Timeline Tips" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 257,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("ul", { className: "space-y-2 text-blue-800", children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 mr-2 mt-0.5 flex-shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 261,
            columnNumber: 15
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 260,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Start looking for replacement properties immediately after your sale" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 263,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 259,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 mr-2 mt-0.5 flex-shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 267,
            columnNumber: 15
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 266,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Identify backup properties in case your first choice falls through" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 269,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 265,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 mr-2 mt-0.5 flex-shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxDEV("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 273,
            columnNumber: 15
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 272,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Submit your identification in writing to your QI before day 45" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
            lineNumber: 275,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
          lineNumber: 271,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
        lineNumber: 258,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
      lineNumber: 256,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator.tsx",
    lineNumber: 137,
    columnNumber: 5
  }, undefined);
};

export { TimelineCalculator as T };
