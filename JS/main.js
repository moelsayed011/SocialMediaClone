let postsCard = document.querySelector("#posts");
let loginBTN = document.querySelector("#loginBTN");
let registerBtn = document.querySelector("#registerBtn");
let logooutBtn = document.querySelector("#logooutBtn");
let loginUserName = document.querySelector("#login-user-name");
let loginPassword = document.querySelector("#login-Password");

let registerName = document.querySelector("#register-name");
let registerUserName = document.querySelector("#register-user-name");
let registerPassword = document.querySelector("#register-Password");
let registerImage = document.querySelector("#register-image");

let LoginModalExample = document.querySelector("#exampleModal");
let registerModalExample = document.querySelector("#registerModal");
let CreatePostModal = document.querySelector("#CreatePostModal");

let addpost = document.querySelector(".addpost");

let titleInput = document.querySelector("#title-input");
let bodyInput = document.querySelector("#body-input");
let imageInput = document.querySelector("#image-input");
let dataUser = document.querySelector("#data-user");
let navUserName = document.querySelector("#nav-username");
let navimge = document.querySelector("#nav-imge");
let dataOfComment = document.querySelector("#dataOfComment");

// let commentdata = document.querySelector("#comment-data").value;

let posts = [];

// for get post from database
const baseurl = "https://tarmeezacademy.com/api/v1";
function getPosts() {
  axios
    .get(`${baseurl}/posts`)
    .then(function (response) {
      posts = response.data.data;
      display();
    })
    .catch((error) => {
      console.log(error);
    });
}

getPosts();
//Function for display posts from database
function display() {
  let box = "";
  posts.innerHTML = "";
  for (let i = 0; i < posts.length; i++) {
    let user = getCurantUser();
    let myPost = user != null && posts[i].author.id == user.id;
    let edibtn = "";

    if (myPost) {
      edibtn = `
  <button class="btn btn-danger" style="float: right; margin-left: 5px;"  onclick="deletPostClick('${encodeURIComponent(
    JSON.stringify(posts[i])
  )}')">Delete</button>
  <button class="btn btn-secondary" style="float: right;"  onclick="editPostClick('${encodeURIComponent(
    JSON.stringify(posts[i])
  )}')">edit</button>
  `;
    }
    box += `
    <div class="card  mt-4 mb-4">
      <div class="card-header">
        <span onclick="userProfileClicked(${posts[i].author.id})" id="spanProfile">
          <img src="${posts[i].author.profile_image}" alt="Profile picture" class="rounded-circle profiimgee">
          <span class="px-2 fw-medium ">@${posts[i].author.username}</span>
        </span>
          ${edibtn}
          </div>
      <div class="card-body" onclick="postUserInformation(${posts[i].id})">
          <img src="${posts[i].image}" alt="" class=" w-100 rounded-3">
          <h5 class="px-2 pt-2 text-muted">${posts[i].created_at}</h5>
          <h2 class="px-2 ">${posts[i].title}</h2>
          <p class="px-2">${posts[i].body}</p>
          <hr>
          <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-chat-left-text" viewBox="0 0 16 16">
                  <path
                      d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path
                      d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span class="px-2">(${posts[i].comments_count}) Comment</span>
          </div>
      </div>
  </div>
    `;
  }
  postsCard.innerHTML = box;
}

//login for User
function loginClicked() {
  let param = {
    username: loginUserName.value,
    password: loginPassword.value,
  };
  axios.post(`${baseurl}/login`, param).then((response) => {
    let token = response.data.token;
    let user = response.data.user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    let modalInstance = bootstrap.Modal.getInstance(LoginModalExample);
    modalInstance.hide();
    showAlart("Login Is Successfully", "success");
    newNav();
  });
}

