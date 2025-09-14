const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Post = require('../models/Post');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogapp');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123'
      },
      {
        username: 'tech_blogger',
        email: 'tech@example.com',
        password: 'password123'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create sample posts
    const posts = [
      {
        title: 'Getting Started with React Hooks',
        content: `React Hooks revolutionized the way we write functional components in React. They allow us to use state and other React features without writing a class. In this comprehensive guide, we'll explore the most commonly used hooks like useState, useEffect, useContext, and more.

The useState hook is probably the most fundamental hook you'll use. It allows you to add state to functional components. Here's a simple example:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

The useEffect hook is another essential hook that allows you to perform side effects in functional components. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.

Understanding these hooks is crucial for modern React development. They make your code more readable, reusable, and easier to test.`,
        imageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        author: createdUsers[0]._id,
        username: createdUsers[0].username
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        content: `Creating robust RESTful APIs is a fundamental skill for backend developers. In this tutorial, we'll build a complete API using Node.js and Express, covering everything from basic routing to authentication and error handling.

First, let's set up our basic Express server:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

We'll also cover middleware, error handling, and best practices for API design. Proper error handling is crucial for production applications, and we'll implement comprehensive error handling middleware.

Authentication is another important aspect. We'll implement JWT-based authentication with proper password hashing using bcrypt. This ensures your API is secure and follows industry standards.

By the end of this tutorial, you'll have a solid understanding of building production-ready APIs with Node.js and Express.`,
        imageURL: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        author: createdUsers[1]._id,
        username: createdUsers[1].username
      },
      {
        title: 'The Future of Web Development: Trends to Watch',
        content: `Web development is constantly evolving, and staying up-to-date with the latest trends is crucial for developers. In this article, we'll explore the most significant trends shaping the future of web development.

**1. Serverless Architecture**
Serverless computing is becoming increasingly popular, allowing developers to focus on code without worrying about server management. Platforms like AWS Lambda, Vercel, and Netlify are making it easier than ever to deploy applications.

**2. Progressive Web Apps (PWAs)**
PWAs combine the best of web and mobile applications, offering offline functionality, push notifications, and app-like experiences. They're becoming the standard for modern web applications.

**3. WebAssembly (WASM)**
WebAssembly allows you to run high-performance code in the browser, opening up possibilities for complex applications like games, image editing, and scientific computing.

**4. Micro-Frontends**
This architectural pattern allows teams to work independently on different parts of a frontend application, improving scalability and team productivity.

**5. AI and Machine Learning Integration**
AI is becoming more accessible to web developers, with tools like TensorFlow.js enabling machine learning directly in the browser.

These trends are reshaping how we build and deploy web applications. Embracing these technologies will be key to staying competitive in the rapidly evolving web development landscape.`,
        imageURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        author: createdUsers[2]._id,
        username: createdUsers[2].username
      },
      {
        title: 'Mastering CSS Grid Layout',
        content: `CSS Grid is a powerful two-dimensional layout system that has revolutionized how we create complex layouts on the web. Unlike Flexbox, which is primarily one-dimensional, CSS Grid allows you to control both rows and columns simultaneously.

Let's start with the basics. To create a grid, you need to set the display property to grid on a container element:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

The \`grid-template-columns\` property defines the number and size of columns, while \`grid-template-rows\` defines the rows. The \`fr\` unit represents a fraction of the available space.

You can also use named grid lines and areas for more semantic layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}
\`\`\`

CSS Grid also provides powerful alignment and distribution properties, making it easier than ever to create responsive, flexible layouts. Whether you're building a simple card layout or a complex dashboard, CSS Grid has the tools you need.`,
        imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        author: createdUsers[0]._id,
        username: createdUsers[0].username
      },
      {
        title: 'Database Design Best Practices',
        content: `Good database design is the foundation of any successful application. Whether you're working with SQL or NoSQL databases, following best practices will ensure your data is organized, efficient, and maintainable.

**1. Normalization**
Normalization reduces data redundancy and improves data integrity. However, don't over-normalize, as it can lead to performance issues with complex queries.

**2. Indexing Strategy**
Proper indexing is crucial for query performance. Create indexes on frequently queried columns, but be mindful of the trade-off between read and write performance.

**3. Data Types**
Choose appropriate data types for your columns. This not only saves storage space but also improves query performance and data integrity.

**4. Relationships**
Design clear relationships between tables. Use foreign keys to maintain referential integrity and consider the cascade behavior for updates and deletes.

**5. Security**
Implement proper access controls and use parameterized queries to prevent SQL injection attacks. Never store sensitive data like passwords in plain text.

**6. Backup Strategy**
Regular backups are essential. Test your backup and restore procedures to ensure they work when you need them.

**7. Performance Monitoring**
Monitor your database performance regularly. Use query analysis tools to identify slow queries and optimize them.

Remember, database design is an iterative process. Start with a solid foundation and be prepared to refactor as your application grows and requirements change.`,
        imageURL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        author: createdUsers[1]._id,
        username: createdUsers[1].username
      }
    ];

    for (const postData of posts) {
      const post = new Post(postData);
      await post.save();
      console.log(`Created post: ${post.title}`);
    }

    console.log('Seed data created successfully!');
    console.log(`Created ${createdUsers.length} users and ${posts.length} posts`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedData();
