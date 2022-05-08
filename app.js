"use strict";
const MADLIBS_URL = 'http://madlibz.herokuapp.com/api/random'

async function getRandomMadlib() {
    const response = await fetch(MADLIBS_URL);
    const data = await response.json();
    console.log('getRandom', data);
    return data;
}

let storyText = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("made it")
        const data = await getRandomMadlib();
        // data has blanks, value, title
        const blanks = data.blanks;
        const snippets = data.value;
        const title = data.title;
        addBlanks(blanks);
        createTitle(title);
        storyText.push(...snippets);
    } catch (e) {
        console.error(`Error! ${e}`);
    }
})

function addBlanks(blanks) {
    // without this condition, it creates two forms, one with just a submit button 
    if (blanks.length > 0) { 
        // create a new form element
        const form = document.createElement("form");
        form.setAttribute("id", "form");
        // loop through array of blanks
        for (let i = 0; i < blanks.length; i++) {
            console.log(blanks[i])
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
            form.appendChild(fieldDiv);
        }

        // create submit button
        const submitButton = document.createElement("input");
        console.log("created submit button")
        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "submit");

        // add button to form
        form.appendChild(submitButton);
        console.log("added button to form")

        // add form to DOM
        document.body.appendChild(form);
        console.log('added form to DOM')

        // add eventListener to submit button
        form.addEventListener('submit', getUserChoices);
    }
}

function getUserChoices(event) {
    console.log("way to click that button!")
    event.preventDefault();
    const respList = document.querySelectorAll('[type="text"]')
    const values = Array.from(respList).map(r => r.value);
    createStory(values);
  }

  function createStory(userInput, story=storyText) {
    const storyArr = story.map((s, i) => {
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
      document.body.append(story);
      // reveal Title
      document.getElementById("title").hidden = false;
  }

  function createTitle(title) {
      const storyTitle = document.createElement("h1");
      storyTitle.setAttribute("id", "title");
      storyTitle.innerHTML = title;
      storyTitle.hidden = true;
      document.body.append(storyTitle); 
  }

document.body.onload = addBlanks; 
