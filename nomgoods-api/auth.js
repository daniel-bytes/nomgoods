// fake auth middleware, update this with something real eventually
export default function(repository) {
    const userRepository = repository.user();

    return function(req, res, next) {
        var userid = req.headers.userid;

        if (!userid) {
            return res.status(401).json({ message: 'Not authenticated, missing user id'})
        }

        userRepository.fetch(userid).then(data => {
            if (!data) {
                return res.status(401).json({ message: 'Not authenticated, invalid user id'})
            }

            req.user = data;

            next();
        })
    }
}