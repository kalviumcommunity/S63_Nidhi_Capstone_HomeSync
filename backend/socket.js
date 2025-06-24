const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Map to store active user connections
const connectedUsers = new Map();

// Initialize Socket.IO with the HTTP server
function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5000'], // Frontend URLs
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId || decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);
    
    // Store user connection
    connectedUsers.set(socket.user._id.toString(), socket.id);

    // Join user to their personal room
    socket.join(`user:${socket.user._id}`);
    
    // Handle wishlist updates
    socket.on('wishlist:update', (data) => {
      // Broadcast to all users who are collaborating on this wishlist
      // In a real app, you'd have a list of collaborators
      socket.broadcast.emit('wishlist:updated', {
        action: data.action,
        item: data.item,
        userId: socket.user._id
      });
    });

    // Handle room likes/comments
    socket.on('room:interaction', (data) => {
      // Find the room owner's socket and send notification
      const ownerSocketId = connectedUsers.get(data.ownerId);
      
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('notification', {
          type: data.type, // 'like' or 'comment'
          roomId: data.roomId,
          from: {
            id: socket.user._id,
            username: socket.user.username,
            profileImage: socket.user.profileImage
          },
          message: data.message,
          timestamp: new Date()
        });
      }
    });

    // Handle chat messages (for future implementation)
    socket.on('chat:message', (data) => {
      // Store message in database (not implemented yet)
      
      // Send to recipient
      const recipientSocketId = connectedUsers.get(data.recipientId);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('chat:message', {
          from: {
            id: socket.user._id,
            username: socket.user.username,
            profileImage: socket.user.profileImage
          },
          message: data.message,
          timestamp: new Date()
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
      connectedUsers.delete(socket.user._id.toString());
    });
  });

  return io;
}

module.exports = { initializeSocket };