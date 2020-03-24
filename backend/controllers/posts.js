
const Post = require('../models/post');

exports.newPosts = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const posts = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  posts.save().then( createdPost => {
    res.status(201).json({
      message: "Post added succeffuly by Zoloo",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed! Шинэ мэдээлэл нэмхэд алдаа гарлаа!"
    });
  });
}

exports.updatePosts = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://"  + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  const post = new Post({
    _id : req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({ _id: req.body.id, creator: req.userData.userId }, post).then(result => {
    if (result.n > 0 ){
      console.log(result);
      res.status(200).json( {message: "Update successfully!"});
    } else {
      res.status(401).json( {message: "Not autherize this user ! Та өөрчилж болохгүй!"});
    }
  })
  .catch(error => {
    res.status(401).json({
      message: "Couldn't update post. Мэдээллийг өөрчилж чадсангүй!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize; // bid nar durtai query ywuulj bolno
  const currentPage = +req.query.page; // durtai ner uguj bolno
  const postQuery = Post.find();  // herew bid nar neg negeer salgah gej bgaa bol eniig ashiglana
  let fetchedPosts; // buffer our fetched post
  if (pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1)).limit(pageSize);
   }
  postQuery
    .then(documents => {
     fetchedPosts = documents;
     return Post.estimatedDocumentCount();

    })
    .then(estimatedDocumentCount => {
      res.status(200).json({
       message: "Posts fetched successfully",
       posts: fetchedPosts,
       maxPosts: estimatedDocumentCount
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!. Мэдээллүүдийг дата байсээс уншиж чадсангүй!"
      });
    });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed! Мэдээлэл уншиж чадсангүй!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    //console.log(result);
    if (result.n > 0 ){
      res.status(200).json( {message: "Deleted successfully!"});
    }else {
      res.status(401).json( {message: "Not autherized user! Энэ постыг үүсгэсэн хэрэглэгч биш байна!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't delete post. Пост устгаж чадсангүй!"
    });
  });
}
