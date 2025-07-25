const teachers = [
  {
    name: "John Doe",
    subject: "Mathematics",
    desc: "Expert in algebra and calculus with 10+ years.",
    rating: 4.8,
  },
  {
    name: "Jane Smith",
    subject: "Physics",
    desc: "Passionate about experiments and theory.",
    rating: 4.5,
  },
  {
    name: "Emily Johnson",
    subject: "Chemistry",
    desc: "Specialist in organic and inorganic chemistry.",
    rating: 4.2,
  },
  {
    name: "Michael Brown",
    subject: "Biology",
    desc: "Loves teaching about ecosystems and genetics.",
    rating: 4.7,
  },
  {
    name: "Sarah Davis",
    subject: "English",
    desc: "Enhances writing and literature skills.",
    rating: 4.9,
  },
  {
    name: "David Wilson",
    subject: "History",
    desc: "Engages students with historical narratives.",
    rating: 4.0,
  },
  {
    name: "Laura Martinez",
    subject: "Computer Science",
    desc: "Teaches coding from basics to advanced.",
    rating: 4.6,
  },
  {
    name: "James Anderson",
    subject: "Art",
    desc: "Guides students in creative expression.",
    rating: 4.3,
  },
  {
    name: "Olivia Taylor",
    subject: "Music",
    desc: "Offers lessons in theory and performance.",
    rating: 4.8,
  },
  {
    name: "Daniel Thomas",
    subject: "Spanish",
    desc: "Immersive language learning with a native speaker.",
    rating: 4.4,
  },
];

const adContainer = document.getElementById("adContainer");

teachers.forEach((teacher) => {
  const roundedRating = Math.round(teacher.rating);
  const filledStars = "★".repeat(roundedRating);
  const emptyStars = "☆".repeat(5 - roundedRating);
  const starHtml = `<span class="filled-stars">${filledStars}</span><span class="empty-stars">${emptyStars}</span>`;

  const adCard = document.createElement("div");
  adCard.className = "ad-card";
  adCard.innerHTML = `
        <div class="teacher-avatar"></div>
        <h3>${teacher.name}</h3>
        <p><strong>Subject:</strong> ${teacher.subject}</p>
        <p>${teacher.desc}</p>
        <div class="rating">${starHtml} (${teacher.rating} / 5)</div>
        <button>Book Now</button>
    `;
  adCard.addEventListener("click", () => {
    alert(`Learn more about ${teacher.name}`);
  });
  const button = adCard.querySelector("button");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    alert(`Booking a session with ${teacher.name}`);
  });
  adContainer.appendChild(adCard);
});
