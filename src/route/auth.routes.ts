import { Router } from "express";

const router:Router = Router();

import {getUsers, loginUser, showProfile} from "../controllers/auth.controller";
import {tokenValidation} from "../libs/validateToken";

router.route('/')
    .get(getUsers)
    router.post('/login', loginUser); 
    router.get('/profile', tokenValidation, showProfile);
    

export default router;