const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (req, res) {
  //populate the user of each post

  try {
    let posts = await Post.find({}) //awaits for all the posts to found and poulate users comments
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    let users = await User.find({}); //once posts are found, then users are found, once they're all finished, only then will anything will be rendered to the browser.

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    //if any error occurs  in try, catch will directly be executed.
    console.log("Error", err);
    return;
  }
};
