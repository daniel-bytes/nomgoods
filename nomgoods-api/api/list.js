export default function(express, repository) {
    const router = express.Router();

    // Get all
    router.get('/', function(req, res) {
        repository.list().query(req.user).then(lists => {
            return res.json(lists);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ err });
        })
    })

    // Get by id
    router.get('/:id', function(req, res) {
        repository.list().fetch(req.params.id, req.user).then(list => {
            if (!list) {
                return res.status(404).json({ message: `Failed to locate list with id ${req.params.id}`})
            }

            return res.json(list);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ err });
        })
    })

    // Create
    router.post('/', function(req, res) {
        repository.list().create(req.body, req.user).then(data => {
            return res.json(data);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ err });
        })
    })

    // Update
    router.put('/:id', function(req, res) {
        repository.list().update(req.params.id, req.body, req.user).then(data => {
            if (!data) {
                return res.status(404).json({ message: `Failed to locate list with id ${req.params.id}`})
            }

            return res.json(data);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ err });
        })
    })

    // Delete
    router.delete('/:id', function(req, res) {
        repository.list().remove(req.params.id, req.user).then(data => {
            if (!data) {
                return res.status(404).json({ message: `Failed to locate list with id ${req.params.id}`})
            }

            return res.json(data);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ err });
        })
    })

    return router;
}