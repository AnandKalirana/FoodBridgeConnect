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

// ✅ Check if admin is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location = "index.html";
  } else {
    loadStats();
    loadDonations();
  }
});

// ✅ Load donation stats
function loadStats() {
  db.collection("donations").onSnapshot(snapshot => {
    let total = 0;
    let pending = 0;
    let accepted = 0;
    let pickedUp = 0;

    snapshot.forEach(doc => {
      total++;
      const status = doc.data().status;
      if (status === "Pending") pending++;
      else if (status === "Accepted") accepted++;
      else if (status === "PickedUp") pickedUp++;
    });

    document.getElementById("totalDonations").innerText = `Donations: ${total}`;
    document.getElementById("pendingCount").innerText = `Pending: ${pending}`;
    document.getElementById("acceptedCount").innerText = `Accepted: ${accepted}`;
    document.getElementById("pickedUpCount").innerText = `Picked Up: ${pickedUp}`;
  });
}

// ✅ Load donation table
function loadDonations() {
  const table = document.getElementById("donationTable");

  db.collection("donations").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    table.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.item}</td>
        <td>${data.quantity}</td>
        <td>${data.address}</td>
        <td>${data.status}</td>
        <td>${data.donorId || "-"}</td>
        <td>${data.volunteerId || "-"}</td>
        <td>${data.timestamp?.toDate().toLocaleString() || "-"}</td>
      `;

      table.appendChild(row);
    });
  });
}

// ✅ Logout
function logout() {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
}
