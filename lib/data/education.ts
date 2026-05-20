import type { EducationItem } from "@/lib/types";

export const EDUCATION: EducationItem[] = [
  {
    school: "Simon Fraser University",
    location: "Burnaby, BC",
    period: "Sep 2023 — Apr 2027",
    expected: "Expected graduation: April 2027",
    degree: "Bachelor of Science in Computer Science",
    notes: [
      "CGPA: 3.43 / 4.33",
      "Dean's Honor Roll · Fall 2024 · Faculty of Applied Science",
      "Dean's Honor Roll · Summer 2025 · Faculty of Applied Science",
    ],
  },
  {
    school: "Semiahmoo Secondary",
    location: "Surrey, BC",
    period: "Sep 2018 — Jun 2023",
    expected: null,
    degree: "High School Diploma",
    notes: ["CGPA: 3.9 / 4.0", "Programming Club member · since Sep 2021"],
  },
];
