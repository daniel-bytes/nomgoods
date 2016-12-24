import { platform } from '../platform'

export default function icon(name) {
    let prefix = platform();

    if (prefix === 'android') {
        prefix = 'md';
    }

    return `${prefix}-${name}`;
}