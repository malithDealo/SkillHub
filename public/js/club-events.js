// Sample events data for different clubs
const eventsData = {
  science: [
    {
      id: 1,
      title: "Physics Workshop: Quantum Mechanics",
      type: "workshop",
      description:
        "Explore the fascinating world of quantum physics through interactive demonstrations and hands-on experiments.",
      date: "2025-06-25",
      time: "14:00",
      location: "Science Lab, Building A",
      maxParticipants: 25,
      registeredParticipants: 15,
      cost: 0,
      organizer: {
        name: "Dr. John Smith",
        role: "Physics Professor",
        avatar: "J",
      },
      status: "upcoming",
    },
    {
      id: 2,
      title: "Chemistry Lab Safety Seminar",
      type: "seminar",
      description:
        "Learn essential safety protocols and best practices for working in chemistry laboratories.",
      date: "2025-06-30",
      time: "10:00",
      location: "Chemistry Lab",
      maxParticipants: 30,
      registeredParticipants: 22,
      cost: 500,
      organizer: {
        name: "Prof. Sarah Johnson",
        role: "Chemistry Department",
        avatar: "S",
      },
      status: "upcoming",
    },
    {
      id: 3,
      title: "Science Fair Planning Meeting",
      type: "meetup",
      description:
        "Collaborate on organizing our annual science fair and discuss project ideas.",
      date: "2025-07-05",
      time: "16:00",
      location: "Conference Room B",
      maxParticipants: 20,
      registeredParticipants: 18,
      cost: 0,
      organizer: {
        name: "Mike Wilson",
        role: "Science Club Coordinator",
        avatar: "M",
      },
      status: "upcoming",
    },
    {
      id: 4,
      title: "Astronomy Night: Stargazing Session",
      type: "workshop",
      description:
        "Join us for an evening of stargazing and learn about constellations and celestial objects.",
      date: "2025-07-10",
      time: "20:00",
      location: "School Rooftop",
      maxParticipants: 15,
      registeredParticipants: 12,
      cost: 0,
      organizer: {
        name: "Emma Davis",
        role: "Astronomy Enthusiast",
        avatar: "E",
      },
      status: "upcoming",
    },
    {
      id: 5,
      title: "Biology Field Trip",
      type: "workshop",
      description:
        "Explore local ecosystems and study plant and animal life in their natural habitat.",
      date: "2025-05-15",
      time: "09:00",
      location: "Viharamahadevi Park",
      maxParticipants: 20,
      registeredParticipants: 20,
      cost: 1000,
      organizer: {
        name: "Dr. Lisa Garcia",
        role: "Biology Teacher",
        avatar: "L",
      },
      status: "past",
    },
  ],
  maths: [
    {
      id: 6,
      title: "Advanced Calculus Workshop",
      type: "workshop",
      description:
        "Deep dive into advanced calculus concepts with practical problem-solving sessions.",
      date: "2025-06-28",
      time: "15:00",
      location: "Math Department",
      maxParticipants: 20,
      registeredParticipants: 16,
      cost: 0,
      organizer: {
        name: "Prof. Alex Turner",
        role: "Mathematics Professor",
        avatar: "A",
      },
      status: "upcoming",
    },
    {
      id: 7,
      title: "Math Olympics Training",
      type: "competition",
      description:
        "Intensive training session to prepare for upcoming mathematics competitions.",
      date: "2025-07-03",
      time: "13:00",
      location: "Classroom 101",
      maxParticipants: 15,
      registeredParticipants: 15,
      cost: 500,
      organizer: {
        name: "Maria Rodriguez",
        role: "Math Club President",
        avatar: "M",
      },
      status: "upcoming",
    },
  ],
  commerce: [
    {
      id: 8,
      title: "Business Plan Development Workshop",
      type: "workshop",
      description:
        "Learn how to create compelling business plans and pitch your ideas effectively.",
      date: "2025-06-27",
      time: "14:30",
      location: "Business Center",
      maxParticipants: 25,
      registeredParticipants: 20,
      cost: 1500,
      organizer: {
        name: "Chris Evans",
        role: "Business Consultant",
        avatar: "C",
      },
      status: "upcoming",
    },
    {
      id: 9,
      title: "Investment Strategies Seminar",
      type: "seminar",
      description:
        "Understand different investment strategies and financial planning for students.",
      date: "2025-07-08",
      time: "11:00",
      location: "Auditorium",
      maxParticipants: 50,
      registeredParticipants: 35,
      cost: 1000,
      organizer: {
        name: "Jessica Park",
        role: "Financial Advisor",
        avatar: "J",
      },
      status: "upcoming",
    },
  ],
  art: [
    {
      id: 10,
      title: "Watercolor Painting Workshop",
      type: "workshop",
      description:
        "Learn watercolor techniques and create beautiful landscape paintings.",
      date: "2025-06-26",
      time: "16:00",
      location: "Art Studio",
      maxParticipants: 12,
      registeredParticipants: 10,
      cost: 2000,
      organizer: {
        name: "Isabella Martinez",
        role: "Art Instructor",
        avatar: "I",
      },
      status: "upcoming",
    },
    {
      id: 11,
      title: "Digital Art Fundamentals",
      type: "workshop",
      description:
        "Introduction to digital art tools and techniques for beginners.",
      date: "2025-07-01",
      time: "14:00",
      location: "Computer Lab",
      maxParticipants: 15,
      registeredParticipants: 8,
      cost: 1500,
      organizer: { name: "Vincent Price", role: "Digital Artist", avatar: "V" },
      status: "upcoming",
    },
  ],
};

