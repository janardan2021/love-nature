// func is the function that we pass in

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}