const responseBox = document.getElementById('responseBox');
const userTokenInput = document.getElementById('userAccessToken');
const adminTokenInput = document.getElementById('adminAccessToken');
const bookModifyTokenInput = document.getElementById('bookModifyToken');

const savedUserToken = localStorage.getItem('userAccessToken') || '';
const savedAdminToken = localStorage.getItem('adminAccessToken') || '';

userTokenInput.value = savedUserToken;
adminTokenInput.value = savedAdminToken;
if (!bookModifyTokenInput.value) bookModifyTokenInput.value = savedUserToken || savedAdminToken;
const API_BASE_URL = 'https://internship-assignment-o8b3.onrender.com';
function getBaseUrl() {
  return API_BASE_URL
}

function showResponse(data, status = null) {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  responseBox.textContent = status ? `Status: ${status}\n\n${text}` : text;
}

async function apiRequest(path, method = 'GET', body = null, token = '', withCredentials = true) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: withCredentials ? 'include' : 'same-origin'
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${getBaseUrl()}${path}`, options);
    const data = await res.json().catch(() => ({ message: 'No JSON response body' }));
    showResponse(data, res.status);
    return { res, data };
  } catch (error) {
    showResponse(`Request failed: ${error.message}`);
    return null;
  }
}

function saveUserToken(token) {
  userTokenInput.value = token || '';
  localStorage.setItem('userAccessToken', token || '');
  if (!bookModifyTokenInput.value) bookModifyTokenInput.value = token || '';
}

function saveAdminToken(token) {
  adminTokenInput.value = token || '';
  localStorage.setItem('adminAccessToken', token || '');
  if (!bookModifyTokenInput.value) bookModifyTokenInput.value = token || '';
}

// User actions

document.getElementById('registerUserBtn').addEventListener('click', async () => {
  await apiRequest('/api/auth/register', 'POST', {
    fullName: document.getElementById('userFullName').value,
    email: document.getElementById('userEmail').value,
    password: document.getElementById('userPassword').value,
    gender: document.getElementById('userGender').value,
    address: document.getElementById('userAddress').value
  });
});

document.getElementById('loginUserBtn').addEventListener('click', async () => {
  const result = await apiRequest('/api/auth/login', 'POST', {
    email: document.getElementById('loginUserEmail').value,
    password: document.getElementById('loginUserPassword').value
  });
  if (result?.data?.accessToken) {
    saveUserToken(result.data.accessToken);
  }
});

document.getElementById('changeUserPasswordBtn').addEventListener('click', async () => {
  await apiRequest('/api/auth/change-password', 'POST', {
    oldPassword: document.getElementById('oldUserPassword').value,
    newPassword: document.getElementById('newUserPassword').value
  }, userTokenInput.value);
});

document.getElementById('refreshUserBtn').addEventListener('click', async () => {
  const result = await apiRequest('/api/auth/refresh', 'POST');
  if (result?.data?.newAccessToken) {
    saveUserToken(result.data.newAccessToken);
  }
});

document.getElementById('logoutUserBtn').addEventListener('click', async () => {
  await apiRequest('/api/auth/logout', 'POST');
});

// Admin actions

document.getElementById('registerAdminBtn').addEventListener('click', async () => {
  await apiRequest('/api/admin/register', 'POST', {
    email: document.getElementById('adminEmail').value,
    password: document.getElementById('adminPassword').value
  });
});

document.getElementById('loginAdminBtn').addEventListener('click', async () => {
  const result = await apiRequest('/api/admin/login', 'POST', {
    email: document.getElementById('loginAdminEmail').value,
    password: document.getElementById('loginAdminPassword').value
  });
  if (result?.data?.accessToken) {
    saveAdminToken(result.data.accessToken);
  }
});

document.getElementById('changeAdminPasswordBtn').addEventListener('click', async () => {
  await apiRequest('/api/admin/change-password', 'POST', {
    oldPassword: document.getElementById('oldAdminPassword').value,
    newPassword: document.getElementById('newAdminPassword').value
  }, adminTokenInput.value);
});

document.getElementById('refreshAdminBtn').addEventListener('click', async () => {
  const result = await apiRequest('/api/admin/refresh', 'POST');
  if (result?.data?.accessToken) {
    saveAdminToken(result.data.accessToken);
  }
});

document.getElementById('logoutAdminBtn').addEventListener('click', async () => {
  await apiRequest('/api/admin/logout', 'POST');
});

// Book actions

document.getElementById('createBookBtn').addEventListener('click', async () => {
  const publishedDate = document.getElementById('bookPublishedDate').value;
  await apiRequest('/api/books/add', 'POST', {
    title: document.getElementById('bookTitle').value,
    description: document.getElementById('bookDescription').value,
    price: Number(document.getElementById('bookPrice').value),
    publishedDate: publishedDate || undefined
  }, userTokenInput.value);
});

document.getElementById('getBooksBtn').addEventListener('click', async () => {
  await apiRequest('/api/books', 'GET');
});

document.getElementById('getBookByCodeBtn').addEventListener('click', async () => {
  const code = document.getElementById('bookCodeGet').value;
  await apiRequest(`/api/books/${encodeURIComponent(code)}`, 'GET');
});

document.getElementById('updateBookBtn').addEventListener('click', async () => {
  const code = document.getElementById('bookCodeUpdate').value;
  await apiRequest(`/api/books/${encodeURIComponent(code)}`, 'PUT', {
    price: Number(document.getElementById('bookPriceUpdate').value)
  }, bookModifyTokenInput.value);
});

document.getElementById('deleteBookBtn').addEventListener('click', async () => {
  const code = document.getElementById('bookCodeUpdate').value;
  await apiRequest(`/api/books/${encodeURIComponent(code)}`, 'DELETE', null, bookModifyTokenInput.value);
});

// Admin reports

document.getElementById('getAuthorsBtn').addEventListener('click', async () => {
  await apiRequest('/api/admin/authors', 'GET', null, adminTokenInput.value);
});

document.getElementById('getAuthorBooksBtn').addEventListener('click', async () => {
  const authorId = document.getElementById('authorId').value;
  await apiRequest(`/api/admin/author-books/${encodeURIComponent(authorId)}`, 'GET', null, adminTokenInput.value);
});