//register for new User
function registerClicked() {
  let formData = new FormData();

  formData.append("username", registerUserName.value);
  formData.append("name", registerName.value);
  formData.append("password", registerPassword.value);
  formData.append("image", registerImage.files[0]);

  axios
    .post(`${baseurl}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      let token = response.data.token;
      let user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      let modalInstance = bootstrap.Modal.getInstance(registerModalExample);
      modalInstance.hide();
      showAlart("Registeration Is Successfully", "success");
      newNav();
    })
    .catch(function (error) {
      let registerError = error.response.data.message;
      showAlart(registerError, "danger");
    });
}

// alert for user
function showAlart(messge, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  appendAlert(messge, type);
}

// New UI When User Login Or Logout
function newNav() {
  let token = localStorage.getItem("token");
  if (token == null) {
    if (addpost != null) {
      addpost.style.display = "none";
    }
    loginBTN.style.display = "block";
    registerBtn.style.display = "block";
    logooutBtn.style.display = "none";
    dataUser.style.setProperty("display", "none", "important");
  } else {
    if (addpost != null) {
      addpost.style.display = "block";
    }
    loginBTN.style.display = "none";
    registerBtn.style.display = "none";
    logooutBtn.style.display = "block";
    dataUser.style.display = "flex";

    let user = getCurantUser();
    navUserName.innerHTML = user.username;
    navimge.src = user.profile_image;
  }
}
newNav();

// Function For User When Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlart("Logout Is Successfully", "success");
  newNav();
}

// function for Create A New Post by user

function createPostClicked() {
  //postId for get id for user
  let postId = iseditpostinputid.value;
  let isCreate = postId == null || postId == "";

  let token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("body", bodyInput.value);
  formData.append("image", imageInput.files[0]);
  let url = "";
  if (isCreate) {
    url = `${baseurl}/posts`;

    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let modalInstance = bootstrap.Modal.getInstance(CreatePostModal);
        modalInstance.hide();
        showAlart("Create New Post Successfully", "success");
        getPosts();
      });
  } else {
    formData.append("_method", "put");
    url = `${baseurl}/posts/${postId}`;
    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let modalInstance = bootstrap.Modal.getInstance(CreatePostModal);
        modalInstance.hide();
        showAlart("Edit Is Successfully", "success");
        getPosts();
      });
  }
}

// Post Detailes for each post Script

// function get curant user by Local Storage
function getCurantUser() {
  let user = null;
  let userStorge = localStorage.getItem("user");
  if (userStorge != null) {
    user = JSON.parse(userStorge);
  }
  return user;
}

function postUserInformation(postId) {
  window.location = `../postDetailes.html?postId=${postId}`;
  // p()
}

// this ==> URLSearchParams <== for get User ID
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("postId");
let userNameInform = document.querySelector("#userNameInform");
let userInformation = document.querySelector("#userInformation");

function getpost() {
  axios
    .get(`${baseurl}/posts/${id}`)
    .then(function (response) {
      console.log(response);
      let post = response.data.data;
      let comments = post.comments;
      userNameInform.innerHTML = post.author.username;

      let commentsUsers = ``;

      for (let comment of comments) {
        commentsUsers += `
  
    <div class="card-commant pt-3 bg-secondary-subtle   ">
                            <div class="ps-3">
                                <img src="${comment.author.profile_image}" alt="" class="commantImage rounded-circle">
                                <span>@${comment.author.username}</span>
                            </div>
                            <div class="card-commant-body ps-3 pt-2">
                                <p>${comment.body}</p>
                            </div>
                        </div>
                        <hr>
  `;
      }

      let userinformcard = `
    <div id="userInformation">
                    <div class="card  mt-4 mb-4">
                        <div class="card-header">
                            <img src="${post.author.profile_image}" alt="Profile picture" class="rounded-circle profiimgee">
                            <span class="px-2 fw-medium ">@${post.author.username}</span>
                        </div>
                        <div class="card-body">
                            <img src="${post.image}" alt="" class="w-100 rounded-3">
                            <h5 class="px-2 pt-2 text-muted">${post.created_at}</h5>
                            <h2 class="px-2 ">${post.title}</h2>
                            <p class="px-2">${post.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-chat-left-text" viewBox="0 0 16 16">
                                    <path
                                        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                    <path
                                        d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                </svg>
                                <span class="px-2">(${post.comments_count})Comment</span>
                            </div>
                        </div>
                        <div class="card-commant pt-3 bg-secondary-subtle   ">
                            ${commentsUsers}
                        </div>
                        <div class="add-comment input-group" id="dataOfComment">
                              <input type="text" placeholder="Add your comment here..." class="form-control p-3 mb-3" id="comment-data">
                              <button class="btn btn-primary p-3 mb-3" onclick="addCommentClick()">Add</button>
                        </div>
                    </div>
                </div>
    
    `;
      userInformation.innerHTML = userinformcard;
    })
    .catch((error) => {});
}
getpost();

// function for Add Comments On Posts

function addCommentClick() {
  let commentdata = document.querySelector("#comment-data").value;
  let param = {
    body: commentdata,
  };
  let token = localStorage.getItem("token");
  let url = `${baseurl}/posts/${id}/comments`;

  axios
    .post(url, param, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      getpost();
      showAlart("Create New Comment Successfully", "success");
    })
    .catch((error) => {
      let errormesg = error.response.data.message;
      showAlart(errormesg, "danger");
    });
}

let postmodaltitle = document.querySelector("#post-modal-title");
let iseditpostinputid = document.querySelector("#is-edit-post-input-id");
let btnSubmit = document.querySelector("#btn-submit");

//title

// function for edit post by user
function editPostClick(post) {
  let postObj = JSON.parse(decodeURIComponent(post));
  iseditpostinputid.value = postObj.id;
  btnSubmit.innerHTML = "Updata";
  postmodaltitle.innerHTML = "Edit Post";
  titleInput.value = postObj.title;
  bodyInput.value = postObj.body;
  let postModal = new bootstrap.Modal(CreatePostModal);
  postModal.toggle();
}

let deleteid = document.querySelector("#delete-id");
let deletePostModal = document.querySelector("#deletePostModal");

// function for delete post by user
function deletPostClick(post) {
  let postObj = JSON.parse(decodeURIComponent(post));
  deleteid.value = postObj.id;
  let postModal = new bootstrap.Modal(deletePostModal);
  postModal.toggle();
}

function confirmDelete() {
  let postId = deleteid.value;
  let token = localStorage.getItem("token");

  axios
    .delete(`${baseurl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      let modalInstance = bootstrap.Modal.getInstance(deletePostModal);
      modalInstance.hide();
      showAlart("Delete Is Successfully", "success");
      getPosts();
    });
}

function addBtnClick() {
  iseditpostinputid.value = "";
  btnSubmit.innerHTML = "Create";
  postmodaltitle.innerHTML = "Create A New Post";
  titleInput.value = "";
  bodyInput.value = "";
  let postModal = new bootstrap.Modal(CreatePostModal);
  postModal.toggle();
}

// Profile Script
let nameProfile = document.querySelector("#nameProfile");
let userNameProfile = document.querySelector("#userNameProfile");
let countPosts = document.querySelector("#countPosts");
let CountComments = document.querySelector("#CountComments");
let imageProfile = document.querySelector("#imageProfile");
let authorPosts = document.querySelector("#authorPosts");

// functin for get curentUserProfileId

function curentUserProfileId() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("userid");
  return id;
}