// Global variables
let currentClub = "";
let currentEvents = [];
let filteredEvents = [];
let selectedEvent = null;

// Wait for DOM to be loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeEventsPage();
});

function initializeEventsPage() {
  // Get club from URL parameter or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  currentClub =
    urlParams.get("club") || localStorage.getItem("currentClub") || "science";

  // Set up the page for the current club
  setupClubEvents(currentClub);

  // Set up event listeners
  setupEventListeners();

  // Load and display events
  loadEvents();

  console.log(`📅 Club Events Page loaded for ${currentClub} club`);
}

function setupClubEvents(clubType) {
  const clubTitles = {
    science: "Science Club Events",
    maths: "Math Club Events",
    commerce: "Commerce Club Events",
    art: "Art Club Events",
  };

  const clubDescriptions = {
    science: "Discover and join exciting science events in your community",
    maths: "Explore mathematical concepts through interactive events",
    commerce: "Develop business skills and network with fellow entrepreneurs",
    art: "Express your creativity and learn new artistic techniques",
  };

  document.getElementById("clubEventsTitle").textContent =
    clubTitles[clubType] || "Club Events";
  document.getElementById("clubEventsDescription").textContent =
    clubDescriptions[clubType] || "Join amazing events in your community";
}

function setupEventListeners() {
  // Filter and sort event listeners
  document
    .getElementById("eventStatus")
    .addEventListener("change", filterEvents);
  document.getElementById("eventType").addEventListener("change", filterEvents);
  document
    .getElementById("sortBy")
    .addEventListener("change", sortAndDisplayEvents);

  // Modal event listeners
  document
    .getElementById("createEventForm")
    .addEventListener("submit", handleCreateEvent);

  // Set minimum date for new events to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("newEventDate").min = today;

  // Close modals when clicking outside
  document
    .getElementById("eventDetailModal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeEventDetailModal();
      }
    });

  document
    .getElementById("createEventModal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeCreateEventModal();
      }
    });

  // ESC key to close modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeEventDetailModal();
      closeCreateEventModal();
    }
  });
}

function loadEvents() {
  currentEvents = eventsData[currentClub] || [];

  // Update header stats
  const totalEvents = currentEvents.length;
  const upcomingEvents = currentEvents.filter(
    (event) => event.status === "upcoming"
  ).length;

  document.getElementById("totalEvents").textContent = totalEvents;
  document.getElementById("upcomingEvents").textContent = upcomingEvents;

  // Apply current filters
  filterEvents();
}

