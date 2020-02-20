// Nova Asset JS

function parseRouteForDisplay(route) {
    return route.replace("\/", "").split("/").map(_.startCase).join(" > ")
}

function getResourceMeta(resourceName) {
    let resourceMeta = Nova.config.resources.filter(function(resource) {
        return resource.uriKey == resourceName
    })

    if (resourceMeta[0] != undefined)
        resourceMeta = resourceMeta[0]
    else
        resourceMeta = null

    return resourceMeta
}

Nova.booting((Vue, router, store) => {
    let originalTitle = document.title;
    router.afterEach((to, from, next) => {

        let resourceMeta = getResourceMeta(to.params.resourceName);
        let relatedResourceMeta = null;

        if (typeof to.params.relatedResourceName !== 'undefined')
            relatedResourceMeta = getResourceMeta(to.params.relatedResourceName)

        let label = to.params.resourceName;

        let toName = to.name;

        if (toName.indexOf('custom-') === 0)
            toName = toName.substr(7);

        setTimeout(function() {
            let h1 = document.getElementById('inner-content').querySelector('h1');
            if (h1) {
                document.title = h1.innerText + ' | ' + originalTitle;
            }
        }, 1000);

        if (resourceMeta) {
            if (toName == 'index')
                label = resourceMeta.label;
            else if (toName == 'detail')
                label = resourceMeta.singularLabel + ' #' + to.params.resourceId;
            else if (toName == 'edit-attached')
                label = 'Editar ' + resourceMeta.singularLabel + ' - > ' + relatedResourceMeta.singularLabel
            else if (toName == 'edit')
                label = 'Editar ' + resourceMeta.singularLabel + ' #' + to.params.resourceId;
            else
                label = _.startCase(to.name) + ' ' + resourceMeta.singularLabel;
        } else {
            label = parseRouteForDisplay(to.path)

            if (label == '')
                label = _.startCase(to.name)
        }

        document.title = label + ' | ' + originalTitle;

        if (typeof next === 'function')
            next();
    })
});