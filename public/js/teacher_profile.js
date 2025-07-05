document.addEventListener('DOMContentLoaded', () => {
    // Simulated teacher registration data
    const teacherData = {
        "Maria Perera": {
            firstName: "Maria",
            lastName: "Perera",
            phone: "+94 112 345 678",
            location: "Colombo, Western Province",
            bio: "Passionate artist with over 5 years of teaching experience in painting and sculpture.",
            skills: ["Painting", "Drawing", "Sculpture"],
            experience: "4-7 years",
            language: "English",
            rate: "1000",
            reviews: "4.8 (120 reviews)"
        },
        "Nimal Silva": {
            firstName: "Nimal",
            lastName: "Silva",
            phone: "+94 112 345 679",
            location: "Kandy, Central Province",
            bio: "Experienced musician teaching guitar, piano, and singing for all levels.",
            skills: ["Guitar", "Piano", "Singing"],
            experience: "8+ years",
            language: "English",
            rate: "1200",
            reviews: "4.9 (150 reviews)"
        },
        "Ayesha Fernando": {
            firstName: "Ayesha",
            lastName: "Fernando",
            phone: "+94 112 345 680",
            location: "Galle, Southern Province",
            bio: "Language expert specializing in conversational practice and grammar.",
            skills: ["Conversational Practice", "Grammar"],
            experience: "1-3 years",
            language: "English",
            rate: "800",
            reviews: "4.7 (90 reviews)"
        },
        "Kamal Wijesinghe": {
            firstName: "Kamal",
            lastName: "Wijesinghe",
            phone: "+94 112 345 681",
            location: "Negombo, Western Province",
            bio: "Tech enthusiast teaching computer basics and mobile app development.",
            skills: ["Computer Basics", "Mobile Apps"],
            experience: "4-7 years",
            language: "English",
            rate: "1500",
            reviews: "4.6 (80 reviews)"
        },
        "Sanjani Ranasinghe": {
            firstName: "Sanjani",
            lastName: "Ranasinghe",
            phone: "+94 112 345 682",
            location: "Colombo, Western Province",
            bio: "Culinary expert offering workshops in baking and nutrition.",
            skills: ["Baking", "Nutrition", "Food Safety"],
            experience: "1-3 years",
            language: "English",
            rate: "1100",
            reviews: "4.8 (110 reviews)"
        },
        "Ruwan Jayawardena": {
            firstName: "Ruwan",
            lastName: "Jayawardena",
            phone: "+94 112 345 683",
            location: "Kandy, Central Province",
            bio: "Home improvement specialist teaching gardening and home repair.",
            skills: ["Gardening", "Home Repair"],
            experience: "8+ years",
            language: "English",
            rate: "900",
            reviews: "4.5 (70 reviews)"
        },
        "Lakshi Mendis": {
            firstName: "Lakshi",
            lastName: "Mendis",
            phone: "+94 112 345 684",
            location: "Galle, Southern Province",
            bio: "Wellness coach specializing in yoga, meditation, and nutrition.",
            skills: ["Yoga", "Meditation", "Nutrition"],
            experience: "4-7 years",
            language: "English",
            rate: "950",
            reviews: "4.9 (130 reviews)"
        },
        "Chathura de Silva": {
            firstName: "Chathura",
            lastName: "de Silva",
            phone: "+94 112 345 685",
            location: "Negombo, Western Province",
            bio: "Professional skills coach focusing on resume writing and leadership.",
            skills: ["Resume Writing", "Leadership"],
            experience: "8+ years",
            language: "English",
            rate: "1300",
            reviews: "4.7 (95 reviews)"
        },
        "Nadeesha Gunawardena": {
            firstName: "Nadeesha",
            lastName: "Gunawardena",
            phone: "+94 112 345 686",
            location: "Colombo, Western Province",
            bio: "Traditional crafts expert teaching weaving and folk arts.",
            skills: ["Weaving", "Traditional Crafts"],
            experience: "1-3 years",
            language: "English",
            rate: "850",
            reviews: "4.6 (85 reviews)"
        }
    };

    // Get teacher name from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const teacherName = decodeURIComponent(urlParams.get('teacher') || 'Unknown Teacher');
    
    // Populate profile details
    const teacher = teacherData[teacherName] || {};
    document.getElementById('teacherAvatar').textContent = teacherName.charAt(0).toUpperCase();
    document.getElementById('teacherName').textContent = teacherName;
    document.getElementById('teacherFirstName').textContent = teacher.firstName || 'Not available';
    document.getElementById('teacherLastName').textContent = teacher.lastName || 'Not available';
    document.getElementById('teacherPhone').textContent = teacher.phone || 'Not available';
    document.getElementById('teacherLocation').textContent = teacher.location || 'Not available';
    document.getElementById('teacherBio').textContent = teacher.bio || 'Not available';
    document.getElementById('teacherSkills').textContent = teacher.skills ? teacher.skills.join(', ') : 'Not available';
    document.getElementById('teacherExperience').textContent = teacher.experience || 'Not available';
    document.getElementById('teacherLanguage').textContent = teacher.language || 'Not available';
    document.getElementById('teacherRate').textContent = teacher.rate ? `LKR ${teacher.rate}/hour` : 'Not available';
    document.getElementById('teacherReviews').textContent = teacher.reviews || 'Not available';
});

// Simulate sending contact request to admin panel
function contactTeacher() {
    const urlParams = new URLSearchParams(window.location.search);
    const teacherName = decodeURIComponent(urlParams.get('teacher') || 'Unknown Teacher');
    // Simulate sending request to admin panel (replace with actual API call in production)
    console.log(`Contact request for ${teacherName} sent to admin panel.`);
    alert(`Contact request for ${teacherName} has been sent to the admin panel.`);
}