function filterEvents() {
  const statusFilter = document.getElementById("eventStatus").value;
  const typeFilter = document.getElementById("eventType").value;

  filteredEvents = currentEvents.filter((event) => {
    const statusMatch = statusFilter === "all" || event.status === statusFilter;
    const typeMatch = typeFilter === "all" || event.type === typeFilter;
    return statusMatch && typeMatch;
  });

  sortAndDisplayEvents();
}

function sortAndDisplayEvents() {
  const sortBy = document.getElementById("sortBy").value;

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return (
          new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
        );
      case "date-desc":
        return (
          new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
        );
      case "participants":
        return b.registeredParticipants - a.registeredParticipants;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  displayEvents(sortedEvents);
}

function displayEvents(events) {
  const eventsGrid = document.getElementById("eventsGrid");
  const noEventsMessage = document.getElementById("noEventsMessage");

  if (events.length === 0) {
    eventsGrid.style.display = "none";
    noEventsMessage.style.display = "block";
    return;
  }

  eventsGrid.style.display = "grid";
  noEventsMessage.style.display = "none";

  eventsGrid.innerHTML = "";

  events.forEach((event, index) => {
    const eventCard = createEventCard(event);
    eventCard.style.animationDelay = `${index * 0.1}s`;
    eventCard.classList.add("fade-in-up");
    eventsGrid.appendChild(eventCard);
  });
}

function createEventCard(event) {
  const card = document.createElement("div");
  card.className = `event-card ${event.status === "past" ? "past-event" : ""}`;
  card.onclick = () => openEventDetail(event);

  const eventDate = new Date(event.date + "T" + event.time);
  const formattedDate = formatEventDate(eventDate);
  const formattedTime = formatEventTime(eventDate);

  const isToday = isEventToday(eventDate);
  const statusClass =
    event.status === "past" ? "past" : isToday ? "today" : "upcoming";
  const statusText =
    event.status === "past" ? "Past Event" : isToday ? "Today" : "Upcoming";

  card.innerHTML = `
        <div class="event-header">
            <span class="event-type">${event.type}</span>
            <span class="event-status ${statusClass}">${statusText}</span>
        </div>
        
        <h3 class="event-title">${event.title}</h3>
        <p class="event-description">${event.description}</p>
        
        <div class="event-meta">
            <div class="meta-row">
                <span class="meta-icon">📅</span>
                <span>${formattedDate} at ${formattedTime}</span>
            </div>
            <div class="meta-row">
                <span class="meta-icon">📍</span>
                <span>${event.location}</span>
            </div>
            <div class="meta-row">
                <span class="meta-icon">👤</span>
                <span>Organized by ${event.organizer.name}</span>
            </div>
        </div>
        
        <div class="event-footer">
            <div class="participants-info">
                <span class="participants-count">${
                  event.registeredParticipants
                }/${event.maxParticipants}</span>
                <span>participants</span>
            </div>
            <div class="event-cost ${event.cost === 0 ? "free" : ""}">
                ${event.cost === 0 ? "Free" : `Rs. ${event.cost}`}
            </div>
        </div>
    `;

  return card;
}

