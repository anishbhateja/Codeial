const { request } = require("express");

let Post = require("../../../models/post");
let Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({}) //awaits for all the posts to found and poulate users comments
    .sort("-createdAt")
    .populate("user")
    //.deselect("password")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.json(200, {
    message: "List of posts in v1 api",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    //.id means converting the object id into string(used for comparisons)
    if (post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
        message: "Post and associated comments deleted successfully!",
      });
    } else {
      return res.json(401, {
        message: "you cannot delete this post!",
      });
    }
  } catch (err) {
    console.log("*******", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
