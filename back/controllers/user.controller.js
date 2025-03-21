const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPass,
      role,
      isBanned: false
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }

  try {
    const user = await User.findOne({ 
      email: email.trim().toLowerCase() 
    }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    if (user.isBanned) {
      return res.status(403).json({ 
        message: 'Account suspended' 
      });
    }

    const token = jwt.sign({ 
      id: user._id 
    }, '123456789', { 
      expiresIn: '1h' 
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({ 
      token, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Login error details:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    res.status(500).json({ 
      message: 'Authentication process failed',
      detail: error.message 
    });
  }
}


// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         console.log('Looking for user with email:', email);
//         const user = await User.findOne({ email }).select('+password');
//         if (!user) {
//           console.log('User not found');
//           return res.status(404).json({ message: 'User not found' }); 
//         }
        
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('Password match:', isMatch);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
//         console.log('User logged in successfully');
//         if (!user.isBanned) {
//             const token = jwt.sign({ id: user._id }, '123456789', { expiresIn: '1h' });
//             const userWithoutPassword = user.toObject();
//             delete userWithoutPassword.password;
//             res.status(200).json({ token, user: userWithoutPassword });
//         } else {
//             res.status(400).json({ message: 'User is banned' });
//         }

//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: error.message || 'Unexpected error during login' });
//     }
// };


// exports.login = async (req, res) => {
//     const { email, password } = req.body;
    
//     try {
//         console.log('Received login request for email:', email.trim()); // Use trim to catch unwanted spaces
//         const user = await User.findOne({ email: email.trim() }).select('+password'); // Trim used here too
//         if (!user) {
//             console.log('User not found');
//             return res.status(404).json({ message: 'User not found' });
//         }
  
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('Password match:', isMatch);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
//         console.log('User logged in successfully');
//         if (!user.isBanned) {
//             const token = jwt.sign({ id: user._id }, '123456789', { expiresIn: '1h' });
//             const userWithoutPassword = user.toObject();
//             delete userWithoutPassword.password;
//             res.status(200).json({ token, user: userWithoutPassword });
//         } else {
//             res.status(400).json({ message: 'User is banned' });
//         }
  
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: error.message || 'Unexpected error during login' });
//     }
//   };

exports.getUserById = async (req, res)=>{

    const { id } = req.params;
    try {
        
        const user = await User.findById(id , { password: 0 } );
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.editUser = async (req, res)=>{
    try {

        const { id } = req.params;

        if(req.body.password){
            req.body.password = await bcrypt.hash( req.body.password, 10 );
        }
        await User.findByIdAndUpdate({ _id: id } , req.body);

        res.status(200).json({message: 'user updated'});
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUserRole = async (req, res) => {
    try {
      const { userId, role } = req.body;
      const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

//   exports.transferUserToAdmin = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         // Find the user
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Create a new admin document
//         const newAdmin = new Admin({
//             firstname: user.firstname,
//             lastname: user.lastname,
//             email: user.email,
//             image: user.image
//         });

//         // Save the new admin
//         await newAdmin.save();

//         // Update user's role to 'admin'
//         user.role = 'admin';
//         await user.save();

//         res.status(200).json({ message: 'User transferred to Admin successfully' });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };