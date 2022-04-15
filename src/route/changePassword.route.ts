import { Router } from "express";

const router = Router();

import {getUsers, changePassword} from "../controllers/changePassword.controller";

router.route('/')
    .get(getUsers)
    .put(changePassword);
       
    

export default router;