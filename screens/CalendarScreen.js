import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { globalStyles, SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import {
  StaffSelectionModal,
  DateRangeActionModal,
  AbsenceTypeModal,
  EventCreationModal,
} from "@components/modals";
import { CalendarWidget } from "@components/calendar";
import { CalendarItem, CollapsibleSection } from "@components/common";

const CalendarScreen = () => {
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaffMembers, setSelectedStaffMembers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [calendarAnimation] = useState(new Animated.Value(1));

  // New modal states for date range functionality
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // Event creation modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [longPressedDate, setLongPressedDate] = useState(null);

  // Calendar items state
  const [shifts, setShifts] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [events, setEvents] = useState([]);

  // Initialize functions immediately to ensure they're available for header buttons
  CalendarScreen.openStaffModal = () => setShowStaffModal(true);
  CalendarScreen.toggleCalendar = () => {
    const newVisibility = !isCalendarVisible;
    setIsCalendarVisible(newVisibility);

    Animated.timing(calendarAnimation, {
      toValue: newVisibility ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    console.log(`Calendar ${newVisibility ? "shown" : "hidden"}`);
  };

  // Log when functions are ready
  useEffect(() => {
    console.log("CalendarScreen functions ready", {
      openStaffModal: !!CalendarScreen.openStaffModal,
      toggleCalendar: !!CalendarScreen.toggleCalendar,
    });
  }, []);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleDateRangeSelect = (dateRange) => {
    console.log("Date range selected:", dateRange);
    setSelectedDateRange(dateRange);

    // Only show action modal if staff members are selected
    if (selectedStaffMembers.length > 0) {
      setShowDateRangeModal(true);
    } else {
      // Show alert or automatically open staff selection
      console.log("Please select staff members first");
      setShowStaffModal(true);
    }
  };

  const handleCreateShift = (dateRange, staff) => {
    console.log("Creating shift:", { dateRange, staff });

    const newShift = {
      id: Date.now().toString(),
      dateRange,
      staff,
      type: "shift",
      createdAt: new Date(),
    };

    setShifts((prevShifts) => [...prevShifts, newShift]);
    setShowDateRangeModal(false);
  };

  const handleRequestAbsence = (dateRange, staff) => {
    console.log("Requesting absence:", { dateRange, staff });
    setShowDateRangeModal(false);
    setShowAbsenceModal(true);
  };

  const handleAbsenceConfirm = (absenceData) => {
    console.log("Absence request submitted:", absenceData);

    const newAbsence = {
      id: Date.now().toString(),
      ...absenceData,
      type: "absence",
      createdAt: new Date(),
    };

    setAbsences((prevAbsences) => [...prevAbsences, newAbsence]);
    setShowAbsenceModal(false);
    setSelectedDateRange(null);
  };

  const handleDateLongPress = (date) => {
    console.log("📅 Long press on date:", date.toDateString());
    setLongPressedDate(date);
    setShowEventModal(true);
  };

  const handleEventCreate = (eventData) => {
    console.log("Event created:", eventData);

    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      type: "event",
      createdAt: new Date(),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowEventModal(false);
    setLongPressedDate(null);
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Section - Always visible with conditional grid */}
        <View style={styles.calendarContainer}>
          <CalendarWidget
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onDateSelect={handleDateSelect}
            onDateRangeSelect={handleDateRangeSelect}
            onDateLongPress={handleDateLongPress}
            selectedStaff={selectedStaffMembers}
            calendarItems={{ shifts, absences, events }}
            showGrid={isCalendarVisible}
            style={styles.calendarWidget}
          />

          {/* Color Legend */}
          {isCalendarVisible &&
            (shifts.length > 0 || absences.length > 0 || events.length > 0) && (
              <View style={styles.legendContainer}>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#3B82F6" }]}
                    />
                    <Text style={styles.legendText}>Shifts</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#F59E0B" }]}
                    />
                    <Text style={styles.legendText}>Absences</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#10B981" }]}
                    />
                    <Text style={styles.legendText}>Events</Text>
                  </View>
                </View>
              </View>
            )}
        </View>

        {/* Current Month Shifts Section */}
        <CollapsibleSection
          title={`Shifts for ${currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}`}
          style={styles.sectionContainer}
          contentStyle={styles.sectionContent}
        >
          {(() => {
            // Filter shifts for current month and selected staff
            const currentMonthShifts = shifts.filter((shift) => {
              const shiftMonth = shift.dateRange?.start?.getMonth();
              const shiftYear = shift.dateRange?.start?.getFullYear();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();

              const isCurrentMonth =
                shiftMonth === currentMonth && shiftYear === currentYear;

              if (selectedStaffMembers.length === 0) return isCurrentMonth;

              const hasSelectedStaff = shift.staff?.some((shiftStaff) =>
                selectedStaffMembers.some(
                  (selected) => selected.id === shiftStaff.id
                )
              );

              return isCurrentMonth && hasSelectedStaff;
            });

            return currentMonthShifts.length > 0 ? (
              <View style={styles.itemsList}>
                {currentMonthShifts.map((shift) => (
                  <CalendarItem
                    key={shift.id}
                    item={shift}
                    type="shift"
                    showDate={true}
                    onPress={() => console.log("Shift details:", shift)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                {selectedStaffMembers.length > 0
                  ? "No shifts scheduled for selected staff this month"
                  : "No shifts scheduled this month"}
              </Text>
            );
          })()}
        </CollapsibleSection>

        {/* Absence Section */}
        <CollapsibleSection
          title={
            selectedStaffMembers.length === 1
              ? `${selectedStaffMembers[0].name}'s Absence`
              : selectedStaffMembers.length > 1
              ? "Selected Members Absence"
              : "My Absence"
          }
          style={styles.sectionContainer}
          contentStyle={styles.sectionContent}
        >
          {(() => {
            // Filter absences for current month and selected staff
            const currentMonthAbsences = absences.filter((absence) => {
              const absenceMonth = absence.dateRange?.start?.getMonth();
              const absenceYear = absence.dateRange?.start?.getFullYear();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();

              const isCurrentMonth =
                absenceMonth === currentMonth && absenceYear === currentYear;

              if (selectedStaffMembers.length === 0) return isCurrentMonth;

              const hasSelectedStaff = absence.selectedStaff?.some(
                (absenceStaff) =>
                  selectedStaffMembers.some(
                    (selected) => selected.id === absenceStaff.id
                  )
              );

              return isCurrentMonth && hasSelectedStaff;
            });

            return currentMonthAbsences.length > 0 ? (
              <View style={styles.itemsList}>
                {currentMonthAbsences.map((absence) => (
                  <CalendarItem
                    key={absence.id}
                    item={absence}
                    type="absence"
                    showDate={true}
                    onPress={() => console.log("Absence details:", absence)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                {selectedStaffMembers.length > 0
                  ? "No absences scheduled for selected staff this month"
                  : "No absences scheduled this month"}
              </Text>
            );
          })()}
        </CollapsibleSection>

        {/* Events Section */}
        <CollapsibleSection
          title={`Events for ${currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}`}
          style={styles.sectionContainer}
          contentStyle={styles.sectionContent}
        >
          {(() => {
            // Filter events for current month
            const currentMonthEvents = events.filter((event) => {
              const eventMonth = event.date?.getMonth();
              const eventYear = event.date?.getFullYear();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();

              return eventMonth === currentMonth && eventYear === currentYear;
            });

            return currentMonthEvents.length > 0 ? (
              <View style={styles.itemsList}>
                {currentMonthEvents.map((event) => (
                  <CalendarItem
                    key={event.id}
                    item={event}
                    type="event"
                    showDate={true}
                    onPress={() => console.log("Event details:", event)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No events scheduled this month
              </Text>
            );
          })()}
        </CollapsibleSection>
      </ScrollView>

      {/* Staff Selection Modal */}
      <StaffSelectionModal
        visible={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        title="Choose staff members to view their schedules"
        multiselect={true}
        onConfirm={(staff) => {
          setSelectedStaffMembers(staff);
          console.log(
            "Selected staff for calendar:",
            staff.map((s) => s.name)
          );
          // If we had a pending date range selection, show the action modal
          if (selectedDateRange) {
            setShowDateRangeModal(true);
          }
        }}
      />

      {/* Date Range Action Modal */}
      <DateRangeActionModal
        visible={showDateRangeModal}
        onClose={() => {
          setShowDateRangeModal(false);
          setSelectedDateRange(null);
        }}
        dateRange={selectedDateRange}
        selectedStaff={selectedStaffMembers}
        onCreateShift={handleCreateShift}
        onRequestAbsence={handleRequestAbsence}
      />

      {/* Absence Type Modal */}
      <AbsenceTypeModal
        visible={showAbsenceModal}
        onClose={() => {
          setShowAbsenceModal(false);
          setSelectedDateRange(null);
        }}
        onConfirm={handleAbsenceConfirm}
        dateRange={selectedDateRange}
        selectedStaff={selectedStaffMembers}
      />

      {/* Event Creation Modal */}
      <EventCreationModal
        visible={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setLongPressedDate(null);
        }}
        onConfirm={handleEventCreate}
        selectedDate={longPressedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },

  calendarContainer: {
    margin: SPACING.md,
  },

  calendarWidget: {
    margin: 0, // Remove margin since it's handled by the container
  },

  sectionContainer: {
    backgroundColor: COLORS.background,
    margin: SPACING.md,
    marginTop: 0,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...globalStyles.shadow,
  },

  sectionTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  sectionContent: {
    minHeight: 80,
  },

  selectedDateTitle: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  noDataText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: SPACING.lg,
  },

  // Shifts Section Styles
  shiftsInfo: {
    gap: SPACING.sm,
  },

  shiftsText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  shiftsList: {
    gap: SPACING.sm,
  },

  shiftItem: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },

  staffName: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  shiftDetails: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  // Absence Section Styles
  absenceInfo: {
    gap: SPACING.sm,
  },

  absenceItem: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },

  absenceStatus: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  // Events Section Styles
  eventsInfo: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },

  eventItem: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },

  eventDetails: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  eventsList: {
    minHeight: 60,
  },

  itemsList: {
    gap: SPACING.sm,
  },

  // Legend Styles
  legendContainer: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.lg,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  legendText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});

// Export functions for header button access
CalendarScreen.openStaffModal = null;
CalendarScreen.toggleCalendar = null;

export default CalendarScreen;
