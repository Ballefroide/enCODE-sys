
import { Language, Level } from "./types";

export const MOCK_LEVELS: Level[] = [
  // --- CHAPTER 0: SYSTEM INITIALIZATION (Tutorials) ---
  {
    id: '0-0',
    chapter: 0,
    subChapter: 0,
    title: 'Buffer Calibration',
    language: Language.JAVASCRIPT,
    description: 'Welcome, operative. Before we begin, we must calibrate your neural interface. Type the following string exactly as shown to verify your input buffer: "I am ready to encode."',
    objective: 'Output the string "I am ready to encode." using a return statement or console.log.',
    targetOutput: 'I am ready to encode.',
    difficulty: 'Easy'
  },
  {
    id: '0-1',
    chapter: 0,
    subChapter: 1,
    title: 'Web Foundation (HTML)',
    language: Language.HTML,
    description: 'HTML (HyperText Markup Language) is the skeletal structure of the web. It uses "tags" to define elements. Create a top-level heading using the <h1> tag with the content "NODE_ACTIVE".',
    objective: 'Create an <h1> tag containing the text "NODE_ACTIVE".',
    targetOutput: '<h1>NODE_ACTIVE</h1>',
    difficulty: 'Easy'
  },
  {
    id: '0-2',
    chapter: 0,
    subChapter: 2,
    title: 'Visual Protocol (CSS)',
    language: Language.CSS,
    description: 'CSS (Cascading Style Sheets) controls the aesthetics. Target the "body" element and set its "color" property to "lime" to match our terminal aesthetic.',
    objective: 'Apply a CSS rule to the body that sets color: lime;',
    targetOutput: 'body { color: lime; }',
    difficulty: 'Easy'
  },
  {
    id: '0-3',
    chapter: 0,
    subChapter: 3,
    title: 'Logic Bridge (JS)',
    language: Language.JAVASCRIPT,
    description: 'JavaScript provides the logic. Variables store data. Declare a variable named "status" and assign it the string "ONLINE".',
    objective: 'Declare a variable: let status = "ONLINE";',
    targetOutput: 'let status = "ONLINE";',
    difficulty: 'Easy'
  },
  {
    id: '0-4',
    chapter: 0,
    subChapter: 4,
    title: 'Low-Level Access (C++)',
    language: Language.CPP,
    description: 'C++ is a high-performance, low-level language. Use the standard character output stream "std::cout" to print the word "BOOTING". Remember to include the semicolon.',
    objective: 'Write: std::cout << "BOOTING";',
    targetOutput: 'std::cout << "BOOTING";',
    difficulty: 'Easy'
  },
  {
    id: '0-5',
    chapter: 0,
    subChapter: 5,
    title: 'Object Runtime (Java)',
    language: Language.JAVA,
    description: 'Java is strictly object-oriented. Everything exists inside a Class. Define a public class named "Kernel" with an empty body.',
    objective: 'Define: public class Kernel {}',
    targetOutput: 'public class Kernel {}',
    difficulty: 'Easy'
  },

  // --- CHAPTER 1: WEB BASICS ---
  {
    id: '1',
    chapter: 1,
    subChapter: 1,
    title: 'Project Branding',
    language: Language.HTML,
    description: 'ANONYMOUS_REQUEST_ID_0x9F: "We need a frontend facade for the shadow hub. Minimalist. Brutalist. Header must read \'Project EnCode\'. Include a descriptive paragraph. Speed is of the essence. Don\'t ask questions."',
    objective: 'Render an <h1> with "Project EnCode" and a <p> tag with descriptive text.',
    targetOutput: 'Header: Project EnCode, Body: A programming puzzle game.',
    difficulty: 'Easy'
  },
  {
    id: '2',
    chapter: 1,
    subChapter: 2,
    title: 'Stylish Interaction',
    language: Language.CSS,
    description: 'ENCRYPTED_SIGNAL_SPECTRE: "Our data-leach tool needs a trigger button. Visual urgency is required: Bright red background, white text, 8px rounding. If it doesn\'t look like an emergency, our operatives won\'t press it."',
    objective: 'Create a button styled with CSS: background red, white text, 8px border-radius.',
    targetOutput: '<button style="background:red; color:white; border-radius: 8px">Submit</button>',
    difficulty: 'Easy'
  },

  // --- CHAPTER 2: ALGORITHMIC LOGIC ---
  {
    id: '3',
    chapter: 2,
    subChapter: 1,
    title: 'Iterative Cycles',
    language: Language.CPP,
    description: 'PROXY_ADMIN_7: "Testing system throughput. We need a sequence relay that cycles from 1 to 5. Output must be discrete integers on separate lines. Standard IO streams only. Efficiency is mandatory."',
    objective: 'Use a for loop to print integers 1 through 5.',
    targetOutput: '1\n2\n3\n4\n5',
    difficulty: 'Medium'
  },

  // --- CHAPTER 3: SYSTEMS ARCHITECTURE ---
  {
    id: '4',
    chapter: 3,
    subChapter: 1,
    title: 'Neural Entities',
    language: Language.JAVA,
    description: 'REDACTED_CLIENT: "Simulating synthetic labor units. Construct a \'Robot\' blueprint. It requires a \'speak\' functionality that returns a primitive binary acknowledgement: \'Beep Boop\'. Ensure strict typing protocols."',
    objective: 'Define a class Robot with a speak() method returning "Beep Boop".',
    targetOutput: 'Beep Boop',
    difficulty: 'Hard'
  }
];

export const QUOTES = [
  "It works on my machine.",
  "There are 10 types of people in the world...",
  "Premature optimization is the root of all evil.",
  "Have you tried turning it off and on again?",
  "Refactoring: Cleaning the kitchen while cooking.",
];
