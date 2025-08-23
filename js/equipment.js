document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("⚠ Please login first!");
    window.location.href = "login.html";
    return;
  }

  const equipmentListDiv = document.getElementById("equipmentList");
  const myListedDiv = document.getElementById("myListedEquipment");
  const myRentedDiv = document.getElementById("myRentedEquipment");

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });

  let equipment = JSON.parse(localStorage.getItem("equipment")) || [];
  if (equipment.length === 0) {
    equipment = [
      { name: "Tractor", quantity: 5, price: 100, location: "Village A", icon: "tractor.png", owner: "system" },
      { name: "Plough", quantity: 10, price: 50, location: "Village B", icon: "plough.png", owner: "system" }
    ];
    localStorage.setItem("equipment", JSON.stringify(equipment));
  }

  const rentals = JSON.parse(localStorage.getItem("rentals")) || [];

  function loadEquipment() {
    // Browse & Rent
    equipmentListDiv.innerHTML = "";
    equipment.filter(e => e.owner !== user.email && e.quantity > 0)
      .forEach((equip, idx) => {
        const priceColor = equip.price < 50 ? "#b7e4c7" : equip.price <= 100 ? "#ffe066" : "#ffadad";
        const card = document.createElement("div");
        card.classList.add("feature-card");
        card.innerHTML = `
          <h3><img src="assets/images/${equip.icon}" alt="${equip.name}" style="width:24px;"> ${equip.name}</h3>
          <p>Quantity: ${equip.quantity}</p>
          <p>Location: ${equip.location}</p>
          <p style="background-color:${priceColor};padding:3px 6px;border-radius:6px;">₹${equip.price}/hour</p>
          <input type="number" min="1" max="${equip.quantity}" placeholder="Qty" id="rentQty${idx}">
          <input type="number" min="1" placeholder="Hours" id="rentHours${idx}">
          <p>Total: ₹<span id="totalCost${idx}">0</span></p>
          <button onclick="rentEquip(${idx})">Rent</button>
        `;
        equipmentListDiv.appendChild(card);

        // Calculate total dynamically
        const qtyInput = document.getElementById(`rentQty${idx}`);
        const hoursInput = document.getElementById(`rentHours${idx}`);
        const totalEl = document.getElementById(`totalCost${idx}`);
        const updateTotal = () => {
          const qty = Number(qtyInput.value) || 0;
          const hours = Number(hoursInput.value) || 0;
          totalEl.textContent = qty * hours * equip.price;
        };
        qtyInput.addEventListener("input", updateTotal);
        hoursInput.addEventListener("input", updateTotal);
      });

    // My Listed Equipment
    myListedDiv.innerHTML = "";
    equipment.filter(e => e.owner === user.email).forEach(equip => {
      const priceColor = equip.price < 50 ? "#b7e4c7" : equip.price <= 100 ? "#ffe066" : "#ffadad";
      const card = document.createElement("div");
      card.classList.add("feature-card");
      card.innerHTML = `
        <h3>${equip.name}</h3>
        <p>Quantity: ${equip.quantity}</p>
        <p>Location: ${equip.location}</p>
        <p style="background-color:${priceColor};padding:3px 6px;border-radius:6px;">₹${equip.price}/hour</p>
      `;
      myListedDiv.appendChild(card);
    });

    // My Rented Equipment
    myRentedDiv.innerHTML = "";
    rentals.filter(r => r.renter === user.email).forEach((rental, idx) => {
      const priceColor = rental.price < 50 ? "#b7e4c7" : rental.price <= 100 ? "#ffe066" : "#ffadad";
      const now = new Date();
      const end = new Date(rental.endTime);
      let remainingHours = Math.max(0, Math.ceil((end - now) / 3600000));

      const card = document.createElement("div");
      card.classList.add("feature-card");
      card.innerHTML = `
        <h3>${rental.equipment}</h3>
        <p>Quantity: ${rental.quantity}</p>
        <p>Owner: ${rental.owner}</p>
        <p style="background-color:${priceColor};padding:3px 6px;border-radius:6px;">₹${rental.price}/hour</p>
        <p>Time left: <span id="timeLeft${idx}">${remainingHours} hour(s)</span></p>
        <p>Status: ${rental.paid ? "Paid ✅" : "Pending 💰"}</p>
      `;
      if (!rental.paid) {
        const payBtn = document.createElement("button");
        payBtn.textContent = "Pay Now";
        payBtn.classList.add("btn-pay");
        payBtn.addEventListener("click", () => makePayment(idx));
        card.appendChild(payBtn);
      }
      myRentedDiv.appendChild(card);

      // Notification for 1 hour left
      if (remainingHours <= 1 && remainingHours > 0 && !rental.notified) {
        alert(`⏰ Your rental for ${rental.equipment} is about to end!`);
        rental.notified = true;
        localStorage.setItem("rentals", JSON.stringify(rentals));
      }

      // Timer update
      setInterval(() => {
        const now = new Date();
        const end = new Date(rental.endTime);
        remainingHours = Math.max(0, Math.ceil((end - now) / 3600000));
        const timeEl = document.getElementById(`timeLeft${idx}`);
        if (timeEl) timeEl.textContent = `${remainingHours} hour(s)`;
      }, 60000);
    });
  }

  // Rent Equipment
  window.rentEquip = function(idx) {
    const available = equipment.filter(e => e.owner !== user.email && e.quantity > 0);
    const equip = available[idx];
    const qty = Number(document.getElementById(`rentQty${idx}`).value);
    const hours = Number(document.getElementById(`rentHours${idx}`).value);

    if (!qty || qty < 1 || qty > equip.quantity) { alert("⚠ Enter valid quantity!"); return; }
    if (!hours || hours < 1) { alert("⚠ Enter valid hours!"); return; }

    equip.quantity -= qty;
    localStorage.setItem("equipment", JSON.stringify(equipment));

    rentals.push({
      equipment: equip.name,
      quantity: qty,
      price: equip.price,
      renter: user.email,
      owner: equip.owner,
      date: new Date().toLocaleString(),
      hours,
      endTime: new Date(new Date().getTime() + hours * 3600000),
      paid: false,
      notified: false
    });
    localStorage.setItem("rentals", JSON.stringify(rentals));

    alert(`✅ Rented ${qty} ${equip.name}(s) for ${hours} hour(s). Total: ₹${qty*hours*equip.price}`);
    loadEquipment();
  };

  
  // Add Equipment
  document.getElementById("addEquipBtn").addEventListener("click", () => {
    const name = document.getElementById("equipName").value.trim();
    const quantity = Number(document.getElementById("equipQuantity").value);
    const price = Number(document.getElementById("equipPrice").value);
    const location = document.getElementById("equipLocation").value.trim();
    const icon = document.getElementById("equipIcon").value.trim() || "default.png";

    if (!name || !quantity || !price || !location) { alert("⚠ Fill all fields!"); return; }

    equipment.push({ name, quantity, price, location, icon, owner: user.email });
    localStorage.setItem("equipment", JSON.stringify(equipment));

    alert(`✅ ${name} listed successfully!`);
    document.getElementById("equipName").value = "";
    document.getElementById("equipQuantity").value = "";
    document.getElementById("equipPrice").value = "";
    document.getElementById("equipLocation").value = "";
    document.getElementById("equipIcon").value = "";

    loadEquipment();
  });

  loadEquipment();
});

