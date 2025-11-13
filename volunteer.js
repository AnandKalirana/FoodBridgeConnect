// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrE-p5kEfnf3GXOmpjSXHnH4pNAtenpd0",
  authDomain: "donation-app-b24f4.firebaseapp.com",
  projectId: "donation-app-b24f4",
  storageBucket: "donation-app-b24f4.firebasestorage.app",
  messagingSenderId: "1020224359699",
  appId: "1:1020224359699:web:3221d5845aeada5fbadee6"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Firebase references
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location = "index.html"; 
  } else {
    loadPendingDonations();
    loadAcceptedDonations();
  }
});

// ✅ Load Pending Donations
function loadPendingDonations() {
  const list = document.getElementById("donationList");

  if (!list) {
    console.error("donationList element not found");
    return;
  }

  db.collection("donations")
    .where("status", "==", "Pending")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p>No pending donations</p>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();

        const div = document.createElement("div");
        div.className = "donation-item";
        div.innerHTML = `
          <p><b>Item:</b> ${data.item}</p>
          <p><b>Quantity:</b> ${data.quantity}</p>
          <p><b>Pickup Address:</b> ${data.address}</p>
          <button class="accept-btn" onclick="acceptDonation('${doc.id}')">Accept Pickup</button>
        `;

        list.appendChild(div);
      });
    }, err => {
      console.error("Error fetching pending donations:", err);
    });
}

// ✅ Accept Donation
function acceptDonation(id) {
  const user = auth.currentUser;
  
  if (!user) {
    alert("Login required");
    return;
  }

  db.collection("donations").doc(id).update({
    status: "Accepted",
    volunteerId: user.uid,
    acceptedAt: new Date()
  })
  .then(() => {
    alert("Pickup Accepted!");
  })
  .catch(err => {
    alert("Error accepting donation: " + err.message);
  });
}

// ✅ Load Accepted Donations
function loadAcceptedDonations() {
  const acceptedList = document.getElementById("acceptedList");
  const user = auth.currentUser;

  if (!acceptedList || !user) {
    console.error("acceptedList element or user missing");
    return;
  }

  db.collection("donations")
    .where("status", "==", "Accepted")
    .where("volunteerId", "==", user.uid)
    .onSnapshot(snapshot => {
      acceptedList.innerHTML = "";

      if (snapshot.empty) {
        acceptedList.innerHTML = "<p>No accepted donations</p>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "donation-item";
        div.innerHTML = `
          <p><b>Item:</b> ${data.item}</p>
          <p><b>Quantity:</b> ${data.quantity}</p>
          <p><b>Address:</b> ${data.address}</p>
          <button class="accept-btn" onclick="markPickedUp('${doc.id}')">Mark as Picked Up</button>
        `;
        acceptedList.appendChild(div);
      });
    }, err => {
      console.error("Error fetching accepted donations:", err);
    });
}

function markPickedUp(id) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  db.collection("donations").doc(id).update({
    status: "PickedUp",
    pickedUpAt: new Date(),
    volunteerId: user.uid  // 🔐 Required for Firestore rule match
  })
  .then(() => {
    alert("Marked as Picked Up!");
  })
  .catch(err => alert("Error updating pickup status: " + err.message));
}


// ✅ Logout
function logout() {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
}
