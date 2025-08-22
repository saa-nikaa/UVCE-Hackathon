document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("⚠ Please login first!");
    window.location.href = "login.html";
  }

  const equipmentListDiv = document.getElementById("equipmentList");
  const myListedDiv = document.getElementById("myListedEquipment");
  const myRentedDiv = document.getElementById("myRentedEquipment");

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });

  // ================= INITIAL SAMPLE EQUIPMENT =================
  let equipment = JSON.parse(localStorage.getItem("equipment")) || [];
  if (equipment.length === 0) {
    equipment = [
      { name: "Tractor", quantity: 5, price: 800, location: "Village A", icon: "tractor.png", owner: "system" },
      { name: "Plough", quantity: 10, price: 150, location: "Village B", icon: "plough.png", owner: "system" },
      { name: "Seeder", quantity: 8, price: 200, location: "Village C", icon: "seeder.png", owner: "system" },
      { name: "Sprayer", quantity: 12, price: 90, location: "Village A", icon: "sprayer.png", owner: "system" },
      { name: "Harvester", quantity: 3, price: 1200, location: "Village D", icon: "harvester.png", owner: "system" },
      { name: "Water Pump", quantity: 15, price: 70, location: "Village B", icon: "pump.png", owner: "system" }
    ];
    localStorage.setItem("equipment", JSON.stringify(equipment));
  }

  const rentals = JSON.parse(localStorage.getItem("rentals")) || [];

  function loadEquipment() {
    // --- Browse & Rent ---
    equipmentListDiv.innerHTML = "";
    equipment.filter(e => e.owner !== user.email && e.quantity > 0)
      .forEach((equip, idx) => {
        const priceColor = equip.price < 100 ? "#b7e4c7" :
                           equip.price <= 500 ? "#ffe066" : "#ffadad";

        const card = document.createElement("div");
        card.classList.add("feature-card");
        card.innerHTML = `
          <h3>
            <img src="assets/images/${equip.icon || "default.png"}" alt="${equip.name} Icon">
            ${equip.name}
          </h3>
          <p>Quantity: ${equip.quantity}</p>
          <p>Location: ${equip.location}</p>
          <p style="background-color:${priceColor};padding:3px 6px;border-radius:6px;">
            ₹${equip.price}/day
          </p>
          <input type="number" min="1" max="${equip.quantity}" placeholder="Qty" id="rentQty${idx}">
          <button onclick="rentEquip(${idx})">Rent</button>
        `;
        equipmentListDiv.appendChild(card);
      });

    // --- My Listed Equipment ---
    myListedDiv.innerHTML = "";
    equipment.filter(e => e.owner === user.email)
      .forEach(equip => {
        const priceColor = equip.price < 100 ? "#b7e4c7" :
                           equip.price <= 500 ? "#ffe066" : "#ffadad";

        const card = document.createElement("div");
        card.classList.add("feature-card");
        card.innerHTML = `
          <h3>${equip.name}</h3>
          <p>Quantity: ${equip.quantity}</p>
          <p>Location: ${equip.location}</p>
          <p style="background-color:${priceColor};padding:3px 6px;border-radius:6px;">
            ₹${equip.price}/day
          </p>
        `;
        myListedDiv.appendChild(card);
      });

    // --- My Rented Equipment ---
    myRentedDiv.innerHTML = "";
    rentals.filter(r => r.renter === user.email)
      .forEach(rental => {
        const priceColor = rental.price < 100 ? "#b7e4c7" :
                           rental.price <= 500 ? "#ffe066" : "#ffadad";

        const card = document.createElement("div");
        card.classList.add("feature-card");
        card.innerHTML = `
          <h3>${rental.equipment}</h3>
          <p>Quantity: ${rental.quantity}</p>
          <p>Owner: ${rental.owner}</p>
          <p style="background-color:${priceColor};padding:3px 6px;border-radius:6px;">
            ₹${rental.price}/day
          </p>
          <p>Date: ${rental.date}</p>
        `;
        myRentedDiv.appendChild(card);
      });
  }

  window.rentEquip = function(idx) {
    const available = equipment.filter(e => e.owner !== user.email && e.quantity > 0);
    const equip = available[idx];
    const qtyInput = document.getElementById(rentQty${idx});
    const qty = Number(qtyInput.value);

    if (!qty || qty < 1 || qty > equip.quantity) {
      alert("⚠ Enter a valid quantity!");
      return;
    }

    equip.quantity -= qty;
    localStorage.setItem("equipment", JSON.stringify(equipment));

    rentals.push({
      equipment: equip.name,
      quantity: qty,
      price: equip.price,
      renter: user.email,
      owner: equip.owner,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("rentals", JSON.stringify(rentals));

    alert(✅ Rented ${qty} ${equip.name}(s));
    loadEquipment();
  };

  document.getElementById("addEquipBtn").addEventListener("click", () => {
    const name = document.getElementById("equipName").value.trim();
    const quantity = Number(document.getElementById("equipQuantity").value);
    const price = Number(document.getElementById("equipPrice").value);
    const location = document.getElementById("equipLocation").value.trim();
    const icon = document.getElementById("equipIcon").value.trim() || "default.png";

    if (!name || !quantity || !price || !location) {
      alert("⚠ Fill all fields!");
      return;
    }

    equipment.push({ name, quantity, price, location, icon, owner: user.email });
    localStorage.setItem("equipment", JSON.stringify(equipment));

    alert(✅ ${name} listed successfully!);

    document.getElementById("equipName").value = "";
    document.getElementById("equipQuantity").value = "";
    document.getElementById("equipPrice").value = "";
    document.getElementById("equipLocation").value = "";
    document.getElementById("equipIcon").value = "";

    loadEquipment();
  });

  loadEquipment();
});