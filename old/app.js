

var app = app || {}
app.Label = Backbone.Model.extend({
	// defaults
	// initialize: function () {
	// 	console.log('Initialized Labels');
	// },
	// load: function() {

	// }
});

app.Labels = Backbone.Collection.extend({
	model: app.Label,
  url: '/api/labels',
  columns: [],
  boards: [],
  initialize: function() {
    this.deferred = this.fetch();
	},
	load: function() {
  	var _this = this;
    this.deferred.done(function(data) {
    	_.each(data, function(d) {
    		if ( 'scrum-board-' == d['name'].substr(0,12)) {
    			_this.boards.push(d);
    		}
    		if ( 'scrum-state-' == d['name'].substr(0,12)) {
    			_this.columns.push(d);
    		}
    	});
    });
	},
});

app.ViewColumn = Backbone.View.extend({
	template: _.template('Testing, too, three, four'),
	initialize: function() {

	},
	render: function() {
		// console.log('render');
		// console.log(this.template);
		this.$el.html(this.template);
	}
});




