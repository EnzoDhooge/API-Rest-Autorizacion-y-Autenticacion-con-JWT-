import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';


export const signUp = async (req, res) => {

    const { username, email, password } = req.body;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    // Crear modelo de usuario
    const newUser = new User({
        username,
        email,
        password: newPassword
    });

    // Designar el rol 
    const role = await Role.findOne({name: "user"});
    newUser.roles = [role._id];

    // Guardar en DB
    const savedUser = await newUser.save();
    console.log(savedUser);

    // JWT
    const token = jwt.sign({id: savedUser._id}, config.SECRET, {
        expiresIn: 86400 // 24 horas
    });

    res.status(200).json({token});
};


export const signIn = async (req, res) => {
    
    // Verificar si el email existe
    const userFound = await User.findOne({email: req.body.email}).populate("roles");

    if (!userFound) {
        return res.status(400).json({message: "User not found"});
    }

    // Verificar si la contraseña coincide
    const matchPassword = await bcrypt.compare(req.body.password, userFound.password);
    if (!matchPassword) {
        return res.status(401).json({token: null, message: 'Invalid password'});
    }

    // JWT
    const token = jwt.sign({id: userFound._id}, config.SECRET, {
        expiresIn: 86400 // 24 horas
    });

    console.log(userFound);

    res.json({token});
};
