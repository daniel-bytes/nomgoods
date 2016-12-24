import listRepository from './list'
import userRepository from './user'

export default function(model) {
    const ListRepository = listRepository(model);
    const UserRepository = userRepository(model);

    return {
        list: () => ListRepository,
        user: () => UserRepository
    }
}