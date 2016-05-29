define('views/sounds', function(require) {
    "use strict";

    var Marionette              = require('marionette'),
        Radio                   = require('backbone.radio'),
        SoundsCollection        = require('collections/sounds'),
        SoundView               = require('views/sound'),
        SoundsCollectionView;

    SoundsCollectionView = Marionette.CollectionView.extend({
        childView: SoundView,
        collection: new SoundsCollection(),
        tagName: 'ul',
        childEvents: {
            'sound:play': 'stopPlayingSound'
        },
        initialize: function() {
            var that    = this;

            this.data = {
                collection: this.collection
            };

            this.channel    = Radio.channel('Sounds');
            this.channel.request('getSounds').then(this.initCollection.bind(this));
            this.channel.on('sounds:filter', this.filterCollection.bind(this));
        },
        initCollection: function(sounds) {
            this.data.collection    = new SoundsCollection(sounds);
            this.collection         = this.data.collection;

            this.render();
        },
        filterCollection: function(search) {
            this.collection     = this.data.collection.filterByTitle(search);

            this.render();
        },
        stopPlayingSound: function() {
            var playingSound    = this.collection.findWhere({playing: true});

            if( playingSound ) {
                playingSound.stop();
            }
        }
    });

    return SoundsCollectionView;
});
