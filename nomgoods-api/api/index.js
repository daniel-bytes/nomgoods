import listApi from './list'

export default function(express, repository) {
    const router = express.Router();

    router.use('/list', listApi(express, repository));

    return router;
}