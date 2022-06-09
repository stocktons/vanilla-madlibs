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

function getUserChoices(event) {
  console.log("way to click that button!")
  event.preventDefault();
  const respList = document.querySelectorAll('[type="text"]')
  const values = Array.from(respList).map(r => r.value);
  createStory(values);
}

function createStory(userInput) {
  // TODO: this needs work to get rid of awkward spaces
  const storyArr = madlib.storyText.map((s, i) => {
    if (s === undefined || s === 0) s = '';
    if (userInput[i] === undefined) userInput[i] = '';
    return `${s.toString().trim()} ${userInput[i].trim()}`
  });
  addStory(storyArr.join(" "));
}

function addStory(story) {
  const newStory = document.createElement("div");
  newStory.setAttribute("id", "story");
  newStory.innerHTML = story;
  STORY.append(story);
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