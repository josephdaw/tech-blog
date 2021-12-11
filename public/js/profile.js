const newFormHandler = async (event) => {
  event.preventDefault();

  const firstName = document.querySelector('#user-first-name').value.trim();
  const lastName = document.querySelector('#user-last-name').value.trim();
  const email = document.querySelector('#user-email').value.trim();
  // const password = document.querySelector('#user-password').value.trim();

  console.log("button clicked: ", firstName)
  if (firstName && lastName && email) {
    const response = await fetch(`/api/users`, {
      method: 'PUT',
      body: JSON.stringify({ firstName, lastName, email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to update information');
    }
  }
};


document
  .querySelector('.user-update-form')
  .addEventListener('submit', newFormHandler);

