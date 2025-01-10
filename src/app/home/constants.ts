import {
  initialEducation,
  initialProfile,
  initialProject,
  initialWorkExperience,
} from "lib/redux/resumeSlice";
import type { Resume } from "lib/redux/types";
import { deepClone } from "lib/deep-clone";

export const END_HOME_RESUME: Resume = {
  profile: {
    name: "Jane Smith",
    summary:
      "Results-driven software developer with a passion for creating impactful solutions and improving user experiences.",
    email: "jane.smith@openresume.com",
    phone: "987-654-3210",
    location: "San Francisco, CA",
    url: "linkedin.com/in/jane-smith",
    title: "Full-Stack Developer",
  },
  workExperiences: [
    {
      company: "Tech Innovators",
      jobTitle: "Full-Stack Developer",
      date: "June 2022 - Present",
      descriptions: [
        "Built and deployed a scalable e-commerce platform, handling 10,000+ daily transactions with 99.9% uptime.",
        "Led the development of a real-time notification system, enhancing user engagement by 30%.",
        "Implemented CI/CD pipelines to automate deployments and reduce deployment time by 60%.",
      ],
    },
    {
      company: "Global Solutions",
      jobTitle: "Software Engineer Intern",
      date: "Summer 2021",
      descriptions: [
        "Developed a custom analytics dashboard, enabling clients to visualize key metrics and trends.",
        "Optimized API endpoints, reducing average response time from 500ms to 150ms.",
        "Collaborated with designers and product managers to launch a new feature, increasing user retention by 20%.",
      ],
    },
    {
      company: "University Research Lab",
      jobTitle: "Data Science Intern",
      date: "Fall 2020",
      descriptions: [
        "Developed machine learning models to predict student performance, achieving 85% accuracy.",
        "Created interactive visualizations for presenting research findings to a non-technical audience.",
        "Published research findings in an academic journal, increasing lab visibility by 40%.",
      ],
    },
  ],
  educations: [
    {
      school: "Stanford University",
      degree: "Master of Science in Computer Science",
      date: "Sep 2020 - Jun 2022",
      gpa: "3.9",
      descriptions: [
        "Graduate Assistant for Advanced Algorithms (2021 - 2022).",
        "Key Projects: Scalable web application for real-time collaboration, predictive analytics tool for healthcare.",
        "Coursework: Distributed Systems (A), Artificial Intelligence (A+), Data Visualization (A).",
      ],
    },
  ],
  projects: [
    {
      project: "Task Manager Pro",
      date: "Winter 2023",
      descriptions: [
        "Designed and developed a task management web app, helping teams increase productivity by 25%.",
        "Integrated calendar and notifications using Google Calendar API to improve scheduling efficiency.",
        "Implemented secure authentication and authorization using OAuth 2.0 and JWT.",
      ],
    },
  ],
  skills: {
    featuredSkills: [
      { skill: "JavaScript", rating: 4 },
      { skill: "React", rating: 4 },
      { skill: "Node.js", rating: 4 },
      { skill: "TypeScript", rating: 3 },
      { skill: "Python", rating: 3 },
      { skill: "MongoDB", rating: 3 },
      { skill: "Docker", rating: 2 },
      { skill: "Kubernetes", rating: 2 },
      { skill: "Redis", rating: 2 },
      { skill: "PostgreSQL", rating: 3 },
      { skill: "Git", rating: 4 },
      { skill: "CI/CD", rating: 3 },
    ],
    descriptions: [
      "Proficient in modern JavaScript frameworks, backend development, and API design.",
      "Skilled in DevOps practices, including containerization and deployment automation.",
      "Experienced in agile methodologies and cross-functional collaboration.",
    ],
  },
  custom: {
    descriptions: [
      "Volunteer: Organized weekly coding workshops for underrepresented communities, increasing participation by 50%.",
      "Speaker: Presented at TechCon 2023 on scalable web application architectures.",
    ],
  },
};

export const START_HOME_RESUME: Resume = {
  profile: deepClone(initialProfile),
  workExperiences: END_HOME_RESUME.workExperiences.map(() =>
    deepClone(initialWorkExperience)
  ),
  educations: [deepClone(initialEducation)],
  projects: [deepClone(initialProject)],
  skills: {
    featuredSkills: END_HOME_RESUME.skills.featuredSkills.map((item) => ({
      skill: "",
      rating: item.rating,
    })),
    descriptions: [],
  },
  custom: {
    descriptions: [],
  },
};
