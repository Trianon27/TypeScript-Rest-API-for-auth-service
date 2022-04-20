import { Router } from "express";

const router = Router();

import {changePassword} from "../controllers/changePassword.controller";

router.route('/')
    .put(changePassword);
       
    

export default router;