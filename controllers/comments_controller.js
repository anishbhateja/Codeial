const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = function (req, res) {
  Post.findById(req.body.post, function (err, post) {
    if (post) {
      Comment.create(
        {
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        },
        function (err, comment) {
          if (err) {
            console.log("Error in creating comment !");
          }
          post.comments.push(comment); //pushing into the array of post(key:comments)
          post.save();
          return res.redirect("/");
        }
      );
    }
  });
};