async function makePayment(idx) {
  console.log("🟢 makePayment called with index:", idx);

  const rental = rentals[idx];
  if (!rental) {
    console.error("❌ No rental found at index", idx);
    alert("No rental found!");
    return;
  }

  if (rental.paid) {
    alert("✅ Already paid!");
    return;
  }

  // ✅ Send amount in paise
  const amount = rental.quantity * rental.hours * rental.price * 100;
  console.log("💰 Calculated amount (paise):", amount);

  try {
    // 1️⃣ Create order
    console.log("📡 Sending order request...");
    const orderRes = await fetch("http://localhost:5000/api/payments/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    console.log("📡 Order response status:", orderRes.status);

    const resText = await orderRes.text();
    console.log("📡 Order raw response:", resText);

    let parsed;
    try {
      parsed = JSON.parse(resText);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      alert("Server returned invalid JSON.");
      return;
    }

    const { orderId, key, success, message } = parsed;
    if (!success) {
      console.error("❌ Order creation failed:", message);
      alert("❌ Order creation failed: " + (message || "Unknown error"));
      return;
    }

    console.log("✅ Order created:", orderId);

    // 2️⃣ Open Razorpay popup
    const options = {
      key,
      amount,
      currency: "INR",
      name: "AgriConnect",
      description: `Payment for ${rental.equipment}`,
      order_id: orderId,
      handler: async function (response) {
        console.log("🟢 Razorpay handler triggered:", response);

        try {
          const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          console.log("🔍 Verification response:", verifyData);

          if (verifyData.success) {
            rental.paid = true;
            localStorage.setItem("rentals", JSON.stringify(rentals));
            alert(`💰 Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            loadEquipment();
          } else {
            alert("❌ Payment verification failed: " + (verifyData.message || "Invalid signature"));
          }
        } catch (err) {
          console.error("❌ Verification error:", err);
          alert("⚠ Payment verification failed.");
        }
      },
      prefill: { name: user.name, email: user.email },
    };

    console.log("🟢 Opening Razorpay popup...");
    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("❌ Payment error:", err);
    alert("⚠ Payment process failed. See console.");
  }
}
