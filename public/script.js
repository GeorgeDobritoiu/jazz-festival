document.addEventListener('DOMContentLoaded', function () {
  // Form submission handler
  document.getElementById('contactForm').addEventListener('submit', function (event) {
    // Get form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      event.preventDefault(); // Prevent form from submitting
      return;
    }

    // Email validation regex
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      event.preventDefault(); // Prevent form from submitting
      return;
    }
  });
});
