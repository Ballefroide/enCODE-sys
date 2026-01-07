
import { Language, Level } from "./types";

export const CHAPTER_NAMES: Record<number, { immersive: string; simple: string }> = {
  0: { immersive: 'SYSTEM INITIALIZATION', simple: 'Tutorials' },
  1: { immersive: 'WEB BASICS', simple: 'Web Design' },
  2: { immersive: 'ALGORITHMIC LOGIC', simple: 'Programming Logic' },
  3: { immersive: 'SYSTEMS ARCHITECTURE', simple: 'Advanced Systems' }
};

export const MOCK_LEVELS: Level[] = [
  // --- CHAPTER 0: CORE TUTORIALS ---
  {
    id: '0.0',
    chapter: 0,
    subChapter: 0,
    title: 'Buffer Calibration',
    language: Language.HTML,
    description: 'Welcome, operative. Before we begin, we must calibrate your neural interface. Type the following text exactly as shown to verify your input buffer: "I am ready to encode."',
    simpleDescription: 'Welcome! To start, please type "I am ready to encode." in the box below to make sure your keyboard is working correctly.',
    objective: 'Type: I am ready to encode.',
    simpleObjective: 'Type "I am ready to encode." exactly as it appears.',
    targetOutput: 'I am ready to encode.',
    difficulty: 'Easy'
  },
  {
    id: '0.1',
    chapter: 0,
    subChapter: 1,
    title: 'Evaluation Discovery',
    language: Language.HTML,
    description: 'The Project EnCode system uses advanced AI to evaluate your work. For this task, type anything in the editor—even a random word—and hit SUBMIT. The AI will then reveal your hidden objective.',
    simpleDescription: 'In this game, an AI checks your work. Try typing anything you want in the editor and click "Check Answer" to see how the feedback system works.',
    objective: 'Submit any text to reveal the secret objective.',
    simpleObjective: 'Type any message and click "Check Answer".',
    targetOutput: 'You discovered how the AI evaluation works!',
    difficulty: 'Easy'
  },

  // --- CHAPTER 0: HTML TUTORIALS ---
  {
    id: '0.2',
    chapter: 0,
    subChapter: 2,
    title: 'HTML: The Shell',
    language: Language.HTML,
    description: 'HTML tags define the structure. Create an <h1> tag with the text "Hello Terminal" to initialize your first viewport element.',
    simpleDescription: 'HTML tags are used to build websites. Use an <h1> tag to make a title that says "Hello Terminal".',
    objective: 'Create an <h1> tag containing "Hello Terminal".',
    simpleObjective: 'Write <h1>Hello Terminal</h1> in the box.',
    targetOutput: '<h1>Hello Terminal</h1>',
    difficulty: 'Easy'
  },
  {
    id: '0.3',
    chapter: 0,
    subChapter: 3,
    title: 'HTML: Paragraphs',
    language: Language.HTML,
    description: 'The <p> tag is used for text blocks. Create a paragraph containing the status code "SYSTEM_NORMAL".',
    simpleDescription: 'The <p> tag is for regular text. Make a paragraph that says "SYSTEM_NORMAL".',
    objective: 'Create a <p> tag containing "SYSTEM_NORMAL".',
    simpleObjective: 'Write <p>SYSTEM_NORMAL</p> in the box.',
    targetOutput: '<p>SYSTEM_NORMAL</p>',
    difficulty: 'Easy'
  },

  // --- CHAPTER 0: CSS TUTORIALS ---
  {
    id: '0.4',
    chapter: 0,
    subChapter: 4,
    title: 'CSS: Colorization',
    language: Language.CSS,
    description: 'CSS rules target elements. Target the "body" and set the "color" to "green". Ensure your syntax includes the braces and semicolon.',
    simpleDescription: 'CSS changes how your page looks. Change the text color of the "body" to "green".',
    objective: 'Apply: body { color: green; }',
    simpleObjective: 'Write body { color: green; } in the style box.',
    targetOutput: 'body { color: green; }',
    difficulty: 'Easy'
  },
  {
    id: '0.5',
    chapter: 0,
    subChapter: 5,
    title: 'CSS: Backgrounds',
    language: Language.CSS,
    description: 'A darker buffer reduces eye strain. Set the "background-color" of the "body" to "black".',
    simpleDescription: 'Change the background color of the "body" to "black".',
    objective: 'Apply: body { background-color: black; }',
    simpleObjective: 'Write body { background-color: black; } in the style box.',
    targetOutput: 'body { background-color: black; }',
    difficulty: 'Easy'
  },

  // --- CHAPTER 0: JS TUTORIALS ---
  {
    id: '0.6',
    chapter: 0,
    subChapter: 6,
    title: 'JS: Variables',
    language: Language.JAVASCRIPT,
    description: 'Variables store logic states. Declare a variable "id" and set it to the number "101".',
    simpleDescription: 'JavaScript stores information in variables. Create a variable called "id" and set it to 101.',
    objective: 'Write: let id = 101;',
    simpleObjective: 'Write let id = 101; in the script box.',
    targetOutput: 'let id = 101;',
    difficulty: 'Easy'
  },
  {
    id: '0.7',
    chapter: 0,
    subChapter: 7,
    title: 'JS: Basic Math',
    language: Language.JAVASCRIPT,
    description: 'Perform a calculation. Create a variable "total" that stores the result of "5 + 10".',
    simpleDescription: 'JavaScript can do math. Create a variable called "total" and set it to the result of 5 plus 10.',
    objective: 'Write: let total = 5 + 10;',
    simpleObjective: 'Write let total = 5 + 10; in the script box.',
    targetOutput: 'let total = 15;',
    difficulty: 'Easy'
  },

  // --- CHAPTER 0: C++ TUTORIALS ---
  {
    id: '0.8',
    chapter: 0,
    subChapter: 8,
    title: 'C++: Standard Output',
    language: Language.CPP,
    description: 'In C++, we use "std::cout" to print text. Output the word "INITIALIZED" to the console stream.',
    simpleDescription: 'In C++, use "std::cout" to show text on the screen. Print the word "INITIALIZED".',
    objective: 'Write: std::cout << "INITIALIZED";',
    simpleObjective: 'Write std::cout << "INITIALIZED"; in the box.',
    targetOutput: 'std::cout << "INITIALIZED";',
    difficulty: 'Easy'
  },
  {
    id: '0.9',
    chapter: 0,
    subChapter: 9,
    title: 'C++: Integer Logic',
    language: Language.CPP,
    description: 'Declare an integer variable "x" and assign it "50". C++ requires strict type definitions.',
    simpleDescription: 'In C++, you must say a variable is an integer (int). Create an "int" named "x" and set it to 50.',
    objective: 'Write: int x = 50;',
    simpleObjective: 'Write int x = 50; in the box.',
    targetOutput: 'int x = 50;',
    difficulty: 'Easy'
  },
  {
    id: '0.10',
    chapter: 0,
    subChapter: 10,
    title: 'C++: Math Operations',
    language: Language.CPP,
    description: 'C++ can calculate values. Create an integer "result" and store the value of "100 / 4".',
    simpleDescription: 'Calculate 100 divided by 4 and store it in an integer called "result".',
    objective: 'Write: int result = 100 / 4;',
    simpleObjective: 'Write int result = 100 / 4; in the box.',
    targetOutput: 'int result = 25;',
    difficulty: 'Easy'
  },
  {
    id: '0.11',
    chapter: 0,
    subChapter: 11,
    title: 'C++: Basic If/Else',
    language: Language.CPP,
    description: 'Use an "if" statement to check if a variable "temp" is greater than "100". If so, print "HOT".',
    simpleDescription: 'Use an "if" statement to check if "temp" is over 100. If it is, show the word "HOT".',
    objective: 'Write: if (temp > 100) { std::cout << "HOT"; }',
    simpleObjective: 'Write an if-statement that prints "HOT" if temp is greater than 100.',
    targetOutput: 'if (temp > 100) { std::cout << "HOT"; }',
    difficulty: 'Easy'
  },

  // --- CHAPTER 1: WEB DESIGN (Applications) ---
  {
    id: '1.0',
    chapter: 1,
    subChapter: 1,
    title: 'Project Branding',
    language: Language.HTML,
    description: 'ANONYMOUS_REQUEST: "We need a header facade for the hub. Header must read \'Project EnCode\'. Include a descriptive paragraph below it."',
    simpleDescription: 'Make a website title that says "Project EnCode" and add a short paragraph describing the project.',
    objective: 'Render an <h1> with "Project EnCode" and a <p> tag with descriptive text.',
    simpleObjective: 'Create a heading with <h1> and a sentence with <p>.',
    targetOutput: '<h1>Project EnCode</h1><p>Welcome to the game.</p>',
    difficulty: 'Easy'
  },
  {
    id: '1.1',
    chapter: 1,
    subChapter: 2,
    title: 'Navigation Matrix',
    language: Language.HTML,
    description: 'NODE_OPERATOR: "Users are getting lost in the sub-grids. Construct a navigation list using the <ul> and <li> tags. Links should read: \'HOME\', \'LOGS\', \'EXIT\'."',
    simpleDescription: 'Create a list of links for a website. Use a bulleted list (<ul>) with three items (<li>): HOME, LOGS, and EXIT.',
    objective: 'Create a <ul> list with three <li> items containing: HOME, LOGS, EXIT.',
    simpleObjective: 'Make a bulleted list with 3 items: HOME, LOGS, EXIT.',
    targetOutput: '<ul><li>HOME</li><li>LOGS</li><li>EXIT</li></ul>',
    difficulty: 'Medium'
  },
  {
    id: '1.2',
    chapter: 1,
    subChapter: 3,
    title: 'Digital Glow',
    language: Language.CSS,
    description: 'STYLING_PROXY: "The terminal looks too flat. Apply a cyan glow to all <h1> headers. Use the text-shadow property with a 5px blur."',
    simpleDescription: 'Make the titles on the page look like they are glowing. Add a "text-shadow" to <h1> tags that is cyan and has a blur of 5px.',
    objective: 'Apply: h1 { text-shadow: 0 0 5px cyan; }',
    simpleObjective: 'Write a CSS rule to make <h1> headers glow cyan.',
    targetOutput: 'h1 { text-shadow: 0 0 5px cyan; }',
    difficulty: 'Medium'
  },

  // --- CHAPTER 2: PROGRAMMING LOGIC (Applications) ---
  {
    id: '2.0',
    chapter: 2,
    subChapter: 1,
    title: 'Access Control',
    language: Language.JAVASCRIPT,
    description: 'SECURITY_DAEMON: "Unauthorized entities are attempting access. Write a script that checks a variable \'clearance_level\'. If it is 5 or higher, set a variable \'access_granted\' to true."',
    simpleDescription: 'Create a security check. If the clearance level is 5 or more, give the user access.',
    objective: 'Write: if (clearance_level >= 5) { let access_granted = true; }',
    simpleObjective: 'Write an if-statement that checks if clearance_level is at least 5.',
    targetOutput: 'if (clearance_level >= 5) { access_granted = true; }',
    difficulty: 'Medium'
  },
  {
    id: '2.1',
    chapter: 2,
    subChapter: 2,
    title: 'Loop Relay',
    language: Language.JAVASCRIPT,
    description: 'COMM_REPEATER: "We need to send a ping signal multiple times. Write a for-loop that executes 3 times. In each loop, add 1 to a variable named \'signal_count\'."',
    simpleDescription: 'Use a loop to count to 3. Each time the loop runs, add 1 to a variable called "signal_count".',
    objective: 'Write a for-loop that repeats 3 times and increments signal_count.',
    simpleObjective: 'Create a for-loop that runs 3 times.',
    targetOutput: 'for (let i = 0; i < 3; i++) { signal_count++; }',
    difficulty: 'Hard'
  },

  // --- CHAPTER 3: ADVANCED SYSTEMS (Applications) ---
  {
    id: '3.0',
    chapter: 3,
    subChapter: 1,
    title: 'Reactor Safety',
    language: Language.CPP,
    description: 'GRID_CONTROL: "Reactor heat is fluctuating. Create a C++ program that checks if an integer \'core_temp\' is greater than 500. If it is, output \'WARNING\' using std::cout."',
    simpleDescription: 'Monitor a reactor. If the core temperature is higher than 500, print the word "WARNING" to the screen.',
    objective: 'Write: if (core_temp > 500) { std::cout << "WARNING"; }',
    simpleObjective: 'Write an if-statement that prints WARNING if core_temp is over 500.',
    targetOutput: 'if (core_temp > 500) { std::cout << "WARNING"; }',
    difficulty: 'Medium'
  },
  {
    id: '3.1',
    chapter: 3,
    subChapter: 2,
    title: 'Efficiency Calculator',
    language: Language.CPP,
    description: 'SYSTEM_ARCHITECT: "We need to calculate node efficiency. Multiply the variables \'base_power\' and \'efficiency_ratio\' (both integers), and output the result."',
    simpleDescription: 'Create a calculator that multiplies base power by the efficiency ratio and shows the answer.',
    objective: 'Write: std::cout << base_power * efficiency_ratio;',
    simpleObjective: 'Multiply base_power by efficiency_ratio and print it.',
    targetOutput: 'std::cout << base_power * efficiency_ratio;',
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
