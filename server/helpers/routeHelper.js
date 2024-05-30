// helpers.js
module.exports = {
    isActiveRoute: (route, currentRoute) => {
        return route === currentRoute ? 'active' : '';
    }
};