function getUser() {
  let id = curentUserProfileId();
  axios
    .get(`${baseurl}/users/${id}`)
    .then(function (response) {
      let userDataProfile = response.data.data;
      nameProfile.innerHTML = userDataProfile.name;
      userNameProfile.innerHTML = userDataProfile.username;
      countPosts.innerHTML = userDataProfile.posts_count;
      CountComments.innerHTML = userDataProfile.comments_count;
      imageProfile.src = userDataProfile.profile_image;
      authorPosts.innerHTML = `${userDataProfile.username}'s Posts`;
    })
    .catch((error) => {
      console.log(error);
    });
}
getUser();

function getPostsProfile() {
  let id = curentUserProfileId();
  axios
    .get(`${baseurl}/users/${id}/posts`)
    .then(function (response) {
      posts = response.data.data;
      console.log(posts);
      displayPostsProfile();
    })
    .catch((error) => {
      console.log(error);
    });
}
getPostsProfile();

let profilePosts = document.querySelector("#profilePosts");

function displayPostsProfile() {
  let box = "";
  posts.innerHTML = "";
  for (let i = 0; i < posts.length; i++) {
    let user = getCurantUser();
    let myPost = user != null && posts[i].author.id == user.id;
    let edibtn = "";
    if (myPost) {
      edibtn = `
  <button class="btn btn-danger" style="float: right; margin-left: 5px;"  onclick="deletPostClick('${encodeURIComponent(
    JSON.stringify(posts[i])
  )}')">Delete</button>
  <button class="btn btn-secondary" style="float: right;"  onclick="editPostClick('${encodeURIComponent(
    JSON.stringify(posts[i])
  )}')">edit</button>
  `;
    }
    box += `
    <div class="card  mt-4 mb-4">
      <div class="card-header">
        <span onclick="userProfileClicked(${posts[i].author.id})">
          <img src="${posts[i].author.profile_image}" alt="Profile picture" class="rounded-circle profiimgee">
          <span class="px-2 fw-medium ">@${posts[i].author.username}</span>
        </span>
          ${edibtn}
          </div>
      <div class="card-body" onclick="postUserInformation(${posts[i].id})">
          <img src="${posts[i].image}" alt="" class=" w-100 rounded-3">
          <h5 class="px-2 pt-2 text-muted">${posts[i].created_at}</h5>
          <h2 class="px-2 ">${posts[i].title}</h2>
          <p class="px-2">${posts[i].body}</p>
          <hr>
          <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-chat-left-text" viewBox="0 0 16 16">
                  <path
                      d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path
                      d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span class="px-2">(${posts[i].comments_count}) Comment</span>
          </div>
      </div>
  </div>
    `;
  }
  profilePosts.innerHTML = box;
}

function userProfileClicked(userId) {
  window.location = `../profile.html?userid=${userId}`;
}
function profileClicked() {
  let idUser = getCurantUser();
  window.location = `../profile.html?userid=${idUser.id}`;
}
