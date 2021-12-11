const newFormHandler = async (event) => {
  event.preventDefault();

  urlArray = window.location.pathname.split('/');
  postID = urlArray[urlArray.length - 1];

  console.log(postID)

  const content = document.querySelector('#comment-content').value.trim();

  console.log("button clicked: ", content)

  if (content) {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ 
        content: content,
        post_id: postID,
       }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.reload();

    } else {
      alert('Failed to update information');
    }
  }
};


document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newFormHandler);

