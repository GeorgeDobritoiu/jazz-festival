document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission

      // Get form values
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var message = document.getElementById('message').value;

      // Basic validation
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      // Email validation regex
      var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Form submission logic here
      console.log('Form submitted');

      // Example of sending form data to the server using Fetch API
      fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, message: message })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Message sent successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was an error sending your message.');
      });
    });
  }

  // Fetch the menu HTML and insert it into the main-menu div
  fetch('menu.html')
    .then(response => response.text())
    .then(data => {
      const menu = document.getElementById('main-menu');
      if (menu) {
        menu.innerHTML = data;
      }
    })
    .catch((error) => {
      console.error('Error fetching menu:', error);
    });
});
