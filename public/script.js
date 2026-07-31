const form = document.querySelector('.blog-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const contentInput = document.getElementById('content');

const errors = {
  title: 'Blog title is required (min 3 characters).',
  author: 'Author name is required.',
  content: 'Blog content is required (min 20 characters).',
};

function showError(input, message) {
  const group = input.closest('.form-group');
  let errorEl = group.querySelector('.error-message');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    group.appendChild(errorEl);
  }
  errorEl.textContent = message;
  input.classList.add('invalid');
}

function clearError(input) {
  const group = input.closest('.form-group');
  const errorEl = group.querySelector('.error-message');
  if (errorEl) errorEl.remove();
  input.classList.remove('invalid');
  input.classList.add('valid');
}

function validateField(input) {
  const val = input.value.trim();
  if (input === titleInput) {
    if (val.length < 3) { showError(input, errors.title); return false; }
  } else if (input === authorInput) {
    if (!val) { showError(input, errors.author); return false; }
  } else if (input === contentInput) {
    if (val.length < 20) { showError(input, errors.content); return false; }
  }
  clearError(input);
  return true;
}

titleInput.addEventListener('blur', () => validateField(titleInput));
authorInput.addEventListener('blur', () => validateField(authorInput));
contentInput.addEventListener('blur', () => validateField(contentInput));

titleInput.addEventListener('input', () => {
  if (titleInput.classList.contains('invalid')) validateField(titleInput);
});
authorInput.addEventListener('input', () => {
  if (authorInput.classList.contains('invalid')) validateField(authorInput);
});
contentInput.addEventListener('input', () => {
  if (contentInput.classList.contains('invalid')) validateField(contentInput);
});

async function submitBlog(blog) {
  const submitBtn = form.querySelector('.btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });

    if (!res.ok) throw new Error('Failed to submit blog');

    form.reset();
    [titleInput, authorInput, contentInput].forEach((inp) => {
      inp.classList.remove('valid');
    });

    const success = document.createElement('p');
    success.className = 'success-message';
    success.textContent = 'Blog submitted successfully!';
    form.prepend(success);
    setTimeout(() => success.remove(), 3000);
  } catch (err) {
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = 'Failed to submit blog. Please try again.';
    form.prepend(error);
    setTimeout(() => error.remove(), 3000);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const isTitleValid = validateField(titleInput);
  const isAuthorValid = validateField(authorInput);
  const isContentValid = validateField(contentInput);

  if (isTitleValid && isAuthorValid && isContentValid) {
    const blog = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      content: contentInput.value.trim(),
    };

    submitBlog(blog);
  } else {
    const firstError = form.querySelector('.invalid');
    if (firstError) firstError.focus();
  }
});
