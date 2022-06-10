"use strict";

const GAME_BUTTON = document.getElementById("game-button");
const SPIN_CONTAINER = document.getElementById("spin-container");
const MADLIBS_FORM = document.getElementsByTagName("form")[0];
const STORY = document.getElementById("story");

// new instance of a Madlib game
let madlib;

/** Clears old story from the page if there is one, creates new form blanks 
 * from new Madlib instance.
 */
function createBlanks() {
  MADLIBS_FORM.innerHTML = "";
  STORY.innerHTML = "";

  const blanks = madlib.blanks;
  // loop through array of blanks
  for (let i = 0; i < blanks.length; i++) {
    // create a unique id for each blank
    const fieldId = `${blanks[i]}-${i}`;

    // create a wrapper div for each label and input field
    const fieldDiv = document.createElement("div");

    // create a label
    const newlabel = document.createElement("label");
    newlabel.setAttribute("for", fieldId)
    newlabel.innerHTML = blanks[i];

    // create a field
    const newField = document.createElement("input");
    newField.setAttribute("type", "text");
    newField.setAttribute("id", fieldId);
    newField.required = true;

    // add label and field to wrapper div
    fieldDiv.appendChild(newlabel);
    fieldDiv.appendChild(newField);

    // add wrapper div to form
    MADLIBS_FORM.appendChild(fieldDiv);
  }
  // create submit button
  const submitButton = document.createElement("input");
  console.log("created submit button")
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("value", "submit");

  // add button to form
  MADLIBS_FORM.appendChild(submitButton);
  console.log("added button to form")

  // add eventListener to submit button
  MADLIBS_FORM.addEventListener('submit', getUserChoices);
}

/** Grabs user entries from form blanks, places them into an array
 * Disables form button to prevent re-submissions
 */
function getUserChoices(event) {
  console.log("way to click that button!")
  event.preventDefault();
  const submitButton = MADLIBS_FORM.lastChild;
  MADLIBS_FORM.removeChild(submitButton);
  const respList = document.querySelectorAll('[type="text"]')
  const values = Array.from(respList).map(r => r.value);
  createStory(values);
}

/** Takes in user input and alternates it with the Madlib's story text. 
 */
function createStory(userInput) {
  let story = '';
  
  const storyArr = madlib.storyText.map((s, i) => {
    // sometimes arrays are not of equal length, or have a 0 to mark the end.
    if (s === undefined || s === 0) s = '';
    if (userInput[i] === undefined) userInput[i] = '';
    // trim any extra white space from both storyText and user input
    return `${s.toString().trim()} ${userInput[i].trim()}`
  });
  
  // When a storyText snippet begins with a letter, but not an "s ", add
  // a space before. Otherwise, don't a space, because it's either punctuation
  // like a period at the end of a sentence, or an s pluralizing a word. 
  for (const str of storyArr) {
    if ((str.charCodeAt(str[0]) > 64 && str.charCodeAt(str[0] < 123)) && !(str.startsWith("s "))) {
      story += ` ${str}`;
    } else {
      story += str;
    }
  }
  addStory(story);
}

function addStory(story) {
  const p = document.createElement("p");
  STORY.append(p);
  p.innerText = story;
  // reveal Title
  document.getElementById("title").hidden = false;
}

function createTitle() {
  const storyTitle = document.createElement("h1");
  storyTitle.setAttribute("id", "title");
  storyTitle.innerHTML = madlib.title;
  storyTitle.hidden = true;
  STORY.append(storyTitle);
}

/**
 * Shows loading spinner, hides start button and madlib
 */
function showLoadingState() {
  // going to load data; show loading spinner; hide (re)start button & board
  SPIN_CONTAINER.style.display = 'block';
  GAME_BUTTON.hidden = true;
  MADLIBS_FORM.hidden = true;
}

/**
 * Shows madlib, updates start button text and hides loading spinner
 */
function hideLoadingState() {
  // finished setting up madlib: hide spinner; show button & madlib form
  MADLIBS_FORM.hidden = false;
  GAME_BUTTON.innerText = "Get a new Madlib";
  GAME_BUTTON.hidden = false;
  SPIN_CONTAINER.style.display = 'none';
}

/**
 * Generates new game instance, creates Madlibs form in DOM, and creates hidden
 * title
 */
async function startGame() {
  showLoadingState();

  madlib = await Madlib.getRandomMadlib();

  createBlanks(); // clear old story & title here
  createTitle();
  hideLoadingState();
}

GAME_BUTTON.addEventListener("click", startGame);