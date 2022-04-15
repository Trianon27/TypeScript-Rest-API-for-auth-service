import { Router } from "express";

const router = Router();

import {getUsers, createUser} from "../controllers/users.controller";

router.route('/')
    .get(getUsers)
    .post(createUser);
    

export default router;