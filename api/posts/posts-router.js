// implement your posts router here
const express = require("express");
const Post = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
    Post.find()
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "The posts information could not be retrieved",
            error: err.message
        });
      });
  });

router.get("/:id", (req, res) => {
    const { id } = req.params
    Post.findById(id)
      .then((posts) => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ 
                status: 404,
                message: "The post with the specified ID does not exist",
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "The posts information could not be retrieved",
            error: err.message
        });
      });
  });

router.post("/", (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
      res.status(400).json({
          status: 400,
          message: "Please provide title and contents for the post",
      })
    } else {
      Post.insert({ title, contents })
        .then(({ id }) => {
          return Post.findById(id);
        })
        .then(post => {
          res.status(201).json(post);
        })
        .catch(err => {
          res.status(500).json({
              status: 500,
              message: "There was an error while saving the post to the database",
              error: err.message,
          });
        });
    }
  });

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    } else {
        Post.findById(id)
          .then(addID => {
              if (!addID) {
                res.status(404).json({
                    status: 404,
                    message: "The post with the specified ID does not exist",
                  });
              } else {
                  return Post.update(id, req.body)
              }
          })
          .then(revisePost => {
              if(revisePost){
                  return Post.findById(id)
              }
          })
          .then(posts => {
              if (posts) {
                  res.json(posts)
              }
          })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                message: "The post information could not be modified",
                error: err.message,
            });
        });
    }
})

router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params
      const removeData = await Post.findById(id);
      if (!removeData) {
        res.status(404).json({
            status: 404,
            message: "The post with the specified ID does not exist",
        });
      } else {
        await Post.remove(id);
        res.json(removeData);
      }
    } catch (err) {
      res.status(500).json({
            status: 500,
            message: "The post could not be removed",
            error: err.message,
      });
    }
  });

router.get("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params
        const bulletin = await Post.findById(id)
          if (!bulletin) {
              res.status(404).json({
                  status: 404,
                  message: 'The post with the specified ID does not exist',
              })
          } else {
              const note = await Post.findPostComments(id)
                res.json(note)
          }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'The comments information could not be retrieved',
            error: err.message,
        })
    }
});

module.exports = router;
