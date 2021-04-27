// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "The posts information could not be retrieved" })
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    }
  } catch (err) {
    res.status(500).json({ message: "The post information could not be retrieved" })
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" })
      return;
    }

    const createPostResult = await Posts.insert({
      title: title,
      contents: contents
    });
    const postId = createPostResult.id;
    const post = await Posts.findById(postId);
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: "There was an error while saving the post to the database" })
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatePostId = req.params.id;
    const updatePost = await Posts.findById(updatePostId);
    const { title, contents } = req.body;
    if (!updatePost) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else if (!title || !contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
      await Posts.update(updatePostId, {
        title: title,
        contents: contents
      });
      const post = await Posts.findById(updatePostId);
      res.status(200).json(post)
    }
  } catch (err) {
    res.status(500).json({ message: "The post information could not be modified" })
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletePostId = req.params.id;
    const deletePost = await Posts.findById(deletePostId);
    if (!deletePost) {
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
      console.log('fghfghjh');
      await Posts.remove(deletePostId)
      res.status(200).json({ message: "The user post has been NUKED!" })
    }
  } catch (err) {
    res.status(500)({ message: "The post could not be removed" })
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist"  })
      return
    }
    const comments = await Posts.findPostComments(postId)
    res.status(200).json(comments)

  } catch (err) {
    res.status(500)({ message: "The comments information could not be retrieved" })
  }
})



module.exports = router;