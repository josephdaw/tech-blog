const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['first_name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in,
      pageTitle: '',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    // get post data, including the user who made the post
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {model: User, attributes: { exclude: ['password'] },},
        // {model: Comment, include: [{model: User}]},
      ],
    });

    // get the comments associated with the selected post, including the user who made those comments
    const commentData = await Comment.findAll({ 
      where: { post_id: req.params.id },
      include: [
        { model: User, attributes: { exclude: ['password'] }, },
      ],
    });

    // console.log("c.log postData:", postData)
    // console.log("c.log commentData:", commentData)

    // serialise the sequelize data
    const post = postData.get({ plain: true });

    // have to iterate over the comments 
    const comments = commentData.map(comment => comment.get({plain: true}));

    // const comment = commentData.get({ plain: true });
    
    console.log("c.log post:",post);
    console.log("c.log comments:", comments);

    res.render('post', {
      ...post,
      comments,
      logged_in: req.session.logged_in,
      pageTitle: ` | ${post.title}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// TESTING
router.get('/comments/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({ 
      where: { post_id: req.params.id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
      ],
    });

    const comments = commentData.map(comment => comment.get({plain: true}));

    // console.log(commentData)
    // const comment = commentData.get({ plain: true });
    console.log(comments)

    res.status(200).json("testing");

    // res.render('post', {
    //   ...comment,
    //   logged_in: req.session.logged_in,
    //   pageTitle: ` | ${comment.title}`,
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });
    console.log(user);

    res.render('dashboard', {
      ...user,
      logged_in: true,
      pageTitle: ' | Dashboard',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
      pageTitle: ' | Profile',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login', {
    pageTitle: ' | Login',
  });
});

module.exports = router;
