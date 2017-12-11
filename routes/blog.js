const User = require('../models/user');
const jwt  = require('jsonwebtoken');
const config = require('../config/database');
const Blog = require('../models/blog');

module.exports = (router) =>
{
    // Get all blogs from database
    router.get('/blogs', (req, res) => 
    {
        Blog.find({}).exec( (err, blogs) => 
        {
            if (err) 
            {
                res.json({ success: false, msg: err });
            } 
            else if (!blogs)
            {
                res.json({ success: false, msg: 'No blogs found.' });
            }
            else
            {
                res.json({ success: true, msg: 'Success.', blogs: blogs });
            }
        });
    });

    // Save new blog to database
    router.post('/newBlog', (req, res) => 
    {
        let title = req.body.title.trim();
        let author = req.body.author;
        let text = req.body.text.trim();

        if (!title) 
        {
            res.json({ success: false, msg: 'Title was not provided.' });
        } 
        else if (!author)
        {
            res.json({ success: false, msg: 'Author was not provided.' });
        }
        else if (!text)
        {
            res.json({ success: false, msg: 'Text was not provided.' });
        }
        else
        {
            const newBlog = new Blog({
                title: title,
                author: author,
                text: text
            });

            newBlog.save((err) =>
            {
                if (err) 
                {
                    res.json({ success: false, msg: err });
                } 
                else
                {
                    res.json({ success: true, msg: 'Blog saved.' });
                }
            });
        }

    });

    // Get a blog by id 
    router.get('/singleBlog/:id', (req, res) => 
    {
        if (!req.params.id) // Check if id was provided
        {
            res.json({ success: false, msg: 'No id provided.' });
        }
        else
        {
            // Search the database by id in request paramaters
            Blog.findOne({ _id: req.params.id }, (err, blog) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: 'Not a valid blog id.' });
                }
                else if (!blog)
                {
                    res.json({ success: false, msg: 'Blog not found.' });
                }
                else
                {
                    // Find user currently logged in by id from token
                    User.findOne({ _id: req.decoded.userId }, (err, user) => 
                    {
                        if (err)
                        {
                            res.json({ success: false, msg: err });
                        }
                        else if (!user)
                        {
                            res.json({ success: false, msg: 'Unable to read user ID from token.' });
                        }
                        else if (user.username !== blog.author) // Make sure the user editing the blog is it's author
                        {
                            res.json({ success: false, msg: 'You are not authorized to edit this blog.' });
                        }
                        else
                        {
                            res.json({ success: true, msg: 'Blog found.', blog: blog });
                        }
                    });
                }
            });
        }
    });

    // PUT request for updating existing blog's data
    router.put('/updateBlog', (req, res) => 
    {
        if (!req.body._id) // Make sure id was provided
        {
            res.json({ success: false, msg: 'ID was not provided.' });
        }
        else
        {
            // Save data from request body to a variable
            let newBlogData = req.body;

            // Find blog by id
            Blog.findOne({ _id: newBlogData._id }, (err, blog) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: 'Not a valid blog id.' });
                }
                else if (!blog)
                {
                    res.json({ success: false, msg: 'Failed to edit. Blog not found.' });
                }
                else
                {
                    // Find user currently logged in by id from token
                    User.findOne({ _id: req.decoded.userId }, (err, user) => 
                    {
                        if (err)
                        {
                            res.json({ success: false, msg: err });
                        }
                        else if (!user)
                        {
                            res.json({ success: false, msg: 'Unable to read user ID from token.' });
                        }
                        else if (user.username !== blog.author) // Make sure the user editing the blog is it's author
                        {
                            res.json({ success: false, msg: 'You are not authorized to edit this blog.' });
                        }
                        else
                        {
                            // Making changes to the blog found in database
                            blog.title = newBlogData.title;
                            blog.text = newBlogData.text;
                            blog.dateEdited = new Date(); // Add date to the dateEdited field
                            
                            // Save the blog with new data
                            blog.save((err) => 
                            {
                                if (err)
                                {
                                    res.json({ success: false, msg: err });
                                }
                                else
                                {
                                    res.json({ success: true, msg: 'Changes to the blog saved.' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    // DELETE request for deleting a blog
    router.delete('/deleteBlog/:id', (req, res) => 
    {
        if (!req.params.id)
        {
            res.json({ success: false, msg: 'ID was not provided.' });
        }
        else
        {
            Blog.findOne({ _id: req.params.id }, (err, blog) =>
            {
                if (err)
                {
                    res.json({ success: false, msg: err });
                }
                else if (!blog)
                {
                    res.json({ success: false, msg: 'Blog not found.' });
                }
                else
                {
                    // Find user currently logged in by id from token
                    User.findOne({ _id: req.decoded.userId }, (err, user) => 
                    {
                        if (err)
                        {
                            res.json({ success: false, msg: err });
                        }
                        else if (!user)
                        {
                            res.json({ success: false, msg: 'Unable to read user ID from token.' });
                        }
                        else if (user.username !== blog.author) // Make sure the user deleting the blog is it's author
                        {
                            res.json({ success: false, msg: 'You are not authorized to delete this blog.' });
                        }
                        else
                        {
                            // Remove blog from database
                            blog.remove(err => 
                            {
                                if (err)
                                {
                                    res.json({ success: false, msg: err });
                                }
                                else
                                {
                                    res.json({ success: true, msg: 'Blog deleted' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    // Like a blog route
    router.put('/likeBlog', (req, res) => 
    {
        if (!req.body.id)
        {
            res.json({ success: false, msg: 'No id was provided' });
        }
        else
        {
            Blog.findOne({ _id: req.body.id}, (err, blog) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: 'Invalid blog id.' });
                }
                else if (!blog)
                {
                    res.json({ success: false, msg: 'Blog not found.' });
                }
                else
                {
                    // Find user currently logged in by id from token
                    User.findOne({ _id: req.decoded.userId }, (err, user) => 
                    {
                        if (err)
                        {
                            res.json({ success: false, msg: err });
                        }
                        else if (!user)
                        {
                            res.json({ success: false, msg: 'Unable to read user ID from token.' });
                        }
                        // Check if user already liked this blog
                        else if (blog.likedBy.includes(user.username))
                        {
                            res.json({ success: false, msg: 'You already liked this blog.' });
                        }
                        // Check if user had previously disliked the blog
                        else if (blog.dislikedBy.includes(user.username))
                        {
                            blog.dislikes--; // Lower the amount of disliked
                            const arrIndex = blog.dislikedBy.indexOf(user.username); // Find the index of the user
                            blog.dislikedBy.splice(arrIndex, 1); // Remove the user from the list of dislikers
                            blog.likes++; // Increase the amount of likes
                            blog.likedBy.push(user.username); // Save the user in likedBy list
                            blog.save(err => 
                            {
                                if (err)
                                {
                                    res.json({ success: false, msg: err });
                                }
                                else
                                {
                                    res.json({ success: true, msg: 'Liked blog !' });
                                }
                            });
                        }
                        else // If user had not previously liked or disliked the blog
                        {
                            blog.likes++; // Increase the amount of likes
                            blog.likedBy.push(user.username); // Save the user in likedBy list
                            blog.save(err => 
                            {
                                if (err)
                                {
                                    res.json({ success: false, msg: err });
                                }
                                else
                                {
                                    res.json({ success: true, msg: 'Liked blog !' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    // Dislike a blog route
    router.put('/dislikeBlog', (req, res) => 
    {
        if (!req.body.id)
        {
            res.json({ success: false, msg: 'No id was provided' });
        }
        else
        {
            Blog.findOne({ _id: req.body.id}, (err, blog) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: 'Invalid blog id.' });
                }
                else if (!blog)
                {
                    res.json({ success: false, msg: 'Blog not found.' });
                }
                else
                {
                    // Find user currently logged in by id from token
                    User.findOne({ _id: req.decoded.userId }, (err, user) => 
                    {
                        if (err)
                        {
                            res.json({ success: false, msg: err });
                        }
                        else if (!user)
                        {
                            res.json({ success: false, msg: 'Unable to read user ID from token.' });
                        }
                        // Check if user already disliked this blog
                        else if (blog.dislikedBy.includes(user.username))
                        {
                            res.json({ success: false, msg: 'You already disliked this blog.' });
                        }
                        // Check if user had previously liked the blog
                        else if (blog.likedBy.includes(user.username))
                        {
                            blog.likes--; // Lower the amount of likes
                            const arrIndex = blog.likedBy.indexOf(user.username); // Find the index of the user
                            blog.likedBy.splice(arrIndex, 1); // Remove the user from the list of likers
                            blog.dislikes++; // Increase the amount of dislikes
                            blog.dislikedBy.push(user.username); // Save the user in dislikedBy list
                            blog.save(err => 
                            {
                                if (err)
                                {
                                    res.json({ success: false, msg: err });
                                }
                                else
                                {
                                    res.json({ success: true, msg: 'Disliked blog !' });
                                }
                            });
                        }
                        else // If user had not previously liked or disliked the blog
                        {
                            blog.dislikes++; // Increase the amount of dislikes
                            blog.dislikedBy.push(user.username); // Save the user in dislikedBy list
                            blog.save(err => 
                            {
                                if (err)
                                {
                                    res.json({ success: false, msg: err });
                                }
                                else
                                {
                                    res.json({ success: true, msg: 'Disliked blog !' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    // Get blogs by username
    router.get('/userBlogs/:username', (req, res) => 
    {
        if (!req.params.username)
        {
            res.json({ success: false, msg: 'Username not provided.' });
        }
        else
        {
            Blog.find({ author: req.params.username }).sort({ dateCreated: -1 }).exec((err, blogs) => 
            {
                if (err)
                {
                    res.json({ success: false, msg: err });
                }
                else if (!blogs || blogs.length < 1)
                {
                    res.json({ success: false, msg: 'No blogs found.' });
                }
                else
                {
                    res.json({ success: true, msg: 'Blogs found', blogs: blogs });
                }
            });
        }
    });

    return router;
}