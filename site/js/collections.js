////////
//////// Collections
////////

// Based on Issues
var IssueCollection = Backbone.Collection.extend({
	url: '/api/issues',
	model: IssueModel,
});
var TaskCollection = Backbone.Collection.extend({
	name: null,
	model: TaskModel,
})
// Based on Labels
var LabelCollection = Backbone.Collection.extend({
	url: '/api/labels',
	model: LabelModel,
});
var BoardCollection = Backbone.Collection.extend({
	model: LabelModel,
});
var ColumnCollection = Backbone.Collection.extend({
	model: LabelModel,
});
// Based on Collaborators
var CollaboratorsCollection = Backbone.Collection.extend({
	url: '/api/collaborators',
	model: CollaboratorModel,
});