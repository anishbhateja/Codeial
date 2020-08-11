const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      req.flash("success", "Comment Posted");
      post.comments.push(comment); //pushing into the array of post(key:comments)
      post.save();
      return res.redirect("/");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();

      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      req.flash("success", "Comment deleted !");

      return res.redirect("back");

      //pulling the id of comment tobedeleted from comments in Post schema
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
};
