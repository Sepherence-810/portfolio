/*
 * All portfolio content. Edit this file to update the site.
 * - Sections with an empty list are hidden automatically (with their nav link).
 * - avatar_url, resume_url and certificate image_url can be full URLs or
 *   paths to files in this folder (e.g. "assets/me.jpg").
 * - The contact form opens the visitor's email app addressed to profile.email.
 * - Skills: add `level: 0–100` to a skill to show a progress bar for it.
 * - Projects: `tech` is shown as tags; `url` (optional) adds a "View project" link.
 * - Social links left empty ("") are hidden.
 */
window.PORTFOLIO_DATA = {
  profile: {
    full_name: "Joseph Lawrence A. Santos",
    short_name: "Joseph Santos", // shown in the navbar and footer
    role: "BS Information Technology Student",
    roles: ["IT Student", "Web Developer", "Android Developer", "Student Leader"],
    tagline: "Studying Hard, Working Harder",
    bio: "I'm an aspiring BSIT student at La Consolacion University Philippines, expecting to graduate in 2027, who wants to keep learning and keep working harder. I build for both the web and Android. Most recently, I was the senior developer of Campus Event Hub, our capstone event calendar and participation platform for the college's student organizations, built with PHP, JavaScript and Supabase.\n\nOutside of code, I've held a student leadership role in every year of college, from class vice president to vice president of the College of Information Technology and Engineering. I'm used to planning events, coordinating people and speaking up for the students I represent.",
    location: "Malolos, Bulacan, Philippines",
    email: "santosjosephlawrence@gmail.com",
    phone: "09499315401",
    avatar_url: "",
    resume_url: "assets/Joseph_Lawrence_Santos_Resume.pdf",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    available: true,
    stats: [
      { label: "Projects", value: "3" },
      { label: "Leadership roles", value: "5" },
      { label: "Certificates", value: "2" },
    ],
  },
  projects: [
    {
      title: "Campus Event Hub",
      role: "Senior Developer",
      description: "Capstone project: a web-based event calendar and participation platform for the college's student organizations, built by a five-member team.",
      highlights: [
        "Built core features using PHP and JavaScript, with Supabase (PostgreSQL) as the backend database",
        "Managed version control and team collaboration through GitHub",
      ],
      tech: ["PHP", "JavaScript", "Supabase", "PostgreSQL", "GitHub"],
      url: "",
    },
    {
      title: "Personal Portfolio Website",
      role: "Developer",
      description: "This site: a responsive portfolio to showcase my projects and skills.",
      highlights: ["Designed and built with HTML5, CSS3 and JavaScript", "Deployed and hosted on Vercel"],
      tech: ["HTML5", "CSS3", "JavaScript", "Vercel"],
      url: "",
    },
    {
      title: "Android Mobile Application",
      role: "Developer",
      description: "A native Android application built in Kotlin using Android Studio.",
      highlights: ["Used SQLite for local data storage"],
      tech: ["Kotlin", "Android Studio", "SQLite"],
      url: "",
    },
  ],
  leadership: [
    {
      role: "4th Year Level Representative",
      company: "La Consolacion University Philippines",
      start_date: "Fourth Year",
      end_date: "Present",
      description: "Represent fourth-year students in council meetings, raising their concerns and relaying decisions back to the year level.",
    },
    {
      role: "Vice President",
      company: "College of Information Technology and Engineering",
      start_date: "Third Year",
      description: "Supported the college president in leading council operations and coordinating college-wide activities.",
    },
    {
      role: "3rd Year Representative",
      company: "La Consolacion University Philippines",
      start_date: "Third Year",
      description: "Served as the voice of third-year students in council discussions and planning.",
    },
    {
      role: "Vice President for Event Management",
      company: "La Consolacion University Philippines",
      start_date: "Second Year",
      description: "Led the planning and execution of student events, coordinating logistics, schedules and volunteers.",
    },
    {
      role: "Class Vice President",
      company: "La Consolacion University Philippines",
      start_date: "First Year",
      description: "Assisted the class president in organizing class activities and communicating with classmates and faculty.",
    },
  ],
  education: [
    {
      institution: "La Consolacion University Philippines",
      location: "Malolos, Bulacan",
      degree: "Bachelor of Science",
      field: "Information Technology",
      end_date: "Expected 2027",
    },
    {
      institution: "University of Santo Tomas",
      location: "Manila",
      degree: "Senior High School",
      end_date: "2022",
    },
    {
      institution: "Holy Spirit Academy of Malolos",
      location: "Malolos, Bulacan",
      degree: "Junior High School",
      end_date: "2020",
    },
    {
      institution: "Notre Dame of Greater Manila",
      location: "Caloocan",
      degree: "Grade School",
      end_date: "2016",
    },
  ],
  skills: [
    { name: "PHP", category: "Languages" },
    { name: "JavaScript", category: "Languages" },
    { name: "Kotlin", category: "Languages" },
    { name: "HTML5", category: "Languages" },
    { name: "CSS3", category: "Languages" },
    { name: "PostgreSQL", category: "Databases" },
    { name: "Supabase", category: "Databases" },
    { name: "SQLite", category: "Databases" },
    { name: "GitHub", category: "Tools" },
    { name: "VS Code", category: "Tools" },
    { name: "Android Studio", category: "Tools" },
    { name: "Vercel", category: "Tools" },
    { name: "Cisco Packet Tracer", category: "Tools" },
    { name: "Microsoft Excel", category: "Tools" },
    { name: "Microsoft Access", category: "Tools" },
    { name: "Leadership", category: "Soft Skills" },
    { name: "Problem-Solving", category: "Soft Skills" },
    { name: "Customer Service", category: "Soft Skills" },
    { name: "Creative Thinking", category: "Soft Skills" },
    { name: "Public Speaking", category: "Soft Skills" },
  ],
  certificates: [
    { title: "Fundamentals of Enterprise Security", issuer: "Cloudswyft", issue_date: "", credential_id: "", credential_url: "", image_url: "" },
    { title: "Microsoft Excel and Access", issuer: "", issue_date: "", credential_id: "", credential_url: "", image_url: "" },
  ],
};
