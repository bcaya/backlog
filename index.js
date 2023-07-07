import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://videogamedb-b35fa-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const contentListInDB = ref(database, "contentList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const contentListEl = document.getElementById("content-list")

addButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value 

  push(contentListInDB, inputValue)
  clearInputFieldEl()
})

onValue(contentListInDB, function(snapshot) {
  if(snapshot.exists()) {
    let contentArray = Object.entries(snapshot.val())

    clearContentListEl()

    for (let i=0; i < contentArray.length; i++) {
      let currentItem = contentArray[i]
      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]

      appendItemToContentListEl(currentItem)
    }
  } else{
    contentListEl.innerHTML = "Nothing in your backlog yet..."
  }
})

function clearContentListEl() {
  contentListEl.innerHTML = ""
}

function clearInputFieldEl() {
  inputFieldEl.value = ""
}

function appendItemToContentListEl(item) { 
  let itemID = item[0]
  let itemValue = item[1]

  let newEl = document.createElement("li")

  newEl.textContent = itemValue 

  newEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `contentList/${itemID}`)

    remove(exactLocationOfItemInDB)
  })

  contentListEl.append(newEl)
}