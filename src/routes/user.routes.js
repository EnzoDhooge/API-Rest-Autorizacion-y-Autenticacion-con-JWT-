import { Router } from 'express';
const router = Router();
// import * as userCtrl from '../controllers/user.controller';
import {createUser, getUser, updateUserById, deleteUserById} from '../controllers/user.controller';
import {authJwt, verifySignup} from '../middlewares';


router.post('/', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUserOrEmail,
    verifySignup.checkRolesExisted
], createUser);

router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getUser);

router.put('/:userId', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUserOrEmail,
    verifySignup.checkRolesExisted
    ], updateUserById);

router.delete('/:userId', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUserOrEmail,
    verifySignup.checkRolesExisted
    ], deleteUserById);

export default router;