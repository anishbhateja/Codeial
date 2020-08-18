{
  //method to submit the form data for new post using AJAX
  let creatPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#post-list-container>ul").prepend(newPost);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
      <p>
        <small>
          <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
        </small>
        ${post.content}
        <br />
        <small>
        ${post.user.name}
        </small>
      </p>
      <div class="post-comments">
    
        <form action="/comments/create" id="post-${post._id}-comments-form" method="POST">
          <input
            type="text"
            name="content"
            placeholder="Type here to add comment..."
            required
          />
          <input type="hidden" name="post" value="${post._id}" />
          <input type="submit" value="Add Comment" />
        </form>

    
        <div class="post-comments-list">
          <ul id="post=comments-${post._id}">
          </ul>
        </div>
      </div>
    </li>
    `);
  };

  //method to delete post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let convertPostsToAjax = function () {
    $("#post-list-container>ul>li").each(function (index, value) {
      let self = $(this); //this in jQuery corresponds to the value
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };

  // deleteButtons = document.getElementsByClassName("delete-post-button");
  // let delPost = function (deleteButtons) {
  //   for (button of deleteButtons) {
  //     button.addEventListener("click", function (e) {
  //       //button.click(function (e) {
  //       e.preventDefault();
  //       $.ajax({
  //         type: "get",
  //         url: button.href,
  //         success: function (data) {
  //           $(`#post-${data.data.post_id}`).remove();
  //         },
  //         error: function (error) {
  //           console.log(error.responseText);
  //         },
  //       });
  //     });
  //   }
  // };
  // delPost(deleteButtons);

  creatPost();
  convertPostsToAjax();
}
