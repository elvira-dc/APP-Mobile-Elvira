import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { globalStyles } from "@styles/globalStyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CalendarWidget = ({
  currentDate,
  selectedDate,
  onDateChange,
  onDateSelect,
  onDateRangeSelect,
  onDateLongPress,
  selectedStaff = [],
  calendarItems = { shifts: [], absences: [], events: [] },
  showGrid = true,
  style,
}) => {
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickedDay, setLastClickedDay] = useState(null);
  const [firstSelectedDate, setFirstSelectedDate] = useState(null);
  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    onDateChange(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear() &&
      day === today.getDate()
    );
  };

  const isSelected = (day) => {
    return (
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear() &&
      day === selectedDate.getDate()
    );
  };

  const isInRange = (day) => {
    if (!selectedRange.start || !selectedRange.end) return false;

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const isRangeStart = (day) => {
    if (!selectedRange.start) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.getTime() === selectedRange.start.getTime();
  };

  const isRangeEnd = (day) => {
    if (!selectedRange.end) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.getTime() === selectedRange.end.getTime();
  };

  const handleDayLongPress = (day) => {
    if (!onDateLongPress) return;

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    console.log("📅 Long press detected on:", selectedDate.toDateString());
    onDateLongPress(selectedDate);
  };

  const getItemsForDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    const dateStr = date.toDateString();
    const items = {
      shifts: [],
      absences: [],
      events: [],
    };

    // Check shifts
    calendarItems.shifts?.forEach((shift) => {
      if (shift.dateRange?.start && shift.dateRange?.end) {
        const startDate = new Date(shift.dateRange.start);
        const endDate = new Date(shift.dateRange.end);
        if (date >= startDate && date <= endDate) {
          items.shifts.push(shift);
        }
      } else if (shift.dateRange?.start) {
        if (new Date(shift.dateRange.start).toDateString() === dateStr) {
          items.shifts.push(shift);
        }
      }
    });

    // Check absences
    calendarItems.absences?.forEach((absence) => {
      if (absence.dateRange?.start && absence.dateRange?.end) {
        const startDate = new Date(absence.dateRange.start);
        const endDate = new Date(absence.dateRange.end);
        if (date >= startDate && date <= endDate) {
          items.absences.push(absence);
        }
      } else if (absence.dateRange?.start) {
        if (new Date(absence.dateRange.start).toDateString() === dateStr) {
          items.absences.push(absence);
        }
      }
    });

    // Check events
    calendarItems.events?.forEach((event) => {
      if (event.date && new Date(event.date).toDateString() === dateStr) {
        items.events.push(event);
      }
    });

    return items;
  };

  const hasItems = (day) => {
    const items = getItemsForDate(day);
    return (
      items.shifts.length > 0 ||
      items.absences.length > 0 ||
      items.events.length > 0
    );
  };

  const getItemIndicatorColor = (day) => {
    const items = getItemsForDate(day);

    // Priority: shifts > absences > events
    if (items.shifts.length > 0) return COLORS.primary;
    if (items.absences.length > 0) return COLORS.warning;
    if (items.events.length > 0) return COLORS.success;

    return COLORS.gray400;
  };
  const handleDayPress = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    // Double click detection (within 500ms)
    const isDoubleClick = timeDiff < 500 && lastClickedDay === day;

    if (isDoubleClick) {
      // Double click - single date selection
      console.log("📅 Double click detected - single date selection");
      setSelectedRange({ start: null, end: null });
      setFirstSelectedDate(null);
      onDateSelect(clickedDate);
    } else {
      // Single click logic
      if (!firstSelectedDate) {
        // First click - start potential range
        console.log("📅 First date selected");
        setFirstSelectedDate(clickedDate);
        setSelectedRange({ start: clickedDate, end: null });
        onDateSelect(clickedDate);
      } else {
        // Second click - complete range or start new selection
        const firstDate = firstSelectedDate;

        if (clickedDate.getTime() === firstDate.getTime()) {
          // Clicked same date - treat as single date
          console.log("📅 Same date clicked - single date selection");
          setSelectedRange({ start: null, end: null });
          setFirstSelectedDate(null);
          onDateSelect(clickedDate);
        } else if (clickedDate > firstDate) {
          // Clicked date ahead - create range
          console.log("📅 Range selected:", firstDate, "to", clickedDate);
          setSelectedRange({ start: firstDate, end: clickedDate });
          if (onDateRangeSelect) {
            onDateRangeSelect({ start: firstDate, end: clickedDate });
          }
          setFirstSelectedDate(null);
        } else {
          // Clicked date before - swap and create range
          console.log(
            "📅 Range selected (swapped):",
            clickedDate,
            "to",
            firstDate
          );
          setSelectedRange({ start: clickedDate, end: firstDate });
          if (onDateRangeSelect) {
            onDateRangeSelect({ start: clickedDate, end: firstDate });
          }
          setFirstSelectedDate(null);
        }
      }
    }

    // Update click tracking
    setLastClickTime(currentTime);
    setLastClickedDay(day);
  };

  const goToToday = () => {
    const today = new Date();
    onDateChange(today);
    onDateSelect(today);
    console.log("📅 Navigated to today:", today.toDateString());
  };

  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigateMonth(-1)}
      >
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.monthTitle}>{getMonthName(currentDate)}</Text>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigateMonth(1)}
      >
        <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderDaysOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <View style={styles.daysOfWeekContainer}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayOfWeekCell}>
            <Text style={styles.dayOfWeekText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <Text style={styles.emptyDayText}></Text>
        </View>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day);
      const selected = isSelected(day);
      const inRange = isInRange(day);
      const rangeStart = isRangeStart(day);
      const rangeEnd = isRangeEnd(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            today && styles.todayCell,
            selected && !inRange && styles.selectedCell,
            inRange && styles.rangeCell,
            rangeStart && styles.rangeStartCell,
            rangeEnd && styles.rangeEndCell,
          ]}
          onPress={() => handleDayPress(day)}
          onLongPress={() => handleDayLongPress(day)}
          delayLongPress={800}
        >
          <Text
            style={[
              styles.dayText,
              today && styles.todayText,
              selected && !inRange && styles.selectedText,
              inRange && styles.rangeText,
              (rangeStart || rangeEnd) && styles.rangeEndpointText,
            ]}
          >
            {day}
          </Text>
          {hasItems(day) && (
            <View style={styles.indicatorContainer}>
              {(() => {
                const items = getItemsForDate(day);
                const indicators = [];

                if (items.shifts.length > 0) {
                  indicators.push(
                    <View
                      key="shift"
                      style={[styles.itemIndicator, styles.shiftIndicator]}
                    />
                  );
                }

                if (items.absences.length > 0) {
                  indicators.push(
                    <View
                      key="absence"
                      style={[styles.itemIndicator, styles.absenceIndicator]}
                    />
                  );
                }

                if (items.events.length > 0) {
                  indicators.push(
                    <View
                      key="event"
                      style={[styles.itemIndicator, styles.eventIndicator]}
                    />
                  );
                }

                return indicators;
              })()}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return <View style={styles.calendarGrid}>{days}</View>;
  };

  return (
    <View style={[styles.calendarContainer, style]}>
      {renderCalendarHeader()}
      {showGrid && (
        <View style={styles.gridContainer}>
          <View style={styles.gridContent}>
            {renderDaysOfWeek()}
            {renderCalendarDays()}
          </View>

          {/* Selected Staff - Bottom Left */}
          {selectedStaff.length > 0 && (
            <View style={styles.staffCorner}>
              <Text style={styles.staffNames} numberOfLines={2}>
                {selectedStaff.map((staff) => staff.name).join(", ")}
              </Text>
            </View>
          )}

          {/* Today Button - Bottom Right */}
          <TouchableOpacity
            style={styles.todayButtonCorner}
            onPress={goToToday}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...globalStyles.shadow,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },

  navButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
  },

  gridContainer: {
    position: "relative",
  },

  gridContent: {
    // Contains the days of week and calendar days
  },

  staffCorner: {
    position: "absolute",
    bottom: SPACING.xs,
    left: SPACING.xs,
    maxWidth: "60%", // Ensure it doesn't overlap with Today button
  },

  staffNames: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "500",
  },

  todayButtonCorner: {
    position: "absolute",
    bottom: SPACING.xs,
    right: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  todayButtonText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textInverse,
    fontWeight: "600",
  },

  indicatorContainer: {
    position: "absolute",
    bottom: 2,
    right: 2,
    flexDirection: "row",
    gap: 2,
  },

  itemIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  // Specific colors for each indicator type
  shiftIndicator: {
    backgroundColor: "#3B82F6", // Clear blue for shifts
  },

  absenceIndicator: {
    backgroundColor: "#F59E0B", // Amber/orange for absences
  },

  eventIndicator: {
    backgroundColor: "#10B981", // Emerald green for events
  },

  monthTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },

  daysOfWeekContainer: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },

  dayOfWeekCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },

  dayOfWeekText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },

  dayText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },

  emptyDayText: {
    ...TEXT_STYLES.body,
    color: "transparent",
  },

  todayCell: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },

  todayText: {
    color: COLORS.textInverse,
    fontWeight: "600",
  },

  selectedCell: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.sm,
  },

  selectedText: {
    color: COLORS.textInverse,
    fontWeight: "600",
  },

  // Range selection styles
  rangeCell: {
    backgroundColor: COLORS.primary + "20", // 20% opacity
  },

  rangeStartCell: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: BORDER_RADIUS.sm,
    borderBottomLeftRadius: BORDER_RADIUS.sm,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  rangeEndCell: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: BORDER_RADIUS.sm,
    borderBottomRightRadius: BORDER_RADIUS.sm,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  rangeText: {
    color: COLORS.primary,
    fontWeight: "500",
  },

  rangeEndpointText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default CalendarWidget;
