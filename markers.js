var markers = {

    removed: [], // Array of markers not currently displayed on map
    symbols: [], // Array of all symbols in marker layer
    colors: [], // Array of all colors in marker layer
    visible: [], // Array of symbol names that are currently visible
    descriptions : {},

    init: function(url) {
        // Create marker layer
        markers.layer = mmg().factory(simplestyle_factory).url(url, function(feat, l) {
            mmg_interaction(l);

            // Create a list of all marker symbols
            markers.symbols = markers.visible = _.uniq(
                _.map(markers.layer.markers(), function(m) {
                    return m.data.properties['marker-symbol'];
                }));

            // Create a list of all marker colors
            markers.colors = _.uniq(
                _.map(markers.layer.markers(), function(m) {
                    return m.data.properties['marker-color'];
                }));

            // Symbol filter
            var cont = document.getElementById('about');
            _.each(markers.symbols, function(s) {
                var img = document.createElement('img');
                img.symbol = s;
                img.src = 'maki/' + s + '-24.png';
                img.className = 'markerfilter selected';
                img.onclick = function(a) {
                    var index = _.indexOf(markers.visible, s);
                    console.log(index);
                    if (index < 0) {
                        markers.visible.push(s);
                        img.className = 'markerfilter selected';
                    } else {
                        markers.visible.splice(index, 1);
                        img.className = 'markerfilter';
                    }
                    console.log(markers.visible);


                    markers.filter(markers.visible);
                }
                cont.appendChild(img);
            });

        });
        MM_map.addLayer(markers.layer);

    },


    filter: function() {
        var newRemovals = _.filter(markers.layer.markers(), function(m) {
            return !_.include(markers.visible, m.data.properties['marker-symbol']);
        });

        var newAdditions = _.filter(markers.removed, function(m) {
            return _.include(markers.visible, m.data.properties['marker-symbol']);
        });

        _.each(newRemovals, function(m) {
            markers.layer.remove(m);
            markers.removed.push(m);
            m.desc.style.display = 'none';
        });

        _.each(newAdditions, function(m) {
            markers.layer.add(m);
            markers.removed.splice(_.indexOf(markers.removed, m), 1);
            m.desc.style.display = 'block';
        });

        if (newAdditions.length) markers.layer.draw(); // Fix positioning of markers
    }
}
