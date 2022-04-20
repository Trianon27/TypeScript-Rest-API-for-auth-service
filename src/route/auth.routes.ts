import { Router } from "express";

const router:Router = Router();

import {loginUser, showProfile} from "../controllers/auth.controller";
import {tokenValidation} from "../libs/validateToken";

router.route('/')
    router.post('/login', loginUser); 
    router.get('/profile', tokenValidation, showProfile);
export default router;