function simplestyle_factory(feature) {

    var sizes = {
      small: [20, 50],
      medium: [30, 70],
      large: [35, 90]
    };

    var fp = feature.properties || {};

    var size = fp['marker-size'] || 'medium';
    var symbol = (fp['marker-symbol']) ? '-' + fp['marker-symbol'] : '';
    var color = fp['marker-color'] || '7e7e7e';
    color = color.replace('#', '');

    var d = document.createElement('div');
    d.className = 'simplestyle-marker';
    var ds = d.style;
    ds.position = 'absolute';
    ds.width = sizes[size][0] + 'px';
    ds.height = (sizes[size][1] * 0.75) + 'px';
    ds.marginTop = -((sizes[size][1]) / 2) + 'px';
    ds.marginLeft = -(sizes[size][0] / 2) + 'px';
    ds.cursor = 'pointer';

    ds.backgroundImage = 'url(' +
      (simplestyle_factory.baseurl || 'http://a.tiles.mapbox.com/v3/marker/') +
      'pin-' + size[0] + symbol + '+' + color + '.png)';

    ds.textIndent = '-10000px';
    d.innerHTML = fp.title || '';

    return d;
}