function openEventDetail(event) {
  selectedEvent = event;

  const eventDate = new Date(event.date + "T" + event.time);
  const formattedDateTime = `${formatEventDate(eventDate)} at ${formatEventTime(
    eventDate
  )}`;

  // Populate modal with event data
  document.getElementById("eventDetailIcon").textContent = getEventIcon(
    event.type
  );
  document.getElementById("eventDetailTitle").textContent = event.title;
  document.getElementById("eventDetailDateTime").textContent =
    formattedDateTime;
  document.getElementById("eventDetailLocation").textContent = event.location;
  document.getElementById(
    "eventDetailParticipants"
  ).textContent = `${event.registeredParticipants} / ${event.maxParticipants} registered`;
  document.getElementById("eventDetailCost").textContent =
    event.cost === 0 ? "Free" : `Rs. ${event.cost}`;
  document.getElementById("eventDetailDescription").textContent =
    event.description;

  // Organizer info
  document.getElementById("organizerAvatar").textContent =
    event.organizer.avatar;
  document.getElementById("organizerName").textContent = event.organizer.name;
  document.getElementById("organizerRole").textContent = event.organizer.role;

  // Join button state
  const joinBtn = document.getElementById("joinEventBtn");
  if (event.status === "past") {
    joinBtn.textContent = "Event Ended";
    joinBtn.disabled = true;
    joinBtn.style.background = "#6c757d";
  } else if (event.registeredParticipants >= event.maxParticipants) {
    joinBtn.textContent = "Event Full";
    joinBtn.disabled = true;
    joinBtn.style.background = "#dc3545";
  } else {
    joinBtn.textContent = "Join Event";
    joinBtn.disabled = false;
    joinBtn.style.background = "#4caf50";
  }

  // Show modal
  document.getElementById("eventDetailModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeEventDetailModal() {
  document.getElementById("eventDetailModal").classList.remove("active");
  document.body.style.overflow = "auto";
  selectedEvent = null;
}

function joinEvent() {
  if (
    !selectedEvent ||
    selectedEvent.registeredParticipants >= selectedEvent.maxParticipants
  ) {
    return;
  }

  // Update event data
  selectedEvent.registeredParticipants++;

  // Update the events data
  const eventIndex = currentEvents.findIndex((e) => e.id === selectedEvent.id);
  if (eventIndex !== -1) {
    currentEvents[eventIndex] = selectedEvent;
  }

  // Close modal and refresh display
  closeEventDetailModal();
  showSuccessMessage(`Successfully joined "${selectedEvent.title}"!`);

  // Refresh the events display
  sortAndDisplayEvents();
}

function openCreateEventModal() {
  document.getElementById("createEventModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCreateEventModal() {
  document.getElementById("createEventModal").classList.remove("active");
  document.body.style.overflow = "auto";
  document.getElementById("createEventForm").reset();
}

function handleCreateEvent(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const eventData = {
    id: Date.now(), // Simple ID generation
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description"),
    date: formData.get("date"),
    time: formData.get("time"),
    location: formData.get("location"),
    maxParticipants: parseInt(formData.get("maxParticipants")),
    registeredParticipants: 0,
    cost: parseInt(formData.get("cost")),
    organizer: {
      name: "You",
      role: "Event Organizer",
      avatar: "Y",
    },
    status: "upcoming",
  };

  // Add to current events
  currentEvents.push(eventData);

  // Close modal and refresh
  closeCreateEventModal();
  showSuccessMessage("Event created successfully!");

  // Reload events
  loadEvents();
}

function clearFilters() {
  document.getElementById("eventStatus").value = "all";
  document.getElementById("eventType").value = "all";
  document.getElementById("sortBy").value = "date-asc";
  filterEvents();
}

function goBackToCommunity() {
  // Store current club for potential return
  localStorage.setItem("currentClub", currentClub);
  window.location.href = "community.html";
}

// Utility functions
function formatEventDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatEventTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function isEventToday(eventDate) {
  const today = new Date();
  return eventDate.toDateString() === today.toDateString();
}

function getEventIcon(type) {
  const icons = {
    workshop: "🔬",
    meetup: "👥",
    seminar: "📚",
    competition: "🏆",
  };
  return icons[type] || "📅";
}

function showSuccessMessage(message) {
  const successMessage = document.getElementById("successMessage");
  const successText = document.getElementById("successText");

  successText.textContent = message;
  successMessage.style.display = "block";
  successMessage.classList.add("show");

  setTimeout(() => {
    successMessage.classList.remove("show");
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 300);
  }, 3000);
}

// Initialize page when coming from community page with club parameter
function initializeFromCommunity(clubType) {
  currentClub = clubType;
  localStorage.setItem("currentClub", clubType);
  setupClubEvents(clubType);
  loadEvents();
}
