var picks = {};

picks.removed = []; // List of markers that have been removed from map (filtered)
picks.symbols = []; // List of all unique symbols
picks.visible = []; // List of symbols that are set to be visible
picks.descriptions  = {};

picks.start = function(url) {

    // Create marker layer
    picks.layer = mmg().factory(simplestyle_factory).url(url, function(feat, l) {

        // Add interaction
        mmg_interaction(l);

        // Create a list of all unique marker symbols
        picks.symbols = picks.visible = _.uniq(
            _.map(picks.layer.markers(), function(m) {
                return m.data.properties['marker-symbol'];
            }));

        // Create a symbol based filter
        var container = document.getElementById('about');
        _.each(picks.symbols, function(s) {

            var img = document.createElement('img');
            img.src = 'maki/' + s + '-24.png';
            img.className = 'markerfilter selected';

            img.onclick = function(a) {
                var index = _.indexOf(picks.visible, s);
                if (index < 0) {
                    picks.visible.push(s);
                    img.className = 'markerfilter selected';
                    picks.show(s);
                } else {
                    picks.visible.splice(index, 1);
                    img.className = 'markerfilter';
                    picks.hide(s);
                }
            }

            container.appendChild(img);
        });

    });
    MM_map.addLayer(picks.layer);

}


// Set all markers with specified symbol to be shown
picks.show = function(s) {

    picks.removed = _.reject(picks.removed, function(m) {
        if (m.data.properties['marker-symbol'] == s) {
            picks.layer.add(m);
            return true;
        }
    });
    picks.layer.draw();
}

picks.hide = function(s) {

    var newRemovals = _.filter(picks.layer.markers(), function(m) {
        return !_.include(picks.visible, m.data.properties['marker-symbol']);
    });

    _.each(newRemovals, function(m) {
        picks.layer.remove(m);
        picks.removed.push(m);
    });
}
