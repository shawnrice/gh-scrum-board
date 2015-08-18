////////
//////// Views
////////

var CollaboratorView = Backbone.View.extend({
	template: _.template(
		"<option value='<%= login %>'<% if (login == assignee) { %> selected <% } %> >" +
			"@<%= login %>" +
		"</option>"),
	initialize: function(model, selected) {
		this.model = new CollaboratorModel(model);
		this.model['select'] = selected;
		this.model = this.model.toJSON();
	},
	render: function() {
		if (null != this.model['login']) {
			var output = this.template(this.model);
			return output;
		}
		return '';
	},
});

var AllCollaboratorsView = Backbone.View.extend({
	template: _.template("<select><%= inner %></select>"),
	initialize: function(selected) {
		var _this = this;
		this.select = '';
		this.selected = selected;
		_.each(app.collaboratorCollection.toJSON(), function(collaborator) {
			var test = new CollaboratorView(collaborator, _this.selected).render();
			_this.select += test;
		});
	},
	render: function() {
		return this.template({inner: this.select}).to_html;
	},
});


var ColumnView = Backbone.View.extend({
	// model: function() { return new ColumnModel; },
	el: function() { return $('#scrum-board-canvas'); },
	template: _.template(
		"<div id='<%= name %>' class='scrum-column' style='width: <%= width %>%; max-width: <%= width %>%; background-color: #<%= color %>; margin: 0 <%= margin %>%;'>" +
	  	"<h3><%= niceify(name.substr(12)) %></h3>" +
	  	"<hr />" +
	  	"<ul id='<%= name %>-content' class='sortable'></ul>" +
	  "</div>"),
	initialize: function(data, width, margin) {
		data = data['collection'];
		this.model = new ColumnModel(data);
		this.model.attributes['width'] = width;
		this.model.attributes['margin'] = margin;
		this.render();
	},
	render: function() {
		this.$el.append(this.template(this.model.toJSON())).el;
		return this;
	},
});

var AllColumnsView = Backbone.View.extend({
	el: $('#scrumboard'),
	template: _.template("<div id='scrum-board-canvas'><div class='title'><h1>Scrum Board</h1></div></div>"),
	setWidths: function() {
		if ( 0 == (100 % this.collection['models'].length) ) {
			this.width = 100 / this.collection['models'].length;
			this.margin = 0;
		} else {
			this.width = Math.floor(100 / (this.collection['models'].length + 1));
			this.margin = (100 / (this.collection['models'].length) ) / 10;
		}
	},
	initialize: function(data) {
		console.log('Rendering columns');
		this.el = data['el'];
		this.collection = data['collection'];
		this.setWidths();
	},
	render: function() {
		this.$el.html(this.template).el;
		var _this = this;
		_.each(this.collection.toJSON(), function(column) {
			new ColumnView({collection: column }, _this.width, _this.margin);
		});
	  return this;
	},
});


var SingleTaskView = Backbone.View.extend({
	template: _.template(
		"<li id='issue-<%= id %>' class='task'>" +
			"<div class='drag-handle'>" +
				"<h6><%= title %><h6>" +
			"</div>" +
			"<div class='task-comments'>" +
				"<strong><%= comments %></strong> comments" +
			"</div>" +
			"<div>" +
				"<div class='description'><%= body %></div>" +
				"<div class='assignee'>" +
				"<select class='select-assignee'><option value=''>---</option><%= selected %></select>" +
				"</div>" +
			"</div>" +
			"<div class='github-issue-link'>" +
				"<a href='<%= url %>'>View issue on Github »</a>" +
			"</div>" +
		"</li>"
	),
	initialize: function(data, name) {
		this.$el = $('#' + name + '-content');
		_this = this;
		_.each(data, function(d){
			assignee = null;
			if ( undefined != d['assignee']) {
				assignee = d['assignee']['login'];
			}
			_this.selectList = new AllCollaboratorsView(assignee);
			d['selected'] = _this.selectList['select'];
			_this.model = new TaskModel(d);
			_this.render();
		});
	},
 	render: function() {
		this.$el.append(this.template(this.model.toJSON())).el;
		return this;
	},
});

var AllTasksView = Backbone.View.extend({
	el: $('body'),
	initialize: function() {},
	render: function() {
		var _this = this;
		_.each(this.collection, function(collection) {
			_.each(collection.toJSON(), function(task) {
				new SingleTaskView(task.collection, task.name);
			});
		});
		return this;
	},
});