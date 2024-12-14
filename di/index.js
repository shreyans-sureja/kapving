const {asClass, asValue, Lifetime, InjectionMode, createContainer} = require('awilix');

const container = createContainer({injectionMode : InjectionMode.CLASSIC});

function getScope() {
    return {lifetime : Lifetime.SINGLETON}
}

container.register('config', asValue(require('../config/config')));

module.exports = container;