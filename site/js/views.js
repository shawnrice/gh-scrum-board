////////
//////// Views
////////

var TabView = Backbone.View.extend({
	el: $('#ul-tabs'),
	template: _.template("<li class='tab-title'><a href='#board-<%= id %>'><%= name %></a></li>"),
	initialize: function(name, id) {
		this.name = name;
		this.id = id;
	},
	render: function() {
		this.$el.append(this.template({name: this.name, id: this.id})).el;
	}
});

var BoardView = Backbone.View.extend({
	el: $('#boards'),
	template: _.template(
		"<div id='board-<%= id %>' class='board' milestone='<%= id %>'>" +
			"<h2><%= title %></h2>" +
			"<div class='messages'></div>" +
		"</div>"
	),
	initialize: function(model) {
		this.model = new BoardModel(model.model);
		this.model = this.model.toJSON();
		var tab = new TabView(this.model.title, this.model.id);
		tab.render();
	},
	render: function() {
		var output = this.template(this.model);
		// this.$el.html(this.template(this.model.toJSON())).el;
		return output;
	}
});

var BoardsView = Backbone.View.extend({
	el: $('#boards'),
	initialize: function() {
		var _this = this;
		this.inner = '';
		_.each( _this.collection, function(model) {
			var board = new BoardView({model: model}).render();
			// console.log(board);
			_this.inner += board;
		});
	},
	render: function() {
		this.$el.html(this.inner).el;
	}
});


var CollaboratorView = Backbone.View.extend({
	template: _.template(
		"<option value='<%= login %>'<% if (login == assignee) { %> selected <% } %> >" +
			"@<%= login %>" +
		"</option>"),
	initialize: function(model, selected) {
		this.model = new CollaboratorModel(model);
		this.model.select = selected;
		this.model = this.model.toJSON();
	},
	render: function() {
		if (null != this.model.login) {
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
	// el: function() { return $('.scrum-board-canvas'); },
	template: _.template(
		"<div class='scrum-column <%= name %>' style='width: <%= width %>%; max-width: <%= width %>%; background-color: #<%= color %>; margin: 0 <%= margin %>%;'>" +
	  	"<h3><%= niceify(name.substr(12)) %></h3>" +
	  	"<hr />" +
	  	"<ul id='<%= name %>-content' class='sortable'></ul>" +
	  "</div>"),
	initialize: function(data, width, margin) {
		this.el = data.el;
		data = data.collection;
		this.model = new ColumnModel(data);
		this.model.attributes.width = width;
		this.model.attributes.margin = margin;
		this.render();
	},
	render: function() {
		this.$el.append(this.template(this.model.toJSON())).el;
		return this;
	},
});

var AllColumnsView = Backbone.View.extend({
	// el: $('#scrumboard'),
	template: _.template(
		"<div class='scrum-board-canvas'>" +
			"<div class='title'>" +
				"<h1><%= name %></h1>" +
				"<a class='add-new-task' board='<%= name %>' milestone=<%= number %> href='#'>+ new task</a>" +
			"</div>" +
		"<div class='messages'></div></div>"
	),
	setWidths: function() {
		if ( 0 == (100 % this.collection.models.length) ) {
			this.width = 100 / this.collection.models.length;
			this.margin = 0;
		} else {
			this.width = Math.floor(100 / (this.collection.models.length + 1));
			this.margin = (100 / (this.collection.models.length) ) / 10;
		}
	},
	initialize: function(data) {
		console.log('Rendering columns for "' + data.name + '"');
		this.el = data.el;
		this.collection = data.collection;
		this.setWidths();
		this.name = data.name;
		this.board = '#board-' + data.id;
		this.number = data.number;
	},
	render: function() {
		this.$el.html(this.template({id: this.board, number: this.number, name: this.name})).el;
		var _this = this;
		_.each(this.collection.toJSON(), function(column) {
			new ColumnView({el: $(_this.board).find('.scrum-board-canvas'), collection: column }, _this.width, _this.margin);
		});
	  return this;
	},
});


var SingleTaskView = Backbone.View.extend({
	template: _.template(
		"<li id='issue-<%= number %>' class='task'>" +
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
			if ( undefined != d.assignee) {
				assignee = d.assignee.login;
			}
			_this.selectList = new AllCollaboratorsView(assignee);
			d.selected = _this.selectList.select;
			d.board = d.milestone.id;
			_this.model = new TaskModel(d);
			_this.$el = $('#board-' + d.milestone.id).find('#' + name + '-content');
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