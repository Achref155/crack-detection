
const Admin = require('../models/admin.model');
const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch users but exclude those with role 'admin'
    const users = await User.find({ role: { $ne: 'admin' } }, { _id: 1, firstname: 1, lastname: 1, email: 1 })
                           .lean()
                           .exec();
    
    const usersWithId = users.map(user => {
      return { ...user, id: user._id };
    });

    res.json(usersWithId);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.banUser = async (req, res) => {
  try {
    const { id } = req.body;
    await User.findByIdAndUpdate(id, { isBanned: true }); // Assuming `isBanned` is the field
    res.send('User banned successfully');
  } catch (error) {
    res.status(500).send('Error banning user');
  }
};

// // Adding the removeUser functionexports.removeUser = async (req, res) => {
//   exports.removeUser = async (req, res) => {
//     try {
//       console.log("Attempting to remove user with ID:", req.params.id);
//       const { id } = req.params;
//       await User.findByIdAndDelete(id);
//       res.status(200).send('User removed successfully');
//     } catch (error) {
//       console.error('Error removing user', {
//         message: error.message,
//         stack: error.stack, // helpful in debugging but be cautious about logging this in production
//         operation: 'removeUser'
//       });
//       res.status(500).json({ message: 'Error removing user', error: error.message });
//     }
//   };


exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Attempting to remove user with ID:", id);
    
    await User.findByIdAndDelete(id);
    res.status(200).send('User removed successfully');
  } catch (error) {
    console.error('Error removing user', {
      message: error.message,
      stack: error.stack, // helpful in debugging but be cautious about logging this in production
      operation: 'removeUser'
    });
    res.status(500).json({ message: 'Error removing user', error: error.message });
  }
};


// Implement similar logic for other admin functions
exports.trackAiModel = (req, res) => {
  res.send('AI model tracking');
};
exports.retrainAiModel = (req, res) => {
  res.send('AI model retraining');
}
exports.getSettings = (req, res) => {
  res.send('Getting settings');
}
exports.updateSettings = (req, res) => {
  res.send('Updating settings');
}

exports.getAdminDetails = (req, res) => {
  try {
    // Example admin data; replace this with your database retrieval logic
    const adminDetails = {
      firstname: 'John',
      lastname: 'Doe',
      image: 'avatar.png',
      // Add other necessary fields here
    };
    res.status(200).json(adminDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
