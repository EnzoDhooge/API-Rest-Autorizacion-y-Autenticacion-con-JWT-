import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';


export const createUser =  async (req, res) => {

    const { username, email, password, roles } = req.body;

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
    if(roles) {
        const foundRoles = await Role.find({ name: {$in: roles} });
        newUser.roles = foundRoles.map(role => role._id);
    } else {
        const role = await Role.findOne({name: "user"});
        newUser.roles = [role._id];
    }

    // Guardar en DB
    const savedUser = await newUser.save();
    console.log(savedUser);

    // JWT
    const token = jwt.sign({id: savedUser._id}, config.SECRET, {
        expiresIn: 86400 // 24 horas
    });

    res.status(200).json({token});
};


export const getUser = async (req, res) => {

    // Obteniendo datos de DB
    const users = await User.find();
    res.json(users);
};


export const updateUserById = async (req, res) => {
    
    const { roles, ...rest } = req.body;

    if (roles) {

        if (roles.length == 0) {
            return res.status(400).json({message: 'El valor insertado no contiene un rol'});
        }

        const foundRoles = await Role.find({ name: {$in: roles} });
        let newRole = foundRoles.map(role => role._id);
        newRole = {roles: newRole};

        const updateUser = await User.findByIdAndUpdate(req.params.userId, newRole, {
            new: true
        });
    }

    // Actualizando datos de DB
    const updateUser = await User.findByIdAndUpdate(req.params.userId, rest, {
        new: true
    });
    res.status(200).json(updateUser);
};

export const deleteUserById = async (req, res) => {

    // Eliminando datos de DB
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({message: "Usuario eliminado"});
};