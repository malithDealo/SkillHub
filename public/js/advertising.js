const teachers = [
  {
    name: "Nalaka Lekamage",
    subject: "Mathematics",
    desc: "Expert in algebra and calculus with 10+ years.",
    rating: 4.8,
    image:
      "https://cdn.pixabay.com/photo/2013/08/25/15/15/moody-175729_1280.jpg",
  },
  {
    name: "Lakman Mirihella",
    subject: "Physics",
    desc: "Passionate about experiments and theory.",
    rating: 4.5,
    image:
      "https://cdn.pixabay.com/photo/2021/10/25/18/21/boy-6741717_1280.jpg",
  },
  {
    name: "Janaki Mudalige",
    subject: "Chemistry",
    desc: "Specialist in organic and inorganic chemistry.",
    rating: 4.2,
    image:
      "https://plus.unsplash.com/premium_photo-1705170973214-74631ffb06de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNyaSUyMGxhbmthbiUyMG1lbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Nandani Herath",
    subject: "Biology",
    desc: "Loves teaching about ecosystems and genetics.",
    rating: 4.7,
    image:
      "https://media.istockphoto.com/id/544352510/photo/portrait-of-a-teacher.jpg?s=1024x1024&w=is&k=20&c=bIVxl4VtvNnWg8JghUdF1_9VcOeO0bCmDB_c6RkVvTc=",
  },
  {
    name: "Sangeetha Pushpakumari",
    subject: "English",
    desc: "Enhances writing and literature skills.",
    rating: 4.9,
    image:
      "https://media.istockphoto.com/id/1498218111/photo/young-man-wearing-green-shirt-standing-over-green-background.jpg?s=1024x1024&w=is&k=20&c=aJvGxM09j7YbqOT3XgM1ODHII1wsNFGzPoUecSx75IA=",
  },
  {
    name: "Aruna Wijesinghe",
    subject: "History",
    desc: "Engages students with historical narratives.",
    rating: 4.0,
    image:
      "https://cdn.pixabay.com/photo/2023/02/09/19/25/monk-7779550_1280.jpg",
  },
  {
    name: "Pavithra Subashini",
    subject: "Computer Science",
    desc: "Teaches coding from basics to advanced.",
    rating: 4.6,
    image:
      "https://media.istockphoto.com/id/1398275235/photo/portrait-of-a-young-man-outdoors.jpg?s=612x612&w=0&k=20&c=0VguuS3bWsnFGcb6paUPe74Wn1a1i9DU7JVKt_ke8xQ=",
  },
  {
    name: "Anton Jayakodi",
    subject: "Art",
    desc: "Guides students in creative expression.",
    rating: 4.3,
    image:
      "https://cdn.pixabay.com/photo/2013/08/25/15/18/giant-175735_1280.jpg",
  },
  {
    name: "Achini Perera",
    subject: "Music",
    desc: "Offers lessons in theory and performance.",
    rating: 4.8,
    image:
      "https://cdn.pixabay.com/photo/2013/09/23/18/17/pose-185375_1280.jpg",
  },
  {
    name: "Wimal Weerasinghe",
    subject: "Spanish",
    desc: "Immersive language learning with a native speaker.",
    rating: 4.4,
    image:
      "https://media.istockphoto.com/id/185897749/photo/man-in-sri-lanka.jpg?s=1024x1024&w=is&k=20&c=ryCmjFY-MB5t4EA3GpDGpOnzDRo-4ABTwpwJGkvGPHo=",
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
        <div class="teacher-avatar">
            <img src="${teacher.image}" alt="${teacher.name}" class="teacher-image" />
        </div>
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
