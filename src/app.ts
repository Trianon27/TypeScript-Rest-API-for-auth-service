import express, {Application} from 'express';
import morgan from 'morgan';

//Routes
import indexRoutes from './route/index.routes';
import UserRoute from './route/users.routes';
import AuthRoute from './route/auth.routes';
import changePasswordRoute from './route/changePassword.route';


export class App {

    private app: Application;

    constructor(private port?: number| string){
        this.app = express();
        this.setting();
        this.middlewares();
        this.routes();
     }

    setting(){
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json()); //recibe datos de formularios tipo JSON
    }

    routes(){
        this.app.use(indexRoutes);
        this.app.use('/users', UserRoute);
        this.app.use('/auth',AuthRoute);
        this.app.use('/change_password',changePasswordRoute);
    }
     
    async listen(){
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', 3000);
    }

}