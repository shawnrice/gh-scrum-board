var makeBoards = function(boards) {

}


var slug = (function(text) {
	  return text.toString().toLowerCase()
	    .replace(/\s+/g, '-')           // Replace spaces with -
	    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
	    .replace(/^-+/, '')             // Trim - from start of text
	    .replace(/-+$/, '');            // Trim - from end of text
});

var Collection = Backbone.Collection.extend({
    // Using the response from https://gist.github.com/1431041
    url: 'http://localhost:4000/data/bundler.json',
    initialize: function() {
      this.deferred = this.fetch();
    }
});

var Collaborators = Backbone.Collection.extend({
    url: 'http://localhost:4000/data/collaborators.json',
    initialize: function() {
      this.deferred = this.fetch();
    }
})

var View = Backbone.View.extend({
	initialize: function(options) {
		this.collaborators = options.collaborators;
		this.collection = options.collection;
	},
	assigneeTemplate: _.template(
		"<select class='assignee'>" +
		"<%= this.collabTemplate(people, assigned) %>" +
		"</select>"
 	),
	template: _.template([
		"<li class='card draggable ui-widget-content' style='background-color: #<%= color %>;'>" +
			"<p><%= title %></p>" +
			"<%= this.assigneeTemplate({collaborators: this.collabs, assigned: assigned}) %>" +
		"</li>"
	].join('')),
	collabTemplate: _.template(
   "<option value=''>---</option>" +
   "<% _.each(people, function(v, k) { %><option value='<%= v %>' <% if (assigned == v) { %>selected<% } %> ><%= v %></option><% }); %>"
	),
	collabs: [],
  states: {
  	'Needs Discussion': 'discussion',
  	'Needs Review': 'review',
  	'Needs Testing': 'testing',
  	'Started': 'started',
  	'Needs Work': 'work',
  },
  content: {
    discussion: '',
    closed: '',
    testing: '',
    review: '',
    started: '',
    work: '',
  },
  render: function() {
    var _this = this;
  	var complete = _.invoke([this.collaborators, this.collection], 'fetch');
  	$.when.apply($, complete).done(function() {
  		var data = _this.collaborators.toJSON();
	   	$.each(data, function (k, v){
    		_this.collabs.push(v['login']);
    	});
    	_this.collabs.sort();
			var data = _this.collection.toJSON();
      $.each(data, function (k, v){
      	$.each(v['labels'], function (key, val) {
      		if (_this.states[val['name']]) {
      			if ( v['assignee'] != undefined ) {
      				// assignee = '<a target="_blank" href="',
      				// 	v['assignee']['html_url'],
      				// 	'">@',
      				// 	v['assignee']['login'],
      				// 	'</a>';
      				assigned = v['assignee']['login'];
      			} else {
      				assigned = 'none';
      			}
      			people = _this.collabs;
      			color = val['color'];
      			if ( v['title'] != undefined ) {
        			_this.content[_this.states[val['name']]] += _this.template({
        				title: v['title'],
        				people: _this.collabs,
        				person: assigned,
        				color: color,
        				assigneeTemplate: _this.assigneeTemplate,
        			});
      			}
      		}
      	});
      });
      $.each(_this.content, function (k, v) {
      	$('#issues-' + k).html( v );
      });
      $('pre').html( JSON.stringify( data, '', '  ' ) );
      $( '.card' ).draggable({
      	containment: '#scrum-board',
      	// snap: true,
      	cursor: 'move',
      	connectToSortable: '.sortable',
      });
	    $( ".sortable" ).sortable({
	    	revert: true,
	    	helper: 'clone',
	    });
	    $( '.assignee' ).change(function() {
	    	alert('Assigned to "' + this.value + '"');
	    });
    });
	},
});

// // Initialize the Collection - this will call Collection.fetch()
// // in the initializer and sets its deferred object to
// // Collection.deferred()
var myCollection = new Collection();
var myCollaborators = new Collaborators();
// // Initialize the View, passing it the collection instance
var myView = new View({
    collection: myCollection,
    collaborators: myCollaborators
});

// // Call render immediately!
myView.render();

/* Using Deferreds in Backbone.js */

var LabelCollection = Backbone.Collection.extend({
    // Using the response from https://gist.github.com/1431041
    url: 'http://localhost:4000/data/labels.json',

    initialize: function() {
        // Assign the Deferred issued by fetch() as a property
        this.deferred = this.fetch();
    }
});

var LabelView = Backbone.View.extend({
  el: $('#labels'),
  // template which has the placeholder 'who' to be substitute later
  template: _.template("<div class='label' style='background-color: #<%= color %>;'><%= name %></div>"),
  // initialize: function(){
  //   this.render();
  // },
  contents: '',
  render: function() {
		var _this = this;
    this.collection.deferred.done(function() {
      var data = _this.collection.toJSON();
    	$.each(data, function (k, v){
      	_this.contents += _this.template({color: v['color'], name: v['name']});
    	});
    	_this.$el.html(_this.contents);
    });
  }
});

// Initialize the Collection - this will call Collection.fetch()
// in the initializer and sets its deferred object to
// Collection.deferred()
var myLabelCollection = new LabelCollection();

// Initialize the View, passing it the collection instance
var myLabelView = new LabelView({
    collection: myLabelCollection
});

// Call render immediately!
myLabelView.render();

// This example demonstrates the ability to retain the state
// of an AJAX request as a property of a Backbone model or
// collection. There's certaintly MORE THAN ONE WAY TO DO IT,
// but ignoring what comes with $.Deferred is ill advised!
//
// NB - Watch out for race conditions when linking Collections
// or Models with Views. eg, create all of your collections
// BEFORE creating your views, or always make your models /
// collections responsible for instantiating views.
function log( msg ){
    console.log( msg + '\t-\t' + (new Date()).getTime());
}


