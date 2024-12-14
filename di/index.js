const {asClass, asValue, Lifetime, InjectionMode, createContainer, asFunction} = require('awilix');
const container = createContainer({injectionMode : InjectionMode.CLASSIC});

const sqliteConnect = require('../driver/sqlite')

function getScope() {
    return {lifetime : Lifetime.SINGLETON}
}

container.register('config', asValue(require('../config/config')));

container.register('authRepo', asClass(require('../data/auth-repo')));

container.register('uploadApi', asClass(require('../api/upload-api')));

container.register({
    'sqlite': asFunction(sqliteConnect).singleton(),
})


module.exports = container;