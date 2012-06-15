var picks = {};

picks.removed = []; // List of markers that have been removed from map (filtered)
picks.symbols = []; // List of all unique symbols
picks.selected = null;

picks.start = function(url) {

    // Create marker layer
    picks.layer = mmg().factory(simplestyle_factory).url(url, function(feat, l) {

        // Add interaction
        mmg_interaction(l);

        // Create a list of all unique marker symbols
        picks.symbols =  _.uniq(
            _.map(picks.layer.markers(), function(m) {
                return m.data.properties['marker-symbol'];
            }));

        // Set up all button
        var all = document.getElementById('null');
        all.onclick = function() {
            if (picks.selected) {
                // Deselect other button
                document.getElementById(picks.selected).className = 'markerfilter';
                // Select all button
                all.className = 'markerfilter selected';
                picks.selected = null;
                picks.show(picks.selected);
            }
        }

        // Create a symbol based filter
        var container = document.getElementById('about');
        _.each(picks.symbols, function(s) {

            var el = document.createElement('a');
            el.className = 'markerfilter';
            el.selected = false;
            el.id = s;
            el.href = '#';
            $(el).css('background-image', 'url(http://a.tiles.mapbox.com/v3/marker/pin-l-'+s+'+000000.png)');

            el.onclick = function(a) {
                if (picks.selected == s) {
                    picks.selected = null;
                    document.getElementById('null').className = 'markerfilter selected';
                    el.className = 'markerfilter';
                } else {
                    document.getElementById(picks.selected).className = 'markerfilter';
                    el.className = 'markerfilter selected';
                    picks.selected = s;
                }
                picks.show(picks.selected);
                return false;
            }

            container.appendChild(el);
        });

    });
    MM_map.addLayer(picks.layer);

}


// Set all markers with specified symbol to be shown
picks.show = function(s) {

    // re-add removed markers
    _.each(picks.removed, function(m) {
        picks.layer.add(m);
    });
    picks.removed = [];

    if (s) {
        // show markers in category
        picks.removed = _.reject(picks.layer.markers(), function(m) {
            return (m.data.properties['marker-symbol'] == s);
        });
        
        _.each(picks.removed, function(m) {
            picks.layer.remove(m);
        });
    }
    picks.layer.draw();
}
