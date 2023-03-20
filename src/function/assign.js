export default function() {
    const
        args = arguments,
        rt = args[0]
        

    for (let i = 1; i < args.length; i++) {
        for (let prop in args[i]) {
            if (typeof args[i][prop] !== 'undefined') {
                rt[prop] = args[i][prop]
            }
        }
    }

    return rt
}
