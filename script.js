// THEME TOGGLE
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("vaultTheme", document.body.classList.contains("dark") ? "dark" : "light");
}

// ON LOAD
window.onload = function () {
  const theme = localStorage.getItem("vaultTheme");
  if (theme === "dark") document.body.classList.add("dark");

  const savedPin = localStorage.getItem("vaultPIN");
  if (!savedPin) {
    document.getElementById("pinScreen").style.display = "none";
    document.getElementById("setPinScreen").style.display = "flex";
  }
};

// SET NEW PIN
function setNewPin() {
  const pin = document.getElementById("newPinInput").value;
  if (/^\d{4}$/.test(pin)) {
    localStorage.setItem("vaultPIN", pin);
    alert("PIN set successfully!");
    location.reload();
  } else {
    alert("Please enter a valid 4-digit PIN.");
  }
}

// UNLOCK VAULT
function unlockApp() {
  const entered = document.getElementById("pinInput").value;
  if (entered === localStorage.getItem("vaultPIN")) {
    document.getElementById("pinScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    loadApp();
  } else {
    alert("Incorrect PIN.");
  }
}

// SCROLL TO SECTIONS
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// PROFILE DATA
const profileForm = document.getElementById("profileForm");
const profileDisplay = document.getElementById("profileDisplay");
let profile = JSON.parse(localStorage.getItem("userProfile")) || {};

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  profile = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    dob: document.getElementById("dob").value,
    aadhar: document.getElementById("aadhar").value,
    pan: document.getElementById("pan").value,
  };
  localStorage.setItem("userProfile", JSON.stringify(profile));
  displayProfile();
});

function displayProfile() {
  profileDisplay.innerHTML = `
    <p><strong>Name:</strong> ${profile.name}</p>
    <p><strong>Email:</strong> ${profile.email}</p>
    <p><strong>DOB:</strong> ${profile.dob}</p>
    <p><strong>Aadhar:</strong> ${profile.aadhar}</p>
    <p><strong>PAN:</strong> ${profile.pan}</p>
  `;
}

// NOTES
let notes = JSON.parse(localStorage.getItem("notesApp")) || [];

document.getElementById("noteForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  notes.push({ title, content });
  localStorage.setItem("notesApp", JSON.stringify(notes));
  renderNotes();
  this.reset();
});

function renderNotes() {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";
  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button onclick="deleteNote(${index})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notesApp", JSON.stringify(notes));
  renderNotes();
}

// PROFILE PICTURE
const profilePicInput = document.getElementById("profilePic");
const profilePreview = document.getElementById("profilePreview");

profilePicInput.addEventListener("change", () => {
  const file = profilePicInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePreview.src = reader.result;
      localStorage.setItem("vaultProfilePic", reader.result);
    };
    reader.readAsDataURL(file);
  }
});

function loadProfileImage() {
  const img = localStorage.getItem("vaultProfilePic");
  if (img) profilePreview.src = img;
}

// LOAD ALL
function loadApp() {
  displayProfile();
  renderNotes();
  loadProfileImage();
}

// CHANGE PIN
function changePIN() {
  const oldPin = prompt("Enter current PIN:");
  if (oldPin === localStorage.getItem("vaultPIN")) {
    const newPin = prompt("Enter new 4-digit PIN:");
    if (/^\d{4}$/.test(newPin)) {
      localStorage.setItem("vaultPIN", newPin);
      alert("PIN updated.");
    } else {
      alert("Invalid format.");
    }
  } else {
    alert("Incorrect current PIN.");
  }
}

// EXPORT / IMPORT
function exportVault() {
  const data = {
    pin: localStorage.getItem("vaultPIN"),
    profile,
    notes,
    pic: localStorage.getItem("vaultProfilePic"),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vault_backup.json";
  a.click();
}

function importVault() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return alert("Choose a file first!");
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem("vaultPIN", data.pin);
      localStorage.setItem("userProfile", JSON.stringify(data.profile));
      localStorage.setItem("notesApp", JSON.stringify(data.notes));
      localStorage.setItem("vaultProfilePic", data.pic);
      alert("Vault imported successfully.");
      location.reload();
    } catch (e) {
      alert("Invalid file.");
    }
  };
  reader.readAsText(file);
}
