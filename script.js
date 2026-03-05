// ===== SELECTORS =====
const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.getElementById('cart-count');
const checkoutWhatsapp = document.getElementById('checkout-whatsapp');

let cart = [];

// ===== SHOW/HIDE CART =====
cartIcon.addEventListener('click', () => {
  cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
});

// ===== QUANTITY BUTTONS IN MENU =====
document.querySelectorAll('.menu-card').forEach(card => {
  const minusBtn = card.querySelector('.minus');
  const plusBtn = card.querySelector('.plus');
  const qtySpan = card.querySelector('.qty');

  if(minusBtn && plusBtn && qtySpan){
    minusBtn.addEventListener('click', () => {
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) qtySpan.textContent = qty - 1;
    });

    plusBtn.addEventListener('click', () => {
      let qty = parseInt(qtySpan.textContent);
      qtySpan.textContent = qty + 1;
    });
  }
});

// ===== ADD TO CART =====
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.menu-card');
    const name = card.querySelector('h4').textContent;
    const priceOption = card.querySelector('select').value;
    const qty = parseInt(card.querySelector('.qty').textContent);

    const priceMatch = priceOption.match(/Rs (\d+)/);
    const price = priceMatch ? parseInt(priceMatch[1]) : 0;

    const existing = cart.find(item => item.name === name && item.option === priceOption);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, option: priceOption, qty, price });
    }

    updateCart();
  });
});

// ===== UPDATE CART =====
function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <span>${item.name} (${item.option}) x ${item.qty}</span>
      <span>
        Rs ${itemTotal} 
        <button class="remove-btn" data-index="${index}">Remove</button>
      </span>
    `;
    cartItemsContainer.appendChild(div);
  });

  // Cart count
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);

  // Total
  const totalDiv = document.createElement('div');
  totalDiv.classList.add('cart-total');
  totalDiv.textContent = `Total: Rs ${total}`;
  cartItemsContainer.appendChild(totalDiv);

  // Remove button functionality
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      cart.splice(idx, 1); // remove item
      updateCart();
    });
  });
}

// ===== CHECKOUT VIA WHATSAPP =====
checkoutWhatsapp.addEventListener('click', () => {
  if(cart.length === 0){
    alert('Your cart is empty!');
    return;
  }
  let message = 'Hello! I want to order the following items:\n\n';
  cart.forEach(item => {
    message += `${item.name} (${item.option}) x ${item.qty} = Rs ${item.price*item.qty}\n`;
  });
  const total = cart.reduce((sum,i) => sum + i.price*i.qty,0);
  message += `\nTotal: Rs ${total}`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/923362179016?text=${encoded}`, '_blank'); // Replace with your number
});

// ===== POLICIES COLLAPSIBLE =====
document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.querySelector('.policies-toggle');
  const content = document.querySelector('.policies-content');

  if(toggleBtn && content) {
    toggleBtn.addEventListener('click', () => {
      if(content.style.maxHeight && content.style.maxHeight !== "0px") {
        // Collapse
        content.style.maxHeight = "0";
        toggleBtn.textContent = "Policies +";
      } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + "px";
        toggleBtn.textContent = "Policies -";
      }
    });
  }
});
